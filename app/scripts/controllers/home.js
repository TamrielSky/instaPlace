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
        var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

        self.filteredPlaces = null;
        self.normalizedPlaces = [];
        self.markers = [];
        self.searchFilter = [];
        self.sliderModel = 0.2;
        self.gmapCircle = {
            visible: true, 
            stroke: {
                color: '#DC381F',
                weight: 1,
                opacity: 0.1
            },
            fill: {
                color: '#DC381F',
                opacity: 0.1
            },
            control: {}
        };

        uiGmapIsReady.promise()
            .then(function (map_instances) {

                self.map = map_instances[0].map;            // get map object through array object returned by uiGmapIsReady promise

        });

        $locationService.getLocation().then(function (position) {
            //.location = position;
            var height = $('.mainview').height() - $('.autocomplete').height() - 25;
            $('.angular-google-map-container').height(height);
            $('.ui-list-view').height($('.mapWrapper').height() - 70);


            position = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude } };
            self.location = position;
            return $locationService.getAddress(position.coords)
        })
            .then(function (address) {
                // $localStorage.address = address;
                self.address = address;
                self.currentLocation = angular.copy(self.location);

                $scope.$apply();

        });

        this.setLocation = function () {
             
            self.location =   angular.copy(self.currentLocation);
            this.currentAddress = self.address;
        }

        this.searchNearByPlaces = function () {

            var results = {};
            var promise = Promise.resolve();
             

            $locationService.getLatLngFromAddress(this.currentAddress).then(function (position) {
                self.location = { coords: { latitude: position.lat(), longitude: position.lng() } };
                self.currentLocation = angular.copy(self.location);
                self.searchFilter.forEach(function (filter) {

                    var searchConfig = [{type: filter, distance: 25}, {type: filter, distance: 20}, {type: filter, distance: 15}, {type: filter, distance: 10}, {type: filter, distance: 5} ];
                    
                    searchConfig.forEach(function (config) {
                        promise = promise.then(function (places) {
                            populateResults(places);
                            return $locationService.getNearByPlaces(self.currentAddress, position.lat(), position.lng(), 14, self.map, config.distance * 1609, config.type);
                        });
                      
                    });

                })

                promise.then(function (places) {
                    populateResults(places);
                //    results[self.searchFilter[0]] = results[self.searchFilter[0]].concat(placeArray);
                    self.normalizedPlaces = ($placeFilterService.eliminateDuplicates(self.normalizedPlaces.concat($placeFilterService.filterPlaces(results, self.location)))).sort($placeFilterService.compare);
                    console.log(self.normalizedPlaces);
                    $scope.$apply();
                    self.filterPlaces(null, self.sliderModel);
                    $scope.$apply();
                    directionsDisplay.setMap(self.map);

                });
            });

              function populateResults(places) {

                  if (places) {
                                for(var place in places) {
                                    if(results[place]){

                                        results[place] =  results[place].concat(places[place]);

                                    } else {
                                        results[place] = places[place];
                                    }

                                }
                            }

              }

        }

        this.filterPlaces = function (event, value) {
            var tempFilter = [];
            self.filteredPlaces = [];
            self.markers = [];
            var places = self.normalizedPlaces;
            var placeCount = 0;
            for (var count = 0; count < places.length; count++) {

                if (value  > places[count].distance) {

                    tempFilter[placeCount] = places[count];
                    placeCount++;
                }

            }
            self.filteredPlaces = tempFilter;
            for (var count = 0; count < self.filteredPlaces.length; count++) {

                self.markers.push({info: {address: self.filteredPlaces[count].address, name:self.filteredPlaces[count].name},  id: self.filteredPlaces[count].place_id, coords: { latitude: self.filteredPlaces[count].location.latitude, longitude: self.filteredPlaces[count].location.longitude }, key: self.markers.length + 1, filter: self.filteredPlaces[count].filter });
            
            }
            console.log(self.filteredPlaces);
        }

        this.clickListItem = function (item) {

            for (var count = 0; count < self.filteredPlaces.length; count++) {
                self.filteredPlaces[count].selected = false;
            }
            item.selected = !item.selected;

            $locationService.calculateAndDisplayRoute({ lat: self.currentLocation.coords.latitude, lng: self.currentLocation.coords.longitude }, { lat: item.location.latitude, lng: item.location.longitude })
                .then(function (route) {
                    console.log(route);
                    directionsDisplay.setDirections(route);

                })
        }

    }]);

