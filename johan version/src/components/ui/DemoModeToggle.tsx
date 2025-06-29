import React from 'react';
import { TestTube, Sparkles } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export function DemoModeToggle() {
  const { state, dispatch } = useGame();

  const handleToggle = () => {
    const newDemoMode = !state.demoMode;
    dispatch({ type: 'TOGGLE_DEMO_MODE', payload: newDemoMode });
    
    // Reset the game when toggling demo mode
    if (state.character || state.opponent) {
      dispatch({ type: 'RESET_GAME' });
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-purple-500/20">
      <div className="flex items-center gap-2">
        <TestTube className="w-5 h-5 text-purple-400" />
        <span className="text-purple-200 font-medium">Demo Mode</span>
      </div>
      
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          state.demoMode 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
            : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            state.demoMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      
      {state.demoMode && (
        <div className="flex items-center gap-1 text-xs text-purple-300">
          <Sparkles className="w-3 h-3" />
          <span>Active</span>
        </div>
      )}
    </div>
  );
}