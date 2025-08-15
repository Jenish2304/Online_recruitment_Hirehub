// // controllers/applicationController.js
// const Application = require('../models/Application');
// const Job = require('../models/Job');

// // @desc Apply for a job (Candidate only)
// const applyForJob = async (req, res) => {
//     try {
//         const { jobId } = req.params;

//         const job = await Job.findById(jobId);
//         if (!job) {
//             return res.status(404).json({ message: 'Job not found' });
//         }

//         const existingApplication = await Application.findOne({
//             candidate: req.user._id,
//             job: jobId
//         });

//         if (existingApplication) {
//             return res.status(400).json({ message: 'You have already applied for this job' });
//         }

//         const resumePath = req.file ? req.file.path : req.user.resume;

//         const application = await Application.create({
//             candidate: req.user._id,
//             job: jobId,
//             resume: resumePath
//         });

//         // Update candidate's resume in profile if uploaded
//         if (req.file) {
//             req.user.resume = resumePath;
//             await req.user.save();
//         }

//         res.status(201).json(application);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc Get logged-in candidate's applications
// const getMyApplications = async (req, res) => {
//     try {
//         const applications = await Application.find({ candidate: req.user._id })
//             .populate('job', 'title description location');
//         res.status(200).json(applications);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc Get applications for a specific job (Employer only)
// const getApplicationsForJob = async (req, res) => {
//     try {
//         const { jobId } = req.params;

//         const job = await Job.findById(jobId);
//         if (!job) {
//             return res.status(404).json({ message: 'Job not found' });
//         }

//         if (job.employer.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: 'Not authorized to view applications for this job' });
//         }

//         const applications = await Application.find({ job: jobId })
//             .populate('candidate', 'name email resume skills experience');

//         res.status(200).json(applications);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc Update application status (Employer only)
// const updateApplicationStatus = async (req, res) => {
//     try {
//         const { applicationId } = req.params;
//         const { status } = req.body;

//         const application = await Application.findById(applicationId).populate('job');

//         if (!application) {
//             return res.status(404).json({ message: 'Application not found' });
//         }

//         if (application.job.employer.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: 'Not authorized to update this application' });
//         }

//         application.status = status;
//         await application.save();

//         res.status(200).json(application);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = {
//     applyForJob,
//     getMyApplications,
//     getApplicationsForJob,
//     updateApplicationStatus
// };


const Application = require('../models/Application');
const Job = require('../models/Job');
const path = require('path');

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existingApplication = await Application.findOne({
      candidate: req.user._id,
      job: jobId
    });
    if (existingApplication) return res.status(400).json({ message: 'You have already applied for this job' });

    let resumePath = req.user.resume;
    if (req.file) {
      // Always store as forward slashes for frontend URLs
      resumePath = `uploads/resumes/${req.file.filename}`;
      req.user.resume = resumePath;
      await req.user.save();
    }

    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
      resume: resumePath
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employer's applications
const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email resume skills experience');

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications: async (req, res) => {
    try {
      const applications = await Application.find({ candidate: req.user._id })
        .populate('job', 'title description location');
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getApplicationsForJob,
  updateApplicationStatus
};
