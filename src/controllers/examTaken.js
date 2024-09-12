const ExamTaken = require('../models/examTaken');
const Exam = require('../models/Exam');
const User = require('../models/User');

async function getUserResults(req, res) {
  const { userId } = req.body;
  if (!userId) throw Error('Please Provide A Valid User Id.');

  const exams = await ExamTaken.find({ user: userId })
    .populate('exam')
    .sort({ createdAt: -1 });
  console.log(exams);
  return res.status(200).json({ status: 'success', exams });
}

async function createOrUpdate(req, res) {
  try {
    const { userId, exam, answerKey, userTimer } = req.body;
    if (!userId) throw Error('Please Provide A Valid User Id.');

    if (!answerKey) throw Error('Please Provide A Valid Answer Key.');

    if (!userTimer) throw Error('Please Provide A Valid User Timer.');

    if (!exam) throw Error('Please Provide A Valid Exam.');

    const { _id: examId, questions } = exam;
    const examDoc = await Exam.findById(examId);
    if (!examDoc) throw Error('Please Provide A Valid Exam.');

    const examAnswerKey = questions.map((question) => {
      const answer = question.answer;
      const questionIndex = question.index;
      return { answer, questionIndex };
    });

    const correctAnswers = [];
    const wrongAnswers = [];

    examAnswerKey.forEach((question, index) => {
      if (answerKey[index].answer === question.answer)
        correctAnswers.push(examDoc.questions[index]);
      else wrongAnswers.push(examDoc.questions[index]);
    });
    const overall = Number(
      (correctAnswers?.length * 100) / examDoc.questions.length
    ).toFixed(2);

    await ExamTaken.findOneAndDelete({
      user: userId,
      exam: examId,
    });

    const newExamTaken = await new ExamTaken({
      user: userId,
      exam: examId,
      userAnswerKey: answerKey,
      userTimer,
      userResult: overall,
    }).save();

    const user = await User.findById(userId);
    res.status(200).json({ message: 'Finished Exam Successfully!', user });
  } catch (error) {
    throw Error(error.message);
  }
}

module.exports = { createOrUpdate, getUserResults };
