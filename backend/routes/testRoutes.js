const express = require('express');
const {
    createTest,
    getTestByJobId,
    updateTest,
    deleteTest
} = require('../controllers/testController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Employer only
router.post('/', protect, authorizeRoles('employer'), createTest);
router.put('/:id', protect, authorizeRoles('employer'), updateTest);
router.delete('/:id', protect, authorizeRoles('employer'), deleteTest);

// Candidate & Employer (get test by job id)
router.get('/job/:jobId',  getTestByJobId);

module.exports = router;
