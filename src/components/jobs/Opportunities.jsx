import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Opportunities({ jobs = [] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-4">Featured Opportunities</h2>
      <p className="text-gray-600 mb-8">
        Discover the latest job opportunities from leading companies in Brunei
      </p>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div 
            className="bg-gradient-to-br from-[#5A189A] to-[#7B2CBF] p-12 flex items-center justify-center"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img src="/KARYADI - Logo (K - Icon).png" alt="Karyadi" className="w-48 h-48 object-contain" />
          </motion.div>
          <motion.div 
            className="p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-8">
              <p className="text-gray-600 leading-relaxed">
                Join Brunei's premier job platform connecting talented professionals with leading organizations. 
                Our platform offers diverse opportunities across multiple industries, helping you find the perfect role 
                for your career growth.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#FF4D1C] text-xl font-semibold mb-1">Find Your Next Role</h3>
                  <p className="text-gray-600">Browse through hundreds of opportunities</p>
                </div>
                <Link 
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00d4c8] hover:bg-[#00bfb3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00d4c8]"
                >
                  View All Jobs
                  <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#FF4D1C] text-xl font-semibold mb-1">Post a Job</h3>
                  <p className="text-gray-600">Find your next perfect hire</p>
                </div>
                <Link 
                  to="/jobs/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00d4c8] hover:bg-[#00bfb3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00d4c8]"
                >
                  Post a Job
                  <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Opportunities;