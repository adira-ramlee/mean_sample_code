"use strict";

var mongoose = require("mongoose"),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    consts = require("../../libs/consts"),
    log = require('../../libs/log')(module);

function webLogin(loggedinUser, sessionsCollection, req, res, next, callback) {
    req.session.userId = loggedinUser._id;

    var userObj = loggedinUser.toObject();
    var returnData = {
        id : userObj._id.toString(),
        loginName : userObj.loginName.toString(),
        userName : userObj.userName.toString(),
        roleId : userObj.role.id.toString(),
        roleName : userObj.role.name.toString(),
        //avatarUrl : userObj.avatarUrl.toString()
    };  

    callback(null, returnData);
}

function loginUser(loggedinUser, os, req, res, next, callback) {
    var sessionsCollection = mongoose.connection.db.collection("sessions");

    var userId = "'userId':'" + loggedinUser._id.toString() + "'";

    sessionsCollection.remove({"session": {$regex : userId}}, function (err) {
        if (err) {
            callback(err);
        } else {
            webLogin(loggedinUser, sessionsCollection, req, res, next, callback);
        }
    });
}

module.exports.loginUser = loginUser;
