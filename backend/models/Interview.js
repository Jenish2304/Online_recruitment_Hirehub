const mongoose = require('mongoose');
const interviewSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  scheduledAt: Date,
  mode: { type: String, enum: ['online', 'offline'], default: 'online' },
  interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: String, 
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  feedback: String,
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
