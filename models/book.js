var mongoose = require('mongoose');
var BookSchema = new mongoose.Schema({
	'id' : String,
	'title' : String,
	'desc' : String,
	'author' : String,
	'image' : String,
	'genre' : String,
	'isbn' : String,
	'language' : String,
	'added' : {type : Date, default : Date.now},
	'is_deleted' : Booloan,
});

BookSchema.methods.findById = function(id){
	return this.model('Book').find({'id' : id});
}
BookSchema.methods.searchByTitle = function (string) {
	return this.model('Book').find({});
}
BookSchema.methods.deleteBook = function(bookId){
	return this.model('Book').save({});
}