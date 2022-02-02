// const express = require('express')
// const _ = require("lodash")
// const Article = require ('../controllers/Articlecontroller.js')
// const router = express.Router()
// const { getStartingPostion } = require ('../modules/starting-position.js')
// const marked = require('marked')

// router.get('/', (req, res) => {
//   console.log("in Article admin grid");
//     Article.find({}, (err, foundItems) => {
//       articleArray = foundItems
//       res.render("admin-pages/admin-articles", {
//         articleArray: articleArray,
//         totalArticles: articleArray.length,
//         startingArticleArrayPostion: articleArray.length - 1,
//         endingArticleArrayPosition: 0,
//         href:"/admin-articles/"
//       })
//     })
//   })

// router.get("/:articleName", (req, res) => {
//     const typedTitle = _.kebabCase(_.lowerCase(req.params.articleName))
//     articleArray.forEach((post) => {
//         const storedTitle = _.kebabCase(_.lowerCase(post.title))
//       if(typedTitle ===  storedTitle) {
//         const articleContent = post.content
//         const reformatedContent = articleContent.replace(/(\r\n|\r|\n)/g, '<br>') //converts \r\n text from the DB to <br> tags
//         const markedContent = marked.parse(articleContent)
//         res.render("admin-pages/admin-article-page", {
//           title: post.title,
//           content: articleContent,
//           markedContent: markedContent,
//           date: post.date,
//           imageLink: post.image,
//           altImage: post.imageAlt,
//           articleId: post._id
//         })
//       } else {
//       }
//     })
//   })

// module.exports = router