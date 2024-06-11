import React, { useState } from 'react';
import '../ChatUrDocs.css';
import { Button, Tooltip } from '@patternfly/react-core';
import { toast } from 'react-hot-toast';

interface ChatbotMessageProps {
  message: string;
  isUserMessage: boolean;
  onFeedback: (message: string, feedback: number, userQuestion?: string) => void;
  userQuestion: string;
  isInitialMessage: boolean;
}

const ChatbotMessage: React.FC<ChatbotMessageProps> = ({
  message,
  isUserMessage,
  onFeedback,
  userQuestion,
  isInitialMessage
}) => {
  const [feedback, setFeedback] = useState<number | null>(0);
  const handleFeedback = (feedbackValue: number) => {
    toast.success('Feedback submitted successfully');
    setFeedback(feedbackValue);
    onFeedback(message, feedbackValue, userQuestion);
  };

  return (
    <div key={message} className={`message ${isUserMessage ? 'user-message' : 'bot-message'}`}>
      <div className={` ${isUserMessage ? 'user-message-container' : 'bot-message-container'}`}>
        <div className="message-content" dangerouslySetInnerHTML={{ __html: message }} />
        {!isUserMessage && !isInitialMessage && (
          <div className="feedback-buttons">
            <Button
              variant="link"
              onClick={() => handleFeedback(1)}
              style={{ backgroundColor: 'inherit', border: 'none', padding: '0px' }}
              title="Happy with answer"
            >
              <Tooltip content={<div>Liked the answer</div>}>
                <img
                  className={feedback === 1 ? 'feedback-button-selection' : ''}
                  src="/img/like.png"
                  alt="like"
                  style={{ height: '20px', cursor: 'pointer' }}
                />
              </Tooltip>
            </Button>

            <Button
              variant="link"
              onClick={() => handleFeedback(-1)}
              style={{ backgroundColor: 'inherit', border: 'none', padding: '5px' }}
              title="Unhappy with answer"
            >
              <Tooltip content={<div>Unhappy with answer</div>}>
                <img
                  className={feedback === -1 ? 'feedback-button-selection' : ''}
                  src="/img/dislike.png"
                  alt="dislike"
                  style={{ height: '20px', cursor: 'pointer' }}
                />
              </Tooltip>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotMessage;
