"use strict";

var userDAO = require("../dao/user-dao"),
    log = require('../../libs/log')(module),
    consts = require("../../libs/consts");

module.exports = function(req, res, next, callback) {
    var incorrectSessionErr = new Error(consts.INCORRECT_SESSION);
    incorrectSessionErr.status = 403;

    if (!req.session.userId) {
        callback(incorrectSessionErr, null);
    } else {
        if (req.session.userId) {
            userDAO.getUserById(req.session.userId, function (findUserErr, findUser) {
                if (findUserErr) {
                    callback(findUserErr, null);
                } else {
                    callback(null, findUser);
                }
            });
        }
    }
};