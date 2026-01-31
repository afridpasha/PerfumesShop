import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import Chatbot from './Chatbot';
import '../styles/ChatbotButton.css';

const ChatbotButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <button 
        className="chatbot-float-btn"
        onClick={() => setIsChatOpen(true)}
      >
        <FaRobot className="chat-icon" />
        <div className="notification-badge">AI</div>
        <div className="ripple-effect"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </button>

      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default ChatbotButton;