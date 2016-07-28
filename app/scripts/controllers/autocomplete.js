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

    this.filterArray = [];

    this.boxShadow = "3px 3px 2px 2px rgba(0, 0, 0, 0.4)";

    this.placeIcons = {
      restaurant: "restaurant",
      atm: "atm",
      airport: "airport",
      bar: "bar",
      hospital: "hospital",
      grocery: "grocery"
    };

    this.addFilter = function (place) {

      var index = this.filterArray.indexOf(place);

      if (index == -1) {

        this.boxShadow = "inset 0 0 10px rgba(0, 0, 0, 0.8)"; 



        this.placeIcons[place] = this.placeIcons[place] + "-selected";
        this.filterArray.push(place);

      } else {
                this.boxShadow = "3px 3px 2px 2px rgba(0, 0, 0, 0.4)";


        this.placeIcons[place] = this.placeIcons[place].split("-")[0];
        this.filterArray.splice(index, 1);

      }
    }



    this.filterPlaces = function (event, value, places) {

      var filteredPlaces = [];
      for (var count = 0; count < places.length; count++) {

        if (value * 1609 < places[count].distance)
          places.splice(count, 1);

      }
      console.log("changed");

    }

  });
