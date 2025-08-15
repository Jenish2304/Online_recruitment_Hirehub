const express = require('express');
const {
    scheduleInterview,
    updateInterview,
    cancelInterview,
    getInterviewDetails,
    getMyInterviews
} = require('../controllers/interviewController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Employer only
router.post('/', protect, authorizeRoles('employer'), scheduleInterview);
router.put('/:id', protect, authorizeRoles('employer'), updateInterview);
router.delete('/:id', protect, authorizeRoles('employer'), cancelInterview);

// Public for both employer & candidate (with access checks inside)
router.get('/:id', protect, getInterviewDetails);

// Candidate only
router.get('/my/interviews', protect, authorizeRoles('candidate'), getMyInterviews);

module.exports = router;
