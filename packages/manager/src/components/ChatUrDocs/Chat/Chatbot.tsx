import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '@patternfly/react-core';
import ChatbotMessage from './ChatbotMessage';
import ChatbotInput from './ChatbotInput';
import '../ChatUrDocs.css';
interface ChatMessage {
  content: string;
  isUserMessage: boolean;
}

interface ChatbotProps {
  botName: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ botName }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Send initial message when component mounts
    sendInitialMessage();
  }, []);

  const sendInitialMessage = () => {
    const initialMessage =
      'Hi! 😊 I’m ' +
      botName +
      ', I’m here to help you with any questions or issues.';
    // Display the initial message in the chat
    appendMessage(initialMessage, false);
  };

  const appendMessage = (message: string, isUserMessage: boolean) => {
    // Update the state to include the new message
    setChatMessages((prevMessages) => [...prevMessages, { content: message, isUserMessage }]);
  };

  const handleSendMessage = async (userMessage: string) => {
    // Display the user's message in the chat
    appendMessage(userMessage, true);

    // Send the user's question to the backend
    sendUserQuestion(userMessage);
  };

  const sendUserQuestion = async (userQuestion: string) => {
    const API_ENDPOINT = 'https://chaturdocs-api.usersys.redhat.com/chaturdocs/rest/search';
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: userQuestion })
      });
      const responseData = await response.json();
      handleBotResponse(responseData.answer);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      // Handle error
    }
  };

  const handleBotResponse = (botResponse: string) => {
    // Display bot's response in the chat
    appendMessage(botResponse, false);
  };

  return (
    <Card>
      <div>
        <CardBody style={{ width: 400, maxHeight: 600, overflowY: 'auto' }}>
          <div className="chat">
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <ChatbotMessage
                  key={index}
                  message={message.content}
                  isUserMessage={message.isUserMessage}
                />
              ))}
            </div>
          </div>
        </CardBody>
      </div>
      <div>
        <ChatbotInput onSendMessage={handleSendMessage} />
      </div>
    </Card>
  );
};

export default Chatbot;
