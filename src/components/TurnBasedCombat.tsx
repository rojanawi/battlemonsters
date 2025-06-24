import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CombatActionSelector } from './ui/CombatActionSelector';
import { CombatPhaseDisplay } from './ui/CombatPhaseDisplay';
import { CombatLog } from './ui/CombatLog';
import { CombatStats } from './ui/CombatStats';
import { VictoryScreen } from './ui/VictoryScreen';
import { 
  initializeCombatState, 
  resolveCombatActions, 
  selectOpponentReaction, 
  selectOpponentInitiative,
  advanceCombatPhase,
  checkVictoryCondition,
  generateDynamicActions
} from '../utils/combatSystem';
import type { CombatState, CombatAction } from '../types/combat';

export function TurnBasedCombat() {
  const { state } = useGame();
  const { character, opponent } = state;

  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showingFinalLogs, setShowingFinalLogs] = useState(false);

  // Initialize combat when component mounts
  useEffect(() => {
    if (character && opponent && !combatState) {
      console.log('Initializing combat state...');
      console.log('Character:', character);
      console.log('Opponent:', opponent);
      
      const initialState = initializeCombatState(
        character.hp,
        opponent.hp,
        character.energy,
        opponent.energy
      );
      
      console.log('Initial combat state:', initialState);
      setCombatState(initialState);
    }
  }, [character, opponent, combatState]);

  // Generate dynamic actions when needed
  useEffect(() => {
    if (combatState && character && opponent && 
        combatState.available_actions.length === 0 && 
        !combatState.is_generating_actions &&
        !combatState.is_battle_ended &&
        (combatState.current_phase.status === 'declaring' || 
         (combatState.current_phase.status === 'reacting' && combatState.waiting_for_reaction))) {
      
      console.log('Generating actions for phase:', combatState.current_phase.phase, 'status:', combatState.current_phase.status);
      generateActionsForCurrentPhase();
    }
  }, [combatState, character, opponent]);

  // Auto-trigger opponent initiative - moved to top to ensure consistent hook order
  useEffect(() => {
    if (combatState?.current_phase.phase === 'opponent_initiative' && 
        combatState.current_phase.status === 'declaring' && 
        !isProcessing && !combatState.is_battle_ended) {
      const timer = setTimeout(() => {
        handleOpponentInitiative();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [combatState?.current_phase, isProcessing]);

  // Handle battle end with final logs display
  useEffect(() => {
    if (combatState?.is_battle_ended && !showingFinalLogs) {
      console.log('Battle ended, showing final logs for 4 seconds...');
      setShowingFinalLogs(true);
      
      // Show final logs for 4 seconds before victory screen
      const timer = setTimeout(() => {
        console.log('Final logs display complete, showing victory screen');
        setShowingFinalLogs(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [combatState?.is_battle_ended, showingFinalLogs]);

  const generateActionsForCurrentPhase = async () => {
    if (!combatState || !character || !opponent) return;

    console.log('Starting action generation...');
    setCombatState(prev => prev ? { ...prev, is_generating_actions: true } : prev);

    try {
      const phase = combatState.waiting_for_reaction ? 'reacting' : 'declaring';
      const opponentAction = combatState.opponent_declared_action;
      const turnNumber = combatState.current_phase.turn_number;

      console.log('Generating actions with params:', { phase, opponentAction, turnNumber });

      const dynamicActions = await generateDynamicActions(
        character,
        opponent,
        phase,
        opponentAction,
        turnNumber
      );

      console.log('Generated actions:', dynamicActions);

      setCombatState(prev => prev ? {
        ...prev,
        available_actions: dynamicActions,
        is_generating_actions: false
      } : prev);
    } catch (error) {
      console.error('Failed to generate dynamic actions:', error);
      setCombatState(prev => prev ? { ...prev, is_generating_actions: false } : prev);
    }
  };

  const handleOpponentInitiative = async () => {
    if (isProcessing || !combatState || combatState.current_phase.phase !== 'opponent_initiative') return;

    setIsProcessing(true);

    try {
      let newState = { ...combatState };

      // Opponent declares action
      const opponentAction = selectOpponentInitiative(newState.opponent_available_actions);
      newState.opponent_declared_action = opponentAction;
      newState.current_phase.initiator_action = opponentAction;
      newState.current_phase.status = 'reacting';
      newState.waiting_for_reaction = true;
      newState.available_actions = []; // Clear actions to trigger regeneration
      newState.is_generating_actions = false; // Reset generation flag

      console.log('Opponent declared action:', opponentAction);
      console.log('Setting state to reacting phase, clearing actions for regeneration');

      setCombatState(newState);
    } catch (error) {
      console.error('Error processing opponent initiative:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('TurnBasedCombat render state:', {
      character: !!character,
      opponent: !!opponent,
      combatState: !!combatState,
      characterName: character?.character_name,
      opponentName: opponent?.character_name,
      currentPhase: combatState?.current_phase,
      availableActionsCount: combatState?.available_actions?.length || 0,
      isGeneratingActions: combatState?.is_generating_actions,
      waitingForReaction: combatState?.waiting_for_reaction,
      isBattleEnded: combatState?.is_battle_ended,
      showingFinalLogs
    });
  }, [character, opponent, combatState, showingFinalLogs]);

  if (!character || !opponent) {
    console.log('Missing character or opponent:', { character: !!character, opponent: !!opponent });
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading characters...</div>
      </div>
    );
  }

  if (!combatState) {
    console.log('Combat state not initialized yet');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Initializing Combat...</div>
      </div>
    );
  }

  // Show victory screen only after final logs have been displayed
  if (combatState.is_battle_ended && !showingFinalLogs) {
    return (
      <VictoryScreen
        winner={combatState.winner!}
        character={character}
        opponent={opponent}
        combatLog={combatState.combat_log}
      />
    );
  }

  const handlePlayerAction = async (action: CombatAction) => {
    if (isProcessing || !combatState) return;

    setIsProcessing(true);

    try {
      let newState = { ...combatState };

      if (newState.current_phase.phase === 'player_initiative') {
        // Player declares action, opponent reacts
        newState.declared_action = action;
        newState.current_phase.initiator_action = action;
        newState.current_phase.status = 'reacting';
        newState.waiting_for_reaction = true;

        // AI selects reaction
        await new Promise(resolve => setTimeout(resolve, 1000)); // Dramatic pause
        const opponentReaction = selectOpponentReaction(action, newState.opponent_available_actions);
        
        newState.opponent_declared_action = opponentReaction;
        newState.current_phase.reactor_action = opponentReaction;
        newState.current_phase.status = 'resolving';

        // Resolve actions
        const resolution = resolveCombatActions(
          action,
          opponentReaction,
          newState.player_hp,
          newState.opponent_hp,
          newState.player_energy,
          newState.opponent_energy
        );

        newState.current_phase.resolution = resolution;
        newState.player_hp = Math.max(0, newState.player_hp - resolution.initiator_damage_taken);
        newState.opponent_hp = Math.max(0, newState.opponent_hp - resolution.reactor_damage_taken);
        newState.player_energy = Math.max(0, newState.player_energy - action.energy_cost);
        newState.opponent_energy = Math.max(0, newState.opponent_energy - opponentReaction.energy_cost);

        // Apply healing effects
        if (action.effects?.self_heal) {
          newState.player_hp = Math.min(newState.player_max_hp, newState.player_hp + action.effects.self_heal);
        }
        if (opponentReaction.effects?.self_heal) {
          newState.opponent_hp = Math.min(newState.opponent_max_hp, newState.opponent_hp + opponentReaction.effects.self_heal);
        }

        newState.current_phase.status = 'completed';
        newState.combat_log.push({ ...newState.current_phase });

        console.log('Player initiative phase completed, resolution:', resolution);
        console.log('Updated HP - Player:', newState.player_hp, 'Opponent:', newState.opponent_hp);

        // Check for victory
        newState = checkVictoryCondition(newState);

        if (!newState.is_battle_ended) {
          // Advance to opponent initiative phase
          await new Promise(resolve => setTimeout(resolve, 2000)); // Show resolution
          newState = advanceCombatPhase(newState);
        } else {
          console.log('Battle ended after player initiative phase. Winner:', newState.winner);
        }

      } else {
        // Opponent initiative phase - player reacts to opponent's declared action
        if (!newState.opponent_declared_action) {
          throw new Error('No opponent action declared');
        }

        newState.current_phase.reactor_action = action;
        newState.current_phase.status = 'resolving';

        // Resolve actions (opponent is initiator)
        const resolution = resolveCombatActions(
          newState.opponent_declared_action,
          action,
          newState.opponent_hp,
          newState.player_hp,
          newState.opponent_energy,
          newState.player_energy
        );

        newState.current_phase.resolution = resolution;
        newState.opponent_hp = Math.max(0, newState.opponent_hp - resolution.initiator_damage_taken);
        newState.player_hp = Math.max(0, newState.player_hp - resolution.reactor_damage_taken);
        newState.opponent_energy = Math.max(0, newState.opponent_energy - newState.opponent_declared_action.energy_cost);
        newState.player_energy = Math.max(0, newState.player_energy - action.energy_cost);

        // Apply healing effects
        if (newState.opponent_declared_action.effects?.self_heal) {
          newState.opponent_hp = Math.min(newState.opponent_max_hp, newState.opponent_hp + newState.opponent_declared_action.effects.self_heal);
        }
        if (action.effects?.self_heal) {
          newState.player_hp = Math.min(newState.player_max_hp, newState.player_hp + action.effects.self_heal);
        }

        newState.current_phase.status = 'completed';
        newState.combat_log.push({ ...newState.current_phase });

        console.log('Opponent initiative phase completed, resolution:', resolution);
        console.log('Updated HP - Player:', newState.player_hp, 'Opponent:', newState.opponent_hp);

        // Check for victory
        newState = checkVictoryCondition(newState);

        if (!newState.is_battle_ended) {
          // Advance to next player initiative phase
          await new Promise(resolve => setTimeout(resolve, 2000)); // Show resolution
          newState = advanceCombatPhase(newState);
        } else {
          console.log('Battle ended after opponent initiative phase. Winner:', newState.winner);
        }
      }

      setCombatState(newState);

    } catch (error) {
      console.error('Error processing combat action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Battle End Overlay */}
        {combatState.is_battle_ended && showingFinalLogs && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/90 p-8 rounded-xl border border-purple-500/50 text-center max-w-md">
              <h2 className={`text-3xl font-bold mb-4 ${
                combatState.winner === 'player' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {combatState.winner === 'player' ? 'VICTORY!' : 'DEFEAT!'}
              </h2>
              <p className="text-purple-200 mb-4">
                {combatState.winner === 'player' 
                  ? `${character.character_name} emerges triumphant!`
                  : `${opponent.character_name} has defeated you!`
                }
              </p>
              <div className="text-sm text-purple-300">
                Reviewing final combat logs...
              </div>
              <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Combat Stats */}
          <div className="space-y-6">
            <CombatStats
              character={character}
              opponent={opponent}
              combatState={combatState}
            />
          </div>

          {/* Center Column - Main Combat Area */}
          <div className="space-y-6">
            <CombatPhaseDisplay
              combatState={combatState}
              character={character}
              opponent={opponent}
              isProcessing={isProcessing}
            />

            <CombatActionSelector
              combatState={combatState}
              onActionSelect={handlePlayerAction}
              disabled={isProcessing || combatState.is_battle_ended}
            />
          </div>

          {/* Right Column - Combat Log */}
          <div>
            <CombatLog combatLog={combatState.combat_log} />
          </div>
        </div>
      </div>
    </div>
  );
}