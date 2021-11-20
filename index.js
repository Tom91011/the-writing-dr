const express = require('express')
const https = require("https")
const path = require('path')
const app = express()
const _ = require("lodash")
const PORT = 9090
const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1/blogs_database';


app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, './public')))
// app.use('/public/images/');
app.use(express.urlencoded({extended:true})) //allows posting in html/ejs forms, without it you will get ***undefined

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
  imageAlt: String,
  href: String
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
    // console.log(foundItems);
    blogArray = foundItems
    // console.log(blogArray);
  res.render("blogs", {
      foundItems: foundItems
    })
  })
})

app.get('/contact', (req, res) => {
  res.render("contact")
})

app.get('/compose', (req, res) => {
  res.render("compose")
})

app.post("/compose", (req, res) => {

  const newBlog = {
    blogTitle: req.body.blogTitle,
    blogDate: req.body.blogDate,
    blogImageFilePath: req.body.blogImageFilePath,
    blogImageAlt: req.body.blogImageAlt,
    blogContent: req.body.blogContent
  }
  const newBlogForDb = new Blog ({
    title: newBlog.blogTitle,
    content: newBlog.blogContent,
    date: newBlog.blogDate,
    image: newBlog.blogImageFilePath,
    imageAlt: newBlog.blogImageAlt,
    href:_.kebabCase(_.lowerCase(newBlog.blogTitle))
  })
  console.log(newBlogForDb);
  newBlogForDb.save()
  res.redirect("/blogs")
})


app.get("/blogs/:blogName", (req, res) => {
  const typedTitle = _.kebabCase(_.lowerCase(req.params.blogName))
  // console.log(req.params);
  // console.log(typedTitle);

  blogArray.forEach((post) => {
    const storedTitle = _.kebabCase(_.lowerCase(post.title))
    // console.log(post);
    // console.log(storedTitle);
    if(typedTitle ===  storedTitle) {
      console.log(storedTitle);
      console.log(typedTitle);
      res.render("blog-page", {
        title: post.title,
        content: post.content,
        date: post.date,
        imageLink: post.image,
        altImage: post.imageAlt

        })
    }
  })
})


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})
