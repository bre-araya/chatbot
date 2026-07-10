import React, { useState } from "react";
import HelpdeskButton from "./HelpdeskButton";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Chatbox from "./Chatbox";
import "../styles/LandingPage.css";
import helpdeskImg from "../assets/helpdesk.JPG"; // make sure the image exists

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false); // modal visibility
  const [isLogin, setIsLogin] = useState(true);    // toggle between login/signup
  const [isAuthenticated, setIsAuthenticated] = useState(false); // after login

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>AI Helpdesk Assistant</h1>
          <p>
            Get instant support for all your queries with our smart AI-powered chatbot.
          </p>
          <button className="hero-btn">Learn More</button>
        </div>
        <div className="hero-image">
          <img src={helpdeskImg} alt="Helpdesk Illustration" />
        </div>
      </div>

      {/* Helpdesk Button (top-right) */}
      <div className="helpdesk-container">
        <HelpdeskButton onClick={() => setShowAuth(true)} />
      </div>

      {/* Auth Modal */}
      {showAuth && !isAuthenticated && (
        <div className="auth-modal">
          {isLogin ? (
            <LoginForm
              onSuccess={() => {
                setIsAuthenticated(true);
                setShowAuth(false);
              }}
              switchToSignup={() => setIsLogin(false)}
              onClose={() => setShowAuth(false)}
            />
          ) : (
            <SignupForm
              onSuccess={() => setIsLogin(true)}
              switchToLogin={() => setIsLogin(true)}
              onClose={() => setShowAuth(false)}
            />
          )}
        </div>
      )}

      {/* Chatbot after login */}
      {isAuthenticated && (
        <div className="chatbot-container">
          <Chatbox />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
