const mongoose = require('mongoose');
const testSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String,
    
  }],
  duration: Number, 
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
