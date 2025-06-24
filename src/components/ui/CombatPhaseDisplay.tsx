import React from 'react';
import { Sword, Shield, Zap, ArrowRight, AArrowDown as Vs } from 'lucide-react';
import type { CombatState, Character, Opponent } from '../../types/combat';

interface CombatPhaseDisplayProps {
  combatState: CombatState;
  character: Character;
  opponent: Opponent;
  isProcessing: boolean;
}

export function CombatPhaseDisplay({ combatState, character, opponent, isProcessing }: CombatPhaseDisplayProps) {
  const currentPhase = combatState.current_phase;
  
  const getPhaseTitle = () => {
    if (currentPhase.phase === 'player_initiative') {
      switch (currentPhase.status) {
        case 'declaring':
          return 'Player Initiative - Choose Your Action';
        case 'reacting':
          return 'Opponent Reacting to Your Action';
        case 'resolving':
          return 'Resolving Combat Actions';
        case 'completed':
          return 'Phase Complete';
        default:
          return 'Player Initiative';
      }
    } else {
      switch (currentPhase.status) {
        case 'declaring':
          return 'Opponent Initiative - Enemy Choosing Action';
        case 'reacting':
          return 'Your Turn to React';
        case 'resolving':
          return 'Resolving Combat Actions';
        case 'completed':
          return 'Phase Complete';
        default:
          return 'Opponent Initiative';
      }
    }
  };

  const getPhaseColor = () => {
    if (currentPhase.phase === 'player_initiative') {
      return 'from-blue-600 to-purple-600';
    } else {
      return 'from-red-600 to-orange-600';
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
      {/* Phase Header */}
      <div className={`bg-gradient-to-r ${getPhaseColor()} text-white px-4 py-2 rounded-lg mb-6 text-center`}>
        <h2 className="text-lg font-bold">{getPhaseTitle()}</h2>
        <p className="text-sm opacity-90">Turn {currentPhase.turn_number}</p>
      </div>

      {/* Action Display */}
      {(currentPhase.initiator_action || currentPhase.reactor_action) && (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-4">
            {/* Initiator Action */}
            {currentPhase.initiator_action && (
              <div className="flex-1 text-center">
                <div className={`p-3 rounded-lg border ${
                  currentPhase.initiator === 'player' 
                    ? 'bg-blue-900/30 border-blue-500/30' 
                    : 'bg-red-900/30 border-red-500/30'
                }`}>
                  <h4 className="font-semibold text-white mb-1">
                    {currentPhase.initiator === 'player' ? character.character_name : opponent.character_name}
                  </h4>
                  <p className="text-sm text-purple-200 mb-2">{currentPhase.initiator_action.name}</p>
                  <p className="text-xs text-gray-300">{currentPhase.initiator_action.description}</p>
                </div>
              </div>
            )}

            {/* VS Indicator */}
            {currentPhase.initiator_action && currentPhase.reactor_action && (
              <div className="flex items-center justify-center">
                <Vs className="w-8 h-8 text-purple-400" />
              </div>
            )}

            {/* Reactor Action */}
            {currentPhase.reactor_action && (
              <div className="flex-1 text-center">
                <div className={`p-3 rounded-lg border ${
                  currentPhase.initiator === 'opponent' 
                    ? 'bg-blue-900/30 border-blue-500/30' 
                    : 'bg-red-900/30 border-red-500/30'
                }`}>
                  <h4 className="font-semibold text-white mb-1">
                    {currentPhase.initiator === 'opponent' ? character.character_name : opponent.character_name}
                  </h4>
                  <p className="text-sm text-purple-200 mb-2">{currentPhase.reactor_action.name}</p>
                  <p className="text-xs text-gray-300">{currentPhase.reactor_action.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resolution Display */}
      {currentPhase.resolution && (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
          <h4 className="font-semibold text-white mb-2">Combat Resolution</h4>
          <p className="text-purple-200 mb-3">{currentPhase.resolution.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <p className="text-sm text-blue-200">
                {currentPhase.initiator === 'player' ? character.character_name : opponent.character_name}
              </p>
              <p className="text-red-400 font-bold">
                -{currentPhase.resolution.initiator_damage_taken} HP
              </p>
              <p className="text-green-400 font-bold">
                {currentPhase.resolution.initiator_damage_dealt} DMG dealt
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-red-200">
                {currentPhase.initiator === 'opponent' ? character.character_name : opponent.character_name}
              </p>
              <p className="text-red-400 font-bold">
                -{currentPhase.resolution.reactor_damage_taken} HP
              </p>
              <p className="text-green-400 font-bold">
                {currentPhase.resolution.reactor_damage_dealt} DMG dealt
              </p>
            </div>
          </div>

          {currentPhase.resolution.special_effects.length > 0 && (
            <div className="border-t border-gray-600/30 pt-2">
              <p className="text-xs text-yellow-300 font-semibold mb-1">Special Effects:</p>
              {currentPhase.resolution.special_effects.map((effect, index) => (
                <p key={index} className="text-xs text-yellow-200">• {effect}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-purple-300">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}