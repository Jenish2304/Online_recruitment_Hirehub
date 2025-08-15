import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { CalendarIcon, XIcon, PencilIcon } from "lucide-react";

const ManageInterviews = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [interviews, setInterviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    applicationId: "",
    scheduledAt: "",
    mode: "online",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch employer jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/jobs/employer/mine", { withCredentials: true });
      setJobs(res.data);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications for a specific job
  const fetchApplications = async (jobId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/applications/job/${jobId}`, { withCredentials: true });
      setApplications(res.data);
      setSelectedJob(jobId);
    } catch (err) {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch interview details for each application
  const fetchInterview = async (applicationId) => {
    try {
      const res = await axiosInstance.get(`/api/interviews/${applicationId}`, { withCredentials: true });
      setInterviews((prev) => ({ ...prev, [applicationId]: res.data }));
    } catch {
      setInterviews((prev) => ({ ...prev, [applicationId]: null }));
    }
  };

  // Schedule interview
  const scheduleInterview = async () => {
    try {
      await axiosInstance.post("/api/interviews", form, { withCredentials: true });
      setSuccess("Interview scheduled successfully");
      fetchInterview(form.applicationId);
      setForm({ applicationId: "", scheduledAt: "", mode: "online", location: "" });
    } catch (err) {
      setError("Failed to schedule interview");
    }
  };

  // Cancel interview
  const cancelInterview = async (id) => {
    try {
      await axiosInstance.delete(`/api/interviews/${id}`, { withCredentials: true });
      setSuccess("Interview cancelled successfully");
      setInterviews((prev) => {
        const updated = { ...prev };
        for (const key in updated) {
          if (updated[key]?._id === id) updated[key] = null;
        }
        return updated;
      });
    } catch {
      setError("Failed to cancel interview");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Interviews</h1>
      {error && <div className="bg-red-100 p-2 mb-2">{error}</div>}
      {success && <div className="bg-green-100 p-2 mb-2">{success}</div>}

      {!selectedJob ? (
        <div>
          {jobs.map((job) => (
            <div key={job._id} className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p>{job.location}</p>
              </div>
              <button
                onClick={() => fetchApplications(job._id)}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                View Applications
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedJob(null)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to Jobs
          </button>

          {applications.length === 0 ? (
            <p>No applications for this job.</p>
          ) : (
            applications.map((app) => {
              const interview = interviews[app._id];
              return (
                <div key={app._id} className="p-4 border-b">
                  <h3 className="font-semibold">{app.candidate?.name}</h3>
                  <p>{app.candidate?.email}</p>
                  {!interview ? (
                    <div className="mt-2">
                      <input
                        type="datetime-local"
                        value={form.applicationId === app._id ? form.scheduledAt : ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            applicationId: app._id,
                            scheduledAt: e.target.value,
                          }))
                        }
                        className="border p-2 mr-2"
                      />
                      <select
                        value={form.applicationId === app._id ? form.mode : "online"}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            applicationId: app._id,
                            mode: e.target.value,
                          }))
                        }
                        className="border p-2 mr-2"
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                      {form.mode === "offline" && (
                        <input
                          type="text"
                          placeholder="Location"
                          value={form.applicationId === app._id ? form.location : ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              applicationId: app._id,
                              location: e.target.value,
                            }))
                          }
                          className="border p-2 mr-2"
                        />
                      )}
                      <button
                        onClick={scheduleInterview}
                        className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
                      >
                        <CalendarIcon className="w-4 h-4 mr-1" /> Schedule
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p>
                        Scheduled: {new Date(interview.scheduledAt).toLocaleString()} (
                        {interview.mode})
                      </p>
                      {interview.location && <p>Location: {interview.location}</p>}
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => cancelInterview(interview._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                        >
                          <XIcon className="w-4 h-4 mr-1" /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ManageInterviews;
