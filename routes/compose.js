const express = require('express')
const _ = require("lodash")
const Blog = require ('../controllers/Blogcontroller.js')
const router = express.Router()

router
  .route('/')
  .get((req, res) => {
    res.render("compose")
  })
  .post((req, res) => {
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

module.exports = router