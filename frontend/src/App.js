import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Footer from './components/Footer';
import Home from './pages/Home';
import EmployerDashboard from './pages/employerDashboard';
import ManageJobs from './pages/ManageJobs';
import ManageApplications from './pages/ManageApplications';
import ManageTests from './pages/ManageTests';
import ManageInterviews from "./pages/ManageInterviews";
import CandidateDashboard from './pages/CandidateDashboard';
import JobListing from './pages/JobListing';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import TakeTest from './pages/TakeTest';
import MyInterviews from './pages/MyInterviews';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/manage-jobs" element={<ManageJobs />} />
        <Route path="/manage-applications" element={<ManageApplications />} />
        <Route path="/manage-tests" element={<ManageTests />} />
        <Route path="/manage-interviews" element={<ManageInterviews />} />
        <Route path="/jobs" element={<JobListing />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/applications/:applicationId/take-test/:jobId" element={<TakeTest />} />
        <Route path="/my/interviews" element={<MyInterviews />} />



      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
