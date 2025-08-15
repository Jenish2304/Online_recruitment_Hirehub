import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  MapPinIcon,
  CalendarIcon,
  DollarSignIcon,
  ClockIcon,
  BriefcaseIcon,
  FileTextIcon,
  Building2Icon
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError("Failed to fetch job details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert("Please log in to apply for a job.");
      navigate("/login");
      return;
    }
    if (user.role !== "candidate") {
      alert("Only candidates can apply for jobs.");
      return;
    }

    setApplyLoading(true);
    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      await axiosInstance.post(`/api/applications/${id}`, formData, {
        withCredentials: true, // ✅ Same as PostJob
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Application submitted successfully!");
      navigate("/applications");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit application.");
      console.error("Apply error:", err);
    } finally {
      setApplyLoading(false);
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

  if (!job) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Job not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
        <div className="flex items-center text-gray-600 text-lg mb-4 space-x-4">
          <div className="flex items-center">
            <Building2Icon className="h-5 w-5 mr-2" />
            <span>
              {job.employer?.companyName || job.employer?.name || "Unknown Employer"}
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>{job.location || "Remote"}</span>
          </div>
          {job.salaryRange && (
            <div className="flex items-center">
              <DollarSignIcon className="h-5 w-5 mr-2" />
              <span>{job.salaryRange}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" /> Posted On:
            </h3>
            <p>{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          {job.applicationDeadline && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" /> Application Deadline:
              </h3>
              <p>{new Date(job.applicationDeadline).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center">
            <BriefcaseIcon className="h-6 w-6 mr-2" /> Job Description
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center">
            <FileTextIcon className="h-6 w-6 mr-2" /> Requirements
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed">
            {job.requirements && job.requirements.length > 0 ? (
              job.requirements.map((req, index) => <li key={index}>{req}</li>)
            ) : (
              <li>No specific requirements listed.</li>
            )}
          </ul>
        </div>

        {user && user.role === "candidate" && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Apply for this Job
            </h2>
            <div className="mb-4">
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Resume (PDF, DOC, DOCX) - Optional
              </label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-primary
                hover:file:bg-blue-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                If no new resume is uploaded, your existing profile resume will
                be used.
              </p>
            </div>
            <button
              onClick={handleApply}
              className="btn-primary w-full md:w-auto"
              disabled={applyLoading}
            >
              {applyLoading ? "Applying..." : "Apply Now"}
            </button>
          </div>
        )}

        {!user && (
          <p className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-700">
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>{" "}
            or{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Register
            </Link>{" "}
            to apply for this job.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
