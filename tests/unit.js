 /* Test Code */
describe('Router', function () {
      beforeEach(module('myApp'));
      var $controller;
      beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
      }));
      
      describe('getting list from local storage', function () {
        it('gets and check list from localStorage', function () {
          var $scope = {};
          var controller = $controller('ListController', { $scope: $scope });

          localStorage.clear();
          localStorage.setItem('point0', JSON.stringify({
            "value": "test point title 1",
            "number": 0,
            "lat": 43.58,
            "lng": 23.90
          }));
          localStorage.setItem('point7', JSON.stringify({
            "value": "test point title 2",
            "number": 1,
            "lat": 0.00,
            "lng": 10.00
          }));
          localStorage.setItem('point5', JSON.stringify({
            "value": "test point title 3",
            "number": 2,
            "lat": 25.00,
            "lng": 70.01
          }));

          var list = $scope.get_list();

          expect(Object.keys(list).length).toEqual(3);

          expect(list["point0"]).toEqual({
            "value": "test point title 1",
            "number": 0,
            "lat": 43.58,
            "lng": 23.90
          });

          expect(list["point7"]).toEqual({
            "value": "test point title 2",
            "number": 1,
            "lat": 0.00,
            "lng": 10.00
          });

          expect(list['point5']).toEqual({
            "value": "test point title 3",
            "number": 2,
            "lat": 25.00,
            "lng": 70.01
          });
        }); 
      });

      describe('checks _point_index', function () {
        it('checks _point_index', function () {
          var $scope = {};
          var controller = $controller('ListController', { $scope: $scope });

          localStorage.clear();
          $scope.get_point_index();
          expect($scope.point_index).toEqual(0);

          localStorage.clear();
          localStorage.setItem("_point_index", 10);
          $scope.get_point_index();
          expect($scope.point_index).toEqual('10');
        });
      });

      describe('put point to list (localStorage)', function () {
        it('put point to list (localStorage)', function () {
          var $scope = {};
          var controller = $controller('ListController', { $scope: $scope });
          $scope.point_index = '15';
          localStorage.clear();
          $scope.newPoint = "New point"
          $scope.put_to_list(10.00, 11.78);
          var p = JSON.parse(localStorage.getItem("point15"));
          expect($scope.point_index).toEqual(16);
          expect(p).toEqual({
            "value": $scope.newPoint,
            "number": 0,
            "lat": 10.00,
            "lng": 11.78
          });
        });
      });

      describe('getting markers list list (localStorage) with google maps mock', function () {
        it('gets markers list (localStorage)', function () {
          var $scope = {};
          var controller = $controller('ListController', { $scope: $scope });
          
          localStorage.clear();
          localStorage.setItem('point0', JSON.stringify({
            "value": "test point title № 1",
            "number": 0,
            "lat": 3.58,
            "lng": 2.90
          }));
          localStorage.setItem('point3', JSON.stringify({
            "value": "test point title № 2",
            "number": 1,
            "lat": 40.00,
            "lng": 17.00
          }));
          localStorage.setItem('point6', JSON.stringify({
            "value": "test point title № 3",
            "number": 2,
            "lat": 25.00,
            "lng": 70.01
          }));

          $scope.initialCoords = {lat: 43.4950, lng: 43.6045};

          // Create a map object and specify the DOM element for display.
          $scope.map = new google.maps.Map(document.getElementById('map'), {
              center: $scope.initialCoords,
              scrollwheel: false,
              zoom: 2
          });

          markers_list = $scope.get_markers();
          console.log(markers_list[0]);

          expect(Object.keys(markers_list).length).toEqual(3);
        });
      });

    });

