const Institution = require('../models/Institution');

async function getInstitution(req, res) {
  try {
    const { type } = req.body;

    let institutions;
    switch (type) {
      case 'all':
        institutions = await Institution.find({});
        break;
      case 'single':
        const { id } = req.body;
        if (!id) throw Error('Please Provide A Valid Institution Id.');
        institutions = await Institution.find({ _id: id });
        break;
      case 'query':
        const { query } = req.body;
        if (!query) throw Error('Please Provide A Valid Query.');
        institutions = await Institution.find({
          InstitutionName: { $regex: query, $options: 'i' },
        });
        break;
      default:
        institutions = await Institution.find({})
          .populate('exams')
          .sort({ interactions: -1 })
          .exec();
    }
    console.log(institutions);
    return res.status(200).json({ institutions });
  } catch (error) {
    console.error(error);
    throw Error(error.message);
  }
}

async function createInstituition(req, res) {
  try {
    const { institutionName, institutionAbbreviatedName, password } = req.body;

    if (!password || password !== process.env.CREATE_INSTITUTION_PASSWORD)
      throw Error('Please Provide A Valid Password.');
    if (!institutionName) throw Error('Please Provide An Institution Name.');
    if (!institutionAbbreviatedName)
      throw Error('Please Provide An Institution Abbreviated Name.');

    const newInstitution = await new Institution({
      institutionName,
      institutionAbbreviatedName,
    });

    await newInstitution.save();

    return res.json({
      status: 'Success',
      message: 'Institution Created Successfully!',
      data: newInstitution,
    });
  } catch (error) {
    throw Error(error.message);
  }
}

module.exports = { createInstituition, getInstitution };
