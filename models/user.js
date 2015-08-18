var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	_id: Number,
	name: String,
	image: String,
	memes: [{
		type: Schema.Types.ObjectId,
		ref: 'Meme'
	}]
});
UserSchema.methods.getUser = function(id) {
	return this.model('User').find({
		id: this.id
	}, id);
}
module.exports = mongoose.model('User', UserSchema);