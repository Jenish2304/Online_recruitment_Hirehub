const Test = require('../models/Test');
const Job = require('../models/Job');

// @desc Create a screening test for a job (Employer only)
const createTest = async (req, res) => {
    try {
        const { job, questions, duration } = req.body;

        // Check if the job belongs to the logged-in employer
        const jobData = await Job.findById(job);
        if (!jobData || jobData.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to create test for this job' });
        }

        const test = await Test.create({
            job,
            questions,
            duration
        });

        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get the test for a job (for candidates who applied)
const getTestByJobId = async (req, res) => {
    try {
        const { jobId } = req.params;
        const test = await Test.findOne({ job: jobId });

        if (!test) {
            return res.status(404).json({ message: 'Test not found for this job' });
        }

        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update test questions (Employer only)
const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { questions, duration } = req.body;

        const test = await Test.findById(id).populate('job');
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if logged-in employer owns the job
        if (test.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this test' });
        }

        test.questions = questions || test.questions;
        test.duration = duration || test.duration;
        const updatedTest = await test.save();

        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete a test (Employer only)
const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findById(id).populate('job');

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        if (test.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this test' });
        }

        await test.deleteOne();
        res.status(200).json({ message: 'Test deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTest,
    getTestByJobId,
    updateTest,
    deleteTest
};
