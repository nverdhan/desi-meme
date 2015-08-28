var mongoose = require('mongoose');
var Tag = require('../models/tag');
var async = require('async');
var Schema = mongoose.Schema;
var MemeSchema = new Schema({
	title: String,
	path: String,
	// _tags: [{
	// 	type: Schema.ObjectId,
	// 	ref: 'Tag'
	// }],
	likes: Number
});

MemeSchema.statics.saveMeme = function(memeObj, cb) {
	var meme = new this({
		title: memeObj.title,
		path: memeObj.path,
		likes: 0
	});
	meme.save(function(err) {
		if (err) console.log(err);
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
							console.log(updatedTag);
							updatedTag.selfPopulate(function(tag) {
								// console.log(tag);
							});
						});
					})
				}
			})
		})
	})
	cb();
}

module.exports = mongoose.model('Meme', MemeSchema);