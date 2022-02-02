const express = require('express')
const _ = require("lodash")
const Article = require ('../controllers/Articlecontroller.js')
const router = express.Router()
const { getStartingPostion } = require ('../modules/starting-position.js')
const marked = require('marked')

let headlineArticle = "61addf30f4c6b3b34388a9d5"

// router.get('/', (req, res) => {
//   articlesToShow = 3
//   articlesCurrentlyShown = articlesToShow
 
//   let loadMoreClass = "load-more"
//   let loadMoreText = "Load More"

//   Article.find({}, (err, foundItems) => {
//     articleArray = foundItems
//     totalArticles = articleArray.length
//     articlesLeftToShow = totalArticles - articlesCurrentlyShown
//     console.log(articlesLeftToShow);
//   res.render("articles", {
//       headlineArticle: headlineArticle,
//       articleArray: articleArray,
//       totalArticles: totalArticles,
//       startingArticleArrayPostion: getStartingPostion(foundItems, 0, articlesToShow),
//       endingArticleArrayPosition: foundItems.length - articlesToShow ,
//       href: "/articles/",
//       loadMoreClass: loadMoreClass,
//       loadMoreText: loadMoreText
//     })
//   })
// })

// router.get("/:articleName", (req, res) => {
//   const typedTitle = _.kebabCase(_.lowerCase(req.params.articleName))

//   articleArray.forEach((post) => {
//       const storedTitle = _.kebabCase(_.lowerCase(post.title))
//     if(typedTitle ===  storedTitle) {

//       const articleContent = post.content
//       const reformatedContent = articleContent.replace(/(\r\n|\r|\n)/g, '<br>') //converts \r\n text from the DB to <br> tags
//       const markedContent = marked.parse(articleContent)
//       res.render("article-page", {
//         title: post.title,
//         content: markedContent,
//         date: post.date,
//         imageLink: post.image,
//         altImage: post.imageAlt
//       })
//     }
//   })
// })

module.exports = router