const express = require('express')
const events = require('events')
const https = require("https")
const path = require('path')
const app = express()
const _ = require("lodash")
const marked = require('marked')
const PORT = 3000

const Blog = require ('./controllers/Blogcontroller.js')
const { mong } = require('./db.js');

app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, './public')))
// app.use('/public/images/');
app.use(express.urlencoded({extended:true})) //allows posting in html/ejs forms, without it you will get ***undefined

let blogArray = []
let totalBlogs = 0
let loadMoreClickCount = 0
let blogsToShow = 7
let blogsCurrentlyShown = blogsToShow
let blogsLeftToShow = totalBlogs - blogsCurrentlyShown
let headlineBlog = "61addf30f4c6b3b34388a9d5"

app.get('/', (req, res) => {
    res.render("index")
  })

app.get('/about', (req, res) => {
  res.render("about")
})

app.get('/services', (req, res) => {
  res.render("services")
})


app.get('/blogs', (req, res) => {
  loadMoreClickCount= 0
  blogsToShow = 7
  blogsCurrentlyShown = blogsToShow
  let loadMoreClass = "load-more"
  let loadMoreText = "Load More"
  Blog.find({}, (err, foundItems) => {
    blogArray = foundItems
    totalBlogs = blogArray.length


  res.render("blogs", {
      headlineBlog: headlineBlog,
      blogArray: blogArray,
      totalBlogs: totalBlogs,
      startingBlogArrayPostion: getStartingPostion(foundItems, loadMoreClickCount),
      endingBlogArrayPosition: getEndingPosition(getStartingPostion(foundItems,
      loadMoreClickCount)) +1,
      href: "/blogs/",
      loadMoreClass: loadMoreClass,
      loadMoreText: loadMoreText
    })
  })
})

app.get('/blogs-loop', (req, res) => {
  blogsToShow = 6
  loadMoreClickCount += 1
  blogsCurrentlyShown += blogsToShow
  blogsLeftToShow = totalBlogs - blogsCurrentlyShown
  console.log(blogsCurrentlyShown, "currently shown");
  console.log(blogsLeftToShow, "left to show");
  Blog.find({}, (err, foundItems) => {
    // let totalBlogs = foundItems.length
    console.log(totalBlogs);
    res.render("blogs-loop", {
      blogArray: blogArray,
      totalBlogs: totalBlogs,
      startingBlogArrayPostion: getStartingPostion(foundItems, loadMoreClickCount),
      endingBlogArrayPosition: getEndingPosition(getStartingPostion(foundItems, loadMoreClickCount)),
      href:"/blogs/"
    })
  })
})

app.get('/admin-blogs', (req, res) => {
  loadMoreClickCount= 0
  blogArray = []
  Blog.find({}, (err, foundItems) => {
    blogArray = foundItems
  res.render("admin-pages/admin-blogs", {
      blogArray: blogArray,
      totalBlogs: totalBlogs,
      startingBlogArrayPostion: totalBlogs - 1,
      endingBlogArrayPosition: 0,
      href:"/admin-blogs/"
    })
  })
})

const getStartingPostion = (foundItems, loadMoreClickCount) => {
  let startingBlogArrayPostion = foundItems.length - (loadMoreClickCount * blogsToShow) - 1
  return startingBlogArrayPostion
}

const getEndingPosition = (startingPostion) => {
  let endingPosition = startingPostion - blogsToShow + 1
  if (startingPostion < blogsToShow ) {
    endingPosition = 1
  }
  return endingPosition
}

app.get('/contact', (req, res) => {
  res.render("contact")
})

app.get('/compose', (req, res) => {
  res.render("compose")
})

app.post("/compose", (req, res) => {

  const newBlog = {
    blogTitle: req.body.blogTitle,
    blogDate: req.body.blogDate,
    blogImageFilePath: req.body.blogImageFilePath,
    blogImageAlt: req.body.blogImageAlt,
    blogContent: req.body.blogContent
  }
  const newBlogForDb = new Blog ({
    title: newBlog.blogTitle,
    content: newBlog.blogContent,
    date: newBlog.blogDate,
    image: newBlog.blogImageFilePath,
    imageAlt: newBlog.blogImageAlt,
    href:_.kebabCase(_.lowerCase(newBlog.blogTitle))

  })
  newBlogForDb.save()
  res.redirect("/blogs")
})

app.get("/blogs/:blogName", (req, res) => {
  const typedTitle = _.kebabCase(_.lowerCase(req.params.blogName))

  blogArray.forEach((post) => {
      const storedTitle = _.kebabCase(_.lowerCase(post.title))
    if(typedTitle ===  storedTitle) {

      const blogContent = post.content
      const reformatedContent = blogContent.replace(/(\r\n|\r|\n)/g, '<br>') //converts \r\n text from the DB to <br> tags
      const markedContent = marked.parse(blogContent)
      res.render("blog-page", {
        title: post.title,
        content: markedContent,
        date: post.date,
        imageLink: post.image,
        altImage: post.imageAlt
      })
    }
  })
})

app.get("/admin-blogs/:blogName", (req, res) => {
  const typedTitle = _.kebabCase(_.lowerCase(req.params.blogName))
  blogArray.forEach((post) => {
      const storedTitle = _.kebabCase(_.lowerCase(post.title))
    if(typedTitle ===  storedTitle) {
      const blogContent = post.content
      const reformatedContent = blogContent.replace(/(\r\n|\r|\n)/g, '<br>') //converts \r\n text from the DB to <br> tags
      const markedContent = marked.parse(blogContent)
      res.render("admin-blog-page", {
        title: post.title,
        content: blogContent,
        markedContent: markedContent,
        date: post.date,
        imageLink: post.image,
        altImage: post.imageAlt,
        blogId: post._id
      })
    } else {
    }
  })
})

app.post("/delete", (req, res) => {
  const idToBeDeleted = req.body.delete
  console.log(idToBeDeleted);
  Blog.findByIdAndDelete(idToBeDeleted, (err, docs) => {
    if (err) {
       console.log(err)
   }
   else {
       console.log("Deleted : ", docs);
   }
  })
  setTimeout(() => {res.redirect("/blogs")},1000)
})

app.post("/update", (req, res) => {
  const idToBeUpdated = req.body.update
  const isHeadline = req.body.blogId
  Blog.findByIdAndUpdate(idToBeUpdated, {
    title: req.body.blogTitle,
    date:req.body.blogDate,
    content: req.body.blogContent,
    image: req.body.blogImage,
    imageAlt: req.body.blogImageAlt,
    href: _.kebabCase(_.lowerCase(req.body.blogTitle))
  },
  (err, docs) => {
    if (err){
        console.log(err)
    }
    else {
        console.log(req.body.blogId);
    }
  })
  res.redirect("/blogs")
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})

// app.use('/', Blogcontroller);
