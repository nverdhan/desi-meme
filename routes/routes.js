var Tag = require('../models/tag');
var Meme = require('../models/meme');
var User = require('../models/user');
var savedImg = require('../models/savedImg');
var passport = require('passport');
var baseUrl = 'http://www.shudhdesimemes.com/';
var multer = require('multer');
	// var upload = multer({ 
	// 	dest: 'uploads/', 
	// 	rename : 'asd'
	// })
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'savedimgs')
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + file.originalname)
	}
});
var upload = multer({
	storage: storage
})
var getTopTags = function(limit, cb) {
	Tag.getTop(limit, function(tags){
		var topTagList = [];
		for (var i = 0; i < tags.length; i++) {
			topTagList.push({
							link: baseUrl + 'tag/' + tags[i].name,
							usage: tags[i].usage,
							name: tags[i].name
						});
		};
		cb(topTagList);
	})
}
var updateTagsInMemes = function(memes, cb) {
	if(memes.length!=0){
		var updatedMemes = [];
		var updateLen = 0;
		for (var j = 0; j < memes.length; j++) {
			Tag.populateMeme(baseUrl, memes[j], function(meme){
				updatedMemes.push(meme);
				updateLen++;
				if(updateLen == memes.length){
					cb(updatedMemes);
				}
			})
		}
	}else{
		cb([]);
	}
}
var updateUserInMemes = function(memes, cb) {
	if(memes.length!=0){
		var updatedMemes = [];
		var updateLen = 0;
		for (var i = 0; i < memes.length; i++) {
			User.populateMeme(memes[i], function(meme){
				updatedMemes.push(meme);
				updateLen++;
				if(updateLen == memes.length){
					cb(updatedMemes);
				}
			})
		}
	}else{
		cb([]);
	}
}
require('./addToDB'); // adds default values to database

module.exports = function(app, passport) {
		/**
		 * Route to get Logged in User Object
		 */
		app.post('/api/auth', function(req, res) {
			if(req.user){
				res.json({
					'userfb': req.user.facebook
				});
			}else{
				res.json({'userfb' : null});
			}
			
		});
		/**
		 * Log in User with User Object retrieved from Client Side
		 */
		// app.post('/api/login', passport.authenticate('local'), function(req, res) {
		// 	res.json({
		// 		'req': req.user
		// 	});
		// });
		/**
		 * Log out user and destroy Session
		 */
		app.post('/api/logout', function(req, res) {
			req.logout();
			res.json({
				'userfb': req.user
			});
		});

		app.get('/api/logout', function(req,res) {
			var url = req.query.url;
			req.logout();
			if(url){
				res.redirect(url);
			}else{
				res.redirect('/');
			}
		})

		app.post('/api/testuser', function(req, res) {

			var id = req.user.id;
			console.log(id);
			User.findByID(id, function(err, user){
				if(err) console.log(err);

				console.log(user);
				res.json({'user': user});
			});
		});

		app.get('/hotmemes', function(req, res) {
			Meme.hot(3, function(memes){
				res.json(memes);
			})
		})
		/**
		 * Create Meme 
		 */
		app.get('/create', function(req, res) {
			res.sendFile('www/create.html', {
				root: app.get('rootDir')
			});
		});

		app.get('/facebook-login-required', function(req, res) {
			if (req.isAuthenticated()){
				res.redirect('/');
			}else{
				res.render('fbloginreq');
			}
		});

		app.get('/privacy-policy', function(req, res) {
			if(req.user){
				var user = req.user.facebook;
			}else{
				var user = false;
			}
			res.render("privacypolicy",{
				user: user
			});
		});
		app.get('/terms-of-use', function(req, res) {
			if(req.user){
				var user = req.user.facebook;
			}else{
				var user = false;
			}
			res.render("termsofuse",{
				user: user
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
		app.get('/mymemes', isLoggedIn, function(req,res){
			var slug = req.user.slug;
			res.redirect('/user/'+slug);
		})
		app.get('/user/:slug', function(req,res) {
			var slug = req.params.slug;
			User.findBySlug(slug, function(err, user){
				if(err) console.log(err);
				// console.log(user);
				if(user[0]){
					var user = user[0];
					if(req.user && req.user._id.equals(user._id)){
							var loggedin = true;
						}else{
							var loggedin = false;
						}
						var memeIds = [];
						var memeviews = 0;
						for (var i = 0; i < user._memes.length; i++) {
							memeIds.push(user._memes[i].meme);
						};
						Meme.paginate({
							_id: {$in: memeIds}
						}, { page: req.query.page, limit: req.query.limit , sortBy: {createdAt: -1} }, function(err, memes, pageCount, itemCount) {
						    if (err) return next(err);
						    updateTagsInMemes(memes, function(updatedMemes){
							    getTopTags(10, function(toptags){
			    					Meme.hot(10, function(hotmemes){
			    						updateUserInMemes(hotmemes, function(hotmemes){
									    	res.format({
										      html: function() {
										      	if(req.user){
													var loggedinuser = req.user.facebook;
												}else{
													var loggedinuser = false;
												}
										        res.render('userpage', {
										          memes: updatedMemes,
										          baseUrl: baseUrl,
										          picBaseUrl: "http://www.edroot.com/shudhdesimemes/images/",
										          pageCount: pageCount,
										          itemCount: itemCount,
										          loggedin: loggedin,
										          loggedinuser: loggedinuser,
										          toptags: toptags,
										          hotmemes: hotmemes,
										          user: user
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
									})
							    });
							});
						});					
				}
			})
		});
		app.get('/memes/:slug', function(req, res) {
			var slug = req.params.slug;
			Meme.findBySlug(slug, function(err, meme){
			if(meme.length != 0){
				// console.log(meme[0].createdAt);
				meme[0].views++;
				meme[0].save(function(err){
					if(err) console.log(err);
				})
				var pageUrl = baseUrl+meme[0].link;
				var picUrl = meme[0].path;
				var memeTags = [];
				var updateMemeTags = function(tag){
					memeTags.push(tag);
				}
				Tag.findByMeme(meme[0], function(err, tags){
					for (var i = 0; i < tags.length; i++) {
						updateMemeTags({
							        	link: baseUrl+'tag/'+tags[i].name,
							        	name: tags[i].name
									});
					}
					getTopTags(10, function(toptags){
						User.populateMeme(meme[0], function(meme){
							Meme.hot(10, function(hotmemes){
			    				updateUserInMemes(hotmemes, function(hotmemes){
									if(req.user){
										var loggedinuser = req.user.facebook;
									}else{
										var loggedinuser = false;
									}
									res.render('memeone', {
										meme: meme,
										pageUrl: pageUrl,
										picUrl: picUrl,
										tags: memeTags,
										toptags: toptags,
										hotmemes: hotmemes,
										loggedinuser: loggedinuser
									});
								});
			    			});
						});
					})
				});
			}else{
				res.status(404).send('Not found');
			}
			
			});
		});
		app.get('/', function(req, res, next) {
		  Meme.paginate({}, { page: req.query.page, limit: req.query.limit, sortBy: {createdAt: -1} }, function(err, memes, pageCount, itemCount) {
		    if (err) return next(err);
		    updateTagsInMemes(memes, function(updatedMemes){
		    	updateUserInMemes(updatedMemes, function(updatedMemes){
			    	getTopTags(10, function(toptags){
			    		Meme.hot(10, function(hotmemes){
			    			console.log(hotmemes);
			    			updateUserInMemes(hotmemes, function(hotmemes){
						    	res.format({
							      html: function() {
							      	if(req.user){
											var loggedinuser = req.user.facebook;
										}else{
											var loggedinuser = false;
										}
							        res.render('memes', {
							          memes: updatedMemes,
							          baseUrl: baseUrl,
							          pageCount: pageCount,
							          itemCount: itemCount,
							          toptags: toptags,
							          loggedinuser: loggedinuser,
							          hotmemes: hotmemes,
									  req: {
											type: 'memes',
										    name: 'Popular Shudh Desi Memes'
										    }
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
				    });
			    })
		    })
		  });

		});
		app.get('/tag/:name', function(req, res, next){
			var name = req.params.name;
			Tag.findByName(name, function(err, tag){
				if(err) console.log(err);
				if(tag.length == 0){
					res.status('404').send('Tag not found');
				}else{
					var memeIds = [];
					for (var i = 0; i < tag[0]._memes.length; i++) {
						memeIds.push(tag[0]._memes[i].meme);
					};
					Meme.paginate({
						_id: {$in: memeIds}
					}, { page: req.query.page, limit: req.query.limit , sortBy: {createdAt: -1} }, function(err, memes, pageCount, itemCount) {
					    if (err) return next(err);
					    updateTagsInMemes(memes, function(updatedMemes){
					    	updateUserInMemes(updatedMemes, function(updatedMemes){
							    getTopTags(10, function(toptags){
							    	res.format({
								      html: function() {
								      	if(req.user){
											var loggedinuser = req.user.facebook;
										}else{
											var loggedinuser = false;
										}
								        res.render('memes', {
								          memes: updatedMemes,
								          baseUrl: baseUrl,
								          picBaseUrl: "http://www.edroot.com/shudhdesimemes/images/",
								          pageCount: pageCount,
								          itemCount: itemCount,
								          toptags: toptags,
								          loggedinuser: loggedinuser,
								          req: {
								          	type: 'tag',
								          	name: name
								          }
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
						});
					});
				}
			})
		});
		app.post('/api/upload', upload.single('file'), function(req, res, next) {
			res.json({
				filename: req.file.filename
			});
		});
		
		app.post('/mcconaughey', isModerator, upload.single('savedImg'), function(req, res){
    		img = new savedImg({
    			path: req.file.path,
    			searchStr: req.body.searchStr
    		});
    		img.save(function(err){
    			if(err) {
    				console.log(err);
    				res.render('uploadsaveimg', {
						uploadSuccess: "errorinsave",
						msgColor: "red"
						});
    			}else{
    				res.render('uploadsaveimg', {
						uploadSuccess: "success",
						msgColor: "green"
						});
    			}

    			
    		})
		});
		app.get('/mcconaughey', isModerator, function(req,res){
			if(req.user){
				var user = req.user.facebook;
			}else{
				var user = false;
			}
			res.render('uploadsaveimg', {
				uploadSuccess: "new",
				user: user,
				msgColor: "#00adef"
			});
		})
		app.post('/api/savememe', isLoggedIn, function(req, res){
			var memeObj = {
				title: req.body.title,
				tags: req.body.tags,
				userid: req.user.id,
				path: req.body.filepath,
				ifSave: !req.body.doNotSave
			};
			Meme.saveMeme(memeObj, function(link) {
					res.json({
						redirectUrl: baseUrl+link
					});
				})
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
				Meme.saveMeme(memeObj, function(_id) {
					res.json({
						redirectUrl: baseUrl+'memes/'+_id
					});
				})
			});
		});
		app.get('/auth/facebook', passport.authenticate('facebook', {display: 'popup'}));


    	app.get('/auth/facebook/callback', 
        	passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }), function(req, res){
        		res.sendFile('views/after-auth.html',{ root: app.get('rootDir')});
        	});
		/**

		 * Home 
		 */
		// app.get('/', function(req, res) {
		// 	res.redirect('/create');
		// });
	}
	// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// console.log(req);
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		return next();
	}
	// if they aren't redirect them to the home page
	res.redirect('/facebook-login-required');
}
function isModerator(req, res, next) {
	// console.log(req);
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		if(req.user.facebook.id == "10153106392356889"){
			return next();	
		}else{
			res.redirect('/facebook-login-required');
		}
	}
	// if they aren't redirect them to the home page
	res.redirect('/facebook-login-required');
}

