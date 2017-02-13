"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../libs/utils"),
    config = require("../../config"),
    cleans = require("../../app/controllers/cleans");

router.get('/count?', cleans.countTotal);
router.get('/?', cleans.search);
router.get('/:cleanId', cleans.info);
router.post('/', cleans.create);
router.put('/:cleanId', cleans.updateinfo);
router.delete('/:cleanId', cleans.delete);

module.exports = router;