const express = require('express');
const {
    applyForJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus
} = require('../controllers/applicationController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Candidate applies for a job (with resume upload)
router.post('/:jobId', protect, authorizeRoles('candidate'), upload.single('resume'), applyForJob);

// Candidate views own applications
router.get('/my', protect, authorizeRoles('candidate'), getMyApplications);

// Employer views applications for a job
router.get('/job/:jobId', protect, authorizeRoles('employer'), getApplicationsForJob);

// Employer updates application status
router.put('/:applicationId/status', protect, authorizeRoles('employer'), updateApplicationStatus);

module.exports = router;
