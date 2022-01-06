const express = require('express')
const _ = require("lodash")
const Article = require ('../controllers/Articlecontroller.js')
const router = express.Router()

router.get('/articles', (req, res) => {
    articlesToShow = 3
    articlesCurrentlyShown = articlesToShow
    let loadMoreClass = "load-more"
    let loadMoreText = "Load More"
  
    Article.find({}, (err, foundItems) => {
      console.log("starting postion is " + getStartingPostion(foundItems, 0))
      console.log(foundItems.length);
      articleArray = foundItems
      totalArticles = articleArray.length
    res.render("articles", {
        headlineArticle: headlineArticle,
        articleArray: articleArray,
        totalArticles: totalArticles,
        startingArticleArrayPostion: getStartingPostion(foundItems, 0),
        endingArticleArrayPosition: getEndingPosition(getStartingPostion(foundItems,
        0)) ,
        href: "/articles/",
        loadMoreClass: loadMoreClass,
        loadMoreText: loadMoreText
      })
    })
  })

  const getStartingPostion = (foundItems, loadMoreClickCount) => {
    let startingArticleArrayPostion = foundItems.length - (loadMoreClickCount * articlesToShow) - 1
    return startingArticleArrayPostion
  }
  
  const getEndingPosition = (startingPostion) => {
    let endingPosition = startingPostion - articlesToShow + 1
    if (startingPostion < articlesToShow ) {
      endingPosition = 1
    }
    return endingPosition
  }

module.exports = router