
const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { 
    type: String, 
    enum: ['applied', 'screening', 'interview_scheduled', 'rejected', 'hired'], 
    default: 'applied' 
  },
  appliedAt: { type: Date, default: Date.now },
  testResult: { type: mongoose.Schema.Types.ObjectId, ref: 'TestResult' }, // Link to test result
  interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }, // Link to interview
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
