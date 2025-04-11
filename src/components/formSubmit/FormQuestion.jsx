import React from 'react';
import QuestionInput from './QuestionInput';

const FormQuestion = ({ question, value, onChange }) => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <label htmlFor={`question-${question.id}`} className="block text-lg font-medium text-gray-900 mb-2">
        {question.question} {question.is_required && <span className="text-red-500">*</span>}
      </label>
      <QuestionInput 
        question={question}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormQuestion;
