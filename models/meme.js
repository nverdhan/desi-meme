var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Tag = require('../models/tag');
var async = require('async');
var request = require('request');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var baseUrl = 'http://127.0.0.1:3000/'
var MemeSchema = new Schema({
	title: String,
	path: String,
	ifSave: Boolean,
	link: String,
	shortenedLink: String,
	likes: Number
});
MemeSchema.plugin(mongoosePaginate);
MemeSchema.plugin(timestamps);

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
	var setId = function(id){
		cb(id);
	}
	meme.save(function(err, meme) {
		if (err) console.log(err);
		meme.link = 'meme/'+meme._id;
		shortenLink(baseUrl+meme.link, function(shortenedLink){
			meme.shortenedLink = shortenedLink;
			meme.save(function(err, meme) {
				setId(meme._id);
				memeObj.tags.forEach(function(tagname) {
					var tag = new Tag({
						name: tagname,
						usage: 1,
						_memes: {meme: meme._id}
					});
					tag.ifExists(function(err, tagArr) {
						if (err) console.log(err);
						if (tagArr.length == 0) {
							tag.save(function(err) {
								if (err) console.log(err);
								// tag.selfPopulate(function(tag) {
								// // 	// console.log(tag);
								// });
							});
						} else {
							tagArr.forEach(function(tagReturned) {
								tagReturned.updateTag(tag, function(updatedTag) {
									// console.log(updatedTag);
									// updatedTag.selfPopulate(function(tag) {
									// 	// console.log(tag);
									// });
								});
							})
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

module.exports = mongoose.model('Meme', MemeSchema);