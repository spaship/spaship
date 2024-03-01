import React, { useState } from 'react';
import { Button, Split, SplitItem, TextInput } from '@patternfly/react-core';
import '../ChatUrDocs.css';

interface ChatbotInputProps {
  onSendMessage: (message: string) => void;
}

const ChatbotInput: React.FC<ChatbotInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleMessageSend = () => {
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <Split hasGutter>
      <SplitItem style={{ width: '450px' }}>
        <TextInput
          style={{ borderRadius: '20px', border: '1px solid #6A6E73 ', backgroundColor: '#F0F0F0' }}
          type="text"
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          placeholder="Type your query here..."
        />
      </SplitItem>
      <SplitItem>
        {' '}
        <Button style={{ borderRadius: '15px' }} onClick={handleMessageSend}>
          Send
        </Button>
      </SplitItem>
    </Split>
  );
};

export default ChatbotInput;
