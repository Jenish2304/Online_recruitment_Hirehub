import React, { useState } from "react";
import axiosInstance from "../axiosConfig";

const PostJob = ({ onJobPosted }) => {
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salaryRange: "",
    applicationDeadline: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      await axiosInstance.post("/api/jobs", jobForm, { withCredentials: true });

      setJobForm({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salaryRange: "",
        applicationDeadline: ""
      });

      setSuccess("Job posted successfully!");
      if (onJobPosted) onJobPosted();

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error creating job:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Post New Job</h1>

      {/* Success and error messages */}
      {success && <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">{success}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {["title", "description", "requirements", "location", "salaryRange", "applicationDeadline"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            {field === "description" || field === "requirements" ? (
              <textarea
                value={jobForm[field]}
                onChange={(e) => setJobForm({ ...jobForm, [field]: e.target.value })}
                rows={field === "description" ? 4 : 3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : field === "applicationDeadline" ? (
              <input
                type="date"
                value={jobForm[field]}
                onChange={(e) => setJobForm({ ...jobForm, [field]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <input
                type="text"
                value={jobForm[field]}
                onChange={(e) => setJobForm({ ...jobForm, [field]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </div>
        ))}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </div>
    </div>
  );
};

export default PostJob;
