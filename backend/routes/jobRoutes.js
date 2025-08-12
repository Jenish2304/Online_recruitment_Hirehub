const express = require('express');
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getEmployerJobs
} = require('../controllers/jobController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Employer-only routes
router.post('/', protect, authorizeRoles('employer'), createJob);
router.get('/employer/mine', protect, authorizeRoles('employer'), getEmployerJobs);
router.put('/:id', protect, authorizeRoles('employer'), updateJob);
router.delete('/:id', protect, authorizeRoles('employer'), deleteJob);


module.exports = router;
