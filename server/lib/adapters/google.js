const speech = require('@google-cloud/speech').v1p1beta1
const fs = require('fs')

const client = new speech.SpeechClient()

let requests = {}

module.exports = {
  transcribe: async (audioBuffer, mimetype, id) => {
    const audio = {
      content: audioBuffer.toString('base64'),
    }
    const config = {
      encoding: mimetype === 'audio/mp3' ? 'MP3' : 'WAV',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableSpeakerDiarization: true,
    }

    const [operation] = await client.longRunningRecognize({
      audio,
      config,
    })
    requests[id] = operation
  },
  getTranscription: async (id) => {
    const operation = requests[id]
    if (!operation) {
      return {
        status: 'FAILED',
      }
    }

    const status = await client.checkLongRunningRecognizeProgress(
      operation.name
    )

    if (status.latestResponse.done) {
      const response = status.result
      const text = response.results
        .map((result, i) => `${i + 1}\t${result.alternatives[0].transcript}`)
        .join('\n')

      return {
        status: 'COMPLETED',
        data: {
          text,
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
