import React, { useState, useEffect } from 'react';
import { CloseIcon, TrashIcon, MagicIcon } from './Icons';
import { generateThumbnail } from '../services/geminiService';
import { Spinner } from './Spinner';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPrompt: (title: string, text: string, thumbnail: string | null, negativeText: string) => void;
}

const AddPromptModal: React.FC<AddPromptModalProps> = ({ isOpen, onClose, onAddPrompt }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [negativeText, setNegativeText] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setText('');
      setNegativeText('');
      setThumbnail(null);
      setThumbnailError(null);
      setIsGenerating(false);
    }
  }, [isOpen]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setThumbnailError('Die Dateigröße muss unter 2 MB liegen.');
        setThumbnail(null);
        e.target.value = ''; // Reset file input
        return;
      }
      if (!file.type.startsWith('image/')) {
        setThumbnailError('Bitte wähle eine gültige Bilddatei (PNG, JPG usw.).');
        setThumbnail(null);
        e.target.value = ''; // Reset file input
        return;
      }

      setThumbnailError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!text.trim()) {
      setThumbnailError("Bitte gib zuerst den Prompt-Text ein, um ein Miniaturbild zu generieren.");
      return;
    }
    setIsGenerating(true);
    setThumbnail(null);
    setThumbnailError(null);
    
    // Use the main prompt text for image generation, as it's more descriptive.
    const generationPrompt = text;

    try {
      const generatedImage = await generateThumbnail(generationPrompt);
      setThumbnail(generatedImage);
    } catch (error) {
      console.error(error);
      setThumbnailError("Leider konnte das Miniaturbild nicht generiert werden. Bitte versuche es erneut oder lade ein Bild hoch.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && text.trim()) {
      onAddPrompt(title, text, thumbnail, negativeText);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Neuen Prompt hinzufügen</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Titel</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="z.B. Cyberpunk-Stadtbild"
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="prompt-text" className="block text-sm font-medium text-gray-300 mb-1">Prompt-Text</label>
              <textarea
                id="prompt-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder="Gib hier deinen detaillierten KI-Prompt ein..."
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y"
                required
              />
            </div>
             <div>
              <label htmlFor="negative-prompt-text" className="block text-sm font-medium text-gray-300 mb-1">Negativer Prompt (Optional)</label>
              <textarea
                id="negative-prompt-text"
                value={negativeText}
                onChange={(e) => setNegativeText(e.target.value)}
                rows={3}
                placeholder="z.B. verschwommen, Wasserzeichen, Text, geringe Qualität..."
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Miniaturbild (Optional)</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                <div className="space-y-1 text-center w-full">
                   {thumbnail ? (
                    <div className="relative group w-full flex justify-center">
                      <img src={thumbnail} alt="Thumbnail preview" className="mx-auto h-24 w-auto max-w-full object-contain rounded-md" />
                       <button type="button" onClick={() => setThumbnail(null)} className="absolute top-0 right-0 m-1 p-1 bg-red-600/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                         <TrashIcon className="w-4 h-4" />
                       </button>
                    </div>
                  ) : isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-24">
                        <Spinner />
                        <p className="text-sm text-gray-400 mt-2">Dein Miniaturbild wird generiert...</p>
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div className="flex flex-wrap text-sm text-gray-400 justify-center items-center gap-2 sm:gap-4 mt-2">
                    <label htmlFor="file-upload" className={`relative cursor-pointer bg-slate-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-indigo-500 px-3 py-1 transition ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <span>{thumbnail ? 'Bild ändern' : 'Bild hochladen'}</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleThumbnailChange} accept="image/png, image/jpeg, image/gif, image/webp" disabled={isGenerating} />
                    </label>
                    <span className="text-gray-600 text-xs sm:text-sm">oder</span>
                    <button
                        type="button"
                        onClick={handleGenerateThumbnail}
                        disabled={!text.trim() || isGenerating}
                        className="relative cursor-pointer bg-purple-600 rounded-md font-medium text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 px-3 py-1 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? <Spinner /> : <MagicIcon className="w-4 h-4" />}
                        <span>{isGenerating ? 'Wird generiert...' : 'Mit KI generieren'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF bis zu 2 MB</p>
                </div>
              </div>
              {thumbnailError && <p className="text-sm text-red-400 mt-2">{thumbnailError}</p>}
            </div>
          </div>
          <div className="p-4 bg-slate-800/50 border-t border-slate-700 rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition disabled:opacity-50"
              disabled={isGenerating}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !text.trim() || isGenerating}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
            >
              Prompt speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPromptModal;