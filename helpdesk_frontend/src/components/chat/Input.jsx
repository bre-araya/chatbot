import React from "react";

export default function Input({ value, onChange, placeholder, className, disabled, onKeyDown }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input ${className || ""}`}
      disabled={disabled}
      onKeyDown={onKeyDown}
    />
  );
}
