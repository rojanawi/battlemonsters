import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

interface FinalizeButtonProps {
  onClick: () => void;
  disabled: boolean;
  panelCount: number;
}

export function FinalizeButton({ onClick, disabled, panelCount }: FinalizeButtonProps) {
  return (
    <div className="relative">
      {/* Visual indicator */}
      {panelCount > 0 && (
        <div className="mb-4 flex items-center justify-center gap-2 text-purple-300">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">
            {panelCount} panel{panelCount !== 1 ? 's' : ''} created
          </span>
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <button
        onClick={onClick}
        disabled={disabled}
        className={`group relative px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 ${
          disabled 
            ? 'bg-gray-800/30 border-2 border-gray-600/30 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-white shadow-2xl hover:shadow-orange-500/30 border-2 border-yellow-500/50'
        }`}
      >
        {/* Background glow effect */}
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-red-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        
        <div className="relative flex items-center gap-3">
          <Crown className="w-6 h-6" />
          <span>Finalize Battle</span>
          <Crown className="w-6 h-6" />
        </div>
      </button>

      {!disabled && (
        <p className="text-orange-300 text-sm mt-3 text-center">
          Generate the epic conclusion to your battle story
        </p>
      )}
    </div>
  );
}