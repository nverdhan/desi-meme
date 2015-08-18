ViaSlide.factory('SearchService', ['$http', function ($http){
	return{
		get: function(page){
				return $http.get(ApiPrefix+'/api/search?page='+page);
			},
			/*
		search: function(inputStr){
			return $http({
				method : 'POST',
				url 	: ApiPrefix+'/api/search',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				data : inputStr
			});
		}*/
		search: function(inputStr, page){
			return $http.get(ApiPrefix+'/api/search/'+inputStr+'?page='+page);
		}
	}
}])