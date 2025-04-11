import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Don't forget to import axios if not already done
import dropdownOptions from '../../utils/dropdownOptions';
import { jobPostAPI } from '../../utils/api';

const initialFormData = {
  title: '',
  job_post_status: 'active',
  employment_type: '',
  job_description: '',
  minimum_qualification: '',
  workplace_type: '',
  industry: '',
  application_deadline: '',
  no_of_vacancies: '',
  minimum_salary: '',
  maximum_salary: '',
  organization_id: ''
};

export default function JobForm({
  formData = initialFormData,
  handleChange: parentHandleChange,
  handleSubmit: parentHandleSubmit,
  isLoading,
  jobPostId // Receiving jobPostId prop
}) {
  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(() => {
    if (!jobPostId) return; // Avoid unnecessary API call if no id
    const fetchJobPost = async () => {
      try {
        const response = await jobPostAPI.getJobPostById(jobPostId);
        const jobPostData = response.data;
          console.log("Fetched job post data:", jobPostData); // Add logging here
        setLocalFormData({
          title: jobPostData.title || '',
          job_post_status: jobPostData.job_post_status || 'active',
          employment_type: jobPostData.employment_type || '',
          job_description: jobPostData.job_description || '',
          minimum_qualification: jobPostData.minimum_qualification || '',
          workplace_type: jobPostData.workplace_type || '',
          industry: jobPostData.industry || '',
          application_deadline: jobPostData.application_deadline ? jobPostData.application_deadline.split("T")[0] : '',
          no_of_vacancies: jobPostData.no_of_vacancies || '',
          minimum_salary: jobPostData.minimum_salary || '',
          maximum_salary: jobPostData.maximum_salary || '',
          organization_id: jobPostData.organization_id || ''
        });
        
      } catch (error) {
        console.error("Error fetching job post:", error);
      }
    };
    
    fetchJobPost();
  }, [jobPostId]);  // This effect is dependent on the 'id'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    parentHandleChange({
      target: {
        name,
        value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    parentHandleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
      {/* Job Details */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Job Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={localFormData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700">
                Employment Type
              </label>
              <select
                id="employment_type"
                name="employment_type"
                value={localFormData.employment_type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                required
              >
                <option value="">Select Employment Type</option>
                {dropdownOptions.jobType.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                value={localFormData.industry}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                required
              >
                <option value="">Select Industry</option>
                {dropdownOptions.industryCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Salary Range</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minimum_salary" className="block text-sm font-medium text-gray-700">
              Minimum Salary
            </label>
            <input
              type="number"
              id="minimum_salary"
              name="minimum_salary"
              value={localFormData.minimum_salary}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
            />
          </div>
          <div>
            <label htmlFor="maximum_salary" className="block text-sm font-medium text-gray-700">
              Maximum Salary
            </label>
            <input
              type="number"
              id="maximum_salary"
              name="maximum_salary"
              value={localFormData.maximum_salary}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Work Location</h2>
        <div>
          <label htmlFor="workplace_type" className="block text-sm font-medium text-gray-700">
            Workplace Type
          </label>
          <select
            id="workplace_type"
            name="workplace_type"
            value={localFormData.workplace_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
            required
          >
            <option value="">Select Workplace Type</option>
            {dropdownOptions.workplaceType.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Requirements */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Requirements</h2>
        <div>
          <label htmlFor="minimum_qualification" className="block text-sm font-medium text-gray-700">
            Minimum Qualification
          </label>
          <textarea
            id="minimum_qualification"
            name="minimum_qualification"
            value={localFormData.minimum_qualification}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
            required
          />
        </div>
      </div>

      {/* Vacancy */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Vacancy Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700">
              Application Deadline
            </label>
            <input
              type="date"
              id="application_deadline"
              name="application_deadline"
              value={localFormData.application_deadline}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Please select today or a future date
            </p>
          </div>

          <div>
            <label htmlFor="no_of_vacancies" className="block text-sm font-medium text-gray-700">
              Number of Vacancies
            </label>
            <input
              type="number"
              id="no_of_vacancies"
              name="no_of_vacancies"
              value={localFormData.no_of_vacancies}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
              required
            />
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        <div>
          <textarea
            id="job_description"
            name="job_description"
            value={localFormData.job_description}
            onChange={handleChange}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
            placeholder="Enter job description, responsibilities, and requirements"
            required
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="border-t pt-6 flex justify-end space-x-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Posting...' : 'Post Job'}
        </button>
      </div>
    </form>
  );
}
