const express = require('express')
const _ = require("lodash")
const Article = require ('../controllers/Articlecontroller.js')
const router = express.Router()

router
  .route('/')
  .get((req, res) => {
    res.render("compose")
  })
  .post((req, res) => {
    const newArticle = {
      articleTitle: req.body.articleTitle,
      articleDate: req.body.articleDate,
      articleImageFilePath: req.body.articleImageFilePath,
      articleImageAlt: req.body.articleImageAlt,
      articleContent: req.body.articleContent
    }
    const newArticleForDb = new Article ({
      title: newArticle.articleTitle,
      content: newArticle.articleContent,
      date: newArticle.articleDate,
      image: newArticle.articleImageFilePath,
      imageAlt: newArticle.articleImageAlt,
      href:_.kebabCase(_.lowerCase(newArticle.articleTitle))
    })
    newArticleForDb.save()
    res.redirect("/articles")
  })

module.exports = router