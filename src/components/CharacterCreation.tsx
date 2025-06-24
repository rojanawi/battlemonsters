import React, { useEffect } from 'react';
import { Swords, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
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

  const handleRetryImageGeneration = async () => {
    if (!state.character) return;

    dispatch({ type: 'SET_IMAGE_GENERATION_ERROR', payload: false });
    dispatch({ type: 'SET_GENERATING_IMAGE', payload: true });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: state.character.image_prompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate character image');
      }

      const data = await response.json();
      dispatch({ type: 'SET_CHARACTER_IMAGE', payload: data.url });
    } catch (error) {
      console.error('Failed to generate character image:', error);
      dispatch({ type: 'SET_IMAGE_GENERATION_ERROR', payload: true });
    } finally {
      dispatch({ type: 'SET_GENERATING_IMAGE', payload: false });
    }
  };

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

        {state.imageGenerationError && (
          <div className="mb-4 p-4 bg-yellow-900/50 border border-yellow-500/50 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-200 mb-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>Failed to generate character image</p>
            </div>
            <button
              onClick={handleRetryImageGeneration}
              disabled={state.isGeneratingImage}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
            >
              {state.isGeneratingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {state.isGeneratingImage ? 'Generating...' : 'Retry Image Generation'}
            </button>
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