var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
	userId : String,
	chats : [{
		user : {
			id : String,
			chat : String,
			date : { type: Date, default: Date.now }
		}
	}]
})
/**
* This function will retireve chats for particular user
*/
ChatSchema.methods.retrieveChats = function (userid, index) {
	// body...
}
/**
* This function will save chat object for particular user
*/
ChatSchema.methods.saveChats = function (userid, ChatObj) {
	// body...
}