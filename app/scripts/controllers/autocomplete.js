'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
  .controller('autocompleteCtrl', function () {


    this.filterPlaces = function(event, value, places) {

      var filteredPlaces = [];
      for(var count=0; count< places.length; count ++) {

        if(value*1609< places[count].distance)
        places.splice(count, 1);
               


      }
      console.log("changed");



    }
   
   
});
