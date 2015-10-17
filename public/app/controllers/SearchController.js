MemeApp.controller('searchCtrl', ['$http', '$scope','$rootScope', 'SearchService', '$compile', function ($http, $scope, $rootScope, SearchService, $compile) {
	$scope.results;
    $scope.page = 1;
    $scope.showNoResults = false;
    $scope.endOfShow = false;
    $scope.results = [];
    $scope.searchStr;
    $rootScope.title = '';
    $(window).unbind('scroll');
    $scope.pageLoad = 1;
	$(window).scroll(function(){
        if($(window).data('ajaxready') == false) return;

        var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
        var  scrolltrigger = 0.9;
        if(((wintop/(docheight-winheight)) > scrolltrigger) && !$scope.endOfShow){
                SearchService.search($scope.searchStr, $scope.page).success(function(data){
                $(window).data('ajaxready', false);
                $scope.page++;
                $scope.getData = 1;
                if(data.length > 0){
                    angular.forEach(data, function (key, value){
                        this.push(key);
                        }, $scope.results);
                    }else{
                        $scope.endOfShow = true;
                    }
                $(window).data('ajaxready', true);
                });
       }
    });
    $scope.ago = function (time){
            var periods = ["second", "minute", "hour", "day", "week", "month", "year", "decade"];
            var lengths = ["60","60","24","7","4.35","12","10"];
            var t = time.split(/[- :]/);
            var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
            var time = Math.round(d/1000);
            var now = Math.round(+new Date()/1000);
            var difference     = now - time;
            var tense         = "ago";
            for(var j = 0; difference >= lengths[j] && j < lengths.length-1; j++) {
               difference /= lengths[j];
            }
            difference = Math.round(difference);
            if(difference != 1) {
               periods[j]+= "s";
            }
            return difference+' '+periods[j];
    }
	$scope.updateResults = function(inputStr){
            $scope.page = 1;
            SearchService.search(inputStr, $scope.page).success(function(data){
            $scope.results = [];
            data = data.imgs;
            if(data.length > 0){
                $scope.page++;
                $scope.showNoResults = false;
                angular.forEach(data, function (key, value){
                    this.push(key);
                    }, $scope.results);
            }else{
                $scope.showNoResults = true;
            }
            // console.log($scope.results);
        });    
	}
    $scope.$on('UPDATE_IMG_RESULTS', $scope.updateResults);
}]);