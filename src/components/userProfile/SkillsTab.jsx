import React from 'react';
import { HiOutlinePencil } from "react-icons/hi2";

function SkillsTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Skills</h3>
        <button className="text-sm text-[#00d4c8] hover:text-[#00bfb3]">
          Add Skill
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
          <div>
            <h4 className="font-medium">Python</h4>
            <p className="text-sm text-gray-500">Master</p>
          </div>
          <button className="text-gray-600 hover:text-black text-2xl">
            <span className="sr-only">Edit</span>
            <HiOutlinePencil />
          </button>
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
          <div>
            <h4 className="font-medium">Econometrics</h4>
            <p className="text-sm text-gray-500">Proficient</p>
          </div>
          <button className="text-gray-600 hover:text-black text-2xl">
            <span className="sr-only">Edit</span>
            <HiOutlinePencil />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SkillsTab;