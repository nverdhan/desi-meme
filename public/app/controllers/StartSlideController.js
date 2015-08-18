ViaSlide.controller('StartSlideCtrl', ['$rootScope','$scope', '$http','$upload','$state','TagService','SlideService','DeleteFileService','AUTH_EVENTS', function ($rootScope, $scope, $http, $upload, $state, TagService, SlideService, DeleteFileService, AUTH_EVENTS) {
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
		$rootScope.title = 'Create new slideshow - ';
		$scope.catResults =  function(){
			return ($scope.cats.length > 0);
		}
		$scope.showResults = function(){
			var url = '';
			$http.get(url).success(function(data){
				$scope.cats = data;
			});
		}
		$scope.selectCat = function(cat){
			$scope.catValue = cat.category;
			$scope.catId = cat.id;
			$scope.cats ={};
			$scope.enabled = true;
		}
		$scope.enableCategory = function(){
			$scope.catValue = '';
			$scope.enabled = false;
		}
		$scope.enableThis = function(){
			return $scope.enabled;
		}
		$scope.getTags = function(){
			$scope.invalidTag = false;
			if($scope.tagInput == ''){
				$scope.showTags = false;
				return;
			}
			var nameReg = /^[A-Za-z0-9]+$/;
			if(!nameReg.test($scope.tagInput)){
	            $scope.invalidTag = true;
	            $scope.showTags = false;
	            return false;
	        }
			var tag = $scope.tagInput.toLowerCase();
			TagService.get(tag)
				.success(function(data){
					$scope.tagResults = data;
					$scope.showTags = true;
				});
		}
		
		$scope.showTags = false;
		$scope.selectTag = function(a){
			if($scope.tagSelected.indexOf(a.tag) == -1){
				$scope.tagSelected.push(a.tag);
			}
			$scope.tagInput = '';
			$scope.showTags = false;
		}
		$scope.removeTag = function(tag){
			var i = $scope.tagSelected.indexOf(tag);
			$scope.tagSelected.splice(i,1);
		}
		$scope.addTag = function(a){
			if($scope.tagSelected.indexOf(a) == -1){
				$scope.tagSelected.push(a);
			}
			$scope.tagInput = '';
			$scope.showTags = false;
		}
		$scope.submitForm = function(){
			for (var i = 0; i < $scope.tagSelected.length; i++) {
				if($scope.tagSelectedString == undefined){
					$scope.tagSelectedString = $scope.tagSelected[i]
				}
				else{
					$scope.tagSelectedString = $scope.tagSelectedString+','+$scope.tagSelected[i];	
				}
			}
		}
		$scope.submitSlideForm = function($event){
			// if($scope.coverImage == ''){
			// 	$scope.showCoverImageRequired = true;
			// 	return;
			// }
			if(!$scope.title){
				$scope.showTitleRequired = true;
				return;
			}
			$scope.slides = {
				title : $scope.title,
				tags : $scope.tagSelected,
				img_url :  $scope.coverImage,
				// type : $scope.postOption
			};
			SlideService.save($scope.slides)
				.success(function(data){
					if(data.status == 'error'){
						$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
						return;
					}
					if($scope.postOption == 'article'){
						$state.go('create/:id',{
							id : data.id
						});
					}else{
						var x = $scope.title.replace(' ','-');
						$state.go('slide/:id/:slug',{
							id : data.id,
							slug : x
						});
					}
					
				});
		}
		$scope.onFileSelect = function($files, item){
				angular.element('#progress').removeClass('hidden');
				if($scope.coverImage){
					DeleteFileService.delete($scope.coverImage).then(function (res){
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
						$scope.coverImage = url;
						$scope.showCoverImageRequired = false;
						$scope.closeProgressBar();
					}).error( function (evt){
						$scope.showCoverImageRequired = false;
						$scope.closeProgressBar();
						return false;
					})
				};
			}
			$scope.closeProgressBar = function(){
				angular.element('#progress').addClass('hidden');
				angular.element('.progress-bar-success').attr('aria-valuenow',0);
				angular.element('.progress-bar-success').css('width',0+'%');
				angular.element('.sr-only').html(0+'% Complete (success)');
			}
			
	}]);