// ChatbotMessage.tsx
import React from 'react';
import '../ChatUrDocs.css';

interface ChatbotMessageProps {
  message: string;
  isUserMessage: boolean;
}

const ChatbotMessage: React.FC<ChatbotMessageProps> = ({ message, isUserMessage }) => (
  <div key={message} className={`message ${isUserMessage ? 'user-message' : 'bot-message'}`}>
    <div className={` ${isUserMessage ? 'user-message-container' : 'bot-message-container'}`}>
      {/*  eslint-disable-next-line react/no-danger */}
      <div className="message-content" dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  </div>
);

export default ChatbotMessage;
