const express = require('express')
const path = require('path')

const app = express()
const PORT = 9090

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/index.html'))
})

app.use('/assets', express.static(path.join(__dirname, '../public')))

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})
