var Tag = require('../models/tag');
var savedImg = require('../models/savedImg');
var mongoose = require('mongoose');
mongoose.connection.collections['savedimgs'].drop( function(err) {
    console.log('collection dropped');
});
mongoose.connection.collections['tags'].drop( function(err) {
    console.log('collection dropped');
});
mongoose.connection.collections['memes'].drop( function(err) {
    console.log('collection dropped');
});
var createTag;
var tagNames = ['hot', 'sexy', 'dude', 'nv', 'mongo', 'shahrukh khan', 'walter', 'white', 'x', 'xx', 'xxx', 'django', 'xango', 'alpha', 'charlie', 'bravo', 'delta', 'omega', 'phi', 'chi', 'omicron', 'beta', 'gamma', 'superman', 'dark knight', 'anil kapoor', 'bond', 'guchhu', 'nero']
for (var i = 0; i < tagNames.length; i++) {
	createTag = new Tag({
		name: tagNames[i],
		usage: 0,
	})
	createTag.save(function(err) {
		if (err) return handleError(err);
	})
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
var createImg, path, numTags, searchStr;
var imgUrlsPrefix = 'public/data/';
tagLen = tagNames.length;
for (var i = 0; i < 60; i++) {
	searchStr = '';
	path = imgUrlsPrefix + i + '.jpg';
	numStr = getRandomInt(1,6);
	for (var j = 0; j < numStr; j++) {
		searchStr += tagNames[getRandomInt(0,tagLen)]+',';
	};
	createImg = new savedImg({
		_id: i,
		path: path,
		searchStr: searchStr,
		usage: getRandomInt(0, 1000)
	})
	createImg.save(function(err) {
		if (err) return handleError(err);
	})
};