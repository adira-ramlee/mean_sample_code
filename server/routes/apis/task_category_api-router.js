"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    task_categories = require("../../app/controllers/task_categories");

router.get('/?', task_categories.search);
router.get('/:taskCateId', task_categories.info);
router.post('/', task_categories.create);
router.put('/:taskCateId', task_categories.updateinfo);
router.delete('/:taskCateId', task_categories.delete);

module.exports = router;