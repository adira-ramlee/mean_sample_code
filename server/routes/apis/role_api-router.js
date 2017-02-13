"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    roles = require("../../app/controllers/roles");

router.get('/count?', roles.countTotal);
router.get('/?', roles.search);
router.get('/:roleId', roles.info);
router.post('/', roles.create);
router.put('/:roleId', roles.updateinfo);
router.delete('/:roleId', roles.delete);

module.exports = router;