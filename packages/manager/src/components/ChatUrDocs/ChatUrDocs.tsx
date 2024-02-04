import React, { useState, useEffect } from 'react';
import './ChatUrDocs.css';
import { usePostQuestion } from '@app/services/chaturdocs';

export const ChatUrDocs: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const sendMessage = () => {
    const trimmedUserInput = userInput.trim();
    if (trimmedUserInput === '') return;

    // Display the user's message in the chat
    appendMessage('User', trimmedUserInput, true);

    // Send the user's question to the backend (replace with your logic)
    sendUserQuestion(trimmedUserInput);

    // Clear the input field
    setUserInput('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    // Send the initial message when the component mounts
    sendInitialMessage();
  }, []);

  const sendInitialMessage = () => {
    const initialMessage =
      'Hi! 😊 I’m Clover, a virtual support agent. I’m here to help you with any questions or issues.';
    // Display the initial message in the chat
    appendMessage('Chatbot', initialMessage, false);
  };

  const appendMessage = (sender: string, message: string, isUser: boolean) => {
    // Update the state to include the new message
    setChatMessages((prevMessages) => [...prevMessages, { sender, message, isUser }]);
  };
  const API_ENDPOINT = 'https://chaturdocs-api.usersys.redhat.com/chaturdocs/rest/search';
  const sendUserQuestion = (userQuestion: string) => {
    // Implement logic to send user question to the backend (replace with your logic)
    console.log(`Sending user question: ${userQuestion}`);
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: userQuestion })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('ndata', data);
        handleBotResponse({ response: data?.answer });
      });
  };

  const handleBotResponse = (responseData: any) => {
    // Implement logic to handle bot responses (replace with your logic)
    console.log('Handling bot response:', responseData);
    // Display bot's response in the chat
    appendMessage('Chatbot', responseData.response, false);
  };

  return (
    <div className="chat-container">
      <div className="chat">
        <div id="chat-messages">
          {/* Render chat messages */}
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
              <div className="message-container">
                {/* Add logic for rendering user and bot avatars */}
                <div className="message-content">{msg.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="user-input">
        <input
          type="text"
          id="user-input"
          placeholder="Type your question..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button id="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};
