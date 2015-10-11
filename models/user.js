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
var Schema = mongoose.Schema;
var URLSlugs = require('mongoose-url-slugs');
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
		},
		_memes: [{
			meme: {
				type: Schema.ObjectId,
				ref: 'Meme'
			}
		}]
	});

userSchema.plugin(URLSlugs('facebook.name', {field: 'slug', maxLength: 50}));

userSchema.methods.generateHash = function (password) {
	// body...
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
	// body...
	return bcrypt.compareSync(password, this.local.password);
}
userSchema.statics.findByID = function(_id, cb){
	var ObjectId = require('mongoose').Types.ObjectId; 
	return this.find({
		_id: new ObjectId(_id)
	}, cb);
}
userSchema.statics.findBySlug = function(slug, cb){
	return this.find({
		slug: slug
	}, cb);
}
userSchema.statics.populateMeme = function(meme, cb){
	return this.find({_memes: {$elemMatch: {meme: meme._id}}})
				.exec(function(err, users){
					meme.user = users[0];
					cb(meme);
				});
}
userSchema.methods.addMeme = function(memeid, cb) {
	memesLen = this._memes.length;
	this._memes.push({meme: ''});
	this._memes[memesLen].meme = memeid;
	this.save(function(err) {
		if (err) console.log(err);
		cb();
	})
}
userSchema.methods.populateMemes = function(cb){
	this.model('User').findOne({
			slug: this.slug
		})
		.populate('_memes.meme')
		.exec(function(err, user) {
			console.log(user);
			// console.log(JSON.stringify(user, null, "\t"))
			cb(JSON.stringify(user, null, "\t"));
		});
}



module.exports = mongoose.model('User', userSchema);