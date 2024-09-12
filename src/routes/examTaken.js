const router = require('express').Router();
const examTakenController = require('../controllers/examTaken');
const catchAsync = require('../utils/catchAsync');

router.post('/getUserResults', catchAsync(examTakenController.getUserResults));
router.post('/createOrUpdate', catchAsync(examTakenController.createOrUpdate));

module.exports = router;
