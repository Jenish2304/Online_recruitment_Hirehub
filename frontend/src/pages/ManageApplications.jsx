import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { EyeIcon, DownloadIcon } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied", color: "bg-blue-100 text-blue-800" },
  { value: "screening", label: "Screening", color: "bg-yellow-100 text-yellow-800" },
  { value: "interview_scheduled", label: "Interview Scheduled", color: "bg-purple-100 text-purple-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "hired", label: "Hired", color: "bg-green-100 text-green-800" },
];

const ManageApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/jobs/employer/mine", { withCredentials: true });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/applications/job/${jobId}`, { withCredentials: true });
      setApplications(res.data);
      setSelectedJob(jobId);
    } catch (err) {
      console.error("Error fetching applications:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axiosInstance.put(
        `/api/applications/${applicationId}/status`,
        { status },
        { withCredentials: true }
      );
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status } : app))
      );
      setSuccess(`Application status updated to "${status}"`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Applications</h1>

      {success && <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">{success}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      {!selectedJob && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {jobs.length === 0 ? (
            <p className="p-6 text-gray-500">No jobs found.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
                <button
                  onClick={() => fetchApplications(job._id)}
                  className="btn-primary flex items-center"
                >
                  <EyeIcon className="h-4 w-4 mr-1" /> View Applications
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedJob && (
        <div>
          <button
            onClick={() => setSelectedJob(null)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to Jobs
          </button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {applications.length === 0 ? (
              <p className="p-6 text-gray-500">No applications found for this job.</p>
            ) : (
              applications.map((app) => {
                const statusOption = STATUS_OPTIONS.find((opt) => opt.value === app.status);
                return (
                  <div
                    key={app._id}
                    className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{app.candidate?.name}</h3>
                      <p className="text-sm text-gray-600">{app.candidate?.email}</p>
                      <p className="mt-1 text-sm">
                        <strong>Skills:</strong>{" "}
                        {app.candidate?.skills?.join(", ") || "Not provided"}
                      </p>
                      <p className="text-sm">
                        <strong>Experience:</strong>{" "}
                        {app.candidate?.experience || "Not provided"}
                      </p>
                      {statusOption && (
                        <span
                          className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${statusOption.color}`}
                        >
                          {statusOption.label}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                      {app.candidate?.resume && (
                        <a
                          href={`http://localhost:5001/${app.candidate.resume.replace(/\\/g, "/")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-neutral flex items-center"
                        >
                          <DownloadIcon className="h-4 w-4 mr-1" /> View Resume
                        </a>
                      )}

                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className="border rounded px-3 py-2"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
