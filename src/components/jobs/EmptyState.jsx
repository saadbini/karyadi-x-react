import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ filters }) {
  const hasActiveFilters = Object.keys(filters).some(
    key => filters[key] && filters[key].length > 0
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-16 px-4"
    >
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg mx-auto">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {hasActiveFilters ? 'No matching jobs found' : 'No jobs available'}
        </h3>
        <p className="text-gray-500 mb-6">
          {hasActiveFilters 
            ? 'Try adjusting your filters or search criteria'
            : 'Check back later for new job postings'}
        </p>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-[#00d4c8] hover:text-[#00bfb3] font-medium"
            onClick={() => window.location.reload()}
          >
            Clear all filters
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}