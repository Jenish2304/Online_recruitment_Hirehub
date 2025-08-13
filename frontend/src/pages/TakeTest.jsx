// src/pages/TakeTest.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const TakeTest = () => {
  const { applicationId, jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "candidate") {
      setError("Only candidates can take this test.");
      setLoading(false);
      return;
    }

    const fetchTest = async () => {
      try {
        setLoading(true);
        const testRes = await axiosInstance.get(
          `/api/tests/job/${jobId}`,
          { withCredentials: true }
        );
        setTest(testRes.data);
        setTimeLeft(testRes.data.duration * 60);

        const initialAnswers = {};
        testRes.data.questions.forEach(q => {
          initialAnswers[q._id] = "";
        });
        setAnswers(initialAnswers);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to fetch test questions.");
        console.error(fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [user, navigate, jobId]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft === null) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit(null, true); // auto submit
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, test, answers]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSubmit = async (e, autoSubmit = false) => {
    if (e) e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    const submissionAnswers = test.questions.map(q => ({
      questionId: q._id,
      answer: answers[q._id] || "",
    }));

    try {
      await axiosInstance.post(
        "/api/test-results",
        { applicationId, answers: submissionAnswers },
        { withCredentials: true }
      );
      alert(autoSubmit ? "Time's up! Test submitted automatically." : "Test submitted successfully!");
      navigate("/applications");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit test.");
      console.error("Test submission error:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        {error}
      </div>
    );

  if (!test) {
    return (
      <div className="container mx-auto p-8 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Test Available</h1>
          <p className="text-gray-700 text-lg">
            There is no screening test assigned for this job, or it has been removed.
          </p>
          <button
            onClick={() => navigate("/applications")}
            className="btn-primary mt-6"
          >
            Back to My Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Screening Test for Job ID: {test.job}
        </h1>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <p className="text-lg text-gray-700">
            Duration: <span className="font-semibold">{test.duration} minutes</span>
          </p>
          <p className="text-2xl font-bold text-red-600">
            Time Left: {formatTime(timeLeft)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {test.questions.map((q, index) => (
            <div key={q._id} className="mb-8 p-4 border border-gray-200 rounded-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {index + 1}. {q.questionText}
              </h3>
              <div className="space-y-2">
                {q.options.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    className="flex items-center text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={option}
                      checked={answers[q._id] === option}
                      onChange={() => handleAnswerChange(q._id, option)}
                      className="form-radio h-5 w-5 text-primary"
                      required
                    />
                    <span className="ml-3">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={submitLoading}
          >
            {submitLoading ? "Submitting..." : "Submit Test"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TakeTest;
