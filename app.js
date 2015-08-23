var express = require('express');
// var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var redis = require('redis');

var multer  = require('multer');
// var upload = multer();

var redisStore = require('connect-redis')(session);

// var routes = require('./routes/index');
// var user = require('./routes/user');

var redisClient = redis.createClient();

var flash = require('connect-flash');
var port = process.env.PORT || 5000;

var passport = require('passport');
var GoodreadsStrategy = require('passport-goodreads').Strategy;

var config = {
    'session': {
      'secret': 'walterwhite'
    }
  }
  /*db connect*/
var mongoose = require('mongoose');
var configDB = require('./config/dbConfig').local;
mongoose.connect(configDB.url);

/*require models and config*/
require('./models/user');

var app = express();



// Enable CORS
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", config.allowedCORSOrigins);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
};
app.use(allowCrossDomain);

// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('config', config);
app.set('sessionStore', new redisStore({
  client: redisClient
}));
app.set('rootDir', __dirname);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));
app.use(cookieParser(config.session.secret));
// app.use(express.static(path.join(__dirname, 'www/app')));
app.set('rootDir', __dirname);
app.use(express.static(path.join(__dirname, 'www')));
app.use(express.static(path.join(__dirname, '')));

app.use(session({
  key: 'bookTrade',
  store: app.get('sessionStore'),
  secret: 'crystalmeth'
}));
app.use(flash());
require('./models/user');
require('./config/passport')(app, passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.Router());
// var routes = require('./routes/routes')(app, passport);
// app.use('/', routes);
// app.use('/user', user);
require('./routes/routes')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
var server = require('http').createServer(app).listen(port, function(req, res) {
  console.log("Magic happens on port " + port);
});

module.exports = app;