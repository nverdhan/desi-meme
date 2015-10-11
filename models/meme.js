var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Tag = require('../models/tag');
var User = require('../models/user');
var async = require('async');
var request = require('request');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var URLSlugs = require('mongoose-url-slugs');
var baseUrl = 'http://127.0.0.1:3000/'
var MemeSchema = new Schema({
	title: String,
	path: String,
	ifSave: Boolean,
	link: String,
	shortenedLink: String,
	views: {type: Number, default: 0}
});
MemeSchema.plugin(mongoosePaginate);
MemeSchema.plugin(timestamps);
MemeSchema.plugin(URLSlugs('title', {field: 'slug', maxLength: 50}));

var shortenLink = function(longUrl, cb){	
	var encodedLongUrl = encodeURIComponent(longUrl);
	var oauthToken = "e58335df3c2b9651b745298b3ea1349b70b82e26";
	var apiaddress = 'https://api-ssl.bitly.com';
	var get = '/v3/shorten?access_token='+oauthToken+'&longUrl='+encodedLongUrl;
	// request(apiaddress+get, function (error, response, body) {
	//   if (!error && response.statusCode == 200) {
	//   	var res = JSON.parse(response.body);
	//     cb(res.data.url); // Print the google web page.
	//     // return response.body.url;
	//   }else{
	//   	console.log(error);
	//   	// return error;
	//   }
	// })
	cb(longUrl);
}

MemeSchema.statics.saveMeme = function(memeObj, cb) {
	var meme = new this({
		title: memeObj.title,
		path: memeObj.path,
		ifSave: memeObj.ifSave,
		likes: 0
	});
	var redirectTo = function(link){
		cb(link);
	}
	meme.save(function(err, meme) {
		if (err) console.log(err);
		meme.link = 'memes/'+meme.slug;
		shortenLink(baseUrl+meme.link, function(shortenedLink){
			meme.shortenedLink = shortenedLink;
			meme.save(function(err, meme) {

				User.findByID(memeObj.userid, function(err, user){
					if(err) console.log(err);
					
					if(user[0]){
						user[0].addMeme(meme._id, function(){
							redirectTo(meme.link);
						})
					}
				})


				memeObj.tags.forEach(function(tagname) {
					var tag = new Tag({
						name: tagname,
						usage: 1,
						_memes: {meme: meme._id}
					});
					if(!memeObj.ifSave){
						tag.usage = 0;
					}
					tag.ifExists(function(err, tagArr) {
						if (err) console.log(err);
						if (tagArr.length == 0) {
							tag.save(function(err) { if (err) console.log(err); });
						} else {
							tagArr.forEach(function(tagReturned) { tagReturned.updateTag(tag, function(updatedTag) {}); })
						}
					})
				})
			})
		});
	})
}

MemeSchema.statics.findByID = function(_id, cb){
	var ObjectId = require('mongoose').Types.ObjectId; 
	return this.find({
		_id: new ObjectId(_id)
	}, cb);
}
MemeSchema.statics.findBySlug = function(slug, cb){
	return this.find({
		slug: slug
	}, cb);
}

module.exports = mongoose.model('Meme', MemeSchema);