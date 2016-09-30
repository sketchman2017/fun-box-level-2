angular.module("myApp", []).run(
function($rootScope) {}).controller("ListController", 
  function($scope, $rootScope) {

    $scope.get_list = function() {
        var keys = Object.keys(localStorage);
        var points_list = {};

        // Получение списка точек маршрута. Элемент списка - значение и номер в списке по порядку.
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("point")) {
                var val = JSON.parse(localStorage.getItem(keys[i]));
                points_list[keys[i]] = val;
            }
        }

        return points_list;
    }

    // Помещение точки в список
    $scope.put_to_list = function(new_lat, new_lng) {
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
            "lat": new_lat,
            "lng": new_lng
        }));

        $scope.point_index++;
        return number;
    }

    // Рисуем маркеры и маршрут между ними
    $scope.drawRoute = function() {
        debugger;
        // Удаление предыдущего маршрута
        for (var i = 0; i < $scope.polylines.length; i++) {
            $scope.polylines[i].setMap(null);
        }

        // Сортируем текущий массив точек
        // Для каждой точки массива вытаскиваем и рисуем маркер в координатах и ломаную маршрута между маркерами

        $scope.points = $scope.get_list();

        for (var i in $scope.points) {
            for (var j in $scope.points) {
                if ($scope.points[i].number + 1 === $scope.points[j].number) {
                    // Отрисовка маршрута
                    var Coordinates = [
                        { lat: parseInt($scope.points[i].lat, 10),
                          lng: parseInt($scope.points[i].lng, 10) },
                        { lat: parseInt($scope.points[j].lat, 10),
                          lng: parseInt($scope.points[j].lng, 10) }
                    ];

                    var Path = new google.maps.Polyline({
                        path: Coordinates,
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });

                    Path.setMap($scope.map);
                    $scope.polylines.push(Path);
                }
            }
        }

    }

    $scope.delete_from_list = function(current_point_index, current_point_number) {
        // 
        var key_for_remove = current_point_index;
        var keys = Object.keys(localStorage);

        // Получаем элемент из хранилища
        var point = JSON.parse(localStorage.getItem(key_for_remove));
        debugger;
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

        // Удаляем маркер
        for (var i = 0; i < $scope.markers.length; i++) {
            if ($scope.markers[i].metadata.number === current_point_number) {
                $scope.markers[i].setMap(null);
                $scope.markers.splice(i, 1);
                break;
            }
        }

        // Обновляем список точек из хранилища
        $scope.drawRoute();
    }

    $scope.newPoint = "";
    // Получение списка точек из хранилища
    $scope.points = $scope.get_list();
    $scope.point_index = 0;
    $scope.map;
    $scope.polylines = [];
    $scope.markers = [];
    $scope.initialCoords = {lat: 43.4950, lng: 43.6045};

    window.initMap = function() {
        // Create a map object and specify the DOM element for display.
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: $scope.initialCoords,
            scrollwheel: false,
            zoom: 2
        });
    }

    document.getElementById("new_point").addEventListener("keyup",
        function(event) {
            if (event.which == 13 && $scope.newPoint != "") {
                var new_lat = $scope.initialCoords.lat + 20*(Math.random() - 0.5); 
                var new_lng = $scope.initialCoords.lng + 20*(Math.random() - 0.5);
                debugger;
                var marker_number = $scope.put_to_list(new_lat, new_lng);
                $scope.points = $scope.get_list();

                // Создание маркера
                var marker = new google.maps.Marker({
                    position: { lat: new_lat, lng: new_lng }, 
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
                    $scope.drawRoute();
                });

                $scope.markers.push(marker);

                // Отрисовка маршрута
                $scope.drawRoute();

                // Обнуление введенного текста - названия точки маршрута
                $scope.newPoint = "";
                $scope.$digest();
            }
        },
        false
    );
});
