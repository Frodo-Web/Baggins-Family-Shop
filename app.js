const createError = require('http-errors');
const express = require('express');
const path = require('path');
require('dotenv').config();
const logger = require('morgan');
const mongoose = require('mongoose');

global.appRoot = path.resolve(__dirname);
global.uploadDirectoryRelative = process.env.UPLOAD_DIRECTORY;
global.uploadDirectory = path.join(global.appRoot, process.env.UPLOAD_DIRECTORY);

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, err => { console.log("Connected to MongoDB")});

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

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