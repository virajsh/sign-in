var createError = require('http-errors');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
var admin = require('./routes/admin');
var express = require('express');

var auth = require('./middleware/auth');
var session = require('express-session');
var validator = require('express-validator');
mongoose.connect("mongodb://127.0.0.1.27017/portfolio1",function(e){
console.log("Now connected...");
});



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'top secret',
	saveUninitialized: false,
	resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 1000 }
}));

app.use(validator());
app.use(auth.authenticated);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', auth.authenticate,admin);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
