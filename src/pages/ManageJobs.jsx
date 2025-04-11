import React from "react";
import { Link } from "react-router-dom";
import { jobPostAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const ManageJobs = () => {

  return (
   
        <div className="min-h-screen bg-gray-50"> 
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Job Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage and monitor all jobs in one place</p>
                </div>
            </div>
 
      {/* Filters Section */}

      {/* Jobs Table */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"> </div>

        </div>
  );
};

export default ManageJobs;

