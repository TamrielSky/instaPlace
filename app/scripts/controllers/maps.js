angular.module('instaPlaceApp')
    .controller('mapsCtrl', ['$localStorage', '$scope', function ($localStorage, $scope) {

        // this.mapConfig = { center: { latitude: $localStorage.location.coords.latitude, longitude: $localStorage.location.coords.longitude }, zoom: 8 };

        this.markerEvents = {click: function(marker) {

                angular.element('#'+marker.key).triggerHandler('click');

        }}

        this.windowOptions = {visible: false};
        var styles = [
            {
                featureType: "all",
                stylers: [
                    { saturation: -80 }
                ]
            }, {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                    { hue: "#00ffee" },
                    { saturation: 50 }
                ]
            }, {
                featureType: "poi.business",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];



        $scope.options = {
            styles: styles
        };


        this.currentLocationMarker = {
            options: {
                icon: { url: '../images/blue_dot_circle.png' },
            }
        };


        this.markers = {
            'restaurant': {
                options: {
                    icon: {
                        url: '../images/restaurant-marker.png', scaledSize: new google.maps.Size(30, 30)
                    },
                }
            },
            'atm': {
                options: {
                    icon: {
                        url: '../images/atm-marker.png', scaledSize: new google.maps.Size(30, 30)
                    },
                }
            },
            'bar': {
                options: {
                    icon: {
                        url: '../images/bar-marker.png', scaledSize: new google.maps.Size(30, 30)
                    },
                }
            },

            'grocery': {
                options: {
                    icon: {
                        url: '../images/grocery-marker.png', scaledSize: new google.maps.Size(30, 30)
                    },
                }
            },
            'airport': {
                options: {
                    icon: {
                        url: '../images/atm-marker.png', scaledSize: new google.maps.Size(30, 30)
                    },
                }
            },

            'hospital': {
                options: {
                    icon: {
                        url: '../images/hospital-marker.png', scaledSize: new google.maps.Size(30, 30)
                    },
                }
            },
        }

    }]);