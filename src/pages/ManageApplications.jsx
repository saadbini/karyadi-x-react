
import React, { useEffect, useState } from "react";
import { jobPostAPI, jobApplicationAPI } from "../utils/api";  
import { useParams } from "react-router-dom";


const ManageApplications = () => {
  const { jobId } = useParams();  // Get jobId from URL
  const [jobTitle, setJobTitle] = useState(location.state?.jobTitle || "Loading...");
  const [applicants, setApplicants] = useState([]); // ✅ Store applicants
  const [loading, setLoading] = useState(true);

 

    // Fetch job details if jobTitle is not available from state
    useEffect(() => {
        if (!location.state?.jobTitle) {
          jobPostAPI.getJobPostById(jobId)  // ✅ Use getJobPostById
            .then(response => {
              setJobTitle(response.data.title);  // ✅ Assuming API returns { title: "Job Name" }
            })
            .catch(error => {
              console.error("Error fetching job details:", error);
              setJobTitle("Unknown Job");
            });
        }
      }, [jobId, location.state]);

      // Fetch applicants for this job
    useEffect(() => {
    jobApplicationAPI.getJobApplicationsByJobPostId(jobId)
      .then(response => {
        console.log("API Response for Applicants:", response.data);
        setApplicants(response.data); // ✅ Assuming API returns an array of applicants
      })
      .catch(error => {
        console.error("Error fetching applicants:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jobId]);

  
      

  return (
    <div className="min-h-screen bg-gray-50"> 
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Manage Applicants Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Managing applications for Job ID: {jobId} 
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Managing applications for: <span className="font-semibold">{jobTitle}</span>
          </p>
        </div>
      </div>

      {/* Jobs Table or Other Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <p>List of applicants for "{jobTitle}" will be shown here...</p>
      </div>

      {/* Applicants List */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-4">List of Applicants</h2>

        {loading ? (
          <p className="text-gray-500">Loading applicants...</p>
        ) : applicants.length > 0 ? (
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Applicant Name</th>
                <th className="p-3 text-left">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-100">
                  <td className="p-3 text-gray-600">{applicant.User?.name || "N/A"}</td>
                  <td className="p-3 text-gray-600">{applicant.User?.email || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No applicants yet.</p>
        )}
      </div>

    </div>
  );
};

export default ManageApplications;
