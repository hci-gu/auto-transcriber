const sdk = require('microsoft-cognitiveservices-speech-sdk')

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_KEY,
  process.env.AZURE_REGION
)
speechConfig.speechRecognitionLanguage = 'en-US'

module.exports = {
  transcribe: (audioBufer) => {
    return new Promise((resolve) => {
      const pushStream = sdk.AudioInputStream.createPushStream()
      const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream)
      pushStream.write(audioBufer)
      pushStream.close()

      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

      recognizer.recognizing = (s, e) => {
        console.log(`RECOGNIZING: Text=${e.result.text}`)
      }

      recognizer.recognized = (s, e) => {
        if (e.result.reason == ResultReason.RecognizedSpeech) {
          console.log(`RECOGNIZED: Text=${e.result.text}`)
        } else if (e.result.reason == ResultReason.NoMatch) {
          console.log('NOMATCH: Speech could not be recognized.')
        }
      }

      recognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`)

        if (e.reason == CancellationReason.Error) {
          console.log(`"CANCELED: ErrorCode=${e.errorCode}`)
          console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`)
          console.log('CANCELED: Did you update the subscription info?')
        }

        recognizer.stopContinuousRecognitionAsync()
      }

      recognizer.sessionStopped = (s, e) => {
        console.log('\n    Session stopped event.', s, e)
        recognizer.stopContinuousRecognitionAsync()
        resolve({
          service: 'azure',
          text: 'asdhasdjkashd',
        })
      }

      recognizer.startContinuousRecognitionAsync()
    })
  },
}
