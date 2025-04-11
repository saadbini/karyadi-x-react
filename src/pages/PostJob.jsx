import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import JobForm from '../components/forms/JobForm';
import { jobPostAPI, organizationAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';  // Import axios for API requests

function PostJob() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { id } = useParams();  // Get job post ID from the URL
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [jobPost, setJobPost] = useState({});  // Update to store job post data
  const [formData, setFormData] = useState({
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
  });

  // Fetch organizations and job post data
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await organizationAPI.getAllOrganizations();
        setOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast.error('Unable to fetch organizations. Please try again later.');
      }
    };

    fetchOrganizations();
  }, []);

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.organization_id) {
      errors.push('Please select an organization.');
    }

    if (formData.minimum_salary && formData.maximum_salary) {
      if (Number(formData.minimum_salary) > Number(formData.maximum_salary)) {
        errors.push('Minimum salary cannot be greater than maximum salary.');
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(formData.application_deadline);
    deadline.setHours(0, 0, 0, 0);

    if (deadline < today) {
      errors.push('Application deadline must be today or a future date.');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      setIsLoading(true); // Assuming you start loading here
    
      // Ensure application_deadline is a valid date
      const applicationDeadline = formData.application_deadline 
        ? new Date(formData.application_deadline).toISOString().split('T')[0] 
        : null;
    
      // Prepare jobData object with fallback for numbers
      const jobData = {
        ...formData,
        minimum_salary: formData.minimum_salary && !isNaN(Number(formData.minimum_salary)) 
          ? Number(formData.minimum_salary) 
          : null,
        maximum_salary: formData.maximum_salary && !isNaN(Number(formData.maximum_salary)) 
          ? Number(formData.maximum_salary) 
          : null,
        no_of_vacancies: formData.no_of_vacancies && !isNaN(Number(formData.no_of_vacancies))
          ? Number(formData.no_of_vacancies) 
          : 0, // Default to 0 if no valid number
        application_deadline: applicationDeadline,
      };
    
      let response;
      if (id) {
        // If ID exists, update the job post
        response = await jobPostAPI.updateJobPost(id, jobData);
        if (response.data) {
          toast.success('Job updated successfully!');
          navigate('/employeeDashboard');
        }
      } else {
        // If ID does not exist, create a new job post
        response = await jobPostAPI.createJobPost(jobData);
        if (response.data) {
          toast.success('Job posted successfully!');
          navigate('/employeeDashboard');
        }
      }
    } catch (error) {
      console.error('Error creating job post:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create job post. Please try again.');
    } finally {
      setIsLoading(false);
    }
    };

  // Filter organizations based on user type and permissions
  const userOrganizations = user?.userType === 'admin'
    ? organizations
    : organizations.filter((org) => org.created_by === user?.id);

  // Show message if user doesn't have any organizations
  if (userOrganizations.length === 0 && user?.userType !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Organization Required</h2>
          <p className="text-gray-600 mb-6">You need to be part of an organization to post jobs.</p>
          <button
            onClick={() => navigate('/employeeDashboard')}
            className="px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Post a New Job</h1>

          <div className="mb-6">
            <label htmlFor="organization_id" className="block text-sm font-medium text-gray-700 mb-1">
              Select Organization
            </label>
            <select
              id="organization_id"
              name="organization_id"
              value={formData.organization_id}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm h-10"
              required
            >
              <option value="">Select an organization</option>
              {userOrganizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <JobForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            jobPostId={id}  // Passing jobPostId here
          />
        </div>
      </div>
    </div>
  );
}

export default PostJob;
