// src/pages/MyInterviews.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  VideoIcon,
  InfoIcon
} from "lucide-react";

const MyInterviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdownTimers, setCountdownTimers] = useState({});

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      if (user.role !== "candidate") {
        setError("Only candidates can view interviews.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/api/interviews/my/interviews",
          { withCredentials: true } // ✅ ensure auth cookie is sent
        );
        setInterviews(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch interviews. Please ensure you are logged in as a candidate."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      interviews.forEach((interview) => {
        if (interview.status === "scheduled") {
          const scheduledDate = new Date(interview.scheduledAt).getTime();
          const now = new Date().getTime();
          const distance = scheduledDate - now;

          if (distance < 0) {
            newTimers[interview._id] = "Past due";
          } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            newTimers[interview._id] = `${
              days > 0 ? days + "d " : ""
            }${hours}h ${minutes}m ${seconds}s`;
          }
        }
      });
      setCountdownTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [interviews]);

  const getStatusColorClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Interviews</h1>

      {interviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
          <p className="mb-4">You have no interviews scheduled yet.</p>
          <Link to="/applications" className="btn-primary inline-flex items-center">
            <InfoIcon className="mr-2" /> Check Applications
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {interviews.map((interview) => (
            <div
              key={interview._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Interview for: {interview.application?.job?.title || "Job not found"}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Interviewer: {interview.interviewer?.name || "N/A"}
              </p>

              <div className="flex items-center space-x-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
                    interview.status
                  )}`}
                >
                  {interview.status}
                </span>
              </div>

              <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <span>
                    Date: {new Date(interview.scheduledAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <span>
                    Time:{" "}
                    {new Date(interview.scheduledAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  {interview.mode === "online" ? (
                    <VideoIcon className="h-5 w-5 mr-2 text-gray-500" />
                  ) : (
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                  )}
                  <span>
                    {interview.mode === "online" ? "Meeting Link:" : "Location:"}{" "}
                    {interview.mode === "online" ? (
                      <a
                        href={interview.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {interview.location}
                      </a>
                    ) : (
                      interview.location
                    )}
                  </span>
                </div>

                {interview.status === "scheduled" &&
                  countdownTimers[interview._id] && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md text-blue-700 font-semibold text-center">
                      Countdown: {countdownTimers[interview._id]}
                    </div>
                  )}
                {interview.status === "scheduled" &&
                  countdownTimers[interview._id] === "Past due" && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md text-red-700 font-semibold text-center">
                      Interview was scheduled for{" "}
                      {new Date(interview.scheduledAt).toLocaleString()}.
                    </div>
                  )}

                {interview.mode === "online" &&
                  interview.status === "scheduled" && (
                    <a
                      href={interview.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center mt-4"
                    >
                      <VideoIcon className="mr-2" /> Join Meeting
                    </a>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInterviews;
