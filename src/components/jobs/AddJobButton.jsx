import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AddJobButton() {
  const { user } = useContext(AuthContext);

  // Only show button for company users and admins
  if (!user || !['company', 'admin'].includes(user.userType)) {
    return null;
  }

  return (
    <Link
      to="/jobs/create"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-karyadi-teal hover:bg-karyadi-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-karyadi-teal"
    >
      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Post New Job
    </Link>
  );
}