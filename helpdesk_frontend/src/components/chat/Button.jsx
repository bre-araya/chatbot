import React from "react";

export default function Button({ onClick, children, className, loading }) {
  return (
    <button
      onClick={loading ? undefined : onClick}
      className={`btn ${className || ""}`}
      disabled={loading}
    >
      {loading ? "⏳" : children}
    </button>
  );
}
