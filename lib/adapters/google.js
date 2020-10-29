const speech = require('@google-cloud/speech')

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
  transcribe: async ({ audioBuffer, mimetype, id, language }) => {
    const audio = {
      content: audioBuffer.buffer.toString('base64'),
    }
    const config = {
      encoding: mimetype === 'audio/mp3' ? 'MP3' : 'WAV',
      sampleRateHertz: audioBuffer.sampleRate,
      languageCode: language,
      enableSpeakerDiarization: true,
    }
    if (audioBuffer.numberOfChannels > 1) {
      config.audioChannelCount = audioBuffer.numberOfChannels
      config.enableSeparateRecognitionPerChannel = true
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
