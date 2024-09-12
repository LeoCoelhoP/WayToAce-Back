const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  userExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamTaken' }],
  googleId: {
    type: String,
    unique: false,
  },
  azureId: {
    type: String,
    unique: false,
  },
});

module.exports = new mongoose.model('User', userSchema);
