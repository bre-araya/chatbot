import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h5>ride hailing app</h5>
          <p>Your smart companion for <br/><br/>
            safe, fast and reliable rides.</p>
        </div>
        
        <div className="footer-section">
          <h5>Quick links</h5>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Support</h5>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Connect</h5>
          <div className="social-links">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="GitHub">🐙</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Ridding App. All rights reserved.</p>
      </div>
    </footer>
  );
}
