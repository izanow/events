const myApp = angular.module('myApp', []);

myApp.controller('MainController', ['$scope', '$http', ($scope, $http) => {

    $scope.setPage = (currentPage) => {
        $scope.foundEvent = '';
        $http.get('/page/' + currentPage).then((response) => {
            $scope.events = response.data;
        });
    };
    const refresh = () => {
        $http.get('/numberOfRows').then((response) => {
            $scope.numberOfPages = Number(Math.ceil(response.data / 10));
            const arr = [...Array($scope.numberOfPages + 1).keys()];
            arr.shift();
            $scope.pages = arr;
        });
        $scope.editIsHiden = true;
        $scope.setPage(1);
    };
    refresh();

    $scope.createEvent = async () => {
        console.log('lalalalal');
        await $http.post('/events', $scope.event);
        $scope.event = {};
        refresh();
    };

    $scope.findEvent = (id) => {
        $http.get('/events/' + id)
            .then((response) => {
                $scope.event = response.data;
                $scope.event.start_date = new Date($scope.event.start_date);
                $scope.event.end_date = new Date($scope.event.end_date);
                $scope.event.people = Number($scope.event.people);
                $scope.event.price = Number($scope.event.price);
            });
    };

    $scope.deleteEvent = async (id) => {
        await $http.delete('/events/' + id);
        $scope.event = {};
        refresh();
        $scope.createIsHiden = false;
    };

    $scope.editEvent = (id) => {
        $scope.createIsHiden = true;
        $scope.editIsHiden = false;
        $scope.findEvent(id);
    };

    $scope.updateEvent = async () => {
        $scope.createIsHiden = false;
        $scope.editIsHiden = true;
        await $http.put('/events/' + $scope.event.id, $scope.event);
        if ($scope.foundEvent !== '') {
            $scope.searchEvent($scope.event.id)
        }
        else {
            refresh();
        }
        $scope.event = {};

    };

    $scope.clearEvent = () => {
        $scope.createIsHiden = false;
        $scope.editIsHiden = true;
        $scope.event = {};
    };

    $scope.searchEvent = async (eventIdToSearch) => {
        $http.get('/search/' + eventIdToSearch).then((response) => {
            if (response.data !== null) {
                $scope.foundEvent = response.data;
                $scope.events = "";
                document.getElementById('message').innerHTML='';
            }
            else {
                document.getElementById('message').innerHTML='NO EVENT';
            }
        });
    };

    $scope.sortEvents = function (keyName) {
        $scope.sortKey = keyName;
        $scope.reverse = !$scope.reverse;
    };
}
]);