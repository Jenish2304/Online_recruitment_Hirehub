import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  BriefcaseIcon,
  FileTextIcon,
  CalendarIcon,
  CheckCircleIcon
} from "lucide-react";

const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        // ✅ Ensure cookies are sent for authentication
        const response = await axiosInstance.get("/api/applications/my", {
          withCredentials: true
        });
        setApplications(response.data);
      } catch (err) {
        setError(
          "Failed to fetch applications. Please ensure you are logged in as a candidate."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, navigate]);

  const getStatusColorClass = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "screening":
        return "bg-purple-100 text-purple-800";
      case "interview_scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
          <p className="mb-4">You haven't applied for any jobs yet.</p>
          <Link to="/jobs" className="btn-primary inline-flex items-center">
            <BriefcaseIcon className="mr-2" /> Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {app.job?.title || "Job not found"}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Applied on {new Date(app.appliedAt).toLocaleDateString()}
              </p>

              <div className="flex items-center space-x-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
                    app.status
                  )}`}
                >
                  {app.status.replace(/_/g, " ")}
                </span>
                {app.status === "interview_scheduled" && app.interview && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" /> Interview on{" "}
                    {new Date(app.interview.scheduledAt).toLocaleDateString()}
                  </span>
                )}
                {app.testResult && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <CheckCircleIcon className="w-3 h-3 mr-1" /> Test Completed
                  </span>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                {!app.testResult &&
                  app.status !== "rejected" &&
                  app.status !== "hired" && (
                    <Link
                      to={`/applications/${app._id}/take-test/${app.job._id}`}
                      className="btn-secondary w-full flex items-center justify-center"
                    >
                      <FileTextIcon className="mr-2" /> Take Screening Test
                    </Link>
                  )}

                {app.status === "interview_scheduled" && app.interview && (
                  <Link
                    to={`/my/interviews`}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <CalendarIcon className="mr-2" /> View Interview Details
                  </Link>
                )}

                <Link
                  to={`/jobs/${app.job._id}`}
                  className="btn-neutral w-full flex items-center justify-center"
                >
                  <BriefcaseIcon className="mr-2" /> View Job Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
