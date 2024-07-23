const Exam = require('../models/Exam');

async function getExams(req, res) {
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
		default:
			exams = await Exam.find({}).sort({ downloads: -1 });
	}
	return res.status(200).json({ exams });
}

async function createExam(req, res) {
	try {
		const {
			institutionName,
			institutionAbbreviatedName,
			examName,
			pdfSrc,
			questions,
			password,
		} = req.body;

		if (!password || password !== process.env.CREATE_EXAM_PASSWORD)
			throw Error('Please Provide A Valid Password.');
		if (!institutionName) throw Error('Please Provide An Institution Name.');
		if (!institutionAbbreviatedName)
			throw Error('Please Provide An Institution Abbreviated Name.');
		if (!examName) throw Error('Please Provide An Exam Name.');
		if (!pdfSrc) throw Error('Please Provide A Valid Pdf Src.');
		if (!questions || !Array.isArray(questions) || questions.length === 0)
			throw Error('Please Provide Valid Questions.');

		const newExam = await new Exam({
			institutionName,
			institutionAbbreviatedName,
			examName,
			pdfSrc,
			questions,
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
