"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    cooks = require("../../app/controllers/cooks");

router.get('/count?', cooks.countTotal);
router.get('/?', cooks.search);
router.get('/:cookId', cooks.info);
router.post('/', cooks.create);
router.put('/:cookId', cooks.updateinfo);
router.delete('/:cookId', cooks.delete);

module.exports = router;