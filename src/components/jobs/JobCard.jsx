import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (!max) return `From BND ${min.toLocaleString()}`;
    if (!min) return `Up to BND ${max.toLocaleString()}`;
    return `BND ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  return (
    <div className="bg-white shadow-md hover:shadow-xl rounded-xl p-6 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-[#00d4c8] transition-colors">
            {job.title}
          </h2>
          <div className="flex items-center mt-1">
            <span className="text-[#ff4d1c] font-medium">{job.organization_name}</span>
            <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
              {job.employment_type}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="text-gray-400 hover:text-[#00d4c8] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center text-gray-600">
          <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{job.workplace_type}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatSalary(job.minimum_salary, job.maximum_salary)}</span>
        </div>
      </div>

      <p className="mt-4 text-gray-600 text-sm line-clamp-2">{job.job_description}</p>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Posted {formatDate(job.created_on)}
        </div>
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#00d4c8] hover:bg-[#00bfb3] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00d4c8]"
        >
          View Details
          <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}