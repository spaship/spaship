// ChatbotMessage.tsx
import React from 'react';
import '../ChatUrDocs.css';

interface ChatbotMessageProps {
  message: string;
  isUserMessage: boolean;
}

const ChatbotMessage: React.FC<ChatbotMessageProps> = ({ message, isUserMessage }) => {
  return (
    <div key={message} className={`message ${isUserMessage ? 'user-message' : 'bot-message'}`}>
      <div className={` ${isUserMessage ? 'user-message-container' : 'bot-message-container'}`}>
        <div className="message-content" dangerouslySetInnerHTML={{ __html: message }} />
      </div>
    </div>
  );
};

export default ChatbotMessage;
