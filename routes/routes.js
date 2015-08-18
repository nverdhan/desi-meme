var User = require('../models/user');
var passport = require('passport');

module.exports = function (app, passport) {
	/**
	* Route to get Logged in User Object
	*/
	app.post('/api/auth', function (req, res){
		res.json({'req' : req.user})
	});
	/**
	* Log in User with User Object retrieved from Client Side
	*/
	app.post('/api/login', passport.authenticate('local'), function (req, res) {
	    res.json({'req': req.user});
	});
	/**
	* Log out user and destroy Session
	*/
	app.post('/api/logout', function (req, res){
		req.logout();
		res.json({'req': req.user});
	});
	/**
	* Create Meme 
	*/
	app.get('/create', function (req, res){
		res.sendFile('www/create.html', { root: app.get('rootDir')});
	});
	/*
	*Get Tags Information
	*/
	app.get('/api/tags', function (req, res){
		var tagBody = req.query.tagName;
		res.json({'tag' : tagBody});
	});
	/**
	* Home 
	*/
	app.get('/', function (req, res){
		res.sendFile('www/index.html', { root: app.get('rootDir')});
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
