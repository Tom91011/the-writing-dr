require('dotenv').config() 

const mongoose = require('mongoose')
// const mongoDB = 'mongodb://127.0.0.1/articles_database';
const mongoDB = process.env.MONGODB_DATABASE_ACCESS

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

