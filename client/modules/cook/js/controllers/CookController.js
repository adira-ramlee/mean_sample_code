/**
 * Created by Administrator on 12/28/2015.
 */

var dependencies = [
    'msApp.user.services',
    'msApp.cook.services'
];

angular.module('msApp.cook.controllers', dependencies)

    .constant('DEFAULT_LIMIT', 10)
    .constant('DEFAULT_PAGE', 1)

    .controller(
        'CookController', ['$rootScope', '$scope', '$state', '$cookieStore', 'userService', 'cookService', 'paginationService', 'DEFAULT_PAGE', 'DEFAULT_LIMIT',
        function($rootScope, $scope, $state, $cookieStore, userService, cookService, paginationService, DEFAULT_PAGE, DEFAULT_LIMIT) {
            $scope.loggedInUser = $cookieStore.get("user");

            $scope.cookCount = 0;
            $scope.searchKeyword = '';

            $scope.currentPage = DEFAULT_PAGE;
            $scope.currentLimit = DEFAULT_LIMIT;

            var selectedCount = 0;
            var selectedIds = {};

            $scope.mealCategories = [
                { id : 1, name : 'Morning' },
                { id : 2, name : 'Lunch' },
                { id : 3, name : 'Dinner' }
            ];

            $scope.categories = [
                { id : 1, name : 'Prepare', checkState : false },
                { id : 2, name : 'Clean', checkState : false }
            ];

            var index = 1;
            var usersForEmailCompose = [{'id' : null, 'label' : 'All'}];
            var usersForFormEditable = [];
            userService.getUsers('', '', '', '', '').then(function(data) {
                angular.forEach(data, function (user) {
                    if (user._id != $scope.loggedInUser.id) {
                        var current_user = {};
                        current_user['id'] = user._id;
                        current_user['label'] = user.userName;
                        usersForEmailCompose[index] = current_user;

                        current_user = {};
                        current_user['id'] = user._id;
                        current_user['text'] = user.userName;
                        usersForFormEditable[index-1] = current_user;

                        index++;
                    }
                });

                EmailCompose.init(usersForEmailCompose);
                CookFormEditable.setUsers(usersForFormEditable);
            }, function(err) {
                $scope.invalidUser = true;
            }).finally(function() {
            });

            $scope.cooks = {};
            $scope.getCooks = function() {
                paginationService.insertPageLengthControl($('div.result-container select.page_length'));

                cookService.getCount($scope.searchKeyword).then(function(data) {
                    $scope.cookCount = data;

                    cookService.getCooks($scope.currentPage, $scope.currentLimit, $scope.sortField, $scope.sortDir, $scope.searchKeyword).then(function(data) {
                        $scope.cooks = data;

                        angular.forEach($scope.cooks, function (cook) {
                            cook.tags = 'html, javascript';

                            cook.realCookDate = cook.cookDate.substring(0, cook.cookDate.indexOf('T'));
                            cook.realCookAtString = cook.realCookAt.substring(0, cook.realCookAt.indexOf('T'));

                            cook.mealText = '';
                            angular.forEach(cook.cookAt, function (eachMeal, index) {
                                cook.mealText = cook.mealText + eachMeal.name + ', ';
                            });
                            cook.mealText = cook.mealText.substring(0, cook.mealText.length - 2);

                            cook.categoryText = '';
                            angular.forEach(cook.category, function (eachCategory, index) {
                                cook.categoryText = cook.categoryText + eachCategory.name + ', ';
                            });
                            cook.categoryText = cook.categoryText.substring(0, cook.categoryText.length - 2);

                            cook.send_to = '';
                            angular.forEach(cook.duty, function (eachDuty, index) {
                                cook.send_to = cook.send_to + eachDuty.name + ', ';
                            });
                            cook.send_to = cook.send_to.substring(0, cook.send_to.length - 2);
                        });
                    }, function(err) {
                    }).finally(function() {
                    });
                }, function(err) {
                }).finally(function() {
                });
            }

            $scope.setCurrentCook = function(id) {
                cookService.setCurrentCookId(id);
            }

            $scope.multiCookDelete = function() {
                $.each($('#data-table tbody tr'), function (index, item) {
                    if ($(item).hasClass('active'))
                        selectedIds[selectedCount++] = $($(item).children('input[type="hidden"]')).val();
                });

                cookService.multiCookDelete(selectedIds, selectedCount).then(function (response, status) {
                    $.gritter.add({
                        title: $rootScope.descriptions[$rootScope.current_lang]['alert_title'],
                        text: '.',
                        time: 2000,
                        class_name: 'center'
                    });
                    $scope.getCooks();
                }, function(err) {
                    $.gritter.add({
                        title: $rootScope.descriptions[$rootScope.current_lang]['alert_title'],
                        text: '.',
                        time: 2000,
                        class_name: 'center'
                    });
                }).finally(function() {
                });
            }

            $scope.deleteCurrrentCook = function() {
                cookService.deleteCurrentCook(cookService.currentId).then(function (response, status) {
                    $.gritter.add({
                        title: $rootScope.descriptions[$rootScope.current_lang]['alert_title'],
                        text: '.',
                        time: 2000,
                        class_name: 'center'
                    });
                    $scope.getCooks();
                }, function(err) {
                    $.gritter.add({
                        title: $rootScope.descriptions[$rootScope.current_lang]['alert_title'],
                        text: '.',
                        time: 2000,
                        class_name: 'center'
                    });
                }).finally(function() {
                });
            }

            var resetCurrentCookInfo = function(data) {
                if (!data) return;
                $scope.currentCook = data;
                $scope.currentCook.workers = '';
                var each_receiver_obj = {};
                angular.forEach($scope.currentCook.duty, function (eachWorker, index) {
                    $scope.currentCook.workers = $scope.currentCook.workers + eachWorker.name + ', ';

                    each_receiver_obj = {
                        'id' : eachWorker.id,
                        'label' : eachWorker.name,
                        'value' : eachWorker.name
                    };
                    $('#send-to').tagit('createTag', each_receiver_obj);
                });
                $scope.currentCook.workers = $scope.currentCook.workers.substring(0, $scope.currentCook.workers.length - 2);

                $scope.currentCook.mealCategoryText = '';
                angular.forEach($scope.mealCategories, function (category, index) {
                    category.checkState = false;
                    angular.forEach($scope.currentCook.cookAt, function (eachCookAt, index) {
                        if (eachCookAt.id == category.id) {
                            category.checkState = true;
                            $scope.currentCook.mealCategoryText = $scope.currentCook.mealCategoryText + category.name + ', ';
                        }
                    });
                });
                $scope.currentCook.mealCategoryText = $scope.currentCook.mealCategoryText.substring(0, $scope.currentCook.mealCategoryText.length - 2);

                $scope.currentCook.categoryText = '';
                angular.forEach($scope.categories, function (category, index) {
                    category.checkState = false;
                    angular.forEach($scope.currentCook.category, function (eachCategory, index) {
                        if (eachCategory.id == category.id) {
                            category.checkState = true;
                            $scope.currentCook.categoryText = $scope.currentCook.categoryText + category.name + ', ';
                        }
                    });
                });
                $scope.currentCook.categoryText = $scope.currentCook.categoryText.substring(0, $scope.currentCook.categoryText.length - 2);

                $scope.setCurrentCook($scope.currentCook._id);

                $scope.currentCook.realCookAtString = $scope.currentCook.realCookAt.substring(0, $scope.currentCook.realCookAt.indexOf('T'));
                $scope.cookDirections = $scope.currentCook.directions;
                $scope.cookDate = $scope.currentCook.cookDate.substring(0, $scope.currentCook.cookDate.indexOf("T"));
            }

            $scope.viewDetails = function() {
                var cookId = cookService.getCurrentCookId();
                if (cookId) {
                    cookService.getCookDetail(cookId).then(function(data) {
                        resetCurrentCookInfo(data);
                    }, function(err) {

                    }).finally(function() {
                    });
                } else {
                    var now = new Date();
                    var nowISOString = now.toISOString();
                    var nowString = nowISOString.substring(0, nowISOString.indexOf("T"));
                    cookService.getCooks($scope.currentPage, $scope.currentLimit, $scope.sortField, $scope.sortDir, nowString).then(function(data) {
                        if (data.length != 1) return;
                        cookService.setCurrentCookId(data[0]._id);
                        resetCurrentCookInfo(data[0]);
                    }, function(err) {
                    }).finally(function() {
                    });
                }
            }

            var getRequestParams = function() {
                var dutyUserArray = [];

                var i = 0;
                $.each($('ul#send-to li'), function(index, item) {
                    if ($(item).hasClass('tagit-choice')) {
                        var spanObj = $(item).children('span');
                        var senderName = spanObj.text();

                        var inputObj = $(item).children('input[type="hidden"]');
                        var senderId = inputObj.val();

                        if (senderId == 'null' && senderName == 'All') {
                            var sendUserIndex = 0;
                            angular.forEach($scope.users, function (user, key) {
                                if (user.id != null || user.label != 'All') {
                                    dutyUserArray[sendUserIndex] = {
                                        'id' : user.id,
                                        'name' : user.label
                                    };
                                    sendUserIndex++;
                                }
                            });
                        } else {
                            dutyUserArray[i] = {
                                'id' : senderId,
                                'name' : senderName
                            };
                            i++;
                        }
                    }
                });

                var mealCategoryObj = []; var categoryIndex = 0;
                angular.forEach($scope.mealCategories, function (mealCategory, index) {
                    if (mealCategory.checkState) {
                        mealCategoryObj[categoryIndex] = {
                            'id' : mealCategory.id,
                            'name' : mealCategory.name
                        };

                        categoryIndex++;
                    }
                });

                var categoryObj = []; categoryIndex = 0;
                angular.forEach($scope.categories, function (category, index) {
                    if (category.checkState) {
                        categoryObj[categoryIndex] = {
                            'id' : category.id,
                            'name' : category.name
                        };

                        categoryIndex++;
                    }
                });

                if ($scope.cookDirections == '') return null;
                if (dutyUserArray.length == 0) return null;
                if (mealCategoryObj.length == 0) return null;
                if (categoryObj.length == 0) return null;

                var params = {
                    'directions' : $scope.cookDirections,
                    'createdBy' : {
                        'id' : $scope.loggedInUser.id,
                        'name' : $scope.loggedInUser.userName
                    },
                    'createrName' : $scope.loggedInUser.userName,
                    'cookDate' : $scope.cookDate,
                    'cookAt' : mealCategoryObj,
                    'category' : categoryObj,
                    'duty' : dutyUserArray
                };

                return params;
            }

            $scope.create = function() {
                var params = getRequestParams();
                if (params == null) return;

                cookService.add(params).then(function(response) {
                    $.gritter.add({
                        title: $rootScope.descriptions[$rootScope.current_lang]['alert_title'],
                        text: '.',
                        time: 2000,
                        class_name: 'center'
                    });
                    $state.go("home.cook.list");
                }, function(err) {
                    $.gritter.add({
                        title: $rootScope.descriptions[$rootScope.current_lang]['alert_title'],
                        text: '.',
                        time: 2000,
                        class_name: 'center'
                    });
                }).finally(function() {
                });
            }

            $scope.update = function() {
                var cookId = cookService.getCurrentCookId();
                if (!cookId) return;

                var params = getRequestParams();
                if (params == null) return;

                cookService.update(cookId, params).then(function(response) {
                    $.gritter.add({
                        title: $rootScope.descriptions[$rootScope.current_lang]['alert_title'],
                        text: '.',
                        time: 2000,
                        class_name: 'center'
                    });
                    $state.go("home.cook.list");
                }, function(err) {
                    $.gritter.add({
                        title: $rootScope.descriptions[$rootScope.current_lang]['alert_title'],
                        text: '.',
                        time: 2000,
                        class_name: 'center'
                    });
                }).finally(function() {

                });
            }

            $scope.cancelCreate = function() {
                $scope.cookDirections = "";
                $('ul#send-to li').remove('.tagit-choice');

                $state.go("home.cook.list");
            }

            $scope.setEditMode = function(mode) {
                CookFormEditable.init(mode);
            }

            $scope.initCookParams = function() {
                $scope.cookDirections = "";
                $('ul#send-to li').remove('.tagit-choice');
            }

    }]);
