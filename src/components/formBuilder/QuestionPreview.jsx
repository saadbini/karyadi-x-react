import React from 'react';

export default function QuestionPreview({ 
  questions, 
  sections,
  onMoveUp, 
  onMoveDown, 
  onDelete, 
  onEdit,
  activeSectionId
}) {
  // Filter questions based on section
  const filteredQuestions = activeSectionId
    ? questions.filter(q => q.section_id === activeSectionId)
    : questions.filter(q => !q.section_id);
    
  // Find section name if we're showing a specific section
  const sectionName = activeSectionId 
    ? sections.find(s => s.id === activeSectionId)?.title 
    : 'Main Form';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {activeSectionId ? `Questions in ${sectionName}` : 'Questions in Main Form'}
      </h2>
      
      {filteredQuestions.length === 0 ? (
        <p className="text-gray-500 italic">No questions added to this section yet.</p>
      ) : (
        <ul className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <li key={question.id} className="p-4 border rounded-md">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{question.question}</p>
                  <p className="text-sm text-gray-500">Type: {question.type}</p>
                  {question.required && <p className="text-sm text-red-500">Required</p>}
                </div>
                <div className="flex space-x-2">
                  <button 
                    type="button" 
                    onClick={() => onMoveUp(questions.indexOf(question))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ↑
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onMoveDown(questions.indexOf(question))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ↓
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onEdit(question)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onDelete(questions.indexOf(question))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}