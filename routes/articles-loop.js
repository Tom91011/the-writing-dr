const express = require('express')
const _ = require("lodash")
const Article = require ('../controllers/Articlecontroller.js')
const router = express.Router()
const { getStartingPostion } = require ('../modules/starting-position.js')

router.get('/', (req, res) => {
  console.log("in Articles Loop");
    loadMoreClickCount = req.query.clicks
    articlesToShow = 3
    articlesCurrentlyShown += articlesToShow
    articlesLeftToShow = totalArticles - articlesCurrentlyShown
    console.log(articlesLeftToShow);
    Article.find({}, (err, foundItems) => {
      let loopArrayStartPosition = getStartingPostion(foundItems, loadMoreClickCount, articlesToShow)
      let loopArrayEndPosition = foundItems.length - articlesCurrentlyShown
      if(articlesLeftToShow <= 1) {
        loopArrayEndPosition = 1
      }
  
      res.render("articles-loop", {
        articleArray: foundItems,
        startingArticleArrayPostion: loopArrayStartPosition,
        endingArticleArrayPosition: loopArrayEndPosition,
        href:"/articles/"
      })
    })
  })

module.exports = router