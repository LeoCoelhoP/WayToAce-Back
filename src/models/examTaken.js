const mongoose = require('mongoose');

const examTakenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  userAnswerKey: {
    type: Array,
    required: true,
    default: [],
  },
  userTimer: {
    type: Number,
    required: true,
  },
  userResult: {
    type: Number,
    required: true,
    default: {},
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = new mongoose.model('ExamTaken', examTakenSchema);
