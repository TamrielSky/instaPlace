'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
    .controller('homeCtrl', ['geolocationService', 'placeFilterService', '$localStorage', '$scope', 'uiGmapIsReady', '$timeout', function ($locationService, $placeFilterService, $localStorage, $scope, uiGmapIsReady, $timeout) {

        var self = this;
        var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
        self.loadingStyle = { 'visibility': 'visible' };
        self.mapZoom = 14;
        self.filteredPlaces = null;
        self.normalizedPlaces = [];
        self.markers = [];
        self.searchFilter = [];
        self.sliderModel = 1;
        self.infoWindow = { show: false, name: null, address: null, coords: null };
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

        $locationService.getLocation().then(function (position) {
            //need to find a better way 
            var height = $('.mainview').height() - $('.autocomplete').height();
            $('.angular-google-map-container').height(height);
            $('.ui-list-view').height(height-$('.mainListView').height());

            position = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude } };
            self.location = position;
            self.setLoadingVisible(false);
            return $locationService.getAddress(position.coords)
        })
        .then(function (address) {
            self.currentAddress = address;
            self.currentLocation = angular.copy(self.location);

            $scope.$apply();
        });

        uiGmapIsReady.promise()
            .then(function (map_instances) {

                self.map = map_instances[0].map;      // get map object through array object returned by uiGmapIsReady promise

        });

        $scope.$on('update_location', function (event, result) {

            self.mapZoom = 14;
            self.location = { coords: { latitude: result.geometry.location.lat(), longitude: result.geometry.location.lng() } };
            self.currentLocation = angular.copy(self.location);
            self.filteredPlaces = [];

        });
        
        this.setLoadingVisible = function (isVisible) {

            if (isVisible) {
                self.loadingStyle['visibility'] = 'visible';
            }
            else {
                self.loadingStyle['visibility'] = 'hidden';
            }
        }

        this.searchNearByPlaces = function () {

            self.setLoadingVisible(true);

            var results = {};
            var promise = Promise.resolve();

            $locationService.getLatLngFromAddress(this.currentAddress).then(function (position) {
                self.location = { coords: { latitude: position.lat(), longitude: position.lng() } };
                self.currentLocation = angular.copy(self.location);
                self.searchFilter.forEach(function (filter) {

                    var searchConfig = [{ type: filter, distance: 25 }, { type: filter, distance: 20 }, { type: filter, distance: 15 }, { type: filter, distance: 10 }, { type: filter, distance: 5 }];

                    searchConfig.forEach(function (config) {
                        promise = promise.then(function (places) {
                            populateResults(places);
                            return $locationService.getNearByPlaces(self.currentAddress, position.lat(), position.lng(), 14, self.map, config.distance * 1609, config.type);
                        });

                    });

                })

                promise.then(function (places) {
                    populateResults(places);
                    self.normalizedPlaces = $placeFilterService.sortByProperty($placeFilterService.eliminateDuplicates($placeFilterService.filterPlaces(results, self.location)), "distance");
                    self.filterPlacesByRadius(null, self.sliderModel);
                    directionsDisplay.setMap(self.map);
                    self.setLoadingVisible(false);

                });
            });

            function populateResults(places) {
                if (places) {
                    for (var place in places) {
                        if (results[place]) {
                            results[place] = results[place].concat(places[place]);
                        } else {
                            results[place] = places[place];
                        }
                    }
                }

            }

        }

        this.sortPlaces = function (property, order) {
            
            var places = angular.copy(self.filteredPlaces);
            self.filteredPlaces = [];
            if (order) {
                self.filteredPlaces = $placeFilterService.sortByProperty(places, property).reverse();
            }
            else {
                self.filteredPlaces = $placeFilterService.sortByProperty(places, property);
            }
            this.setupMarkers();

        }

     
        this.filterPlacesByRadius = function (event, value) {

            var tempFilter = [];
            self.filteredPlaces = [];
            self.markers = [];
            var places = self.normalizedPlaces;
            var placeCount = 0;
            for (var count = 0; count < places.length; count++) {

                if (value > places[count].distance) {

                    tempFilter[placeCount] = places[count];
                    placeCount++;
                }

            }
            self.filteredPlaces = tempFilter;
            this.setupMarkers();
        }

        this.setupMarkers = function () {
            for (var count = 0; count < self.filteredPlaces.length; count++) {

                self.markers.push({ info: { address: self.filteredPlaces[count].address, name: self.filteredPlaces[count].name }, id: self.filteredPlaces[count].place_id + ',' + count, coords: { latitude: self.filteredPlaces[count].location.latitude, longitude: self.filteredPlaces[count].location.longitude }, key: self.markers.length + 1, filter: self.filteredPlaces[count].filter });

            }

        }

        this.clickListItem = function (item) {

            for (var count = 0; count < self.filteredPlaces.length; count++) {
                self.filteredPlaces[count].selected = false;
            }
            item.selected = !item.selected;

            $locationService.calculateAndDisplayRoute({ lat: self.currentLocation.coords.latitude, lng: self.currentLocation.coords.longitude }, { lat: item.location.latitude, lng: item.location.longitude })
                .then(function (route) {
                    directionsDisplay.setDirections(route);
                })
        }

        this.openInfoWindow = function (marker) {

            self.infoWindow.coords = { latitude: marker.position.lat(), longitude: marker.position.lng() };
            var index = marker.key.split(",")[1];

            self.infoWindow.name = self.filteredPlaces[index].name;
            self.infoWindow.address = self.filteredPlaces[index].address;

            self.infoWindow.show = false;
            self.infoWindow.show = true;

        }

        this.markerEvents = {

            click: function (marker) {

                self.infoWindow.show = true;

                self.openInfoWindow(marker);
                var key = marker.key.split(",")[0];
                angular.element('#' + key).triggerHandler('click');

            }

        }

    }]);

