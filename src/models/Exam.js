const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instituition' },
  institutionAbbreviatedName: { type: String, required: true },
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
  durationInMinutes: { type: Number },
});

module.exports = new mongoose.model('Exam', examSchema);
