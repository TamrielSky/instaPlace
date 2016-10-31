'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
    .service('geolocationService', function ($http) {

        this.yelpApi = "http://api.yelp.com/v2/search/?";
        this.fourSquareApi = "https://api.foursquare.com/v2/venues/explore?";

        this.categoryMap = {
            'foursquare':{
            'restaurant': '4bf58dd8d48988d1c4941735',
            'grocery': '4bf58dd8d48988d118951735',
            'bar': '4bf58dd8d48988d116941735',
            'airport': '4bf58dd8d48988d1ed931735',
            'hospital': '4bf58dd8d48988d196941735',
            'atm': '52f2ab2ebcbc57f1066b8b56',
            'gas_station': '4bf58dd8d48988d113951735'
            },
            'yelp':{
            'restaurant': 'restaurants',
            'grocery': 'grocery',
            'bar': 'bars',
            'airport': 'airports',
            'hospital': 'hospitals',
            'atm': 'atm',
            'gas_station': 'servicestations'
            }

        };

        // Try W3C Geolocation (Preferred)
        this.getLocation = function () {
            return new Promise(function (resolve, reject) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        resolve(position);
                    }, function () {
                        reject("error");
                    });
                }
                // Browser doesn't support Geolocation
                else {
                    reject("error");
                }
            });
        }

        this.getAddress = function (coords) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var geocoder = new google.maps.Geocoder;
                geocoder.geocode({ 'location': { lat: coords.latitude, lng: coords.longitude } }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            self.currentAddress = results[0].formatted_address;
                            resolve(results[0].formatted_address);
                        } else {
                            reject("error");

                        }
                    } else {
                        reject("error");
                    }
                });
            });
        }

        this.getLatLngFromAddress = function (address) {
            return new Promise(function (resolve, reject) {
                var geocoder = new google.maps.Geocoder;
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        resolve(results[0].geometry.location);
                    } else {
                        resolve("error");
                    }
                });
            });
        }

        this.getAllPlaceDetailsById = function (places) {
            var self = this;
            var placeDetails = [];
            return new Promise(function (resolve, reject) {
            
                var prevPromise = Promise.resolve();
                places.forEach(function (place) {  // loop through each title
                    prevPromise = prevPromise.then(function () { // prevPromise changes in each iteration
                        return self.getPlaceDetailsById(place.place_id, place.geometry.location.lat(), place.geometry.location.lng())// return a new Promise
                    }).then(function (data) {
                        placeDetails.push(data);
                    }).catch(function (error) {
                        console.log(error);
                    });
                });

                prevPromise.then(function () {
                    resolve(placeDetails);
                });
          
            });
        }


        this.getPlaceDetailsById = function (placeId, lat, lng) {
            return new Promise(function (resolve, reject) {

                var map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: lat, lng: lng },
                    zoom: 15
                });
                var service = new google.maps.places.PlacesService(map);
                var request = {

                    placeId: placeId
                };

                service.getDetails(request, function (place, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        resolve(place);
                    }
                    else {
                        alert(status);
                        resolve("error");
                    }
                });

            });
        }

        this.calculateAndDisplayRoute = function (start, end) {

            return new Promise(function (resolve, reject) {
                var directionsService = new google.maps.DirectionsService;
                directionsService.route({
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.DRIVING
                }, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        resolve(response);
                    } else {
                        alert(status);
                        resolve("error");
                    }
                });
            });
        }

        this.getPlacesAlongRoute = function (bounds, filters) {

            var request = {
                url: 'https://ec2-54-153-12-214.us-west-1.compute.amazonaws.com:3000/search',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: [bounds, filters]
            }

            return $http(request);

        }
    });
