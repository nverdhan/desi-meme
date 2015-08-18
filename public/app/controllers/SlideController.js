ViaSlide.controller('SlideCtrl', ['$scope','$rootScope', '$http', '$upload', 'CommentService','$location','$stateParams','SlideService','EditSlideService','DeleteFileService', function ($scope, $rootScope, $http, $upload, CommentService, $location, $stateParams, SlideService, EditSlideService, DeleteFileService) {
		$scope.postId = $stateParams.id;
		$scope.commentData = {
			post: '',
			comment : ''
		}
		$scope.loading = true;
		$scope.commentsPage = 1;
		$scope.activeId = 0;
		$scope.showAddComment = false;
		$scope.comment = '';
		$scope.activeSlide = {
		}
		$scope.prevStack = [];
		$scope.nextStack = [];
		$scope.slidesStack = [];
		$scope.postOption = 'article';
		$scope.showSlides = false;
		$scope.invalidYoutubeLink = false;
		$scope.invalidImageURL = false;
		$scope.noImage = false;
		$scope.showModal = false;
		$scope.showYtModal = false;
		$scope.showImageModal = false;
		$scope.selectImage = false;
		$scope.deletedSlides = [];
		$scope.slideObj = {
			id : '',
			title : '',
			type 	: '',
			url 	: '',
			description : '',
		};
		$scope.activeSlide = $scope.slideObj;
		$scope.imgOption = 'local';
		$scope.showSlides = false;
		$scope.url =  $location.absUrl();
		$(window).unbind('scroll');
		$scope.updateResults = function(){
			SlideService.get($scope.postId)
			.success(function(res){
				var slide = angular.fromJson(res.slide);
				$scope.title = slide.post;
				$rootScope.title = slide.post+' - ';
				$scope.img_url = slide.img_url;
				$scope.slideViews = slide.views;
				$scope.slideType = slide.type;
				$scope.slides = [];
					angular.forEach(angular.fromJson(res.postContent), function (key, value){
						this.push(angular.fromJson(key))
					}, $scope.slides);
				if($scope.slides.length > 0){
					$scope.showSlides = true;
				}
				$scope.related = [];
				$scope.prevStack = [];
				$scope.nextStack = [];
				angular.forEach($scope.slides, function (key, value){
					this.push(key);
				}, $scope.nextStack);
				$scope.nextStack.shift();
				var i = 0;
				angular.forEach(res.related, function (key, value){
					if(i==5)
						return;
					this.push(angular.fromJson(key));
					i++;
				}, $scope.related);
				$scope.userInfo = slide.user;
				$scope.tags = angular.fromJson(slide.tags);
				$scope.date = $scope.ago(slide.created_at);
				if($scope.slides.length > 0){
					CommentService.get($scope.slides[$scope.activeId].id, $scope.commentsPage)
					.success(function(data){
						$scope.comments = data;
						$scope.loading = false;
					});	
				}
				$scope.activeId = 0;	
			});	
		}
		$scope.updateResults();
		$scope.cancelAddPost = function(){
			$scope.showAddSlide = false;
			$scope.showSlides = true;
		};
		$scope.showAddPost = function(){
			if($scope.currentUser.id){
				if($scope.showAddSlide == false){
					$scope.showAddSlide = true;
					$scope.showSlides = false;
				}else{
					$scope.showAddSlide = true;
					$scope.showSlides = false;
				}
			}else{
				$scope.showLogin();
			}
		}
		$scope.saveSlide = function(){
			if(!$scope.activeSlide.type){
				alert('select media first');
				return false;
			}
			if($scope.activeSlide.description == 'sub-title'){
				$scope.activeSlide.description = '';
			}
			var a = [];
			a.push($scope.activeSlide);
			var slideData = {
				id : $scope.postId,
				status : 1,
				data : a,
			}
			angular.element('.saving-progress').removeClass('hidden');
			EditSlideService.save(slideData).then(function (res){
				$scope.showAddSlide = false;
				$scope.showSlides = true;
				$scope.activeSlide = {
					id : '',
					title : '',
					type 	: '',
					url 	: '',
					description : '',
				}
				$scope.updateResults();
				angular.element('.saving-progress').addClass('hidden');
			});
		}
		$scope.showNextBtn = function(){
			if($scope.slides){
				if($scope.activeId == $scope.slides.length-1){
					return false;
				}else{
					return true;
				}	
			}else{
				return false;
			}
		}
		$scope.showPrevBtn = function(){
			if($scope.activeId == 0){
				return false;
			}else{
				return true;
			}
		}
		$scope.align = function(){
			var wprev = angular.element('.prev-slide').css('width');
			console.log(wprev);
			var wpresent = angular.element('.present-slide').css('width');
			console.log(wpresent);
			var wnext = angular.element('.next-slide').css('width');
			console.log(wnext);
			var left = ($scope.wstrip-$scope.getDimensionInNo(wpresent))/2;
			left = left-($scope.getDimensionInNo(wprev))
			angular.element('.inner-strip').css('left',left);
		}
		$scope.goNextSlide = function(){
			if($scope.slides){
				if($scope.activeId == $scope.slides.length-1){
					return false;
				}
			}
			$scope.prevStack.push($scope.slides[$scope.activeId]);
			$scope.nextStack.shift();
			$scope.activeId++;
			CommentService.get($scope.slides[$scope.activeId].id, $scope.commentsPage)
				.success(function(data){
					$scope.comments = data;
					$scope.loading = false;
			});
		}
		$scope.goPrevSlide = function(){
			if($scope.slides){
				if($scope.activeId == 0){
					return false;
				}
			}
			$scope.nextStack.unshift($scope.slides[$scope.activeId]);
			$scope.prevStack.pop();
			$scope.activeId--;
			CommentService.get($scope.slides[$scope.activeId].id, $scope.commentsPage)
				.success(function(data){
					$scope.comments = data;
					$scope.loading = false;
			});
		}
		$scope.ago = function (time){
		    var periods = ["second", "minute", "hour", "day", "week", "month", "year", "decade"];
		    var lengths = ["60","60","24","7","4.35","12","10"];
		    var t = time.split(/[- :]/);
			var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
		    var time = Math.round(d/1000);
		    var now = Math.round(+new Date()/1000);
		    var difference     = now - time;
		    var tense         = "ago";
		    for(var j = 0; difference >= lengths[j] && j < lengths.length-1; j++) {
		       difference /= lengths[j];
		    }
		    difference = Math.round(difference);
		    if(difference != 1) {
		       periods[j]+= "s";
		    }
		    return difference+' '+periods[j]+' ago';
		}
		$scope.showSlide = function(slide){
			return ($scope.slides.indexOf(slide) == $scope.activeId);
		}
		$scope.commentLoginOption = function(){
			if($scope.currentUser.id){
				if($scope.showAddComment == false){
					$scope.showAddComment = true;
				}else{
					$scope.showAddComment = false;
				}
			}else{
				$scope.showLogin();
			}
		}
		$scope.submitComment = function(comment){
			if(comment == ''){
				console.log(comment);
				return;
			}
			$scope.loading = true;
			$scope.commentData.post = $scope.slides[$scope.activeId].id;
			$scope.commentData.comment = comment;
			angular.element('.saving-progress').removeClass('hidden');
			CommentService.save($scope.commentData)
				.success(function(data){
					CommentService.get($scope.slides[$scope.activeId].id, $scope.commentsPage)
						.success(function(getData) {
							$scope.comments = getData;
							$scope.loading = false;
							angular.element('#comment-input').val('');
							angular.element('.saving-progress').addClass('hidden');
					});
				})
				.error(function(data) {
					console.log(data);
				});
				$scope.comment = '';
		};
		$scope.getDimensionInNo = function(x){
			var a = x.split('px');
			return a[0];
		};
		$scope.ulLeft = function(){
			var w = $(window).width()/2;
			var a = $scope.slides.length;
			var z = 140*($scope.activeId+1)+40;
			w = w-z;
			return w+'px';
		}
		$scope.deleteComment = function(id) {
			$scope.loading = true; 
			CommentService.destroy(id)
				.success(function(data) {
					Comment.get()
						.success(function(getData) {
							$scope.comments = getData;
							$scope.loading = false;
						});

				});
		}
		$scope.onFileSelect = function($files, item){
				angular.element('#progress').removeClass('hidden');
				if($scope.activeSlide.url){
					DeleteFileService.delete($scope.activeSlide.url).then(function (res){
					});
				}
				for (var i = 0; i < $files.length; i++) {
					var file = $files[i];
					var a = file.type;
					var x = a.split('/');
					if(x[0] != 'image'){
						$scope.noImage = true;
						$scope.closeProgressBar();
						return;
					}
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
						$scope.activeSlide.type = 'Image';
						$scope.activeSlide.url = url;
						$scope.imageUrl = url;
						$scope.closeProgressBar();
						//$scope.clodeImageModal();
					}).error( function (evt){
						$scope.closeProgressBar();
						$scope.clodeImageModal();
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
			$scope.customizeThis = function(content){
			}
			$scope.insertYouTubeLink = function(link){
				var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
 				var x = (link.match(p)) ? RegExp.$1 : false;
 				if(x == false){
 					$scope.invalidYoutubeLink = true;
 				}else{
 					$scope.activeSlide.type = 'YouTubeVideo';
 					$scope.activeSlide.url = x;
 					$scope.closeModal();
 				}
			}
			$scope.insertImageLink = function(imageUrl, imageSrc){
				if($scope.imgOption == 'web'){
					var p = '(http(s?):)|([/|.|\w|\s])*\.(?:jpe?g|gif|png)';
					var x = (imageUrl.match(p)) ? RegExp.$1 : false;
					if(x == false){
						$scope.invalidImageURL = true;
						return false;
					}
				}
				if($scope.imgOption == 'local'){

					if(!$scope.imageUrl){
						console.log(9999);
						$scope.selectImage = true;
						return false;
					}	
				}
				$scope.activeSlide.type = 'Image';
				$scope.activeSlide.url = imageUrl;
				$scope.activeSlide.source = imageSrc;
				$scope.clodeImageModal();
				$scope.imageUrl = '';
				$scope.imageSrc = '';
			}
			/*$scope.insertImageLink = function(imgURL){
				var p = '(http(s?):)|([/|.|\w|\s])*\.(?:jpe?g|gif|png)';
				var x = (imgURL.match(p)) ? RegExp.$1 : false;
				if(x == false){
					$scope.invalidImageURL = true;
					return false;
				}else{
					$scope.activeSlide.type = 'Image';
 					$scope.activeSlide.url = imgURL;
 					$scope.clodeImageModal();
				}
			}*/
			$scope.closeModal = function(){
				$scope.showModal = false;
				$scope.showYtModal = false;
				
			}
			$scope.insertYtLink = function(){
				$scope.showModal = true;
				$scope.showYtModal = true;
			}
			$scope.insertImgLink = function(){
				$scope.showModal = true;
				$scope.showImageModal = true;
			}
			$scope.clodeImageModal = function(){
				$scope.showModal = false;
				$scope.noImage = false;
				$scope.invalidImageURL = false;
				$scope.showImageModal = false;
			}
}]);