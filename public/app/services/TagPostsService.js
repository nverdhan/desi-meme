ViaSlide.factory('TagPostsService', ['$http', function ($http) {
	// body...
	return {
		get: function(text, page){
			return $http.get(ApiPrefix+'/api/postTags/'+text+'?page='+page);
		}
	}
}]);