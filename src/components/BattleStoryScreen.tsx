import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { PlayerSidebar } from './ui/PlayerSidebar';
import { OpponentHealthBar } from './ui/OpponentHealthBar';
import { BattleStoryArea } from './ui/BattleStoryArea';

interface BattlePanel {
  id: string;
  imageUrl?: string;
  isGenerating: boolean;
  error: boolean;
  prompt: string;
  aspectRatio?: string;
  isFinalPanel?: boolean;
}

export function BattleStoryScreen() {
  const { state, dispatch } = useGame();
  const { character, opponent, isGeneratingActions } = state;
  
  const [playerHp, setPlayerHp] = useState(character?.hp || 100);
  const [opponentHp, setOpponentHp] = useState(opponent?.hp || 100);
  const [battlePanels, setBattlePanels] = useState<BattlePanel[]>([]);
  const [battleEnded, setBattleEnded] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [turnNumber, setTurnNumber] = useState(1);

  useEffect(() => {
    // Generate the first battle panel when component mounts
    if (state.selectedPower !== undefined && character && opponent) {
      const actions = character.current_actions || character.powers;
      generateBattlePanel(0, state.selectedPower, actions);
    }
  }, []);

  // Check for battle end conditions
  useEffect(() => {
    if (playerHp <= 0 && !battleEnded) {
      setBattleEnded(true);
      setPlayerWon(false);
      generateFinalPanel(false);
    } else if (opponentHp <= 0 && !battleEnded) {
      setBattleEnded(true);
      setPlayerWon(true);
      generateFinalPanel(true);
    }
  }, [playerHp, opponentHp, battleEnded]);

  const generateNewActions = async () => {
    if (!character || !opponent || battleEnded) return;

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
            turn_number: turnNumber + 1
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
        console.warn('No valid actions returned, keeping current actions');
        // Keep using current actions if new generation fails
      }
    } catch (error) {
      console.error('Failed to generate battle actions:', error);
      console.log('Continuing with current actions due to generation failure');
      // Continue with current actions - don't break the battle flow
    } finally {
      dispatch({ type: 'SET_GENERATING_ACTIONS', payload: false });
    }
  };

  const generateFinalPanel = async (victory: boolean) => {
    if (!character) return;

    // Simplified final panel prompts focusing only on the player character
    const prompt = victory 
      ? `Epic fantasy victory portrait: ${character.character_name} (${character.image_prompt}) in a triumphant victory pose. ${character.description}. The hero stands proudly with glorious golden light rays surrounding them, magical victory energy swirling around their body, heroic stance with arms raised in celebration, epic fantasy art style, dramatic cinematic lighting, champion's glow, victory celebration, triumphant expression, battlefield smoke in background, high contrast, 16:9 aspect ratio.`
      : `Dark fantasy defeat portrait: ${character.character_name} (${character.image_prompt}) in a defeated state. ${character.description}. The fallen hero kneels or lies defeated, somber lighting with shadows, exhausted and wounded, dramatic defeat composition, dark fantasy art style, melancholic atmosphere, fallen warrior, tragic scene, battlefield debris around them, high contrast, 16:9 aspect ratio.`;

    const finalPanelIndex = battlePanels.length;
    
    setBattlePanels(prev => [
      ...prev,
      {
        id: `final-panel`,
        isGenerating: true,
        error: false,
        prompt,
        aspectRatio: '16:9', // Force 16:9 for final panel
        isFinalPanel: true
      }
    ]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt,
            aspect_ratio: '16:9' // Force 16:9 aspect ratio for final image
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate final battle image');
      }

      const data = await response.json();
      
      setBattlePanels(prev => {
        const newPanels = [...prev];
        newPanels[finalPanelIndex] = {
          ...newPanels[finalPanelIndex],
          imageUrl: data.url,
          aspectRatio: '16:9', // Ensure 16:9 aspect ratio
          isGenerating: false,
          error: false
        };
        return newPanels;
      });

    } catch (error) {
      console.error('Failed to generate final battle image:', error);
      setBattlePanels(prev => {
        const newPanels = [...prev];
        newPanels[finalPanelIndex] = {
          ...newPanels[finalPanelIndex],
          isGenerating: false,
          error: true
        };
        return newPanels;
      });
    }
  };

  const generateBattlePanel = async (panelIndex: number, selectedPowerIndex: number, actionsArray: any[]) => {
    if (!character || !opponent || !actionsArray || selectedPowerIndex >= actionsArray.length) return;

    const selectedAction = actionsArray[selectedPowerIndex];
    if (!selectedAction || !selectedAction.name) {
      console.error('Invalid action selected:', selectedAction);
      return;
    }
    
    // Enhanced battle prompts with detailed character aesthetics
    const prompt = `Epic fantasy battle scene: ${character.character_name} (${character.image_prompt}) unleashing devastating ${selectedAction.name} attack against ${opponent.character_name} (${opponent.image_prompt}). 
    
    Action: ${selectedAction.description}. The attacker shows ${character.description} while the defender displays ${opponent.description}.
    
    Visual style: Intense combat action, explosive magical effects, dramatic lighting with sparks and energy, debris flying through the air, fierce expressions showing determination and pain, dynamic action poses mid-combat, cinematic battle photography, high contrast lighting, magical sparks and flames, destruction and chaos around them, epic confrontation, dark fantasy art style with vibrant magical effects.`;

    // Add new panel or update existing one
    setBattlePanels(prev => {
      const newPanels = [...prev];
      if (newPanels[panelIndex]) {
        newPanels[panelIndex] = { ...newPanels[panelIndex], isGenerating: true, error: false };
      } else {
        newPanels.push({
          id: `panel-${panelIndex}`,
          isGenerating: true,
          error: false,
          prompt
        });
      }
      return newPanels;
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate battle image');
      }

      const data = await response.json();
      
      setBattlePanels(prev => {
        const newPanels = [...prev];
        newPanels[panelIndex] = {
          ...newPanels[panelIndex],
          imageUrl: data.url,
          aspectRatio: data.aspect_ratio,
          isGenerating: false,
          error: false
        };
        return newPanels;
      });

      // Simulate battle damage
      const playerDamage = Math.floor(Math.random() * 25) + 10; // Player takes 10-35 damage
      const opponentDamage = Math.floor(Math.random() * 30) + 15; // Opponent takes 15-45 damage
      
      setOpponentHp(prev => Math.max(0, prev - opponentDamage));
      setPlayerHp(prev => Math.max(0, prev - playerDamage));

    } catch (error) {
      console.error('Failed to generate battle image:', error);
      setBattlePanels(prev => {
        const newPanels = [...prev];
        newPanels[panelIndex] = {
          ...newPanels[panelIndex],
          isGenerating: false,
          error: true
        };
        return newPanels;
      });
    }
  };

  const handleAttack = async (powerIndex: number, actionsOverride?: any[]) => {
    if (!character || battleEnded) return;
    
    dispatch({ type: 'SELECT_POWER', payload: powerIndex });
    const nextPanelIndex = battlePanels.length;
    
    // Use provided actions or fall back to current actions
    const actions = actionsOverride || character.current_actions || character.powers;
    
    // Generate new battle panel with the specific actions array
    await generateBattlePanel(nextPanelIndex, powerIndex, actions);
    
    // Generate new actions for next turn (if battle continues)
    if (!battleEnded) {
      setTurnNumber(prev => prev + 1);
      await generateNewActions();
    }
  };

  const handleCustomAction = (actionDescription: string) => {
    if (!character || battleEnded) return;

    // Create a custom action object
    const customAction = {
      name: "Custom Action",
      description: actionDescription,
      attack_points: Math.floor(Math.random() * 20) + 15, // Random damage 15-35
      type: 'custom' as const
    };

    // Add the custom action to the current actions
    const currentActions = character.current_actions || [];
    const updatedActions = [...currentActions, customAction];
    
    dispatch({ type: 'SET_CHARACTER_ACTIONS', payload: updatedActions });
    
    // Execute the custom action immediately with the updated actions array
    const customActionIndex = updatedActions.length - 1;
    handleAttack(customActionIndex, updatedActions);
  };

  const retryPanel = (panelIndex: number) => {
    if (battlePanels[panelIndex].isFinalPanel) {
      generateFinalPanel(playerWon);
    } else {
      // For retry, use the current selected power and actions
      const actions = character?.current_actions || character?.powers || [];
      const selectedPowerIndex = state.selectedPower || 0;
      generateBattlePanel(panelIndex, selectedPowerIndex, actions);
    }
  };

  const goBackToBattle = () => {
    dispatch({ type: 'SELECT_POWER', payload: undefined });
  };

  if (!character || !opponent) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex">
      {/* Left Sidebar - Player Info */}
      <PlayerSidebar
        character={character}
        playerHp={playerHp}
        battleEnded={battleEnded}
        playerWon={playerWon}
        onGoBack={goBackToBattle}
        onAttack={handleAttack}
        onCustomAction={handleCustomAction}
        isGeneratingActions={isGeneratingActions}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Opponent Info */}
        <OpponentHealthBar opponent={opponent} currentHp={opponentHp} />

        {/* Story Space - Comic Strip */}
        <BattleStoryArea
          battlePanels={battlePanels}
          playerWon={playerWon}
          onRetryPanel={retryPanel}
        />
      </div>
    </div>
  );
}