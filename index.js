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
require('dotenv').config() //Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env (e.g. keys/tokens)

app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, './public')))
// app.use('/public/images/');
app.use(express.urlencoded({extended:true})) //allows posting in html/ejs forms, without it you will get ***undefined


let articleArray = []
let totalArticles = 0
let articlesToShow = 4
let articlesCurrentlyShown = articlesToShow
let articlesLeftToShow = totalArticles - articlesCurrentlyShown
let headlineArticle = "61addf30f4c6b3b34388a9d5"

app.get('/', (req, res) => {
    res.render("index")
  })

app.get('/about', (req, res) => {
  res.render("about")
})

app.get('/services', (req, res) => {
  res.render("services")
})

app.get('/articles', (req, res) => {
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

app.get('/articles-loop', (req, res) => {
  loadMoreClickCount = req.query.clicks
  console.log(loadMoreClickCount);
  articlesToShow = 3
  articlesCurrentlyShown += articlesToShow
  articlesLeftToShow = totalArticles - articlesCurrentlyShown
  // console.log(articlesCurrentlyShown, "currently shown");
  // console.log(articlesLeftToShow, "left to show");
  Article.find({}, (err, foundItems) => {
    // console.log(foundItems);
    res.render("articles-loop", {
      articleArray: articleArray,
      totalArticles: totalArticles,
      startingArticleArrayPostion: getStartingPostion(foundItems, loadMoreClickCount),
      endingArticleArrayPosition: getEndingPosition(getStartingPostion(foundItems, loadMoreClickCount)),
      href:"/articles/"
    })
  })
})

app.get('/admin-articles', (req, res) => {
  loadMoreClickCount= 0
  articleArray = []
  // const data = getArticles()
  let data = 
  Article.find({}, (err, items) => {
    data = items
    // console.log(data);
  });
  setTimeout(() => {console.log(data);},1000)

  Article.find({}, (err, foundItems) => {
    articleArray = foundItems
    res.render("admin-pages/admin-articles", {
      articleArray: articleArray,
      totalArticles: totalArticles,
      startingArticleArrayPostion: totalArticles - 1,
      endingArticleArrayPosition: 0,
      href:"/admin-articles/"
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

app.get('/contact', (req, res) => {
  res.render("contact")
})

// use the compose.js file to handle the compose endpoint
app.use('/compose', compose)



app.get("/articles/:articleName", (req, res) => {
  const typedTitle = _.kebabCase(_.lowerCase(req.params.articleName))

  articleArray.forEach((post) => {
      const storedTitle = _.kebabCase(_.lowerCase(post.title))
    if(typedTitle ===  storedTitle) {

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
})

app.get("/admin-articles/:articleName", (req, res) => {
  const typedTitle = _.kebabCase(_.lowerCase(req.params.articleName))
  articleArray.forEach((post) => {
      const storedTitle = _.kebabCase(_.lowerCase(post.title))
    if(typedTitle ===  storedTitle) {
      const articleContent = post.content
      const reformatedContent = articleContent.replace(/(\r\n|\r|\n)/g, '<br>') //converts \r\n text from the DB to <br> tags
      const markedContent = marked.parse(articleContent)
      res.render("admin-article-page", {
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
})

app.post("/delete", (req, res) => {
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
