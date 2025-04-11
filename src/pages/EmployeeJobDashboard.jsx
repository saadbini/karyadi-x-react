import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jobPostAPI } from "../utils/api";  // Assume jobPostAPI is correctly set up
import { useAuth } from "../context/AuthContext";  // Custom hook to access user context

const EmployeeJobDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const response = await jobPostAPI.getAllJobPosts();
      console.log("API Response:", response);

      if (!response.data || response.data.length === 0) {
        console.warn("No jobs returned from API");
      }

      const allJobs = response.data;

      // Filter jobs based on user role
      const filteredJobs =
        user.userType === "admin"
          ? allJobs
          : allJobs.filter((job) => job.created_by === user.id);

      console.log("Filtered Jobs:", filteredJobs);
      setJobs(filteredJobs);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this vacancy?")) return;

    try {
      setLoading(true);
      await jobPostAPI.deleteJobPost(jobId);
      console.log(`Job Vacancy with ID ${jobId} deleted successfully`);
      fetchJobs();  // Re-fetch jobs after deletion
    } catch (error) {
      console.error("Error deleting vacancy:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Home</h1>
        <div className="p-4 border rounded-lg shadow bg-white">
          <span className="font-semibold">Dynamik Technologies</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card
          icon="✏️"
          title="Create New Job Post"
          description="Click to create a new job post"
          link="/jobs/create"
        />
        <Card
          icon="🗂️"
          title="Manage Job Listings"
          description="Click to manage job listings"
          link=""
        />
        <Card
          icon="📄"
          title="Manage Applications"
          description="Click to manage all applications"
          link="/applicantlisting"
        />
        <Card
          icon="👥"
          title="View All Candidates"
          description="Click to view all candidates"
          link="/candidatelisting"
        />
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Posted Jobs</h2>

        {loading ? (
          <p className="text-gray-400">Loading jobs...</p>
        ) : jobs.length > 0 ? (
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Job Title</th>
                <th className="p-3 text-left">Employment Type</th>
                <th className="p-3 text-left">No. of Vacancies</th>
                <th className="p-3 text-left">Date Created</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-100">
                  <td className="p-3 text-gray-900">{job.title}</td>
                  <td className="p-3 text-gray-600">{job.employment_type || "N/A"}</td>
                  <td className="p-3 text-gray-600">{job.no_of_vacancies}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(job.created_on).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex space-x-4">
                  <Link
                      to={`/manage-applications/${job.id}`}
                      state={{ jobTitle: job.title}} // Pass job name
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                      View Applicants
                    </Link>
                    <Link
                      to={`/jobs/edit/${job.id}`}
                      className="text-teal-600 hover:text-teal-900 flex items-center"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12zM10 11v6m4-6v6"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No jobs posted yet.</p>
        )}
      </section>
    </div>
  );
};

const Card = ({ icon, title, description, link }) => {
  return (
    <Link to={link} className="block">
      <div className="p-4 border rounded-lg shadow bg-white hover:shadow-lg transition cursor-pointer">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EmployeeJobDashboard;
