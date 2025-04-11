import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileHeader from '../components/userProfile/ProfileHeader';
import ProfileTabs from '../components/userProfile/ProfileTabs';
import SkillsTab from '../components/userProfile/SkillsTab';
import ExperienceTab from '../components/userProfile/ExperienceTab';
import CertificationTab from '../components/userProfile/CertificationTab';
import EducationTab from '../components/userProfile/EducationTab';

function Profile() {
  const [activeTab, setActiveTab] = useState('skills');
  const tabs = ['skills', 'experience', 'certifications', 'education'];

  const { user } = useAuth();
  const { id: paramUserId } = useParams(); // From URL (e.g., /profile/user/15)
  const location = useLocation();

  const isAdminOrCompany = user?.userType === 'admin' || user?.userType === 'company';

  // Determine if viewing own profile or another user's profile
  const isViewingOwnProfile = !location.pathname.includes('/user/');
  const userId = isViewingOwnProfile ? user.id : paramUserId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {isAdminOrCompany && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/employeeDashboard"
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#00d4c8] to-[#00bfb3] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                Employee Dashboard
              </Link>
              <Link
                to="/eventAdmin"
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#ff4d1c] to-[#ff6b47] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                Event Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      <ProfileHeader userId={userId} />

      <div className="bg-white rounded-lg shadow-md">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        <div className="p-6">
          {activeTab === 'skills' && <SkillsTab userId={userId} />}
          {activeTab === 'experience' && <ExperienceTab userId={userId} />}
          {activeTab === 'certifications' && <CertificationTab userId={userId} />}
          {activeTab === 'education' && <EducationTab userId={userId} />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
