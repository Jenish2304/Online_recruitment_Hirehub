import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState("candidate");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    companyName: "",
    companyDetails: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = { ...formData, role };
      const res = await axiosInstance.post("/api/auth/register", payload);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Create Your Account
        </h2>

        <div className="flex mb-6 justify-center space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              role === "candidate" ? "btn-primary" : "btn-neutral"
            }`}
            onClick={() => setRole("candidate")}
          >
            Candidate
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              role === "employer" ? "btn-primary" : "btn-neutral"
            }`}
            onClick={() => setRole("employer")}
          >
            Employer
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
            minLength={6}
          />

          {role === "candidate" && (
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          )}

          {role === "employer" && (
            <>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                name="companyDetails"
                placeholder="Company Details"
                value={formData.companyDetails}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </>
          )}

          <button type="submit" className="btn-primary w-full">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
