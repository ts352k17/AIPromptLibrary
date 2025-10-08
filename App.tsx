import React, { useState, useCallback, useMemo } from 'react';
import type { Prompt } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import PromptGrid from './components/PromptGrid';
import AddPromptModal from './components/AddPromptModal';
import PromptDetailModal from './components/PromptDetailModal';
import SortControl from './components/SortControl';

type SortOption = 'newest' | 'oldest' | 'titleAsc' | 'titleDesc';

const App: React.FC = () => {
  const [prompts, setPrompts] = useLocalStorage<Prompt[]>('ai_prompts', []);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const handleAddPrompt = useCallback((title: string, text: string, thumbnail: string | null, negativeText: string) => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title,
      text,
      thumbnail,
      negativeText: negativeText.trim() ? negativeText : undefined,
      createdAt: new Date().toISOString(),
    };
    setPrompts(prev => [newPrompt, ...prev]);
    setAddModalOpen(false);
  }, [setPrompts]);

  const handleDeletePrompt = useCallback((id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    setSelectedPrompt(null);
  }, [setPrompts]);
  
  const handleUpdatePrompt = useCallback((id: string, title: string, text: string, negativeText: string) => {
    setPrompts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, title, text, negativeText: negativeText.trim() ? negativeText : undefined }
          : p
      )
    );
    setSelectedPrompt(prev =>
      prev && prev.id === id
        ? { ...prev, title, text, negativeText: negativeText.trim() ? negativeText : undefined }
        : prev
    );
  }, [setPrompts]);

  const handleSelectPrompt = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setSelectedPrompt(null);
  }, []);

  const sortedPrompts = useMemo(() => {
    const sorted = [...prompts];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'titleAsc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'titleDesc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [prompts, sortBy]);


  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-sans">
      <Header onAddPrompt={() => setAddModalOpen(true)} />
      <main className="container mx-auto px-4 py-8">
         {prompts.length > 0 && (
          <SortControl sortBy={sortBy} onSortChange={setSortBy} />
        )}
        {prompts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-400">Deine Prompt-Bibliothek ist leer</h2>
            <p className="text-gray-500 mt-4">Klicke auf „Neuen Prompt hinzufügen“, um mit dem Aufbau deiner Sammlung zu beginnen.</p>
          </div>
        ) : (
          <PromptGrid prompts={sortedPrompts} onSelectPrompt={handleSelectPrompt} />
        )}
      </main>

      <AddPromptModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddPrompt={handleAddPrompt}
      />

      {selectedPrompt && (
        <PromptDetailModal
          prompt={selectedPrompt}
          onClose={handleCloseDetailModal}
          onDelete={handleDeletePrompt}
          onUpdate={handleUpdatePrompt}
        />
      )}
    </div>
  );
};

export default App;