ViaSlide.directive('innerhtml', function(){
		return {
	      restrict: 'A',
	      require: '?ngModel',
	      link: function(scope, element, attrs, ngModel) {
	        if(!ngModel) return;
	        ngModel.$render = function() {
	          element.html(ngModel.$viewValue || '');
	        };
	        element.on('blur keyup change', function(){
	          scope.$apply(read);
	        });
	        read(); 
	        function read() {
	          var html = element.html();
	          if( attrs.stripBr && html == '<br>'){
	            html = '';
	          }
	          ngModel.$setViewValue(html);
	        }
	      }
	    };
	});
// ViaSlide.animation();
		ViaSlide.directive('slideShow', function($compile){
			var style = "'background':{{content.style.background}}; 'background-image':{{content.style.backgroundImage}};'background-size':{{content.style.size}}";
			var divLevelOne = '<div innerhtml class="{{ content.className }}" ng-style="{{ style }}" style="position:relative; background:{{content.style.background}}; background-image:{{content.style.backgroundImage}};background-size:{{contentstyle.size}}" ng-click="$parent.activeElementSelect(content, $index, $event)"><div class="customize-slide" ng-click="$parent.customizeThis(content)"></div><div-child class="div-child" innerhtml ng-repeat="div in $parent.activeSlide.divs track by $index" content="div" style="left:{{div.style.left}}; top:{{div.style.top}}; width:{{div.style.width}}; height:{{div.style.height}}" ng-click="$parent.$parent.$parent.activeElementSelect(content, $parent.$index, $event)"></div-child></div>';
			var divLevelTwo = '<div innerhtml class="{{ content.className }}"></div>';
			var getTemplate = function(divLevel){
					return divLevelOne;
			}
			var linker = function(scope, element, attrs){
					element.html(getTemplate(scope)).show();
					$compile(element.contents())(scope);
			}
			return{
					restrict 	: "E",
					replace 	: "true",
					link 		: linker,
					scope 		: {
								content:'='
							}
				}
		});
		ViaSlide.directive('divChild', function($compile){
			var div = '<div class="bgDiv" ng-style="getActiveSlideBG()"></div><div innerhtml contenteditable="true" class="{{ content.id }} {{ content.style.animation }} movable slideshow-element" style="background:{{content.style.background}}; background-image:{{content.style.backgroundImage}};background-size:{{content.style.size}};font-family:{{content.style.font}}; color:{{content.style.size}}; border: {{content.style.border}}" ng-model="content.desc" ng-click="$parent.$parent.$parent.activeElementSelect(content, $parent.$index, $event)"></div>';
			var getTemplate = function(divLevel){
				console.log(divLevel.content.desc);
				return div;
			}
			var linker = function(scope, element, attrs){
					scope.getActiveSlideBG = function() {
						return {
							backgroundColor : content.style.backgroundColor,
							backgroundImage : content.style.backgroundImage,
							backgroundPosition : content.style.backgroundPosition,
							backgroundSize : content.style.backgroundPosition
						}
					}
					console.log(getTemplate(scope));
					element.html(getTemplate(scope)).show();
					$compile(element.contents())(scope);
			}
			return{
				restrict 	: "E",
				replace 	: "true",
				link 		: linker,
				scope 		: {
								content:'='
							}
			}
		})
		ViaSlide.directive('slideHtml', function($compile){
			var getDiv = function(){
				return 	'<div class="bgDiv" ng-style="getActiveSlideBG()"></div>'+
						'<div innerhtml class="active-slide" ng-html="content.html" id="slide"></div>';
			}
			var linker = function(scope, element, attrs){
				scope.getActiveSlideBG = function() {
					return {
						backgroundColor : scope.content.style.backgroundColor,
						backgroundImage : scope.content.style.backgroundImage,
						backgroundPosition : scope.content.style.backgroundPosition,
						backgroundSize : scope.content.style.backgroundSize
					}
				}
				element.html(getDiv()).show();
				$compile(element.contents())(scope);
			}
			return {
				restrict : "E",
				replace : "true",
				link : linker,
				scope : {
					content : "="
				}
			}
		});
ViaSlide.controller('CreateSlideCtrl', ['$http', '$scope','$compile','$timeout', '$upload', function ($http, $scope, $compile, $timeout, $upload){
	// var slideCtrl = ['$http', '$scope','$compile','$timeout', function ($http, $scope, $compile, $timeout){
		$scope.scrollAnimation = function($event, $delta, $deltaX, $deltaY){
			if($delta < 0){
				var a = $scope.animations.shift();
				$scope.animations.push(a);	
			}else{
				var a = $scope.animations.pop();
				$scope.animations.unshift(a);	
			}
		}
		$scope.scrollFonts = function($event, $delta, $deltaX, $deltaY){
			if($delta < 0){
				var a = $scope.fonts.shift();
				$scope.fonts.push(a);	
			}else{
				var a = $scope.fonts.pop();
				$scope.fonts.unshift(a);	
			}
		}
		$scope.getUlAnimationWidth = function(){
			var c = 0;
			angular.element('.animation').each(function(){
				var w = angular.element(this).width();
				c+= w+8;
			});
			// return c;
			return 3004;
		}
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
		$scope.colors = [
			{name : 'poppins', colorLight : '#F59120', colorDark : ''},
	        {name : 'sushi', colorLight : '#94C23D', colorDark : ''},
	        {name : 'viking', colorLight : '#4C9DCB', colorDark : ''},
	        {name : 'orchid', colorLight : '#C583AC', colorDark : ''},
	        {name : 'flamingo', colorLight : '#DF3921', colorDark : ''},
	        {name : 'haze', colorLight : '#795FA1', colorDark : ''}
		]
		$scope.divSlide = function(){
			return  {
						id 	: 	'',
						type: 'slide',
						className 	: 	'maia-aux',
						style 	: {	background 	: '',
									backgroundImage : ''
							},
							divs : 	[],
							html : '<div></div>'
					}
		};
		$scope.activeSlide = $scope.divSlide();
		$scope.divElement = function(){
			return {
				id 		: 	'',
				type 	: 	'div',
				desc 	: 	'',
				style 	: 	{
					color 	: 	'',
					opacity : 	'',
					font 	: 	'',
					background 	: 	'',
					backgroundImage 	: 	'',
					animation 	: 	'',
					top 	: '',
					left 	: '',
					width 	: '100%',
					height 	: '30%',
					position : 'absolute',
					border 	: ''
				},
			}
		}
		$scope.slides = [];
		var e = $scope.divSlide();
		$scope.slides.push(e);
		var f = $scope.divElement();
		$scope.slides[$scope.activeId].divs.push(f);
		$scope.addSlide = function(){
			var e = $scope.divSlide();
			$scope.slides.push(e);
			$scope.refresh();
			$scope.activeId++;
			$scope.activeSlide = $scope.slides[$scope.activeId];
			var w = $scope.activeSlide.html;
			angular.element('#slide').html(w);
		}
		$scope.getSettingsBGColor = function(color){
			return {
				backgroundColor : color.colorLight
			}
		}
		$scope.activeSlide.color;
		$scope.refresh = function(){
			var w = angular.element('#slide').html();
			$scope.activeSlide.html = w;
			var x = 0;
			angular.element('slide-show').find('div-child').each(function(){
				var h = angular.element(this).css('height');
				$scope.slides[$scope.activeId].divs[x].style.height = h;
				var w = angular.element(this).css('width');
				$scope.slides[$scope.activeId].divs[x].style.width = w;
				var t = angular.element(this).css('top');
				$scope.slides[$scope.activeId].divs[x].style.top = t;
				var l = angular.element(this).css('left');
				$scope.slides[$scope.activeId].divs[x].style.left = l;
				angular.element(this).removeAttr('style');
				x++;
			})
		}
		$scope.secondChild = function(a){
			console.log($scope.activeElement);
			console.log(content);
		}
		$scope.getActiveSlideBG = function() {
			return {
				backgroundColor : $scope.activeSlide.style.backgroundColor,
				backgroundImage : $scope.activeSlide.style.backgroundImage,
				backgroundPosition : $scope.activeSlide.style.backgroundPosition,
				backgroundSize : $scope.activeSlide.style.backgroundPosition
			}
		}
		$scope.cloneMessage = function(servermessage) {
		    var clone ={};
		    for( var key in servermessage ){
		        if(servermessage.hasOwnProperty(key)) //ensure not adding inherited props
		            clone[key]=servermessage[key];
		    }
		    alert(clone);
		    console.log(clone);
		    return clone;
		}
		$scope.removeElement = function(index, $event){
			alert(index);
			$scope.activeSlide.divs.splice(index, 1);
			$event.stopPropagation();
		}
		$scope.activeElementSelect = function(level, index, $event){
			if(level.type == 'slide'){
				angular.element('.activeElement').removeClass('activeElement');
				angular.element($event.currentTarget).addClass('activeElement');
				$scope.slideToolbar = true;
				$scope.divToolbar = false;
			}
			if(level.type == 'div'){
				angular.element($event.currentTarget).focus();
				$scope.slideToolbar = false;
				$scope.divToolbar = true;
			}
			$event.stopPropagation();
		}
		$scope.slideToolbar = true;
		$scope.divToolbar = false;

		$scope.activeSlide = $scope.slides[$scope.activeId];
		$scope.addText = function(){
			var e = $scope.divElement();
			$scope.activeSlide.divs.push(e);
			$scope.activeDiv = 0;
			var a = document.getElementById("slide");
			var c = document.createElement("div");
			$(".activeContent").removeClass('activeContent');
			c.setAttribute('class','textBlock slideshowContent activeContent animated');
			c.setAttribute('data-animate','bounce');
			c.setAttribute('ng-view','true');
			c.setAttribute('style','background:none;width:70%;height:30%;left:10%;top:10%;');
			var d = document.createElement("div");
			d.setAttribute('class','textBack');
			//d.setAttribute('style','background:'+ backgroundColor +'; opacity:'+ opacity +';');
			var e = document.createElement("div");
			e.setAttribute('class','desc');
			e.setAttribute('ng-keyup','checkDimensions()');
			e.setAttribute('ng-click','changeActiveBlock($event)');
			e.setAttribute('contenteditable','true');
			//e.setAttribute('style','color:'+ fontColor +';');
			var f = document.createElement("h2");
			f.setAttribute('style','text-align:center;');
			var g = document.createTextNode('TITLE');
			f.appendChild(g);
			e.appendChild(f);
			c.appendChild(d);
			c.appendChild(e);
			a.appendChild(c);
			$scope.movableDraggable();
		}
		$scope.changeActiveBlock = function(e){
			$('.activeContent').removeClass('activeContent');
			// console.log(e);
			$(e.currentTarget).parent('.slideshowContent').addClass('activeContent');
		}
		$scope.movableDraggable = function(){
			// $('.ui-resizable-handle').remove();
			$('.textBlock').resizable({
     			 containment: "#slide",
     			 resize : function(event, ui){
     			 	console.log(ui.element.height());
     			 }
    			});
			$('.textBlock').draggable({
    			containment: "#slide"
  			});
  			angular.element('.textBlock').mouseup(function(){
    			angular.element(this).find('.desc').focus();
    			// angular.element(this).draggable('disable');
    		});
    		$compile('#slide')($scope);

				
   //  		angular.element('.textBlock').mouseup(function(){
   //  			angular.element(this).find('.desc').focus();
   //  			angular.element(this).draggable('disable');
   //  			angular.element(this).removeClass('ui-state-disabled');
   //  			angular.element(this).resizable('disable');
   //  		});
   //  		angular.element('.textBlock').dblclick(function(){
			// 	angular.element(this).draggable('enable');
			// 	angular.element(this).resizable('enable');
			// });
		}
		$scope.showBgOptions = false;
		$scope.toggleBgOptions = function($event) {
			if($scope.showBgOptions){
				$scope.showBgOptions = false;
			}else{
				$scope.showBgOptions = true;
			}
			$event.stopPropagation();
		}
		$scope.getAnimationObject = function (animationName) {
			for (var i = $scope.animations.length - 1; i >= 0; i--) {
				if($scope.animations[i].name == animationName)
					return $scope.animations[i];
			};
		}
		$scope.selectAnimation = function(animation){
			var a = angular.element('.activeContent').attr('data-animate');
			if(a){
				a = $scope.getAnimationObject(a);
				angular.element('.activeContent').removeClass(a.in);
				angular.element('.activeContent').removeClass(a.out);
			}
			var x = JSON.stringify(animation);
			console.log(x);
			angular.element('.activeContent').attr('data-animate',animation.name);
			angular.element('.activeContent').addClass(animation.in);
			$scope.showToolbar = false;
		}
		$scope.setBgImageSize = function (opt) {
			$scope.activeSlide.style.backgroundSize = opt;
			$scope.showBgOptions = false;
		}
		$scope.activeAnimationSelection  = function(animation){
			// var a = angular.element('.activeContent').attr('data-animate');
			// console.log(a);
			// if(a){
			// 	a = JSON.parse(a);
			// 	if(a.in == animation.in){
			// 		return true;
			// 	}
			// }
			// else{
			// 	return false;
			// }
		}
		$scope.removeBgImage = function () {
			$scope.activeSlide.style.backgroundImage = '';
			$scope.activeSlide.style.backgroundSize = '';
			$scope.activeSlide.style.backgroundPosition = '';
		}
		console.log($scope.activeSlide.style.backgroundImage);
		$scope.checkDimensions = function(){
			var h = angular.element('.activeContent').height();
			h = h+30;
    		angular.element('.activeContent').parent('.textBlock').css('height',h+'px');
		}
		$scope.selectFont = function(font){
			console.log(font);
		}
		$scope.prevSlide = function(){
			var x = angular.element('.active-slide').html();
			$scope.activeSlide.html = x;
			if($scope.slides.length > 1){
				$scope.slides[$scope.activeId] = $scope.activeSlide;
				$scope.activeId--;
				$scope.activeSlide = $scope.slides[$scope.activeId]
			}
			var x = $scope.activeSlide.html;
			$compile(x);
			angular.element('.active-slide').html(x);
			$scope.movableDraggable();
		}
		$scope.nextSlide = function(){
			var x = angular.element('.active-slide').html();
			$scope.activeSlide.html = x;
			$('.active-slide .slideshowContent .desc').each(function () {
				var e = $(this).attr('data-animate');
				for (var i = $scope.animations.length - 1; i >= 0; i--) {
					if($scope.animations[i].name == e){
						$(this).removeClass($scope.animations[i].in);
						$(this).addClass($scope.animations[i].out);
					}
				};
			});
			if($scope.slides.length > ($scope.activeId+1)){
				$timeout(function () {
						$scope.slides[$scope.activeId] = $scope.activeSlide;
						$scope.activeId++;
						$scope.activeSlide = $scope.slides[$scope.activeId];
						var x = $scope.activeSlide.html;
						angular.element('.active-slide').html(x);
						$scope.movableDraggable();
				},1000)
				$timeout(function () {
						$('.active-slide .slideshowContent').each(function () {
							var e = $(this).attr('data-animate');
							for (var i = $scope.animations.length - 1; i >= 0; i--) {
								if($scope.animations[i].name == e){
									$(this).removeClass($scope.animations[i].out);
									$(this).addClass($scope.animations[i].in);
								}
							};
						});
				},1000)
			}
		}
		angular.element('body').click(function () {
			$scope.showBgOptions = false;
		})
		$scope.hideOpenOptions = function () {
			// $scope.showBgOptions = false;
		}
		/*File Handling*/
		$scope.onFileSelect = function($files, item){
			angular.element('#progress').removeClass('hidden');
			// if($scope.activeSlide.url){
			// 	DeleteFileService.delete($scope.activeSlide.url).then(function (res){
			// 	});
			// }
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
					var url = '/hs/public/data/'+evt;
					// $timeout(function() {
						$scope.activeSlide.style.backgroundImage = 'url('+url+')';
						$scope.activeSlide.style.backgroundSize = 'cover';
						$scope.activeSlide.style.backgroundPosition = '50% 50%';
					// }, 20);
					// console.log($scope.activeSlide);
					// $scope.imageUrl = url;
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
		/*File Handling Ends*/
		$scope.events = function(){
			angular.element('.active-slide .textBlock').resizable({
     			 containment: "#slide"
    			}).draggable({
    			containment: "#slide"
  			});
   		}
		$scope.removeSlide = function(){
			$scope.slides.splice($scope.activeId,1);
			$scope.activeId--;
		}
		$scope.elementToolBarMenu = function(a){
			$scope.elementToolbarMenuHeading = a;
		}
  		$scope.sectionToolBarMenu = function(a){
  			$scope.toolbarMenuHeading = a;
  		}
  		$scope.toolbarMenuHeading = 'content';
  		$scope.showToolbar = false;
  		$scope.realignEnabled = false;
  		$scope.toolbarOptions = ['bg'];
		$scope.activateToolbar = function(a){
			if($scope.showToolbar == true){
				$scope.showToolbar = false;
			}else{
				$scope.showToolbar = true;
				$scope.toolbarMenuHeading = a;
			}
			$scope.toggleToolbarOptions(a);
		}
		
		$scope.toggleToolbarOptions = function (a) {
			
		}
		$scope.closeToolbar = function(){
			$scope.showToolbar = false;
		}
		$scope.disableRealign = function(){
			$scope.realignEnabled = false;
		}
		$scope.selectBkgColor = function(color){
			$scope.activeSlide.style.backgroundColor = color.colorLight;
			$scope.changeTheSwatch('changeBGC', color.colorLight);
		}
		$timeout(function(){
			angular.element('#editor').html('<slide-html content="activeSlide"></slide-html>');
			$compile(angular.element('#editor'))($scope);
		},200)
		$scope.x = 0;
		$scope.y = 0;
		$scope.enableRealign = function(){
			$scope.realignEnabled = true;
			angular.element( "div-child" ).resizable({
     			 containment: ".maia-aux"
    			}).draggable({
    			containment: ".maia-aux"
  			});
		}
		$scope.customizeThis = function(content){
			console.log(content);
		}
		$scope.refreshSwatch = function() {
			var a = this.parentNode.getAttribute("data-target");
			var b = this.parentNode.getAttribute("id");
			var red = $( "#"+b+" .red" ).slider("value"),
			  green = $( "#"+b+" .green" ).slider("value"),
			  blue = $( "#"+b+" .blue" ).slider("value"),
			  hex = hexFromRGB(red, green, blue);
			if(a=='changeBackGClr'){
				$timeout(function(){
		  			$scope.activeSlide.style.backgroundColor = '#'+hex;
		  		},20);
			}
			if(a=='changeBGCS'){
			  backgroundColor = "#"+hex;
			}
			if(a=='changeFontColor'){
			  fontColor = "#"+hex;
			}
			if(a=='fontColor'){
			  formatDoc('forecolor',"#" + hex);
			  editFocus();
			}
			$( "#"+b+" .swatch" ).css( "background", "#" + hex );
			if(a=='textBack'){
				if($('.activeContent').hasClass('textBlock')){
				  $('.activeContent .textBack').css('background',"#" + hex);  
				}
				else{
				  $('.activeContent').css('background',"#" + hex);
				}
			}
		}
		$scope.changeTheSwatch = function (id, hex){
		  var h = hex;
		  var r = hexToR(h);
		  var g = hexToG(h);
		  var b = hexToB(h);
		  //$( "#"+id+" .swatch" ).css( "background", hex );
		  $( "#"+id+" .red" ).slider( "value", r );
		  $( "#"+id+" .green" ).slider( "value", g );
		  $( "#"+id+" .blue" ).slider( "value", b );
		  // $( ".red, .green, .blue" ).slider().slide();
  		}
		$( ".red, .green, .blue" ).slider({
		      orientation: "horizontal",
		      range: "min",
		      max: 255,
		      value: 127,
		      slide: $scope.refreshSwatch,
		      change: $scope.refreshSwatch
		  });
		  $( ".red" ).slider( "value", 200 );
		  $( ".green" ).slider( "value", 200 );
		  $( ".blue" ).slider( "value", 200 );
		  $( "#changeFCS .red" ).slider( "value", 60 );
		  $( "#changeFCS .green" ).slider( "value", 60 );
		  $( "#changeFCS .blue" ).slider( "value", 60 );
		  $( "#changeFC .red" ).slider( "value", 60 );
		  $( "#changeFC .green" ).slider( "value", 60 );
		  $( "#changeFC .blue" ).slider( "value", 60 );

	}]);
function hexFromRGB(r, g, b) {
  var hex = [
    r.toString( 16 ),
    g.toString( 16 ),
    b.toString( 16 )
  ];
  $.each( hex, function( nr, val ) {
    if ( val.length === 1 ) {
      hex[ nr ] = "0" + val;
    }
  });
  return hex.join( "" ).toUpperCase();
}
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

