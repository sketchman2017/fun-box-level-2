angular.module("myApp",[]).run(
function($rootScope) {}).controller("ListController", 
  function($scope, $rootScope) {
    $scope.get_list = function() {
        var keys = Object.keys(localStorage);
        var points_list = {};

        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("point")) {
                var value = localStorage.getItem(keys[i]);
                points_list[keys[i]] = value;
            }
        }
        return points_list;
    }

    $scope.put_to_list = function() {
        var new_key = "point" + $scope.point_index;
        localStorage.setItem(new_key, $scope.newPoint);
        $scope.point_index++;
    }

    $scope.delete_from_list = function(current_point_index) {
        var key_for_remove = current_point_index;
        localStorage.removeItem(key_for_remove);
        $scope.points = $scope.get_list();
    }

    $scope.newPoint = "";
    $scope.points = $scope.get_list();
    $scope.point_index = 0;

    window.initMap = function() {
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 43.4950, lng: 43.6045},
            scrollwheel: false,
            zoom: 8
        });
    }

    document.getElementById("new_point").addEventListener("keyup",
        function(event) {
            if (event.which == 13 && $scope.newPoint != "") {
                $scope.put_to_list();
                $scope.points = $scope.get_list();
                $scope.newPoint = "";
                $scope.$digest();
            }
        },
        false
    );
});
