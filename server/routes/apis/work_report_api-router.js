"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    work_reports = require("../../app/controllers/work_reports");

router.get('/count?', work_reports.countTotal);
router.get('/?', work_reports.search);
router.get('/user/:userId?', work_reports.searchForUser);
router.get('/workPlanReport/:workPlanReportId', work_reports.info);
router.post('/', work_reports.create);
router.put('/:workPlanReportId', work_reports.updateinfo);
router.delete('/:workPlanReportId', work_reports.delete);

module.exports = router;