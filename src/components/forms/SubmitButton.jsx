import React from 'react';

export default function SubmitButton({ children, isLoading = false }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2CBCB2] hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2CBCB2] disabled:opacity-50"
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
}