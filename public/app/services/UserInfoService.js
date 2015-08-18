ViaSlide.factory('UserInfo', ['$http', function($http){
	return  {
		//get current user info
		get : function(){
			return $http.get(ApiPrefix+'/getuser');
		},
		update: function(userData){
			return $http({
				method : 'POST',
				url 	: ApiPrefix+'/postuser',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				data : $.param(userData)
			})
		},
		save : function(userData){
			return $http({
				method : 'POST',
				url 	: ApiPrefix+'/postuser',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				data : $.param(userData)
			});
		},
		changePwd : function(passwords){
			return $http({
				method 	: 'POST',
				url 	: ApiPrefix+'/changePwd',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				data 	: $.param(passwords)
			});
		}
	}
}]);