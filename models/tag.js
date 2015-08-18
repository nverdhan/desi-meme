var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TagSchema = new Schema({
	_id: Number,
	name: String,
	meme: [{
		type: Schema.Types.ObjectId,
		ref: 'Meme'
	}]
});

TagSchema.methods.getSimilarTags = function (cb) {
  return this.model('Tag').find({ name: this.name }, cb);
}
TagSchema.statics.getSimilarTags = function (name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
}
module.exports = mongoose.model('Tag', TagSchema);