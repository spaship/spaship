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
    <Split>
      <SplitItem className="pf-u-m-mx" style={{ width: '250px' }}>
        <TextInput
          type="text"
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          placeholder="Type your message..."
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
