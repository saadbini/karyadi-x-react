import React from 'react';

export default function InputField({ 
  label, 
  id, 
  type = 'text', 
  required = false, 
  value, 
  onChange, 
  placeholder = '' 
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-karyadi-teal focus:border-karyadi-teal focus:z-10 sm:text-sm"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}