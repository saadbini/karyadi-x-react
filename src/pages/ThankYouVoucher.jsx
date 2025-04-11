import React from 'react';

const ThankYouVoucher = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-2xl">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">Thank you for completing the survey!</h2>
        <h2 className="text-9xl font-semibold text-gray-900 mb-3 border-4 border-transparent p-4">🎫</h2>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">You are now eligible to receive a voucher</h2>
        <p className="text-gray-600 mb-6">Please take a screenshot of this page <div>and present it to the organizer to claim your free voucher.</div></p>

        <button
          onClick={() => window.location.href = '/forms'}
          className="px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Go back to forms
        </button>
      </div>
    </div>
  );
};

export default ThankYouVoucher;