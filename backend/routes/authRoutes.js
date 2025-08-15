
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();


router.post('/register', upload.single('resume'), registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/logout', logoutUser); 

module.exports = router;
