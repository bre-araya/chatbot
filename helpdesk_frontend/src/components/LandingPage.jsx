import React, { useState } from "react";
import HelpdeskButton from "./HelpdeskButton";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Chatbox from "./Chatbox";
import "../styles/LandingPage.css";
import helpdeskImg from "../assets/helpdesk.JPG";

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="landing-container">
      <div className="hero-section">
        <div className="hero-text">
          <span className="hero-eyebrow">Smart Ride Hailing Helpdesk</span>
          <h1>Your ride partner for instant booking, fare, and safety support</h1>
          <p>
            Meet the AI-powered assistant built for riders and drivers. Get fast help with trip issues, payment questions, driver coordination, and safety guidance in one polished conversational experience.
          </p>

          <div className="hero-actions">
            <button
              className="hero-btn"
              onClick={() => {
                setShowAuth(true);
                setIsLogin(true);
              }}
            >
              Start Support
            </button>
            <button
              className="hero-secondary"
              onClick={() => {
                setShowAuth(true);
                setIsLogin(false);
              }}
            >
              Create Account
            </button>
          </div>

          <div className="hero-highlights">
            <div>
              <strong>24/7 support</strong>
              <p>Instant answers when you need them most.</p>
            </div>
            <div>
              <strong>Ride-safe guidance</strong>
              <p>Driver routes, fare checks, and safety tips.</p>
            </div>
            <div>
              <strong>Smart follow-up</strong>
              <p>Personalized support across every trip.</p>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img src={helpdeskImg} alt="Ride hailing support" />
        </div>
      </div>

      <section className="feature-section">
        <div className="section-header">
          <h2>Designed for modern ride hailing support</h2>
          <p>Powerful, intuitive, and responsive support for riders, drivers, and fleet operations.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Instant trip help</h3>
            <p>Resolve cancellations, route changes, lost item questions, and driver coordination in seconds.</p>
          </div>
          <div className="feature-card">
            <h3>Fare and payment guidance</h3>
            <p>Check trip estimates, fare policy, refunds, and payment issues with smart responses.</p>
          </div>
          <div className="feature-card">
            <h3>Safety & trust</h3>
            <p>Request emergency advice, report problems, or get verified driver support from one place.</p>
          </div>
        </div>
      </section>

      <div className="helpdesk-container">
        <HelpdeskButton
          onClick={() => {
            setShowAuth(true);
            setIsLogin(true);
          }}
        />
      </div>

      {showAuth && !isAuthenticated && (
        <div className="auth-modal">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setShowAuth(false)}>
              ✕
            </button>
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
                onSuccess={() => {
                  setIsLogin(true);
                  setShowAuth(false);
                }}
                switchToLogin={() => setIsLogin(true)}
                onClose={() => setShowAuth(false)}
              />
            )}
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="chatbot-container">
          <Chatbox />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
