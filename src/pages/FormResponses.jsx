import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CSVLink } from 'react-csv';

const FormResponses = () => {
  const { id: formId } = useParams();
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('responses'); // 'responses' or 'summary'
  const [exportData, setExportData] = useState([]);
  
  useEffect(() => {
    if (!user?.userType || user.userType !== 'admin') {
      setError('You do not have permission to view this page.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [formResponse, responsesResponse, summaryResponse] = await Promise.all([
          formAPI.getFormById(formId),
          formAPI.getFormResponses(formId),
          formAPI.getFormSummary(formId)
        ]);

        console.log('Form Response:', formResponse);
        

        setForm(formResponse?.data || formResponse);
        
        // Since formAPI.getFormResponses already returns response.data, 
        // responsesResponse should directly be the array of responses
        // Ensure we have an array and filter out any null/undefined/empty responses
        const validResponses = Array.isArray(responsesResponse) 
          ? responsesResponse.filter(response => response && 
              (response.responses || Object.keys(response).length > 0))
          : [];
        
        setResponses(validResponses);
        
        // Handle summary data
        const summaryData = summaryResponse?.data || summaryResponse || null;
        setSummary(summaryData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to load form responses. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [formId, user]);

  useEffect(() => {
    if (responses?.length > 0 && form?.questions) {
      const preparedData = responses.map((resp) => {
        const responseData = resp?.responses || resp?.data?.responses || resp?.data || resp || {};
        const exportItem = {
          Username: resp?.user_name || resp?.userName || resp?.user?.name || 'Anonymous',
          SubmittedOn: new Date(resp?.submitted_on || resp?.submittedOn || resp?.created_at || resp?.timestamp).toLocaleString(),
        };
  
        form.questions.forEach((q) => {
          let responseValue = responseData[q.id] || responseData[q.question] || '';
  
          // Correctly handle Likert Matrix type
          if (q.type === 'likert_matrix' && typeof responseValue === 'object') {
            responseValue = Object.entries(responseValue)
              .map(([subQ, val]) => `${subQ}: ${val}`)
              .join('; ');
          } else if (Array.isArray(responseValue)) {
            responseValue = responseValue.join(', ');
          }
  
          exportItem[q.question] = responseValue;
        });
  
        return exportItem;
      });
  
      setExportData(preparedData);
    }
  }, [responses, form]);
  
  
  const handleViewChange = (newView) => {
    setView(newView);
  };
  
  const getCountryNameFromCode = (code, question) => {
    // Try to find country options directly in question.options first
    // If not found, try looking in additional_settings.options as fallback
    const countryOptions = question?.options || 
                          question?.additional_settings?.options || 
                          [];
    
    // Find the country option that matches the code
    const countryOption = countryOptions.find(option => 
      option.value === code || option.code === code
    );
    
    // Return the country name if found, otherwise return the code
    return countryOption?.label || countryOption?.name || code;
  };

  const renderResponseValue = (questionType, response, question, fullResponseData) => {
    if (!response) return <span className="text-gray-400">No response</span>;
    
    switch (questionType) {
      case 'checkbox':
        return Array.isArray(response) ? (
          <ul className="list-disc list-inside">
            {response.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : response;
        
      case 'likert_matrix':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              {Object.entries(response).map(([question, rating]) => (
                <tr key={question}>
                  <td className="py-1 pr-4 text-sm font-medium text-gray-900">{question}</td>
                  <td className="py-1 pl-4 text-sm text-gray-500">{rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
        
      case 'dropdown':
        // Check if this is an "other" response with custom text
        if ((response === 'other' || response === 'Other') && 
            question?.additional_settings?.dropdownType === 'with_other') {
          
          // Get the question ID 
          const questionId = question.id;
          
          // Check for other text in fullResponseData
          const otherKey = `${questionId}_other`;
          const otherText = fullResponseData?.[otherKey];
          
          if (otherText) {
            return (
              <div>
                <span className="font-medium">Other:</span> <span>{otherText}</span>
              </div>
            );
          }
        }
        
        // If this is a countries dropdown, convert the code to a name
        if (question?.additional_settings?.dropdownType === 'countries') {
          console.log('Country dropdown detected:', response, question);
          const countryName = getCountryNameFromCode(response, question);
          console.log('Converted to:', countryName);
          return countryName;
        }
        
        return response;
        
      default:
        return response;
    }
  };
  
  const renderSummaryChart = (question) => {
    const { type, questionId, option_counts, average, sample_responses, subquestion_averages } = question;
    
    switch (type) {
      case 'multiple_choice':
      case 'checkbox':
      case 'dropdown':
        if (!option_counts) return <p>No data available</p>;
        
        // If this is a countries dropdown, convert codes to names in summary
        let displayCounts = option_counts;
        
        if (type === 'dropdown' && 
            (question.additional_settings?.dropdownType === 'countries' || 
             question.question.toLowerCase().includes('country'))) {
          console.log('Converting country codes in summary:', option_counts);
          // Transform country codes to country names
          displayCounts = {};
          
          // First try to get options from the question directly
          let countryOptions = question.options || question.additional_settings?.options || [];
          
          // If that doesn't work, fetch options from the form questions
          if (countryOptions.length === 0 && form && form.questions) {
            const formQuestion = form.questions.find(q => 
              q.id === parseInt(questionId) || 
              q.id === questionId ||
              q.question === question.question
            );
            if (formQuestion) {
              countryOptions = formQuestion.options || formQuestion.additional_settings?.options || [];
            }
          }
          
          // If we still don't have options, use a hardcoded country list
          if (countryOptions.length === 0) {
            countryOptions = countryCodeToNameMap; // Using a global map would be better
          }
          
          console.log('Country options:', countryOptions);
          
          Object.entries(option_counts).forEach(([code, count]) => {
            // Find country name from code using getCountryNameFromCode helper
            const countryName = getCountryNameFromCode(code, { options: countryOptions }) || code;
            displayCounts[countryName] = count;
          });
          
          console.log('Converted display counts:', displayCounts);
        }
        
        const total = Object.values(displayCounts).reduce((sum, count) => sum + count, 0);
        
        // Special handling for "other" responses in dropdowns with "other" option
        if (type === 'dropdown' && question.additional_settings?.dropdownType === 'with_other') {
          // Check if we have any "other" responses
          const otherCount = displayCounts['other'] || displayCounts['Other'] || 0;
          
          if (otherCount > 0) {
            // Track unique "other" responses and their counts
            const otherResponses = {};
            
            // Look through all individual responses to find text for "other" selections
            responses.forEach(response => {
              const responseData = response?.responses || response?.data || response || {};
              
              // Check if this person selected "other"
              Object.entries(responseData).forEach(([key, value]) => {
                // If they selected "other" and provided text in the corresponding "_other" field
                if ((value === 'other' || value === 'Other') && !key.includes('_other')) {
                  const otherKey = `${key}_other`;
                  const otherText = responseData[otherKey];
                  
                  if (otherText) {
                    // Count occurrences of each unique "other" response
                    if (otherResponses[otherText]) {
                      otherResponses[otherText]++;
                    } else {
                      otherResponses[otherText] = 1;
                    }
                  }
                }
              });
            });
            
            // Replace generic "other" with specific responses
            delete displayCounts['other'];
            delete displayCounts['Other'];
            
            // Add each unique "other" response as its own item in the chart
            Object.entries(otherResponses).forEach(([otherText, count]) => {
              displayCounts[`Other: ${otherText}`] = count;
            });
          }
        }
        
        return (
          <div className="mt-3">
            {Object.entries(displayCounts).map(([option, count]) => {
              const percentage = Math.round((count / total) * 100);
              return (
                <div key={option} className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{option}</span>
                    <span className="text-sm font-medium text-gray-900">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      
      // Other cases remain the same...
      case 'rating':
      case 'likert_single':
        if (average === undefined) return <p>No data available</p>;
        
        return (
          <div className="mt-3">
            <div className="text-center mb-1">
              <span className="text-2xl font-bold text-teal-600">{average.toFixed(1)}</span>
              <span className="text-sm text-gray-500">/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">1</span>
              <div className="w-full mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-600 h-full rounded-full" 
                  style={{ width: `${(average / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">5</span>
            </div>
          </div>
        );
        
      case 'likert_matrix':
        if (!subquestion_averages) return <p>No data available</p>;
        
        return (
          <div className="mt-3 space-y-4">
            {Object.entries(subquestion_averages).map(([subQuestion, avg]) => (
              <div key={subQuestion} className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 truncate max-w-xs">{subQuestion}</span>
                  <span className="text-sm font-medium text-gray-900">{avg.toFixed(1)}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-600 h-2 rounded-full" 
                    style={{ width: `${(avg / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'text':
        if (!sample_responses || sample_responses.length === 0) return <p>No responses</p>;
        
        return (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Sample responses:</h4>
            <ul className="list-disc list-inside space-y-1">
              {sample_responses.map((response, idx) => (
                <li key={idx} className="text-sm text-gray-700">{response}</li>
              ))}
            </ul>
          </div>
        );
        
      default:
        return <p>Unsupported question type for summary</p>;
    }
  };
  
  const hasResponses = responses && 
    responses.length > 0 && 
    responses.some(response => {
      return response && 
        ((response.responses && Object.keys(response.responses).length > 0) || 
         Object.keys(response).length > 1);  // More than just the ID field
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }
  
  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found!</strong>
          <span className="block sm:inline"> The requested form was not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{form.title} - Responses</h1>
            <p className="mt-1 text-sm text-gray-600">
              Total responses: {responses.length}
            </p>
          </div>
          <div>
            <Link
              to="/forms"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Back to Forms
            </Link>
          </div>

          <div>
          <CSVLink
          data={exportData}
          filename={`${form?.title || 'responses'}_${new Date().toISOString()}.csv`}
          className="inline-flex items-center px-4 py-2 border border-teal-500 text-teal-500 hover:bg-teal-50 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Export Responses
        </CSVLink>
          </div>
        </div>
        
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => handleViewChange('responses')}
              className={`${
                view === 'responses'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Individual Responses
            </button>
            <button
              onClick={() => handleViewChange('summary')}
              className={`${
                view === 'summary'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Summary & Analytics
            </button>
          </nav>
        </div>
      </div>

      {view === 'responses' ? (
        !hasResponses ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no submissions for this form yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {responses.map((response, responseIndex) => {
              // Handle nested response data structures
              const responseData = response?.responses || 
                               response?.data?.responses ||
                               response?.data || 
                               response || {};
              
              const userName = response?.user_name || 
                           response?.userName || 
                           response?.user?.name ||
                           'Anonymous';
                           
              const submittedOn = response?.submitted_on || 
                               response?.submittedOn || 
                               response?.created_at || 
                               response?.timestamp ||
                               new Date().toISOString();
              
              return (
                <div key={response.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Response by {userName}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Submitted on {new Date(submittedOn).toLocaleString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Complete
                    </span>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      {form.questions.map((question, idx) => {
                        const responseValue = responseData[question.id] || responseData[question.question] || null;
                        
                        return (
                          <div key={question.id} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                            <dt className="text-sm font-medium text-gray-500">
                              {question.question} {question.is_required && <span className="text-red-500">*</span>}
                              {getQuestionTypeBadge(question.type)}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {renderResponseValue(question.type, responseValue, question, responseData)}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-6">
          {(summary && summary.questions_summary && summary.questions_summary.length > 0) ? (
            summary.questions_summary.map((questionSummary) => {
              // Find the full question object that matches this summary
              const fullQuestion = form.questions.find(q => q.id === parseInt(questionSummary.questionId)) || questionSummary;
              
              // Add debugging 
              console.log('Question Summary:', questionSummary);
              console.log('Full Question Match:', fullQuestion);
              
              // Merge the summary data with the full question data
              const enrichedQuestion = {
                ...questionSummary,
                options: fullQuestion.options || [],
                additional_settings: {
                  ...(fullQuestion.additional_settings || {}),
                  // If this is a dropdown and specifically a countries dropdown
                  // Make sure the dropdown type is explicitly set
                  ...(fullQuestion.type === 'dropdown' && 
                     (fullQuestion.additional_settings?.dropdownType === 'countries' || 
                      questionSummary.question.toLowerCase().includes('country')) ? 
                      { dropdownType: 'countries' } : {})
                }
              };
              
              // More debugging
              console.log('Enriched Question:', enrichedQuestion);
              
              return (
                <div key={questionSummary.questionId} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{questionSummary.question}</h3>
                      {getQuestionTypeBadge(questionSummary.type)}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {questionSummary.total_responses} responses
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    {renderSummaryChart(enrichedQuestion)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No data to analyze</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no responses yet to generate analytics.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Add this helper function near your other rendering functions
const getQuestionTypeBadge = (type) => {
  const typeLabels = {
    'text': 'Text',
    'multiple_choice': 'Multiple Choice',
    'checkbox': 'Checkbox',
    'rating': 'Rating',
    'likert_single': 'Likert Scale',
    'likert_matrix': 'Matrix Scale',
    'dropdown': 'Dropdown'
  };
  
  const typeColors = {
    'text': 'bg-blue-100 text-blue-800',
    'multiple_choice': 'bg-green-100 text-green-800',
    'checkbox': 'bg-purple-100 text-purple-800',
    'rating': 'bg-yellow-100 text-yellow-800',
    'likert_single': 'bg-orange-100 text-orange-800',
    'likert_matrix': 'bg-pink-100 text-pink-800',
    'dropdown': 'bg-indigo-100 text-indigo-800'
  };
  
  const label = typeLabels[type] || type;
  const colorClass = typeColors[type] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${colorClass} ml-2`}>
      {label}
    </span>
  );
};

export default FormResponses;