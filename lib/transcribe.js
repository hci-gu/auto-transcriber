const uuid = require('uuid').v4
const adapters = {
  google: require('./adapters/google'),
  ibm: require('./adapters/ibm'),
  azure: require('./adapters/azure'),
  aws: require('./adapters/aws'),
}

const SERVICES = Object.keys(adapters)

let requests = {}

transcribeService = async (service, params) => {
  try {
    await adapters[service].transcribe(params)
  } catch (e) {
    requests[id][service] = {
      error: e,
    }
  }
}

const transcribe = async ({
  audio,
  mimetype,
  language,
  services,
  speakers,
}) => {
  const id = uuid()

  requests[id] = {
    services,
  }

  await Promise.all(
    SERVICES.filter((name) => services.includes(name)).map((service) =>
      transcribeService(service, { audio, mimetype, id, language, speakers })
    )
  )

  return id
}

const getTranscriptionStatus = async (id) => {
  if (!requests[id]) {
    return []
  }

  const servicesToInclude = requests[id] ? requests[id].services : SERVICES

  const services = await Promise.all(
    SERVICES.filter((name) => servicesToInclude.includes(name)).map(
      async (service) => {
        if (requests[id][service] && requests[id][service].error) {
          return {
            service,
            error: requests[id][service].error,
            status: 'FAILED',
          }
        }
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
  if (
    services.every((s) => s.status === 'COMPLETED' || s.status === 'FAILED')
  ) {
    setTimeout(() => {
      SERVICES.forEach((service) => adapters[service].clear(id))
      delete requests[id]
    }, 1000 * 60 * 15)
  }

  return services
}

module.exports = {
  transcribe,
  getTranscriptionStatus,
}
