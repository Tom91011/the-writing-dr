const express = require('express')
const events = require('events')
const https = require("https")
const path = require('path')
const app = express()
const _ = require("lodash")
const marked = require('marked')
var router = express.Router();

const { Article } = require('../models/articles')
// const { User } = require('../models/admin-user')

module.exports = Article
// module.exports = User