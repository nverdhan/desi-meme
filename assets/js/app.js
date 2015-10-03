MemeApp.config(function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
});
MemeApp.directive('selectOnClick', function ($window) {
    return {
        link: function (scope, element) {
            element.on('click', function () {
                var selection = $window.getSelection();        
                var range = document.createRange();
                range.selectNodeContents(element[0]);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        }
    }
});
MemeApp.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);
MemeApp.controller('CreateMemeController', ['$scope', '$rootScope', '$http', '$upload', 'TagService', '$window', '$compile', function($scope, $rootScope, $http, $upload, TagService, $window, $compile) {

	/**This section is copy pasted -- Start*/
	$scope.initMemeVars = function(){
		$scope.catValue = '';
		$scope.catId = 0;
		$scope.cats = {};
		$scope.tagInput = '';
		$scope.tagSelected = [];
		$scope.tagResults = {};
		$scope.enabled = false;
		$scope.showTags = false;
		$scope.showCoverImageRequired = false;
		$scope.showTitleRequired = false;
		$scope.coverImage = '';
		$scope.memeTagsReqErr = false;
		$scope.postOption = 'article';
		$scope.invalidTag = false;
		$scope.saveMsg = 'Next';
		$scope.saveStatus = false;
		$scope.imageUrl = '';
		$scope.selectedTheme = 0;
		$scope.showText1 = false;
		$scope.showText2 = false;
		$scope.OverlayVisible = false;
		$scope.showSaveFormDialog = false;
		$scope.showBrowseImgDialog = false;
		$scope.memeObj = {
			image: '',
			title: '',
			tags: []
		}
		$scope.errors = {
			image: {
				show: false,
				text: ''
			}
		}
		$scope.memeContent = {
			Text1 : 'Enter Top Text',
			Text2 : 'Enter Bottom Text'
		}
		$scope.aspect = 1;
		$scope.imgW = 0;
		$scope.imgH = 0;
		$scope.bgcolor = 'rgba(255, 255, 255, 0)';
		$scope.fgcolor = 'rgba(255, 255, 255, 1)';
		$scope.textSize = 3;
		$scope.privateSavedImg = false;		
	}
	$scope.shareUrl = '';
	$scope.initMemeVars();
	var WINDOW = angular.element($window);
	WINDOW.bind('resize', function () {
		// $scope.setImageHolderCSS();
	});

	$scope.catResults = function() {
		return ($scope.cats.length > 0);
	}
	$scope.checkTagErr = function() {
		if ($scope.tagSelected.length == 0) {
			$scope.memeTagsReqErr = true;
			return true;
		} else {
			$scope.memeTagsReqErr = false;
			return false;
		}
	}
	$scope.checkTitleErr = function() {
		if ($scope.memeObj.title == undefined || $scope.memeObj.title.length == 0) {
			$scope.showTitleRequired = true;
			return true;
		} else {
			$scope.showTitleRequired = false;
			return false;
		}
	}
	$scope.showResults = function() {
		var url = '';
		$http.get(url).success(function(data) {
			$scope.cats = data;
		});
	}
	$scope.selectCat = function(cat) {
		$scope.catValue = cat.category;
		$scope.catId = cat.id;
		$scope.cats = {};
		$scope.enabled = true;
	}
	$scope.enableCategory = function() {
		$scope.catValue = '';
		$scope.enabled = false;
	}
	$scope.enableThis = function() {
		return $scope.enabled;
	}
	$scope.getTags = function() {
		$scope.invalidTag = false;
		if ($scope.tagInput == '') {
			$scope.showTags = false;
			return;
		}
		var nameReg = /^[A-Za-z0-9]+$/;
		if (!nameReg.test($scope.tagInput)) {
			$scope.invalidTag = true;
			$scope.showTags = false;
			return false;
		}
		var tag = $scope.tagInput.toLowerCase();
		TagService.get(tag)
			.success(function(data) {
				$scope.tagResults = data.tag;
				$scope.showTags = true;
			});
	}
	$scope.showTags = false;
	$scope.selectTag = function(a) {
		if ($scope.tagSelected.indexOf(a.name) == -1) {
			$scope.tagSelected.push(a.name);
		}
		$scope.tagInput = '';
		$scope.showTags = false;
		$scope.checkTagErr();
	}
	$scope.removeTag = function(tag) {
		var i = $scope.tagSelected.indexOf(tag);
		$scope.tagSelected.splice(i, 1);
		$scope.checkTagErr();
	}
	$scope.addTag = function(a) {
		if ($scope.tagSelected.indexOf(a) == -1) {
			$scope.tagSelected.push(a);
		}
		$scope.tagInput = '';
		$scope.showTags = false;
		$scope.checkTagErr();
	}
	// $scope.getImageDivCSS = function(argument) {
	// 	if($scope.imageUrl != undefined && $scope.imageUrl!= ''){
	// 		var picture = $('#thepicture');  // Must be already loaded or cached! 
	// 		picture.guillotine({width: 400, height: 300});
	// 		// $scope.setImageHolderCSS();
	// 		return {
	// 			// position: 'absolute',
	// 			// top: '0',
	// 			// bottom: '0',
	// 			// left: '0',
	// 			// right: '0',
	// 			// border: '3px solid black',
	// 			// background: 'url(' + $scope.imageUrl + ')',
	// 			// backgroundPosition: '50% 50%',
	// 			// backgroundSize: 'cover',
	// 		}
	// 	}else{
	// 		return {
	// 			position: 'absolute',
	// 			top: '0',
	// 			bottom: '0',
	// 			left: '0',
	// 			border: '3px solid black',
	// 			right: '0'
	// 		}
	// 	}
		
	// }
	$scope.instantiateGuillotine = function(url){
		angular.element('#thepicture').attr('src', url);
		$compile(angular.element('#thepicture'));
		var picture = $('#thepicture');  // Must be already loaded or cached! 
		picture.on('load', function (){
			$scope.holderReady();
			if (picture.guillotine('instance')){
				picture.guillotine('remove');
			}
			picture.guillotine({width: 800, height: 600});
			if (! picture.data('bindedBtns')) {
				picture.data('bindedBtns', true);
				$('#rotate_left').click(function(){ picture.guillotine('rotateLeft'); });
		        $('#rotate_right').click(function(){ picture.guillotine('rotateRight'); });
		        $('#fit').click(function(){ picture.guillotine('fit'); });
		        $('#zoom_in').click(function(){ picture.guillotine('zoomIn'); });
		        $('#zoom_out').click(function(){ picture.guillotine('zoomOut'); });
		    }
		})
	}
	$scope.onFileSelect = function($files, item){
		var files = $files; // FileList object
		var imageSelected = false;
	    // Loop through the FileList and render image files as thumbnails.
	    for (var i = 0, f; f = files[i]; i++) {

	      // Only process image files.
	      if (!f.type.match('image.*')) {
	        continue;
	      }

	      var reader = new FileReader();

	      // Closure to capture the file information.
	      reader.onload = (function(theFile) {
	        return function(e) {
	          // Render thumbnail.
	          	var url = e.target.result;
	          	$scope.memeObj.image = url;
				$scope.imageUrl = url;
				imageSelected = true;
				$scope.instantiateGuillotine(url);
	        };
	      })(f);

	      // Read in the image file as a data URL.
	      reader.readAsDataURL(f);
	    }
	    // if(imageSelected){
	    	$scope.hideOverlay();
	    	$scope.selectMemeTheme($scope.selectedTheme);
	    	// console.log('hide called');
	    // }
	}
	$scope.closeProgressBar = function() {
		angular.element('#progress').addClass('hidden');
		angular.element('.progress-bar-success').attr('aria-valuenow', 0);
		angular.element('.progress-bar-success').css('width', 0 + '%');
		angular.element('.sr-only').html(0 + '% Complete (success)');
	}

	/**This section is copy pasted -- Ends */
	
	$scope.selectMemeTheme = function(i) {
		$scope.selectedTheme = i;
		// console.log($scope.imageUrl);
		if($scope.imageUrl != undefined && $scope.imageUrl != ''){
			if (i === 0) {
			$scope.showText1 = true;
			$scope.showText2 = false;
			}
			if (i === 1) {
				$scope.showText1 = false;
				$scope.showText2 = true;
			}
			if (i == 2) {
				$scope.showText1 = true;
				$scope.showText2 = true;
			}	
		}else{
			$scope.showText1 = false;
			$scope.showText2 = false;
		}
	}
	$scope.showOverlay = function() {
		$scope.OverlayVisible = true;
	}
	$scope.hideOverlay = function() {
		$scope.OverlayVisible = false;
	}
	$scope.setShareDataUrl = function(shareDataUrl){
		$scope.shareUrl = shareDataUrl;
	}
	$scope.saveFormNext = function() {
		if (!$scope.checkTitleErr() && !$scope.checkTagErr() && !$scope.saveStatus) {
			var c3 = document.getElementById('meme-img-holder');
			var x = c3.innerHTML;
			var w = c3.clientWidth;
			var h = c3.clientHeight/c3.clientWidth*w;
			// console.log()
			/*Convert Div Content to Image/Jpeg and Send server side via ajax*/
			angular.element('.text-box').removeClass('text-box-border');
			angular.element('.fa-picture-o').addClass('invisible');
			html2canvas(c3, {
				onrendered: function(canvas) {
					var extra_canvas = document.createElement("canvas");
	                extra_canvas.setAttribute('width',800);
	                extra_canvas.setAttribute('height',600);
	                var ctx = extra_canvas.getContext('2d');
	                ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,800,600);
	                var dataURL = extra_canvas.toDataURL("image/jpeg",1);
					$scope.setShareDataUrl(dataURL);
					var serverSideURL = 'api/upload2';
					// document.body.appendChild(canvas);
					// var canvasc = angular.element("canvas");
					// // console.log(canvasc);
					// canvasc.attr('id', 'myCanvas');
					// var canvasx = document.getElementById("myCanvas");
					// // console.log(canvasx);
					// canvasx.setAttribute('style', 'transform:scale(4,4)');
					// var file = canvasx.toDataURL("image/jpeg", 1);
					var file = dataURL;
					$scope.saveMsg = 'Please wait';
					$scope.saveStatus = true;
					$http.post(serverSideURL, {
						file: file,
						title: $scope.memeObj.title,
						tags: $scope.tagSelected,
						doNotSave: $scope.privateSavedImg
					}).then( function(data) {
						// cons
						$scope.saveMsg = 'Done!';
						$scope.initCreateMeme();
						angular.element('.text-box').addClass('text-box-border');
						angular.element('.fa-picture-o').removeClass('invisible');
					}, function(err) {
						$scope.saveStatus = false;
						$scope.saveMsg = 'error saving. Retry!'
					});
					angular.element("#myCanvas").remove();
				},
				// width: 400,
				// height: 300,
				// logging: true
			});
		}
	}
	$scope.askForDetails = function() {
		if (!$scope.memeObj.image) {
			$scope.errors.image.show = true;
			$scope.errors.image.text = 'Please add Image first';
			return false;
		}
		$scope.showOverlay();
		$scope.showSaveFormDialog = true;
		$scope.showBrowseImgDialog = false;
	}
	$scope.showImgSelector = function() {
		$scope.showOverlay();
		$scope.showBrowseImgDialog = true;
		$scope.showSaveFormDialog = false;
		$rootScope.$broadcast('UPDATE_IMG_RESULTS');
	}
	$scope.hideImgSelector = function() {
		$scope.hideOverlay();
		$scope.showBrowseImgDialog = false;
	}
	$scope.hideSaveMemeSelector = function() {
		$scope.hideOverlay();
	}
	$scope.holderReady = function(){
		angular.element('#meme-img-holder').css('height', 'auto');
	}
	$scope.holderInitiate = function(){
		angular.element('#meme-img-holder').css('height', '80%');
	}
	$scope.selectImg = function(url) {
		$scope.memeObj.image = url;
		$scope.imageUrl = url;
		$scope.OverlayVisible = false;
		$scope.instantiateGuillotine(url);
		$scope.selectMemeTheme($scope.selectedTheme);
	}
	$scope.initCreateMeme = function(){
		$scope.initMemeVars();
		$scope.selectMemeTheme($scope.selectedTheme);
		var picture = $('#thepicture');  // Must be already loaded or cached! 
			if (picture.guillotine('instance')){
				picture.guillotine('remove');
			}
		angular.element('#thepicture').removeAttr('src');
		$scope.holderInitiate();
	}
	$scope.setTextColor = function(){
		angular.element('.text-box').css('color',$scope.fgcolor);
		angular.element('.text-box').css('background-color',$scope.bgcolor);
	}
	$scope.increaseTextSize = function(){
		$scope.textSize = $scope.textSize + 0.1;
		if($scope.textSize <= 5){
			$scope.setTextSize();
		}else{
			$scope.textSize = 5;
		}
	}
	$scope.decreaseTextSize = function(){
		$scope.textSize = $scope.textSize - 0.1;
		if($scope.textSize >= 0.5){
			$scope.setTextSize();
		}else{
			$scope.textSize = 0.5;
		}
	}
	$scope.setTextSize = function(){
		var textSize = $scope.textSize+'em';
		angular.element('.text-box').css('font-size',textSize)
	}
	$scope.setTextColor();
	$scope.holderInitiate();
	$scope.$on('colorpicker-selected', function(){
		$scope.setTextColor();
	})
}])