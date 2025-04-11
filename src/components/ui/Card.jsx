import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
