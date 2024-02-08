import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

interface MarkdownProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownProps> = ({ content }) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const convertMarkdownToHtml = async () => {
      const result = await marked(content);
      setHtml(result);
    };

    convertMarkdownToHtml();
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownRenderer;
