/**
 * Created by Administrator on 12/28/2015.
 */

'use strict';

var dependencies = [
    'ui.router',
    'ngCookies',
    'msApp.cook.controllers'
];

angular.module('msApp.cook', dependencies)

    .config(
        ['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider
                .state('home.cook', {
                    url: '',
                    resolve: {
                        user: ['authService', '$cookieStore', '$q', function (authService, $cookieStore, $q) {
                            return $cookieStore.get("user") || $q.reject({ unAuthorized: true });
                        }]
                    },
                    template: '<div id="content" class="content" ui-view></div>'
                })
                .state('home.cook.list', {
                    url: '/cook/list',
                    templateUrl: '/modules/cook/views/cook_list.html'
                })
                .state('home.cook.detail', {
                    url: '/cook/detail',
                    templateUrl: '/modules/cook/views/cook_detail.html'
                })
                .state('home.cook.add', {
                    url: '/cook/add',
                    templateUrl: '/modules/cook/views/cook_add.html'
                });
    }])

    .run(function($rootScope) {
    });