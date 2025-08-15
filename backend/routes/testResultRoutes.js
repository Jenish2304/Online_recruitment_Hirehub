const express = require('express');
const {
    submitTest,
    getMyTestResults,
    getTestResultsForApplication
} = require('../controllers/testResultController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Candidate only
router.post('/', protect, authorizeRoles('candidate'), submitTest);
router.get('/my-results', protect, authorizeRoles('candidate'), getMyTestResults);

// Employer only
router.get('/application/:applicationId', protect, getTestResultsForApplication);

module.exports = router;
