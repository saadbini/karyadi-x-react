import React from 'react';
import FormQuestion from './FormQuestion';

const FormContainer = ({ form, responses, onInputChange, submitting, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {form.questions.map((question) => (
        <FormQuestion
          key={question.id}
          question={question}
          value={responses[question.id]}
          onChange={onInputChange}
        />
      ))}
      
      <div className="flex justify-between items-center mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default FormContainer;
