// src/components/forms/StepIndicator.jsx
import React from "react";

export default function StepIndicator({ currentStep }) {
  const steps = [
    "Create Event",
    "Add Agenda",
    "Add Organizer",
    "Add Partner",
    "Add Sponsor",
    "Add Collaborator",
  ];

  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 text-center">
          <div
            className={`w-8 h-8 mx-auto rounded-full ${
              currentStep === index + 1
                ? "bg-[#2CBCB2] text-white"
                : "bg-gray-300 text-gray-600"
            } flex items-center justify-center`}
          >
            {index + 1}
          </div>
          <p
            className={`mt-2 ${
              currentStep === index + 1 ? "text-[#2CBCB2]" : "text-gray-600"
            }`}
          >
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}
