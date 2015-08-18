ViaSlide.controller('AboutCtrl', ['$http', '$scope', function ($http, $scope) {
	// body...
	$scope.hideAll = function(){
			$scope.showPrivacyTab = false;
			$scope.showAboutTab = false;
		}
	$scope.activateIt = function(e){
			$scope.hideAll();
			if(e == 'showPrivacyTab'){
				$scope.showPrivacyTab = true;
			}else if(e=='showAboutTab'){
				$scope.showAboutTab = true;
			}
		}

}]);