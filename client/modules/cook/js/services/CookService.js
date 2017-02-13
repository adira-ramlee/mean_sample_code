/**
 * Created by Administrator on 12/23/2015.
 */

var dependencies = ['ngCookies'];

angular.module('msApp.cook.services', dependencies)

    .value('GET_COOK_LIST_ENDPOINT', 'http://192.168.1.10:8000/moranbong_api/v1/cooks')
    .value('GET_COOK_COUNT_ENDPOINT','http://192.168.1.10:8000/moranbong_api/v1/cooks/count')
    .value('COOK_ADD_ENDPOINT', 'http://192.168.1.10:8000/moranbong_api/v1/cooks')
    .value('COOK_MULTI_DELETE_ENDPOINT', 'http://192.168.1.10:8000/moranbong_api/v1/cooks/multiDel')

    .factory('cookService', ['GET_COOK_LIST_ENDPOINT', 'GET_COOK_COUNT_ENDPOINT', 'COOK_ADD_ENDPOINT', 'COOK_MULTI_DELETE_ENDPOINT', '$http', '$cookieStore',
        function(GET_COOK_LIST_ENDPOINT, GET_COOK_COUNT_ENDPOINT, COOK_ADD_ENDPOINT, COOK_MULTI_DELETE_ENDPOINT, $http, $cookieStore) {
            var cookService = {};

            cookService.getCount = function(searchKeyword) {
                var url = GET_COOK_COUNT_ENDPOINT + '?searchKeyword=' + searchKeyword;

                return $http.get(url).then(function(response, status) {
                    var count = response.data.message;
                    return count;
                });
            }

            cookService.getCooks = function(page, limit, sortField, sortDir, searchKeyword) {
                var apiUrl = GET_COOK_LIST_ENDPOINT + '?page=' + page + '&limit=' + limit + '&sortField=' + sortField + '&sortDir=' + sortDir + '&searchKeyword=' + searchKeyword;
                return $http.get(apiUrl).then(function(response, status) {
                    var cooks = response.data.message;
                    return cooks;
                });
            }

            cookService.getCookDetail = function(cookId) {
                var apiUrl = GET_COOK_LIST_ENDPOINT + '/' + cookId;
                return $http.get(apiUrl).then(function (response, status) {
                    var profile = response.data.message;
                    return profile;
                });
            }

            cookService.add = function(params) {
                return $http.post(COOK_ADD_ENDPOINT, {cook : params}).then(function(response, status) {
                    var count = response.data.message;
                    return count;
                });
            }

            cookService.update = function(cookId, cook) {
                var apiUrl = GET_COOK_LIST_ENDPOINT + '/' + cookId;

                return $http.put(apiUrl, {cook: cook}).then(function (response, status) {
                    return response;
                });
            }

            cookService.getCurrentCookId = function() {
                return $cookieStore.get('currentCookId');
            }

            cookService.setCurrentCookId = function(cookId) {
                cookService.currentId = cookId;

                $cookieStore.put('currentCookId', cookService.currentId);
            }

            cookService.deleteCurrentCook = function(cookId) {
                var apiUrl = GET_COOK_LIST_ENDPOINT + '/' + cookId;
                return $http.delete(apiUrl);
            }

            cookService.multiCookDelete = function(cookId_list, count) {
                var del_ids = {};
                for (var i = 0 ; i < count ; i++) {
                    del_ids[i] = cookId_list[i];
                }

                var del_Info = {
                    ids: del_ids,
                    count: count
                };
                return $http.post(COOK_MULTI_DELETE_ENDPOINT, {del_Info: del_Info});
            }

            return cookService;
        }]
);