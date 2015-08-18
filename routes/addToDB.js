var Tag = require('../models/tag');
var savedImg = require('../models/savedImg');

var createTag;
var tagNames = ['hot', 'sexy', 'dude', 'nv', 'mongo', 'walter', 'white', 'x', 'xx', 'xxx', 'django', 'xango', 'alpha', 'charlie', 'bravo', 'delta', 'omega', 'phi', 'chi', 'omicron', 'beta', 'gamma', 'superman', 'dark knight', 'anil kapoor', 'bond', 'guchhu', 'nero']
	// for (var i = 0; i < tagNames.length; i++) {
	// 	createTag = new Tag({
	// 		_id: i,
	// 		name: tagNames[i]
	// 	})
	// 	createTag.save(function(err) {
	// 		if (err) return handleError(err);
	// 	})
	// };

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var createImg, path, numTags, tagName;
var imgUrlsPrefix = 'public/data/';
tagLen = tagNames.length;
for (var i = 0; i < 60; i++) {
	path = imgUrlsPrefix + i + '.jpg';
	createImg = new savedImg({
		_id: i,
		path: path,
		usage: getRandomInt(0, 1000)
	})
	createImg.save(function(err) {
		if (err) return handleError(err);

		numTags = getRandomInt(1, 6);
		console.log(numTags);
		for (var j = 0; j < numTags; j++) {
			tagName = tagNames[getRandomInt(0, tagLen)];
			createTag = new Tag({
				name: tagName,
				_img: createImg.id
			})
			console.log(1);
			createTag.save(function(err) {
				if (err) return handleError(err);
			});
		};

	})
};