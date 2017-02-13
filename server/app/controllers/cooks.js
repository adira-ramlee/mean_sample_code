"use strict";

var cookDAO = require('../../core/dao/cook-dao'),
    utils = require('../../libs/utils'),
    checkAuth = require("../../core/user/check-auth"),
    consts = require("../../libs/consts"),
    log = require('../../libs/log')(module);

exports.countTotal = function(req, res, next) {
    checkAuth(req, res, next, function (findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var searchKeyword = req.query.searchKeyword;

            cookDAO.countTotal(searchKeyword, function(err, cookCount) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(cookCount, res, next);
                }
            });
        }
    });
}

exports.search = function(req, res, next) {
    checkAuth(req, res, next, function (findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var sortField = req.query.sortField;
            var sortDir = req.query.sortDir;
            var limit = req.query.limit;
            var page = req.query.page;
            var keyword = req.query.searchKeyword;

            var dict = {};
            if (keyword) {
                dict['$or'] = [
                    { "cookDate" : keyword },
                    { "duty.name" : new RegExp(keyword.toString(), "i") },
                    { "directions" : new RegExp(keyword.toString(), "i") }
                ];
            }

            cookDAO.getCooksBySearchInfo(dict, limit, page, sortField, sortDir, function (err, findCooks) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(findCooks, res, next);
                }
            });
        }
    });
}

exports.info = function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var cookId = req.params.cookId;
            if (!cookId) {
                var err = new Error(consts.NOT_EXIST_COOK_ID);
                err.status = 422;
                return next(err);
            } else {
                cookDAO.getCookById(cookId, function (err, findCook) {
                    if (err) {
                        return next(err);
                    } else {
                        return utils.successResponse(findCook, res, next);
                    }
                });
            }
        }
    });
}

exports.create = function (req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var cook = req.body.cook;
            if (!cook) {
                var err = new Error(consts.NOT_EXIST_COOK_ID);
                err.status = 422;
                return next(err);
            }

            cook.realCookAt = cook.cookDate;
            cookDAO.validate(cook, function (validateErr, status) {
                if (validateErr) {
                    return next(validateErr);
                } else {
                    cookDAO.createCook(cook, function (cerr, savedCook) {
                        if (cerr) {
                            return next(cerr);
                        } else {
                            return utils.successResponse(savedCook, res, null);
                        }
                    });
                }
            });
        }
    });
}

exports.updateinfo = function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var cookId = req.params.cookId;
            var cook = req.body.cook;

            cookDAO.validate(cook, function(verr) {
                if (verr) {
                    return next(verr);
                } else {
                    cookDAO.updateCook(cook, cookId, function(uerr, savedCook) {
                        if (uerr) {
                            return next(uerr);
                        } else {
                            return utils.successResponse(savedCook, res, null);
                        }
                    });
                }
            });
        }
    });
}

exports.delete = function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var cookId = req.params.cookId;

            cookDAO.removeCookById(cookId, function(err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
        }
    });
}