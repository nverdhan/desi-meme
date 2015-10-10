// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var UserSchema = new Schema({
// 	_id: Number,
// 	name: String,
// 	image: String,
// 	memes: [{
// 		type: Schema.Types.ObjectId,
// 		ref: 'Meme'
// 	}]
// });
// UserSchema.methods.getUser = function(id) {
// 	return this.model('User').find({
// 		id: this.id
// 	}, id);
// }
// module.exports = mongoose.model('User', UserSchema);
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var userSchema = mongoose.Schema({
		local : {
			id : String,
			email : String,
			name : String,
			img : String
		},
		twitter : {
			id : String,
			token : String,
			email : String,
			name : String,
			img : String
		},
		facebook : {
			id : String,
			// token : String,
			// email : String,
			name : String,
			img : String
		},
		google : {
			id : String,
			token : String,
			email : String,
			name : String,
			img : String
		}
	});


userSchema.methods.generateHash = function (password) {
	// body...
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
	// body...
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);