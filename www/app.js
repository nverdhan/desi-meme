MemeApp.controller('CreateMemeController', ['$scope','$http',  '$upload', 'TagService', function($scope, $http, $upload, TagService) {

	/**This section is copy pasted -- Start*/
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
	$scope.postOption = 'article';
	$scope.invalidTag = false;
	$scope.title = '';

	$scope.catResults = function() {
		return ($scope.cats.length > 0);
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
	}
	$scope.removeTag = function(tag) {
		var i = $scope.tagSelected.indexOf(tag);
		$scope.tagSelected.splice(i, 1);
	}
	$scope.addTag = function(a) {
		if ($scope.tagSelected.indexOf(a) == -1) {
			$scope.tagSelected.push(a);
		}
		$scope.tagInput = '';
		$scope.showTags = false;
	}
	$scope.getImageDivCSS = function (argument) {
	 	return {
				height : '100%',
				width : '100%',
				position : 'absolute',
				background : 'url('+$scope.imageUrl+')',
				backgroundPosition : '50% 50%',
				backgroundSize : 'cover',
	 	}
	 }
	$scope.onFileSelect = function($files, item) {
		if ($scope.coverImage) {
			// DeleteFileService.delete($scope.coverImage).then(function(res) {});
		}
		var allowedFileTypes = ["image/jpeg", "image/png", "image/bmp"];
		for (var i = 0; i < $files.length; i++){
			var file = $files[i];
			if(allowedFileTypes.indexOf(file.type) == -1){
				$scope.errors.image.show = true;
				$scope.errors.image.text = 'Invalid Image';
				$scope.OverlayVisible = false;
				return false;
			}
			angular.element('#progress').removeClass('hidden');
			$scope.upload = $upload.upload({
				url: 'api/upload',
				data: {
					myObj: $scope.myModelObj
				},
				file: file,
			}).progress(function(evt) {
				var a = parseInt(100.0 * evt.loaded / evt.total);
				angular.element('.progress-bar-success').attr('aria-valuenow', a);
				angular.element('.progress-bar-success').css('width', a + '%');
				angular.element('.sr-only').html(a + '% Complete (success)');
			}).success(function(evt) {
				var url = '/uploads/' + evt.filename;
				$scope.memeObj.image = url;
				$scope.imageUrl = url;
				$scope.OverlayVisible = false;
				// $scope.coverImage = url;
				// $scope.showCoverImageRequired = false;
				$scope.closeProgressBar();
			}).error(function(evt) {
				$scope.showCoverImageRequired = false;
				$scope.closeProgressBar();
				return false;
			})
		};
	}
	$scope.closeProgressBar = function() {
		angular.element('#progress').addClass('hidden');
		angular.element('.progress-bar-success').attr('aria-valuenow', 0);
		angular.element('.progress-bar-success').css('width', 0 + '%');
		angular.element('.sr-only').html(0 + '% Complete (success)');
	}

	/**This section is copy pasted -- Ends */
	$scope.selectedTheme = 0;
	$scope.showText1 = true;
	$scope.OverlayVisible = false;
	$scope.showSaveFormDialog = false;
	$scope.showBrowseImgDialog = false;
	$scope.selectMemeTheme = function(i) {
		$scope.selectedTheme = i;
		$scope.showText1 = true;
		$scope.showText2 = true;
		console.log(i);
		if (i === 0) {
			$scope.showText2 = false;
		}
		if (i === 1) {
			$scope.showText1 = false;
		}
	}
	$scope.showOverlay = function() {
		$scope.OverlayVisible = true;
	}
	$scope.hideOverlay = function() {
		$scope.OverlayVisible = false;
	}
	$scope.memeObj = {
		image : '',
		title : '',
		tags : []
	}
	$scope.errors = {
		image : {
			show : false,
			text : ''
		}
	}
	$scope.saveFormNext = function() {
		if(!$scope.memeObj.image){
			$scope.errors.image.show = true;
			$scope.errors.image.text = 'Please add Image first';
			return false;
		}
		var c3 = document.getElementById('meme-img-holder');
	    var x = c3.innerHTML;
	    // console.log(123);
	    /*Convert Div Content to Image/Jpeg and Send server side via ajax*/
	    angular.element('.text-box').removeClass('text-box-border')
	    html2canvas(c3, {
	      onrendered: function(canvas) {
	        var serverSideURL = 'api/upload2';
	        document.body.appendChild(canvas);
	        var canvasc = angular.element("canvas");
	        canvasc.attr('id','myCanvas');
	        var canvasx = document.getElementById("myCanvas");
	        canvasx.setAttribute('style','transform:scale(4,4)');
	        var file = canvasx.toDataURL("image/jpeg", 1);
	        $http.post(serverSideURL, {file : file}, function(data){
	          // $('.saving-progress').addClass('hidden');  
	          // location.reload();
	          // console.log(data);
	        });
	        angular.element("#myCanvas").remove();
	      },
	    });
		$scope.showOverlay();
		$scope.showSaveFormDialog = true;
		$scope.showBrowseImgDialog = false;
	}
	$scope.showImgSelector = function() {
		$scope.showOverlay();
		$scope.showBrowseImgDialog = true;
		$scope.showSaveFormDialog = false;
	}
	$scope.hideImgSelector = function() {
		$scope.hideOverlay();
		$scope.showBrowseImgDialog = false;
	}
	$scope.hideSaveMemeSelector = function() {
		$scope.hideOverlay();
		// $scope.showBrowseImgDialog = false;
	}
}])