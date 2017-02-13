"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    work_assign_infos = require("../../app/controllers/work_assign_infos");

router.get('/count?', work_assign_infos.countTotal);
router.get('/?', work_assign_infos.search);
router.get('/:workAssignId', work_assign_infos.info);
router.post('/', work_assign_infos.create);
router.put('/:workAssignId', work_assign_infos.updateinfo);
router.delete('/:workAssignId', work_assign_infos.delete);

module.exports = router;