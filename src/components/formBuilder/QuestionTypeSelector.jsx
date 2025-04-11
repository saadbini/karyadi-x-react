import React from 'react';

const questionTypes = {
  TEXT: 'text',
  CHECKBOX: 'checkbox',
  MULTIPLE_CHOICE: 'multiple_choice',
  RATING: 'rating',
  LIKERT_SINGLE: 'likert_single',
  LIKERT_MATRIX: 'likert_matrix',
  DROPDOWN: 'dropdown'
};

export default function QuestionTypeSelector({ currentType, onChange }) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Choose your question type
      </label>
      <select
        value={currentType}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      >
        <option value={questionTypes.TEXT}>Text Input</option>
        <option value={questionTypes.CHECKBOX}>Checkbox</option>
        <option value={questionTypes.MULTIPLE_CHOICE}>Multiple Choice</option>
        <option value={questionTypes.RATING}>Rating</option>
        <option value={questionTypes.LIKERT_SINGLE}>Likert Scale (Single)</option>
        <option value={questionTypes.LIKERT_MATRIX}>Likert Scale (Matrix)</option>
        <option value={questionTypes.DROPDOWN}>Dropdown</option>
      </select>
    </div>
  );
}