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

  const appendMessage = (message: string, isUserMessage: boolean, userQuestion?: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { content: message, isUserMessage, userQuestion }
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

  useEffect(() => {
    sendInitialMessage();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/events');
    eventSource.onopen = () => {
      console.log('Connection established.');
    };

    eventSource.onmessage = (event) => {
      const botResponse = event.data;
      handleBotResponse(botResponse, userQuestion);
    };

    eventSource.onerror = () => {
      console.error('Error connecting to event stream.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userQuestion]);

  const handleBotResponse = async (botResponse: string, userQuestion: string) => {
    setIsBotTyping(false);
    setIsInputDisabled(false);
    if (botResponse === '') {
      appendMessage(
        "Oops! Unfortunately, I wasn't able to find the answer to your question. Kindly contact SPAship team at spaship-dev@redhat.com for further assistance. Is there anything else I can help you with?",
        false,
        userQuestion
      );
    } else {
      appendMessageToLastBotMessage(botResponse);
    }
    scrollToBottom();
    // Log question and answer with default feedback value
    logFeedback(botResponse, 0, userQuestion);
  };

  const appendMessageToLastBotMessage = (message: string) => {
    setChatMessages((prevMessages) => {
      const lastMessageIndex = prevMessages.length - 1;
      if (lastMessageIndex >= 0 && !prevMessages[lastMessageIndex].isUserMessage) {
        const updatedMessage = prevMessages[lastMessageIndex].content + ' ' + message;
        prevMessages[lastMessageIndex].content = updatedMessage;
        return [...prevMessages];
      } else {
        return [...prevMessages, { content: message, isUserMessage: false }];
      }
    });
  };

  const sendUserQuestion = async (userQuestion: string) => {
    setIsInputDisabled(true);
    setUserQuestion(userQuestion);
  };

  const handleSendMessage = async (userMessage: string) => {
    appendMessage(userMessage, true);
    setIsBotTyping(true);
    sendUserQuestion(userMessage);
  };

  const handleFeedback = async (message: string, feedback: number, userQuestion?: string) => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/feedback',
        { message, feedback, userQuestion },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Feedback sent successfully.');
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const logFeedback = (message: string, feedback: number, userQuestion?: string) => {
    handleFeedback(message, feedback, userQuestion);
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
