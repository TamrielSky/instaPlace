'use strict';

/**
 * @ngdoc function
 * @name instaPlaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the instaPlaceApp
 */
angular.module('instaPlaceApp')
    .service('placeFilterService', function ($http) {


        this.filterPlaces = function (places, currentLocation, searchFilter) {

            var placeList = [];
            var count = 0;
            for (var resultCount = 0; resultCount < places.length; resultCount++) {

                if (Object.prototype.toString.call(places[resultCount]) === '[object Object]') {
                    if (places[resultCount].config.url.includes("yelp")) {

                        for (var j = 0; j < places[resultCount].data.businesses.length; j++) {
                            placeList[count] = {};

                            placeList[count]["distance"] = places[resultCount].data.businesses[j].distance;
                            placeList[count]["name"] = places[resultCount].data.businesses[j].name;
                            placeList[count]["contact"] = places[resultCount].data.businesses[j].display_phone;
                            placeList[count]["rating"] = places[resultCount].data.businesses[j].rating;
                            placeList[count]["review"] = places[resultCount].data.businesses[j].snippet_text;

                            var address = [];
                            for (var i = 0; i < places[resultCount].data.businesses[j].location.display_address.length; i++) {

                                address.push(places[resultCount].data.businesses[j].location.display_address[i]);

                            }
                            address = address.join();
                            placeList[count]["address"] = address;
                            placeList[count]["location"] = places[resultCount].data.businesses[j].location.coordinate;
                            placeList[count]["datasrc"] = "yelp";
                            placeList[count]["filter"] = searchFilter;
                            count++;

                        }

                    } else {

                        var placeItems = places[resultCount].data.response.groups[0].items;

                        for (var j = 0; j < placeItems.length; j++) {

                            placeList[count] = {};
                            var venue = placeItems[j].venue;

                            placeList[count]["distance"] = venue.location.distance;

                            var address = [];
                            for (var i = 0; i < venue.location.formattedAddress.length; i++) {

                                address.push(venue.location.formattedAddress[i]);

                            }
                            address = address.join();
                            placeList[count]["address"] = address;

                            placeList[count]["rating"] = venue.rating;
                            placeList[count]["name"] = venue.name;
                            placeList[count]["location"] = { latitude: venue.location.lat, longitude: venue.location.lng };
                            placeList[count]["contact"] = venue.contact.formattedPhone;
                            if(placeItems[j].tips) {
                            placeList[count]["review"] = placeItems[j].tips[0].text;
                            }
                            placeList[count]["datasrc"] = "foursquare";
                            placeList[count]["filter"] = searchFilter;
                            count++;
                        }
                    }

                } else {

                    var googlePlaces = places[resultCount];

                    for (var i = 0; i < googlePlaces.length; i++) {
                        placeList[count] = {};
                        var place = googlePlaces[i];

                        placeList[count]["rating"] = place.rating;
                        placeList[count]["name"] = place.name;
                        placeList[count]["location"] = { latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() };
                        placeList["distance"] = this.calcDistance(currentLocation.coords.latitude, currentLocation.coords.longitude, place.geometry.location.lat(), place.geometry.location.lng());
                        placeList[count]["address"] = place.vicinity;
                        placeList[count]["datasrc"] = "google";
                        placeList[count]["filter"] = searchFilter;
                        count++;

                    }

                }

            }
            return placeList;
        }

        this.eliminateDuplicates = function (places) {

            var newPlaces = [];
            var placeList = [];
            var count = 0;

            for (var i = 0; i < places.length; i++) {

                newPlaces[places[i].address.split(",")[0] + places[i].name] = places[i];

            }
            for (var item in newPlaces) {

                placeList[count++] = newPlaces[item];

            }

            return placeList;
        }

        this.calcDistance = function (lat1, lng1, lat2, lng2) {

            var R = 6371; // km
            var dLat = toRad(lat2 - lat1);
            var dLon = toRad(lng2 - lat1);
            var lat1 = toRad(lat1);
            var lat2 = toRad(lat2);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d*1000;

            // Converts numeric degrees to radians
            function toRad(Value) {
                return Value * Math.PI / 180;
            }

        }

        this.compare = function (a, b) {
            return (a.distance - b.distance)
             
        }
    });