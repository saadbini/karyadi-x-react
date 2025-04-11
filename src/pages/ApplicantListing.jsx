import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jobApplicationAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const ApplicantListing = () => {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [user]);

  const fetchApplicants = async () => {
    try {
      const response = await jobApplicationAPI.getAllJobApplications();
      console.log("API Response:", response);

      if (!response.data || response.data.length === 0) {
        console.warn("No applicants returned from API");
      }

      const allApplicants = response.data;

      // Filter applicants based on user role if needed
      const filteredApplicants =
        user?.userType === "admin"
          ? allApplicants
          : allApplicants.filter((applicant) => applicant.JobPost.created_by === user?.id);

      console.log("Filtered Applicants:", filteredApplicants);
      setApplicants(filteredApplicants);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicantId, newStatus) => {
    try {
      setLoading(true);
      await jobPostAPI.updateApplicantStatus(applicantId, newStatus);
      console.log(`Applicant status updated successfully`);
      fetchApplicants(); // Re-fetch applicants after update
    } catch (error) {
      console.error("Error updating applicant status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Applicants</h1>
        <div className="p-4 border rounded-lg shadow bg-white">
          <span className="font-semibold">Dynamik Technologies</span>
        </div>
      </header>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">All Applications</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Filter
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading applicants...</p>
        ) : applicants.length > 0 ? (
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Applicant Name</th>
                <th className="p-3 text-left">Applied Position</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Application Date</th>
                {/* <th className="p-3 text-left">Status</th> */}
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-100">
                  <td className="p-3 text-gray-900">{applicant.User.name}</td>
                  <td className="p-3 text-gray-600">{applicant.JobPost.title}</td>
                  <td className="p-3 text-gray-600">{applicant.User.email}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(applicant.created_on).toLocaleDateString()}
                  </td>
                  {/* <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        applicant.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                          applicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                      }`}>
                      {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                    </span>
                  </td> */}
                  <td className="p-3 flex space-x-4">
                    <Link
                      to={`/applicants/${applicant.id}`}
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </Link>
                    <button
                      onClick={() => updateStatus(applicant.id, 'shortlisted')}
                      className="text-green-600 hover:text-green-900 flex items-center"
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Shortlist
                    </button>
                    <button
                      onClick={() => updateStatus(applicant.id, 'rejected')}
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No applicants found.</p>
        )}
      </section>
    </div>
  );
};

export default ApplicantListing;