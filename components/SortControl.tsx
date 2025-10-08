import React from 'react';

type SortOption = 'newest' | 'oldest' | 'titleAsc' | 'titleDesc';

interface SortControlProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const SortControl: React.FC<SortControlProps> = ({ sortBy, onSortChange }) => {
  return (
    <div className="mb-6 flex justify-end">
      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm font-medium text-gray-400">Sortieren nach:</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-slate-700 border border-slate-600 rounded-md px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
          <option value="titleAsc">Titel (A-Z)</option>
          <option value="titleDesc">Titel (Z-A)</option>
        </select>
      </div>
    </div>
  );
};

export default SortControl;