const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	userExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamTaken' }],
});

module.exports = new mongoose.model('UserSchema', userSchema);
