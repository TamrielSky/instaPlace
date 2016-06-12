'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
  .controller('MainCtrl', ['geolocationService', function ($locationService) {
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
