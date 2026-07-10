import React, { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Chatbox from "./Chatbox";
import "../styles/HelpdeskButton.css";

const HelpdeskButton = () => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(""); // "signup" or "login"
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
    setOpen(false); // close modal after login
  };

  return (
    <>
      {/* Helpdesk Button top-right */}
      <button className="helpdesk-btn" onClick={() => setOpen(!open)}>
        Helpdesk
      </button>

      {/* Modal for Signup/Login */}
      {open && !loggedIn && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button onClick={() => setShowForm("signup")}>Create Account</button>
              <button onClick={() => setShowForm("login")}>Login</button>
            </div>
            <div className="modal-body">
              {showForm === "signup" && <SignupForm />}
              {showForm === "login" && <LoginForm onLogin={handleLogin} />}
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbox after login */}
      {loggedIn && <Chatbox />}
    </>
  );
};

export default HelpdeskButton;
