import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { jobPostAPI, jobApplicationAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await jobPostAPI.getJobPostById(id);
        setJob(response.data);

        // Check if user has already applied
        if (user?.id) {
          const applications = await jobApplicationAPI.getJobApplicationsByUserId(user.id);
          const alreadyApplied = applications.data.some(app => app.job_post_id === parseInt(id));
          setHasApplied(alreadyApplied);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, user?.id, navigate]);

  const handleApply = async () => {
    if (!user) {
      toast.error('Please log in to apply for jobs');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      setApplying(true);
      await jobApplicationAPI.createJobApplication({ job_post_id: id });
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-60 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-lg text-[#ff4d1c] font-medium">{job.organization?.name}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                      {job.employment_type}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-[#00d4c8] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
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
                  <span>
                    {job.minimum_salary && job.maximum_salary
                      ? `BND ${job.minimum_salary.toLocaleString()} - ${job.maximum_salary.toLocaleString()}`
                      : job.minimum_salary
                      ? `From BND ${job.minimum_salary.toLocaleString()}`
                      : job.maximum_salary
                      ? `Up to BND ${job.maximum_salary.toLocaleString()}`
                      : 'Salary not specified'}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="whitespace-pre-wrap text-gray-600">{job.job_description}</div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Requirements</h2>
                <div className="whitespace-pre-wrap text-gray-600">{job.minimum_qualification}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About {job.organization?.name}</h2>
              <p className="text-gray-600 mb-4">{job.organization?.description || 'No company description available.'}</p>
              {job.organization?.website_url && (
                <a
                  href={job.organization.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00d4c8] hover:text-[#00bfb3] font-medium inline-flex items-center"
                >
                  Visit website
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Overview</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Industry</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.industry}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Number of Vacancies</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.no_of_vacancies}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(job.application_deadline).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Posted On</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(job.created_on).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                </dl>
              </div>

              <button
                onClick={handleApply}
                disabled={hasApplied || applying}
                className={`w-full px-4 py-3 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  hasApplied
                    ? 'bg-green-500 cursor-default'
                    : 'bg-[#00d4c8] hover:bg-[#00bfb3] focus:ring-[#00d4c8]'
                }`}
              >
                {applying ? 'Submitting...' : hasApplied ? 'Applied' : 'Apply Now'}
              </button>

              {hasApplied && (
                <p className="mt-2 text-sm text-center text-gray-500">
                  You have already applied for this position
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}