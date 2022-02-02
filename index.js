const express = require('express')
const _ = require("lodash")
const marked = require('marked')
const Article = require ('./controllers/Articlecontroller.js')
const User = require ('./models/admin-user')
const events = require('events')
const https = require("https")
const path = require('path')
const app = express()
const PORT = 3000
const mailchimp = require("@mailchimp/mailchimp_marketing")
const { mong } = require('./db.js');
const session = require("express-session")
const passport = require("passport")
const { getStartingPostion } = require ('./modules/starting-position.js')

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

// Access control code
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// get requests
// static pages
app.get('/', (req, res) => {
  if(req.isAuthenticated()) {    
  res.render("index")
  } else {
    console.log("not authorised as not logged in ");
    res.redirect("/login")
}
})
// app.get('/about', (req, res) => {res.render("about")})
app.get('/about', (req, res) => {
  if(req.isAuthenticated()) {    
  res.render("about")
  } else {
    console.log("not authorised as not logged in ");
    res.redirect("/login")
}
})
// app.get('/services', (req, res) => {res.render("services")})
app.get('/services', (req, res) => {
  if(req.isAuthenticated()) {    
  res.render("services")
  } else {
    console.log("not authorised as not logged in ");
    res.redirect("/login")
}
})
// app.get('/contact', (req, res) => {res.render("contact")})
app.get('/contact', (req, res) => {
  if(req.isAuthenticated()) {    
  res.render("contact")
  } else {
    console.log("not authorised as not logged in ");
    res.redirect("/login")
}
})

app.get("/login", function(req, res){
  res.render("login");
});
 
app.get("/register", function(req, res){
  res.render("register");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get('/compose', function(req, res){
  if(req.isAuthenticated()) {    
    app.use('/compose', compose)
    res.render("compose")
  } else {
      console.log("not authorised as not logged in ");
      res.redirect("/login")
  }
})

app.get('/admin-articles', function(req, res){
  if(req.isAuthenticated()) {    
    Article.find({}, (err, foundItems) => {
      console.log("in Article");
      articleArray = foundItems
      res.render("admin-pages/admin-articles", {
        test: console.log("in Article.res.render"),
        articleArray: articleArray,
        totalArticles: articleArray.length,
        startingArticleArrayPostion: articleArray.length - 1,
        endingArticleArrayPosition: 0,
        href:"/admin-articles/"
      })
    })    
  } else {
      console.log("not logged in so not authorised to view admin page");
      res.redirect("/login")
  }
})

app.get('/admin-articles/:articleName', function(req, res){
  if(req.isAuthenticated()) {    
    const typedTitle = _.kebabCase(_.lowerCase(req.params.articleName))
    articleArray.forEach((post) => {
        const storedTitle = _.kebabCase(_.lowerCase(post.title))
      if(typedTitle ===  storedTitle) {
        const articleContent = post.content
        const reformatedContent = articleContent.replace(/(\r\n|\r|\n)/g, '<br>') //converts \r\n text from the DB to <br> tags
        const markedContent = marked.parse(articleContent)
        res.render("admin-pages/admin-article-page", {
          title: post.title,
          content: articleContent,
          markedContent: markedContent,
          date: post.date,
          imageLink: post.image,
          altImage: post.imageAlt,
          articleId: post._id
        })
      } else {
      }
    })
  } else {
      console.log("not logged in so not authorised to view article admin page");
      res.redirect("/login")
  }
})

app.post("/login", passport.authenticate("local"), function(req, res){
  res.redirect("/");
});

app.post("/register", function(req, res){
  User.register({username: req.body.username}, req.body.password, function(err, user) {
      if(err) {
          console.log(err);
          res.redirect("/register")
      } else {
              passport.authenticate("local")(req, res, function(){
              res.redirect("/about")
          })
      }
  })
})
// temporarily added in index js rather than app.use(articles....) whilst the site is protected
app.get('/articles', function(req, res){
  if(req.isAuthenticated()) {   
    let headlineArticle = "61addf30f4c6b3b34388a9d5" 
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
  } else {
      console.log("not logged in so not authorised to view admin page");
      res.redirect("/login")
  }
})
// temporarily added in index js rather than app.use(articles....) whilst the site is protected
app.get('/articles/:articleName', function(req, res){
  if(req.isAuthenticated()) {    
    const typedTitle = _.kebabCase(_.lowerCase(req.params.articleName))

    articleArray.forEach((post) => {
        const storedTitle = _.kebabCase(_.lowerCase(post.title))
      if(typedTitle ===  storedTitle) {
        console.log(typedTitle);
        const articleContent = post.content
        const reformatedContent = articleContent.replace(/(\r\n|\r|\n)/g, '<br>') //converts \r\n text from the DB to <br> tags
        const markedContent = marked.parse(articleContent)
        res.render("article-page", {
          title: post.title,
          content: markedContent,
          date: post.date,
          imageLink: post.image,
          altImage: post.imageAlt
        })
      }
    })
  } else {
      console.log("not logged in so not authorised to view article admin page");
      res.redirect("/login")
  }
})

app.post("/failure", (req, res) => {
  const failureButton = req.body.failureButton
  res.redirect("/contact")
})

// these are utilising the routes folder
// app.use('/articles', articles)
app.use('/articles-loop', articlesLoop)
app.use('/delete', deleteArticle)
app.use('/update', updateArticle)
app.use('/new-email', newSignupEmail)

//Setting up MailChimp
mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER
});
  
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})

// app.use('/', Articlecontroller);
