const Interview = require('../models/Interview');
const Application = require('../models/Application');

// @desc Schedule an interview (Employer only)
const scheduleInterview = async (req, res) => {
    try {
        const { applicationId, scheduledAt, mode, location, interviewer } = req.body;

        const application = await Application.findById(applicationId).populate('job');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Ensure employer owns the job
        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to schedule interview for this application' });
        }

        const interview = await Interview.create({
            application: applicationId,
            scheduledAt,
            mode,
            location,
            interviewer: interviewer || req.user._id
        });

        res.status(201).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update interview details/status (Employer only)
const updateInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await Interview.findById(id).populate({
            path: 'application',
            populate: { path: 'job' }
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Ensure employer owns the job
        if (interview.application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this interview' });
        }

        Object.assign(interview, req.body); // Only updates provided fields
        const updated = await interview.save();

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Cancel an interview (Employer only)
const cancelInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await Interview.findById(id).populate({
            path: 'application',
            populate: { path: 'job' }
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        if (interview.application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this interview' });
        }

        interview.status = 'cancelled';
        await interview.save();

        res.status(200).json({ message: 'Interview cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get details of a specific interview
const getInterviewDetails = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
            .populate({
                path: 'application',
                populate: [
                    { path: 'candidate', select: 'name email' },
                    { path: 'job', select: 'title' }
                ]
            })
            .populate('interviewer', 'name email');

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // If candidate is requesting, ensure they own the application
        if (req.user.role === 'candidate' &&
            interview.application.candidate.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this interview' });
        }

        // If employer is requesting, ensure they own the job
        if (req.user.role === 'employer' &&
            interview.application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this interview' });
        }

        res.status(200).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Candidate: View all my scheduled interviews
const getMyInterviews = async (req, res) => {
    try {
        if (req.user.role !== 'candidate') {
            return res.status(403).json({ message: 'Only candidates can view their interviews' });
        }

        const applications = await Application.find({ candidate: req.user._id });
        const appIds = applications.map(a => a._id);

        const interviews = await Interview.find({ application: { $in: appIds } })
            .populate({
                path: 'application',
                populate: { path: 'job', select: 'title' }
            })
            .populate('interviewer', 'name email');

        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    scheduleInterview,
    updateInterview,
    cancelInterview,
    getInterviewDetails,
    getMyInterviews
};
