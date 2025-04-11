import React, { useState } from 'react';
import { countries } from 'countries-list';

const countryOptions = Object.entries(countries).map(([code, country]) => ({
  value: code,
  label: country.name
}));

export default function OptionsBuilder({ 
  options = [], 
  onAddOption, 
  onRemoveOption, 
  type,
  dropdownType,
  onDropdownTypeChange 
}) {
  const [newOption, setNewOption] = useState('');

  const handleAdd = () => {
    if (newOption.trim()) {
      onAddOption(newOption.trim());
      setNewOption('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newOption.trim()) {
      handleAdd();
    }
  };

  return (
    <div className="mb-4">
      {type === 'dropdown' && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Dropdown Type
          </label>
          <select
            value={dropdownType}
            onChange={(e) => onDropdownTypeChange(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          >
            <option value="default">Regular Dropdown</option>
            <option value="with_other">Dropdown with "Other" Option</option>
            <option value="countries">Countries Dropdown</option>
          </select>

          {dropdownType === 'with_other' && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Other option text..."
                disabled
                className="w-full p-2 border rounded-md bg-gray-100"
              />
            </div>
          )}

          {dropdownType === 'countries' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mt-2">Available countries:</p>
              <select className="w-full p-2 border rounded-md" disabled>
                <option value="">Select a country</option>
                {countryOptions.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500">
                This preview shows all {countryOptions.length} countries that will be available
              </p>
            </div>
          )}
        </div>
      )}

      {dropdownType !== 'countries' && (
        <>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="flex-1 p-2 border rounded-md"
              onKeyPress={handleKeyPress}
            />
            <button 
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleAdd}
            >
              Add Option
            </button>
          </div>

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{option}</span>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => onRemoveOption(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}