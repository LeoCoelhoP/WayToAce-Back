const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
	institutionName: { type: String, required: true },
	institutionAbbreviatedName: { type: String, required: true },
	examName: {
		type: String,
		required: true,
	},
	pdfSrc: {
		type: Array,
		required: true,
	},
	questions: {
		type: Array,
		required: true,
	},
	downloads: {
		type: Number,
		default: 0,
	},
});

module.exports = new mongoose.model('Exam', examSchema);
