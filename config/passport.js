var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var configAuth = require('./authConfig');

module.exports = function(app, passport){
	//SerializeUser
	passport.serializeUser(function (user, done){
		return done(null, user.id);
	});
	//DeSerializeUser
	passport.deserializeUser(function(user, done) {
      done(null, user);
    });
	passport.use(new LocalStrategy(
        {passReqToCallback: true},
        function (req, username, password, done){
            var profile = req.body;
            console.log(profile);
            var profile = {
                id : '123',
                token : '123',
                name : 'dummy',
                image : 'fake'
            }
            User.findOne({'facebook.id' : profile.id}, function (err, user) {
                console.log(user);
                console.log(profile);
                if(err) return err;
                if(user){
                    return done(null, user);
                }else{
                    var newUser                 = new User();
                    newUser.facebook.id          = profile.id;
                    newUser.facebook.token       = profile.id;
                    // newUser.facebook.name    = profile._json.name;
                    newUser.facebook.img = profile.image;
                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                } 
            })
        }
    ));
}