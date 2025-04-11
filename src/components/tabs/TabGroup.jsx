import React from "react";

export default function TabGroup({
  activeTab,
  setActiveTab,
  tabs,
  registrationSuccess,
}) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (!registrationSuccess && !tab.disabled) {
                setActiveTab(tab.id);
              }
            }}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm
              ${
                activeTab === tab.id
                  ? "border-[#2CBCB2] text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
              ${registrationSuccess || tab.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
            `}
            disabled={registrationSuccess || tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
