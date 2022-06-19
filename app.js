const createError = require('http-errors');
const express = require('express');
const path = require('path');
require('dotenv').config();
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/user');
const bcrypt = require('bcryptjs');

global.appRoot = path.resolve(__dirname);
global.uploadDirectoryRelative = process.env.UPLOAD_DIRECTORY;
global.uploadDirectory = path.join(global.appRoot, process.env.UPLOAD_DIRECTORY);

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, err => { console.log("Connected to MongoDB")});

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Incorrect password" })
            }
        });
      });
    })
);
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use('/', require('./routes/index'));
app.use('/collection', require('./routes/collection'));

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    res.status(err.status || 500);
    res.render('error');
});
  
module.exports = app;