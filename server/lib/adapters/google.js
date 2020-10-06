const speech = require('@google-cloud/speech').v1p1beta1
const fs = require('fs')

const client = new speech.SpeechClient()

module.exports = {
  transcribe: async (audioBuffer, mimetype) => {
    const audio = {
      content: audioBuffer.toString('base64'),
    }
    const config = {
      encoding: mimetype === 'audio/mp3' ? 'MP3' : 'WAV',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableSpeakerDiarization: true,
    }

    const [response] = await client.recognize({
      audio,
      config,
    })
    const text = response.results
      .map((result, i) => `${i + 1}\t${result.alternatives[0].transcript}`)
      .join('\n')
    return {
      service: 'google',
      text,
    }
  },
}
