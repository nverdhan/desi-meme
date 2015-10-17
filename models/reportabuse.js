var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var baseUrl = 'http://www.shudhdesimemes.com/'
var ReportAbuseSchema = new Schema({
	meme: {
			type: Schema.ObjectId,
			ref: 'Meme'
		},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
		},
	reporttype: String,
	details: String,
	resolved: Boolean
});

ReportAbuseSchema.plugin(timestamps);


module.exports = mongoose.model('ReportAbuse', ReportAbuseSchema);