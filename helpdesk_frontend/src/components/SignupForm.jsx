import { useState } from "react";
import "../styles/SignupForm.css";

function SignupForm({ onSuccess = () => {}, switchToLogin, onClose }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("http://127.0.0.1:8000/api/accounts/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setSuccess("Signup successful! Please login now.");
      onSuccess();
      if (switchToLogin) switchToLogin();
    } else {
      setError(data.error || "Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <div>
          <h2>Create your account</h2>
          <p>Sign up to unlock AI support for every ride.</p>
        </div>
        <button className="close-btn" onClick={onClose} type="button">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-body">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Create account</button>
      </form>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <p className="switch-line">
        Already have an account? <span className="link" onClick={switchToLogin}>Login</span>
      </p>
    </div>
  );
}

export default SignupForm;
