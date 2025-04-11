import React from 'react';

function ProfileTabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="border-b">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
              activeTab === tab
                ? 'border-[#ff4d1c] text-[#ff4d1c]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default ProfileTabs;