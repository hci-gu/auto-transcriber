require('dotenv').config()

const app = require('express')()
const cors = require('cors')
const multer = require('multer')
const mm = require('music-metadata')
const archiver = require('archiver')

const { transcribe, getTranscriptionStatus } = require('./transcribe')

const upload = multer({})

app.listen(4000)
app.use(cors())

app.get('/', (_, res) => {
  res.send('autotranscriber OK')
})

app.post('/upload', upload.single('audio'), async (req, res) => {
  const {
    language = 'en-US',
    services = 'google,ibm,azure,aws',
    speakers = 2,
  } = req.query
  const { buffer, mimetype } = req.file
  console.log(buffer)

  try {
    const meta = await mm.parseBuffer(buffer, mimetype)
    console.log('meta', meta)

    const id = await transcribe({
      audio: {
        buffer,
        meta: meta.format,
      },
      mimetype,
      language,
      services: services.split(','),
      speakers,
    })

    res.send({
      id,
    })
  } catch (e) {
    res.send({ error: e.message })
  }
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
