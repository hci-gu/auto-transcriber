const sdk = require('microsoft-cognitiveservices-speech-sdk')

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_KEY,
  process.env.AZURE_REGION
)
speechConfig.speechRecognitionLanguage = 'en-US'

let requests = {}

module.exports = {
  transcribe: (audioBuffer, mimetype, id) => {
    const pushStream = sdk.AudioInputStream.createPushStream(
      sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)
    )
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream)
    pushStream.write(audioBuffer)
    pushStream.close()

    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

    recognizer.recognized = (s, e) => {
      try {
        const result = JSON.parse(e.privResult.privJson)
        if (result && result.RecognitionStatus === 'Success') {
          if (!requests[id].data) requests[id].data = { text: '' }
          const length = requests[id].data.text.split('\n').length
          requests[id].data.text += `${length}\t${result.DisplayText}\n`
        }
      } catch (e) {}
    }

    recognizer.sessionStopped = () => {
      recognizer.stopContinuousRecognitionAsync()
      if (requests[id].data.text) {
        requests[id].status = 'COMPLETED'
      } else {
        requests[id].status = 'FAILED'
      }
    }

    requests[id] = {
      status: 'IN_PROGRESS',
    }

    recognizer.startContinuousRecognitionAsync()
  },
  getTranscription: (id) => {
    if (requests[id]) return requests[id]
    return {
      status: 'FAILED',
    }
  },
  clear: (id) => {
    delete requests[id]
  },
}
