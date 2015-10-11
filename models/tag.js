var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var TagSchema = new Schema({
	name: String,
	usage: Number,
	_memes: [{
		meme: {
			type: Schema.ObjectId,
			ref: 'Meme'
		}
	}]
});
// TagSchema.plugin(mongoosePaginate);
TagSchema.plugin(timestamps);

TagSchema.statics.getSimilarTags = function(name, cb) {
	return this.find({
		name: new RegExp(name, 'i')
	}, cb);
}
TagSchema.statics.findByMeme = function(meme, cb){
	return this.find({_memes: {$elemMatch: {meme: meme._id}}}, cb);
}
TagSchema.statics.populateMeme = function(baseUrl, meme, cb){
	return this.find({_memes: {$elemMatch: {meme: meme._id}}})
				.exec(function(err, tags){
					meme.tags = [];
					for (var i = 0; i < tags.length; i++) {
						meme.tags.push({
						        	link: baseUrl+'tag/'+tags[i].name,
						        	name: tags[i].name
								});
					};
					cb(meme);
				});
}
TagSchema.statics.findByName = function(name, cb){
	return this.find({name: name}, cb);
}
TagSchema.statics.getTop = function(limit, cb){
	return this.find({})
				.sort({usage: -1})
				.limit(limit)
				.exec(function(err, tags){
					if(err) console.log(err);
					cb(tags);
				})
}
TagSchema.methods.selfPopulate = function(cb) {
	this.model('Tag').findOne({
			name: this.name
		})
		.populate('_memes.meme')
		.exec(function(err, tag) {
			// if (err) console.log(err);
			// console.log(tag);
			console.log(JSON.stringify(tag, null, "\t"))
			cb(tag);
		});
}
TagSchema.methods.ifExists = function(cb) {
	return this.model('Tag').find({
		name: this.name
	}, cb);
}
TagSchema.methods.updateTag = function(tagnew, cb) {
	memesLen = this._memes.length;
	this._memes.push({meme: ''});
	this._memes[memesLen].meme = tagnew._memes[0].meme;
	this.usage += tagnew.usage;
	var self = this;
	this.save(function(err) {
		if (err) console.log(err);
		cb(self);
	})
}
module.exports = mongoose.model('Tag', TagSchema);