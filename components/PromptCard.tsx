import React, { useState } from 'react';
import type { Prompt } from '../types';
import { ClipboardIcon, CheckIcon } from './Icons';

interface PromptCardProps {
  prompt: Prompt;
  onSelectPrompt: (prompt: Prompt) => void;
}

const DEFAULT_THUMBNAIL = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgZmlsbD0ibm9uZSIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IzMzNDE1NTsiPjxwYXRoIGQ9Ik00MTYuNjY3IDEwNC4xNjdWMzk1LjgzNEg4My4zMzM1VjEwNC4xNjdINDY2LjY2N1pNNCAxNi42NjcgNjIuNUg4My4zMzM1QzU5LjY2NjggNjIuNSA0MS42NjY4IDgwLjUgNDEuNjY2OCAxMDQuMTY3VjM5NS44MzRDNDEuNjY2OCA0MTkuNSA1OS42NjY4IDQzNy41IDgzLjMzMzUgNDM3LjVINDY2LjY2N0M0NDAuMzM0IDQzNy41IDQ1OC4zMzQgNDE5LjUgNDU4LjMzNCAzOTUuODM0VjEwNC4xNjdDNDU4LjMzNCA4MC41IDQ0MC4zMzQgNjIuNSA0MTYuNjY3IDYyLjVaTTIwOC4zMzQgMjYwLjQxN0wxNjYuNjY3IDMxMi41SDM1NC4xNjdMMjkxLjY2NyAyMjkuMTY3TDIzOS41ODQgMjk0Ljc5MkwyMDguMzM0IDI2MC40MTdaIiBmaWxsPSIjNjQ3NDhiIi8+PC9zdmc+`;


const PromptCard: React.FC<PromptCardProps> = ({ prompt, onSelectPrompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the detail modal from opening
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onSelectPrompt(prompt)}
      className="bg-slate-800 rounded-lg overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/30 hover:ring-2 hover:ring-indigo-500"
    >
      <div className="aspect-square w-full overflow-hidden bg-slate-700 relative">
        <img
          src={prompt.thumbnail || DEFAULT_THUMBNAIL}
          alt={prompt.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleCopy}
          aria-label="Copy prompt text"
          className={`absolute top-2 right-2 p-2 rounded-full bg-slate-900/70 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-900/90 hover:scale-110 ${copied ? '!bg-green-600 !opacity-100' : ''}`}
        >
          {copied ? (
            <CheckIcon className="w-5 h-5" />
          ) : (
            <ClipboardIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate text-white">{prompt.title}</h3>
        <p className="text-sm text-gray-400 mt-1">{new Date(prompt.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PromptCard;