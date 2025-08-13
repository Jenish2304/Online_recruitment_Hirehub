const TestResult = require('../models/TestResult');
const Test = require('../models/Test');
const Application = require('../models/Application');

// @desc Submit answers for a test (Candidate only)
const submitTest = async (req, res) => {
    try {
        const { applicationId, answers } = req.body;

        // Find application
        const application = await Application.findById(applicationId).populate('job');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Ensure candidate is the one who owns the application
        if (application.candidate.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to submit this test' });
        }

        // Find test for the job
        const test = await Test.findOne({ job: application.job._id });
        if (!test) {
            return res.status(404).json({ message: 'No test found for this job' });
        }

        // Calculate score
        let score = 0;
        const evaluatedAnswers = answers.map(ans => {
            const question = test.questions.id(ans.questionId);
            const correct = question && question.correctAnswer === ans.answer;
            if (correct) score++;
            return { ...ans, correct };
        });

        const testResult = await TestResult.create({
            application: applicationId,
            answers: evaluatedAnswers,
            score,
            completedAt: new Date()
        });

        res.status(201).json(testResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc View own test results (Candidate only)
const getMyTestResults = async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user._id });
        const appIds = applications.map(a => a._id);

        const results = await TestResult.find({ application: { $in: appIds } })
            .populate({
                path: 'application',
                populate: { path: 'job', select: 'title' }
            });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc View candidate’s test results for an application (Employer only)
const getTestResultsForApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId).populate('job');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Ensure employer owns the job
        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view results for this application' });
        }

        const result = await TestResult.findOne({ application: applicationId })
            .populate({
                path: 'application',
                populate: [
                    { path: 'candidate', select: 'name email' },
                    { path: 'job', select: 'title' }
                ]
            });

        if (!result) {
            return res.status(404).json({ message: 'No test result found for this application' });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitTest,
    getMyTestResults,
    getTestResultsForApplication
};
