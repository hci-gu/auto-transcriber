const uuid = require('uuid').v4
const adapters = {
  google: require('./adapters/google'),
  ibm: require('./adapters/ibm'),
  azure: require('./adapters/azure'),
  aws: require('./adapters/aws'),
}

const STATUS = {
  CREATED: 'CREATED',
  INPROGRESS: 'INPROGRESS',
  FINISHED: 'COMPLETED',
  FAILED: 'FAILED',
}
const SERVICES = Object.keys(adapters)

const transcribe = async (audioBuffer, mimetype) => {
  const id = uuid()

  await Promise.all(
    SERVICES.map((service) =>
      adapters[service].transcribe(audioBuffer, mimetype, id)
    )
  )

  return id
}

const getTranscriptionStatus = async (id) => {
  const services = await Promise.all(
    SERVICES.map(async (service) => {
      const { status, data } = await adapters[service].getTranscription(id)
      return {
        service,
        status,
        data,
      }
    })
  )

  // clear cached requests when all are done
  if (services.every((s) => s.status === 'COMPLETED')) {
    SERVICES.forEach((service) => adapters[service].clear())
  }

  return services
}

module.exports = {
  transcribe,
  getTranscriptionStatus,
}
