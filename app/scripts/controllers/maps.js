angular.module('instaPlaceApp')
    .controller('mapsCtrl', ['$localStorage', '$scope', function ($localStorage, $scope) {

        // this.mapConfig = { center: { latitude: $localStorage.location.coords.latitude, longitude: $localStorage.location.coords.longitude }, zoom: 8 };




        this.currentLocationMarker = {
            options: {
                icon: { url: '../images/blue_dot_circle.png' },
                draggable: false
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

        this.restaurant =

            this.restaurant = {
                options: {
                    icon: {
                        url: '../images/restaurant-marker.png', scaledSize: new google.maps.Size(30, 30)
                    },
                    draggable: false
                }
            };


        this.restaurant = {
            options: {
                icon: {
                    url: '../images/restaurant-marker.png', scaledSize: new google.maps.Size(30, 30)
                },
                draggable: false
            }
        };

        this.restaurant = {
            options: {
                icon: {
                    url: '../images/restaurant-marker.png', scaledSize: new google.maps.Size(30, 30)
                },
                draggable: false
            }
        };
        this.restaurant = {
            options: {
                icon: {
                    url: '../images/restaurant-marker.png', scaledSize: new google.maps.Size(30, 30)
                },
                draggable: false
            }
        };

        this.placeLocationMarker = {
            options: {

            }
        }

        this.currentLocationMarker.events = [{ position_changed: function () { console.log("bounds changed"); } }, { cursor_changed: function () { console.log("center changed"); } }];


    }]);