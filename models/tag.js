var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TagSchema = new Schema({
	name: String,
	_img: {
		type: Number,
		ref: 'savedImg'
	}
});

TagSchema.statics.getSimilarTags = function (name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
}

module.exports = mongoose.model('Tag', TagSchema);