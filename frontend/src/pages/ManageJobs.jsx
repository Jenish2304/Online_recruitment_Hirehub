import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { MapPinIcon, DollarSignIcon, ClockIcon, EditIcon, Trash2Icon } from "lucide-react";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editJob, setEditJob] = useState(null);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/api/jobs/${id}`, { withCredentials: true });
      setJobs(jobs.filter((job) => job._id !== id));
      setSuccess("Job deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting job:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to delete job");
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/api/jobs/${editJob._id}`, editJob, { withCredentials: true });
      setJobs(jobs.map((job) => (job._id === editJob._id ? editJob : job)));
      setEditJob(null);
      setSuccess("Job updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating job:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Jobs</h1>

      {success && <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">{success}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {jobs.length === 0 ? (
          <p className="p-6 text-gray-500">No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 border-b border-gray-200 flex justify-between items-start hover:bg-gray-50"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="ml-1">{job.location}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center">
                      <DollarSignIcon className="h-4 w-4" />
                      <span className="ml-1">{job.salaryRange}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4" />
                    <span className="ml-1">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{job.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditJob(job)}
                  className="btn-secondary flex items-center"
                >
                  <EditIcon className="h-4 w-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="btn-neutral border border-red-300 text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2Icon className="h-4 w-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit modal */}
    {editJob && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 overflow-auto">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
      {/* Close button */}
      <button
        onClick={() => setEditJob(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <h2 className="text-2xl font-semibold mb-6">Edit Job</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["title", "location", "salaryRange", "applicationDeadline"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            {field === "applicationDeadline" ? (
              <input
                type="date"
                value={editJob[field]?.split("T")[0] || ""}
                onChange={(e) => setEditJob({ ...editJob, [field]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            ) : (
              <input
                type="text"
                value={editJob[field] || ""}
                onChange={(e) => setEditJob({ ...editJob, [field]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        ))}

        {["description", "requirements"].map((field) => (
          <div key={field} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <textarea
              value={editJob[field] || ""}
              onChange={(e) => setEditJob({ ...editJob, [field]: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={() => setEditJob(null)}
          className="btn-neutral"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="btn-primary"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ManageJobs;
