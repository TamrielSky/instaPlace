'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
  .controller('mainCtrl', ['$state', 'geolocationService', function ($state, $locationService) {
    
    this.updateLocation = function () {
      var self = this;

      $locationService.getLocation().then(function (position) {

        position = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude } };
        self.location = position;

        $locationService.getAddress(self.location.coords)
          .then(function (address) {
            self.locationAddress = address;
          });

      });

    }

    this.searchPlacesAlongRoute = function (source, destination) {

      console.log("source" + source + "   destination:" + destination);
      $state.go('home', { 'source': source, 'destination': destination, 'filter': this.searchFilter});

      // $location.path("#/home").search({source: source, destination: destination});

    }

    this.setLocation = function () {
      if (this.locationAddress) {
        this.source = this.locationAddress;
      }
    }

    this.setIconConfig = function (size) {
      this.placeIconWidth = size + "px";
      this.placeIconHeight = size + "px";
      this.top = "0px";
      this.background_size = "contain";
      this.position = "relative";
      this.box_shadow = "3px 3px 2px 2px rgba(0, 0, 0, 0.4)";
      this.display = "inline-block";
    }

    this.updateLocation();


  }]);
