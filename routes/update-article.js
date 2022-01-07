const express = require('express')
const _ = require("lodash")
const Article = require ('../controllers/Articlecontroller.js')
const router = express.Router()

router.post("/", (req, res) => {
    const idToBeUpdated = req.body.update
    const isHeadline = req.body.articleId
    Article.findByIdAndUpdate(idToBeUpdated, {
      title: req.body.articleTitle,
      date:req.body.articleDate,
      content: req.body.articleContent,
      image: req.body.articleImage,
      imageAlt: req.body.articleImageAlt,
      href: _.kebabCase(_.lowerCase(req.body.articleTitle))
    },
    (err, docs) => {
      if (err){
          console.log(err)
      }
      else {
          console.log(req.body.articleId);
      }
    })
    res.redirect("/articles")
  })

  module.exports = router