
import React from 'react';
import type { Prompt } from '../types';
import PromptCard from './PromptCard';

interface PromptGridProps {
  prompts: Prompt[];
  onSelectPrompt: (prompt: Prompt) => void;
}

const PromptGrid: React.FC<PromptGridProps> = ({ prompts, onSelectPrompt }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {prompts.map(prompt => (
        <PromptCard key={prompt.id} prompt={prompt} onSelectPrompt={onSelectPrompt} />
      ))}
    </div>
  );
};

export default PromptGrid;
