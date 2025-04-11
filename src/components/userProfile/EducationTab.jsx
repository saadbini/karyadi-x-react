import React, { useEffect, useState } from "react";
import { educationAPI } from "../../utils/api";
import { HiOutlinePencil, HiPlusCircle, HiXMark } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import ProfileTabCard from "./ProfileTabCard";
import LoadingSpinner from "../../utils/LoadingSpinner";

function EducationTab({ userId }) {
  const [educationList, setEducationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
  education_level: "",
  institution_name: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  education_status: "Completed",
  grade: "",
  activities: "",
  description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdu, setCurrentEdu] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  
  const validateForm = () => {
    const errors = {};
    if (!formData.education_level.trim()) errors.education_level = "Required";
    if (!formData.institution_name.trim()) errors.institution_name = "Required";
    if (!formData.start_date) errors.start_date = "Required";
    if (formData.education_status !== "Ongoing" && !formData.end_date)
      errors.end_date = "Required";
  
    // Date logic
    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.start_date) > new Date(formData.end_date)
    ) {
      errors.date = "Start date cannot be after end date.";
    }
  
    return errors;
  };

  const handleDeleteEducation = async () => {
    try {
      await educationAPI.deleteEducation(deleteId);
      toast.success("Education deleted!");
      const refreshed = await educationAPI.getEducationByUserId(userId);
      setEducationList(refreshed.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete education.");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };  
  
  const handleCreateEducation = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    try {
      await educationAPI.createEducation({ ...formData, user_id: userId });
      toast.success("Education added!");
      setShowModal(false);
      setFormData({
        education_level: "",
        institution_name: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        education_status: "Completed",
        grade: "",
        activities: "",
        description: "",
      });
      const refreshed = await educationAPI.getEducationByUserId(userId);
      setEducationList(refreshed.data);
    } catch (error) {
      console.error("Create failed:", error);
      toast.error("Failed to add education.");
    }
  };
  

  useEffect(() => {
    if (!userId) return;

    const fetchEducation = async () => {
      try {
        const res = await educationAPI.getEducationByUserId(userId);
        setEducationList(res.data);
      } catch (err) {
        console.error("Error fetching education:", err);
        toast.error("Failed to load education history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducation();
  }, [userId]);

  return (
      
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Education</h3>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-[#00d4c8] hover:text-[#00bfb3]"
        >
          Add Education
        </button>
      </div>

    {isLoading ? (
    <div className="flex justify-center items-center py-8">
        <LoadingSpinner size={32} />
    </div>
    ) : educationList.length === 0 ? (
    <p className="text-gray-500">No education history added yet.</p>
    ) : (
    <ul className="space-y-3">
        {educationList.map((edu) => (
        <li key={edu.id}>
            <ProfileTabCard
            title={edu.institution_name}
            onEdit={() => {
                setCurrentEdu(edu);
                setIsEditing(true);
              }}              
            onDelete={() => {
                setDeleteId(edu.id);
                setShowDeleteConfirm(true);
              }}
            >
            <div className="text-sm text-gray-600">
                {edu.degree} - {edu.field_of_study}
            </div>
            <div className="text-sm mt-1 text-gray-600">
                {new Date(edu.start_date).toLocaleDateString()}{" "}
                &ndash;{" "}
                {edu.education_status === "Ongoing"
                ? "Present"
                : new Date(edu.end_date).toLocaleDateString()}
            </div>
            {edu.grade && (
                <div className="text-sm mt-1 text-gray-600">
                Grade: {edu.grade}
                </div>
            )}
            {edu.activities && (
                <div className="text-sm mt-2 text-gray-600">
                <span className="font-medium">Activities: </span>{edu.activities}
                </div>
            )}

            {edu.description && (
                <div className="text-sm mt-2 text-gray-600">
                <span className="font-medium">Description: </span>{edu.description}
                </div>
            )}
            </ProfileTabCard>
        </li>
        ))}
    </ul>
    )}

{/* Add Modal */}

{showModal && (
  <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
    <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl relative animate-fadeIn">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        onClick={() => setShowModal(false)}
      >
        <HiXMark size={20} />
      </button>

      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Education History</h3>

      {/* SECTION: School Info */}
      <p className="text-sm font-semibold text-gray-600 mb-2">School Info</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="education_level"
          value={formData.education_level}
          onChange={handleInputChange}
          placeholder="e.g. Secondary, Tertiary"
          className={`w-full border px-3 py-2 rounded ${formErrors.education_level ? "border-red-500" : ""}`}
        />
        <input
          name="institution_name"
          value={formData.institution_name}
          onChange={handleInputChange}
          placeholder="Institution Name"
          className={`w-full border px-3 py-2 rounded ${formErrors.institution_name ? "border-red-500" : ""}`}
        />
        <input
          name="degree"
          value={formData.degree}
          onChange={handleInputChange}
          placeholder="e.g. Bachelor's, A-Level"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="field_of_study"
          value={formData.field_of_study}
          onChange={handleInputChange}
          placeholder="Field of Study (optional)"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* SECTION: Dates */}
      <p className="text-sm font-semibold text-gray-600 mt-6 mb-2">Dates</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleInputChange}
          className={`w-full border px-3 py-2 rounded ${formErrors.start_date ? "border-red-500" : ""}`}
        />
        {formData.education_status !== "Ongoing" && (
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded ${formErrors.end_date ? "border-red-500" : ""}`}
          />
        )}
      </div>

      {/* SECTION: Status & Grade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <select
          name="education_status"
          value={formData.education_status}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Completed">Completed</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>

        <input
          name="grade"
          value={formData.grade}
          onChange={handleInputChange}
          placeholder="e.g. 3.5 GPA, First Class"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* SECTION: Activities & Description */}
      <p className="text-sm font-semibold text-gray-600 mt-6 mb-2">Experience</p>
      <input
        name="activities"
        value={formData.activities}
        onChange={handleInputChange}
        placeholder="Activities, societies, clubs..."
        className="w-full border px-3 py-2 rounded mb-3"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="What did you learn, do, or build?"
        className="w-full border px-3 py-2 rounded"
        rows={3}
      />

      {/* Buttons */}
      <div className="flex justify-end pt-6 gap-2">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateEducation}
          className="px-4 py-2 bg-[#00d4c8] text-white rounded hover:bg-[#00bfb3] transition"
        >
          Save Education
        </button>
      </div>
    </div>
  </div>
)}

{/* Edit Modal */}

{isEditing && currentEdu && (
  <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
    <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl relative animate-fadeIn">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        onClick={() => {
          setIsEditing(false);
          setCurrentEdu(null);
        }}
      >
        <HiXMark size={20} />
      </button>

      <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Education</h3>

      {/* School Info */}
      <p className="text-sm font-semibold text-gray-600 mb-2">School Info</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="education_level"
          value={currentEdu.education_level}
          onChange={(e) =>
            setCurrentEdu({ ...currentEdu, education_level: e.target.value })
          }
          placeholder="Education Level"
          className={`w-full border px-3 py-2 rounded ${editErrors.education_level ? "border-red-500" : ""}`}
        />
        <input
          name="institution_name"
          value={currentEdu.institution_name}
          onChange={(e) =>
            setCurrentEdu({ ...currentEdu, institution_name: e.target.value })
          }
          placeholder="Institution Name"
          className={`w-full border px-3 py-2 rounded ${editErrors.institution_name ? "border-red-500" : ""}`}
        />
        <input
          name="degree"
          value={currentEdu.degree}
          onChange={(e) => setCurrentEdu({ ...currentEdu, degree: e.target.value })}
          placeholder="Degree"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="field_of_study"
          value={currentEdu.field_of_study}
          onChange={(e) => setCurrentEdu({ ...currentEdu, field_of_study: e.target.value })}
          placeholder="Field of Study"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Dates */}
      <p className="text-sm font-semibold text-gray-600 mt-6 mb-2">Dates</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="date"
          name="start_date"
          value={currentEdu.start_date?.slice(0, 10)}
          onChange={(e) => setCurrentEdu({ ...currentEdu, start_date: e.target.value })}
          className={`w-full border px-3 py-2 rounded ${editErrors.start_date ? "border-red-500" : ""}`}
        />
        {currentEdu.education_status !== "Ongoing" && (
          <input
            type="date"
            name="end_date"
            value={currentEdu.end_date?.slice(0, 10) || ""}
            onChange={(e) => setCurrentEdu({ ...currentEdu, end_date: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${editErrors.end_date ? "border-red-500" : ""}`}
          />
        )}
      </div>

      {/* Status & Grade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <select
          name="education_status"
          value={currentEdu.education_status}
          onChange={(e) => setCurrentEdu({ ...currentEdu, education_status: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Completed">Completed</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>

        <input
          name="grade"
          value={currentEdu.grade}
          onChange={(e) => setCurrentEdu({ ...currentEdu, grade: e.target.value })}
          placeholder="Grade"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Activities & Description */}
      <p className="text-sm font-semibold text-gray-600 mt-6 mb-2">Experience</p>
      <input
        name="activities"
        value={currentEdu.activities}
        onChange={(e) => setCurrentEdu({ ...currentEdu, activities: e.target.value })}
        placeholder="Activities, societies, clubs..."
        className="w-full border px-3 py-2 rounded mb-3"
      />
      <textarea
        name="description"
        value={currentEdu.description}
        onChange={(e) => setCurrentEdu({ ...currentEdu, description: e.target.value })}
        placeholder="What did you learn, do, or build?"
        className="w-full border px-3 py-2 rounded"
        rows={3}
      />

      {/* Buttons */}
      <div className="flex justify-end pt-6 gap-2">
        <button
          onClick={() => {
            setIsEditing(false);
            setCurrentEdu(null);
          }}
          className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            const errors = {};
            if (!currentEdu.education_level) errors.education_level = "Required";
            if (!currentEdu.institution_name) errors.institution_name = "Required";
            if (!currentEdu.start_date) errors.start_date = "Required";
            if (currentEdu.education_status !== "Ongoing" && !currentEdu.end_date)
              errors.end_date = "Required";
            if (
              currentEdu.start_date &&
              currentEdu.end_date &&
              new Date(currentEdu.start_date) > new Date(currentEdu.end_date)
            ) {
              errors.date = "Start date cannot be after end date";
            }

            if (Object.keys(errors).length > 0) {
              setEditErrors(errors);
              return;
            }

            try {
              await educationAPI.updateEducation(currentEdu.id, currentEdu);
              toast.success("Education updated!");
              const refreshed = await educationAPI.getEducationByUserId(userId);
              setEducationList(refreshed.data);
              setIsEditing(false);
              setCurrentEdu(null);
            } catch (error) {
              console.error(error);
              toast.error("Failed to update education.");
            }
          }}
          className="px-4 py-2 bg-[#00bfb3] text-white rounded hover:bg-[#00a99d] transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

{showDeleteConfirm && (
  <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl animate-fadeIn relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        onClick={() => {
          setShowDeleteConfirm(false);
          setDeleteId(null);
        }}
      >
        <HiXMark size={20} />
      </button>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Delete Education Entry?
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this education record? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeleteId(null);
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteEducation}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default EducationTab;
