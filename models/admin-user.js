const express = require('express')
const mongoose = require('mongoose')
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
  
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("User", userSchema)

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports =  User 
