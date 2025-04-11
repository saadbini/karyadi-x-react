import React from 'react';

export default function ActiveFilters({ filters, setFilters }) {
  const removeFilter = (field, value) => {
    const newFilters = { ...filters };
    newFilters[field] = filters[field].filter(v => v !== value);
    if (newFilters[field].length === 0) {
      delete newFilters[field];
    }
    setFilters(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => filters[key] && filters[key].length > 0
  );

  if (!hasActiveFilters) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-sm text-gray-700">Active Filters:</span>
        {Object.entries(filters).map(([field, values]) => 
          values && values.map(value => (
            <span
              key={`${field}-${value}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-gray-200 text-gray-700"
            >
              {field.replace(/([A-Z])/g, ' $1').toLowerCase()}: {value}
              <button
                onClick={() => removeFilter(field, value)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))
        )}
        <button
          onClick={() => setFilters({})}
          className="text-sm text-[#00d4c8] hover:text-[#00bfb3] font-medium"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}