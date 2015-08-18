ViaSlide.controller('tagCtrl', ['$http', '$scope','TagPostsService','$stateParams', function ($http, $scope, TagPostsService, $stateParams) {
	$scope.results;
    $scope.page = 1;
    $scope.showNoResults = false;
    $scope.endOfShow = false;
    $scope.results = [];
    $scope.tag = $stateParams.text;
    $(window).unbind('scroll');
    $scope.pageLoad = 1;
	$(window).scroll(function(){
        if($(window).data('ajaxready') == false) return;
        var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
        var  scrolltrigger = 0.9;
        if(((wintop/(docheight-winheight)) > scrolltrigger) && !$scope.endOfShow){
            TagPostsService.get($scope.tag, $scope.page).success(function(data){
                var related = angular.fromJson(data);
            $(window).data('ajaxready', false);
            $scope.page++;
            $scope.getData = 1;
            if(data.related.length > 0){
                angular.forEach(data.related, function (key, value){
                    this.push(key);
                    }, $scope.results);
                $scope.reArrange();
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
	$scope.updateResults = function(){
            $scope.page = 1;
            TagPostsService.get($scope.tag, $scope.page).success(function(data){
             var related = angular.fromJson(data);
            if(data[0].related.length > 0){
                    $scope.page++;
                    $scope.showNoResults = false;
                    angular.forEach(data[0].related, function (key, value){
                        this.push(key);
                        }, $scope.results);
                    $scope.Related.reInitializeGrid();
                    $scope.reArrange();
                }else{
                    $scope.showNoResults = true;
                }
            });
	}
    $scope.updateResults();
	$scope.reArrange = function(){
        window.setTimeout(function(){
            $scope.Related.initialize();
        }, 2);
    }
	$scope.Related = (function(){
        var s = $("#searchResults").width();
            k = getk(s);
            fw = (s-((k+2)*8))/k;
            fh = Math.floor(fw*(3/4));
            var k, fg, fw, fh, grid, gridIn;
            var l = 100;
            var aClass = 0, bClass = 0;
        function getk(s){
            if(s > 1400){
                k = 6;
            }
            else if( s >= 1000 && s <=1400){
                k=5;
            }
            else if(s<1000 && s>=800){
                k=4;
            }
            else if(s<800 && s>=600){
                k=3;
            }
            else if(s<600 && s>=300){
                k=2;
            }
            else{
                k=1;
            }
            return k;   
        }
        function reInitializeGrid(){
            makeGrid();
        }
        function initialize(){
            if(!grid){
                makeGrid();
            }
            var cx = ".items li";
            arrangeGrid(cx);
        }
        function makeGrid(){
                grid = new Array(k);
                for (i=0; i<l; i++){
                    grid[i] = new Array(k); 
                };
                for (i = 0 ; i<l; i++) {
                        for (j = 0; j < k; j++) {
                        grid[i][j] = 0;
                    };
                };
        }
        function increaseGrid(){
        	if(grid.length){
                a = grid.length;
            }else{
                a = 1;
            }
            for (var i = a-1; i < a+50; i++) {
                grid.push([]);
                for (var j = 0; j < k; j++) {
                    grid[i].push(0);
                };
            };
        }
        function cssTransform(){    
            var prop = ['WebkitTransform','MozTransform','msTransform','OTransform','transform'];
            for (var i = prop.length - 1; i >= 0; i--) {
                if(prop[i] in document.body.style){
                    return prop[i];
                }
            };   
        }
        function countItems(){
            var d = 1;
            $( ".items li" ).each(function(e) {
                d++; 
            });
            return d;
        }
        function arrangeGrid(newItems){
            var newItems = newItems;
            var maxH=0;
            var cst = cssTransform();
            $('.items li').each(function( index ){
                if($(this).hasClass('arranged')){
                }else{
                var fr = Math.floor((Math.random()*k) + 1);
                if(fr<=3){
                    var c = placement(0);
                    $(this).css(cst, 'translate3d('+c.x+'px,'+c.y+'px,'+0+'px)');
                    $(this).css("height",fh);
                    $(this).css("width",fw);
                    $(this).addClass('b');
                    if(maxH<(c.y+fh)){
                        maxH = c.y+fh;
                    }
                    aClass++;
                }
                else if(fr>3){
                    var c = placement(1);
                    $(this).css(cst, 'translate3d('+c.x+'px,'+c.y+'px,'+0+'px)');
                    $(this).css("height",2*fh+8);
                    $(this).css("width",2*fw+8);
                    $(this).addClass('a');
                    if(maxH<(c.y+2*fh+8)){
                        maxH = c.y+2*fh+8;
                    }  
                    bClass++; 
                }
                $(this).addClass('arranged');
                maxH = maxH;
                $(".itemsContainer").css('height',maxH);    
                }
                
            });   
        }
        function placement(a){
            var grid_item_h = fh, grid_item_w = fw;
            var gl = grid.length;
            asd:
            switch(a){
                case 0:
                for (i = 0 ; i < gl; i++){
                    for (j = 0; j < k; j++) {
                        if(i<gl && j<k){
                            
                         if(grid[i][j] == 0){
                            var x = j*(grid_item_w+8);
                            var y = i*(grid_item_h+8);
                            grid[i][j] = 1;
                            break asd;
                            }
                        }
                    };
                };
                break;
                case 1:
                for (i = 0 ; i <gl-1; i++) {
                    for (j = 0; j < k-1; j++) {
                        if(i<gl-1 && j<k-1){
                         if(grid[i][j] == 0 && grid[i+1][j] == 0 && grid[i][j+1] == 0 && grid[i+1][j+1] == 0){
                            var x = j*(grid_item_w+8);
                            var y = i*(grid_item_h+8);
                            grid[i][j] = 1;
                            grid[i+1][j] = 1;
                            grid[i][j+1] = 1;
                            grid[i+1][j+1] = 1;
                            break asd;
                            }
                        } 
                    };
                };
                break;
                case 2:
                for (i = 0 ; i <gl; i++) {
                    for (j = 0; j < k; j++) {
                        if(i<gl && j<k){
                         if(grid[i][j] == 0 && grid[i][j+1] == 0){
                            var y = j*grid_item_h;
                            var x = i*grid_item_w;
                            grid[i][j] = 1;
                            grid[i][j+1] = 1;
                            break asd;
                            } 
                        }
                    };
                };
            };
            return({x:x, y:y});
        };
        return{
            initialize:initialize,
            reInitializeGrid : reInitializeGrid,
            getk: getk,
            placement: placement,
            arrangeGrid: arrangeGrid,
            increaseGrid: increaseGrid,
        };
    })();
}]);