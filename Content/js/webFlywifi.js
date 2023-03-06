    var host = window.host;
    var host_api = window.host_api; 
    var timer = 10000;
    

    var app = angular.module('WebStore', ['ui.router', 'ui.bootstrap', 'angular.filter', 'ckeditor']);
    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
        $urlRouterProvider.otherwise('/');
        //$urlMatcherFactoryProvider.caseInsensitive(true);
        //$urlMatcherFactoryProvider.strictMode(false); 
        $stateProvider
            
            .state('17-22-edit-userlog', {
                url: '/nhat-ky-nguoi-su-dung/cap-nhat/:id',
                allowAnonymous: true,
                controller: 'edituserlogCtrl',
                templateUrl: window.templateUrl + "/17-22/edituserlog.html"
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
        //bieu do highchart pie
        $rootScope.loadChartPie = function(datas, idName, title,options) {
            //setTimeout(function () {
            $(document).ready(function () {
                Highcharts.chart(idName, {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'

                    },
                    title: {
                        text: title
                    },

                    accessibility: {
                        point: {
                            valueSuffix: '%'
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            colors: options.colors ,
                            dataLabels: options.dataLabels,
                            showInLegend: options.showlegend
                        }
                    },
                    tooltip: {
                        //pointFormat: "Tổng: {point.y:,.0f}",
                        formatter: function () {
                            //console.log(this)
                            return this.key +
                                '<br/>Tổng:' + formatNumbers(this.y);
                        }
                    },
                    series: [{
                        name: 'Tổng',
                        colorByPoint: true,
                        data: datas
                    }],
                    credits: {
                        enabled: false
                    },
                });
            })
            //},0)
        }
        //bieu do highchart line
        $rootScope.loadChartLine = function (datas, idName, title,options) {
            setTimeout(function () {
                $(document).ready(function () {
                    Highcharts.setOptions({
                        colors: options.colors 
                    });
                    Highcharts.chart(idName, {//'lineChart'
                        chart: {
                            type: 'spline',
                            scrollablePlotArea: {
                                minWidth: 600,
                                scrollPositionX: 1
                            }
                        },
                        title: {
                            text: title///'Thống kê tăng trưởng doanh thu (VNĐ)'
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: options.dataY 
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        plotOptions: {
                            spline: {
                                lineWidth: 2,
                                states: {
                                    hover: {
                                        lineWidth: 3
                                    }
                                },
                                marker: {
                                    enabled: false
                                },

                            }
                        },
                        tooltip: {
                            //pointFormat: "Tổng: {point.y:,.0f}",
                            formatter: function () {
                                //console.log(this)
                                return this.key +
                                    '<br/>Tổng:' + formatNumbers(this.y);
                            }
                        },
                        series: datas,
                        credits: {
                            enabled: false
                        },
                    });
                })
            }, 100)
        }
        $rootScope.checkError = function (data,callback) {
            if (data.data.result == -401) {
                $rootScope.$user = null;
            }
            if (data.data.message) {
                callback("\n" + data.data.message, "Thông báo!", "warning");
            }
        }
    })

    app.controller('sourcelibraryCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        //$scope.data = [];
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
      app.controller('edit_sourcelibraryCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/detail/sourcelibratydetail.json ',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            if (res.status != 404) {
                $scope.sourcelibrarydetail = res.data;
            console.log($scope.sourcelibrarydetail);

            } else {
                $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
            }
            
        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        $scope.editsourcelibrary = function () {
            console.log($scope.sourcelibrarydetail);
            $http({
                method: 'POST',
                url: host_api + 'cap-nhat-thư-vien-nguon',
                data: $scope.sourcelibrarydetail,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                //console.log(res);
                if (res.result > 0) {
                    //console.log(res);
                    $dialogAlert("Cập nhật thư viện nguồn thành côngi", "Thông báo!", "success", function (res) {
                        $state.go("manageDevice");
                    });
    
                } else {
                    $dialogAlert("\n" + res.message, "Thông báo!", "warning");
                }
    
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        };

       
      });
      
      app.controller('managergroupuserCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/managergroupuser.json ',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            if (res.status != 404) {
                $scope.groups = res.data;
            } else {
                $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
            }
            
        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        $scope.deletegroupuser = function (id) {
            $dialogConfirm("Bạn chắc chắn muốn xóa tài khoản này khỏi hệ thống?", "Xác nhận", function (res) {
                if (res) {
                    $http({
                        method: 'POST',
                        url: host_api + 'api/auth/delete',
                        data: {
                            groupid: id,
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
      app.controller('editmanagergroupuserCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        $scope.dataForm = {};
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/detail/managergroupuserdetail.json ',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            if (res.status != 404) {
                $scope.dataForm = res.data;
                console.log(res);
                console.log($scope.dataForm);
            } else {
                $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
            }
            
        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        $scope.editgroupuser = function () {
            console.log($scope.dataForm);
            $http({
                method: 'POST',
                url: host_api + 'cap-nhat',
                data: $scope.dataForm,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                //console.log(res);
                if (res.result > 0) {
                    //console.log(res);
                    $dialogAlert("Cập nhật thư viện nguồn thành côngi", "Thông báo!", "success", function (res) {
                        $state.go("managergroupuserCtrl");
                    });
    
                } else {
                    $dialogAlert("\n" + res.message, "Thông báo!", "warning");
                }
    
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        };
      });

      app.controller('manageruserCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/manageruser.json ',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            if (res.status != 404) {
                $scope.users = res.data;
            } else {
                $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
            }
            
        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
      });
      app.controller('editmanageruserCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        // $scope.dataForm = {};
         $http({
             method: 'GET',
             url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/detail/manageruserdetail.json',
             headers: {
                 'Authorization': "Bearer " + $window.localStorage.token
             }
         }).then(function (res) {
             if (res.status != 404) {
                 $scope.manageruser = res.data;
                 console.log($scope.manageruser);
             } else {
                 $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
             }
             
         }, function err(e) {
             $rootScope.checkError(e, $dialogAlert);
         })
         $scope.edituser = function () {
             console.log($scope.manageruser);
             $http({
                 method: 'POST',
                 url: host_api + 'cap-nhat',
                 data: $scope.manageruser,
                 headers: {
                     'Authorization': "Bearer " + $window.localStorage.token
                 }
             }).then(function (res) {
                 //console.log(res);
                 if (res.result > 0) {
                     //console.log(res);
                     $dialogAlert("Cập nhật thư viện nguồn thành côngi", "Thông báo!", "success", function (res) {
                         $state.go("manageruserCtrl");
                     });
     
                 } else {
                     $dialogAlert("\n" + res.message, "Thông báo!", "warning");
                 }
     
             }, function err(e) {
                 $rootScope.checkError(e, $dialogAlert);
             })
         };
       });



      app.controller('recommendCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/recommend.json ',
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
      });

      app.controller('reportnewsCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/reportnews.json ',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            if (res.status != 404) {
                $scope.data = res.data;
            } else {
                $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
            }
            
        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
    });


    app.controller('reportnewsmediaCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/reportnewsmedia.json ',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            if (res.status != 404) {
                $scope.data = res.data;
            } else {
                $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
            }
            
        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
      });

    app.controller('reportstatisticalCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/reportstatistical.json ',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            if (res.status != 404) {
                $scope.data = res.data;
            } else {
                $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
            }
            
        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
    });

    app.controller('userlogCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/userlog.json ',
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
        $scope.deleteuserlog = function (id) {
            $dialogConfirm("Bạn chắc chắn muốn xóa tài khoản này khỏi hệ thống?", "Xác nhận", function (res) {
                if (res) {
                    $http({
                        method: 'POST',
                        url: host_api + 'api/auth/delete',
                        data: {
                            groupid: id,
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
    app.controller('edituserlogCtrl', function($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
         $http({
             method: 'GET',
             url: 'http://127.0.0.1:5500/admin/Template/17-22/data_json/detail/userlogdetail.json',
             headers: {
                 'Authorization': "Bearer " + $window.localStorage.token
             }
         }).then(function (res) {
             if (res.status != 404) {
                 $scope.dataForm = res.data;
                 console.log($scope.dataForm);
             } else {
                 $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
             }
             
         }, function err(e) {
             $rootScope.checkError(e, $dialogAlert);
         })
         $scope.edituserlog = function () {
             console.log($scope.dataForm);
             $http({
                 method: 'POST',
                 url: host_api + 'cap-nhat',
                 data: $scope.dataForm,
                 headers: {
                     'Authorization': "Bearer " + $window.localStorage.token
                 }
             }).then(function (res) {
                 //console.log(res);
                 if (res.result > 0) {
                     //console.log(res);
                     $dialogAlert("Cập nhật thư viện nguồn thành côngi", "Thông báo!", "success", function (res) {
                         $state.go("manageruserCtrl");
                     });
     
                 } else {
                     $dialogAlert("\n" + res.message, "Thông báo!", "warning");
                 }
     
             }, function err(e) {
                 $rootScope.checkError(e, $dialogAlert);
             })
         };
       });




    //function dashboard seller
    app.controller('sellerCtrl', function ($http, $scope, $state, $rootScope, $dialogShowForm, $dialogAlert, $log, $uibModal, $location, $window) {
        if ($rootScope.$user && $rootScope.$user.Roles.indexOf('seller') < 0) {
            $rootScope.$user = null;
            $rootScope.login_active = true;
            $state.go('account$signout');
            return;
        }

        $rootScope.headTitle = 'Đơn vị bán hàng > Dashboard';
        $scope.textloading = "Đang tải dữ liệu ...";
        $scope.dataOrder = {};
        $scope.page = 0;
        $scope.num = 3;
        $scope.totalRow = 0;
        $scope.maxSize = 3;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
        fndata($http, $scope, 'dashboard')
        function fndata($http, $scope, action) {
            search()
            $scope.search = search;
            // sort
            $scope.sort = {
                column: '',
                descending: false
            };

            $scope.changeSorting = function (column) {

                var sort = $scope.sort;

                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = false;
                }
            };
            // thay đổi class khi sort
            $scope.selectedCls = function (column) {
                return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
            };
            // paging
            // paging
            $scope.pageChanged = function () {
                $scope.page = $scope.bigCurrentPage - 1;
                console.log('Page changed to: ' + $scope.bigCurrentPage);
                search();
            };
            // load data api
            function search() {
                $scope.data = [];
                $scope.priceTotal = [];
                //host_api + 'api/report/seller?action=' + action + '&filter=' + ($scope.filter || '') + '&num=' + $scope.num + '&page=' + ($scope.page || ''),
                $http({
                    method: 'GET',
                    url: 'http://ics.vtctelecom.com.vn/index.php?api=vtc_api&method=listPlayschedule' + '&num=' + $scope.maxSize + '&page=' + $scope.page,
                    //headers: {
                    //    'Authorization': "Bearer " + $window.localStorage.token
                    //}
                }).then(function (res) {
                    console.log(res);
                    if (res.data.data.length > 0) {
                        $scope.data = res.data.data;
                        $scope.bigTotalItems = res.data.totalrow;
                    } else {
                        //$scope.textloading = "Dữ liệu trống.";
                        $scope.textloading = res.data.message;
                        // $dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                    }

                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            }
        }

        //show producer detail
        $scope.productDetail = function (code) {
            $http({
                method: 'GET',
                url: host_api + 'api/report/seller?action=productdetail&productcode=' + code,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                if (res.data.result > 0) {
                    var detailProduct = res.data.data;
                    var modal = $uibModal.open({
                        animation: 1000,
                        backdrop: 'static',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: `<div class="modal-header label-primary" style="position:relative">\
                    <h4 class ="modal-title" style="color:#fff" >${detailProduct.seller.product_name}</h4>\
                    </div>\
                    <div style="" id="print">
                        <table class="table" style="width:100%;margin-bottom:0">
                            <tr><td  style="width:150px;"><strong>Mã sản phẩm: </strong></td><td>${detailProduct.seller.product_code}</td></tr>
                            <tr><td><strong>Giá bán: </strong></td><td>${detailProduct.price_out}</td></tr>
                            <tr><td><strong>Giá mua: </strong></td><td>${detailProduct.price_in}</td></tr>
                            <tr><td><strong>Chiết khấu: </strong></td><td>${detailProduct.description}</td></tr>
                        </table>
                    </div>
                    <div class ="modal-footer">\                           
                        <button class ="btn btn-default" ng-click="cancel()" >Đóng</button>\
                    </div>`,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.cancel = function () {
                                $uibModalInstance.close(false)
                            };
                        },

                        size: 'xs',//size sm,xs,lg   
                        windowClass: 'your-modal-class',

                    });
                } else {
                    $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })


        };
        //show seller detail
        $scope.sellerDetail = function (code) {
            $http({
                method: 'GET',
                url: host_api + 'api/common/get?action=productdetail&productcode=' + code,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                if (res.data.result > 0) {
                    var detailProduct = res.data.data;
                    var modal = $uibModal.open({
                        animation: 1000,
                        backdrop: 'static',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: `<div class="modal-header label-primary" style="position:relative">\
                    <h4 class ="modal-title" style="color:#fff" >${detailProduct.product_name}</h4>\
                    </div>\
                    <div style="" id="print">
                        <table class="table" style="width:100%;margin-bottom:0">
                            <tr><td  style="width:150px;"><strong>Mã sản phẩm: </strong></td><td>${detailProduct.product_code}</td></tr>
                            <tr><td><strong>Giá: </strong></td><td>${detailProduct.price}</td></tr>
                            <tr><td><strong>Mô tả: </strong></td><td>${detailProduct.description}</td></tr>
                        </table>
                    </div>
                    <div class ="modal-footer">\                           
                        <button class ="btn btn-default" ng-click="cancel()"  >Đóng</button>\
                    </div>`,
                        controller: function ($scope, $uibModalInstance) {

                            $scope.cancel = function () {
                                $uibModalInstance.close(false)
                            };
                        },
                        //controllerAs: $scope,
                        size: 'xs',//size sm,xs,lg   
                        windowClass: 'your-modal-class',

                    });
                } else {
                    $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })


        };
        // Chi tiet doanh thu trong tháng
        $scope.dtDetail = function (code, pName,type) {
            var $titlle = 'Doanh thu chi tiết loại bảo hiểm ' + pName;
            switch(type) {
                case 'channel':
                    $titlle = 'Doanh thu chi tiết kênh bán ' + pName;
                    break;
                case 'producer':
                    $titlle = 'Doanh thu chi tiết nhà cung cấp ' + pName;
                    break;
                default:
                    $titlle;
            }
            $("div.overlay").addClass("show");
            $http({
                method: 'GET',
                url: host_api + 'api/report/seller?action=dashboarddetail&code=' + code + '&type='+type+'&num=999&page=0',
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                $("div.overlay").removeClass("show");
                if (res.data.result > 0) {
                    var detailProduct = res.data.data.detail;
                    var modal = $uibModal.open({
                        animation: 0,
                        backdrop: 'static',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: `<div class="modal-header label-primary" style="position:relative">\
                    <h4 class ="modal-title" style="color:#fff" >${$titlle}</h4>\
                    </div>\
                    <div style="max-height:350px;" id="print">
                        <table class="table table-bordered" style="width:100%;margin-bottom:0">
                                <thead>
                                    <tr class="panel-info list-group-item-info">
                                        <th style="text-align:center;width:58px">STT</th>
                                        <th style="width: 196px;">Tên sản phẩm </th>
                                        <th style="width: 132px;">Gói</th>                                            
                                        <th style="width: 132px;">Ngày kích hoạt</th>
                                        <th style="width: 136px;">Ngày hết hạn</th>
                                        <th style="width: 190px;">Doanh thu</th>
                                        <th style="width: 220px;">Lợi nhuận</th>
                                    </tr>
                                </thead>                                   
                        </table>
                        <div style="max-height: 300px;overflow-y: scroll;">
                            <table class="table table-bordered table-striped" style="width:100%;margin-bottom:0">
                                <tbody>   
                                        <tr ng-repeat="item in detailProduct">
                                            <td style="width:50px;text-align:center;">{{$index+1}}</td>
                                            <td style="width:150px">{{item.product.code}}:{{item.product.name}}</td>                                                            
                                            <td style="width:100px">{{item.type}}</td>                      
                                            <td style="width:100px">{{item.subscribe_date.substring(0,10)}}</td>                                
                                            <td style="width:100px">{{item.subscribe_expired}}</td>
                                            <td style="width:150px" class="text-right">{{item.total}}</td>                                
                                            <td style="width:150px" class="text-right">{{item.total_last}}</td>                                
                                                                                
                                        </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class ="modal-footer">\                           
                        <button class ="btn btn-default" ng-click="cancel()" >Đóng</button>\
                    </div>`,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.detailProduct = detailProduct;
                            $scope.cancel = function () {
                                $uibModalInstance.close(false);
                            };
                        },
                        controllerAs: $scope,
                        size: 'lg',//size sm,xs,lg   
                        windowClass: 'your-modal-class',

                    });
                } else {
                    $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
                }
            }, function err(e) {
                $("div.overlay").removeClass("show");
                $rootScope.checkError(e, $dialogAlert);
            });
        };
        $scope.page2 = 0;
        $scope.num2 = 10;
        $scope.totalRow2 = 0;
        $scope.maxSize2 = 10;
        $scope.bigTotalItems2 = 0;
        $scope.bigCurrentPage2 = 1;
        $scope.varTinh = "";
        $scope.filters = {
            status: "'','0'",
            tinh: '',
            huyen: '',
            xa:''
        };
        $(".select2").select2();
        $scope.pageChanged2 = function () {
            $scope.page2 = $scope.bigCurrentPage2 - 1;
            console.log('Page changed to: ' + $scope.bigCurrentPage2);
            loadDataLoa($scope.filters);
        };
        //loadDataLoa($scope.filters);
        $scope.checkLoa = function () {
            var checkboxes = document.getElementsByName('status[]');
            var vals = "";
            for (var i=0, n=checkboxes.length;i<n;i++) 
            {
                if (checkboxes[i].checked) 
                {
                    if (checkboxes[i].value != "") {
                        vals += "," + checkboxes[i].value;
                    }                    
                }
            }
            if (vals) vals = vals.substring(1);
            $scope.filters = {
                status:vals
            };
            loadDataLoa($scope.filters);
        }
        function loadDataLoa() {
            ($scope.filters.status == undefined) ? $scope.filters.status = "" : $scope.filters.status;
            ($scope.filters.tinh == undefined) ? $scope.filters.tinh = "" : $scope.filters.tinh;
            ($scope.filters.huyen == undefined) ? $scope.filters.huyen = "" : $scope.filters.huyen;
            ($scope.filters.xa == undefined) ? $scope.filters.xa = "" : $scope.filters.xa;
            $scope.data_loa = [];
            $http({
                method: 'GET',
                url: 'http://ics.vtctelecom.com.vn/index.php?api=vtc_api&method=listIppbxextenLocation&tinh=' + $scope.filters.tinh + '&huyen=' + $scope.filters.huyen + '&xa=' + $scope.filters.xa + '&num=' + $scope.maxSize2 + '&page=' + $scope.page2 + "&status=" + $scope.filters.status,
                //headers: {
                //    'Authorization': "Bearer " + $window.localStorage.token
                //}
            }).then(function (res) {
                console.log(res);
                if (res.data.data.length > 0) {
                    $scope.data_loa = res.data.data;
                    $scope.bigTotalItems2 = res.data.totalrow;
                } else {
                    $scope.textloading = "Dữ liệu trống.";
                    //$scope.textloading = res.data.message;
                    // $dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })

        }
        $scope.$watch("filters", function (newVal, oldVal) {
            console.log(newVal, oldVal);
            //$scope.filters.tinh = $scope.varTinh;
            loadDataLoa(newVal);
        }, true);

        $http({
            method: 'GET',
            url: 'http://ics.vtctelecom.com.vn/index.php?api=vtc_api&method=countStatusLoa',
            //headers: {
            //    'Authorization': "Bearer " + $window.localStorage.token
            //}
        }).then(function (res) {
            console.log(res);
            var _online = 0;
            res.data.forEach(function (val) {
                if (val.status === "" || val.status === "0") {
                    _online += parseInt(val.total);
                    $scope.sttOnline = _online;
                }

            })
            $scope.dataTotalStatus = res.data;


        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        });
        $http({
            method: 'GET',
            url: 'http://ics.vtctelecom.com.vn/index.php?api=vtc_api&method=getProvinces',
            //headers: {
            //    'Authorization': "Bearer " + $window.localStorage.token
            //}
        }).then(function (res) {
            $scope.dataProvinces = res.data;
        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        $scope.loadHuyens = function () {
            $http({
                method: 'GET',
                url: 'http://ics.vtctelecom.com.vn/index.php?api=vtc_api&method=getDistricts&proId=' + $scope.filters.tinh,
            }).then(function (res) {
                $scope.dataDistricts = res.data;
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }
        $scope.loadXas = function () {
            $http({
                method: 'GET',
                url: 'http://ics.vtctelecom.com.vn/index.php?api=vtc_api&method=getWards&ditId=' + $scope.filters.huyen,
            }).then(function (res) {
                $scope.dataWards = res.data;
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }
    });
    // function seller quản lý sản phẩm seller
    app.controller('selList$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert,$dialogShowForm,$uibModalStack,$timeout, $stateParams, $window) {
    
        loadDatachannel();
        function loadDatachannel(){
            $http({
                method: 'GET',
                url: host_api + 'api/channel/get?action=list',
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                //console.log(res);
                if(res.data.result > 0){
                    $scope.dataListChannel = res.data.data;                   
                }else{
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
            $http({
                method: 'GET',
                url: host_api + 'api/channel/get?action=producer',
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                //console.log(res);
                if(res.data.result > 0){
                    $scope.dataListProducer = res.data.data;                   
                }else{
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }
        $rootScope.headTitle = 'Đơn vị bán hàng > Quản lý sản phẩm';
        $scope.textloading = "Đang tải dữ liệu ...";
        $scope.page = 0;
        $scope.totalRow = 0;
        $scope.maxSize = 10;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        $scope.flag = false;
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
        

        fndata($http, $scope, 'product')
        function fndata($http, $scope, action) {
            search()
            $scope.search = search;
            // sort
            $scope.sort = {
                column: '',
                descending: false
            };

            $scope.changeSorting = function (column) {

                var sort = $scope.sort;

                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = false;
                }
            };
            // thay đổi class khi sort
            $scope.selectedCls = function (column) {
                return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
            };
            
   
            // search theo date, search theo productName or productCode
            $scope.searchFilter = function () {
                $scope.page = 0;
                search();
            }
            // paging
            $scope.pageChanged = function () {
                $scope.page = $scope.bigCurrentPage - 1;
                console.log('Page changed to: ' + $scope.bigCurrentPage);
                search();
            };
            // load data api
            function search() {
                $scope.data = [];
                $scope.totalRow = 0;
                $http({
                    method: 'GET',
                    url: host_api + 'api/report/seller?action=' + action + '&filter=' + ($scope.filter || '') + '&producer=' + ($scope.filter_producer || '') + '&channel=' + ($scope.filter_channel || '')  + '&num=' + $scope.maxSize + '&page=' + ($scope.page || ''),
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    //console.log(res)                  
                    if (res.data.result > 0) {
                        $scope.data = res.data.data.detail;
                        $scope.totalRow = res.data.data.total_row;
                        $scope.bigTotalItems = res.data.data.total_row;
                        $(document).ready(function(){
                            $('.btnProductToggle').bootstrapToggle({
                                on: 'Kích hoạt',
                                off: 'Ngừng kích hoạt',
                                size:"mini",
                                style:"btnToggleCustom"
                            });
                        })
                    } else {
                        //$scope.textloading = "Dữ liệu trống.";
                        $scope.textloading = res.data.message;
                        //$dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                    }
                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            }
        }
            
    })
    // function seller quản lý thống kê doanh thu seller
    app.controller('selStatistic$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        if ($rootScope.$user && $rootScope.$user.Roles.indexOf('seller') < 0) {
            $rootScope.$user = null;
            $rootScope.login_active = true;
            $state.go('account$signout');
            return;
        }
        $rootScope.headTitle = "Đơn vị bán hàng > Thống kê doanh thu";
        $scope.textloading = "Đang tải dữ liệu ...";
        $(document).ready(function () {
            setTimeout(function () {
                $(".dateTimePicker").datetimepicker({
                    isRTL: false,
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    language: 'en',
                    minView: 2, //tat thoi gian
                    pickTime: false, //tat thoi gian
                    todayBtn: true,
                });
            }, 500);
        });

        var _timeTodate = function () {
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = day < 10 ? "0" + day : day;


            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        var _timeFromdate = function () {
            //var date = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));// lùi 30 ngày
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = '01';///day < 10 ? "0" + day : day;


            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        $scope.from_date = _timeFromdate();
        $scope.to_date = _timeTodate();
        $scope.page = 0;
        $scope.maxSize = 10;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
        fndata($http, $scope, 'statistic')
        function fndata($http, $scope, action) {
            search();
            $scope.search = search;
            // sort
            $scope.sort = {
                column: '',
                descending: false
            };

            $scope.changeSorting = function (column) {

                var sort = $scope.sort;

                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = false;
                }
            };
            // thay đổi class khi sort
            $scope.selectedCls = function (column) {
                return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
            };

            // search theo date, search theo productName or productCode
            $scope.searchFilter = function () {
                $scope.page = 0;
                search();
            }
            // paging
            $scope.pageChanged = function () {
                console.log('Page changed to: ' + $scope.bigCurrentPage);
                $scope.page = $scope.bigCurrentPage - 1;
                search();
            };
            // load data api
            function search() {
                $scope.data = [];
                $scope.totalRow = 0;
                $http({
                    method: 'GET',
                    url: host_api + 'api/report/seller?action=statistic&filter=' + ($scope.filter || '') + '&num=' + $scope.maxSize + '&page=' + ($scope.page || '') + '&from_date=' + $scope.from_date + '&to_date=' + $scope.to_date,
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    if (res.data.result > 0) {
                        $scope.data = res.data.data.detail;
                        $scope.totalRow = res.data.data.total_row;
                        $scope.bigTotalItems = res.data.data.total_row;
                    } else {
                        $scope.textloading = "Dữ liệu trống.";
                    }
                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);

                })
            }
            
        }
        const width = 320; // We will scale the photo width to this
        let height = 0; // This will be computed based on the input stream

        // |streaming| indicates whether or not we're currently streaming
        // video from the camera. Obviously, we start at false.

       

        // The various HTML elements we need to configure or control. These
        // will be set by the startup() function.

       
       
        // Capture a photo by fetching the current contents of the video
        // and drawing it into a canvas, then converting that to a PNG
        // format data URL. By drawing it on an offscreen canvas and then
        // drawing that to the screen, we can change its size and/or apply
        // other changes before drawing it.
        // vars
      
        
        //show seller detail
        $scope.productDetail = function (code) {
            $http({
                method: 'GET',
                url: host_api + 'api/common/get?action=productdetail&productcode=' + code,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                if (res.data.result > 0) {
                    var detailProduct = res.data.data;
                    var modal = $uibModal.open({
                        animation: 1000,
                        backdrop: 'static',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: `<div class="modal-header label-primary" style="position:relative">\
                    <h4 class ="modal-title" style="color:#fff" >${detailProduct.product_name}</h4>\
                    </div>\
                    <div style="" id="print">
                        <table class="table" style="width:100%;margin-bottom:0">
                            <tr><td  style="width:150px;"><strong>Mã sản phẩm: </strong></td><td>${detailProduct.product_code}</td></tr>
                            <tr><td><strong>Gói: </strong></td><td>${detailProduct.product_type}</td></tr>
                            <tr><td><strong>Giá mua: </strong></td><td>${detailProduct.price}</td></tr>
                            <tr><td><strong>Giá bán: </strong></td><td>${detailProduct.price_out}</td></tr>
                            <tr><td><strong>Mô tả: </strong></td><td>${detailProduct.description}</td></tr>
                        </table>
                    </div>
                    <div class ="modal-footer">\                           
                        <button class ="btn btn-default" ng-click="cancel()"  >Đóng</button>\
                    </div>`,
                        controller: function ($scope, $uibModalInstance) {

                            $scope.cancel = function () {
                                $uibModalInstance.close(false)
                            };
                        },
                        //controllerAs: $scope,
                        size: 'xs',//size sm,xs,lg   
                        windowClass: 'your-modal-class',

                    });
                } else {
                    $dialogAlert("\n Không tìm thấy thông tin", "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })


        };
       
        $(document).ready(function () {
            let streaming = false;
            let video = null;
            let canvas = null;
            let photo = null;
            let startbutton = null;
            // vars
            let result = document.querySelector('.result'),
            img_result = document.querySelector('.img-result'),
            img_w = document.querySelector('.img-w'),
            img_h = document.querySelector('.img-h'),
            options = document.querySelector('.options'),
            save = document.querySelector('.save'),
            cropped = document.querySelector('.cropped'),
            dwn = document.querySelector('.download'),
            upload = document.querySelector('#file-input'),
            cropper = '';

            // on change show image with crop options
            upload.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    // start file reader
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (e.target.result) {
                            // create new image
                            let img = document.createElement('img');
                            img.id = 'image';
                            img.src = e.target.result
                            // clean result before
                            result.innerHTML = '';
                            // append new image
                            result.appendChild(img);
                            // show save btn and options
                            save.classList.remove('hide');
                            options.classList.remove('hide');
                            // init cropper
                            cropper = new Cropper(img);
                        }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });

            // save on click
            save.addEventListener('click', (e) => {
                e.preventDefault();
                // get result to data uri
                let imgSrc = cropper.getCroppedCanvas({
                    width: img_w.value // input value
                }).toDataURL();
                // remove hide class of img
                cropped.classList.remove('hide');
                img_result.classList.remove('hide');
                // show image cropped
                cropped.src = imgSrc;
                dwn.classList.remove('hide');
                dwn.download = 'imagename.png';
                dwn.setAttribute('href', imgSrc);
            });

            $scope.checkCamera = function () {
                video = document.getElementById("video");
                canvas = document.getElementById("canvas");
                photo = document.getElementById("photo");
                startbutton = document.getElementById("startbutton");

                navigator.mediaDevices
                  .getUserMedia({ video: true, audio: true })
                  .then((stream) => {
                      video.srcObject = stream;
                      video.play();
                  })
                  .catch((err) => {
                      console.error(`An error occurred: ${err}`);
                  });

                video.addEventListener(
                  "canplay",
                  (ev) => {
                      if (!streaming) {
                          height = video.videoHeight / (video.videoWidth / width);

                          // Firefox currently has a bug where the height can't be read from
                          // the video, so we will make assumptions if this happens.

                          if (isNaN(height)) {
                              height = width / (4 / 3);
                          }

                          video.setAttribute("width", width);
                          video.setAttribute("height", height);
                          canvas.setAttribute("width", width);
                          canvas.setAttribute("height", height);
                          streaming = true;
                      }
                  },
                  false
                );

                startbutton.addEventListener(
                  "click",
                  (ev) => {
                      takepicture();
                      ev.preventDefault();
                  },
                  false
                );

                clearphoto();
            }
            function clearphoto() {
                const context = canvas.getContext("2d");
                context.fillStyle = "#AAA";
                context.fillRect(0, 0, canvas.width, canvas.height);

                const data = canvas.toDataURL("image/png");
                photo.setAttribute("src", data);
            }

            function takepicture() {
                const context = canvas.getContext("2d");
                if (width && height) {
                    canvas.width = width;
                    canvas.height = height;
                    context.drawImage(video, 0, 0, width, height);

                    const data = canvas.toDataURL("image/png");
                    photo.setAttribute("src", data);
                    // create new image

                    let img = document.createElement('img');
                    img.id = 'image';
                    img.src = data;
                    // clean result before
                    result.innerHTML = '';
                    // append new image
                    result.appendChild(img);
                    // show save btn and options
                    save.classList.remove('hide');
                    options.classList.remove('hide');
                    // init cropper
                    cropper = new Cropper(img);
                } else {
                    clearphoto();
                }

            }
        })
        
        //$scope.dataHc = groupBy($scope.dataHc, pet => pet.producer.product_code);
        function groupBy(list, keyGetter) {
            const map = new Map();
            list.forEach((item) => {
                const key = keyGetter(item);
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            });
            return map;
        }
    })
    
// function them moi tai khoan
    app.controller('add$account$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        //default states
        $scope.selectRoles = [];
        $scope.selectedList = {};
        $scope.dataForm = {};
        $(document).ready(function () {
            $('#enableForm')
                .bootstrapValidator({
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        password: {
                            enabled: false,
                            validators: {
                                notEmpty: {
                                    message: 'Mật khẩu không được để trống'
                                }        
                            }
                        },
                        confirm_password: {
                            enabled: false,
                            validators: {
                                notEmpty: {
                                    message: 'Mật khẩu không được để trống'
                                },
                                identical: {
                                    field: 'password',
                                    message: 'Xác nhận mật khẩu không chính xác'
                                }
                            }
                        },
                        'rolle[]': {
                            validators: {
                                notEmpty: {
                                    message: 'Vui lòng chọn ít nhất một vai trò'
                                }
                            }
                        }
                    }
                })
                // Enable the password/confirm password validators if the password is not empty
                .on('keyup', '[name="password"]', function () {
                    var isEmpty = $(this).val() === '';
                    $('#enableForm')
                        .bootstrapValidator('enableFieldValidators', 'password', !isEmpty)
                        .bootstrapValidator('enableFieldValidators', 'confirm_password', !isEmpty);

                    // Revalidate the field when user start typing in the password field
                    if ($(this).val().length === 1) {
                        $('#enableForm').bootstrapValidator('validateField', 'password')
                            .bootstrapValidator('validateField', 'confirm_password');
                    }
                })
                .on('success.field.bv', function (e, data) {
                    var $parent = data.element.parents('.form-group');
                    // Hide the success icon
                    $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
                })
                .on('error.field.bv', function (e, data) {
                    // Hide the success icon
                    var $parent = data.element.parents('.form-group');
                    $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
                })
                .on('success.form.bv', function (e) {
                    // Prevent form submission
                    e.preventDefault();
                    $scope.submit();
                });
        });
        //api get list roles
        $http({
            method: 'GET',
            url: host_api + 'api/auth/get?action=roles',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            // console.log(res);
            if (res.data.result > 0) {
                $scope.selectRoles = res.data.data;
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })

        /**
            * Action
            */
        $scope.submit = function () {
            var _rolle = []
            angular.forEach($scope.selectedList, function (selected, day) {
                if (selected) {
                    //console.log(day);
                    var role = parseInt(day);
                    _rolle.push(role);
                }
            });
            $scope.dataForm.Roles = _rolle;
            console.log($scope.dataForm);
            setTimeout(function () {
                if (_rolle.length <= 0) {
                    return false;
                }
                //api get list roles
                $http({
                    method: 'POST',
                    url: host_api + 'api/auth/create',
                    data: $scope.dataForm,
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    // console.log(res);
                    if (res.data.result > 0) {
                        //console.log(res);
                        $dialogAlert("Thêm tài khoản thành công", "Thông báo!", "success", function (res) {
                            $state.go("list$account");
                        });
                        
                    } else {
                        $dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                    }

                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            },1000)
            
        };
    });
    // function danh sach tai khoan
    app.controller('list$account$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        //
        $scope.filter = "";
        $scope.textloading = "Đang tải dữ liệu";
        $scope.showRow = false;
        
        //api get list account

        $scope.search = function () {
            search();
        }
        search();
        function search() {
            $http({
                method: 'GET',
                url: host_api + 'api/auth/get?action=userlist&filter=' + $scope.filter,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                // console.log(res);
                if (res.data.result > 0) {
                    $scope.listAccounts = res.data.data.detail;
                    $scope.showRow = true;
                } else {
                    $scope.listAccounts = [];
                    $scope.showRow = false;
                    $scope.textloading = res.data.message;
                }

            }, function err(e) {
                console.log(e);
                $scope.showRow = false;
                $scope.textloading = e.data.message;
                $rootScope.checkError(e, $dialogAlert);
            })
        }

        $scope.detailUser = function (id,refid) {
            //api get detail user follow id,refid
            $http({
                method: 'GET',
                url: host_api + 'api/auth/get?action=userbyid&userid=' + id + '&refid='+refid,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                console.log(res);
                if (res.data.result > 0) {
                    //$scope.selectRoles = res.data.data;
                    var dataInfo = res.data.data;
                    var modal = $uibModal.open({
                        animation: 1000,
                        backdrop: 'static',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: `<div class="modal-header label-primary" style="position:relative">\
                    <h4 class="modal-title" style="color:#fff" >Thông tin tài khoản </h4>\
                    </div>\
                    <div style="max-height:500px;overflow-y:scroll" id="print">
                        <table class="table table-bordered" style="width:100%;">                               
                            <tr><td style="width:200px">Họ tên</td><td>{{dataInfoUser.fullname}}</td></tr>
                            <tr><td>Tài khoản đăng nhập</td><td>{{dataInfoUser.username}}</td></tr>
                            <tr><td>Số điện thoại</td><td>{{dataInfoUser.phone}}</td></tr>
                            <tr><td>Quyền quản lý</td><td><span ng-repeat="item in dataInfoUser.roles">{{item.name}}, </span></td></tr>
                        </table>
                    </div>
                    <div class ="modal-footer">\
                        <button class ="btn btn-default" ng-click="cancel()" data-dismiss="modal" >Đóng</button>\
                    </div>`,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.cancel = function () {
                                $uibModalInstance.close(false);
                            };
                            $scope.dataInfoUser = dataInfo;
                        },
                        controllerAs: $scope,
                        size: 'xs',//size,   
                        windowClass: 'your-modal-class',

                    });
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }

        $scope.deleteUser = function (id, refid) {
            //id, refid
            $dialogConfirm("Bạn chắc chắn muốn xóa tài khoản này khỏi hệ thống?", "Xác nhận", function (res) {
                if (res) {
                    $http({
                        method: 'POST',
                        url: host_api + 'api/auth/delete',
                        data: {
                            UserId: id,
                            RefId: refid
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
    // function chinh sua tai khoan
    app.controller('edit$account$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        //default states
        $scope.uid = $stateParams.id;
        $scope.refid = $stateParams.refid;
        $scope.selectRoles = [];
        $scope.selectedList = [];
        $scope.dataForm = {};
        $(document).ready(function () {
            $('#enableForm')
                .bootstrapValidator({
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        password: {
                            enabled: false,
                            validators: {
                                notEmpty: {
                                    message: 'Mật khẩu không được để trống'
                                }
                            }
                        },
                        confirm_password: {
                            enabled: false,
                            validators: {
                                notEmpty: {
                                    message: 'Mật khẩu không được để trống'
                                },
                                identical: {
                                    field: 'password',
                                    message: 'Xác nhận mật khẩu không chính xác'
                                }
                            }
                        },
                        'rolle[]': {
                            validators: {
                                notEmpty: {
                                    message: 'Vui lòng chọn ít nhất một vai trò'
                                }
                            }
                        }
                    }
                })
                // Enable the password/confirm password validators if the password is not empty
                .on('keyup', '[name="password"]', function () {
                    var isEmpty = $(this).val() === '';
                    $('#enableForm')
                        .bootstrapValidator('enableFieldValidators', 'password', !isEmpty)
                        .bootstrapValidator('enableFieldValidators', 'confirm_password', !isEmpty);

                    // Revalidate the field when user start typing in the password field
                    if ($(this).val().length === 1) {
                        $('#enableForm').bootstrapValidator('validateField', 'password')
                            .bootstrapValidator('validateField', 'confirm_password');
                    }
                })
                .on('success.field.bv', function (e, data) {
                    var $parent = data.element.parents('.form-group');
                    // Hide the success icon
                    $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
                })
                .on('error.field.bv', function (e, data) {
                    // Hide the success icon
                    var $parent = data.element.parents('.form-group');
                    $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
                })
                .on('success.form.bv', function (e) {
                    // Prevent form submission
                    e.preventDefault();
                    $scope.submit();
                });
        });
        //api get list roles
        $http({
            method: 'GET',
            url: host_api + 'api/auth/get?action=roles',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            // console.log(res);
            if (res.data.result > 0) {
                $scope.selectRoles = res.data.data;
                //api get detail user follow id,refid
                $http({
                    method: 'GET',
                    url: host_api + 'api/auth/get?action=userbyid&userid=' + $scope.uid + '&refid=' + $scope.refid,
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    // console.log(res);
                    if (res.data.result > 0) {
                        var _data = res.data.data;
                        $scope.accountName = _data.username;
                        $scope.dataForm = {
                            FullName: _data.fullname,
                            Phone: _data.phone,
                            Sex: _data.sex.toString(),
                            Email: _data.email,
                            RefId: $scope.refid,
                            UserId: $scope.uid 
                        }
                        console.log($scope.dataForm);
                        angular.forEach(_data.roles, function (val) {
                            angular.forEach($scope.selectRoles, function (item) {
                                if (val.code === item.code) {
                                    $scope.selectedList[item.code] = true;
                                }
                            });

                        });

                    }
                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        
        /**
            * Action
            */
        $scope.submit = function () {
            var _rolle = []
            angular.forEach($scope.selectedList, function (selected, day) {
                if (selected) {
                    //console.log(day);
                    var role = parseInt(day);
                    _rolle.push(role);
                }
            });
            $scope.dataForm.Roles = _rolle;
            console.log($scope.dataForm);
            setTimeout(function () {
                if (_rolle.length <= 0) {
                    return false;
                }
                //api get list roles
                // return;
                $http({
                    method: 'POST',
                    url: host_api + 'api/auth/update',
                    data: $scope.dataForm,
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    // console.log(res);
                    if (res.data.result > 0) {
                        //console.log(res);
                        $dialogAlert("Cập nhật tài khoản thành công", "Thông báo!", "success", function (res) {
                            $state.go("list$account");
                        });

                    } else {
                        $dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                    }

                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            }, 1000)

        };
    });
    // function doi mat khau
    app.controller('change$password$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        $scope.dataForm = {};
        $(document).ready(function () {
            $('#enableForm')
                .bootstrapValidator({
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        Password: {
                            enabled: false,
                            validators: {
                                notEmpty: {
                                    message: 'Mật khẩu không được để trống'
                                }
                            }
                        },
                        RePassword: {
                            enabled: false,
                            validators: {
                                notEmpty: {
                                    message: 'Mật khẩu không được để trống'
                                },
                                identical: {
                                    field: 'Password',
                                    message: 'Xác nhận mật khẩu không chính xác'
                                }
                            }
                        }
                    }
                })
                // Enable the password/confirm password validators if the password is not empty
                .on('keyup', '[name="Password"]', function () {
                    var isEmpty = $(this).val() === '';
                    $('#enableForm')
                        .bootstrapValidator('enableFieldValidators', 'Password', !isEmpty)
                        .bootstrapValidator('enableFieldValidators', 'RePassword', !isEmpty);

                    // Revalidate the field when user start typing in the password field
                    if ($(this).val().length === 1) {
                        $('#enableForm').bootstrapValidator('validateField', 'Password')
                            .bootstrapValidator('validateField', 'RePassword');
                    }
                })
                .on('success.field.bv', function (e, data) {
                    var $parent = data.element.parents('.form-group');
                    // Hide the success icon
                    $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
                })
                .on('error.field.bv', function (e, data) {
                    // Hide the success icon
                    var $parent = data.element.parents('.form-group');
                    $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
                })
                .on('success.form.bv', function (e) {
                    // Prevent form submission
                    e.preventDefault();
                    $scope.submit();
                });
        });
        /**
            * Action
            */
        $scope.submit = function () {            
            //console.log($scope.dataForm);
            setTimeout(function () {
                // return;
                $http({
                    method: 'POST',
                    url: host_api + 'api/auth/reset',
                    data: $scope.dataForm,
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    // console.log(res);
                    if (res.data.result > 0) {
                        //console.log(res);
                        $dialogAlert("Cập nhật mật khẩu thành công", "Thông báo!", "success", function (res) {
                            $state.go("list$account");
                        });

                    } else {
                        $dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                    }

                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            }, 1000)

        };
    });
// function quan ly don hang microsoft
    app.controller('pmcs$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {      
        if ($rootScope.$user && $rootScope.$user.Roles.indexOf('info') < 0) {
            $rootScope.$user = null;
            $rootScope.login_active = true;
            $state.go('account$signout');
            return;
        }
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
        $rootScope.headTitle = 'Quản lý đơn hàng  > Microsoft';
        $scope.textloading = "Đang tải dữ liệu ...";
        $scope.page = 0;
        $scope.num = 10;
        $scope.totalRow = 0;
        $scope.status = "-1";
        $(document).ready(function () {
            setTimeout(function () {
                $(".dateTimePicker").datetimepicker({
                    isRTL: false,
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    language: 'en',
                    minView: 2, //tat thoi gian
                    pickTime: false, //tat thoi gian
                    todayBtn: true,
                });
            }, 500);
        });

        var _timeTodate = function () {
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
            day = day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        var _timeFromdate = function () {
            //var date = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));/ / lùi 30 ngày
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
            day = '01';///day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        $scope.from_date = _timeFromdate();
        $scope.to_date = _timeTodate();
        // xac nhan don hang da khoi tao thong tin cho khach hang thanh cong
        $scope.fnconfirm = function (subid) {
            $dialogConfirm(`<p style="font-size:14px">Xác nhận đã khởi tạo thông tin cho khách hàng thành công?</p>
            <input class ="form-control" ng-model="bankingRef" name="bankingRef" placeholder="Nhập ghi chú xác nhận thông tin" required>
            </div>`, "Xác nhận", function (res) {
                if (res) {
                    var _note = $("input[name='bankingRef']").val();
                    if ($.trim(_note) === "") {
                        $dialogAlert("Ghi chú không được bỏ trống, vui lòng thực hiện lại!", "Thông báo", "warning", function (res) {
                            $scope.fnconfirm(subid);
                        });
                        return;
                    }
                    $http({
                        method: 'GET',
                        url: window.host_api + 'api/common/get?action=kesconfirm&subsId=' + subid + '&note=' + _note,
                        headers: {
                            'Authorization': "Bearer " + $window.localStorage.token
                        }
                    }).then(function (response) {
                        //console.log(response);
                        if (response.data.result > 0) {
                            $dialogAlert("Xác nhận thành công!", "Thông báo!", "success", function () {
                                window.location.reload();
                            });
                        } else {
                            $scope.textloading = response.data.message;
                            //$dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                        }

                    }, function (res) {
                        console.log(res);
                        $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
                    });
                }
            })
        }
        //show order detail
        $scope.invoiceDetail = function (dataInvoice) {
            $http({
                method: 'GET',
                url: window.host_api + 'api/common/get?action=kesdetail&subsInfoId=' + dataInvoice+'&type=ms',
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (response) {
                // console.log(response.data.data);
                if (response.data.result > 0) {
                    var dataInvoice = response.data.data;
                    var modal = $uibModal.open({
                        animation: 1000,
                        backdrop: 'static',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: `<div class="modal-header label-primary" style="position:relative">\
                    <h4 class ="modal-title" style="color:#fff" >Thông tin chi tiết đơn hàng </h4>\
                    </div>\
                    <div style="max-height:500px;overflow-y:scroll" id="print">
                        <h2 class="live-print" style="display:none">Thông tin đơn hàng </h2>
                        <table class="table table-bordered" style="width:100%;">
                            <tr class="panel-info list-group-item-info"><td colspan="2"><strong>Thông tin mua hàng</strong></td></tr>
                            <tr><td style="width:200px">Họ tên</td><td>${dataInvoice.order.fullname}</td></tr>
                            <tr><td>Email</td><td>${dataInvoice.order.email}</td></tr>
                            <tr><td>Số điện thoại</td><td>${dataInvoice.order.phone}</td></tr>
                            <tr><td>Sản phẩm</td><td>${dataInvoice.order.product_name}</td></tr>
                            <tr><td>Ngày mua</td><td>${dataInvoice.order.created_date}</td></tr>
                            <tr><td>Số lượng</td><td>${dataInvoice.order.qty_user} (user)</td></tr>
                            <tr><td>Tài khoản</td><td>${dataInvoice.order.account}</td></tr>
                            <tr class="panel-info list-group-item-info"><td colspan="2"><strong>Thông tin người quản lý tài khoản</strong></td></tr>
                            <tr><td>FirstName</td><td>${dataInvoice.manager.firstname}</td></tr>
                            <tr><td>LastName</td><td>${dataInvoice.manager.lastname}</td></tr>
                            <tr><td>Phone</td><td>${(dataInvoice.manager.phone)}</td></tr>
                            <tr><td>Email</td><td>${(dataInvoice.manager.email)}</td></tr>
                            <tr><td>Address</td><td>${(dataInvoice.manager.address)}</td></tr>
                            <tr><td>City</td><td>${(dataInvoice.manager.city)}</td></tr>
                            <tr><td>Country</td><td>${(dataInvoice.manager.country)}</td></tr>
                            <tr><td>ZipCode</td><td>${(dataInvoice.manager.zipcode)}</td></tr>
                            <tr class="panel-info list-group-item-info"><td colspan="2"><strong>Thông tin công ty</strong></td></tr>
                            <tr><td>Tên công ty</td><td>${dataInvoice.comp.name}</td></tr>
                            <tr><td>SĐT</td><td>${dataInvoice.comp.phone}</td></tr>
                            <tr><td>Địa chỉ</td><td>${dataInvoice.comp.address}</td></tr>
                            <tr><td>Mã số thuế</td><td>${dataInvoice.comp.taxcode}</td></tr>
                            <tr><td>Người đại diện</td><td>${dataInvoice.comp.represent ? dataInvoice.comp.represent.name : ""}</td></tr>
                            <tr><td>SĐT người đại diện</td><td>${dataInvoice.comp.represent ? dataInvoice.comp.represent.phone : ""}</td></tr>  
                        </table>
                    </div>
                    <div class ="modal-footer">\
                        <button class ="btn btn-default" ng-click="cancel()" data-dismiss="modal" >Đóng</button>\
                    </div>`,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.cancel = function () {
                                $uibModalInstance.close(false);
                            };
                        },
                        controllerAs: $scope,
                        size: 'xs',//size,   
                        windowClass: 'your-modal-class',

                    });

                } else {
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }

            }, function (res) {
                console.log(res);
                $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
            });
            
        };

        // paging
        $scope.prev = function () {
            $scope.page--;
            if ($scope.page < 0) {
                $scope.page = 0;
                search();
                return;
            }
            search();
        }
        $scope.next = function () {
            if ((($scope.page + 1) * $scope.num) > $scope.totalRow) return;
            $scope.page++;
            search();
        }
        // search theo date, search theo productName or productCode
        $scope.searchFilter = function () {
            $scope.page = 0;
            search();
        }
        // list order kes
        search();
        function search() {
            $scope.data = [];
            $scope.totalRow = 0;
            $http({
                method: 'GET',
                url: window.host_api + 'api/common/get?action=productkes&filter=' + ($scope.filter || '') + '&num=' + $scope.num + '&page=' + ($scope.page || '') + '&from_date=' + $scope.from_date + '&to_date=' + $scope.to_date + '&status=' + $scope.status + "&type=ms",
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                //console.log(res)                  
                if (res.data.result > 0) { 
                    $scope.data = res.data.data.detail;
                    $scope.totalRow = res.data.data.total_row;   
                } else {
                    //$scope.textloading = "Dữ liệu trống.";
                    $scope.textloading = res.data.message;
                    //$dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                }
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }
    });
    // function quan ly don hang kaspersky endpoint security
    app.controller('pkes$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        if ($rootScope.$user && $rootScope.$user.Roles.indexOf('info') < 0) {
            $rootScope.$user = null;
            $rootScope.login_active = true;
            $state.go('account$signout');
            return;
        }
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
        $rootScope.headTitle = 'Quản lý đơn hàng  > Kaspersky endpoint security';
        $scope.textloading = "Đang tải dữ liệu ...";
        $scope.page = 0;
        $scope.num = 10;
        $scope.totalRow = 0;
        $scope.status = "-1";
        $(document).ready(function () {
            setTimeout(function () {
                $(".dateTimePicker").datetimepicker({
                    isRTL: false,
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    language: 'en',
                    minView: 2, //tat thoi gian
                    pickTime: false, //tat thoi gian
                    todayBtn: true,
                });
            }, 500);
        });

        var _timeTodate = function () {
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        var _timeFromdate = function () {
            //var date = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));/ / lùi 30 ngày
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = '01';///day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        $scope.from_date = _timeFromdate();
        $scope.to_date = _timeTodate();
        // xac nhan don hang da khoi tao thong tin cho khach hang thanh cong
        $scope.fnconfirm = function (subid) {
            $dialogConfirm(`<p style="font-size:14px">Xác nhận đã khởi tạo thông tin cho khách hàng thành công?</p>
            <input class ="form-control" ng-model="bankingRef" name="bankingRef" placeholder="Nhập ghi chú xác nhận thông tin" required>
            </div>`, "Xác nhận", function (res) {
                if (res) {
                    var _note = $("input[name='bankingRef']").val();
                    if ($.trim(_note) === "") {
                        $dialogAlert("Ghi chú không được bỏ trống, vui lòng thực hiện lại!", "Thông báo", "warning", function (res) {
                            $scope.fnconfirm(subid);
                        });
                        return;
                    }
                    $http({
                        method: 'GET',
                        url: window.host_api + 'api/common/get?action=kesconfirm&subsId=' + subid + '&note=' + _note,
                        headers: {
                            'Authorization': "Bearer " + $window.localStorage.token
                        }
                    }).then(function (response) {
                        //console.log(response);
                        if (response.data.result > 0) {
                            $dialogAlert("Xác nhận thành công!", "Thông báo!", "success", function () {
                                window.location.reload();
                            });
                        } else {
                            $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                        }

                    }, function (res) {
                        console.log(res);
                        $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
                    });
                }
            })
        }
        //show order detail
        $scope.invoiceDetail = function (dataInvoice) {
            $http({
                method: 'GET',
                url: window.host_api + 'api/common/get?action=kesdetail&subsInfoId=' + dataInvoice + '&type=kes',
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (response) {
                //console.log(response.data.data);
                if (response.data.result > 0) {
                    var dataInvoice = response.data.data;
                    var modal = $uibModal.open({
                        animation: 1000,
                        backdrop: 'static',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: `<div class="modal-header label-primary" style="position:relative">\
                    <h4 class ="modal-title" style="color:#fff" >Thông tin chi tiết đơn hàng </h4>\
                    </div>\
                    <div style="max-height:500px;overflow-y:scroll" id="print">
                        <h2 class="live-print" style="display:none">Thông tin đơn hàng </h2>
                        <table class="table table-bordered" style="width:100%;">
                            <tr class="panel-info list-group-item-info"><td colspan="2"><strong>Thông tin mua hàng</strong></td></tr>
                            <tr><td style="width:200px">Họ tên</td><td>${dataInvoice.order.fullname}</td></tr>
                            <tr><td>Email</td><td>${dataInvoice.order.email}</td></tr>
                            <tr><td>Số điện thoại</td><td>${dataInvoice.order.phone}</td></tr>
                            <tr><td>Sản phẩm</td><td>${dataInvoice.order.product_name}</td></tr>
                            <tr><td>Ngày mua</td><td>${dataInvoice.order.created_date} </td></tr>
                            <tr><td>Số lượng</td><td>${dataInvoice.order.qty_user}</td></tr>
                            <tr><td>Tài khoản</td><td>${dataInvoice.order.account}</td></tr>
                            <tr class="panel-info list-group-item-info"><td colspan="2"><strong>Thông tin người quản lý tài khoản</strong></td></tr>
                            <tr><td>FirstName</td><td>${dataInvoice.manager.firstname}</td></tr>
                            <tr><td>LastName</td><td>${dataInvoice.manager.lastname}</td></tr>
                            <tr><td>Phone</td><td>${(dataInvoice.manager.phone)}</td></tr>
                            <tr><td>Email</td><td>${(dataInvoice.manager.email)}</td></tr>
                            <tr><td>Address</td><td>${(dataInvoice.manager.address)}</td></tr>
                            <tr><td>City</td><td>${(dataInvoice.manager.city)}</td></tr>
                            <tr><td>Country</td><td>${(dataInvoice.manager.country)}</td></tr>
                            <tr><td>ZipCode</td><td>${(dataInvoice.manager.zipcode)}</td></tr>
                            <tr class="panel-info list-group-item-info"><td colspan="2"><strong>Thông tin công ty</strong></td></tr>
                            <tr><td>Tên công ty</td><td>${dataInvoice.comp.name}</td></tr>
                            <tr><td>SĐT</td><td>${dataInvoice.comp.phone}</td></tr>
                            <tr><td>Địa chỉ</td><td>${dataInvoice.comp.address}</td></tr>
                            <tr><td>Mã số thuế</td><td>${dataInvoice.comp.taxcode}</td></tr>
                            <tr><td>Người đại diện</td><td>${dataInvoice.comp.represent ? dataInvoice.comp.represent.name : ""}</td></tr>
                            <tr><td>SĐT người đại diện</td><td>${dataInvoice.comp.represent ? dataInvoice.comp.represent.phone : ""}</td></tr>  
                        </table>
                    </div>
                    <div class ="modal-footer">\
                        <button class ="btn btn-default" ng-click="cancel()" data-dismiss="modal" >Đóng</button>\
                    </div>`,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.cancel = function () {
                                $uibModalInstance.close(false);
                            };
                        },
                        controllerAs: $scope,
                        size: 'xs',//size,   
                        windowClass: 'your-modal-class',

                    });

                } else {
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }

            }, function (res) {
                console.log(res);
                $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
            });

        };

        // paging
        $scope.prev = function () {
            $scope.page--;
            if ($scope.page < 0) {
                $scope.page = 0;
                search();
                return;
            }
            search();
        }
        $scope.next = function () {
            if ((($scope.page + 1) * $scope.num) > $scope.totalRow) return;
            $scope.page++;
            search();
        }
        // search theo date, search theo productName or productCode
        $scope.searchFilter = function () {
            $scope.page = 0;
            search();
        }
        // list order kes
        search();
        function search() {
            $scope.data = [];
            $scope.totalRow = 0;
            $http({
                method: 'GET',
                url: window.host_api + 'api/common/get?action=productkes&filter=' + ($scope.filter || '') + '&num=' + $scope.num + '&page=' + ($scope.page || '') + '&from_date=' + $scope.from_date + '&to_date=' + $scope.to_date + '&status=' + $scope.status+"&type=kes",
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                //console.log(res)                  
                if (res.data.result > 0) {
                    $scope.data = res.data.data.detail;
                    $scope.totalRow = res.data.data.total_row;
                } else {
                    //$scope.textloading = "Dữ liệu trống.";
                    $scope.textloading = res.data.message;
                    //$dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                }
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }
    });
    // quan ly don hang onesme
    app.controller('ponesme$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $modalTemplate, $uibModalStack, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        if ($rootScope.$user && $rootScope.$user.Roles.indexOf('info') < 0) {
            $rootScope.$user = null;
            $rootScope.login_active = true;
            $state.go('account$signout');
            return;
        }
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
        $rootScope.headTitle = 'Quản lý đơn hàng  > oneSME';
        $scope.textloading = "Đang tải dữ liệu ...";
        $scope.page = 0;
        $scope.num = 10;
        $scope.totalRow = 0;
        $scope.maxSize = 5;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        $scope.showRow = false;
        $scope.status = "-1";
        $(document).ready(function () {
            setTimeout(function () {
                $(".dateTimePicker").datetimepicker({
                    isRTL: false,
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    language: 'en',
                    minView: 2, //tat thoi gian
                    pickTime: false, //tat thoi gian
                    todayBtn: true,
                });
            }, 500);
        });

        var _timeTodate = function () {
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        var _timeFromdate = function () {
            //var date = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));/ / lùi 30 ngày
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = '01';///day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        $scope.from_date = _timeFromdate();
        $scope.to_date = _timeTodate();
        // xac nhan don hang da khoi tao thong tin cho khach hang thanh cong
        $scope.fnconfirm = function (subid) {
            $dialogConfirm(`<p style="font-size:14px">Xác nhận đã khởi tạo thông tin cho khách hàng thành công?</p>
            <input class ="form-control" ng-model="bankingRef" name="bankingRef" placeholder="Nhập ghi chú xác nhận thông tin" required>
            </div>`, "Xác nhận", function (res) {
                if (res) {
                    var _note = $("input[name='bankingRef']").val();
                    if ($.trim(_note) === "") {
                        $dialogAlert("Ghi chú không được bỏ trống, vui lòng thực hiện lại!", "Thông báo", "warning", function (res) {
                            $scope.fnconfirm(subid);
                        });
                        return;
                    }
                    $http({
                        method: 'GET',
                        url: window.host_api + 'api/common/get?action=kesconfirm&subsId=' + subid + '&note=' + _note,
                        headers: {
                            'Authorization': "Bearer " + $window.localStorage.token
                        }
                    }).then(function (response) {
                        //console.log(response);
                        if (response.data.result > 0) {
                            $dialogAlert("Xác nhận thành công!", "Thông báo!", "success", function () {
                                window.location.reload();
                            });
                        } else {
                            $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                        }

                    }, function (res) {
                        console.log(res);
                        $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
                    });
                }
            })
        }
        //show order detail
        //console.log(window.dataJson);
  
        $scope.invoiceDetail = function (dataInvoice) {
            return $modalTemplate.detail(dataInvoice);
        };
        // form mail template
        //console.log(window.dataJson);
        $scope.sendMailTemp = function (module, id, refid) {
            var option1 = {
                title: 'Cập nhật thông tin đơn hàng <span class ="lnr lnr-pencil" style="font-size: 15px;"></span>',
                module: module,// nhóm sản phẩm
                type: 1,// action dành cho api cập nhật đơn hàng
                id: id,
                refid: refid
            }
            $modalTemplate.form(option1, function (res) {
                return search();
            });
        };
        $scope.updateInfoOder = function (module, id, refid) {
            var option2 = {
                title: 'Hoàn thành đơn hàng ',
                type: 2, // action dành cho api hoàn thành đơn hàng
                id: id,
                module:module, // nhóm sản phẩm
                refid: refid
            }
            $modalTemplate.form(option2, function (res) {
                return search();
            });
        };
        // paging
        $scope.pageChanged = function () {
            $scope.page = $scope.bigCurrentPage - 1;
            search();
        };
        // search theo date, search theo productName or productCode
        $scope.searchFilter = function () {
            $scope.page = 0;
            search();
        }
        // list order kes
        search();
        function search() {
            $scope.textloading = "Đang tải dữ liệu...";
            $scope.data = [];
            $scope.totalRow = 0;
            $http({
                method: 'GET',
                url: window.host_api + 'api/common/get?action=productkes&filter=' + ($scope.filter || '') + '&num=' + $scope.num + '&page=' + ($scope.page || '') + '&from_date=' + $scope.from_date + '&to_date=' + $scope.to_date + '&status=' + $scope.status+"&type=onesme",
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                //console.log(res)                  
                if (res.data.result > 0) {
                    $scope.data = res.data.data.detail;
                    $scope.bigTotalItems = res.data.data.total_row;

                } else {
                    //$scope.textloading = "Dữ liệu trống.";
                    $scope.textloading = res.data.message;
                    //$dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                }
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }
    });
    // danh sach don vi nha cung cap
    app.controller('producerList$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert,$dialogShowForm, $stateParams, $window) {
        if ($rootScope.$user && $rootScope.$user.Roles.indexOf('seller') < 0) {
            $rootScope.$user = null;
            $rootScope.login_active = true;
            $state.go('account$signout');
            return;
        }

        $rootScope.headTitle = 'Nhà cung cấp > Danh sách';
        $scope.textloading = "Đang tải dữ liệu ...";
        $scope.page = 0;
        $scope.totalRow = 0;
        $scope.maxSize = 10;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        $scope.flag = false;
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
        

        fndata($http, $scope, 'list')
        function fndata($http, $scope, action) {
            search()
            $scope.search = search;
            // sort
            $scope.sort = {
                column: '',
                descending: false
            };

            $scope.changeSorting = function (column) {

                var sort = $scope.sort;

                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = false;
                }
            };
            // thay đổi class khi sort
            $scope.selectedCls = function (column) {
                return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
            };
            
   
            // search theo date, search theo productName or productCode
            $scope.searchFilter = function () {
                $scope.page = 0;
                search();
            }
            // paging
            $scope.pageChanged = function () {
                $scope.page = $scope.bigCurrentPage - 1;
                console.log('Page changed to: ' + $scope.bigCurrentPage);
                search();
            };
            // load data api
            function search() {
                $scope.data = [];
                $scope.totalRow = 0;
                $http({
                    method: 'GET',
                    url: window.host_api + 'api/producer/get?action=' + action + '&filter=' + ($scope.filter || '') + '&num=' + $scope.maxSize + '&page=' + ($scope.page || ''),
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    //console.log(res)                  
                    if (res.data.result > 0) {
                        $scope.data = res.data.data;
                        $scope.totalRow = res.data.data.total_row;
                        $scope.bigTotalItems = res.data.data.total_row;
                        $(document).ready(function(){
                            $('.btnProductToggle').bootstrapToggle({
                                on: 'Kích hoạt',
                                off: 'Ngừng kích hoạt',
                                size:"mini",
                                style:"btnToggleCustom"
                            });
                        })
                    } else {
                        //$scope.textloading = "Dữ liệu trống.";
                        $scope.textloading = res.data.message;
                        //$dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                    }
                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            }
        }
        // bieu do doi tac cung cap dich 
        // biểu đồ hình tròn
        
        var options_pie = {
            colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
            showlegend: true,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    //console.log(this)
                    return formatNumbers(this.y) +
                        '<br/>' + roundNumber(this.percentage, 1) + ' %';
                },
                distance: -70,
                filter: {
                    property: 'percentage',
                    operator: '>',
                    value: 4
                }
            }
        }
        
        $http({
            method: 'GET',
            url: host_api + 'api/producer/get?action=statisticcharts&type=pie',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) { 
            console.log(res);
            if(res.data.result > 0){
                var _datas = res.data.data;
                $rootScope.loadChartPie(_datas.total, "chartdvncc1", "Thống kê doanh thu bảo hiểm (tỉ đồng)", options_pie);
                $rootScope.loadChartPie(_datas.total_last, "chartdvncc2", "Thống kê lợi nhuận (tỉ đồng)", options_pie);
                _datas.calim.forEach(function(val){
                    if(val.y == 0){
                        val.visible = false
                    }
                })
                $rootScope.loadChartPie(_datas.calim, "chartdvncc3", "Khiếu nại khách hàng", options_pie);
                _datas.suspend.forEach(function(val){
                    if(val.y == 0){
                        val.visible = false
                    }
                })
                $rootScope.loadChartPie( _datas.suspend, "chartdvncc4", "Khách hàng tạm ngưng dịch vụ", options_pie);           
            }else{
                $dialogAlert("\n " + res.data.message, "Thông báo!", "warning");
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })

        // bieu do thong ke tang truong
        // biểu đồ đường kẻ
        var option_line = {
            colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
            dataY: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
        };
        var data_line = [
            {
                name:"Công ty bảo hiểm BIC",
                data:[2100,2550,3000,3200,4100,4120,5500,5900,8000,9600,20000,36000]
            },
            {
                name:"Công ty bảo hiểm PVI",
                data:[3600,4000,6000,9000,15000,15500,22000,26000,29000,32000,33000,35900]
            },
            {
                name:"Công ty bảo hiểm MC",
                data:[2000,2500,3000,4500,6500,8000,7500,7600,10000,15000,19000,23000]
            }
        ]
        $http({
            method: 'GET',
            url: host_api + 'api/producer/get?action=statisticcharts&type=line',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) { 
            console.log(res);
            if(res.data.result > 0){
                var _datas = res.data.data;
                $rootScope.loadChartLine(_datas.total, "line_chartdvncc", "Thống kê tăng trưởng khách hàng", option_line);      
            }else{
                $dialogAlert("\n " + res.data.message, "Thông báo!", "warning");
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        
    })
    // Them khuyen mai
    app.controller("addPromotion$Ctrl", function ($http, $scope, $rootScope, $dialogAlert,$dialogConfirm,$state, $dialogShowForm, $log, $uibModal, $window) {
        $scope.data = {
            textInput: '',
            options: {
                language: 'en',
                allowedContent: true,
                entities: false
            }
        };
        $scope.dataProduct = {
            target:0
        }
        $(document).ready(function () {
            $('.select_promotion').select2({
                placeholder: {
                    id: '-1', // the value of the option
                    text: 'Chọn ít nhất 1 sản phẩm'
                }
            });
            $('#formProduct').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    title: {
                        validators: {
                            notEmpty: {
                                message: 'Tiêu đề không được bỏ trống.'
                            }
                        }
                    },                    
                }
            })
            .on('success.field.bv', function (e, data) {
                var $parent = data.element.parents('.form-group');
                // Hide the success icon
                $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
            })
            .on('error.field.bv', function (e, data) {
                // Hide the success icon
                var $parent = data.element.parents('.form-group');
                $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
            })
            .on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();
                postData();
            });
            setTimeout(function () {
                $(".dateTimePicker").datetimepicker({
                    isRTL: false,
                    format: 'yyyy-mm-dd hh:ii:00',
                    autoclose: true,
                    language: 'en',
                    //minView: 2, //tat thoi gian
                    //pickTime: false, //tat thoi gian
                    todayBtn: true,
                });
            }, 500);

            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        
        })
        var _timeTodate = function () {
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
            day = day < 10 ? "0" + day : day;


            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        var _timeFromdate = function () {
            //var date = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));// lùi 30 ngày
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = '01';///day < 10 ? "0" + day : day;


            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        $scope.from_date = _timeFromdate();
        $scope.to_date = _timeTodate();
        $http({
            method: 'GET',
            url: host_api + 'api/channel/get?action=list',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) { 
            if(res.data.result > 0){
                $scope.dataListChannel = res.data.data;               
            }else{
                $dialogAlert("\n " + res.data.message, "Thông báo!", "warning");
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        $scope.dataProduct = {};
        $scope.dataProduct.productId = [];
        //danh sách sản phẩm theo id kênh bán
        $scope.flag_product = true;
        $scope.loadProducts = function(pid){
            $http({
                method: 'GET',
                url: host_api + 'api/product/get?action=listbychannelid&channelId='+pid,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) { 
                if(res.data.result > 0){
                    $scope.flag_product = false;
                    $scope.dataListProduct = res.data.data;               
                }else{
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }

        //che do hiển thị /1 la show /0 la hide
        //$scope.dataProduct.status = 1;
        // get category blog
        $http.get('/api/common/db_getdatanew?action=blogcategory')
            .then(function (res) {
                $scope.dataCategory = res.data.data;
                //console.log(res);
            }, function err(e) {
                console.log(e);
            });
        $scope.$watch("myFile", function () {
            //console.log($scope.myFile);
            if($scope.myFile){
                $scope.fileName = $scope.myFile.filename;
            }            
        });
       
        $scope.addFiles = function () {
            //console.log($scope.myFile)
            if ($scope.myFile === undefined || $scope.myFile === "") {
                $scope.error = "Vui lòng chọn 1 ảnh đại diện của bài viết";
                return;
            }
            
            if ($scope.myFile) {
                $scope.error = undefined;
                //console.log($scope.myFile)
                if ($scope.myFile.filesize <= 0) return;
                $scope.dataImage = {
                    Name: $scope.myFile.filename,
                    Content: "data:" + $scope.myFile.filetype +";base64," +$scope.myFile.base64
                };
                ///api upload hình
                $http({
                    method: 'POST',
                    url: window.host_api + 'api/common/upload',
                    data: $scope.dataImage,
                    headers: {
                        'Authorization':"Bearer " + $window.localStorage.token,
                    }
                }).then(function (response) {
                    //console.log(response);
                    $scope.imagesUrl = window.host + "uploads/" + response.data.data.rewrite;
                    $scope.dataProduct.files = [{
                        rewrite: response.data.data.rewrite,
                        original: response.data.data.original
                    }];
                }, function (res) {
                    console.log(res);
                    // $dialogAlert("\n " + res.data.Message ? res.data.Message : "", "Thông báo!", "warning");
                });
            }
        }

        //$scope.contentBlog = "";
        function postData() {
            $scope.dataProduct.fromdate = $scope.from_date;
            $scope.dataProduct.todate = $scope.to_date;
            $scope.dataProduct.action = "create";
            console.log($scope.dataProduct);
            //return;
            $http({
                method: 'POST',
                url: host_api + 'api/promotion/crud',
                data: $scope.dataProduct,
                headers: {
                    'Authorization': $window.localStorage.token,
                }
            }).then(function (response) {
                //console.log(response);
                if (response.data.result > 0) {
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "success",function(res){
                        if(res){
                            $state.go("selkhuyenmai");
                        }
                    });
                    $('#formProduct').bootstrapValidator('resetForm', true);
                } else {
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }
            }, function (res) {
                //console.log(res);
                $dialogAlert("\n " + res.data.message ? res.data.message : "", "Thông báo!", "warning");
            });
        }

    })
    // Them khuyen mai
    app.controller("editPromotion$Ctrl", function ($http, $scope,$state, $rootScope,$stateParams, $dialogAlert, $dialogConfirm, $dialogShowForm, $log, $uibModal, $window) {
        $scope.pid = $stateParams.id;
        console.log($scope.pid);
        $scope.dataProduct = {};
        var productId = [];
        $scope.data = {
            textInput: '',
            options: {
                language: 'en',
                allowedContent: true,
                entities: false
            }
        };
        $(document).ready(function () {
            $('.select_promotion').select2();
            $('#formProduct').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    title: {
                        validators: {
                            notEmpty: {
                                message: 'Tiêu đề không được bỏ trống.'
                            }
                        }
                    },                    
                }
            })
            .on('success.field.bv', function (e, data) {
                var $parent = data.element.parents('.form-group');
                // Hide the success icon
                $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
            })
            .on('error.field.bv', function (e, data) {
                // Hide the success icon
                var $parent = data.element.parents('.form-group');
                $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
            })
            .on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();
                postData();
            });
            
        })
        var _timeTodate = function () {
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
            day = day < 10 ? "0" + day : day;


            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        var _timeFromdate = function () {
            //var date = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));// lùi 30 ngày
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = '01';///day < 10 ? "0" + day : day;


            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        //$scope.from_date = _timeFromdate();
        // $scope.to_date = _timeTodate();
        $http({
            method: 'GET',
            url: host_api + 'api/promotion/get?action=detail&id='+$scope.pid,
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) { 
            //console.log(res)
            if(res.data.result > 0){
                $scope.dataListChannel = res.data.data;         
                
                $scope.dataProduct = {
                    title:res.data.data.name,
                    channelId:res.data.data.channel.code,
                    type:res.data.data.type,
                    scale: res.data.data.scale,
                    fromdate:res.data.data.start_time,
                    todate:res.data.data.end_time,
                    description: res.data.data.description,
                    refId:res.data.data.refId
                }
                
                $scope.loadProducts(res.data.data.channel.code)
                setTimeout(function () {
                    $(".dateTimePicker").datetimepicker({
                        isRTL: false,
                        format: 'yyyy-mm-dd hh:ii:00',
                        autoclose: true,
                        language: 'en',
                        //minView: 2, //tat thoi gian
                        //pickTime: false, //tat thoi gian
                        todayBtn: true,
                    });
                    res.data.data.product.forEach(function(val){
                        productId.push(val.code);
                    })
                    $scope.dataProduct.productId = productId;
                    $(document).ready(function() {
                        $('.select_promotion').val(productId);
                        $('.select_promotion').trigger('change'); 
                    });
                }, 500);
                $http({
                    method: 'GET',
                    url: host_api + 'api/channel/get?action=list',
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) { 
                    if(res.data.result > 0){
                        $scope.dataListChannel = res.data.data;               
                    }else{
                        $dialogAlert("\n " + res.data.message, "Thông báo!", "warning");
                    }

                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            }else{
                $dialogAlert("\n " + res.data.message, "Thông báo!", "warning");
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })

        
        //danh sách sản phẩm theo id kênh bán
        $scope.flag_product = true;
        $scope.loadProducts = function(pid){
            $http({
                method: 'GET',
                url: host_api + 'api/product/get?action=listbychannelid&channelId='+pid,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) { 
                if(res.data.result > 0){
                    $scope.flag_product = false;
                    $scope.dataListProduct = res.data.data;               
                }else{
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }

        //che do hiển thị /1 la show /0 la hide
        //$scope.dataProduct.status = 1;
        // get category blog
        $http.get('/api/common/db_getdatanew?action=blogcategory')
            .then(function (res) {
                $scope.dataCategory = res.data.data;
                //console.log(res);
            }, function err(e) {
                console.log(e);
            });
        $scope.$watch("myFile", function () {
            //console.log($scope.myFile);
            if($scope.myFile){
                $scope.fileName = $scope.myFile.filename;
            }            
        });
       
        $scope.addFiles = function () {
            //console.log($scope.myFile)
            if ($scope.myFile === undefined || $scope.myFile === "") {
                $scope.error = "Vui lòng chọn 1 ảnh đại diện của bài viết";
                return;
            }
            
            if ($scope.myFile) {
                $scope.error = undefined;
                //console.log($scope.myFile)
                if ($scope.myFile.filesize <= 0) return;
                $scope.dataImage = {
                    Name: $scope.myFile.filename,
                    Content: "data:" + $scope.myFile.filetype +";base64," +$scope.myFile.base64
                };
                ///api upload hình
                $http({
                    method: 'POST',
                    url: window.host_api + 'api/common/upload',
                    data: $scope.dataImage,
                    headers: {
                        'Authorization':"Bearer " + $window.localStorage.token,
                    }
                }).then(function (response) {
                    //console.log(response);
                    $scope.imagesUrl = window.host + "uploads/" + response.data.data.rewrite;
                    $scope.dataProduct.files = [{
                        rewrite: response.data.data.rewrite,
                        original: response.data.data.original
                    }];
                }, function (res) {
                    console.log(res);
                    // $dialogAlert("\n " + res.data.Message ? res.data.Message : "", "Thông báo!", "warning");
                });
            }
        }

        //$scope.contentBlog = "";
        function postData() {
            //$scope.dataProduct.fromdate = $scope.from_date;
            // $scope.dataProduct.todate = $scope.to_date;
            $scope.dataProduct.action = "update";
            //console.log($scope.dataProduct);
            $dialogConfirm("Vui lòng kiểm tra lại thông tin và ấn xác nhận để hoàn tất.","Xác nhận thay đổi", function(res){
                if(res){
                    //return;
                    $http({
                        method: 'POST',
                        url: host_api + 'api/promotion/crud',
                        data: $scope.dataProduct,
                        headers: {
                            'Authorization': $window.localStorage.token,
                        }
                    }).then(function (response) {
                        //console.log(response);
                        if (response.data.result > 0) {
                            $dialogAlert("\n " + response.data.message, "Thông báo!", "success",function(res){
                                if(res){
                                    $state.go("selkhuyenmai");
                                }
                            });
                            $('#formProduct').bootstrapValidator('resetForm', true);
                        } else {
                            $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                        }
                    }, function (res) {
                        //console.log(res);
                        $dialogAlert("\n " + res.data.message ? res.data.message : "", "Thông báo!", "warning");
                    });
                }            
            })            
        }
    })
    // Them nha cung cap
    app.controller("addProducer$Ctrl", function ($http, $scope, $rootScope, $dialogAlert,$dialogConfirm,$state, $dialogShowForm, $log, $uibModal, $window) {
        $scope.data = {
            textInput: '',
            options: {
                language: 'en',
                allowedContent: true,
                entities: false
            }
        };
        
        $(document).ready(function () {

            $('#formProducer').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    name: {
                        validators: {
                            notEmpty: {
                                message: 'Tên không được bỏ trống.'
                            }
                        }
                    },                    
                }
            })
            .on('success.field.bv', function (e, data) {
                var $parent = data.element.parents('.form-group');
                // Hide the success icon
                $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
            })
            .on('error.field.bv', function (e, data) {
                // Hide the success icon
                var $parent = data.element.parents('.form-group');
                $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
            })
            .on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();
                postData();
            });
           
        })
        
        $http({
            method: 'GET',
            url: host_api + 'api/channel/get?action=list',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) { 
            if(res.data.result > 0){
                $scope.dataListChannel = res.data.data;               
            }else{
                $dialogAlert("\n " + res.data.message, "Thông báo!", "warning");
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        $scope.dataProducer = {};
        
        //danh sách nhà cung cấp
        $scope.flag_product = true;
        $scope.loadProducts = function(pid){
            $http({
                method: 'GET',
                url: host_api + 'api/product/get?action=listbychannelid&channelId='+pid,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) { 
                if(res.data.result > 0){
                    $scope.flag_product = false;
                    $scope.dataListProduct = res.data.data;               
                }else{
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }

        //$scope.contentBlog = "";
        function postData() {
            $scope.dataProducer.action = "create";
            //console.log($scope.dataProducer);
            //return;
            $http({
                method: 'POST',
                url: host_api + 'api/producer/crud',
                data: $scope.dataProducer,
                headers: {
                    'Authorization': $window.localStorage.token,
                }
            }).then(function (response) {
                //console.log(response);
                if (response.data.result > 0) {
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "success",function(res){
                        if(res){
                            $state.go("selList");
                        }
                    });
                    $('#formProduct').bootstrapValidator('resetForm', true);
                } else {
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }
            }, function (res) {
                //console.log(res);
                $dialogAlert("\n " + res.data.message ? res.data.message : "", "Thông báo!", "warning");
            });
        }

    })
    // Them sản phẩm nha cung cap
    app.controller("addSptProducer$Ctrl", function ($http, $scope, $rootScope,$stateParams, $dialogAlert,$dialogConfirm,$state, $dialogShowForm, $log, $uibModal, $window) {
        var code = $stateParams.code;
        $(document).ready(function () {
            $('.select_product').select2({
                placeholder: {
                    id: '-1', // the value of the option
                    text: 'Chọn sản phẩm'
                }
            });
            $('#formProducer').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    name: {
                        validators: {
                            notEmpty: {
                                message: 'Tên không được bỏ trống.'
                            }
                        }
                    },                    
                }
            })
            .on('success.field.bv', function (e, data) {
                var $parent = data.element.parents('.form-group');
                // Hide the success icon
                $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
            })
            .on('error.field.bv', function (e, data) {
                // Hide the success icon
                var $parent = data.element.parents('.form-group');
                $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
            })
            .on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();
                postData();
            });
           
        })
        $scope.dataProducer = {};
        //
        $http({
            method: 'GET',
            url: host_api + 'api/channel/get?action=list',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            //console.log(res);
            if(res.data.result > 0){
                $scope.dataListChannel = res.data.data;                   
            }else{
                $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        // danh sach nha cung cap
        $http({
            method: 'GET',
            url: window.host_api + 'api/producer/get?action=list',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            if(res.data.result > 0){
                res.data.data.forEach(function(val){
                    if(val.code == code){
                        $scope.title = val.name;
                        $scope.dataProducer.code = val.code;
                        $scope.dataProducer.secretkey = val.secretkey;
                    }
                })
            }else{
                $dialogAlert("\n " + res.data.message, "Thông báo!", "warning");
            }
        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        // danh sach nhom san pham
        $http({
            method: 'GET',
            url: host_api + 'api/producer/get?action=insugroup',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) { 
            if(res.data.result > 0){
                $scope.dataInsugroup = res.data.data;               
            }else{
                $dialogAlert("\n " + res.data.message, "Thông báo!", "warning");
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })
        
        
        //danh sách nhà cung cấp
        $scope.flag_product = true;
        $scope.loadProducts = function(pid){
            $http({
                method: 'GET',
                url: host_api + 'api/producer/get?action=insutype&code='+pid,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) { 
                if(res.data.result > 0){
                    $scope.flag_product = false;
                    $scope.dataListProduct = res.data.data;               
                }else{
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }

        //$scope.contentBlog = "";
        function postData() {
            $scope.dataProducer.action = "product";
            //console.log($scope.dataProducer);
            //return;
            $http({
                method: 'POST',
                url: host_api + 'api/producer/crud',
                data: $scope.dataProducer,
                headers: {
                    'Authorization': $window.localStorage.token,
                }
            }).then(function (response) {
                //console.log(response);
                if (response.data.result > 0) {
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "success",function(res){
                        if(res){
                            $state.go("selProducer");
                        }
                    });
                    $('#formProduct').bootstrapValidator('resetForm', true);
                } else {
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }
            }, function (res) {
                //console.log(res);
                $dialogAlert("\n " + res.data.message ? res.data.message : "", "Thông báo!", "warning");
            });
        }

    })
    app.controller("chienluocbanhang$Ctrl", function ($http, $scope, $rootScope,$stateParams, $dialogAlert,$dialogConfirm,$state, $dialogShowForm, $log, $uibModal, $window) {
        //bieu do thong ke chien luoc ban hang
        $(document).ready(function(){
            var options_column = {
                colors: ['#5B9BD5', '#ED7D31', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],               
            }
            var data1 = {
                category:["Truyền thông sms","Truyền thông mạng xã hội","Truyền thông Telesale"],
                series:[
                    {
                        name:"Mục tiêu",
                        data:[20000,50000,30000]
                    },
                    {
                        name:"Đạt được",
                        data:[15000,80000,1000]
                    }
                ]
            };
            var data2 = {
                category:["Truyền thông sms","Truyền thông mạng xã hội","Truyền thông Telesale"],
                series:[
                    {
                        name:"Mục tiêu",
                        data:[100,50,30]
                    },
                    {
                        name:"Đạt được",
                        data:[20,80,10]
                    }
                ]
            }
            var data3 = {
                category:["SMS tới KH VIP","SMS tới KH HSSV","SMS tới KH Phổ thông"],
                series:[
                    {
                        name:"Mục tiêu",
                        data:[10000,10000,50000]
                    },
                    {
                        name:"Đạt được",
                        data:[15000,6000,80000]
                    }
                ]
            };
            var data4 = {
                category:["SMS tới KH VIP","SMS tới KH HSSV","SMS tới KH Phổ thông"],
                series:[
                    {
                        name:"Mục tiêu",
                        data:[25,15,50]
                    },
                    {
                        name:"Đạt được",
                        data:[32,9,80]
                    }
                ]
            }
            load_bieudocot("chartclbh1",data1,"Chiến lược bán hàng",options_column);   
            load_bieudocot("chartclbh2",data2,"Thống kê doanh thu(tỉ đồng)",options_column);   
            load_bieudocot("chartclbh3",data3,"Phân tích khách hàng",options_column);   
            load_bieudocot("chartclbh4",data4,"Thống kê doanh thu(tỉ đồng)",options_column);   
           
            function load_bieudocot(id,data,title,options){
                Highcharts.setOptions({
                    colors: options.colors 
                });
                Highcharts.chart(id, {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        categories: data.category,
                        type: 'category'
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: null
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },                   
                    tooltip: {
                        formatter: function () {
                            var _html = "";
                            _html  += `<h4>${this.x}</h4>`;
                            this.points.forEach(function(val){
                                _html  += `<p style="margin-bottom:0"><span style="color:${val.color}"> ${val.series.name}</span> : ${formatNumbers(val.y)}</p>`;
                            })
                            return _html;
                        },
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return formatNumbers(this.y) 
                                }
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: data.series
                });
            }

            
        })
    
    })
    app.controller("phantichhanhvi$Ctrl", function ($http, $scope, $rootScope,$stateParams, $dialogAlert,$dialogConfirm,$state, $dialogShowForm, $log, $uibModal, $window) {
        //bieu do thong ke chien luoc ban hang
        $(document).ready(function(){
            var options_column = {
                colors: [ '#ED7D31','#5B9BD5', '#89A54E', '#80699B', '#763c3c', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],               
            }
            var data1 = {},data2 = {};
            $http({
                method: 'GET',
                url: host_api + 'api/report/seller?action=customerchart&type=column',
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                // console.log(res);
                if (res.data.result > 0) {
                    console.log(res);
                    data1.category = res.data.data.customer.category;
                    data1.series = res.data.data.customer.series;
                    data2.category = res.data.data.subscription.category;
                    data2.series = res.data.data.subscription.series;
                    load_bieudocot("charthvkh1",data1,"Thống kê tăng trưởng khách hàng",options_column);   
                    load_bieudocot("charthvkh2",data2,"Thống kê thuê bao",options_column);
                } else {
                    $dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                }

            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
           
            function load_bieudocot(id,data,title,options){
                Highcharts.setOptions({
                    colors: options.colors 
                });
                Highcharts.chart(id, {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        categories: data.category,
                        type: 'category'
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: null
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },                   
                    tooltip: {
                        formatter: function () {
                            var _html = "";
                            _html  += `<h4>${this.x}</h4>`;
                            this.points.forEach(function(val){
                                _html  += `<p style="margin-bottom:0"><span style="color:${val.color}"> ${val.series.name}</span> : ${formatNumbers(val.y)}</p>`;
                            })
                            return _html;
                        },
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return formatNumbers(this.y) + '<div><span class="lnr lnr-user"></span></div>';
                                }
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: data.series
                });
            }

            
        })
    
    })
    
// function quan ly don hang moza
    app.controller('pmoza$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        if ($rootScope.$user && $rootScope.$user.Roles.indexOf('info') < 0) {
            $rootScope.$user = null;
            $rootScope.login_active = true;
            $state.go('account$signout');
            return;
        }
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
        $rootScope.headTitle = 'Quản lý đơn hàng  > Kaspersky endpoint security';
        $scope.textloading = "Đang tải dữ liệu ...";
        $scope.page = 0;
        $scope.num = 10;
        $scope.totalRow = 0;
        $scope.status = "-1";
        $(document).ready(function () {
            setTimeout(function () {
                $(".dateTimePicker").datetimepicker({
                    isRTL: false,
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    language: 'en',
                    minView: 2, //tat thoi gian
                    pickTime: false, //tat thoi gian
                    todayBtn: true,
                });
            }, 500);
        });

        var _timeTodate = function () {
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        var _timeFromdate = function () {
            //var date = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));/ / lùi 30 ngày
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
            month = month < 10 ? "0" + month : month,
                day = '01';///day < 10 ? "0" + day : day;
            return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
        }
        $scope.from_date = _timeFromdate();
        $scope.to_date = _timeTodate();
        // xac nhan don hang da khoi tao thong tin cho khach hang thanh cong
        $scope.fnconfirm = function (subid) {
            $scope.datakh = {};
            $dialogConfirm(`<p style="font-size:14px">Xác nhận đã khởi tạo thông tin cho khách hàng thành công?</p>
                <form class="form-auth-small" name="signinForm" id="signinForm">
                        <div class="form-group">
                            <label for="signin-email" class="control-label sr-only">Tài khoản</label>
                            <input class="form-control" type="text" placeholder="Nhập tài khoản" name="taikhoan" ng-model="datakh.taikhoan" required>
                        </div>
                        <div class="form-group">
                            <label for="signin-password" class="control-label sr-only">Mật khẩu</label>
                            <input type="password" class="form-control" placeholder="Nhập mật khẩu" name="matkhau" ng-model="datakh.matkhau" required>
                        </div>
                        <div class="form-group">
                            <label for="signin-password" class="control-label sr-only">Key</label>
                            <input type="text" class="form-control" placeholder="Nhập key" name="key" ng-model="datakh.key" required>
                        </div>
                        <div class="form-group">
                            <label for="signin-password" class="control-label sr-only">Key</label>
                            <input class ="form-control" ng-model="bankingRef" name="bankingRef" placeholder="Nhập ghi chú xác nhận thông tin" required>
                        </div>
                </form>
            
            </div>`, "Xác nhận", function (res) {
                if (res) {
                    var _taikhoan = $("input[name='taikhoan']").val();
                    var _matkhau = $("input[name='matkhau']").val();
                    var _key = $("input[name='key']").val();
                    var _note = $("input[name='bankingRef']").val();
                    if ($.trim(_taikhoan) === "" || $.trim(_matkhau) === "" || $.trim(_key) === "" || $.trim(_note) === "" ) {
                        $dialogAlert("Thông tin không được bỏ trống, vui lòng thực hiện lại!", "Thông báo", "warning", function (res) {
                            $scope.fnconfirm(subid);
                        });
                        return;
                    }
                    $http({
                        method: 'GET',
                        url: window.host_api + 'api/common/get?action=kesconfirm&subsId=' + subid + '&taikhoan=' + _taikhoan + '&matkhau=' + _matkhau + '&key=' + _key + '&note=' + _note,
                        headers: {
                            'Authorization': "Bearer " + $window.localStorage.token
                        }
                    }).then(function (response) {
                        //console.log(response);
                        if (response.data.result > 0) {
                            $dialogAlert("Xác nhận thành công!", "Thông báo!", "success", function () {
                                window.location.reload();
                            });
                        } else {
                            $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                        }

                    }, function (res) {
                        console.log(res);
                        $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
                    });
                }
            })
        }
        //show order detail moza product
        $scope.invoiceDetail = function (dataInvoice) {
            $http({
                method: 'GET',
                url: window.host_api + 'api/common/get?action=kesdetail&subsInfoId=' + dataInvoice + '&type=moza',
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (response) {
                //console.log(response.data.data);
                if (response.data.result > 0) {
                    var dataInvoice = response.data.data;
                    var modal = $uibModal.open({
                        animation: 1000,
                        backdrop: 'static',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: `<div class="modal-header label-primary" style="position:relative">\
                    <h4 class ="modal-title" style="color:#fff" >Thông tin chi tiết đơn hàng </h4>\
                    </div>\
                    <div style="max-height:500px;overflow-y:scroll" id="print">
                        <h2 class="live-print" style="display:none">Thông tin đơn hàng </h2>
                        <table class="table table-bordered" style="width:100%;">
                            <tr class="panel-info list-group-item-info"><td colspan="2"><strong>Thông tin mua hàng</strong></td></tr>
                            <tr><td style="width:200px">Họ tên</td><td>${dataInvoice.order.fullname}</td></tr>
                            <tr><td>Email</td><td>${dataInvoice.order.email}</td></tr>
                            <tr><td>Số điện thoại</td><td>${dataInvoice.order.phone}</td></tr>
                            <tr><td>Sản phẩm</td><td>${dataInvoice.order.product_name}</td></tr>
                            <tr><td>Ngày mua</td><td>${dataInvoice.order.created_date} </td></tr>
                            <tr><td>Số lượng</td><td>${dataInvoice.order.qty_user}</td></tr>
                            <tr><td>Tài khoản</td><td>${dataInvoice.order.account}</td></tr>
                            <tr class="panel-info list-group-item-info"><td colspan="2"><strong>Thông tin người quản lý tài khoản</strong></td></tr>
                            <tr><td>FirstName</td><td>${dataInvoice.manager.firstname}</td></tr>
                            <tr><td>LastName</td><td>${dataInvoice.manager.lastname}</td></tr>
                            <tr><td>Phone</td><td>${(dataInvoice.manager.phone)}</td></tr>
                            <tr><td>Email</td><td>${(dataInvoice.manager.email)}</td></tr>
                            <tr><td>Address</td><td>${(dataInvoice.manager.address)}</td></tr>
                            <tr><td>City</td><td>${(dataInvoice.manager.city)}</td></tr>
                            <tr><td>Country</td><td>${(dataInvoice.manager.country)}</td></tr>
                            <tr><td>ZipCode</td><td>${(dataInvoice.manager.zipcode)}</td></tr>
                            <tr class="panel-info list-group-item-info"><td colspan="2"><strong>Thông tin công ty</strong></td></tr>
                            <tr><td>Tên công ty</td><td>${dataInvoice.comp.name}</td></tr>
                            <tr><td>SĐT</td><td>${dataInvoice.comp.phone}</td></tr>
                            <tr><td>Địa chỉ</td><td>${dataInvoice.comp.address}</td></tr>
                            <tr><td>Mã số thuế</td><td>${dataInvoice.comp.taxcode}</td></tr>
                            <tr><td>Người đại diện</td><td>${dataInvoice.comp.represent ? dataInvoice.comp.represent.name : ""}</td></tr>
                            <tr><td>SĐT người đại diện</td><td>${dataInvoice.comp.represent ? dataInvoice.comp.represent.phone : ""}</td></tr>  
                        </table>
                    </div>
                    <div class ="modal-footer">\
                        <button class ="btn btn-default" ng-click="cancel()" data-dismiss="modal" >Đóng</button>\
                    </div>`,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.cancel = function () {
                                $uibModalInstance.close(false);
                            };
                        },
                        controllerAs: $scope,
                        size: 'xs',//size,   
                        windowClass: 'your-modal-class',

                    });

                } else {
                    $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                }

            }, function (res) {
                console.log(res);
                $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
            });

        };

        // paging
        $scope.prev = function () {
            $scope.page--;
            if ($scope.page < 0) {
                $scope.page = 0;
                search();
                return;
            }
            search();
        }
        $scope.next = function () {
            if ((($scope.page + 1) * $scope.num) > $scope.totalRow) return;
            $scope.page++;
            search();
        }
        // search theo date, search theo productName or productCode
        $scope.searchFilter = function () {
            $scope.page = 0;
            search();
        }
        // list order kes
        search();
        function search() {
            $scope.data = [];
            $scope.totalRow = 0;
            $http({
                method: 'GET',
                url: window.host_api + 'api/common/get?action=productkes&filter=' + ($scope.filter || '') + '&num=' + $scope.num + '&page=' + ($scope.page || '') + '&from_date=' + $scope.from_date + '&to_date=' + $scope.to_date + '&status=' + $scope.status+"&type=moza",
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                //console.log(res)                  
                if (res.data.result > 0) {
                    $scope.data = res.data.data.detail;
                    $scope.totalRow = res.data.data.total_row;
                } else {
                    //$scope.textloading = "Dữ liệu trống.";
                    $scope.textloading = res.data.message;
                    //$dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                }
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }
        
        // demo json
        var _json = {
            "result": 1,
            "message": "Thành công",
            "data": {
                "total_row": 71,
                "detail": [
                    {
                        "name": "Bảo hiểm  học sinh sinh viên",
                        "mmyy": "9/2021",
                        "qty": 6
                    },
                    {
                        "name": "Bảo hiểm  học sinh sinh viên",
                        "mmyy": "10/2021",
                        "qty": 3
                    },
                    {
                        "name": "Bảo hiểm  học sinh sinh viên",
                        "mmyy": "11/2021",
                        "qty": 9
                    },
                    {
                        "name": "Bảo hiểm  học sinh sinh viên",
                        "mmyy": "12/2021",
                        "qty": 3
                    },
                    {
                        "name": "Bảo hiểm  học sinh sinh viên",
                        "mmyy": "1/2022",
                        "qty": 1
                    },
                    {
                        "name": "Bảo hiểm  học sinh sinh viên",
                        "mmyy": "3/2022",
                        "qty": 3
                    },
                    {
                        "name": "Bảo hiểm Mô tô- xe máy (1 năm)",
                        "mmyy": "7/2021",
                        "qty": 3
                    },
                    {
                        "name": "Bảo hiểm Mô tô- xe máy (1 năm)",
                        "mmyy": "9/2021",
                        "qty": 1
                    },
                    {
                        "name": "Bảo hiểm Mô tô- xe máy (1 năm)",
                        "mmyy": "10/2021",
                        "qty": 25
                    },
                    {
                        "name": "Bảo hiểm Mô tô- xe máy (1 năm)",
                        "mmyy": "11/2021",
                        "qty": 3
                    },
                    {
                        "name": "Bảo hiểm Mô tô- xe máy (1 năm)",
                        "mmyy": "12/2021",
                        "qty": 1
                    },
                    {
                        "name": "Bảo hiểm TNDS ô tô",
                        "mmyy": "10/2021",
                        "qty": 1
                    },
                    {
                        "name": "Bảo hiểm TNDS ô tô",
                        "mmyy": "11/2021",
                        "qty": 1
                    },
                    {
                        "name": "Bảo hiểm TNDS ô tô",
                        "mmyy": "12/2021",
                        "qty": 4
                    },
                    {
                        "name": "Bảo hiểm TNDS ô tô",
                        "mmyy": "2/2022",
                        "qty": 1
                    },
                    {
                        "name": "Kapersky Anti Virus - 1 DT",
                        "mmyy": "6/2021",
                        "qty": 1
                    },
                    {
                        "name": "Kaspersky Endpoint Security cho Doanh nghiệp | Standard",
                        "mmyy": "9/2021",
                        "qty": 1
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "6/2021",
                        "qty": 2
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "7/2021",
                        "qty": 14
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "8/2021",
                        "qty": 11
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "9/2021",
                        "qty": 14
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "10/2021",
                        "qty": 12
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "11/2021",
                        "qty": 26
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "12/2021",
                        "qty": 22
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "1/2022",
                        "qty": 15
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "2/2022",
                        "qty": 13
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 1 DVC",
                        "mmyy": "3/2022",
                        "qty": 7
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "4/2021",
                        "qty": 19
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "5/2021",
                        "qty": 8
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "6/2021",
                        "qty": 3
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "7/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "8/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "9/2021",
                        "qty": 76
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "10/2021",
                        "qty": 15
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "11/2021",
                        "qty": 11
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "12/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "1/2022",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "2/2022",
                        "qty": 13
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 3 DVC",
                        "mmyy": "3/2022",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "6/2021",
                        "qty": 1
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "7/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "8/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "9/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "10/2021",
                        "qty": 15
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "11/2021",
                        "qty": 12
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "12/2021",
                        "qty": 13
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "1/2022",
                        "qty": 78
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "2/2022",
                        "qty": 11
                    },
                    {
                        "name": "Kaspersky Internet Security - Multi-Device - 5 DVC",
                        "mmyy": "3/2022",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "3/2021",
                        "qty": 1
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "6/2021",
                        "qty": 4
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "7/2021",
                        "qty": 11
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "8/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "9/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "10/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "11/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "12/2021",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "1/2022",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "2/2022",
                        "qty": 10
                    },
                    {
                        "name": "Kaspersky Internet Security for Android - 1 MD",
                        "mmyy": "3/2022",
                        "qty": 5
                    },
                    {
                        "name": "Kaspersky Safe Kids - 1 DT",
                        "mmyy": "6/2021",
                        "qty": 1
                    },
                    {
                        "name": "Kaspersky Safe Kids - 1 DT",
                        "mmyy": "7/2021",
                        "qty": 1
                    },
                    {
                        "name": "Kaspersky Safe Kids - 1 DT",
                        "mmyy": "11/2021",
                        "qty": 16
                    },
                    {
                        "name": "Kaspersky Safe Kids - 1 DT",
                        "mmyy": "12/2021",
                        "qty": 11
                    },
                    {
                        "name": "Kaspersky Safe Kids - 1 DT",
                        "mmyy": "1/2022",
                        "qty": 5
                    },
                    {
                        "name": "Kaspersky Safe Kids - 1 DT",
                        "mmyy": "2/2022",
                        "qty": 3
                    },
                    {
                        "name": "Kaspersky Safe Kids - 1 DT",
                        "mmyy": "3/2022",
                        "qty": 2
                    },
                    {
                        "name": "Microsoft 365 Business Basic (Office 365 Business Essentials)",
                        "mmyy": "11/2021",
                        "qty": 1
                    },
                    {
                        "name": "Mô tô- xe máy (1 năm)",
                        "mmyy": "7/2021",
                        "qty": 2
                    },
                    {
                        "name": "Mô tô- xe máy (1 năm)",
                        "mmyy": "10/2021",
                        "qty": 3
                    },
                    {
                        "name": "Moza",
                        "mmyy": "3/2022",
                        "qty": 16
                    }
                ]
            },
            "requestId": 129083
        }
        //$scope.dataMoza = _json.data.detail;
        function groupByKey(array, key) {
            return array
              .reduce((hash, obj) => {
                  if(obj[key] === undefined) return hash; 
                  return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
              }, {})
        }
        var demo_data = _json.data.detail;

        // group theo tháng
        var ar_date = groupByKey(demo_data,'mmyy');
        ar_date = Object.keys(ar_date);
        //console.log(ar_date);
        var _arrdate2 = []
        ar_date.forEach(function(val){
            var _val = val.split("/");
            _arrdate2.push({
                'month':_val[0],
                'year':_val[1]
            })
        })
        //group theo tên sản phẩm
        var ar_name = groupByKey(demo_data,'name');
        
        ar_name = Object.values(ar_name);
        //console.log(ar_name);

        var _arrdate = []
        ar_name.forEach(function(val){
            var valName = val[0].name;
            _arrdate.push({
                'name':valName,
                'datas2':val
            })
        })
        
        $scope.dataMoza = _arrdate;
        //console.log(_arrdate);

        //function sum value
        $scope.sumValue =  function(arr){
            var _e = 0;
            arr.forEach(function(val){
                _e += val.qty;
            });
            return _e
        }
        const months = ['1', '2', '3', '4', '5', '6','7', '8', '9', '10', '11', '12'];
        const sorter = (a, b) => {
            if(a.year !== b.year){
                return a.year - b.year;
            }else{
                return months.indexOf(a.month) - months.indexOf(b.month);
            };
        };
        _arrdate2.sort(sorter);

        //console.log(_arrdate2);
        var _arryDate = [];
        _arrdate2.forEach(function(val){
            _arryDate.push(val.month+'/'+val.year)
        })
        var _series = [];
        var data2= [];
        _arrdate.forEach(function(item,key){
            item.data2 = [];
            item.datas = cvobject(item.datas2);
            item.datas.forEach(function(val){
                item.data2.push(val.qty)
            })
            _series.push({
                'name':item.name,
                'data':item.data2
            })

        });
        //console.log(_series)
        setTimeout(function(){
            // return;
            $("#imgLoading").remove();
            //console.log(_arrdate);
            $(document).ready(function () {
                var colors = ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
                '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a',"#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"];
                Highcharts.setOptions({
                    colors: colors
                });
                Highcharts.chart('hightchart_moza', {
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: 'Thống kê doanh số bán sản phẩm '
                    },
                    yAxis: {
                        title: {
                            text: '<strong>Số lượng sản phẩm</strong>'
                        },
                    },
                    tooltip: {
                        crosshairs: true,
                        shared: true
                    },
                    xAxis: {
                        title: {
                            text: '<strong>Thời gian</strong>'
                        },
                        categories: _arryDate,
                    },

                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
                    plotOptions: {
                        spline: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                       
                    },
                    series: _series,
                    credits: {
                        enabled: false
                    },
                });
              
            })
            
        },3000);
       
        function cvobject(arr){
            const result = _arryDate.map(person => {
                var e = {}
                const addressItem = arr.find(address => address.mmyy === person )
                e.key =  person;
                e.qty = addressItem ? addressItem.qty: null;
                return e
            })
            return result;
        }
        $scope.rowHighilited = function(group, row){
            $scope.selectedGroup=  group;
            $scope.selectedRow = row; 
        };
        var data_jsondashboard = {"result":1,"message":"Thành công","data":[{"ordi_num":1,"product":{"name":"Bảo hiểm  học sinh sinh viên"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":1,"curr":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}},{"ordi_num":2,"product":{"name":"Bảo hiểm Mô tô- xe máy (1 năm)"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":33,"curr":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}},{"ordi_num":3,"product":{"name":"Bảo hiểm TNDS ô tô"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":1,"curr":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}},{"ordi_num":4,"product":{"name":"Kapersky Anti Virus - 1 DT"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":1,"curr":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}},{"ordi_num":5,"product":{"name":"Kaspersky Endpoint Security cho Doanh nghiệp | Standard"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":1,"curr":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}},{"ordi_num":6,"product":{"name":"Kaspersky Internet Security - Multi-Device - 1 DVC"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":13,"curr":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}},{"ordi_num":7,"product":{"name":"Kaspersky Internet Security - Multi-Device - 3 DVC"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":60,"curr":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}},{"ordi_num":8,"product":{"name":"Kaspersky Internet Security - Multi-Device - 5 DVC"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":70,"curr":1,"1":0,"2":0,"3":0,"4":0,"5":1,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}},{"ordi_num":9,"product":{"name":"Kaspersky Internet Security for Android - 1 MD"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":4,"curr":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}},{"ordi_num":10,"product":{"name":"Kaspersky Safe Kids - 1 DT"},"partner":{"id":20210002,"name":"Store VTC"},"qty":{"ago":1,"curr":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0}}],"requestId":148265};
        $scope.data_jsondashboard = data_jsondashboard.data;
        $scope.month_cur = new Date();
        $scope.month_ago = (new Date().getMonth() < 10 ? '0'+new Date().getMonth() : new Date().getMonth())  +'/'+ (new Date().getFullYear().toString().substr(-2));
    });
    // function quan ly don hang tiki
    app.controller('ptiki$Ctrl', function ($http, $scope, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        if ($rootScope.$user && $rootScope.$user.Roles.indexOf('info') < 0 && $rootScope.$user.Roles.indexOf('tiki_get') < 0) {
            $rootScope.$user = null;
            $rootScope.login_active = true;
            $state.go('account$signout');
            return;
        }
        if ($rootScope.$user === null || $rootScope.$user === undefined) {
            $log.info('redirect to login');
            $location.path('/account/signin');
            return;
        }
        $rootScope.headTitle = 'Quản lý đơn hàng  > Tiki shop';
        $scope.textloading = "Đang tải dữ liệu ...";
        $scope.page = 0;
        $scope.num = 10;
        $scope.totalRow = 0;
        $scope.maxSize = 5;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
        $scope.showRow = false;
        $scope.status = "-1";
        $scope.dataList = [];
        
        var selectText =`<select id="selectText" name='productTiki' class="form-control" >
                            <option value=''>Chọn sản phẩm</option>
                          </select>`;        
        // xac nhan don hang da khoi tao thong tin cho khach hang thanh cong        
        $scope.fnconfirm = function () {
            $http({
                method: 'GET',
                url: window.host_api + 'api/tiki/get?action=item' ,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                if (res.data.result > 0) {
                    $scope.dataList = res.data.data;
                    res.data.data.forEach(function(val){
                        $('#selectText').append(`<option value='${val.code}'>${val.name}</option>`);
                    })
                } else {
                    //$scope.textloading = "Dữ liệu trống.";
                    $scope.textloading = res.data.message;
                    //$dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                }
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
            $scope.datakh = {};
            $dialogConfirm(`<p style="font-size:14px">Vui lòng chọn sản phẩm và nhập số lượng để lấy key</p>
                <form class="form-auth-small" name="signinForm" id="signinForm">
                        <div class="form-group">
                          <span for="signin-password" class="control-label sr-only">Chọn sản phẩm:</span>
                          ${selectText}
                        </div>
                         <div class="form-group">
                            <span for="signin-password" class="control-label sr-only">Số lượng:</span>
                            <input type="Number" class="form-control" placeholder="Nhập số lượng" name="quantity"  required>
                        </div>  
                </form>
            
            </div>`, "Lấy key theo sản phẩm", function (res) {
                if (res) {
                    $("div.overlay").addClass("show");
                    var ProductId = $("select[name='productTiki']").val();
                    var qty = $("input[name='quantity']").val();
                    console.log(ProductId, qty)
                    if ($.trim(ProductId) === "" || $.trim(qty) === "") {
                        $dialogAlert("Thông tin không được bỏ trống, vui lòng thực hiện lại!", "Thông báo", "warning", function (res) {
                            $scope.fnconfirm();
                        });
                        $("div.overlay").removeClass("show");
                        return;
                    }
                    var data = {
                        "action":"activate",
                        "qty": qty,
                        "ProductId":ProductId
                    }
                    
                    $http({
                        method: 'POST',
                        url: window.host_api + 'api/tiki/asu',
                        headers: {
                            'Authorization': "Bearer " + $window.localStorage.token
                        },
                        data:data
                    }).then(function (response) {
                        //console.log(response);
                        
                        if (response.data.result > 0) {
                            $dialogAlert("Lấy key thành công!", "Thông báo!", "success", function () {
                                //window.location.reload();
                                //console.log(response);
                                var modal = $uibModal.open({
                                    animation: 1000,
                                    backdrop: 'static',
                                    ariaLabelledBy: 'modal-title',
                                    ariaDescribedBy: 'modal-body',
                                    template: `<div class="modal-header label-primary" style="position:relative">\
                                        <h4 class ="modal-title" style="color:#fff" >Danh sách key </h4>\
                                        </div>\
                                        <div style="max-height:500px;overflow-y:scroll" id="printKey">
                                            <table class="table table-bordered" style="width:100%;margin-top:10px">
                                                <thead>
                                                    <tr class="panel-info list-group-item-info">
                                                        <th style="text-align:center;width:60px">STT</th>
                                                        <th>Key</th>
                                                        <th>Mã code</th>                                                       
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr ng-if="data.length == 0"><td colspan="9">{{textloading}}</td></tr>
                                                    <tr ng-repeat="item in dataKeys" >
                                                        <td class="text-center" style="width:60px">{{$index+1}}</td>
                                                        <td>{{item.Item3}}</td>
                                                        <td style="width:250px">{{item.Item4}}</td>
                                                       
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class ="modal-footer">\
                                            <button class ="btn btn-primary" ng-click="exportExcel()" >Xuất excel</button>\
                                            <button class ="btn btn-default" ng-click="cancel()" data-dismiss="modal" >Đóng</button>\
                                        </div>`,
                                    controller: function ($scope, $uibModalInstance) {
                                        $scope.cancel = function () {
                                            $uibModalInstance.close(false);
                                            search();
                                        };
                                        $scope.dataKeys = response.data.data;
                                        $scope.nameT = getName(ProductId);
                                        //console.log($scope.nameT)
                                        var nameFile = $scope.nameT.replaceAll(' ','-');
                                        nameFile = nameFile.replaceAll("--","")
                                        $scope.exportExcel = function(){
                                            $("#printKey").table2excel({
                                                exclude: ".excludeThisClass",
                                                name: $scope.nameT,
                                                filename: nameFile + ".xls", // do include extension
                                                preserveColors: false // set to true if you want background colors and font colors preserved
                                            });
                                        }
                                        
                                    },
                                    size: 'xs',//size,   
                                    windowClass: 'your-modal-class',

                                });


                            });
                        } else {
                            $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                        }
                        $("div.overlay").removeClass("show");
                        function getName(code){
                            var _name = "";
                            $scope.dataList.forEach(function(val){
                                if(val.code === parseInt(code)){
                                    return _name = val.name;
                                }
                            });
                            return _name;
                        }
                    }, function (res) {
                        console.log(res);
                        $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
                    });
                    
                }
            })
        }
        // huy key theo time or tung key rieng le
        $scope.fnCancelKey = function () {
            
            $scope.datakh = {};
            $dialogConfirm(`<p style="font-size:14px">Vui lòng chọn sản phẩm và nhập số lượng để lấy key</p>
                <form class="form-auth-small" name="signinForm" id="signinForm">
                        <div class="form-group">
                          <span for="signin-password" class="control-label sr-only">Thể loại hủy</span>
                          <select id="selectText" name='typeKey' class="form-control" >
                            <option value='1'>Mã code</option>
                            <option value='0'>Thời gian</option>
                          </select>
                        </div>
                        <div class="form-group haskey">
                            <span for="signin-password" class="control-label sr-only">Key:</span>
                            <input type="text" class="form-control" placeholder="Nhập mã code" name="key"  required>
                        </div>
                        <div class="form-group hasdate" style="display:none">
                            <span for="signin-password" class="control-label sr-only">Thời gian:</span>
                            <input type="text" class="form-control" placeholder="Nhập thời gian(yyyy-mm-dd)" name="dateTime"  required>
                        </div>
                </form>
            
            </div>`, "Hủy key theo sản phẩm", function (res) {
                if (res) {
                    $("div.overlay").addClass("show");
                    var type =  $("select[name='typeKey']").val();
                    var _key = $("input[name='key']").val();
                    var _date = $("input[name='dateTime']").val();
                    if (($.trim(type) === "1" && $.trim(_key) === "") || ($.trim(type) === "0" && $.trim(_date) === "")) {
                        $dialogAlert("Thông tin không được bỏ trống, vui lòng thực hiện lại!", "Thông báo", "warning", function (res) {
                            $scope.fnCancelKey();
                        });
                        $("div.overlay").removeClass("show");
                        return;
                    }
                    var data = {
                        "action":"suspend",
                        "activateDate":_date
                    }
                    if(type === "1"){
                        data = {
                            "action":"suspendbycode",
                            "code":_key
                        }
                    }
                    $http({
                        method: 'POST',
                        url: window.host_api + 'api/tiki/asu',
                        headers: {
                            'Authorization': "Bearer " + $window.localStorage.token
                        },
                        data:data
                    }).then(function (response) {
                        //console.log(response);
                        $("div.overlay").removeClass("show");
                        if (response.data.result > 0) {
                            $dialogAlert("Hủy key thành công!", "Thông báo!", "success", function () {
                                //window.location.reload();
                                console.log(response);
                                var modal = $uibModal.open({
                                    animation: 1000,
                                    backdrop: 'static',
                                    ariaLabelledBy: 'modal-title',
                                    ariaDescribedBy: 'modal-body',
                                    template: `<div class="modal-header label-primary" style="position:relative">\
                                        <h4 class ="modal-title" style="color:#fff" >Danh sách key đã hủy </h4>\
                                        </div>\
                                        <div style="max-height:500px;overflow-y:scroll" id="print">
                                            <div class='item list' style="padding:0 15px;"><p> <strong>Tên sản phẩm</strong> <span style='float:right'><strong>code</strong></span></p></div>
                                            <div ng-repeat="item in dataKeys" class='item list' style="padding:0 15px;">
                                                <p >{{item.Item4}} <span style='float:right'>{{item.Item3}}</span></p>                                                
                                            </div>                                           
                                        </div>
                                        <div class ="modal-footer">\
                                            <button class ="btn btn-default" ng-click="cancel()" data-dismiss="modal" >Đóng</button>\
                                        </div>`,
                                    controller: function ($scope, $uibModalInstance) {
                                        $scope.cancel = function () {
                                            $uibModalInstance.close(false);
                                            search();
                                        };
                                        $scope.dataKeys = response.data.data;
                                    },
                                    size: 'xs',//size,   
                                    windowClass: 'your-modal-class',

                                });


                            });
                        } else {
                            $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                        }

                    }, function (res) {
                        console.log(res);
                        $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
                    });
                }
            });
            setTimeout(function(){
                $("select[name='typeKey']").on('change', function() {
                    if(this.value === "1"){
                        $(".haskey").show();
                        $(".hasdate").hide();
                    }else if(this.value === "0"){
                        $(".haskey").hide();
                        $(".hasdate").show();
                    }
                });               
            },1000)             
        }

        //show order detail moza product
        $scope.invoiceDetail = function (refId) {
            
            var modal = $uibModal.open({
                animation: 1000,
                backdrop: 'static',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: `<div class="modal-header label-primary" style="position:relative">\
                    <h4 class ="modal-title" style="color:#fff" >Cập nhật thông tin đơn hàng </h4>\
                    </div>\
                    <div style="max-height:500px;padding:15px" id="print">
                        <h2 class="live-print" style="display:none">Thông tin đơn hàng </h2>
                        <div class="form-group">
                          <label for="usr">Ngày bán:</label>
                          <input type="text" class="form-control dateTimePicker" ng-model="data.orderDate" ng-value="data.orderDate" placeholder="yyyy-mm-dd" >
                        </div>
                        <div class="form-group">
                          <label for="usr">Số hóa đơn:</label>
                          <input type="text" class="form-control" ng-model="data.orderId" placeholder="Nhập số hóa đơn" >
                        </div>
                        <div class="form-group">
                          <label for="usr">Tên khách hàng:</label>
                          <input type="text" class="form-control"  ng-model="data.custName"  placeholder="Nhập tên khách hàng">
                        </div>
                        <div class="form-group">
                          <label for="usr">Địa chỉ:</label>
                          <input type="text" class="form-control"  ng-model="data.address" placeholder="Nhập địa chỉ khách hàng">
                        </div>
                        <div class="form-group">
                            <label >Xuất hóa đơn?</label>
                            <div>
                                <label class="radio-inline"><input type="radio" name="optradio" value="true"  ng-model="data.isInvoice" >Có</label>
                                <label class="radio-inline"><input type="radio" name="optradio" value="false"  ng-model="data.isInvoice" checked>Không</label>
                            </div>
                        </div>
                    </div>
                    <div class ="modal-footer">\
                        <button class ="btn btn-default" ng-click="cancel()" data-dismiss="modal" >Đóng</button>\
                        <button class ="btn btn-primary" ng-click="update()"  >Cập nhật</button>\
                    </div>`,
                controller: function ($scope, $uibModalInstance,$uibModalStack) {
                    $scope.cancel = function () {
                        $uibModalInstance.close(false);
                    };
                    $scope.data = {
                        "action":"update",
                        "refId": refId,
                        "custName":'',
                        "address": '',
                        "orderId":'',
                        "orderDate":'',
                        "isInvoice": false
                    }
                    var _timeTodate = function () {
                        var date = new Date();
                        var year = date.getFullYear(),
                            month = date.getMonth() + 1,
                            day = date.getDate(),
                            hour = date.getHours();
                            month = month < 10 ? "0" + month : month,
                            day = day < 10 ? "0" + day : day;
                        return year + "-" + month + "-" + day; // day + "/" + month + "/" + year;
                    }
                    $scope.data.orderDate = _timeTodate();
                    $(document).ready(function () {
                        setTimeout(function () {
                            $(".dateTimePicker").datetimepicker({
                                isRTL: false,
                                format: 'yyyy-mm-dd HH:ii:ss',
                                autoclose: true,
                                language: 'en',
                                //minView: 2, //tat thoi gian
                               // pickTime: false, //tat thoi gian
                                todayBtn: true,
                            });
                        },1000);
                    });
                    $scope.update = function(){
                        //console.log($scope.data);
                        $("div.overlay").addClass("show");
                        //return;
                        if($.trim($scope.data.custName) === '' || $.trim($scope.data.address) === '' || $.trim($scope.data.orderId) === '' || $.trim($scope.data.orderDate) === ''){
                            $dialogAlert("\n Thông tin khách hàng không được để trống, vui lòng nhập đầy đủ và thử lại", "Lỗi!", "warning");  
                            $("div.overlay").removeClass("show");
                            return;
                        }
                        $http({
                            method: 'POST',
                            url: window.host_api + 'api/tiki/asu',
                            headers: {
                                'Authorization': "Bearer " + $window.localStorage.token
                            },
                            data:$scope.data
                        }).then(function (response) {
                            $("div.overlay").removeClass("show");
                            //console.log(response.data.data);
                            if (response.data.result > 0) {
                                $dialogAlert("\n " + response.data.message, "Thông báo!", "success", function(res){
                                    search();
                                    $uibModalStack.dismissAll();
                                });    
                               
                            } else {
                                $dialogAlert("\n " + response.data.message, "Thông báo!", "warning");
                            }

                        }, function (res) {
                            console.log(res);
                            $dialogAlert("\n " + res.data.message ? res.data.message : "Lỗi đường truyền, vui lòng thực hiện lại sau ít phút", "Thông báo!", "warning");
                        });
                    }
                },
                controllerAs: $scope,
                size: 'xs',//size,   
                windowClass: 'your-modal-class',

            });
            

        };

        // paging
        // search theo date, search theo productName or productCode
        $scope.searchFilter = function () {
            $scope.page = 0;
            search();
        }
        // list order kes
        $scope.pageChanged = function () {
            $scope.page = $scope.bigCurrentPage - 1;
            search();
        };
        search();
        function search() {
            $scope.data = [];
            $scope.totalRow = 0;
            $http({
                method: 'GET',
                url: window.host_api + 'api/tiki/get?action=list&filter=' + ($scope.filter || '') + '&num=' + $scope.num + '&page=' + ($scope.page || '') + '&status=' + $scope.status,
                headers: {
                    'Authorization': "Bearer " + $window.localStorage.token
                }
            }).then(function (res) {
                //console.log(res)                  
                if (res.data.result > 0) {
                    $scope.data = res.data.data.detail;
                    $scope.bigTotalItems = res.data.data.total_row;
                } else {
                    //$scope.textloading = "Dữ liệu trống.";
                    $scope.textloading = res.data.message;
                    //$dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                }
            }, function err(e) {
                $rootScope.checkError(e, $dialogAlert);
            })
        }
        $scope.month_cur = new Date();
        $scope.month_ago = (new Date().getMonth() < 10 ? '0'+new Date().getMonth() : new Date().getMonth())  +'/'+ (new Date().getFullYear().toString().substr(-2));
    });
    app.controller('mdKYCmobile$Ctrl', function ($http, $scope,$uibModal, $rootScope, $state, $dialogConfirm, $dialogAlert, $stateParams, $uibModal, $window, $timeout) {
        //default states
        $scope.uid = $stateParams.id;
        $scope.selectRoles = [];
        $scope.selectedList = [];
        $scope.dataForm = {};
        $(document).ready(function () {
            $('#enableForm')
                .bootstrapValidator({
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        password: {
                            enabled: false,
                            validators: {
                                notEmpty: {
                                    message: 'Mật khẩu không được để trống'
                                }
                            }
                        },
                        confirm_password: {
                            enabled: false,
                            validators: {
                                notEmpty: {
                                    message: 'Mật khẩu không được để trống'
                                },
                                identical: {
                                    field: 'password',
                                    message: 'Xác nhận mật khẩu không chính xác'
                                }
                            }
                        },
                        'rolle[]': {
                            validators: {
                                notEmpty: {
                                    message: 'Vui lòng chọn ít nhất một vai trò'
                                }
                            }
                        }
                    }
                })
                // Enable the password/confirm password validators if the password is not empty
                .on('keyup', '[name="password"]', function () {
                    var isEmpty = $(this).val() === '';
                    $('#enableForm')
                        .bootstrapValidator('enableFieldValidators', 'password', !isEmpty)
                        .bootstrapValidator('enableFieldValidators', 'confirm_password', !isEmpty);

                    // Revalidate the field when user start typing in the password field
                    if ($(this).val().length === 1) {
                        $('#enableForm').bootstrapValidator('validateField', 'password')
                            .bootstrapValidator('validateField', 'confirm_password');
                    }
                })
                .on('success.field.bv', function (e, data) {
                    var $parent = data.element.parents('.form-group');
                    // Hide the success icon
                    $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
                })
                .on('error.field.bv', function (e, data) {
                    // Hide the success icon
                    var $parent = data.element.parents('.form-group');
                    $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]').hide();
                })
                .on('success.form.bv', function (e) {
                    // Prevent form submission
                    e.preventDefault();
                    $scope.submit();
                });
        });

        //show modal camera
       
        $scope.showCamera = function (clss) {
            var modal = $uibModal.open({
               
                backdrop: 'static',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: window.templateUrl + "user/mdcamera.html",
                controller: function ($scope, $uibModalInstance, $sce) {
                    $scope.modal = $uibModalInstance;

                    $(document).ready(function () {
                        const width = 320; // We will scale the photo width to this
                        let height = 0; // This will be computed based on the input stream
                        let streaming = false;
                        let video = null;
                        let canvas = null;
                        let photo = null;
                        let startbutton = null;
                        video = document.getElementById("video");
                        canvas = document.getElementById("canvas");
                        photo = document.getElementById("photo");
                        startbutton = document.getElementById("startbutton");
                        // vars
                        let result = document.querySelector('.result'),
                        img_result = document.querySelector('.img-result'),
                        img_w = document.querySelector('.img-w'),
                        img_h = document.querySelector('.img-h'),
                        options = document.querySelector('.options'),
                        save = document.querySelector('.save'),
                        cropped = document.querySelector('.cropped'),
                        dwn = document.querySelector('.download'),
                        upload = document.querySelector('#file-input'),
                        cropper = '';
                        checkCamera();
                       
                        function checkCamera() {
                            const streams = navigator.mediaDevices
                             .getUserMedia({ video: true, audio: false })
                             .then((stream) => {
                                 window.localStream = stream;
                                 video.srcObject = stream
                                 video.play();
                             })
                             .catch((err) => {
                                 console.error(`An error occurred: ${err}`);
                             });
                            video.addEventListener(
                              "canplay",
                              (ev) => {
                                  if (!streaming) {
                                      height = video.videoHeight / (video.videoWidth / width);

                                      // Firefox currently has a bug where the height can't be read from
                                      // the video, so we will make assumptions if this happens.

                                      if (isNaN(height)) {
                                          height = width / (4 / 3);
                                      }

                                      video.setAttribute("width", width);
                                      video.setAttribute("height", height);
                                      canvas.setAttribute("width", width);
                                      canvas.setAttribute("height", height);
                                      streaming = true;
                                  }
                              },
                              false
                            );

                            startbutton.addEventListener(
                              "click",
                              (ev) => {
                                  takepicture();
                                  ev.preventDefault();
                              },
                              false
                            );

                            clearphoto();
                        }
                        function clearphoto() {
                            const context = canvas.getContext("2d");
                            context.fillStyle = "#AAA";
                            context.fillRect(0, 0, canvas.width, canvas.height);

                            const data = canvas.toDataURL("image/png");
                            photo.setAttribute("src", data);
                        }

                        function takepicture() {
                            const context = canvas.getContext("2d");
                            if (width && height) {
                                canvas.width = width;
                                canvas.height = height;
                                context.drawImage(video, 0, 0, width, height);

                                const data = canvas.toDataURL("image/png");
                                photo.setAttribute("src", data);
                                // create new image
                                let img = document.createElement('img');
                                img.id = 'image';
                                img.src = data;
                                // clean result before
                                result.innerHTML = '';
                                // append new image
                                result.appendChild(img);
                                // show save btn and options
                                save.classList.remove('hide');
                                options.classList.remove('hide');
                                // init cropper
                                cropper = new Cropper(img);
                            } else {
                                clearphoto();
                            }

                        }
                        // save on click
                        save.addEventListener('click', (e) => {
                            e.preventDefault();
                            // get result to data uri
                            let imgSrc = cropper.getCroppedCanvas({
                                width: img_w.value // input value
                            }).toDataURL();
                            // remove hide class of img
                            cropped.classList.remove('hide');
                            img_result.classList.remove('hide');
                            // show image cropped
                            cropped.src = imgSrc;
                            dwn.classList.remove('hide');
                            dwn.download = 'imagename.png';
                            dwn.setAttribute('href', imgSrc);
                        });
                        $scope.takepicture = function () {
                            return takepicture();
                        }
                    })
                    
                    $scope.modal.close = function () {
                        $uibModalInstance.dismiss(true);
                        var streams = video.srcObject;
                        streams.getTracks().forEach(function (track) {
                            if (track.readyState == 'live' && track.kind === 'video') {
                                track.stop();
                            }
                        });
                    };
                },
                size: 'md',
            });
            
        }


        //api get list roles
        $http({
            method: 'GET',
            url: host_api + 'api/auth/get?action=roles',
            headers: {
                'Authorization': "Bearer " + $window.localStorage.token
            }
        }).then(function (res) {
            // console.log(res);
            if (res.data.result > 0) {
                $scope.selectRoles = res.data.data;
                //api get detail user follow id,refid
                $http({
                    method: 'GET',
                    url: host_api + 'api/auth/get?action=userbyid&userid=' + $scope.uid + '&refid=' + $scope.refid,
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    // console.log(res);
                    if (res.data.result > 0) {
                        var _data = res.data.data;
                        $scope.accountName = _data.username;
                        $scope.dataForm = {
                            FullName: _data.fullname,
                            Phone: _data.phone,
                            Sex: _data.sex.toString(),
                            Email: _data.email,
                            RefId: $scope.refid,
                            UserId: $scope.uid
                        }
                        console.log($scope.dataForm);
                        angular.forEach(_data.roles, function (val) {
                            angular.forEach($scope.selectRoles, function (item) {
                                if (val.code === item.code) {
                                    $scope.selectedList[item.code] = true;
                                }
                            });

                        });

                    }
                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            }

        }, function err(e) {
            $rootScope.checkError(e, $dialogAlert);
        })

        /**
            * Action
            */
        $scope.submit = function () {
            var _rolle = []
            angular.forEach($scope.selectedList, function (selected, day) {
                if (selected) {
                    //console.log(day);
                    var role = parseInt(day);
                    _rolle.push(role);
                }
            });
            $scope.dataForm.Roles = _rolle;
            console.log($scope.dataForm);
            setTimeout(function () {
                if (_rolle.length <= 0) {
                    return false;
                }
                //api get list roles
                // return;
                $http({
                    method: 'POST',
                    url: host_api + 'api/auth/update',
                    data: $scope.dataForm,
                    headers: {
                        'Authorization': "Bearer " + $window.localStorage.token
                    }
                }).then(function (res) {
                    // console.log(res);
                    if (res.data.result > 0) {
                        //console.log(res);
                        $dialogAlert("Cập nhật tài khoản thành công", "Thông báo!", "success", function (res) {
                            $state.go("list$account");
                        });

                    } else {
                        $dialogAlert("\n" + res.data.message, "Thông báo!", "warning");
                    }

                }, function err(e) {
                    $rootScope.checkError(e, $dialogAlert);
                })
            }, 1000)

        };


    });
