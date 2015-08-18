ViaSlide.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'USER_ROLES', function($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES){
// $locationProvider.html5Mode(true).hashPrefix('!');
    //$urlRouterProvider.otherwise('/');
    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            templateUrl: 'public/app/templates/home.html',
            		data: {
            			requiresAuth : false,
      					authorizedRoles: [USER_ROLES.all, USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.guest]
    				}
        	})
        .state('search', {
            url: '/search',
            controller: 'searchCtrl',
            templateUrl: 'public/app/templates/search.html',
            	data: {
            		requiresAuth: 	false,
    				authorizedRoles: [USER_ROLES.all, USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.guest]
    			}
        	})
        .state('login', {
            url: '/login',
            controller	: 	'LogInCtrl',
            templateUrl: 'public/app/templates/login.html',
            	data: {
            		requiresAuth: false,
    				authorizedRoles: [USER_ROLES.all, USER_ROLES.guest]
    			}
        	})
        .state('register', {
            url: '/register',
            controller	: 	'registerCtrl',
            templateUrl: 'public/app/templates/register.html',
            	data: {
            		requiresAuth: false,
    				authorizedRoles: [USER_ROLES.all, USER_ROLES.guest]
    			}
        	})
        .state('info', {
            url: '/info',
            controller	: 'InfoCtrl',
            templateUrl: 'public/app/templates/info.html',
            	data: {
            		requiresAuth: true,
    				authorizedRoles: [USER_ROLES.user, USER_ROLES.admin]
    			}
        	})
        .state('slide/:id/:slug', {
            url: '/slide/:id/:slug',
            controller	: 'SlideCtrl',
            templateUrl: 'public/app/templates/slide.html',
            	data: {
            		requiresAuth: false,
    				authorizedRoles: [USER_ROLES.user, USER_ROLES.admin]
    			}
        	})
        .state('start', {
            url: '/start',
            controller : 'StartSlideCtrl',
            templateUrl : 'public/app/templates/startSlide.html',
                data : {
                    requiresAuth : true
                }
            })
        .state('create/:id', {
            url: '/create/:id',
            controller : 'CreateSlideCtrl',
            templateUrl : 'public/app/templates/createSlide.html',
                data : {
                    requiresAuth : true
                }
            })
        .state('edit/:id', {
            url: '/edit/:id',
            controller : 'EditSlideCtrl',
            templateUrl : 'public/app/templates/editSlide.html',
            data : {
                requiresAuth : true,
                authorizedRoles: [USER_ROLES.user, USER_ROLES.admin]
            }
        })
        .state('user/:id', {
            url: '/user/:id',
            controller : 'UserSlidesCtrl',
            templateUrl : 'public/app/templates/userSlides.html',
            data : {
                requiresAuth : false
            }
        })
        .state('about', {
            url: '/about',
            controller : 'AboutCtrl',
            templateUrl : 'public/app/templates/about.html',
            data : {
                requiresAuth : false
            }
        })
        .state('tag/:text', {
            url : '/tag/:text',
            controller : 'tagCtrl',
            templateUrl : 'public/app/templates/tag.html',
            data : {
                requiresAuth : false
            }
        })
        $urlRouterProvider.otherwise("/");
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
	}]);