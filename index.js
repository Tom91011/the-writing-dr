const express = require('express')
const path = require('path')

const app = express()
const PORT = 9090


app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, './public')))


app.get('/', (req, res) => {
  res.render("home")
})

app.get('/about', (req, res) => {
  res.render("about")
})

app.get('/services', (req, res) => {
  res.render("services")
})

app.get('/blogs', (req, res) => {
  res.render("blogs")
})

app.get('/contact', (req, res) => {
  res.render("contact")
})



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})
