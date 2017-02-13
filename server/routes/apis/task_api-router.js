"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    tasks = require("../../app/controllers/tasks");

router.get('/count?', tasks.countTotal);
router.get('/?', tasks.search);
router.get('/searchForWorker/:userId?', tasks.searchForWorker);
router.get('/searchForWorker/count/:userId?', tasks.workHistoryCountForWorker);
router.get('/mainFirstInfo', tasks.getMainFirstInfo);
router.get('/:taskId', tasks.info);
router.get('/:taskId/workHistory', tasks.getWorkHistory);
router.get('/:taskId/workHistory/count', tasks.getWorkHistoryCount);
router.post('/', tasks.create);
router.put('/:taskId', tasks.updateinfo);
router.delete('/:taskId', tasks.delete);

module.exports = router;