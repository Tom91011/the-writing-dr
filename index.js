const express = require('express')
const events = require('events')
const https = require("https")
const path = require('path')
const app = express()
const PORT = 3000
const mailchimp = require("@mailchimp/mailchimp_marketing")
const { mong } = require('./db.js');
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 10

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

// Access control code - will be moved out to own folder
 
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] })

const User = new mongoose.model("User", userSchema)

app.get("/login", function(req, res){
  res.render("login");
});
 
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = new User({
          email: req.body.username,
          password: hash
      })
  
      newUser.save(function(err) {
          if(err) {
              console.log(err);
          } else {
              res.render("index")
          }
      })
  });
})

app.post("/login", function(req, res) {
  const username = req.body.username
  const password = req.body.password

  User.findOne({email:username}, function(err, foundUser) {
      if(err) {
          console.log(err);
      } else {
          if(foundUser) {                   
              bcrypt.compare(password, foundUser.password, function(err, result) {
                  if (result === true) {
                      res.render("contact")
                  }
              })
          }
      }
  })
})

// 
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
