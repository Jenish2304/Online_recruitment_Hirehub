import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import ManageJobs from './ManageJobs';
import PostJob from './PostJob';
import ManageApplications from './ManageApplications';
import ManageTests from './ManageTests';
import ManageInterviews from "./ManageInterviews";
// At the top of your React component file
import {
  BriefcaseIcon,
  PlusIcon,
  FileTextIcon,
  CalendarIcon,
  UsersIcon,
  VideoIcon,
  MapPinIcon,
  DollarSignIcon,
  ClockIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  UserIcon,
  MailIcon,
  DownloadIcon,
  CheckCircleIcon,
  XCircleIcon,
  Edit,
  XCircle,
  Video,
} from "lucide-react";

import axiosInstance from "../axiosConfig";
const EmployerDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salaryRange: '',
    applicationDeadline: ''
  });

  const [testForm, setTestForm] = useState({
    job: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
    duration: 60
  });

  const [interviewForm, setInterviewForm] = useState({
    applicationId: '',
    scheduledAt: '',
    mode: 'online',
    location: '',
    interviewer: ''
  });

  // Fetch employer's jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/jobs/employer/mine');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications for a specific job
  const fetchApplicationsForJob = async (jobId) => {
    try {
      const response = await axiosInstance.get(`/api/applications/job/${jobId}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Create new job

const handleCreateJob = async () => {
  try {
    if (!token) {
      console.error("No auth token found. Please log in.");
      return;
    }

    await axiosInstance.post('/api/jobs', jobForm, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setJobForm({
      title: '',
      description: '',
      requirements: '',
      location: '',
      salaryRange: '',
      applicationDeadline: ''
    });

    fetchJobs();
    setActiveTab('manage-jobs');

  } catch (error) {
    if (error.response) {
      console.error('Error creating job:', error.response.data);
    } else {
      console.error('Error creating job:', error.message);
    }
  }
};



  // Update application status
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axiosInstance.put(`/api/applications/${applicationId}/status`, { status });
      if (selectedJob) {
        fetchApplicationsForJob(selectedJob);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Schedule interview
  const handleScheduleInterview = async () => {
    try {
      await axiosInstance.post('/api/interviews', interviewForm);
      setInterviewForm({
        applicationId: '',
        scheduledAt: '',
        mode: 'online',
        location: '',
        interviewer: ''
      });
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BriefcaseIcon },
    { id: 'post-job', label: 'Post Job', icon: PlusIcon },
    { id: 'manage-jobs', label: 'Manage Jobs', icon: BriefcaseIcon },
    { id: 'applications', label: 'Manage Applications', icon: UsersIcon },
    { id: 'test-management', label: 'Test Management', icon: FileTextIcon },
    { id: 'interview-management', label: 'Interview Management', icon: CalendarIcon },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
          <div className="flex items-center">
            <BriefcaseIcon />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary">
          <div className="flex items-center">
            <UsersIcon />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <CalendarIcon />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <FileTextIcon />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tests Created</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {jobs.slice(0, 5).map(job => (
              <div key={job._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <h3 className="font-medium">Frontend Developer Interview</h3>
                  <p className="text-sm text-gray-600">Today, 2:00 PM</p>
                </div>
                <VideoIcon />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPostJob = () => (
    <PostJob></PostJob>

    
  );

  const renderManageJobs = () => (
    <ManageJobs></ManageJobs>
  );

const renderApplications = () => {
  return <ManageApplications />;
};

  const renderScheduleInterview = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Schedule Interview</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
          <input
            type="datetime-local"
            value={interviewForm.scheduledAt}
            onChange={(e) => setInterviewForm({...interviewForm, scheduledAt: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interview Mode</label>
          <select
            value={interviewForm.mode}
            onChange={(e) => setInterviewForm({...interviewForm, mode: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {interviewForm.mode === 'online' ? 'Meeting Link' : 'Location'}
          </label>
          <input
            type="text"
            value={interviewForm.location}
            onChange={(e) => setInterviewForm({...interviewForm, location: e.target.value})}
            placeholder={interviewForm.mode === 'online' ? 'https://meet.google.com/...' : 'Office address'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <button onClick={handleScheduleInterview} className="btn-primary w-full">
          Schedule Interview
        </button>
      </div>
    </div>
  );

  const renderTestManagement = () => (
    <ManageTests />
  );

  const renderInterviewManagement = () => (
    <ManageInterviews />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'post-job':
        return renderPostJob();
      case 'manage-jobs':
        return renderManageJobs();
      case 'applications':
        return renderApplications();
      case 'schedule-interview':
        return renderScheduleInterview();
      case 'test-management':
        return renderTestManagement();
      case 'interview-management':
        return renderInterviewManagement();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Employer Portal</h1>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary bg-opacity-10 border-r-4 border-primary text-primary'
                    : 'text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;