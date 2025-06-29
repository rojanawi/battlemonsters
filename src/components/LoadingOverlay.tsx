import React from 'react';
import { Loader2 } from 'lucide-react';
import { useGame } from '../context/GameContext';

export function LoadingOverlay() {
  const { state } = useGame();
  
  const getLoadingMessage = () => {
    if (state.demoMode) {
      return "Preparing demo battle...";
    }
    if (state.isGeneratingImage) {
      return "Generating character image...";
    }
    return "Generating your character...";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 flex items-center gap-3">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        <p className="text-purple-200">{getLoadingMessage()}</p>
      </div>
    </div>
  );
}