const mongoose = require('mongoose');
const testResultSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: String,
    correct: Boolean,
  }],
  score: Number,
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);
