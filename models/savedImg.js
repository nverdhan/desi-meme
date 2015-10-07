var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var savedImgSchema = new Schema({
	path: String,
	searchStr: String,
	usage: Number
});
savedImgSchema.plugin(timestamps);

savedImgSchema.statics.getImgById = function(_id, cb) {
	return this.find({
		_id: _id
	}, cb);
}
savedImgSchema.statics.getImgBySearchStr = function(searchStr, cb) {
	return this.find({
		searchStr: new RegExp(searchStr, 'i')
	}, cb);
}
module.exports = mongoose.model('SavedImg', savedImgSchema);