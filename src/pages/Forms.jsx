import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formAPI, eventsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState({}); // Track forms the user has submitted
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formsResponse, eventsResponse] = await Promise.all([
          formAPI.getAllForms(),
          eventsAPI.getAllEvents()
        ]);
        
        setForms(Array.isArray(formsResponse.data) ? formsResponse.data : (formsResponse.data?.data || []));
        setEvents(Array.isArray(eventsResponse.data) ? eventsResponse.data : (eventsResponse.data?.data || []));
        
        // If user is authenticated, fetch their form submissions
        if (isAuthenticated && user) {
          try {
            try {
              const userSubmissionsResponse = await formAPI.getUserFormSubmissions(user.id);
              const submissionsMap = {};
              
              // Convert array of submissions to a map for easy lookup
              if (Array.isArray(userSubmissionsResponse)) {
                userSubmissionsResponse.forEach(submission => {
                  submissionsMap[submission.form_id] = true;
                });
              }
              
              setUserSubmissions(submissionsMap);
            } catch (error) {
              console.error('Error fetching user submissions:', error);
              // Continue with empty submissions - don't block the UI
              setUserSubmissions({});
            }
          } catch (error) {
            console.error('Error fetching user submissions:', error);
            setUserSubmissions({});
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load forms. Please try again.');
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, isAuthenticated, user]);
  
  // Add a handler for when user clicks on a form they've already submitted
  const handleFormClick = (formId) => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: `/forms/${formId}/submit` } });
      return;
    }
    
    // Check if user has already submitted this form
    if (userSubmissions[formId]) {
      setSelectedFormId(formId);
      setResubmitModalOpen(true);
    } else {
      navigate(`/forms/${formId}/submit`);
    }
  };
  
  const handleResubmit = () => {
    setResubmitModalOpen(false);
    navigate(`/forms/${selectedFormId}/submit`);
  };
  
  const handleCancelResubmit = () => {
    setResubmitModalOpen(false);
    setSelectedFormId(null);
  };
  
  const handleFilterByEvent = (e) => {
    setSelectedEventId(e.target.value);
  };

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!formToDelete) return;
    
    try {
      await formAPI.deleteForm(formToDelete.id);
      setForms(forms.filter(f => f.id !== formToDelete.id));
      toast.success('Form deleted successfully');
      setDeleteModalOpen(false);
      setFormToDelete(null);
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form. Please try again.');
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setFormToDelete(null);
  };
  
  const filteredForms = selectedEventId
    ? forms.filter(form => form.event_id === parseInt(selectedEventId))
    : forms;
  
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TENUN Surveys</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and respond to available forms and surveys
          </p>
        </div>
        {user && user.userType === 'admin' && (
          <div className="mt-4 md:mt-0">
            <Link
              to="/forms/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Form
            </Link>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <label htmlFor="eventFilter" className="block text-sm font-medium text-gray-700">
          Filter by Event
        </label>
        <select
          id="eventFilter"
          value={selectedEventId}
          onChange={handleFilterByEvent}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
        >
          <option value="">All Events</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>
      
      {!Array.isArray(filteredForms) || filteredForms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedEventId ? 'No forms available for this event.' : null}
          </p>
          {user && user.userType === 'admin' && (
            <div className="mt-6">
              <Link
                to="/forms/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Form
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredForms.map((form) => {
            const hasSubmitted = userSubmissions[form.id];
            
            return (
              <div key={form.id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
                {/* Card Header with Title and Admin Actions */}
                <div className="p-4 flex justify-between items-start border-b">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{form.title}</h3>
                  {user && user.userType === 'admin' && (
                    <div className="flex space-x-2">
                      {/* Edit Button */}
                      <Link 
                        to={`/forms/edit/${form.id}`}
                        className="text-gray-400 hover:text-blue-500 transition-colors" 
                        title="Edit Form"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(form)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Form"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
      
                {/* Card Content */}
                <div className="px-4 py-3 flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg className="mr-1.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Event: {form.event_name || 'N/A'}</span>
                  </div>
                  
                  {/* <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg className="mr-1.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Created by: {form.creator_name || 'Unknown'}</span>
                  </div> */}
                  
                  {form.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
                  )}
                </div>
                
                {/* Card Footer */}
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => handleFormClick(form.id)}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white 
                      ${hasSubmitted 
                        ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' 
                        : 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500'} 
                      focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {hasSubmitted ? 'Submit Again' : 'Fill Form'}
                  </button>
                  
                  <div className="flex items-center">
                    {hasSubmitted && (
                      <span className="inline-flex items-center text-xs font-medium text-green-700 mr-2">
                        <svg className="mr-1 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Submitted
                      </span>
                    )}
                    
                    {user && user.userType === 'admin' && (
                      <Link
                        to={`/forms/${form.id}/responses`}
                        className="inline-flex items-center text-sm text-teal-600 hover:text-teal-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Responses
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Form</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the form "{formToDelete?.title}"? This action cannot be undone and all responses will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Resubmit Confirmation Modal */}
      {resubmitModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Submit Another Response</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You've already submitted a response for this form. Would you like to submit another response?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleResubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit Again
                </button>
                <button
                  type="button"
                  onClick={handleCancelResubmit}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms;