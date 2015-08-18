MemeApp.factory('TagService', ['$http', function ($http) {
	return {
		get: function(text){
			return $http.get(ApiPrefix+'/api/tags?tagName='+text);
		},
		save: function(commentData){
			return $http({
				method : 'POST',
				url : ApiPrefix+'/api/tags',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				data : $.param(commentData)
			});
		},
		destroy: function($id){
			return $http.delete(ApiPrefix+'/api/tags');
		}
	}
}]);