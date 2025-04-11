import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.userType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            You don't have access to this page
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Please contact your administrator if you believe this is a mistake.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
