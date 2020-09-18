const speech = require('@google-cloud/speech').v1p1beta1
const fs = require('fs')

const client = new speech.SpeechClient()

module.exports = {
  transcribe: async (audioBytes) => {
    const audio = {
      content: audioBytes,
    }
    const config = {
      encoding: 'MP3',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableSpeakerDiarization: true,
    }

    const [response] = await client.recognize({
      audio,
      config,
    })
    const text = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n')
    return {
      text,
    }
  },
}
