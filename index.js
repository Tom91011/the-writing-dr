const express = require('express')
const events = require('events')
const https = require("https")
const path = require('path')
const app = express()
const _ = require("lodash")
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const PORT = 3000
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
    res.sendFile(__dirname + '/views/index.html')
  })

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html')
})

app.get('/services', (req, res) => {
  res.render("services")
})

let loadMoreClickCount = 0
const blogsToShow = 6
app.get('/blogs', (req, res) => {
  loadMoreClickCount= 0
  blogArray = []
  Blog.find({}, (err, foundItems) => {
    blogArray = foundItems
    let totalBlogs = blogArray.length
  res.render("blogs", {
      blogArray: blogArray,
      totalBlogs: totalBlogs,
      startingBlogArrayPostion: getStartingPostion(foundItems, loadMoreClickCount),
      endingBlogArrayPosition: getEndingPosition(getStartingPostion(foundItems,
      loadMoreClickCount)),
      href: "/blogs/"
    })
  })
})

app.get('/blogs-loop', (req, res) => {

  loadMoreClickCount += 1
  Blog.find({}, (err, foundItems) => {
    let totalBlogs = foundItems.length
    res.render("blogs-loop", {
      blogArray: blogArray,
      totalBlogs: totalBlogs,
      startingBlogArrayPostion: getStartingPostion(foundItems, loadMoreClickCount),
      endingBlogArrayPosition: getEndingPosition(getStartingPostion(foundItems, loadMoreClickCount)),
      href:"/blogs/"
    })
  })
})

app.get('/admin-blogs', (req, res) => {
  loadMoreClickCount= 0
  blogArray = []
  Blog.find({}, (err, foundItems) => {
    blogArray = foundItems
    let totalBlogs = blogArray.length
  res.render("admin-blogs", {
      blogArray: blogArray,
      totalBlogs: totalBlogs,
      startingBlogArrayPostion: totalBlogs - 1,
      endingBlogArrayPosition: 0,
      href:"/admin-blogs/"
    })
  })
})

const getStartingPostion = (foundItems, loadMoreClickCount) => {
  let startingBlogArrayPostion = foundItems.length - (loadMoreClickCount * blogsToShow) -1
  return startingBlogArrayPostion
}

const getEndingPosition = (startingPostion) => {
  let endingPosition = startingPostion - blogsToShow + 1
  if (startingPostion < blogsToShow ) {
    endingPosition = 0
  }
  return endingPosition
}

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
    // console.log(blogArray);
    const storedTitle = _.kebabCase(_.lowerCase(post.title))
    const blogContent = post.content
    const reformatedContent = blogContent.replace(/(\r\n|\r|\n)/g, '<br>') //converts \r\n text from the DB to <br> tags

    if(typedTitle ===  storedTitle) {
      res.render("blog-page", {
        title: post.title,
        content: reformatedContent,
        date: post.date,
        imageLink: post.image,
        altImage: post.imageAlt
      })
    }
  })
})

app.get("/admin-blogs/:blogName", (req, res) => {
  const typedTitle = _.kebabCase(_.lowerCase(req.params.blogName))
  blogArray.forEach((post) => {
    const storedTitle = _.kebabCase(_.lowerCase(post.title))
    const blogContent = post.content
    const reformatedContent = blogContent.replace(/(\r\n|\r|\n)/g, '<br>') //converts \r\n text from the DB to <br> tags
    if(typedTitle ===  storedTitle) {
      res.render("admin-blog-page", {
        title: post.title,
        content: reformatedContent,
        date: post.date,
        imageLink: post.image,
        altImage: post.imageAlt,
        blogId: post._id
      })
    }
  })
})

app.post("/delete", (req, res) => {
  const idToBeDeleted = req.body.delete
  console.log(idToBeDeleted);
  Blog.findByIdAndDelete(idToBeDeleted, (err, docs) => {
    if (err) {
       console.log(err)
   }
   else {
       console.log("Deleted : ", docs);
   }
  })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})
