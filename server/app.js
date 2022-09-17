const createError = require('http-errors');
const express = require('express');
const path = require('path');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();;
const session = require('express-session');
const mongoStore = require('connect-mongo');

const { NODE_ENV, MONGODB, TEMPLATE } = process.env;


const db = require('./bin/database');
const { Routes } = require('./routes');

const app = express();

var options = {
  secret: '2sd1jpwqdsiuaw2da', //zu config oder random ändern
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 3600000, //1w
  },
  store: mongoStore.create({
    mongoUrl: 'mongodb://localhost:'+MONGODB,
  })
}

if (NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  //options.cookie.secure = true // serve secure cookies
} else if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
  	res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use(logger('dev'));
  app.use(express.static(path.join(__dirname, 'emails')));
}

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb', extended: false }));
app.use(cookieParser());
app.use(session(options));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'views', TEMPLATE)));
app.use(express.static(path.resolve(__dirname, 'views', 'admin')));

app.get('/adminpanel', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'index.html'));
});

Routes(app);
app.get('*', async (req, res) => {
  res.sendFile(path.join(__dirname, 'views', TEMPLATE, 'index.html'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err);
  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
});


module.exports = app;
