import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginForm.css";

const LoginForm = ({ onSuccess, switchToSignup, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
        username,
        password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      onSuccess();
      onClose();
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <div>
          <h2>Welcome back</h2>
          <p>Login to continue your smart ride support experience.</p>
        </div>
        <button className="close-btn" onClick={onClose} type="button">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-body">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>

      <p className="switch-line">
        Don’t have an account? <span className="link" onClick={switchToSignup}>Sign up</span>
      </p>
    </div>
  );
};

export default LoginForm;
