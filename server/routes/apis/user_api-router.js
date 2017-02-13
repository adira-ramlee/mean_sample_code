"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    users = require("../../app/controllers/users");

router.get('/count?', users.countTotal);
router.get('/?', users.search);
router.get('/:userId', users.profile);
router.post('/signup', users.signup);
router.post('/login', users.login);
router.post('/logout', users.logout);
router.post('/assets/userprofile', users.setProfilePicture);
router.delete('/:userId', users.delete);
router.put('/:userId', users.updateProfile);
router.put('/updatePassword/:userId', users.updatePassword);
router.post('/multiDel', users.multiDelete);

module.exports = router;