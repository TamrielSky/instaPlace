'use strict';

/**
 * @ngdoc overview
 * @name instaPlaceApp
 * @description
 * # instaPlaceApp
 *
 * Main module of the application.
 */
angular
  .module('instaPlaceApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'uiGmapgoogle-maps',
    'ui.router',
    'uiRouterStyles',
    'ngAutocomplete',
    'ui.bootstrap-slider',
    'ngStorage',
    'ui-listView'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    
     $urlRouterProvider.otherwise('/home');

     $stateProvider
        
        .state('home', {
            url: '/home',
            views: {

            // the main template will be placed here (relatively named)
            '': { 
                 templateUrl: 'views/home.html',
                 controller: 'homeCtrl',
                 controllerAs: 'homePage'
            },

            // the child views will be defined here (absolutely named)
            'autocompleteView@home': { 
              templateUrl: 'views/autocomplete.html',
              controller: 'autocompleteCtrl',
              controllerAs: 'autocomplete'
            },
            
            'listView@home': { 
              templateUrl: 'views/listView.html',
              controller: 'listCtrl' 
            },

            'mapView@home': { 
                templateUrl: 'views/mapView.html',
                controller: 'mapsCtrl',
                controllerAs: 'mapConfig'
            },
            
            'placeDescribeView@home': { 
                templateUrl: 'views/describePlace.html'
            }
        }
          
        })
        
        .state('about', {
            url: '/about',
            templateUrl: 'views/about.html'
            // we'll get to this in a bit       
        });
        /*
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapsCtrl',
        controllerAs: 'mapView'
      })
      .otherwise({
        redirectTo: '/'
      });*/
  }]);
