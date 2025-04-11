import React from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

const ProfileTabCard = ({ title, onEdit, onDelete, children }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
      <div className="flex justify-between items-start mb-2">
        {/* Title */}
        <h4 className="text-base font-medium text-gray-800">{title}</h4>

        {/* Edit / Delete buttons */}
        <div className="flex gap-2 text-xl text-gray-500">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-xl text-[#00d4c8] hover:text-[#00bfb3] block mt-2s"
              title="Edit"
            >
              <HiOutlinePencil />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xl text-[#FF5349] hover:text-[#CC5500] block mt-2s"
              title="Delete"
            >
              <HiOutlineTrash />
            </button>
          )}
        </div>
      </div>

      {/* Custom Content */}
      <div>{children}</div>
    </div>
  );
};

export default ProfileTabCard;
