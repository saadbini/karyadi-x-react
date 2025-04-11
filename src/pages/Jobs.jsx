import React, { useState, useEffect } from 'react';
import JobsList from '../components/jobs/JobsList';
import JobFilters from '../components/jobs/JobFilters';
import ActiveFilters from '../components/jobs/ActiveFilters';
import AddJobButton from '../components/jobs/AddJobButton';
import BackToTop from '../components/jobs/BackToTop';
import EmptyState from '../components/jobs/EmptyState';
import { motion } from 'framer-motion';
import { jobPostAPI } from '../utils/api';

export default function Jobs() {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobPostAPI.getAllJobPosts();
        const jobsData = response.data;
        setJobs(jobsData);
        setTotalJobs(jobsData.length);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Apply filters and sorting
  const filteredAndSortedJobs = React.useMemo(() => {
    let result = [...jobs];

    // Apply filters
    if (filters.jobType?.length) {
      result = result.filter(job => filters.jobType.includes(job.employment_type));
    }
    if (filters.workplace?.length) {
      result = result.filter(job => filters.workplace.includes(job.workplace_type));
    }
    if (filters.industry?.length) {
      result = result.filter(job => filters.industry.includes(job.industry));
    }

    // Apply sorting
    switch (sortBy) {
      case 'salary_high':
        result.sort((a, b) => {
          const maxA = a.maximum_salary ? Number(a.maximum_salary) : Number(a.minimum_salary) || 0;
          const maxB = b.maximum_salary ? Number(b.maximum_salary) : Number(b.minimum_salary) || 0;
          return maxB - maxA;
        });
        break;
      case 'salary_low':
        result.sort((a, b) => {
          const minA = a.minimum_salary ? Number(a.minimum_salary) : Number(a.maximum_salary) || 0;
          const minB = b.minimum_salary ? Number(b.minimum_salary) : Number(b.maximum_salary) || 0;
          return minA - minB;
        });
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
        break;
      default:
        break;
    }

    return result;
  }, [jobs, filters, sortBy]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Available Jobs</h1>
          <AddJobButton />
        </motion.div>
        
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters - Desktop */}
          <motion.div 
            className="hidden lg:block lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <JobFilters filters={filters} setFilters={setFilters} />
          </motion.div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
              <JobFilters filters={filters} setFilters={setFilters} />
            </div>

            {/* Active Filters */}
            <ActiveFilters filters={filters} setFilters={setFilters} />

            {/* Sort Controls */}
            <motion.div 
              className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{filteredAndSortedJobs.length}</span> jobs found
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm text-gray-700">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:ring-[#00d4c8] focus:border-[#00d4c8]"
                >
                  <option value="newest">Newest</option>
                  <option value="salary_high">Highest Salary</option>
                  <option value="salary_low">Lowest Salary</option>
                </select>
              </div>
            </motion.div>

            {/* Jobs List or Empty State */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedJobs.length > 0 ? (
              <JobsList jobs={filteredAndSortedJobs} />
            ) : (
              <EmptyState filters={filters} />
            )}
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
}