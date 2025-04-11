import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import TabGroup from "../components/tabs/TabGroup";
import MemberRegistrationForm from "../components/forms/MemberRegistrationForm";
import CompanyRegistrationForm from "../components/forms/CompanyRegistrationForm";
import backgroundImage from "../assets/KARYADI_Home.SampleBackgroundImage3.jpg";

const tabs = [
  { id: "member", label: "Register as Member" },
  { id: "company", label: "Register as Company (Coming Soon)", disabled: true },
];

export default function Register() {
  const [activeTab, setActiveTab] = useState("member");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
  };

  const handleTabChange = (tabId) => {
    if (tabId === 'company') {
      return; // Prevent switching to company tab
    }
    setActiveTab(tabId);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-2xl w-full space-y-8 bg-white/95 p-10 rounded-2xl shadow-2xl backdrop-blur-lg">
        <div className="flex flex-col items-center">
          <Logo className="w-32 h-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our community and unlock exclusive features
          </p>
        </div>

        <div className="mt-8">
          <TabGroup
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            tabs={tabs}
            registrationSuccess={registrationSuccess}
            className="bg-gray-100 p-1 rounded-lg"
          />
        </div>

        <div className="mt-8">
          {registrationSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Registration successful! You can now log in to your account.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg">
              {activeTab === "member" ? (
                <MemberRegistrationForm
                  onRegistrationSuccess={handleRegistrationSuccess}
                />
              ) : (
                <CompanyRegistrationForm
                  onRegistrationSuccess={handleRegistrationSuccess}
                />
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            to="/login"
            className="inline-flex justify-center py-3 px-6 border border-[#2CBCB2] text-sm font-medium rounded-lg text-teal-600 bg-transparent hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  );
}