import { useState } from "react";
import "../styles/SignupForm.css";

function SignupForm({ onSuccess = () => {} }) {
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
      onSuccess(); // trigger parent action if needed
    } else {
      setError(data.error || "Signup failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h3>Sign Up</h3>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Sign Up</button>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default SignupForm;
