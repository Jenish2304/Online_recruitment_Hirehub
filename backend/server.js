
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const connectDB = require('./config/db');
const path = require('path');


dotenv.config();


const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true, // allow cookies
}));
app.use(cookieParser()); 
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes')); 
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/test-results', require('./routes/testResultRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));


// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app
