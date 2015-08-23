var Tag = require('../models/tag');
var Meme = require('../models/meme');
var User = require('../models/user');
var savedImg = require('../models/savedImg');
var passport = require('passport');

var multer  = require('multer')
// var upload = multer({ 
// 	dest: 'uploads/', 
// 	rename : 'asd'
// })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	console.log(123)
    cb(null, '../memes/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname)
  }
});
var upload = multer({ storage: storage })


require('./addToDB'); // adds default values to database

module.exports = function(app, passport) {
		/**
		 * Route to get Logged in User Object
		 */
		app.post('/api/auth', function(req, res) {
			res.json({
				'req': req.user
			})
		});
		/**
		 * Log in User with User Object retrieved from Client Side
		 */
		app.post('/api/login', passport.authenticate('local'), function(req, res) {
			res.json({
				'req': req.user
			});
		});
		/**
		 * Log out user and destroy Session
		 */
		app.post('/api/logout', function(req, res) {
			req.logout();
			res.json({
				'req': req.user
			});
		});
		/**
		 * Create Meme 
		 */
		app.get('/create', function(req, res) {
			res.sendFile('www/create.html', {
				root: app.get('rootDir')
			});
		});
		/*
		 *Get Tags Information
		 */
		app.get('/api/tags', function(req, res) {
			var tagName = req.query.tagName;
			Tag.getSimilarTags(tagName, function(err, tags) {
				res.json({
					'tag': tags
				});
			});
		});
		app.get('/api/search', function(req, res) {
			var searchString = req.query.searchString;
			var page = req.query.page;
			savedImg.getImgById(parseInt(searchString), function(err, imgpath) {
				console.log(imgpath);
			});
		});
		app.post('/api/upload', upload.single('file'), function (req, res, next){
			res.json({filename : req.file.filename});
		});
		app.post('/api/upload2', function (req, res){
			var filename = Date.now();
			var base64Data = req.body.file.replace(/^data:image\/jpeg;base64,/, "");
			require("fs").writeFile("uploads/"+filename+".jpeg", base64Data, 'base64', function(err) {
			  console.log(err);
			});
		});
		/**
		 * Home 
		 */
		app.get('/', function(req, res) {
			res.sendFile('www/index.html', {
				root: app.get('rootDir')
			});
		});
	}
	// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}