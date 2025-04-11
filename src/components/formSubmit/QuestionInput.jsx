import React from 'react';

const QuestionInput = ({ question, value, onChange }) => {
  const { id, type, options = [], additional_settings = {} } = question;
  
  switch (type) {
    case 'text':
      return (
        <input
          type="text"
          id={`question-${id}`}
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          required={question.is_required}
        />
      );
      
    case 'multiple_choice':
      return (
        <div className="space-y-2">
          {options.map((option, idx) => (
            <div key={idx} className="flex items-center">
              <input
                type="radio"
                id={`question-${id}-option-${idx}`}
                name={`question-${id}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(id, e.target.value)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                required={question.is_required}
              />
              <label htmlFor={`question-${id}-option-${idx}`} className="ml-3 block text-sm text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      );
      
    case 'checkbox':
      return (
        <div className="space-y-2">
          {options.map((option, idx) => (
            <div key={idx} className="flex items-center">
              <input
                type="checkbox"
                id={`question-${id}-option-${idx}`}
                value={option}
                checked={(value || []).includes(option)}
                onChange={(e) => {
                  const newValues = [...(value || [])];
                  if (e.target.checked) {
                    newValues.push(option);
                  } else {
                    const index = newValues.indexOf(option);
                    if (index > -1) {
                      newValues.splice(index, 1);
                    }
                  }
                  onChange(id, newValues);
                }}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor={`question-${id}-option-${idx}`} className="ml-3 block text-sm text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      );
      
    case 'rating':
      return (
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(id, rating.toString())}
              className="focus:outline-none"
              aria-label={`${rating} stars`}
            >
              <svg 
                className={`w-8 h-8 ${
                  parseInt(value, 10) >= rating 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {value ? `${value} star${parseInt(value, 10) > 1 ? 's' : ''}` : 'Select rating'}
          </span>
        </div>
      );
      
    case 'likert_single':
      return (
        <div className="grid grid-cols-5 gap-1 text-center text-xs md:text-sm">
          {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, idx) => (
            <label key={idx} className="flex flex-col items-center">
              <input
                type="radio"
                name={`question-${id}`}
                value={(idx + 1).toString()}
                checked={value === (idx + 1).toString()}
                onChange={() => onChange(id, (idx + 1).toString())}
                className="sr-only"
                required={question.is_required}
              />
              <span 
                className={`w-full py-2 rounded cursor-pointer ${
                  value === (idx + 1).toString() 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {option}
              </span>
            </label>
          ))}
        </div>
      );
      
    case 'likert_matrix':
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, idx) => (
                  <th key={idx} className="px-2 py-2 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {option}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {additional_settings.subQuestions?.map((subQ, subIdx) => (
                <tr key={subIdx} className={subIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 whitespace-normal text-sm text-gray-900">
                    {subQ}
                  </td>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <td key={rating} className="px-1 py-2 text-center">
                      <input
                        type="radio"
                        name={`question-${id}-subq-${subIdx}`}
                        value={rating.toString()}
                        checked={value?.[subQ] === rating.toString()}
                        onChange={() => {
                          const newValue = { ...(value || {}) };
                          newValue[subQ] = rating.toString();
                          onChange(id, newValue);
                        }}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                        required={question.is_required}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
    case 'dropdown':
      const dropdownType = additional_settings.dropdownType || 'default';
      let dropdownOptions = options;
      
      if (dropdownType === 'countries' && additional_settings.options) {
        dropdownOptions = additional_settings.options;
      }
      
      return (
        <div>
          <select
            id={`question-${id}`}
            value={value || ''}
            onChange={(e) => onChange(id, e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md"
            required={question.is_required}
          >
            <option value="">Select an option</option>
            {dropdownOptions.map((option, idx) => (
              <option key={idx} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
            {dropdownType === 'with_other' && (
              <option value="other">Other</option>
            )}
          </select>
          {dropdownType === 'with_other' && value === 'other' && (
            <input
              type="text"
              placeholder="Please specify"
              value={value?.[`${id}_other`] || ''}
              onChange={(e) => onChange(`${id}_other`, e.target.value)}
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              required
            />
          )}
        </div>
      );
      
    default:
      return <p className="text-red-500">Unsupported question type: {type}</p>;
  }
};

export default QuestionInput;
