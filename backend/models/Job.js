const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  location: String,
  salaryRange: String,
  createdAt: { type: Date, default: Date.now },
  applicationDeadline: Date,
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
