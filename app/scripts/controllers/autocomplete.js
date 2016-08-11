'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:autocompleteCtrl
 * @description
 * # autocompleteCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
  .controller('autocompleteCtrl', function () {


this.place = "";
     this.filterArray = [];

    this.placeIcons = [
      { name: "restaurant", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { name: "atm", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
    //  { name: "airport", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { name: "bar", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { name: "hospital", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { name: "grocery", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { name: "gas_station", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" }

    ];

    this.addFilter = function (place, homePage) {

      var place = place.split("-")[0];
      var boxShadow = "";

      for (var count = 0; count < this.placeIcons.length; count++) {
        if (this.placeIcons[count].name.split("-")[0] == place) {

          var index = this.filterArray.indexOf(place);

          if (index == -1) {
            boxShadow = "inset 0 0 10px rgba(0, 0, 0, 0.8)";
            this.placeIcons[count].name = this.placeIcons[count].name + '-selected';
            this.filterArray.push(place);

          } else {
            boxShadow = "3px 3px 2px 2px rgba(0, 0, 0, 0.4)";
            this.placeIcons[count].name = this.placeIcons[count].name.split("-")[0];
            this.filterArray.splice(index, 1);
          }
          this.placeIcons[count].boxShadow = boxShadow;
        }
      }
      homePage.searchFilter = this.filterArray;
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
