import React from "react";
import ProfileTabCard from "./ProfileTabCard";

function ExperienceTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Experience</h3>
        <button className="text-sm text-[#00d4c8] hover:text-[#00bfb3]">
          Add Experience
        </button>
      </div>

      <div className="space-y-6">
        <ProfileTabCard
          title="1234 Company"
          onEdit={() => console.log("Edit 1234 Company")}
          onDelete={() => console.log("Delete 1234 Company")}
        >
          <p className="text-sm text-gray-600">Role (Full time)</p>
          <p className="text-sm text-gray-500">1 Jan 1900 - 31 Dec 2024</p>
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Tasks & Responsibilities</h5>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Do coding</li>
            </ul>
          </div>
        </ProfileTabCard>

        <ProfileTabCard
          title="Dynamik Technologies"
          onEdit={() => console.log("Edit Dynamik")}
          onDelete={() => console.log("Delete Dynamik")}
        >
          <p className="text-sm text-gray-600">Tester (Contract)</p>
          <p className="text-sm text-gray-500">27 Dec 2024 - present</p>
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Tasks & Responsibilities</h5>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Testing</li>
            </ul>
          </div>
        </ProfileTabCard>
      </div>
    </div>
  );
}

export default ExperienceTab;
