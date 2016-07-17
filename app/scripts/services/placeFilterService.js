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


        this.filterPlaces = function (places) {

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

                            var address = "";
                            for (var i = 0; i < places[resultCount].data.businesses[j].location.display_address.length; i++) {

                                address = address + places[resultCount].data.businesses[j].location.display_address[i];

                            }
                            placeList[count]["address"] = address;
                            placeList[count]["location"] = places[resultCount].data.businesses[j].location.coordinate;
                            count++;

                        }

                    } else {

                        var placeItems = places[resultCount].data.response.groups[0].items;

                        for (var j = 0; j < placeItems.length; j++) {

                            placeList[count] = {};
                            var venue = placeItems[j].venue;

                            placeList[count]["distance"] = venue.location.distance;

                            var address = "";
                            for (var i = 0; i < venue.location.formattedAddress.length; i++) {

                                address = address + venue.location.formattedAddress[i];

                            }
                            placeList[count]["address"] = address;

                            placeList[count]["rating"] = venue.rating;
                            placeList[count]["name"] = venue.name;
                            placeList[count]["location"] = { lat: venue.location.lat, lng: venue.location.lng };
                            placeList[count]["contact"] = venue.contact.formattedPhone;
                            placeList[count]["review"] = placeItems[j].tips[0].text;
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
                        placeList[count]["location"] = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
                        placeList[count]["address"] = place.vicinity;
                        count++;

                    }

                }

            }

            return placeList;

        }
    });