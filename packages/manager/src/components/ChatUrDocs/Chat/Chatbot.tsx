import { env } from '@app/config/env';
import { Card, CardBody } from '@patternfly/react-core';
import axios from 'axios'; // Import Axios
import { marked } from 'marked';
import React, { useEffect, useRef, useState } from 'react';
import './ChatTyping.css';
import ChatbotInput from './ChatbotInput';
import ChatbotMessage from './ChatbotMessage';

interface ChatMessage {
  content: string;
  isUserMessage: boolean;
}

interface ChatbotProps {
  botName: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ botName }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false); // State to manage typing indicator
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const appendMessage = (message: string, isUserMessage: boolean) => {
    // Update the state to include the new message
    setChatMessages((prevMessages) => [...prevMessages, { content: message, isUserMessage }]);
  };

  const sendInitialMessage = () => {
    const initialMessage = `Hi! 😊 I’m ${botName}, I’m here to help you with any questions or issues.`;
    appendMessage(initialMessage, false);
  };

  useEffect(() => {
    // Send initial message when component mounts
    sendInitialMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ignore missing dependency warning

  const handleBotResponse = async (botResponse: string) => {
    const botResponseHtml = await marked(botResponse);

    // Hide typing indicator
    setIsBotTyping(false);
    if (botResponse === '') {
      appendMessage(
        "Oops! Unfortunately, I wasn't able to find the answer to your question. Kindly contact the team directly for further assistance. Is there anything else I can help you with?",
        false
      );
    } else {
      appendMessage(botResponseHtml, false);
    }
  };

  const sendUserQuestion = async (userQuestion: string) => {
    const API_ENDPOINT = env.PUBLIC_CHATURDOCS_URL;
    try {
      const response = await axios.post(
        API_ENDPOINT,
        { query: userQuestion },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      handleBotResponse(response.data.answer);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching bot response:', error);
      // Handle error
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    // Display the user's message in the chat
    appendMessage(userMessage, true);
    // Show typing indicator
    setIsBotTyping(true);
    // Send the user's question to the backend
    sendUserQuestion(userMessage);
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages]); // Ignore missing dependency warning

  return (
    <Card>
      <div>
        <CardBody style={{ maxHeight: 450, overflowY: 'auto' }}>
          <div className="chat">
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <ChatbotMessage
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  message={message.content}
                  isUserMessage={message.isUserMessage}
                />
              ))}
              <div ref={messagesEndRef} />
              {isBotTyping && (
                <div className="chat-bubble">
                  <div className="typing">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </div>
      <div className="pf-u-m-md">
        <ChatbotInput onSendMessage={handleSendMessage} />
      </div>
    </Card>
  );
};

export default Chatbot;
