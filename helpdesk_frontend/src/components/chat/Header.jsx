import React from "react";
import logo from "../../assets/chat/train-station-city-life-with-car-icon.jpg";
export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left" style={{ display: "flex", alignItems: "center" }}>
          <h1 className="nav-logo">AI Powered HelpDesk For Ride Hailing App</h1>
        </div>
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="">Get Started</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

