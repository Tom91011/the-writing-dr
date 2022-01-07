const express = require('express')
const events = require('events')
const https = require("https")
const path = require('path')
const app = express()
const PORT = 3000
const mailchimp = require("@mailchimp/mailchimp_marketing")
const { mong } = require('./db.js');

/////////////// Route links /////////////////////
const compose = require('./routes/compose')
const articles = require('./routes/articles')
const articlesLoop = require('./routes/articles-loop')
const adminArticles = require('./routes/admin-articles')
const deleteArticle = require('./routes/delete-article')
const updateArticle = require('./routes/update-article')
const newSignupEmail = require('./routes/new-signup-email')

// Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env (e.g. keys/tokens)
require('dotenv').config() 

app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, './public')))
// app.use('/public/images/');
app.use(express.urlencoded({extended:true})) //allows posting in html/ejs forms, without it you will get ***undefined

app.get('/', (req, res) => {res.render("index")})
app.get('/about', (req, res) => {res.render("about")})
app.get('/services', (req, res) => {res.render("services")})
app.get('/contact', (req, res) => {res.render("contact")})

// these are utilising the routes folder
app.use('/articles', articles)
app.use('/articles-loop', articlesLoop)
app.use('/compose', compose)
app.use('/admin-articles', adminArticles)
app.use('/delete', deleteArticle)
app.use('/update', updateArticle)
app.use('/new-email', newSignupEmail)

//Setting up MailChimp
mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER
});
  
app.post("/failure", (req, res) => {
  const failureButton = req.body.failureButton
  res.redirect("/contact")
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})

// app.use('/', Articlecontroller);
