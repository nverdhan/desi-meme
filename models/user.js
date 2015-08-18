var requestActions = {
	'REQUEST_RENT': 'REQUEST_RENT',
	'REQUEST_EXCHANGE': 'REQUEST_EXCHANGE'
}

var mongoose = require('mongoose');
// var UserSchema = mongoose.Schema;
var UserSchema = mongoose.Schema({
	facebook: {
		id: String,
		token: String,
		image: String
	},
	loc: {
		type: [Number],
		index: "2dsphere"
	},
	library: [{
		id: String,
		name: String,
		author: String,
		image: String,
		genre: String,
		status: Boolean,
	}],
	lendBooks: [{
		id: String,
		userId: String,
		date: {
			type: Date,
			default: Date.now()
		}
	}],
	rentBooks: [{
		id: String,
		userId: String,
		date: {
			type: Date,
			default: Date.now()
		}
	}],
	requests: [{
		id: String,
		action: String,
		fromUserId: String,
		date: {
			type: Date,
			default: Date.now()
		}
	}],
	connected: [{
		userId: String,
	}],
	updated: {
		type: Date,
		default: Date.now()
	},
	created: {
		type: Date,
		default: Date.now()
	}
});
UserSchema.methods.findNearBy = function(coordinates, maxDistance) {
	return this.model('User').find({
		loc: {
			$near: {
				$geometry: {
					type: "Point",
					coordinates: coordinates
				},
				$maxDistance: maxDistance
			}
		}
	})
}
UserSchema.methods.lendBook = function(bookObj, toUserObj) {

}
UserSchema.methods.rentBook = function(bookObj, fromUserObj) {

}
UserSchema.methods.addRequests = function(requestType, User) {

}
UserSchema.methods.updateLocation = function(coordinares) {

}
module.exports = mongoose.model('User', UserSchema);