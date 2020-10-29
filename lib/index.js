require('dotenv').config()

const app = require('express')()
const cors = require('cors')
const multer = require('multer')
const AudioContext = require('web-audio-api').AudioContext
const context = new AudioContext()
const archiver = require('archiver')

const { transcribe, getTranscriptionStatus } = require('./transcribe')

const upload = multer({})

app.listen(4000)
app.use(cors())

app.get('/', (_, res) => {
  res.send('autotranscriber OK')
})

app.post('/upload', upload.single('audio'), (req, res) => {
  const { language, services } = req.query

  context.decodeAudioData(
    req.file.buffer,
    async (audioBuffer) => {
      audioBuffer.buffer = req.file.buffer
      const mimetype = req.file.mimetype

      const id = await transcribe({
        audioBuffer,
        mimetype,
        language,
        services: services.split(','),
      })

      res.send({
        id,
      })
    },
    (err) => {
      res.send({ error: err })
    }
  )
})

app.get('/:id/status', async (req, res) => {
  const { id } = req.params

  const services = await getTranscriptionStatus(id)
  res.send({ services })
})

app.get('/:id/download', async (req, res) => {
  const { id } = req.params
  const archive = archiver('zip')

  const services = await getTranscriptionStatus(id)
  services.forEach(({ service, data }) => {
    if (data) {
      archive.append(data.text, {
        name: `transcriptions/${service}/transcription.txt`,
      })
      archive.append(JSON.stringify(data.raw, null, 2), {
        name: `transcriptions/${service}/service_output.json`,
      })
    }
  })

  res.attachment('transcriptions.zip')
  archive.pipe(res)

  archive.finalize()
})
