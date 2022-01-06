const express = require('express')
const _ = require("lodash")
const Article = require ('../controllers/Articlecontroller.js')
const router = express.Router()
const { getStartingPostion } = require ('../modules/starting-position.js')

let headlineArticle = "61addf30f4c6b3b34388a9d5"

router.get('/', (req, res) => {
  articlesToShow = 3
  articlesCurrentlyShown = articlesToShow
 
  let loadMoreClass = "load-more"
  let loadMoreText = "Load More"

  Article.find({}, (err, foundItems) => {
    articleArray = foundItems
    totalArticles = articleArray.length
    articlesLeftToShow = totalArticles - articlesCurrentlyShown
    console.log(articlesLeftToShow);
  res.render("articles", {
      headlineArticle: headlineArticle,
      articleArray: articleArray,
      totalArticles: totalArticles,
      startingArticleArrayPostion: getStartingPostion(foundItems, 0, articlesToShow),
      endingArticleArrayPosition: foundItems.length - articlesToShow ,
      href: "/articles/",
      loadMoreClass: loadMoreClass,
      loadMoreText: loadMoreText
    })
  })
})

  // const getStartingPostion = (foundItems, loadMoreClickCount) => {
  //   let startingArticleArrayPostion = foundItems.length - (loadMoreClickCount * articlesToShow) - 1
  //   return startingArticleArrayPostion
  // }
  
  // const getEndingPosition = (startingPostion) => {
  //   let endingPosition = startingPostion - articlesToShow + 1
  //   if (startingPostion < articlesToShow ) {
  //     endingPosition = 1
  //   }
  //   return endingPosition
  // }

module.exports = router