const sdk = require('microsoft-cognitiveservices-speech-sdk')

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_KEY,
  process.env.AZURE_REGION
)
speechConfig.speechRecognitionLanguage = 'en-US'

let requests = {}

module.exports = {
  transcribe: ({ audioBuffer, mimetype, id, language }) => {
    const pushStream = sdk.AudioInputStream.createPushStream(
      sdk.AudioStreamFormat.getWaveFormatPCM(
        audioBuffer.sampleRate,
        16,
        audioBuffer.numberOfChannels
      )
    )
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream)
    pushStream.write(audioBuffer.buffer)
    pushStream.close()

    speechConfig.speechRecognitionLanguage = language
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

    recognizer.recognized = (s, e) => {
      try {
        const result = JSON.parse(e.privResult.privJson)
        console.log('result', result)
        if (result && result.RecognitionStatus === 'Success') {
          if (!requests[id].data) requests[id].data = { text: '', raw: [] }
          const length = requests[id].data.text.split('\n').length
          requests[id].data.text += `${length}\t${result.DisplayText}\n`
          requests[id].data.raw = [...requests[id].data.raw, result]
        }
      } catch (e) {
        console.log('azureError')
        console.log(e)
      }
    }

    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`)

      if (e.errorCode !== 0) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`)
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`)
        console.log('CANCELED: Did you update the subscription info?')
        requests[id].status = 'FAILED'
        recognizer.stopContinuousRecognitionAsync()
      }
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
