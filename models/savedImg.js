var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var savedImgSchema = new Schema({
	_id: Number,
	path: String,
	// tags: [{
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Tag'
	// }],
	searchStr: String,
	usage: Number
});

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