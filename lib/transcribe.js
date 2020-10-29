const uuid = require('uuid').v4
const adapters = {
  google: require('./adapters/google'),
  ibm: require('./adapters/ibm'),
  azure: require('./adapters/azure'),
  aws: require('./adapters/aws'),
}

const SERVICES = Object.keys(adapters)

let requests = {}

const transcribe = async ({ audioBuffer, mimetype, language, services }) => {
  const id = uuid()

  await Promise.all(
    SERVICES.filter((name) => services.includes(name)).map((service) =>
      adapters[service].transcribe({ audioBuffer, mimetype, id, language })
    )
  )

  requests[id] = {
    services,
  }

  return id
}

const getTranscriptionStatus = async (id) => {
  const servicesToInclude = requests[id] ? requests[id].services : SERVICES

  const services = await Promise.all(
    SERVICES.filter((name) => servicesToInclude.includes(name)).map(
      async (service) => {
        const { status, data } = await adapters[service].getTranscription(id)
        return {
          service,
          status,
          data,
        }
      }
    )
  )

  // clear cached requests when all are done
  if (services.every((s) => s.status === 'COMPLETED')) {
    SERVICES.forEach((service) => adapters[service].clear())
    delete requests[id]
  }

  return services
}

module.exports = {
  transcribe,
  getTranscriptionStatus,
}
