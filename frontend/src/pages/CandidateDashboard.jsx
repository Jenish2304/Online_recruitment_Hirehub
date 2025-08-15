// pages/CandidateDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import { BriefcaseIcon, FileTextIcon, CalendarIcon, SearchIcon, LayersIcon } from "lucide-react";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    upcomingInterviews: 0,
    testsPending: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // Fetch applications for total count and tests pending
        const applicationsRes = await axiosInstance.get('/api/applications/my'); // Removed Authorization header
        const applications = applicationsRes.data;
        const totalApplications = applications.length;
        
        // Count tests pending (simplified: application.testResult is null)
        const testsPending = applications.filter(app => !app.testResult && app.status !== 'rejected' && app.status !== 'hired').length;
        
        // Fetch interviews for upcoming count
        const interviewsRes = await axiosInstance.get('/api/interviews/my/interviews'); // Removed Authorization header
        const interviews = interviewsRes.data;
        const upcomingInterviews = interviews.filter(
          (interview) =>
            interview.status === "scheduled" && new Date(interview.scheduledAt) > new Date()
        ).length;

        // Fetch recent jobs (publicly available)
        const jobsRes = await axiosInstance.get('/api/jobs');
        const jobs = jobsRes.data;


        setStats({ totalApplications, upcomingInterviews, testsPending });
        setRecentJobs(jobs.slice(0, 5)); // Show 5 recent jobs
        setRecentApplications(applications.slice(0, 5)); // Show 5 recent applications

      } catch (error) {
        console.error("Error fetching candidate dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
          <div className="flex items-center">
            <LayersIcon size={24} className="text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary">
          <div className="flex items-center">
            <CalendarIcon size={24} className="text-secondary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingInterviews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <FileTextIcon size={24} className="text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tests Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.testsPending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/jobs" className="flex items-center btn-secondary w-full justify-center">
              <SearchIcon size={20} className="mr-2" />
              Find New Jobs
            </Link>
            <Link to="/applications" className="flex items-center btn-secondary w-full justify-center">
              <BriefcaseIcon size={20} className="mr-2" />
              My Applications
            </Link>
            <Link to="/my/interviews" className="flex items-center btn-secondary w-full justify-center">
              <CalendarIcon size={20} className="mr-2" />
              View My Interviews
            </Link>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Recently Posted Jobs</h2>
          {recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link to={`/jobs/${job._id}`} key={job._id} className="flex flex-col p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-200">
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.location} | {job.salaryRange}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted on {new Date(job.createdAt).toLocaleDateString()} by {job.employer?.companyName || job.employer?.name || 'N/A'}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent jobs available.</p>
          )}
        </div>
      </div>

      {/* Recent Applications (Optional) */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">My Recent Applications</h2>
        {recentApplications.length > 0 ? (
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <Link to={`/applications`} key={app._id} className="flex flex-col p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-200">
                <h3 className="font-medium text-gray-900">{app.job?.title || 'Unknown Job'}</h3>
                <p className="text-sm text-gray-600">Status: <span className={`font-semibold ${
                      app.status === 'applied' || app.status === 'screening' || app.status === 'interview_scheduled' ? 'text-yellow-600' :
                      app.status === 'hired' ? 'text-green-600' :
                      app.status === 'rejected' ? 'text-red-600' :
                      'text-gray-600' // Default if status doesn't match
                    }`}>{app.status.replace(/_/g, ' ')}</span></p>
                <p className="text-xs text-gray-500 mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't applied for any jobs recently.</p>
        )}
      </div>

    </div>
  );
};

export default CandidateDashboard;