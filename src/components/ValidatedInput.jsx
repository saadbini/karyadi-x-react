// components/common/ValidatedInput.jsx
import React from "react";

function ValidatedInput({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  list,
  ...rest
}) {
  return (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        list={list}
        className={`w-full border px-3 py-2 rounded ${error ? "border-red-500" : ""}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default ValidatedInput;
