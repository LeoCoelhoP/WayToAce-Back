const router = require('express').Router();
const examRoute = require('./exam.js');
const InstitutionRoute = require('./institution.js');

router.use('/exams', examRoute);
router.use('/institutions', InstitutionRoute);

module.exports = router;
