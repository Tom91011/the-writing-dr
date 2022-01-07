const express = require('express')
const events = require('events')
const https = require("https")
const path = require('path')
const app = express()
const _ = require("lodash")
const marked = require('marked')
const PORT = 3000
const mailchimp = require("@mailchimp/mailchimp_marketing");
const Article = require ('./controllers/Articlecontroller.js')
const { mong } = require('./db.js');
const compose = require('./routes/compose')
const articles = require('./routes/articles')
const articlesLoop = require('./routes/articles-loop')
const adminArticles = require('./routes/admin-articles')
const deleteArticle = require('./routes/delete-article')
const { getStartingPostion } = require ('./modules/starting-position.js')
require('dotenv').config() //Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env (e.g. keys/tokens)

app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, './public')))
// app.use('/public/images/');
app.use(express.urlencoded({extended:true})) //allows posting in html/ejs forms, without it you will get ***undefined

let articleArray = []

app.get('/', (req, res) => {
    res.render("index")
  })

app.get('/about', (req, res) => {
  res.render("about")
})

app.get('/services', (req, res) => {
  res.render("services")
})

app.get('/contact', (req, res) => {
  res.render("contact")
})

app.use('/articles', articles)
app.use('/articles-loop', articlesLoop)
app.use('/compose', compose)
app.use('/admin-articles', adminArticles)
app.use('/delete', deleteArticle)

app.post("/update", (req, res) => {
  const idToBeUpdated = req.body.update
  const isHeadline = req.body.articleId
  Article.findByIdAndUpdate(idToBeUpdated, {
    title: req.body.articleTitle,
    date:req.body.articleDate,
    content: req.body.articleContent,
    image: req.body.articleImage,
    imageAlt: req.body.articleImageAlt,
    href: _.kebabCase(_.lowerCase(req.body.articleTitle))
  },
  (err, docs) => {
    if (err){
        console.log(err)
    }
    else {
        console.log(req.body.articleId);
    }
  })
  res.redirect("/articles")
})


//Setting up MailChimp
mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER
});

app.post("/new-email", (req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phone = req.body.phone;
    const listId = process.env.LIST_ID;
    //Creating an object with the users data
    const subscribingUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone
    };
    console.log(subscribingUser.phone);
    //Uploading the data to the server
    async function run() {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
        PHONE: subscribingUser.phone
        }
      });
    //If all goes well logging the contact's id and render success page
      res.sendFile(__dirname + "/success.html")
      console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
    }
    // catch statement on failed posts
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
  });
  
app.post("/failure", (req, res) => {
  const failureButton = req.body.failureButton
  res.redirect("/contact")
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})

// app.use('/', Articlecontroller);
