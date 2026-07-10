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
      // Call Django login API
      const res = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
        username,
        password,
      });

      // Store JWT tokens
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Trigger LandingPage to show chatbot
      onSuccess();

      // Close login modal
      onClose();
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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

      <p>
        Don’t have an account?{" "}
        <span className="link" onClick={switchToSignup}>
          Sign up
        </span>
      </p>
      <button className="close-btn" onClick={onClose}>✖</button>
    </div>
  );
};

export default LoginForm;
