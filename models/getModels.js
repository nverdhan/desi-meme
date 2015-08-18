var mongoose = require('mongoose');
// require('../models/tag');
require('../models/meme');
require('../models/user');

// var Tag  = mongoose.model('Tag', TagSchema);
var Meme = mongoose.model('Meme', MemeSchema);
var User = mongoose.model('User', UserSchema);