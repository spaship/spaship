import { env } from '@app/config/env';
import { Card, CardBody } from '@patternfly/react-core';
import axios from 'axios';
import { marked } from 'marked';
import React, { useEffect, useRef, useState } from 'react';
import './ChatTyping.css';
import ChatbotInput from './ChatbotInput';
import ChatbotMessage from './ChatbotMessage';

interface ChatMessage {
  content: string;
  isUserMessage: boolean;
  userQuestion?: string; // Add this property
}

interface ChatbotProps {
  botName: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ botName }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [UserQuestion, setLastUserMessage] = useState<string>('');

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const appendMessage = (message: string, isUserMessage: boolean, userQuestion?: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { content: message, isUserMessage, userQuestion }
    ]);
  };

  const disclaimer =
    '<b><i>Note: You are about to utilize a tool that utilizes Artificial Intelligence (AI) to process inputs and provide responses. Please do not include any personal information, customer or partner confidential information in your chat interaction with the AI. By proceeding to use the tool, you acknowledge: that the tool and any information provided are only intended for internal use and that information obtained should only be shared with those with a legitimate business purpose.</i></b>';

  const sendInitialMessage = () => {
    appendMessage(disclaimer, false);
    const initialMessage = `Hi! 😊 I’m ${botName}, I’m here to help you with any questions or issues.`;
    appendMessage(initialMessage, false);
  };

  useEffect(() => {
    sendInitialMessage();
  }, []);

  const handleBotResponse = async (botResponse: string, userQuestion: string) => {
    const botResponseHtml = await marked(botResponse);

    setIsBotTyping(false);
    if (botResponse === '') {
      appendMessage(
        "Oops! Unfortunately, I wasn't able to find the answer to your question. Kindly contact SPAship team at spaship-dev@redhat.com for further assistance. Is there anything else I can help you with?",
        false,
        userQuestion
      );
    } else {
      appendMessage(botResponseHtml, false, userQuestion);
    }
    // Log question and answer with default feedback value
    logFeedback(botResponseHtml, 0, userQuestion);
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

      handleBotResponse(response.data.answer, userQuestion);
    } catch (error) {
      console.error('Error fetching bot response:', error);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    appendMessage(userMessage, true);
    setLastUserMessage(userMessage); // Store the user message
    setIsBotTyping(true);
    sendUserQuestion(userMessage);
  };

  const handleFeedback = async (message: string, feedback: number, userQuestion?: string) => {
    // const API_FEEDBACK_ENDPOINT = env.PUBLIC_FEEDBACK_URL;
    try {
      await axios
        .post(
          'http://127.0.0.1:8000/feedback', // Corrected endpoint
          { message, feedback, userQuestion },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response) => {
          console.log('Request was successful:', response.data);
        });
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const logFeedback = (message: string, feedback: number, userQuestion?: string) => {
    handleFeedback(message, feedback, userQuestion);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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
                  onFeedback={handleFeedback}
                  userQuestion={message.userQuestion}
                  isInitialMessage={index === 0 || index === 1} // Determine initial messages
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
