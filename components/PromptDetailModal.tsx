import React, { useState, useEffect } from 'react';
import type { Prompt } from '../types';
import { CloseIcon, TrashIcon, ClipboardIcon, EditIcon } from './Icons';

interface PromptDetailModalProps {
  prompt: Prompt;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, text: string, negativeText: string) => void;
}

const DEFAULT_THUMBNAIL = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgZmlsbD0ibm9uZSIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IzMzNDE1NTsiPjxwYXRoIGQ9Ik00MTYuNjY3IDEwNC4xNjdWMzk1LjgzNEg4My4zMzM1VjEwNC4xNjdINDY2LjY2N1pNNCAxNi42NjcgNjIuNUg4My4zMzM1QzU5LjY2NjggNjIuNSA0MS42NjY4IDgwLjUgNDEuNjY2OCAxMDQuMTY3VjM5NS44MzRDNDEuNjY2OCA0MTkuNSA1OS42NjY4IDQzNy41IDgzLjMzMzUgNDM3LjVINDY2LjY2N0M0NDAuMzM0IDQzNy41IDQ1OC4zMzQgNDE5LjUgNDU4LjMzNCAzOTUuODM0VjEwNC4xNjdDNDU4LjMzNCA4MC41IDQ0MC4zMzQgNjIuNSA0MTYuNjY3IDYyLjVaTTIwOC4zMzQgMjYwLjQxN0wxNjYuNjY3IDMxMi41SDM1NC4xNjdMMjkxLjY2NyAyMjkuMTY3TDIzOS41ODQgMjk0Ljc5MkwyMDguMzM0IDI2MC40MTdaIiBmaWxsPSIjNjQ3NDhiIi8+PC9zdmc+`;

const PromptDetailModal: React.FC<PromptDetailModalProps> = ({ prompt, onClose, onDelete, onUpdate }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [negativeCopied, setNegativeCopied] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(prompt.title);
  const [editedText, setEditedText] = useState(prompt.text);
  const [editedNegativeText, setEditedNegativeText] = useState(prompt.negativeText || '');

  useEffect(() => {
    if (prompt) {
      setIsEditing(false);
      setShowConfirm(false);
      setEditedTitle(prompt.title);
      setEditedText(prompt.text);
      setEditedNegativeText(prompt.negativeText || '');
    }
  }, [prompt]);


  const handleDelete = () => {
    onDelete(prompt.id);
  };
  
  const handleCopy = (textToCopy: string, type: 'positive' | 'negative') => {
    navigator.clipboard.writeText(textToCopy);
    if (type === 'positive') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } else {
        setNegativeCopied(true);
        setTimeout(() => setNegativeCopied(false), 2000);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(prompt.title);
    setEditedText(prompt.text);
    setEditedNegativeText(prompt.negativeText || '');
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    if (editedTitle.trim() && editedText.trim()) {
      onUpdate(prompt.id, editedTitle.trim(), editedText.trim(), editedNegativeText.trim());
      setIsEditing(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl border border-slate-700 transform transition-all duration-300 scale-100 flex flex-col md:flex-row max-h-[90vh]">
        <div className="w-full md:w-1/3 flex-shrink-0 bg-slate-700">
          <img src={prompt.thumbnail || DEFAULT_THUMBNAIL} alt={prompt.title} className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none" />
        </div>
        <div className="flex flex-col flex-grow p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
             {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-2xl font-bold"
                required
              />
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white">{prompt.title}</h2>
                <p className="text-sm text-gray-400">Erstellt am {new Date(prompt.createdAt).toLocaleString()}</p>
              </div>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-4">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-grow space-y-4">
             {isEditing ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Prompt</label>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y text-sm leading-relaxed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Negativer Prompt</label>
                  <textarea
                    value={editedNegativeText}
                    onChange={(e) => setEditedNegativeText(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y text-sm leading-relaxed"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative bg-slate-900 p-4 rounded-md">
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Prompt</label>
                    <button onClick={() => handleCopy(prompt.text, 'positive')} className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-gray-300 transition">
                    {copied ? <span className="text-sm text-green-400 px-1">Kopiert!</span> : <ClipboardIcon className="w-5 h-5" />}
                    </button>
                    <p className="text-gray-200 whitespace-pre-wrap font-mono text-sm leading-relaxed">{prompt.text}</p>
                </div>

                {prompt.negativeText && (
                     <div className="relative bg-slate-900 p-4 rounded-md">
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Negativer Prompt</label>
                        <button onClick={() => handleCopy(prompt.negativeText as string, 'negative')} className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-gray-300 transition">
                            {negativeCopied ? <span className="text-sm text-green-400 px-1">Kopiert!</span> : <ClipboardIcon className="w-5 h-5" />}
                        </button>
                        <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{prompt.negativeText}</p>
                    </div>
                )}
              </>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={!editedTitle.trim() || !editedText.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
                >
                  Änderungen speichern
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 transition flex items-center gap-2"
                >
                  <EditIcon className="w-5 h-5" /> Bearbeiten
                </button>
                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition flex items-center gap-2"
                  >
                    <TrashIcon className="w-5 h-5" /> Löschen
                  </button>
                ) : (
                  <div className="flex gap-3 items-center bg-red-900/50 p-3 rounded-lg">
                    <p className="text-red-300">Bist du sicher?</p>
                    <button onClick={() => setShowConfirm(false)} className="px-3 py-1 bg-slate-600 rounded-md hover:bg-slate-500">Nein</button>
                    <button onClick={handleDelete} className="px-3 py-1 bg-red-600 rounded-md hover:bg-red-500">Ja, löschen</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailModal;