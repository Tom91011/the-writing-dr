const express = require('express')
const path = require('path')
const app = express()
const PORT = 9090

app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, './public')))

const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1/blogs_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const Schema = mongoose.Schema;

let blogArray = []

const blogSchema = new Schema ({
  title: {
    type: String,
    maxLength: 50
  },
  content: String,
  date: String,
  image: String,
  imageAlt: String
})

const Blog = mongoose.model("Blog", blogSchema)

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
  // res.render("blogs")

  Blog.find({}, (err, foundItems) => {
    console.log(foundItems);
    blogArray = foundItems
    console.log(blogArray);
  res.render("blogs", {
      foundItems: foundItems
    })
  })
})

app.get('/contact', (req, res) => {
  res.render("contact")
})



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})
