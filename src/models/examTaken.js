const mongoose = require('mongoose');

const examTakenSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	exam: { type: mongoose.Schema.Types.ObjectId, ref: 'examTaken' },
	userAnswerKey: {
		type: Array,
		default: [],
	},
	userTimer: {
		type: Number,
	},
	userResult: {
		type: Number,
	},
});

module.exports = new mongoose.model('ExamTaken', examTakenSchema);
