import React from "react";
import Header from "../../components/chat/Header";
import Footer from "../../components/chat/Footer";

export default function MainLayout({ children, showChat, onChatToggle }) {
  return (
    <>
      <Header showChat={showChat} onChatToggle={onChatToggle} />
      {children}
      <Footer />
    </>
  );
}
