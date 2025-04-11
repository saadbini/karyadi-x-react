import React from 'react';

const ProgressBar = ({ scrollProgress }) => {
  return (
    <>
      {/* Fixed progress bar at top */}
      <div className="fixed top-0 left-0 w-full h-3 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Progress indicator in bottom corner */}
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full px-3 py-1 text-sm font-semibold text-gray-700 z-50">
        {Math.round(scrollProgress)}% completed
      </div>
    </>
  );
};

export default ProgressBar;
