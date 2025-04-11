import React from 'react';

export default function SectionBuilder({
    currentSection,
    onSectionChange,
    onAddSection
}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
            <h2 className="text-lg font-semibold mb-4">Add Form Section</h2>

            <input
                type="text"
                value={currentSection.title}
                onChange={(e) => onSectionChange({ ...currentSection, title: e.target.value })}
                placeholder="Section Title"
                className="w-full p-2 border rounded-md mb-4"
            />

            <textarea
                value={currentSection.description}
                onChange={(e) => onSectionChange({ ...currentSection, description: e.target.value })}
                placeholder="Section Description (optional)"
                className="w-full p-2 border rounded-md mb-4"
                rows="2"
            />

            <button
                type="button"
                onClick={onAddSection}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
                disabled={!currentSection.title.trim()}
            >
                Add Section
            </button>
        </div>
    );
}