const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const articleSchema = new Schema ({
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

const Article = mongoose.model("Article", articleSchema)

module.exports = { Article }
