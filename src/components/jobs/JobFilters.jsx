import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dropdownOptions from '../../utils/dropdownOptions';

export default function JobFilters({ filters, setFilters }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const FilterSection = ({ title, options, field }) => (
    <div className="py-6 first:pt-0 last:pb-0 border-b last:border-0">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[#00d4c8] focus:ring-[#00d4c8]"
              checked={filters[field]?.includes(option)}
              onChange={(e) => {
                const newValues = e.target.checked
                  ? [...(filters[field] || []), option]
                  : filters[field]?.filter((v) => v !== option);
                setFilters({ ...filters, [field]: newValues });
              }}
            />
            <span className="ml-3 text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter dialog */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="w-full bg-white p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-[#00d4c8] shadow-sm border rounded-lg"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                <FilterSection title="Job Type" options={dropdownOptions.jobType} field="jobType" />
                <FilterSection title="Workplace Type" options={dropdownOptions.workplaceType} field="workplace" />
                <FilterSection title="Industry" options={dropdownOptions.industryCategories} field="industry" />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setFilters({})}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="bg-[#00d4c8] text-white px-4 py-2 rounded-lg hover:bg-[#00bfb3] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop filters */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Filters</h2>
          <div className="divide-y divide-gray-200">
            <FilterSection title="Job Type" options={dropdownOptions.jobType} field="jobType" />
            <FilterSection title="Workplace Type" options={dropdownOptions.workplaceType} field="workplace" />
            <FilterSection title="Industry" options={dropdownOptions.industryCategories} field="industry" />
          </div>
          <button
            onClick={() => setFilters({})}
            className="mt-6 text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </>
  );
}