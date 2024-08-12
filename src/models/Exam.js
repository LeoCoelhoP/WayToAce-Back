const mongoose = require('mongoose');
const Institution = require('./Institution');

const examSchema = new mongoose.Schema({
	institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Instituition' },
	examName: {
		type: String,
		required: true,
	},
	imageSrc: { type: String, required: true },
	pdfSrc: {
		type: Array,
		required: true,
	},
	questions: {
		type: Array,
		required: true,
	},
	interactions: {
		type: Number,
		default: 0,
	},
	display: {
		type: Boolean,
		default: true,
	},
});

module.exports = new mongoose.model('Exam', examSchema);
