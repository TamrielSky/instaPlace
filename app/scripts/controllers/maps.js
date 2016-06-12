angular.module('instaPlaceApp')
    .controller('mapsCtrl', ['$localStorage', function($localStorage){

  // this.mapConfig = { center: { latitude: $localStorage.location.coords.latitude, longitude: $localStorage.location.coords.longitude }, zoom: 8 };
   this.currentLocationMarker = {options: {
       icon: {url: '../images/blue_dot_circle.png',  anchor: new google.maps.Point(16, 20), origin: new google.maps.Point(0, 0)},
       draggable: false, 
       position: new google.maps.LatLng( 37.6678615, -122.08706719999998),
       anchorPoint: new google.maps.Point(0, 0)
   }
   };
   
   this.placeLocationMarker = {
       options: {
           
       }
   }
   
   this.currentLocationMarker.events = [{position_changed: function(){console.log("bounds changed");}}, {cursor_changed: function(){console.log("center changed");}}];
   
   
 }]);