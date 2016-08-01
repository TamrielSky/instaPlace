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


        this.filterPlaces = function (results, currentLocation) {
            var placeList = [];
            var count = 0;

debugger;
            for (var type in results) {
                var places = results[type];
                for (var resultCount = 0; resultCount < places.length; resultCount++) {

                    if (Object.prototype.toString.call(places[resultCount]) === '[object Object]') {
                        if (places[resultCount].config.url.includes("yelp")) {

                            for (var j = 0; j < places[resultCount].data.businesses.length; j++) {
                                placeList[count] = {};

                                if (!places[resultCount].data.businesses[j].distance) {
                                    debugger;
                                }
                                placeList[count]["distance"] = ((places[resultCount].data.businesses[j].distance) * 0.000621371192).toFixed(2);
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
                                placeList[count]["place_id"] = places[resultCount].data.businesses[j].id;
                                placeList[count]["filter"] = type;
                                placeList[count]["selected"] = false;
                                count++;

                            }

                        } else {

                            var placeItems = places[resultCount].data.response.groups[0].items;

                            for (var j = 0; j < placeItems.length; j++) {

                                placeList[count] = {};
                                var venue = placeItems[j].venue;

                                if (!venue.location.distance) {
                                    debugger;
                                }

                                placeList[count]["distance"] = ((venue.location.distance) * 0.000621371192).toFixed(2);

                                var address = [];
                                for (var i = 0; i < venue.location.formattedAddress.length; i++) {

                                    address.push(venue.location.formattedAddress[i]);

                                }
                                address = address.join();
                                placeList[count]["address"] = address;

                                placeList[count]["rating"] = venue.rating * 5 / 10;
                                placeList[count]["name"] = venue.name;
                                placeList[count]["location"] = { latitude: venue.location.lat, longitude: venue.location.lng };
                                placeList[count]["contact"] = venue.contact.formattedPhone;
                                if (placeItems[j].tips) {
                                    placeList[count]["review"] = placeItems[j].tips[0].text;
                                }
                                placeList[count]["datasrc"] = "foursquare";
                                placeList[count]["filter"] = type;
                                placeList[count]["place_id"] = venue.id;
                                placeList[count]["selected"] = false;

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
                            placeList[count]["distance"] = ((this.calcDistance(currentLocation.coords.latitude, currentLocation.coords.longitude, place.geometry.location.lat(), place.geometry.location.lng())) * 0.000621371192).toFixed(2);
                            placeList[count]["address"] = place.vicinity;
                            placeList[count]["datasrc"] = "google";
                            placeList[count]["filter"] = type;
                            placeList[count]["place_id"] = place.id;
                            placeList[count]["selected"] = false;

                            count++;

                        }

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

                if(newPlaces[places[i].distance + "," + places[i].name]) {

                    if(places[i].rating) {

                       newPlaces[places[i].distance + "," + places[i].name] = places[i];

                    } 

                } else {

                    newPlaces[places[i].distance + "," + places[i].name] = places[i];

                }

            }
            for (var item in newPlaces) {

                placeList[count++] = newPlaces[item];

            }

            return placeList;
        }

        this.calcDistance = function (lat1, lon1, lat2, lon2) {

            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d * 1000;


            function deg2rad(deg) {
                return deg * (Math.PI / 180)
            }
        }

        this.compare = function (a, b) {

            if (a.distance == b.distance) {
                return 0;
            } else {
                return a.distance < b.distance ? -1 : 1;
            }

        }
    });