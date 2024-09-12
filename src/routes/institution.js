const router = require('express').Router();
const institutionControler = require('../controllers/institution');
const catchAsync = require('../utils/catchAsync');

// Todo Get Institution
router.get('/', catchAsync(institutionControler.getInstitution));
// router.post('/create', catchAsync(institutionControler.createInstituition));

module.exports = router;
