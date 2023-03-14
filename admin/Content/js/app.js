var app = angular.module('ngAdmin', ['ui.router', 'webFlywifi','modalCustom', 'Login', 'ui.bootstrap', 'naif.base64']);
$.fn.datetimepicker.dates['en'] = {
    months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    monthsShort: ["Thg1", "Thg2", "Thg3", "Thg4", "Thg5", "Thg6", "Thg7", "Thg8", "Thg9", "Thg10", "Thg11", "Thg12"],
    days: ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
    daysShort: ["CN", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7"],
    daysMin: ["CN", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7"],
    meridiem: '',
    today: "Hôm nay",
    clear: "Xóa"
};
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app.directive('format', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) {
                return;
            }

            ctrl.$formatters.unshift(function () {
                return $filter('number')(ctrl.$modelValue);
            });

            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[\,\.]/g, ''),
                    b = $filter('number')(plainNumber);

                elem.val(b);

                return plainNumber;
            });
        }
    };
});
app.factory('$dialogConfirm', function ($uibModal) {
    return function (message, title, callback) {
        var modal = $uibModal.open({
            size: 'sm',
            backdrop: 'static',
            template: '<div class="modal-header label-primary">\
                        <h4 class="modal-title" style="color:#fff" ng-bind-html="title"></h4>\
                        </div>\
                        <div class="modal-body" ng-bind-html="message"></div>\
                        <div class="modal-footer">\
                            <button class="btn btn-default" ng-click="modal.dismiss()">Hủy</button>\
                            <button class="btn btn-primary" ng-click="modal.ok()">Đồng ý</button>\
                        </div>',
            controller: function ($scope, $uibModalInstance, $sce) {
                $scope.modal = $uibModalInstance;
                if (angular.isObject(message)) {
                    angular.extend($scope, message);
                } else {
                    $scope.message = $sce.trustAsHtml(message);
                    $scope.title = angular.isUndefined(title) ? 'Mensagem' : $sce.trustAsHtml(title);
                }

                $scope.modal.ok = function () {
                    $uibModalInstance.close(true);
                };
            },
            resolve: {
                data: function () {
                    return callback;
                }
            }
        });
        modal.result.then(function () {
            return callback(true);
        }, function () {
            return callback(false);
        });

    }
});
app.factory('$dialogAlert', function ($uibModal) {
    return function (message, title,type,callback) {

        var modal = $uibModal.open({
            size: 'sm',
            template: '<div class="modal-header label-' + type + '">\
                    <h4 class="modal-title" style="color:#fff" ng-bind-html="title"></h4></div>\
                    <div class="modal-body alert alert-'+type+'" ng-bind-html="message"></div>\
                    <div class="modal-footer">\
                        <button class="btn btn-'+ type +'" ng-click="modal.close()">OK</button>\
                    </div>',
            controller: function ($scope, $uibModalInstance,$sce) {
                $scope.modal = $uibModalInstance;
                if (angular.isObject(message)) {
                    angular.extend($scope, message);
                } else {
                    $scope.message =  $sce.trustAsHtml(message);
                    $scope.title = angular.isUndefined(title) ? 'Mensagem' :  $sce.trustAsHtml(title);
                }
            },
            resolve: {
                data: function () {
                    return callback;
                }
            }
        });
        modal.result.then(function () {
            if(callback === undefined) return true;
            return callback(true)        
        });
    }
})
app.factory('$dialogShowForm', function ($uibModal) {
    var size = 'lg';
    return function (title, btnName, content, callbackFn, size) {
        var modal = $uibModal.open({
            size: size,
            backdrop: 'static',
            template: `<div class="modal-header label-primary" style="position:relative">\
                        <h4 class ="modal-title" style="color:#fff" ng-bind-html="title"></h4>\
                        </div>\
                        <div ng-bind-html="content"></div>
                        <div class ="modal-footer">\
                            <button class="btn btn-primary btnAddKey" ng-click="modal.ok()" >${btnName}</button>\
                            <button class="btn btn-default" ng-click="modal.dismiss()" >Đóng</button>\
                        </div>`,
            controller: function ($scope, $uibModalInstance,$sce) {
                $scope.content = $sce.trustAsHtml(content);
                $scope.modal = $uibModalInstance;
                $scope.title = angular.isUndefined(title) ? 'Mensagem' : $sce.trustAsHtml(title);
                $scope.modal.ok = function () {
                    callbackFn($scope)
                };
            }
        });
        modal.result.then(function (ck) {
            if (ck) {
                return callbackFn(true);
            }         
        }, function (err) {
            return err;
        });
    }
})

app.run(function ($browser, $window, $rootScope, $q, $http, $location, $log, $timeout, $interval, $state) {
    $browser.baseHref = function () { return "/" };
    $rootScope.$state = $state;
    $rootScope.showhide = true;
})

app.directive('ckEditor', function ($window) {
    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0], {
                Toolbar: [{
                    name: 'insert',
                    items: ['Image', 'Table']
                }],
                height: 200,
                extraPlugins: 'print,format,font,colorbutton,justify,uploadimage',
                uploadUrl: window.host+`api/common/ckeditor?token=${$window.localStorage.token}`
            });
            if (!ngModel) return;
            ck.on('pasteState', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            });
            ngModel.$render = function (value) {
                ck.setData(ngModel.$viewValue);
            };
        }
    };
})
app.directive('uiDate', function () {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ngModelCtrl) {
            element.mask("00/00/0000");
            ngModelCtrl.$parsers.unshift(function (value) {
                return element.cleanVal();
            });
            ngModelCtrl.$formatters.unshift(function (value) {
                return element.masked(value);
            });
        }
    };
});
app.filter('safeHtml', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});
app.filter('split', function () {
    return function (input, splitChar, splitIndex) {
        return input.split(splitChar)[splitIndex];
    }
});
app.filter('weekday', function () {
    return function (input, splitChar) {
        if (input === "" || input == null) return;
        var days = { "1": "Chủ nhật", "2": "Thứ 2", "3": "Thứ 3", "4": "Thứ 4", "5": "Thứ 5", "6": "Thứ 6", "7": "Thứ 7" };
        var input = input.substr(1);
        var input2 = input.substr(0,input.length - 1)
        var _txt = input2.split(splitChar);
        var _e = "";
        _txt.forEach(function (val, key, array) {
            _e += days[val] + ((key === array.length - 1) ? " ": ", ");           
        })
        return _e
    }
});
app.filter('monthday', function () {
    return function (input, splitChar) {
        if (input === "" || input == null) return;
        var months = { "1": "Tháng 1", "2": "Tháng 2", "3": "Tháng 3", "4": "Tháng 4", "5": "Tháng 5", "6": "Tháng 6", "7": "Tháng 7", "8": "Tháng 8", "9": "Tháng 9", "10": "Tháng 10", "11": "Tháng 11", "12": "Tháng 12" }
        var input = input.substr(1);
        var input2 = input.substr(0, input.length - 1)
        var _txt = input2.split(splitChar);
        var _e = "";
        _txt.forEach(function (val, key, array) {
            _e += months[val] + ((key === array.length - 1) ? " " : ", ");
        })
        return _e
    }
});
app.filter('day', function () {
    return function (input, splitChar) {
        console.log(input);
        if (input === "" || input == null) return;
        var months = { "1": "Tháng 1", "2": "Tháng 2", "3": "Tháng 3", "4": "Tháng 4", "5": "Tháng 5", "6": "Tháng 6", "7": "Tháng 7", "8": "Tháng 8", "9": "Tháng 9", "10": "Tháng 10", "11": "Tháng 11", "12": "Tháng 12" }
        var input = input.substr(1);
        var input2 = input.substr(0, input.length - 1)
        return input2
    }
});

