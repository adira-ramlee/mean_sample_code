"use strict";

var mongoose = require("mongoose"),
    Cook = mongoose.model("Cook"),
    log = require("../../libs/log")(module),
    consts = require("../../libs/consts");

function validate(cookObj, callback) {
    var cook = new Cook(cookObj);
    cook.validate(function(err) {
        if (err) {
            var cookModelValidationError = new Error(consts.COOK_MODEL_INVALIDATE);
            cookModelValidationError.status = err.status;
            callback(cookModelValidationError, null);
        } else {
            callback(null, consts.OK);
        }
    });
}

function countTotal(searchKeyword, callback) {
    var searchParams = {};

    if (searchKeyword) {
        searchParams['$or'] = [
            { "title": new RegExp(searchKeyword.toString(), "i") },
            { "summary": new RegExp(searchKeyword.toString(), "i") }
        ];
    }

    Cook.count(searchParams, function(err, cookCount) {
        if (err) {
            var error = new Error(consts.COUNT_NOT_GET_COUNT);
            error.status = 427;
            callback(error);
        } else {
            callback(null, cookCount);
        }
    });
}

function createCook(reqObj, callback) {
    var cook = new Cook(reqObj);
    cook.save(function(err, savedCook) {
        if (err) {
            var cookCreateError = new Error(consts.FAILED_SAVE_COOK);
            cookCreateError.status = err.status;
            callback(cookCreateError);
        } else {
            callback(null, savedCook);
        }
    })
}

function getCookById(cookId, callback) {
    Cook.findById(cookId).exec(function(ferr, cookInfo) {
        if (ferr) {
            callback(ferr);
        } else {
            if (cookInfo) {
                callback(null, cookInfo);
            } else {
                var cookGetError = new Error(consts.COULD_NOT_GET_COOK_INFO);
                cookGetError.status = 422;
                callback(cookGetError);
            }
        }
    });
}

function removeCookById(cookId, callback) {
    Cook.remove({ _id : cookId }, function(rerr) {
        if (rerr) {
            var cookRemoveError = new Error(consts.FAILED_REMOVE_COOK);
            cookRemoveError.status = rerr.status;
            callback(cookRemoveError);
        } else {
            callback(null, consts.DELETE_COOK_SUCCESS);
        }
    });
}

function updateCook(cookObj, cookId, callback) {
    Cook.findById(cookId).exec(function(ferr, findCook) {
        if (ferr) {
            callback(ferr);
        } else {
            if (!findCook) {
                var error = new Error(consts.COULD_NOT_GET_COOK_INFO);
                error.status = 424;
                callback(error, null);
            } else {
                var paramsToChange = null;
                var errors = null;
                paramsToChange = Object.keys(cookObj);
                
                paramsToChange.forEach(function (param) {
                    findCook[param] = cookObj[param];
                });

                findCook.save(function (saveCookErr, savedCook) {
                    if (saveCookErr) {
                        callback(saveCookErr, null);
                    } else {
                        callback(null, savedCook);
                    }
                });
            }
        }
    });
}

function addCook(cook, callback) {
    cook.save(function (serr, savedCook) {
        if (serr) {
            var cookAddError = new Error(consts.FAILED_SAVE_COOK);
            cookAddError.status = serr.status;
            callback(cookAddError);
        } else {
            callback(null, savedCook);
        }
    })
}

function getCooksBySearchInfo(cookSearchParams, limit, page, sortField, sortDir, callback) {
    var query = Cook.find(cookSearchParams).sort({'cookDate' : 1});

    var sortDict = {};
    if (sortDir && sortField && sortDir != 'undefined' && sortField != 'undefined') {
        var sortDirection = 0;

        if (sortDir.search('asc') == 0)
            sortDirection = 1;
        else if (sortDir.search('desc') == 0)
            sortDirection = -1;

        switch (parseInt(sortField)) {
            case 2:
                sortDict.cookDate = sortDirection;
                break;
            case 3:
                break;
            case 4:
                break;
            default:
                break;
        }

        query = Cook.find(cookSearchParams).sort(sortDict);
    }

    if (limit)
        query.limit(limit);

    if (page)
        query.skip(limit * (page - 1));

    query.lean().exec(function (lerr, cooks) {
        if (lerr) {
            var cookGetError = new Error(consts.COULD_NOT_GET_COOK_INFO);
            cookGetError.status = 427;
            callback(cookGetError);
        } else {
            callback(null, cooks);
        }
    });
}

exports.validate = validate;
exports.countTotal = countTotal;
exports.createCook = createCook;
exports.getCookById = getCookById;
exports.getCooksBySearchInfo = getCooksBySearchInfo;
exports.removeCookById = removeCookById;
exports.updateCook = updateCook;