// src/utils/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ size = 24, color = "#00bfb3", className = "" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-transparent ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopColor: "transparent",
      }}
    />
  );
};

export default LoadingSpinner;
