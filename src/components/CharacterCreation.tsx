import React, { useEffect } from 'react';
import { Swords, AlertCircle } from 'lucide-react';
import { PromptInput } from './PromptInput';
import { useGame } from '../context/GameContext';
import { TurnBasedCombat } from './TurnBasedCombat';
import { getRandomOpponent } from '../data/opponents';

export function CharacterCreation() {
  const { state, dispatch } = useGame();

  // Set opponent when character is created
  useEffect(() => {
    if (state.character && !state.opponent) {
      console.log('Character created, selecting random opponent...');
      const randomOpponent = getRandomOpponent();
      console.log('Selected opponent:', randomOpponent);
      dispatch({ type: 'SET_OPPONENT', payload: randomOpponent });
    }
  }, [state.character, state.opponent, dispatch]);

  if (state.character) {
    return <TurnBasedCombat />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-purple-900/50">
          <Swords className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Create Your Character
        </h1>
        <p className="text-purple-200 text-lg">
          Enter a creative prompt to generate your battle character
        </p>
      </div>
      
      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
        {state.error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{state.error}</p>
          </div>
        )}
        
        <PromptInput />
        
        <div className="mt-6 text-purple-300 text-sm">
          <h3 className="font-semibold text-purple-200 mb-2">Example prompts:</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>"Cyber samurai with lightning fists"</li>
            <li>"Ancient dragon mage wielding time magic"</li>
            <li>"Shadow assassin who can melt into darkness"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}