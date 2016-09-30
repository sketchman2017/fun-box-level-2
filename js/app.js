angular.module("myApp", []).run(
function($rootScope) {}).controller("ListController", 
  function($scope, $rootScope) {

    $scope.get_list = function() {
        var keys = Object.keys(localStorage);
        var points_list = {};

        // Получение списка точек маршрута. Элемент списка - значение и номер в списке по порядку.
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("point")) {
                var value = JSON.parse(localStorage.getItem(keys[i]));
                points_list[keys[i]] = value;
            }
        }

        return points_list;
    }

    // Помещение точки в список
    $scope.put_to_list = function() {
        var new_key = "point" + $scope.point_index;
        var keys = Object.keys(localStorage);
        var number = 0;

        // Вычисляем номер нового элемента в списке перед помещением.
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("point")) {
                number++;
            }
        }

        // Помещаем элемент списка в хранилище вместе в порядковым номером и координатами
        localStorage.setItem(new_key, JSON.stringify({
            "value": $scope.newPoint,
            "number": number,
            "lat": "43.4950",
            "lng": "43.6045"
        }));

        $scope.point_index++;
        return number;
    }

    $scope.delete_from_list = function(current_point_index) {
        // ???
        var key_for_remove = current_point_index;
        var keys = Object.keys(localStorage);

        // Получаем элемент из хранилища
        var point = JSON.parse(localStorage.getItem(key_for_remove));

        // При удалении элемента из списка необходимо понизить номера
        // у всех элементов, у которых они больше.
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("point")) {
                var current_element = JSON.parse(localStorage.getItem(keys[i]));
                if (current_element.number > point.number) {
                    current_element.number--;
                    localStorage.removeItem(keys[i]);
                    localStorage.setItem(keys[i], JSON.stringify(current_element));
                }
            }
        }

        // Удаляем элемент
        localStorage.removeItem(key_for_remove);
        // Обновляем список точек из хранилища
        $scope.points = $scope.get_list();
        $scope.Path.setMap(null);
    }

    // Рисуем маркеры и маршрут между ними
    $scope.drawRoute = function() {
        // Сортируем текущий массив точек
        // Для каждой точки массива вытаскиваем и рисуем маркер в координатах и ломаную маршрута между маркерами 
        $scope.points = $scope.get_list();
        
    }

    $scope.newPoint = "";
    // Получение списка точек из хранилища
    $scope.points = $scope.get_list();
    $scope.point_index = 0;
    $scope.map;

    window.initMap = function() {
        // Create a map object and specify the DOM element for display.
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 43.4950, lng: 43.6045},
            scrollwheel: false,
            zoom: 8
        });
    }

    document.getElementById("new_point").addEventListener("keyup",
        function(event) {
            if (event.which == 13 && $scope.newPoint != "") {
                var marker_number = $scope.put_to_list();
                $scope.points = $scope.get_list();

                // Создание маркера
                var marker = new google.maps.Marker({
                    position: {lat: 43.4950, lng: 43.6045},
                    map: $scope.map,
                    draggable: true
                });

                // Добавление всплывающей подсказки с текстом при клике на маркер
                var marker_tooltip_content = document.createElement('div');
                marker_tooltip_content.innerHTML = "<strong>" + $scope.newPoint + "</strong>";
                var infowindow = new google.maps.InfoWindow({
                    content: marker_tooltip_content
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open($scope.map, marker);
                });

                // Добавление номера маркеру
                marker.metadata = { number: marker_number };

                // При перетаскивании маркера изменение координат точки в хранилище
                google.maps.event.addListener(marker, "dragend", function(event) { 
                    var lat_new = event.latLng.lat();
                    var lng_new = event.latLng.lng();
                    debugger;

                    var marker_number = marker.metadata.number;
                    var keys = Object.keys(localStorage);

                    // Получение списка точек маршрута. Обновление координат.
                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i].startsWith("point")) {
                            var current_point = JSON.parse(localStorage.getItem(keys[i]));
                            // Нашли маркер с таким номером
                            if (marker_number === current_point.number) {
                                // Обновить координаты
                                current_point.lat = lat_new;
                                current_point.lng = lng_new;
                                localStorage.removeItem(keys[i]);
                                localStorage.setItem(keys[i], JSON.stringify(current_point));
                                break;
                            }
                        }
                    }
                    $scope.points = $scope.get_list();
                    $scope.$digest();
                });

                // Отрисовка маршрута
                var Coordinates = [
                    {lat: 37.772, lng: -122.214},
                    {lat: 21.291, lng: -157.821},
                    {lat: -18.142, lng: 178.431},
                    {lat: -27.467, lng: 153.027}
                ];

                $scope.Path = new google.maps.Polyline({
                    path: Coordinates,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                $scope.Path.setMap($scope.map);

                // Обнуление введенного текста - названия точки маршрута
                $scope.newPoint = "";
                $scope.$digest();
            }
        },
        false
    );
});
