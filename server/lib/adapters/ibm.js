const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1')
const { IamAuthenticator } = require('ibm-watson/auth')

const { IBM_API_KEY, IBM_URL } = process.env

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: IBM_API_KEY,
  }),
  serviceUrl: IBM_URL,
})

module.exports = {
  transcribe: async (audioBuffer, mimetype) => {
    const recognizeParams = {
      audio: audioBuffer,
      contentType: mimetype,
      speakerLabels: true,
    }

    const { result } = await speechToText.recognize(recognizeParams)

    const text = result.results
      .map((data, i) => `${i + 1}\t${data.alternatives[0].transcript}`)
      .join('\n')

    console.log(JSON.stringify(result, null, 2))

    return {
      service: 'ibm',
      text,
    }
  },
}
