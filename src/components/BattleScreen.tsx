import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { BattleStoryScreen } from './BattleStoryScreen';
import { CharacterCard } from './ui/CharacterCard';
import { PowersList } from './ui/PowersList';
import { BattleHeader } from './ui/BattleHeader';
import { VSSection } from './ui/VSSection';
import { getRandomOpponent } from '../data/opponents';

export function BattleScreen() {
  const { state, dispatch } = useGame();
  const { character, opponent, selectedPower, isGeneratingActions } = state;
  const opponentSelected = useRef(false);
  const actionsGenerated = useRef(false);

  // Select random opponent when character is created
  useEffect(() => {
    if (character && !opponent && !opponentSelected.current) {
      opponentSelected.current = true;
      const randomOpponent = getRandomOpponent();
      dispatch({ type: 'SET_OPPONENT', payload: randomOpponent });
    }
  }, [character, opponent, dispatch]);

  // Generate initial battle actions
  useEffect(() => {
    if (character && opponent && !character.current_actions && !actionsGenerated.current && !isGeneratingActions) {
      actionsGenerated.current = true;
      generateBattleActions();
    }
  }, [character, opponent, isGeneratingActions]);

  const generateBattleActions = async () => {
    if (!character || !opponent) return;

    dispatch({ type: 'SET_GENERATING_ACTIONS', payload: true });
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/battle-actions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            character,
            opponent,
            turn_number: 1
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        console.error('Battle actions API error:', errorMessage);
        throw new Error(`Failed to generate battle actions: ${errorMessage}`);
      }

      const data = await response.json();
      if (data.actions && Array.isArray(data.actions) && data.actions.length > 0) {
        dispatch({ type: 'SET_CHARACTER_ACTIONS', payload: data.actions });
      } else {
        console.warn('No valid actions returned, using character powers as fallback');
        // Fallback to using character powers if action generation fails
        dispatch({ type: 'SET_CHARACTER_ACTIONS', payload: character.powers });
      }
    } catch (error) {
      console.error('Failed to generate battle actions:', error);
      // Fallback to using character powers if action generation fails
      console.log('Using character powers as fallback actions');
      dispatch({ type: 'SET_CHARACTER_ACTIONS', payload: character.powers });
    } finally {
      dispatch({ type: 'SET_GENERATING_ACTIONS', payload: false });
    }
  };

  // If a power is selected, show the battle story screen
  if (selectedPower !== undefined) {
    return <BattleStoryScreen />;
  }

  if (!character || !opponent) return null;

  const handleAttackSelect = (powerIndex: number) => {
    dispatch({ type: 'SELECT_POWER', payload: powerIndex });
  };

  const handleCustomAction = (actionDescription: string) => {
    // Create a custom action object and add it to the character's current actions
    const customAction = {
      name: "Custom Action",
      description: actionDescription,
      attack_points: Math.floor(Math.random() * 20) + 15, // Random damage 15-35
      type: 'custom' as const
    };

    // Add the custom action to the current actions and select it
    const currentActions = character.current_actions || [];
    const updatedActions = [...currentActions, customAction];
    
    dispatch({ type: 'SET_CHARACTER_ACTIONS', payload: updatedActions });
    
    // Select the custom action (it will be the last one in the array)
    dispatch({ type: 'SELECT_POWER', payload: updatedActions.length - 1 });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <BattleHeader 
        title="Battle Arena" 
        subtitle="Choose your attack to begin the battle!" 
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Player Character */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-200 text-center">Your Character</h3>
          <CharacterCard 
            character={character}
            isPlayer={true}
          />
        </div>

        {/* VS Divider & Powers */}
        <div className="space-y-6">
          <VSSection />
          <PowersList 
            powers={character.powers}
            battleActions={character.current_actions}
            onPowerSelect={handleAttackSelect}
            onCustomAction={handleCustomAction}
            isGeneratingActions={isGeneratingActions}
          />
        </div>

        {/* Opponent Character */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-200 text-center">Opponent</h3>
          <CharacterCard character={opponent} />
        </div>
      </div>
    </div>
  );
}