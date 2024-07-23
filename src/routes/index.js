const router = require('express').Router();
const examRoute = require('./exam.js');

router.use('/exams', examRoute);

module.exports = router;
