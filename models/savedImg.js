var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var savedImgSchema = new Schema({
	_id: Number,
	path: String,
	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}],
	usage: Number
});

savedImgSchema.statics.getImgById = function (_id, cb) {
  return this.find({ _id: _id }, cb);
}

module.exports = mongoose.model('SavedImg', savedImgSchema);