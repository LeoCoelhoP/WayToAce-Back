const router = require('express').Router();
const authRoute = require('./auth.js');
const examRoute = require('./exam.js');
const examTakenRoute = require('./examTaken.js');
const InstitutionRoute = require('./institution.js');

router.use('/auth', authRoute);
router.use('/exams', examRoute);
router.use('/examTaken', examTakenRoute);
router.use('/institutions', InstitutionRoute);

module.exports = router;
