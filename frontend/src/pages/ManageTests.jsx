import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";

const ManageTests = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    duration: 30,
    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch employer's jobs
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

  // Fetch test for a job
  const fetchTest = async (jobId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/tests/job/${jobId}`, { withCredentials: true });
      setTest(res.data);
      setSelectedJob(jobId);
      setForm(res.data);
    } catch (err) {
      // No test found yet
      setTest(null);
      setForm({
        job: jobId,
        duration: 30,
        questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...form.questions];
    updated[index][field] = value;
    setForm({ ...form, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...form.questions];
    updated[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: updated });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [...form.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
    });
  };

  const saveTest = async () => {
    try {
      if (test) {
        await axiosInstance.put(`/api/tests/${test._id}`, form, { withCredentials: true });
        setSuccess("Test updated successfully");
      } else {
        await axiosInstance.post("/api/tests", { ...form, job: selectedJob }, { withCredentials: true });
        setSuccess("Test created successfully");
      }
      fetchTest(selectedJob);
    } catch (err) {
      setError("Failed to save test");
    }
  };

  const deleteTest = async () => {
    try {
      await axiosInstance.delete(`/api/tests/${test._id}`, { withCredentials: true });
      setTest(null);
      setForm({
        job: selectedJob,
        duration: 30,
        questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
      });
      setSuccess("Test deleted successfully");
    } catch (err) {
      setError("Failed to delete test");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Tests</h1>
      {error && <div className="bg-red-100 p-2 mb-2">{error}</div>}
      {success && <div className="bg-green-100 p-2 mb-2">{success}</div>}

      {!selectedJob ? (
        <div>
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-4 border-b flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p>{job.location}</p>
              </div>
              <button
                onClick={() => fetchTest(job._id)}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Manage Test
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

          <div className="mb-4">
            <label className="block font-medium mb-1">Test Duration (minutes)</label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="border p-2 w-24"
            />
          </div>

          {form.questions.map((q, qIndex) => (
            <div key={qIndex} className="border p-3 mb-3 rounded">
              <input
                type="text"
                placeholder="Question text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                className="border p-2 w-full mb-2"
              />
              {q.options.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  className="border p-2 w-full mb-1"
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
                className="border p-2 w-full mt-1"
              />
            </div>
          ))}

          <button onClick={addQuestion} className="bg-gray-500 text-white px-3 py-1 rounded flex items-center">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Question
          </button>

          <div className="mt-4 flex space-x-2">
            <button onClick={saveTest} className="bg-green-500 text-white px-4 py-2 rounded">
              Save Test
            </button>
            {test && (
              <button onClick={deleteTest} className="bg-red-500 text-white px-4 py-2 rounded">
                <TrashIcon className="w-4 h-4 mr-1" /> Delete Test
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTests;
