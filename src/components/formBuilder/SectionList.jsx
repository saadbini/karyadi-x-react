import React from 'react';

export default function SectionList({ 
  sections, 
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  activeSection,
  onSectionSelect
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Form Sections</h2>
      
      {sections.length === 0 ? (
        <p className="text-gray-500 italic">No sections added yet. Add sections to organize your form.</p>
      ) : (
        <ul className="space-y-3">
          {sections.map((section, index) => (
            <li 
              key={section.id || index} 
              className={`p-3 rounded-md border ${activeSection === section.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <div className="cursor-pointer" onClick={() => onSectionSelect(section.id)}>
                  <h3 className="font-medium">{section.title}</h3>
                  {section.description && <p className="text-sm text-gray-600">{section.description}</p>}
                </div>
                <div className="flex space-x-2">
                  <button 
                    type="button" 
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onMoveDown(index)}
                    disabled={index === sections.length - 1}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onEdit(section)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onDelete(index)}
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