var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MemeSchema = new Schema({
	_id: Number,
	name: String,
	_tags: [{
		type: Number,
		ref: 'Tag'
	}],
	_creator : {
		type: Number,
		ref: 'User'
	},
	likes: Number
});

module.exports = mongoose.model('Meme', MemeSchema);