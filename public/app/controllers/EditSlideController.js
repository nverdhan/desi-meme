ViaSlide.directive('media', function($compile){
	var imageDiv = '<!--div class="media-container"--><img class="img-responsive" src="{{ content.url }}"><!--/div-->';
	var soundCloudDiv = '';
	var vimeoDiv = '';
	var youtubeDiv = '<object width="640" height="390"><param name="movie" value="https://www.youtube.com/v/ytVideoId?version=3&autoplay=1"></param><param name="allowScriptAccess" value="always"></param><embed src="https://www.youtube.com/v/ytVideoId?version=3&autoplay=1" type="application/x-shockwave-flash" allowscriptaccess="always" width="640" height="390"></embed></object>';
	var iyt = '<iframe id="ytplayer" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/ytVideoId?autoplay=0&origin=http://example.com" frameborder="0"/>'
	var getTemplete = function(scope){
		if(scope.content.type == 'Image'){
			return imageDiv;
		}else if(scope.content.type == 'YouTubeVideo'){
			var s = iyt.replace('ytVideoId', scope.content.url);
			return s;
		}else if(scope.content.type == 'VimeoVideo'){
			return vimeoDiv;
		}else if(scope.content.type == 'SoundCloudAudio'){
			return soundCloudDiv;
		}
	}
	var linker = function(scope, element, attrs){
		element.html(getTemplete(scope)).show();
		$compile(element.contents())(scope);
	}
	return{
		restrict: 'E',
		replace : 'true',
		link : linker,
		scope : {
			content : '='
		}
	}
});
ViaSlide.factory('EditSlideService', ['$http', function ($http){
	return {
		save :  function(slideData){
				var data  = $.param(slideData);
				return $http({
							method : 'POST',
							url : ApiPrefix+'/api/editslide',
							headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
							data : $.param(slideData)
						}).then(function(res){
							var data = res;
							return res;
						});
					}
				}
}]);
ViaSlide.controller('EditSlideCtrl', ['$http','$scope','$upload','$stateParams','AuthService','EditSlideService','SlideService','DeleteFileService', function ($http, $scope, $upload, $stateParams, AuthService, EditSlideService, SlideService, DeleteFileService) {
		$scope.postId = $stateParams.id;
		$scope.activeId = 0;
		$scope.activeElement = 0;
		$scope.colors = [
			{ position 	: 	'0px 0px' },
  			{ position 	: 	'0px -37px' },
  			{ position 	: 	'0px -74px' },
  			{ position 	: 	'0px -111px' },
  			{ position 	: 	'0px -148px' },
  			{ position 	: 	'-37px 0px' },
  			{ position 	: 	'-37px -37px' },
  			{ position 	: 	'-37px -74px' },
  			{ position 	: 	'-37px -111px' },
  			{ position 	: 	'-37px -148px' },
  			{ position 	: 	'-74px 0px' },
  			{ position 	: 	'-74px -37px' },
  			{ position 	: 	'-74px -74px' },
  			{ position 	: 	'-74px -111px' },
  			{ position 	: 	'-74px -148px' },
  			{ position 	: 	'-111px 0px' },
  			{ position 	: 	'-111px -37px' },
  			{ position 	: 	'-111px -74px' }
  		];
  		$scope.fonts = [
  			{font:'Questrial'},
			{font:'Dosis'},
			{font:'Abel'},
			{font:'Ubuntu+Mono'},
			{font:'Crafty+Girls'},
			{font:'Yellowtail'},
			{font:'Permanent+Marker'},
			{font:'Just+Another+Hand'},
			{font:'Lato'},
			{font:'Arvo'},
			{font:'Cabin'},
			{font:'News+Cycle'},
			{font:'Lora'},
			{font:'PT+Sans'},
			{font:'Poiret+One'},
			{font:'Syncopate'},
			{font:'Philosopher'},
			{font:'Quicksand'},
			{font:'Paytone+One'},
			{font:'Oleo+Script'},
			{font:'Marck+Script'},
			{font:'Josefin+Sans'},
			{font:'Bitter'},
			{font:'PT+Serif'},
			{font:'Lobster'},
			{font:'Kreon'},
			{font:'Waiting+for+the+Sunrise'},
			{font:'Reenie+Beanie'},
			{font:'Shadows+Into+Light'},
			{font:'Rokkitt'},
			{font:'Josefin+Slab'},
			{font:'Libre+Baskerville'},
			{font:'Walter+Turncoat'},
			{font:'Sigmar+One'},
			{font:'Gloria+Hallelujah'},
			{font:'Calligraffitti'},
			{font:'Asap'},
			{font:'Tangerine'},
			{font:'Great+Vibes'},
			{font:'Ubuntu+Condensed'},
			{font:'Open+Sans'},
			{font:'Roboto'},
			{font:'Open+Sans+Condensed:300'},
			{font:'Montserrat'},
			{font:'Yanone+Kaffeesatz'},
			{font:'Merriweather'},
			{font:'Indie+Flower'},
			{font:'Play'},
			{font:'Varela+Round'},
			{font:'Pacifico'},
			{font:'Hammersmith+One'},
			{font:'Alegreya'},
			{font:'Dancing+Script'},
			{font:'Coming+Soon'},
			{font:'Special+Elite'},
			{font:'Playball'},
			{font:'Old+Standard+TT'},
			{font:'Chewy'},
			{font:'Patua+One'},
			{font:'Voltaire'},
			{font:'Bangers'},
			{font:'Rock+Salt'},
			{font:'Luckiest+Guy'},
			{font:'Amatic+SC'},
			{font:'Shadows+Into+Light+Two'},
			{font:'Lobster+Two'},
			{font:'Playfair+Display+SC'},
			{font:'Orbitron'},
			{font:'Satisfy'},
			{font:'Cinzel'},
			{font:'Exo+2'},
			{font:'Architects+Daughter'},
			{font:'Marvel'},
			{font:'Love+Ya+Like+A+Sister'},
			{font:'Covered+By+Your+Grace'},
			{font:'Pinyon+Script'},
			{font:'Kaushan+Script'},
			{font:'Damion'},
			{font:'Rancho'},
			{font:'Berkshire+Swash'}
		];
		$scope.animations = [
			{ name : 'bounce', in : 'bounce', out : ''},
			{ name : 'flash', in : 'flash', out : ''},
			{ name : 'pulse', in : 'bounce', out : ''},
			{ name : 'rubberBand', in : 'rubberBand', out : ''},
			{ name : 'shake', in : 'shake', out : ''},
			{ name : 'swing', in : 'swing', out : ''},
			{ name : 'tada', in : 'tada', out : ''},
			{ name : 'wobble', in : 'wobble', out : ''},
			{ name : 'bounce', in : 'bounceIn', out : 'bounceOut'},
			{ name : 'bounceLeft', in : 'bounceInLeft', out : 'bounceOutLeft'},
			{ name : 'bounceRight', in : 'bounceInRight', out : 'bounceOutRight'},
			{ name : 'bounceUp', in : 'bounceInUp', out : 'bounceOutUp'},
			{ name : 'bounceDown', in : 'bounceInDown', out : 'bounceOutDown'},
			{ name : 'fade', in : 'fadeIn', out : 'fadeOut'},
			{ name : 'fadeDown', in : 'fadeInDown', out : 'fadeOutDown'},
			{ name : 'fadeDownBig', in : 'fadeInDownBig', out : 'fadeOutDownBig'},
			{ name : 'fadeLeft', in : 'fadeInLeft', out : 'fadeOutLeft'},
			{ name : 'fadeLeftBig', in : 'fadeInLeftBig', out : 'fadeOutLeftBig'},
			{ name : 'fadeRight', in : 'fadeInRight', out : 'fadeOutRight'},
			{ name : 'fadeRightBig', in : 'fadeInRightBig', out : 'fadeOutRightBig'},
			{ name : 'fadeUp', in : 'fadeInUp', out : 'fadeOutUp'},
			{ name : 'fadeUpBig', in : 'fadeInUpBig', out : 'fadeOutUpBig'},
			{ name : 'flip', in : 'flip', out : ''},
			{ name : 'flipX', in : 'flipInX', out : 'flipOutX'},
			{ name : 'flipY', in : 'flipInY', out : 'flipOutY'},
			{ name : 'lightSpeed', in : 'lightSpeedIn', out : 'lightSpeedOut'},
			{ name : 'rotate', in : 'rotateIn', out : 'rotateOut'},
			{ name : 'rotateDownLeft', in : 'rotateInDownLeft', out : 'rotateOutDownLeft'},
			{ name : 'rotateDownRight', in : 'rotateInDownRight', out : 'rotateOutDownRight'},
			{ name : 'rotateUpLeft', in : 'rotateInUpLeft', out : 'rotateOutUpLeft'},
			{ name : 'rotateUpRight', in : 'rotateInUpRight', out : 'rotateOutUpRight'},
			{ name : 'slideDown', in : 'slideInDown', out : 'slideOutUp'},
			{ name : 'slideLeft', in : 'slideInRight', out : 'slideOutLeft'},
			{ name : 'slideRight', in : 'slideInRight', out : 'slideOutRight'},
			{ name : 'roll', in : 'rollIn', out : 'rollOut'},
			{ name : 'hinge', in : '', out : 'hinge'}
			];
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
			source : '',
			description : '',
		};
		$scope.imgOption = 'local';
		var e = {}
		$scope.addSlide = function($event){
			if($scope.activeId > -1){
				$scope.slides[$scope.activeId] = $scope.activeSlide;	
			}
			if(($scope.activeId > -1) && (!$scope.activeSlide.type)){
				 alert('select media first for current slide');
				 return;
			}
			var a = {};
			for( var key in $scope.slideObj ){
		        if($scope.slideObj.hasOwnProperty(key))
		        	a[key] = $scope.slideObj[key];
		    }
		    $scope.slides.push(a);
			$scope.activeId++;
		    $scope.activeSlide = a;
			$scope.activeSlide = $scope.slides[$scope.activeId];
		}
		$scope.updateSlides = function(){
			SlideService.get($scope.postId)
				.success(function(data){
				var slide = angular.fromJson(data.postContent);
				if(slide.length == 0){
					$scope.slides = [];
					$scope.activeId = -1;
					$scope.addSlide();
				}else{
					$scope.slides = [];
					angular.forEach(slide, function (key, value){
						this.push(angular.fromJson(key))
					}, $scope.slides);
					$scope.activeId = 0;
					$scope.activeSlide = $scope.slides[$scope.activeId];
				}
			});
		}
		$scope.updateSlides();
		$scope.refreshActiveSlide = function(){
			if($scope.activeSlide > $scope.slides.length){
				$scope.activeSlide = $scope.slides.length;
			}
			$scope.activeSlide = $scope.slides[$scope.activeId];
		}
		$scope.secondChild = function(a){
			
		}
		$scope.cloneMessage = function(servermessage) {
		    var clone ={};
		    for( var key in servermessage ){
		        if(servermessage.hasOwnProperty(key)) //ensure not adding inherited props
		            clone[key]=servermessage[key];
		    }
		    return clone;
		}
		$scope.saveSlide = function(){
			var slideData = {
				id : $scope.postId,
				status : 1,
				data : $scope.slides,
				deletedSlides : $scope.deletedSlides
			}
			var l = $scope.slides.length-1;
			if(!$scope.slides[l].type){
				$scope.slides.splice(l,1);
			}
			angular.element('.saving-progress').removeClass('hidden');
			EditSlideService.save(slideData).then(function (res){
				$scope.updateSlides();
				angular.element('.saving-progress').addClass('hidden');
			});
		}
		$scope.publishSlide = function(){
			var slideData = {
				id : $scope.postId,
				status : 1,
				data : $scope.slides,
				deletedSlides : $scope.deletedSlides
			}
			var l = $scope.slides.length-1;
			if(!$scope.slides[l].type){
				$scope.slides.splice(l,1);
			}
			EditSlideService.save(slideData);
		}
		$scope.addText = function(){
			var e = $scope.activeSlide.divs.length;
			var a = {};
			for( var key in $scope.divElement ){
		        if($scope.divElement.hasOwnProperty(key))
		        	a[key] = $scope.divElement[key];
		    }
			$scope.activeElement = e;
			a.id = e;
			var b = {};
			for( var key in $scope.divElement.style ){
		        if($scope.divElement.style.hasOwnProperty(key))
		    	    b[key] = $scope.divElement.style[key];
		    }
		    b.height = '';
			a.style = b;
			$scope.activeSlide.divs.push(a);
			$scope.activeElement = e;
			if(e==2){
				$scope.changeColor();	
			}
		}
		$scope.selectFont = function(font){
			
		}
		$scope.prevSlide = function(){
			if($scope.activeId>0){
				$scope.activeId--;
				$scope.activeSlide = $scope.slides[$scope.activeId]
			}
		}
		$scope.nextSlide = function(){
			if($scope.slides.length > ($scope.activeId+1)){
				$scope.activeId++;

				$scope.activeSlide = $scope.slides[$scope.activeId];
			}
		}
		$scope.removeSlide = function(){
			if($scope.slides.length > 1){
				console.log($scope.activeSlide);
				if($scope.activeSlide.id){
					$scope.deletedSlides.push($scope.activeSlide.id);
				};
				$scope.slides.splice($scope.activeId,1);
				if($scope.slides.length == $scope.activeId){
					$scope.activeId--;
				}
				$scope.refreshActiveSlide();
			}
		};
		$scope.elementToolBarMenu = function(a){
			$scope.elementToolbarMenuHeading = a;
		}
  		$scope.sectionToolBarMenu = function(a){
  			$scope.toolbarMenuHeading = a;
  		}
  		$scope.toolbarMenuHeading = 'content';
  		$scope.showToolbar = true;
  		$scope.realignEnabled = false;
		$scope.activateToolbar = function(){
			$scope.showToolbar = true;
		}
		$scope.closeToolbar = function(){
			$scope.showToolbar = false;
		}
		$scope.disableRealign = function(){
			$scope.realignEnabled = false;
		}
		$scope.selectBkgColor = function(color){
			$scope.activeSlide.style.background = "#fff";
		}
		
		$scope.x = 0;
		$scope.y = 0;
		$scope.enableRealign = function(){
			$scope.realignEnabled = true;
			angular.element( ".div-child" ).resizable({
     			 	containment: ".maia-aux"
    			}).draggable({
    				containment: ".maia-aux"
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
