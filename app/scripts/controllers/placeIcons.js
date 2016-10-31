'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:autocompleteCtrl
 * @description
 * # autocompleteCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
  .controller('placeIconCtrl', function () {


this.place = "";
     this.filterArray = [];

    this.placeIcons = [
      { title: "Restaurant", name: "restaurant", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { title: "ATM", name: "atm", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
    //  { name: "airport", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { title: "Bar", name: "bar", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { title: "Hospital", name: "hospital", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { title: "Grocery", name: "grocery", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" },
      { title: "Gas", name: "gas_station", boxShadow: "3px 3px 2px 2px rgba(0, 0, 0, 0.4)" }

    ];

    this.addFilter = function (place, main) {

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
      main.searchFilter = this.filterArray;
    }

  });
