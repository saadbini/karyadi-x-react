import React from 'react';

const jobs = [
  {
    id: 1,
    title: 'Marketing Person',
    company: 'Tech Corp',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'New York, NY',
    type: 'Full-time',
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'San Francisco, CA',
    type: 'Contract',
  },
];

export default function FeaturedJobs() {
  return (
    <div className="bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 text-center sm:text-left">
          Featured Jobs
        </h2>
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 hover:shadow-lg transition duration-300"
            >
              <div className="px-4 py-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 line-clamp-2">
                  {job.title}
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">{job.company}</p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                    {job.location}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                    {job.type}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6">
                <button className="w-full text-sm sm:text-base font-medium text-karyadi-teal hover:text-karyadi-orange transition-colors duration-200">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}