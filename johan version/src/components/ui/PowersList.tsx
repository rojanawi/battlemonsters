import React from 'react';
import { BookOpen } from 'lucide-react';

interface PowersListProps {
  powers: any[];
  onPowerSelect: (powerIndex: number) => void;
  disabled?: boolean;
}

export function PowersList({ onPowerSelect, disabled = false }: PowersListProps) {
  const handleCreateComic = () => {
    // Use the first power as default for comic creation
    onPowerSelect(0);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <button
        onClick={handleCreateComic}
        disabled={disabled}
        className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
          disabled 
            ? 'bg-gray-800/30 border-gray-600/20 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white shadow-lg hover:shadow-purple-500/25 border border-purple-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6" />
          <span>Create Battle Comic</span>
        </div>
      </button>
      
      {!disabled && (
        <p className="text-purple-300 text-sm mt-3 text-center max-w-xs">
          Generate an epic comic strip showing your character in battle!
        </p>
      )}
    </div>
  );
}