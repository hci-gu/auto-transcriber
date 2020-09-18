require('dotenv').config()

const app = require('express')()

app.listen(4000)

app.get('/', (_, res) => {
  res.send('OK')
})
