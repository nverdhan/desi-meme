ViaSlide.factory('AuthService', ['$http', '$rootScope', 'Session', '$window', '$cookieStore', function ($http, $rootScope, Session, $window, $cookieStore){
	var authService = {};
	authService.register = function(credentials){
		return $http.post(ApiPrefix+'/register', credentials)
					.then(function(res){
						var res = res.data;
						if(res.status == 'success'){
							Session.create(res.id, res.user.id, res.user.role);	
						}
						return res;
					});
	}
	authService.login = function(credentials){
		return $http.post(ApiPrefix+'/login', credentials)
					.then(function(res){
						var res = res.data;
						if(res.status == 'success'){
							Session.create(res.id, res.user.id, res.user.role);	
						}
						return res;
					});
	}
	authService.logOut = function(){
		return $http.get(ApiPrefix+'/logout').then(function(res){
			var res = res.data;
			if(res.status == 'success'){

			}
			return res;
		})
	}
	authService.forgotPwd = function(credentials){
		return $http.post(ApiPrefix+'/forgotPwd', credentials)
					.then(function(res){
						var res = res.data;
						return res;
					});
	}
	authService.getCredentials = function(credentials){
		return $http.post(ApiPrefix+'/getCredentials', credentials)
					.then(function(res){
						var res = res.data;
						return res;
					});
	}
	authService.isAuthenticated = function(){
		// if ($window.sessionStorage.token != 0){
		// 	return true;
		// }else{
		// 	return false;
		// }
		// if($rootScope.currentUser.id){
		// 	return true;
		// }else{
		// 	return false;
		// }
		if($cookieStore.get('userId') != 'anon'){
			return true;
		}else{
			return false;
		}
	}
	authService.isAuthorized = function(authorizedRoles){
		if(!angular.isArray(authorizedRoles)){
			authorizedRoles = [authorizedRoles];
		}
		return (authorizedRoles.indexOf(Session.userRole) !== -1);
	};
	return authService;
}]);
ViaSlide.service('Session', function(){
	this.create = function(sessionId, userId, userRole){
		this.id = sessionId;
		this.userId = userId;
		this.userRole = userRole;
	};
	this.destroy = function(){
		this.id = null;
    	this.userId = null;
    	this.userRole = null;
	};
	return this;
});
