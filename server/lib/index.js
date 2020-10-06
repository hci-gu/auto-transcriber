require('dotenv').config()

const app = require('express')()
const cors = require('cors')
const multer = require('multer')
const { transcribe, getTranscriptionStatus } = require('./transcribe')

const upload = multer({})

app.listen(4000)
app.use(cors())

app.get('/', (_, res) => {
  res.send('autotranscriber OK')
})

app.post('/upload', upload.single('audio'), async (req, res) => {
  console.log('file uploaded', req.file)
  const buffer = req.file.buffer
  const mimetype = req.file.mimetype
  const id = await transcribe(buffer, mimetype)

  res.send({
    id,
  })
})

app.get('/:id/status', async (req, res) => {
  const { id } = req.params

  const services = await getTranscriptionStatus(id)
  res.send({ services })
})
