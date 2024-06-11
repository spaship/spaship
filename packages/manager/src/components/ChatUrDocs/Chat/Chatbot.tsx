/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */

import { env } from '@app/config/env';
import { Card, CardBody } from '@patternfly/react-core';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import './ChatTyping.css';
import ChatbotInput from './ChatbotInput';
import ChatbotMessage from './ChatbotMessage';

interface ChatMessage {
  content: string;
  isUserMessage: boolean;
  userQuestion?: string;
}

interface ChatbotProps {
  botName: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ botName }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userQuestion, setUserQuestion] = useState<string>('');

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const appendMessage = (message: string, isUserMessage: boolean, question?: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { content: message, isUserMessage, question }
    ]);
  };

  const disclaimer =
    '<b><i>Note: You are about to utilize a tool that utilizes Artificial Intelligence (AI) to process inputs and provide responses. Please do not include any personal information, customer or partner confidential information in your chat interaction with the AI. By proceeding to use the tool, you acknowledge: that the tool and any information provided are only intended for internal use and that information obtained should only be shared with those with a legitimate business purpose.</i></b>';

  const sendInitialMessage = () => {
    if (chatMessages.length === 0) {
      appendMessage(disclaimer, false);
      const initialMessage = `Hi! 😊 I’m ${botName}, I’m here to help you with any questions or issues.`;
      appendMessage(initialMessage, false);
    }
  };
  const handleFeedback = async (message: string, feedback: number, question?: string) => {
    try {
      await axios.post(
        env.PUBLIC_SPASHIP_DOCBOT_FEEDBACK,
        { message, feedback, UserQuestion: question },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };
  const logFeedback = (message: string, feedback: number, question?: string) => {
    handleFeedback(message, feedback, question);
  };

  useEffect(() => {
    sendInitialMessage();
  }, []);
  const appendMessageToLastBotMessage = (message: string) => {
    setChatMessages((prevMessages) => {
      const lastMessageIndex = prevMessages.length - 1;
      if (lastMessageIndex >= 0 && !prevMessages[lastMessageIndex].isUserMessage) {
        const updatedMessage = `${prevMessages[lastMessageIndex].content} ${message}`;
        prevMessages[lastMessageIndex].content = updatedMessage;
        return [...prevMessages];
      }
      return [...prevMessages, { content: message, isUserMessage: false }];
    });
  };
  const handleBotResponse = async (botResponse: string, question: string) => {
    setIsBotTyping(false);
    setIsInputDisabled(false);
    appendMessageToLastBotMessage(botResponse);
    setUserQuestion(question);
    scrollToBottom();
    // Log question and answer with default feedback value
  };

  const handleSendMessage = async (userMessage: string) => {
    appendMessage(userMessage, true);
    setIsBotTyping(true);
    setUserQuestion(userMessage);
    setIsInputDisabled(true);
  };

  useEffect(() => {
    const eventSource = new EventSource(
      `${env.PUBLIC_SPASHIP_QUERY_STREAM_URL}?query=${userQuestion}`
    );
    eventSource.onopen = () => {
      // eslint-disable-next-line no-console
      console.log('Connection established.');
    };
    let fullMessage = '';
    eventSource.onmessage = (event) => {
      const { text } = JSON.parse(event.data);
      handleBotResponse(text, userQuestion);
      fullMessage += text;
    };

    eventSource.onerror = (error) => {
      if (chatMessages.length > 2) {
        logFeedback(fullMessage, 0, userQuestion);
      }
      // eslint-disable-next-line no-console
      console.error('Streaming completed', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userQuestion]);
  return (
    <Card>
      <div>
        <CardBody style={{ maxHeight: 450, overflowY: 'auto' }}>
          <div className="chat">
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <ChatbotMessage
                  key={`message-${index}`}
                  message={message.content}
                  isUserMessage={message.isUserMessage}
                  onFeedback={handleFeedback}
                  userQuestion={userQuestion}
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
        <ChatbotInput
          onSendMessage={handleSendMessage}
          disabled={isInputDisabled}
          placeholder={
            isInputDisabled
              ? 'Kindly wait for bot to finish the response'
              : 'Type your query here...'
          }
        />
      </div>
    </Card>
  );
};

export default Chatbot;
