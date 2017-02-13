"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    work_assigns = require("../../app/controllers/work_assigns");

router.get('/count?', work_assigns.countTotal);
router.get('/?', work_assigns.search);
router.get('/:workAssignId', work_assigns.info);
router.post('/', work_assigns.create);
router.put('/:workAssignId', work_assigns.updateinfo);
router.delete('/:workAssignId', work_assigns.delete);

module.exports = router;