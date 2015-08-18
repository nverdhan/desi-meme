ViaSlide.controller('InfoCtrl', ['$scope','$rootScope', '$upload', '$http','UserInfo','DeleteFileService', function ($scope, $rootScope, $upload, $http, UserInfo, DeleteFileService) {
		$rootScope.title = '';
		$scope.onFileSelect = function($files){
			angular.element('#progress').removeClass('hidden');
			if($scope.user.image){
				DeleteFileService.delete($scope.user.image).then(function (res){
				});
			}
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
				$scope.upload = $upload.upload({
					url : 'server.php/admin/upload',
					data : {myObj : $scope.myModelObj},
					file : file,
				}).progress(function (evt){
					var a = parseInt(100.0 * evt.loaded / evt.total);
						angular.element('.progress-bar-success').attr('aria-valuenow',a);
						angular.element('.progress-bar-success').css('width',a+'%');
						angular.element('.sr-only').html(a+'% Complete (success)');
				}).success( function (evt){
					var url = 'public/data/'+JSON.parse(evt);
					$scope.user.image = url;
					$scope.closeProgressBar();
				}).error( function (evt){
					$scope.closeProgressBar();
					return false;
				});
			}
		}
		$scope.closeProgressBar = function(){
				angular.element('#progress').addClass('hidden');
				angular.element('.progress-bar-success').attr('aria-valuenow',0);
				angular.element('.progress-bar-success').css('width',0+'%');
				angular.element('.sr-only').html(0+'% Complete (success)');
		}
		$scope.user = {
			name  : '',
			image : '',
			about : ''
		}
		$scope.showPwdError = false;
		$scope.showPwdErrorMsg;
		$scope.showPwdSuccess = false;
		$scope.showPwdSuccessMsg;
		UserInfo.get().then(function(res){
				$scope.user = res.data;
				if(!$scope.user.about){
					$scope.user.about = 'about';	
				}
		});
		$scope.uploadImage = function(){
			document.getElementById('file-type').click();
		}
		$scope.hideAll = function(){
			$scope.showUserPicTab = false;
			$scope.showAboutMeTab = false;
			$scope.showChangePwdPanel = false;
			$scope.passwordUnmatch = false;	
		}
		$scope.hideAll();
		$scope.showAboutMeTab = true;
		$scope.activateIt = function(e){
			$scope.hideAll();
			if(e == 'showUserPicTab'){
				$scope.showUserPicTab = true;
			}else if(e=='showAboutMeTab'){
				$scope.showAboutMeTab = true;
			}else{
				$scope.showChangePwdPanel = true;
			}
		}
		$scope.submitInfoForm = function (user){
			if($scope.user.about == 'about'){
				$scope.user.about == ''
			}
			angular.element('.saving-progress').removeClass('hidden');
			UserInfo.update($scope.user).success(function(data){
				angular.element('.saving-progress').addClass('hidden');
				if(data.status == 'error'){
					$scope.showPwdError = true;
					$scope.showPwdErrorMsg = data.message;
				}
			})
		}
		$scope.submitPwdForm = function(){
				$scope.passwordUnmatch = false;
				$scope.showPwdError = false;
				$scope.showPwdSuccess = false;
				if($scope.newPwd1 == $scope.newPwd2){
					var passwords = {
						oldPwd : $scope.oldPwd,
						newPwd1 : $scope.newPwd1,
						newPwd2 : $scope.newPwd2,
					}
					angular.element('.saving-progress').removeClass('hidden');
					UserInfo.changePwd(passwords).then(function(res){
						angular.element('.saving-progress').addClass('hidden');
						if(res.data.status == 'error'){
							$scope.showPwdError = true;
							$scope.showPwdErrorMsg = res.data.message;
						}
						if(res.data.status == 'success'){
							$scope.showPwdSuccess = true;
							$scope.showPwdSuccessMsg = res.data.message;
						}
					});
				}else{
					$scope.passwordUnmatch = true;
				}

	}
}]);