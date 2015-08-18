ViaSlide.controller('LogInCtrl', function($scope, $rootScope, $state, AUTH_EVENTS, AuthService){
	$scope.credentials = {
		username : '',
		password : ''
	};
	$scope.errorMessage;
	$scope.invalidCredentials = false;
	$scope.login = function(credentials){
		if(credentials.username == ''){
			$scope.invalidCredentials = true;
			$scope.errorMessage = 'please enter your email';
			return;
		}
		if(credentials.password == ''){
			$scope.invalidCredentials = true;
			$scope.errorMessage = 'please enter your password';
			return;
		}
		AuthService.login(credentials).then(function(res){
			if(res.status == 'success'){
				$scope.setCurrentUser(res.user);
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			}else{
				$scope.errorMessage = res.message;
				$scope.invalidCredentials = true;
			}
		},function(){
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	};
});