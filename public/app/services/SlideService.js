ViaSlide.factory('SlideService', ['$http', function ($http) {
	return{
		get : function(id){
			return $http.get(ApiPrefix+'/api/slide/'+id);
		},
		save : function(slideData){
			return $http({
				method : 'POST',
				url : ApiPrefix+'/api/slide',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				data : $.param(slideData)
			})
		}
	}
}]);