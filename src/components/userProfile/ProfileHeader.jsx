import React, { useState, useEffect } from "react";
import { FaSpinner, FaCircleExclamation } from "react-icons/fa6";
import { UserProfileAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { countries } from 'countries-list';
import { toast } from "react-hot-toast";

function ProfileHeader({ userId }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    id: null,
    display_name: '',
    gender: '',
    date_of_birth: '',
    user_location: '',
    nationality: '',
    language: '',
    profile_desc: '',
    profile_img: '',
  });

  // Load profile
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        let res;
        if (user.userType === "admin" || user.userType === "company") {
          if (!userId) throw new Error("User ID not provided for admin/company.");
          res = await UserProfileAPI.getProfileByUserId(userId);
        } else {
          res = await UserProfileAPI.getOwnProfile();
        }

        setProfileData({
          ...res.data,
          gender: res.data.gender || '',
          date_of_birth: res.data.date_of_birth || '',
          nationality: res.data.nationality || '',
          language: res.data.language || '',
          user_location: res.data.user_location || '',
          profile_desc: res.data.profile_desc || '',
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error loading profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, userId]);

  // Save profile
  const handleSave = () => {
    const payload = {
      ...profileData,
      date_of_birth: profileData.date_of_birth
        ? new Date(profileData.date_of_birth).toISOString().split('T')[0]
        : null
    };
  
    const isAdminOrCompany = user.userType === "admin" || user.userType === "company";

    const updateProfile = isAdminOrCompany
      ? UserProfileAPI.updateProfile(profileData.id, payload) // PUT /profile/:id
      : UserProfileAPI.updateOwnProfile(payload);             // PUT /profile/me

  
    updateProfile
      .then(() => {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      })
      .catch((e) => {
        toast.error("Error updating profile: " + e.message);
      });
  };
  
  

  // Input change handlers (shortened version)
  const handleChange = (field) => (e) => {
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  const countryOptions = Object.values(countries)
    .map((country) => ({ code: country.code, name: country.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Loading & Error UI
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 text-center">
        <FaSpinner className="animate-spin h-6 w-6 text-gray-500 mx-auto mb-2" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 text-center text-red-600">
        <FaCircleExclamation className="h-6 w-6 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between space-x-4 mb-6">
        <div className="flex items-center space-x-4">
          {/* <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">Photo</span>
          </div> */}
          <div>
            {isEditing ? (
              <input
                type="text"
                value={profileData.display_name}
                onChange={handleChange("display_name")}
                className="text-2xl font-bold border rounded-sm px-2 py-1 mb-1"
              />
            ) : (
              <h1 className="text-2xl font-bold">{profileData.display_name}</h1>
            )}
          </div>
        </div>

        <div>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-[#00d4c8] text-white px-4 py-2 rounded-sm mr-2 hover:bg-[#00bfb3]"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-sm hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#00d4c8] text-white px-4 py-2 rounded-sm hover:bg-[#00bfb3]"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Gender & DOB */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Gender</label>
          {isEditing ? (
            <select
              value={profileData.gender}
              onChange={handleChange("gender")}
              className="block w-full mt-1"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <p className="mt-1 text-gray-600 capitalize">{profileData.gender}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Date of Birth</label>
          {isEditing ? (
            <input
            type="date"
            value={
              profileData.date_of_birth
                ? new Date(profileData.date_of_birth).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange("date_of_birth")}
            className="block w-full mt-1"
          />                   
          ) : (
            <p className="mt-1 text-gray-600">
              {new Date(profileData.date_of_birth).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>

      {/* Language & Location */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Language</label>
          {isEditing ? (
            <select
              value={profileData.language}
              onChange={handleChange("language")}
              className="block w-full mt-1"
            >
              <option value="">Select language</option>
              <option value="english">English</option>
              <option value="malay">Malay</option>
              <option value="chinese">Chinese</option>
            </select>
          ) : (
            <p className="mt-1 text-gray-600 capitalize">{profileData.language}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Location</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.user_location}
              onChange={handleChange("user_location")}
              className="block w-full mt-1"
            />
          ) : (
            <p className="mt-1 text-gray-600">{profileData.user_location}</p>
          )}
        </div>
      </div>

      {/* Nationality */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700">Nationality</label>
        {isEditing ? (
          <select
            value={profileData.nationality}
            onChange={handleChange("nationality")}
            className="block w-full mt-1"
          >
            <option value="">Select country</option>
            {countryOptions.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
            ))}
          </select>
        ) : (
          <p className="mt-1 text-gray-600">{profileData.nationality}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        {isEditing ? (
          <textarea
            value={profileData.profile_desc}
            onChange={handleChange("profile_desc")}
            rows="3"
            className="block w-full mt-1"
          />
        ) : (
          <p className="mt-1 text-gray-600">{profileData.profile_desc}</p>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;
