const express = require('express')
const _ = require("lodash")
const Article = require ('../controllers/Articlecontroller.js')
const router = express.Router()
const { getStartingPostion } = require ('../modules/starting-position.js')
const marked = require('marked')


router.post("/", (req, res) => {
    const idToBeDeleted = req.body.delete
    console.log(idToBeDeleted);
    Article.findByIdAndDelete(idToBeDeleted, (err, docs) => {
      if (err) {
         console.log(err)
     }
     else {
         console.log("Deleted : ", docs);
     }
    })
    setTimeout(() => {res.redirect("/articles")},1000)
  })

  module.exports = router