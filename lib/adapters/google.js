const speech = require('@google-cloud/speech').v1p1beta1

const client = new speech.SpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
})

let requests = {}

module.exports = {
  transcribe: async ({ audio, mimetype, id, language, speakers }) => {
    const config = {
      encoding: mimetype === 'audio/mp3' ? 'MP3' : 'LINEAR16',
      sampleRateHertz: audio.meta.sampleRate,
      languageCode: language,
      diarizationConfig: {
        enableSpeakerDiarization: true,
        minSpeakerCount: speakers,
      },
      useEnhanced: true,
    }
    if (audio.meta.numberOfChannels > 1) {
      config.audioChannelCount = audio.meta.numberOfChannels
      config.enableSeparateRecognitionPerChannel = false
    }

    const [operation] = await client.longRunningRecognize({
      audio: {
        content: audio.buffer.toString('base64'),
      },
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
          raw: response.results,
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
