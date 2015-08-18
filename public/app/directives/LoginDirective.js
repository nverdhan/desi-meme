ViaSlide.directive('loginDialog', function (AUTH_EVENTS) {
	var login = "'public/app/templates/login.html'";
	var register = "'public/app/templates/register.html'";
	var forgotPwd = "'public/app/templates/forgotPwd.html'";
  return {
    restrict: 'A',
    template: '<div ng-if="loginVisible"><div ng-include src="'+login+'"></div></div><div ng-if="registerVisible" ng-include src="'+register+'"></div><div ng-if="forgotPwdVisible" ng-include src="'+forgotPwd+'"></div>',
    link: function (scope) {
      var showLoginDialog = function () {
        scope.hideAll();
      	scope.loginVisible = true;
      };
      var hideLoginDialog = function () {
        scope.loginVisible = false;
      };
      var showRegisterDialog = function () {
      	scope.registerVisible = true;
      };
      var hideRegisterDialog = function () {
        scope.registerVisible = false;
      };
      var showForgotPwdDialog = function () {
      	scope.forgotPwdVisible = true;
      };
      var hideForgotPwdDialog = function () {
        scope.forgotPwdVisible = false;
      };
      scope.switchLogin = function(){
      	hideForgotPwdDialog();
      	hideRegisterDialog();
		    showLoginDialog();      
      }
      scope.switchRegister = function(){
      	hideLoginDialog();
      	hideForgotPwdDialog();
      	showRegisterDialog();
      }
      scope.switchForgotPwd = function(){
      	hideLoginDialog();
      	hideRegisterDialog();
      	showForgotPwdDialog();
      }
      scope.close = function(){
      	scope.$parent.hideOverlay();
      }
      scope.hideAll = function(){
        scope.loginVisible = false;
        scope.registerVisible = false;
        scope.forgotPwdVisible = false;  
      }
      scope.hideAll();
      scope.$on(AUTH_EVENTS.notAuthenticated, showLoginDialog);
      scope.$on(AUTH_EVENTS.sessionTimeout, showLoginDialog);
      scope.$on(AUTH_EVENTS.loginSuccess, hideLoginDialog);
    }
  };
});