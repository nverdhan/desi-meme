MemeApp.controller('CreateMemeController', ['$scope', '$upload', 'TagService', function($scope, $upload, TagService) {

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
	$scope.onFileSelect = function($files, item) {
		angular.element('#progress').removeClass('hidden');
		if ($scope.coverImage) {
			DeleteFileService.delete($scope.coverImage).then(function(res) {});
		}
		for (var i = 0; i < $files.length; i++) {
			var file = $files[i];
			$scope.upload = $upload.upload({
				url: 'server.php/admin/upload',
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
				var url = 'public/data/' + JSON.parse(evt);
				$scope.coverImage = url;
				$scope.showCoverImageRequired = false;
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
	$scope.saveFormNext = function() {
		$scope.showOverlay();
		$scope.showSaveFormDialog = true;
	}
	$scope.showImgSelector = function() {
		$scope.showOverlay();
		$scope.showBrowseImgDialog = true;
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