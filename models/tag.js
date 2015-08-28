var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
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
TagSchema.plugin(mongoosePaginate);

TagSchema.statics.getSimilarTags = function(name, cb) {
	return this.find({
		name: new RegExp(name, 'i')
	}, cb);
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
	this.usage += 1;
	var self = this;
	this.save(function(err) {
		if (err) console.log(err);
		cb(self);
	})
}
module.exports = mongoose.model('Tag', TagSchema);