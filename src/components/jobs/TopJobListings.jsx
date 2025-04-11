import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TopJobListings({ jobs = [], loading }) {
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-200 rounded-lg"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">Latest Job Listings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            className="group cursor-pointer"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to={`/jobs/${job.id}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300">
                <h3 className="text-xl font-semibold text-[#ff4d1c] mb-2 group-hover:text-[#00d4c8] transition-colors">
                  {job.title}
                </h3>
                <p className="text-gray-700 mb-2">{job.organization?.name}</p>
                <p className="text-gray-600 mb-2">
                  Application Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                </p>
                <p className="text-gray-800 font-medium">
                  {job.no_of_vacancies} {job.no_of_vacancies === 1 ? 'vacancy' : 'vacancies'}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}