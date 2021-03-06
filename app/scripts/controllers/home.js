'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
    .controller('homeCtrl', ['routeBoxerService', 'geolocationService', 'placeFilterService', '$localStorage', '$scope', 'uiGmapIsReady', '$interval', '$stateParams', function ($routeBoxerService, $locationService, $placeFilterService, $localStorage, $scope, uiGmapIsReady, $interval, $stateParams) {

        var self = this;
        var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
        var directionsService = new google.maps.DirectionsService();

        self.loadingStyle = { 'visibility': 'hidden' };
        self.routeBoxes = [];
        self.mapZoom = 14;
        self.filteredPlaces = null;
        self.normalizedPlaces = [];
        self.markers = [];
        self.searchFilter = [];
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

        this.setLocation = function () {
            this.sourceLocation = this.currentAddress;
            this.sourceLocationCoords = this.currentLocation.coords;

        }

        this.setLoadingVisible = function (isVisible) {
            if (isVisible) {
                self.loadingStyle['visibility'] = 'visible';
            }
            else {
                self.loadingStyle['visibility'] = 'hidden';
            }
        }

        this.searchNearByPlaces = function (source, destination, searchFilter) {

            if (self.searchFilter && self.searchFilter.length < 1) {
                self.searchFilter = searchFilter;
            }
            if (!self.searchFilter || self.searchFilter.length < 1) {
                alert("Please select location filter");
            } else {
                self.filteredPlaces = [];
                self.markers = [];

                self.setLoadingVisible(true);

                var results = {};
                var promise = Promise.resolve();

                var promises = [];

                promises.push($locationService.getLatLngFromAddress(source));
                promises.push($locationService.getLatLngFromAddress(destination));
                Promise.all(promises).then(function (locations) {

                    var request = {
                        origin: locations[0],
                        destination: locations[1],
                        travelMode: 'DRIVING'
                    };

                    directionsService.route(request, function (response, status) {

                        if (status == 'OK') {
                            var list = $routeBoxerService.routeBoxer.box(response.routes[0].overview_path, 0.3);

                            list.forEach(function (item) {

                                var rectangle = new google.maps.Rectangle({
                                    visible: false,
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: '#FF0000',
                                    fillOpacity: 0.35,
                                    map: self.map,
                                    bounds: {
                                        north: item.getNorthEast().lat(),
                                        south: item.getSouthWest().lat(),
                                        east: item.getNorthEast().lng(),
                                        west: item.getSouthWest().lng()
                                    }
                                });

                                self.routeBoxes.push(rectangle);

                            });
                            directionsDisplay.setMap(self.map);

                            $locationService.getPlacesAlongRoute(list, self.searchFilter).then(function (results) {
                                self.filteredPlaces = $placeFilterService.filterPlacesByBounds(results.data, list);
                                self.setupMarkers();
                                self.setLoadingVisible(false);
                                directionsDisplay.setDirections(response);
                                self.bindSourceAndDestinationCoords(self.sourceLocation, self.destinationLocation);
                            }, function (error) { console.log(error) });
                        }
                    });
                })
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
            this.openInfoWindowFromList(item);

        }

        this.openInfoWindow = function (marker) {

            self.infoWindow.coords = { latitude: marker.position.lat(), longitude: marker.position.lng() };
            var index = marker.key.split(",")[1];

            self.infoWindow.name = self.filteredPlaces[index].name;
            self.infoWindow.address = self.filteredPlaces[index].address;

            self.infoWindow.show = true;

        }

        this.openInfoWindowFromList = function (item) {

            self.infoWindow.coords = { latitude: item.location.latitude, longitude: item.location.longitude };

            for (var count = 0; count < self.filteredPlaces.length; count++) {
                if (self.filteredPlaces[count].place_id == item.place_id) {

                    self.infoWindow.name = self.filteredPlaces[count].name;
                    self.infoWindow.address = self.filteredPlaces[count].address;

                    self.infoWindow.show = true;
                    break;

                }
            }

        }

        this.markerEvents = {

            click: function (marker) {

                self.infoWindow.show = true;

                self.openInfoWindow(marker);
                var key = marker.key.split(",")[0];
                angular.element('#' + key).triggerHandler('click');

            }

        }

        this.setIconConfig = function (size) {
            this.placeIconWidth = size + "px";
            this.placeIconHeight = size + "px";
            this.top = "14px"
            this.background_size = "contain";
            this.position = "relative";
            this.box_shadow = "3px 3px 2px 2px rgba(0, 0, 0, 0.4)";
            this.display = "inline-block";
        }

        this.showRouteBoxes = function (toggle) {

            for (var count = 0; count < this.routeBoxes.length; count++) {
                this.routeBoxes[count].setVisible(toggle);
            }
        }

        function setPageDimensions() {
            var height = $('.mainview').height() - $('.autocomplete').height();
            $('.angular-google-map-container').height(height);
            $('.ui-list-view').height(height - $('.mainListView').height());
        }

        this.bindSourceAndDestinationCoords = function (source, destination) {
            var promises = [];
            promises.push($locationService.getLatLngFromAddress(source));
            promises.push($locationService.getLatLngFromAddress(destination));

            Promise.all(promises).then(function (results) {

                this.sourceLocationCoords = { latitude: results[0].lat(), longitude: results[0].lng() };
                this.destinationLocationCoords = { latitude: results[1].lat(), longitude: results[1].lng() };

            }.bind(this))
        }

        this.mapsInitialisedPromise = uiGmapIsReady.promise()
            .then(function (map_instances) {
                this.map = map_instances[0].map;      // get map object through array object returned by uiGmapIsReady promise
            }.bind(this));

        if ($stateParams.source && $stateParams.destination) {
            this.sourceLocation = $stateParams.source;
            this.destinationLocation = $stateParams.destination;
            this.filter = $stateParams.filter;

            $locationService.getLatLngFromAddress(this.sourceLocation).then(function (position) {

                position = { coords: { latitude: position.lat(), longitude: position.lng() } };
                this.location = position;
                setPageDimensions();
                this.mapsInitialisedPromise.then(function () {
                    this.searchNearByPlaces(this.sourceLocation, this.destinationLocation, this.filter);
                }.bind(this))

            }.bind(this))

        } else {
            $locationService.getLocation().then(function (position) {
                position = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude } };
                self.location = position;
                self.currentLocation = angular.copy(self.location);
                setPageDimensions();
                return $locationService.getAddress(self.location.coords)
            })
                .then(function (address) {
                    self.currentAddress = address;
                    $scope.$apply();
                });
        }


    }]);

