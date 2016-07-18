'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
    .controller('homeCtrl', ['geolocationService', 'placeFilterService', '$localStorage', '$scope', 'uiGmapIsReady', function ($locationService, $placeFilterService, $localStorage, $scope, uiGmapIsReady) {
        var self = this;
        self.places = [];
        self.filteredPlaces = [];
        var directionsDisplay = new google.maps.DirectionsRenderer();

        uiGmapIsReady.promise()
            .then(function (map_instances) {
                self.map = map_instances[0].map;            // get map object through array object returned by uiGmapIsReady promise
            });

        $locationService.getLocation().then(function (position) {
            //.location = position;
            position = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude } };
            self.location = position;
            return $locationService.getAddress(position.coords)
        })
            .then(function (address) {
                // $localStorage.address = address;
                self.address = address;
                $scope.$apply();

            });

        this.setLocation = function () {
            this.currentLocation = angular.copy(self.location);
            this.currentAddress = self.address;
        }

        this.searchNearByPlaces = function () {



            $locationService.getLatLngFromAddress(this.currentAddress).then(function (position) {
                self.position = position;

                var promise = $locationService.getNearByPlaces(self.position.lat(), self.position.lng(), 14, self.map, 25 * 1609)

                var distances = [];
                for (var i = 20; i > 0; i = i - 5) {
                    distances.push(i);
                }
                distances.forEach(function (distance) {
                    promise = promise.then(function (places) {
                        self.places = self.places.concat(places);
                        return $locationService.getNearByPlaces(self.position.lat(), self.position.lng(), 14, self.map, distance * 1609)
                    });

                });

                promise.then(function (places) {


                    self.places = self.places.concat(places);
                    self.filteredPlaces = ($placeFilterService.filterPlaces(self.places, self.location)).sort($placeFilterService.compare);

                    angular.copy(self.filteredPlaces, self.places);
                    $scope.$apply();
                    directionsDisplay.setMap(self.map);


                });
            });


        }

        this.filterPlaces = function (event, value) {

            var tempFilter = [];
            var places = self.places;
            var placeCount = 0;
            for (var count = 0; count < places.length; count++) {

                if (value * 1609 > places[count].distance) {

                    tempFilter[placeCount] = places[count];
                    placeCount++;
                }

            }

            self.filteredPlaces = tempFilter.sort($placeFilterService.compare);

        }

        this.hoverListItem = function (item) {


            var imgUrl = "";
            var formattedAddress;
            var placeName;
            var phoneNumber;
            for (var i = 0; i < self.placeDetails.length; i++) {
                if (self.placeDetails[i].place_id == item.target.id) {
                    self.place = self.placeDetails[i];
                }
            }
            /*    
                $locationService.calculateAndDisplayRoute({lat: self.currentLocation.coords.latitude, lng: self.currentLocation.coords.longitude}, {lat: self.place.geometry.location.lat(), lng: self.place.geometry.location.lng()})
                .then(function(route){
                    console.log(route);
                                 directionsDisplay.setDirections(route);
       
                })
              */ /*  self.polylines = [
                 {
                     id: 1,
                     path: [
                         {
                             latitude: self.currentLocation.coords.latitude,
                             longitude: self.currentLocation.coords.longitude
                         },
                         {
                             latitude: self.place.geometry.location.lat(),
                             longitude: self.place.geometry.location.lng()
                         }
                     ],
                     stroke: {
                         color: '#6060FB',
                         weight: 3
                     },
                     editable: false,
                     draggable: false,
                     geodesic: true,
                     visible: true,
                    
                 }];*/

        }

    }]);

