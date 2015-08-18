var ApiPrefix = 'server.php';
var ViaSlide = angular.module('ViaSlide', ['ng','ngAria','ngCookies','angularFileUpload', 'ui.router', 'ngProgress', 'ngSocial','wysiwyg.module']);
// ViaSlide.config(function($sceProvider) {
//   $sceProvider.enabled(false);
// });
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
ViaSlide.controller('ViaSlideCtrl', ['$rootScope', '$state', '$scope', 'USER_ROLES', 'AuthService', 'Session', 'AUTH_EVENTS', '$window', 'ngProgress', '$cookieStore', function ($rootScope, $state, $scope, USER_ROLES, AuthService, Session, AUTH_EVENTS, $window, ngProgress, $cookieStore){
	var credentials = {
		id : $cookieStore.get('userId')
	}
	if(!credentials.id){
		$cookieStore.put('userId', 'anon')
	}
	AuthService.getCredentials(credentials).then(function(res){
		if(res.status == 'success'){
			$scope.currentUser = res.user;
			Session.create(res.status, res.user.id, res.user.role);
		}else if(res.status == 'error'){
			$scope.currentUser = {
				id : ''
			};
			Session.destroy();
		};
	});
	$scope.userRoles = USER_ROLES;
	$scope.setCurrentUser = function (user){
		$scope.currentUser = user;
		if($cookieStore.get('userId') == 'anon'){
			$cookieStore.put('userId', user.id);	
		}
	}
	$scope.signOut = function(){
		$scope.currentUser = {
				id : ''
			};
		$cookieStore.remove('userId');
		AuthService.logOut().then(function(res){
			if($state.current.data.requiresAuth && (!$scope.currentUser.id)){
				$state.go('home');
			}
		});
	}
	$scope.OverlayVisible = false;
	$scope.loginRequired = function(){
		$scope.OverlayVisible = true;
	}
	$scope.exitLogin = function(){
		if($state.current.data.requiresAuth && (!$scope.currentUser.id)){
			$state.go('home');
		}
		$scope.OverlayVisible = false;
	}
	$scope.showSearchDialog = false;
	$scope.hideSearchDialog = function(){
		$scope.searchDialogVisible = false;
	}
	$scope.showLogin = function(){		
		$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

	}
	$scope.showInternalServerError = function(){
		//alert(890);
	}
	$scope.notFound = function(){
	}
	$scope.$on(AUTH_EVENTS.internalServerError, $scope.showInternalServerError);
	$scope.$on(AUTH_EVENTS.notFound, $scope.shownotFound);
	$scope.$on(AUTH_EVENTS.notAuthenticated, $scope.loginRequired);
    $scope.$on(AUTH_EVENTS.sessionTimeout, $scope.loginRequired);
    $scope.$on(AUTH_EVENTS.loginSuccess, $scope.exitLogin);
    
}]);
ViaSlide.run( ['$rootScope', '$state', 'AUTH_EVENTS', 'AuthService', 'Session', 'ngProgress', '$location', function ($rootScope, $state, AUTH_EVENTS, AuthService, Session, ngProgress, $location){
	//$rootScope.$on('$stateChangeStart', ['event', 'next', 'toState', 'toParams', 'fromState', 'fromParams', function (event, next, toState, toParams, fromState, fromParams){
	$rootScope.$on('$stateChangeStart', function (event, next, toState, toParams, fromState, fromParams){
		ngProgress.start();
		var authorizedRoles = next.data.authorizedRoles;
		var requiresAuth = next.data.requiresAuth;
		var a = AuthService.isAuthenticated();
		if(requiresAuth == true && a == false){
			$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
			//return;
			event.preventDefault;
		}
		if(!AuthService.isAuthorized(authorizedRoles)){
			if(AuthService.isAuthenticated()){
				$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
			}
		}
	});
	$rootScope.$on('$stateChangeSuccess', 
		function(event, toState, toParams, fromState, fromParams){
			var pageUrl = $location.path();
			ga('send', 'pageview', pageUrl);
			ngProgress.complete();
		});
}]);
ViaSlide.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
// $locationProvider.html5Mode(true).hashPrefix('!');
}]);
ViaSlide.factory('AuthInterceptor',['$rootScope', '$q', 'AUTH_EVENTS', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response){
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        404: AUTH_EVENTS.notFound,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout,
        500: AUTH_EVENTS.internalServerError,
      }[response.status], response);
      return $q.reject(response);
    }
  };
}]);
ViaSlide.config(['$httpProvider', function ($httpProvider) {
    var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {
            var notificationChannel;
            function success(response) {
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get requestNotificationChannel via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                return response;
            }
            function error(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get requestNotificationChannel via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                return $q.reject(response);
            }
            return function (promise) {
                // get requestNotificationChannel via $injector because of circular dependency problem
                notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                // send a notification requests are complete
                notificationChannel.requestStarted();
                return promise.then(success, error);
            }
        }];
    // $httpProvider.responseInterceptors.push(interceptor);
    $httpProvider.interceptors.push(interceptor);
}])
.factory('requestNotificationChannel', ['$rootScope', function($rootScope){
    // private notification messages
    var _START_REQUEST_ = '_START_REQUEST_';
    var _END_REQUEST_ = '_END_REQUEST_';
    // publish start request notification
    var requestStarted = function() {
        $rootScope.$broadcast(_START_REQUEST_);
        $rootScope.appLoading = true;
    };
    // publish end request notification
    var requestEnded = function() {
        $rootScope.$broadcast(_END_REQUEST_);
        $rootScope.appLoading = false;
    };
    // subscribe to start request notification
    var onRequestStarted = function($scope, handler){
        $scope.$on(_START_REQUEST_, function(event){
            handler();
        });
    };
    // subscribe to end request notification
    var onRequestEnded = function($scope, handler){
        $scope.$on(_END_REQUEST_, function(event){
            handler();
        });
    };
    return {
        requestStarted:  requestStarted,
        requestEnded: requestEnded,
        onRequestStarted: onRequestStarted,
        onRequestEnded: onRequestEnded
    };
}]);