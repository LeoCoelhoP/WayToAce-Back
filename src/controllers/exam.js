const Exam = require('../models/Exam');
const Institution = require('../models/Institution');

async function getExams(req, res) {
  try {
    const { type } = req.body;

    let exams;
    switch (type) {
      case 'all':
        exams = await Exam.find({});
        break;
      case 'single':
        const { id } = req.body;
        if (!id) throw Error('Please Provide A Valid Exam Id.');
        exams = await Exam.find({ _id: id });
        break;
      case 'query':
        const { query } = req.body;
        if (!query) throw Error('Please Provide A Valid Query.');
        exams = await Exam.find({ examName: { $regex: query, $options: 'i' } });
        break;
      default:
        exams = await Exam.find({}).sort({ downloads: -1 });
    }
    return res.status(200).json({ exams });
  } catch (error) {
    throw Error(error.message);
  }
}

async function createExam(req, res) {
  try {
    const {
      institutionId,
      institutionAbbreviatedName,
      imageSrc,
      examName,
      durationInMinutes,
      pdfSrc,
      questions,
      password,
    } = req.body;

    // if (!password || password !== process.env.CREATE_EXAM_PASSWORD)
    //   throw Error('Please Provide A Valid Password.');
    if (!institutionAbbreviatedName)
      throw Error('Please Provide A Valid Institution Name.');

    if (!imageSrc) throw Error('Please Provide A Valid Image Src.');

    if (!durationInMinutes)
      throw Error('Please Provide A Valid Exam Duration.');

    if (!institutionId || !(await Institution.findById(institutionId)))
      throw Error('Please Provide A Valid Institution Id.');

    if (!examName) throw Error('Please Provide An Exam Name.');
    if (await Exam.findOne({ examName }))
      throw Error('Exam Name Already Taken.');

    if (!pdfSrc) throw Error('Please Provide A Valid Pdf Src.');
    if (!questions || !Array.isArray(questions) || questions.length === 0)
      throw Error('Please Provide Valid Questions.');

    const newExam = await new Exam({
      institutionId,
      institutionAbbreviatedName,
      imageSrc,
      examName,
      pdfSrc,
      questions,
    });

    await Institution.findByIdAndUpdate(institutionId, {
      $push: { exams: newExam.id },
    });
    await newExam.save();

    return res.json({
      status: 'Success',
      message: 'Exam Created Successfully!',
      data: newExam,
    });
  } catch (error) {
    throw Error(error.message);
  }
}

module.exports = { createExam, getExams };
