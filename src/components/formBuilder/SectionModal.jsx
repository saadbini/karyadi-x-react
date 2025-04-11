import React, { useState, useEffect } from 'react';

export default function SectionModal({ 
  section, 
  onClose, 
  onUpdate 
}) {
  const [editedSection, setEditedSection] = useState({
    id: null,
    title: '',
    description: '',
    order_number: 1
  });
  
  useEffect(() => {
    if (section) {
      setEditedSection({
        id: section.id,
        title: section.title || '',
        description: section.description || '',
        order_number: section.order_number || 1
      });
    }
  }, [section]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editedSection.title.trim()) return;
    
    onUpdate(editedSection);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {section.id ? 'Edit Section' : 'Add Section'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={editedSection.title}
              onChange={(e) => setEditedSection({...editedSection, title: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Section Description (optional)
            </label>
            <textarea
              value={editedSection.description}
              onChange={(e) => setEditedSection({...editedSection, description: e.target.value})}
              className="w-full p-2 border rounded-md"
              rows="3"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}