import React, { useState, useEffect } from 'react';

export default function QuestionDetailsModal({ question, sections, onClose, onUpdate }) {
  const [editedQuestion, setEditedQuestion] = useState({ ...question });
  const [newOption, setNewOption] = useState('');

  // Handle section jumps for multiple choice questions
  const [sectionJumps, setSectionJumps] = useState(question.sectionJumps || {});

  useEffect(() => {
    setEditedQuestion({ ...question });
    setSectionJumps(question.sectionJumps || {});
  }, [question]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: updatedOptions });
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    setEditedQuestion({
      ...editedQuestion,
      options: [...editedQuestion.options, newOption]
    });
    setNewOption('');
  };

  const removeOption = (index) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions.splice(index, 1);
    
    // Also remove any section jumps for this option
    const updatedJumps = { ...sectionJumps };
    delete updatedJumps[index];
    
    // Reindex the jumps since options shifted
    const newJumps = {};
    Object.keys(updatedJumps).forEach(key => {
      const numKey = parseInt(key);
      if (numKey > index) {
        newJumps[numKey - 1] = updatedJumps[key];
      } else {
        newJumps[key] = updatedJumps[key];
      }
    });
    
    setSectionJumps(newJumps);
    setEditedQuestion({ ...editedQuestion, options: updatedOptions });
  };

  const handleSectionJumpChange = (optionIndex, sectionId) => {
    const updatedJumps = { ...sectionJumps };
    if (sectionId) {
      updatedJumps[optionIndex] = sectionId;
    } else {
      delete updatedJumps[optionIndex];
    }
    setSectionJumps(updatedJumps);
  };

  const handleSubmit = () => {
    // Include section jumps in the updated question
    onUpdate({
      ...editedQuestion,
      sectionJumps: editedQuestion.type === 'multiple_choice' ? sectionJumps : {}
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Question</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Question</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={editedQuestion.question}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Question Type</label>
          <select
            className="w-full p-2 border rounded"
            value={editedQuestion.type}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, type: e.target.value })}
          >
            <option value="text">Text</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={editedQuestion.required}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, required: e.target.checked })}
              className="mr-2"
            />
            <span>Required Question</span>
          </label>
        </div>
        
        {/* Section selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Assign to Section</label>
          <select
            className="w-full p-2 border rounded"
            value={editedQuestion.section_id || ''}
            onChange={(e) => setEditedQuestion({ 
              ...editedQuestion, 
              section_id: e.target.value ? parseInt(e.target.value) : null 
            })}
          >
            <option value="">Main Form (No Section)</option>
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>
        
        {/* Options for multiple choice, checkbox, or dropdown */}
        {['multiple_choice', 'checkbox', 'dropdown'].includes(editedQuestion.type) && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Options</label>
            {editedQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="flex-grow p-2 border rounded"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                
                {/* Section jump selector (only for multiple choice) */}
                {editedQuestion.type === 'multiple_choice' && (
                  <select
                    className="ml-2 p-2 border rounded"
                    value={sectionJumps[index] || ''}
                    onChange={(e) => handleSectionJumpChange(index, e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">No jump</option>
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>
                        Jump to: {section.title}
                      </option>
                    ))}
                  </select>
                )}
                
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-2 p-1 bg-red-500 text-white rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            
            <div className="flex items-center mt-2">
              <input
                type="text"
                className="flex-grow p-2 border rounded"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add a new option"
              />
              <button
                type="button"
                onClick={addOption}
                className="ml-2 p-2 bg-blue-500 text-white rounded"
              >
                +
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}