const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1')
const { IamAuthenticator } = require('ibm-watson/auth')

const { IBM_API_KEY, IBM_URL } = process.env

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: IBM_API_KEY,
  }),
  serviceUrl: IBM_URL,
})

let requests = {}

module.exports = {
  transcribe: async ({ audioBuffer, mimetype, id, language }) => {
    const params = {
      audio: audioBuffer.buffer,
      contentType: mimetype,
      speakerLabels: true,
    }

    try {
      const { result } = await speechToText.createJob(params)
      requests[id] = result
    } catch (e) {
      console.log(e)
    }
  },
  getTranscription: async (id) => {
    let result
    try {
      const response = await speechToText.checkJob({ id: requests[id].id })
      result = response.result
    } catch (error) {
      console.log(error)
      return {
        status: 'FAILED',
      }
    }

    if (result && result.status === 'completed') {
      let texts = []
      if (result.results[0] && result.results[0].results) {
        texts = result.results[0].results
      } else if (result.results && result.results[0].alternatives) {
        texts = result.results
      }

      const text = texts
        .map((data, i) => {
          if (data.alternatives && data.alternatives[0]) {
            return `${i + 1}\t${data.alternatives[0].transcript}`
          }
        })
        .join('\n')

      return {
        status: 'COMPLETED',
        data: {
          text,
          raw: texts,
        },
      }
    }

    return {
      status: 'IN_PROGRESS',
    }
  },
  clear: (id) => {
    delete requests[id]
  },
}
