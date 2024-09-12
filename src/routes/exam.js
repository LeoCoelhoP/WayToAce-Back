const router = require('express').Router();
const examController = require('../controllers/exam');
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(examController.getExams));
// router.post('/create', catchAsync(examController.createExam));

module.exports = router;
