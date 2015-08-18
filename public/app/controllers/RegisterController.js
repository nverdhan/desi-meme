ViaSlide.controller('registerCtrl',['$scope', '$rootScope', '$state', 'AUTH_EVENTS', 'AuthService', function ($scope, $rootScope, $state, AUTH_EVENTS, AuthService){
	$scope.credentials = {
		name : '',
		email : '',
		password : ''
	};
	$scope.showError = false;
	$scope.errorMessage;
	$scope.register = function(credentials){
		if(credentials.name == ''){
			$scope.showError = true;
			$scope.errorMessage = 'please enter name';
			return;
		}
		if(credentials.email == ''){
			$scope.showError = true;
			$scope.errorMessage = 'please enter email';
			return;
		}
		if(credentials.password == ''){
			$scope.showError = true;
			$scope.errorMessage = 'please enter password';
			return;
		}
		AuthService.register(credentials).then(function(res){
			if(res.status == 'success'){
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				$scope.setCurrentUser(res.user);	
			}else{
				$scope.errorMessage = res.message;
				$scope.showError = true;
			}
		},function(){
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	};
}]);
ViaSlide.controller('ForgotPwdCtrl', ['$scope', '$http','AuthService','$rootScope','AUTH_EVENTS', function ($scope, $http, AuthService, $rootScope, $AUTH_EVENTS){
	$scope.credentials = {
		email : ''
	}
	$scope.showError = false;
	$scope.errorMessage;
	$scope.forgotPwd = function(credentials){
		AuthService.forgotPwd(credentials).then(function(res){
			if(res.status == 'success'){
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			}else{
				$scope.errorMessage = res.message;
				$scope.showError = true;
			}
		},function(){
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	}
}])