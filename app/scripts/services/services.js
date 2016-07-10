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
   
      this.yelpApi = "https://api.yelp.com/v2/search/?";
      this.fourSquareApi = "https://api.foursquare.com/v2/venues/search?";
      this.currentAddress = "";

      // Try W3C Geolocation (Preferred)
      this.getLocation = function () {
          return new Promise( function(resolve, reject) {
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
              geocoder.geocode({ 'location': {lat: coords.latitude, lng: coords.longitude} }, function (results, status) {
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

      this.getNearByPlaces = function (lat, lng, zoom, currentMap, radius) {
          
          var signature = 
		      	oauthSignature.generate(
			      	method, 
			      	url, 
			      	params, 
			      	consumerSecret, 
			      	tokenSecret, 
			      	{ encodeSignature: false }
		      	); 
          var params = {
						callback: 								'angular.callbacks._0',
						location: 								'30030',
						oauth_consumer_key: 			'h_CfYvwNTS51n96wd1J8Yg', // consumer key
						oauth_token: 							'YQHmflBE5VKvzjCgO5N3YkmsB4xIUNsa', //Token
						oauth_signature_method: 	'HMAC-SHA1',
	          oauth_timestamp: 					new Date().getTime()
					};


          var promises = [];
           
          promises.push($http({method: 'GET', url: this.yelpApi+'location='+this.currentAddress+'&sort=1&limit=20&radius_filter='+radius, params: params}));
          promises.push($http({method: 'GET', url: this.yelpApi+'location='+this.currentAddress+'&sort=1&offset=20&limit=20&radius_filter='+radius, params: params}));
          promises.push($http({method: 'GET', url: this.fourSquareApi+'intent=explore&ll='+lat+','+lng+'&v=20160806&client_id=HTYPWDKP445LBUZJLZWDR3C4D1GCOB4WNPW20UUGSJH0C32R&client_secret=V5VSZEHG1O4VNIGZSFAM11ZLHB2WKOEWOPMADS0XF1QRQMML'})); 
          
          promises.push(new Promise(function (resolve, reject) {

              var map = currentMap;
              var request = {
                  location: { lat: lat, lng: lng },
                  radius: radius,
                  types: ['store']
              };
              var service = new google.maps.places.PlacesService(map);
              service.nearbySearch(request, function (results, status) {
                  if (status == google.maps.places.PlacesServiceStatus.OK) {
                      resolve(results);
                  }
              });
          }));

          return Promise.all(promises);

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
/*
              var promises = [];
              for (var i = 0; i < places.length; i++) {
                  promises.push(self.getPlaceDetailsById(places[i].place_id, places[i].geometry.location.lat(), places[i].geometry.location.lng())); // push the Promises to our array
              }
              Promise.all(promises).then(function (dataArr) {
                  resolve(dataArr);
              });
*/
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
              /*self.getPlaceDetailsById(places[0].place_id, places[0].geometry.location.lat(), places[0].geometry.location.lng()).then(function (dataArr) {
                  resolve(dataArr);
              });
              */
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
});
