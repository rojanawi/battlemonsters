import React, { useState } from 'react';
import { Swords, AlertCircle } from 'lucide-react';
import { PromptInput } from './PromptInput';
import { ExamplePrompts } from './ui/ExamplePrompts';
import { DemoModeToggle } from './ui/DemoModeToggle';
import { useGame } from '../context/GameContext';
import { BattleScreen } from './BattleScreen';

export function CharacterCreation() {
  const { state } = useGame();
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  if (state.character) {
    return <BattleScreen />;
  }

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/20">
          <Swords className="w-10 h-10 text-purple-400" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
          Forge Your Legend
        </h1>
        <p className="text-purple-200 text-xl leading-relaxed">
          Craft a unique battle character with extraordinary powers
        </p>
      </div>
      
      {/* Demo Mode Toggle */}
      <div className="mb-6">
        <DemoModeToggle />
        {state.demoMode && (
          <div className="mt-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <p className="text-sm text-purple-300 text-center">
              <strong>Demo Mode Active:</strong> Using predefined characters - Phoenix Warrior vs Time Manipulator
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 shadow-2xl">
        {state.error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{state.error}</p>
          </div>
        )}
        
        <PromptInput selectedPrompt={selectedPrompt} />
        
        {!state.demoMode && (
          <ExamplePrompts onPromptSelect={handlePromptSelect} />
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}