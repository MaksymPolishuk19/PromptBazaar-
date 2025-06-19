import React, { useEffect, useState } from 'react';

interface Prompt {
  mintAddress: string;
  title: string;
  prompt: string;
  category: string;
  imageUri: string;
}

interface Props {
  prompts: Prompt[];
}

const PromptOfTheDay: React.FC<Props> = ({ prompts }) => {
  const [randomPrompt, setRandomPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    if (prompts.length > 0) {
      const random = prompts[Math.floor(Math.random() * prompts.length)];
      setRandomPrompt(random);
    }
  }, [prompts]);

  if (!randomPrompt) return null;

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
      <h2>🌟 Prompt of the Day</h2>
      <h3>{randomPrompt.title}</h3>
      <p>{randomPrompt.prompt}</p>
      <small>Category: {randomPrompt.category}</small>
    </div>
  );
};

export default PromptOfTheDay;
