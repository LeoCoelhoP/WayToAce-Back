const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
	institutionName: { type: String, required: true },
	institutionAbbreviatedName: { type: String, required: true },
	exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
	interactions: {
		type: Number,
		default: 0,
	},
});

module.exports = new mongoose.model('Institution', institutionSchema);
