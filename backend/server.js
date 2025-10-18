const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Backend chạy OK!')
})

app.listen(4000, () => console.log('Server chạy tại http://localhost:4000'))
