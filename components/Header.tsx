import React from 'react';
import { PlusIcon } from './Icons';

interface HeaderProps {
  onAddPrompt: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddPrompt }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-white">KI-Prompt-Bibliothek</h1>
        </div>
        <button
          onClick={onAddPrompt}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-600/30"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Neuen Prompt hinzufügen</span>
        </button>
      </div>
    </header>
  );
};

export default Header;