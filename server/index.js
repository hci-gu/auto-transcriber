require('dotenv').config()

const app = require('express')()
const cors = require('cors')
const multer = require('multer')

const upload = multer({})

app.listen(4000)
app.use(cors())

app.get('/', (_, res) => {
  res.send('autotranscriber OK')
})

app.post('/upload', upload.single('audio'), (req, res) => {
  console.log('file uploaded', req.file)
  console.log('file uploaded', req.body)
  res.sendStatus(200)
})
