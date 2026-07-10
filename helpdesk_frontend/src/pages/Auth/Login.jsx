import React, { useState } from "react";
import "../../style/auth/login.css"; // Moved login CSS here
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaUser, FaPhone } from "react-icons/fa";
import AdminDashboard from "../admin/AdminDashboard";
import { login } from "../../services/auth/loginService";
import { forgotPassword, resetPassword } from "../../services/auth/accountService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: verify, 2: enter new password
  const [forgotName, setForgotName] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await login(email, password);
      if (response.success) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(response.user));
        setLoggedIn(true);
      } else {
        // Show custom message for invalid credentials
        if (response.error === "Invalid credentials") {
          setError("Your password is incorrect");
        } else {
          setError(response.error || "Invalid credentials");
        }
      }
    } catch (err) {
      setError(err.error || "Login failed. Please try again.");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    if (forgotStep === 1) {
      try {
        const response = await forgotPassword({
          name: forgotName,
          email: forgotEmail,
          phone: forgotPhone,
        });
        if (response.success) {
          setResetToken(response.reset_token);
          setForgotStep(2);
        } else {
          setForgotError(response.error || "Verification failed");
        }
      } catch (err) {
        setForgotError(err.error || "Verification failed");
      }
    } else if (forgotStep === 2) {
      try {
        const response = await resetPassword({
          reset_token: resetToken,
          new_password: newPassword,
        });
        if (response.success) {
          setForgotSuccess("Password reset successful. You can now login with your new password.");
          setForgotStep(1);
          setShowForgot(false);
        } else {
          setForgotError(response.error || "Failed to reset password");
        }
      } catch (err) {
        setForgotError(err.error || "Failed to reset password");
      }
    }
  };

  if (loggedIn) {
    return <AdminDashboard />;
  }

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <MdEmail className="icon"/>
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>
        <div className="remember-forgot">
          <label><input type="checkbox" /> Remember me</label>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowForgot(true); setForgotStep(1); setForgotName(""); setForgotEmail(""); setForgotPhone(""); setResetToken(""); setNewPassword(""); setForgotError(""); setForgotSuccess(""); }}>Forgot password?</a>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>

      {showForgot && (
        <div className="forgot-password-modal">
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotSubmit}>
            {forgotStep === 1 ? (
              <>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={forgotName}
                    onChange={(e) => setForgotName(e.target.value)}
                    required
                  />
                  <FaUser className="icon" />
                </div>
                <div className="input-box">
                  <input
                    type="email"
                    placeholder="Email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  <MdEmail className="icon" />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    required
                  />
                  <FaPhone className="icon" />
                </div>
              </>
            ) : (
              <div className="input-box">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <FaLock className="icon" />
              </div>
            )}
            {forgotError && <p className="error">{forgotError}</p>}
            {forgotSuccess && <p className="success">{forgotSuccess}</p>}
            <button type="submit">{forgotStep === 1 ? "Verify" : "Set New Password"}</button>
            <button type="button" onClick={() => { setShowForgot(false); setForgotStep(1); }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}


export default Login;
