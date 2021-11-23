const express = require('express')
const events = require('events')
const https = require("https")
const path = require('path')
const app = express()
const _ = require("lodash")
const bootstrap = typeof window !== `undefined` && import("bootstrap")
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const PORT = 8000
const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1/blogs_database';
const testimonials = require("./src/testimonials")

const promises = require("./src/promise-images")



app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, './public')))
// app.use('/public/images/');
app.use(express.urlencoded({extended:true})) //allows posting in html/ejs forms, without it you will get ***undefined
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

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

// app.get('/', (req, res) => {
//     res.render("home", )
//   })

  app.get('/', (req, res) => {
      res.sendFile(__dirname + '/views/index.html')
    })

app.get('/about', (req, res) => {
  res.render("about")
})

app.get('/services', (req, res) => {
  res.render("services")
})

let blogsToDisplay = 6

app.get('/blogs', (req, res) => {
  Blog.find({}, (err, foundItems) => {
    blogArray = foundItems
  res.render("blogs", {
      foundItems: foundItems,
      blogsToDisplay: blogsToDisplay
    })
  })
})

const myEmitter = new events.EventEmitter()

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
  newBlogForDb.save()
  res.redirect("/blogs")
})

app.get("/blogs/:blogName", (req, res) => {
  const typedTitle = _.kebabCase(_.lowerCase(req.params.blogName))

  blogArray.forEach((post) => {
    const storedTitle = _.kebabCase(_.lowerCase(post.title))

    if(typedTitle ===  storedTitle) {
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

const testimonialsArray = testimonials.getTestimonials()

let currentTestimonial = 0
const testimonialIteration = () => {
  if (currentTestimonial === testimonialsArray.length-1) {
    currentTestimonial = 0
  } else {
      currentTestimonial +=1
    }
}

setInterval(testimonialIteration,2000)

app.get('/testimonial-carousel', (req, res) => {
  res.render("carousel", {
    currentBlogReview: testimonialsArray[currentTestimonial].review,
    currentBlogReviewer: testimonialsArray[currentTestimonial].reviewer
  })
})

const promisesArray = promises.getPromises()
let currentPromise = 0
const promisesIteration = () => {
  if (currentPromise === promisesArray.length-1) {
    currentPromise = 0
  } else {
      currentPromise +=1
    }
}
setInterval(promisesIteration,3000)

app.get('/promises-carousel', (req, res) => {
  res.render("promises", {
    currentPromise: promisesArray[currentPromise].filePath,
    currentPromiseAlt: promisesArray[currentPromise].alt
  })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})
