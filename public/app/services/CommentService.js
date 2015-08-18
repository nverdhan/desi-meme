ViaSlide.factory('CommentService', ['$http', function ($http){
	return{
		get: function(id, page){
			return $http.get(ApiPrefix+'/api/comments/'+id+'?page='+page);
		},
		save: function(commentData){
			return $http({
				method : 'POST',
				url : ApiPrefix+'/api/comments',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				data : $.param(commentData)
			});
		},
		destroy: function($id){
			return $http.delete(ApiPrefix+'/api/comments');
		}
	}
}]);