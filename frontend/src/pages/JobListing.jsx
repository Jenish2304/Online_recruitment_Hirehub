// pages/JobListing.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { SearchIcon, MapPinIcon, DollarSignIcon, Building2Icon } from "lucide-react";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/jobs');
        setJobs(response.data);
        setFilteredJobs(response.data); // Initialize filtered jobs with all jobs
      } catch (err) {
        setError("Failed to fetch jobs. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    // Apply filters whenever jobs or filter criteria change
    const applyFilters = () => {
      let tempJobs = [...jobs];

      if (searchTerm) {
        tempJobs = tempJobs.filter(job =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.employer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) // Search by employer name
        );
      }

      if (locationFilter) {
        tempJobs = tempJobs.filter(job =>
          job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }

      if (skillsFilter) {
        const searchSkills = skillsFilter.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        tempJobs = tempJobs.filter(job =>
          job.requirements && job.requirements.some(req => 
            searchSkills.some(s => req.toLowerCase().includes(s))
          )
        );
      }
      
      setFilteredJobs(tempJobs);
    };

    applyFilters();
  }, [searchTerm, locationFilter, skillsFilter, jobs]);


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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Job Listings</h1>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Title / Description / Employer</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                placeholder="e.g., Remote, New York"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <input
              type="text"
              id="skills"
              placeholder="e.g., React, Node.js"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-200 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Building2Icon className="h-4 w-4 mr-1" />
                <span>{job.employer?.companyName || job.employer?.name || 'Unknown Employer'}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{job.location || 'Remote'}</span>
              </div>
              {job.salaryRange && (
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <DollarSignIcon className="h-4 w-4 mr-1" />
                  <span>{job.salaryRange}</span>
                </div>
              )}
              <p className="text-gray-700 line-clamp-3 mb-4">
                {job.description}
              </p>
              <Link
                to={`/jobs/${job._id}`}
                className="btn-primary w-full text-center"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600 text-lg">
            No jobs found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobListing;