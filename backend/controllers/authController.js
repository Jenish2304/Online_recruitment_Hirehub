const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper to send token as cookie
const sendTokenResponse = (user, res) => {
    const token = generateToken(user.id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    });
};

// @desc Register user
const registerUser = async (req, res) => {
    try {
        const { 
            name, email, password, role, skills, experience, companyName, companyDetails 
        } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // If a file is uploaded, store its relative path
        let resumePath = null;
        if (req.file) {
            resumePath = path.join('uploads', 'resumes', req.file.filename);
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role === 'employer' ? 'employer' : 'candidate',
            resume: resumePath, // store file path, not binary
            skills,
            experience,
            companyName,
            companyDetails
        });

        sendTokenResponse(user, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            sendTokenResponse(user, res);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get logged-in user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc Update logged-in user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.resume = req.body.resume || user.resume;
        user.skills = req.body.skills || user.skills;
        user.experience = req.body.experience || user.experience;
        user.companyName = req.body.companyName || user.companyName;
        user.companyDetails = req.body.companyDetails || user.companyDetails;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        sendTokenResponse(updatedUser, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });
    res.json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, getProfile, updateUserProfile, logoutUser };
