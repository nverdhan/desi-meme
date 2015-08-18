ViaSlide.factory('DeleteFileService', ['$http', function ($http) {
	return {
		delete : function (file){
			console.log(file);
			return $http({
				method : 'POST',
				url : ApiPrefix+'/api/deleteFile',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				data : $.param({'file' : file})
			})
		}
	}
}]);