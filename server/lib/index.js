require('dotenv').config()

const app = require('express')()
const cors = require('cors')
const multer = require('multer')
const google = require('./adapters/google')

const upload = multer({})

app.listen(4000)
app.use(cors())

app.get('/', (_, res) => {
  res.send('autotranscriber OK')
})

app.post('/upload', upload.single('audio'), async (req, res) => {
  console.log('file uploaded', req.file)
  const transcriptionResponse = await google.transcribe(
    req.file.buffer.toString('base64')
  )
  res.send(transcriptionResponse)
})
