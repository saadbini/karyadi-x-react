import React, { useState } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import { authAPI } from "../../utils/api";

export default function MemberRegistrationForm({ onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any previous errors

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        userType: "member",
      });

      setRegistrationSuccess(true);
      onRegistrationSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      <InputField
        label="Full Name"
        id="name"
        required
        value={formData.name}
        onChange={handleChange}
      />
      <InputField
        label="Email"
        id="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
      />
      <InputField
        label="Password"
        id="password"
        type="password"
        required
        value={formData.password}
        onChange={handleChange}
      />
      <InputField
        label="Confirm Password"
        id="confirmPassword"
        type="password"
        required
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <InputField
        label="Phone Number"
        id="phoneNumber"
        type="tel"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <SubmitButton isLoading={isLoading} disabled={registrationSuccess}>
        {registrationSuccess ? "Registered" : "Register as Member"}
      </SubmitButton>
    </form>
  );
}
