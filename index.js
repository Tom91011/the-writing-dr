const express = require('express')
const path = require('path')

const app = express()
const PORT = 9090


app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, './public')))

app.get('/', (req, res) => {
  res.render("home")
})

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'pages/index.html'))
// })

// app.get('/about', (req, res) => {
//   res.sendFile(path.join(__dirname, 'pages/about.html'))
// })
//
// app.get('/blogs', (req, res) => {
//   res.sendFile(path.join(__dirname, 'pages/blogs.html'))
// })
//
// app.get('/contact', (req, res) => {
//   res.sendFile(path.join(__dirname, 'pages/contact.html'))
// })
//
// app.get('/services', (req, res) => {
//   res.sendFile(path.join(__dirname, 'pages/services.html'))
// })



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})
