import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts/chat";
import {
  HeroSection,
  FeaturesSection,
  AboutSection,
  ContactSection,
  ChatToggle,
  ChatWindow,
} from "../../components/chat";
import "../../style/chat/home.css";
export default function Homepage() {
  const [showChat, setShowChat] = useState(false);
  const [email, setEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  // Load stored email if exists
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleChatToggle = () => {
    setShowChat((prev) => !prev);
  };

  const handleChatClose = () => {
    setShowChat(false);
  };

  const handleSaveEmail = () => {
    if (tempEmail.trim()) {
      localStorage.setItem("userEmail", tempEmail);
      setEmail(tempEmail);
      setShowChat(true); // open chat after saving
    }
  };

  return (
    <MainLayout showChat={showChat} onChatToggle={handleChatToggle}>
      <div className={`homepage-content ${showChat ? "shrink" : ""}`}>
        <HeroSection />

        <FeaturesSection />

        <AboutSection />

        <ContactSection />
      </div>

      {!showChat && <ChatToggle onClick={handleChatToggle} showChat={showChat} />}

      <ChatWindow
        showChat={showChat}
        email={email}
        tempEmail={tempEmail}
        setTempEmail={setTempEmail}
        handleSaveEmail={handleSaveEmail}
        onClose={handleChatClose}
      />
    </MainLayout>
  );
}
