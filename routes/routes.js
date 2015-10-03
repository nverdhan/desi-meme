var Tag = require('../models/tag');
var Meme = require('../models/meme');
var User = require('../models/user');
var savedImg = require('../models/savedImg');
var passport = require('passport');
var baseUrl = 'http://127.0.0.1:3000/';
var multer = require('multer')
	// var upload = multer({ 
	// 	dest: 'uploads/', 
	// 	rename : 'asd'
	// })
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		console.log(123)
		cb(null, 'uploads')
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + file.originalname)
	}
});
var upload = multer({
	storage: storage
})


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
			savedImg.getImgBySearchStr(searchString, function(err, imgs) {
				res.json({
					imgs: imgs
				});
			});
		});
		app.get('/memes/:id', function(req, res) {
			var _id = req.params.id;
			var mongoose = require('mongoose');
			if(mongoose.Types.ObjectId.isValid(_id)){
				Meme.findByID(_id, function(err, meme){
				if(meme.length != 0){
					var pageUrl = baseUrl+'memes/'+meme[0]._id;
					var picUrl = baseUrl+meme[0].path;
					res.render('memeone', {
						meme: meme[0],
						pageUrl: pageUrl,
						picUrl: picUrl
					});
				}else{
					console.log('aaa');
					res.status(404).send('Not found');
				}
				
				});
			}else{
				res.status(404).send('Not found');
			}
			
		});
		app.get('/memes', function(req, res, next) {

		  Meme.paginate({}, { page: req.query.page, limit: req.query.limit }, function(err, memes, pageCount, itemCount) {
		    if (err) return next(err);
		    res.format({
		      html: function() {
		        res.render('memes', {
		          memes: memes,
		          baseUrl: baseUrl,
		          pageCount: pageCount,
		          itemCount: itemCount
		        });
		      },
		      json: function() {
		        // inspired by Stripe's API response for list objects
		        res.json({
		          object: 'list',
		          has_more: paginate.hasNextPages(req)(pageCount),
		          data: memes
		        });
		      }
		    });

		  });

		});
		app.post('/api/upload', upload.single('file'), function(req, res, next) {
			res.json({
				filename: req.file.filename
			});
		});
		app.post('/api/upload2', function(req, res) {
			var filepath = 'uploads/';
			var filename = Date.now();
			var base64Data = req.body.file.replace(/^data:image\/jpeg;base64,/, "");
			title = req.body.tags;
			tags = req.body.title;
			var memeObj = {
				title: req.body.title,
				tags: req.body.tags,
				path: filepath+filename+'.jpeg',
				ifSave: !req.body.doNotSave
			};
			require("fs").writeFile(filepath + filename + ".jpeg", base64Data, 'base64', function(err) {
				if(err){
					console.log(err);
				}
				Meme.saveMeme(memeObj, function(err) {
					res.json({
						fileurl: memeObj.path
					});
				})
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