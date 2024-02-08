// ChatbotInput.tsx
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
      <SplitItem style={{ width: '300px' }}>
        <TextInput
          type="text"
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          placeholder="Type your query here..."
        />
      </SplitItem>
      <SplitItem>
        {' '}
        <Button onClick={handleMessageSend}>Send</Button>
      </SplitItem>
    </Split>
  );
};

export default ChatbotInput;
