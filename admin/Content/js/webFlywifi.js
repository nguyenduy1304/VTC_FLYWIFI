var host = window.host;
var host_api = window.host_api;
var timer = 10000;


var app = angular.module('webFlywifi', ['ui.router', 'ui.bootstrap', 'angular.filter', 'ckeditor']);
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('list_staffs', {
            url: '/danh-sach-nhan-vien',
            allowAnonymous: true,
            controller: 'list_staffs',
            templateUrl: window.templateUrl + "/liststaffs.html"
        })

});
app.run(function ($window, $rootScope, $q, $http, $location, $log, $timeout, $state, $interval) {
    $rootScope.$watch('$user', function () {
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
    })
    $rootScope.logOut = function () {
        $rootScope.$user = null;
        $rootScope.login_active = true;
        $state.go('account$signout');
    }
    $rootScope.formatNumbers = function (number) {
        return formatNumbers(number)
    };

})

app.controller('sourcelibraryCtrl', function ($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
    $http({
        method: 'GET',
        url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/sourcelibrary.json',
        headers: {
            'Authorization': "Bearer " + $window.localStorage.token
        }
    }).then(function (res) {
        if (res.status != 404) {
            $scope.items = res.data;
        } else {
            $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
        }

    }, function err(e) {
        $rootScope.checkError(e, $dialogAlert);
    })
    $scope.deletesourcelibrary = function (id) {
        $dialogConfirm("Bạn chắc chắn muốn xóa tài khoản này khỏi hệ thống?", "Xác nhận", function (res) {
            if (res) {
                $http({
                    method: 'POST',
                    url: host_api + 'api/auth/delete',
                    data: {
                        UserId: id,
                    },
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    if (res.data.result > 0) {
                        $dialogAlert("\n" + res.data.message, "Thông báo!", "success");
                    } else {
                        $dialogAlert("\n" + e.data.message, "Thông báo!", "warning");
                    }
                })
            }

        })

    }

});

