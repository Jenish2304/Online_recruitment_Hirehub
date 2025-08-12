const Job = require('../models/Job');

// @desc Create a new job (Employer only)
const createJob = async (req, res) => {
    try {
        const { title, description, requirements, location, salaryRange, applicationDeadline } = req.body;

        const job = await Job.create({
            employer: req.user._id,
            title,
            description,
            requirements,
            location,
            salaryRange,
            applicationDeadline
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all jobs (Public / Candidate browsing)
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('employer', 'name companyName');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc Get job by ID (Public)
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employer', 'name companyName');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update a job (Employer only)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        const { title, description, requirements, location, salaryRange, applicationDeadline } = req.body;

        job.title = title || job.title;
        job.description = description || job.description;
        job.requirements = requirements || job.requirements;
        job.location = location || job.location;
        job.salaryRange = salaryRange || job.salaryRange;
        job.applicationDeadline = applicationDeadline || job.applicationDeadline;

        const updatedJob = await job.save();
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete a job (Employer only)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all jobs posted by logged-in employer
const getEmployerJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getEmployerJobs
};
