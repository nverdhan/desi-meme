var Tag = require('../models/tag');
// var Meme = require('../models/meme');
var Meme = require('../models/meme');
var User = require('../models/user');
var passport = require('passport');

// Create tags
var createTag;
var tagNames = ['hot', 'sexy', 'dude', 'nv', 'mongo', 'walter', 'white', 'x', 'xx', 'xxx', 'django', 'xango', 'alpha', 'charlie', 'bravo', 'delta', 'omega', 'phi', 'chi', 'omicron', 'beta', 'gamma', 'superman', 'dark knight', 'anil kapoor', 'bond', 'guchhu', 'nero']
for (var i = 0; i < tagNames.length; i++) {
	createTag = new Tag({
		_id: i,
		name: tagNames[i]
	})
	createTag.save(function(err) {
		if (err) return handleError(err);
	})
};
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
			// res.json({
			// 	'tag': tagName
			// });
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