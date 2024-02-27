import React, { useState, useEffect, useRef } from 'react';
import { Alert, Card, CardBody, Split } from '@patternfly/react-core';
import ChatbotMessage from './ChatbotMessage';
import ChatbotInput from './ChatbotInput';
import '../ChatUrDocs.css';
import '../Chat/ChatTyping.css';
import MarkdownRenderer from './MarkdownRenderer';
import { marked } from 'marked';

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

  useEffect(() => {
    // Send initial message when component mounts
    sendInitialMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]); // Scroll whenever chat messages change

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendInitialMessage = () => {
    const initialMessage =
      'Hi! 😊 I’m ' + botName + ', I’m here to help you with any questions or issues.';
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
    // Show typing indicator
    setIsBotTyping(true);
    // Send the user's question to the backend
    sendUserQuestion(userMessage);
  };

  const sendUserQuestion = async (userQuestion: string) => {
    const API_ENDPOINT = 'http://127.0.0.1:8000/chaturdocs/rest/search';
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
  const handleBotResponse = async (botResponse: string) => {
    const botResponseHtml = await marked(botResponse);
    console.log('>>>>', botResponse, 'botResponseHtml', botResponseHtml);

    // Hide typing indicator
    setIsBotTyping(false);
    botResponse === ''
      ? appendMessage(
          "Oops! Unfortunately, I wasn't able to find the answer to your question. Kindly contact the team directly for further assistance. Is there anything else I can help you with?",
          false
        )
      : appendMessage(botResponseHtml, false);
  };

  return (
    <Card>
      <div>
        <CardBody style={{ maxHeight: 450, overflowY: 'auto' }}>
          <div className="chat">
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <ChatbotMessage
                  key={index}
                  message={message.content}
                  isUserMessage={message.isUserMessage}
                />
              ))}
              <div ref={messagesEndRef} />
              {isBotTyping && (
                <div className="chat-bubble">
                  <div className="typing">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
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
