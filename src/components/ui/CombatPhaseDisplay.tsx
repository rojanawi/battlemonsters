import React from 'react';
import { Clock, Sword, Shield } from 'lucide-react';
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
          return 'Your Turn';
        case 'reacting':
          return 'Opponent Reacting';
        case 'resolving':
          return 'Resolving Actions';
        case 'completed':
          return 'Phase Complete';
        default:
          return 'Player Initiative';
      }
    } else {
      switch (currentPhase.status) {
        case 'declaring':
          return 'Opponent\'s Turn';
        case 'reacting':
          return 'Your Turn to React';
        case 'resolving':
          return 'Resolving Actions';
        case 'completed':
          return 'Phase Complete';
        default:
          return 'Opponent Initiative';
      }
    }
  };

  const getPhaseIcon = () => {
    if (currentPhase.phase === 'player_initiative') {
      return <Sword className="w-4 h-4 text-blue-400" />;
    } else {
      return <Shield className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    if (currentPhase.phase === 'player_initiative') {
      return 'text-blue-200';
    } else {
      return 'text-red-200';
    }
  };

  return (
    <div className="space-y-3">
      {/* Turn Number */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold text-white">Turn {currentPhase.turn_number}</span>
      </div>

      {/* Phase Status */}
      <div className="flex items-center gap-2">
        {getPhaseIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getPhaseTitle()}
        </span>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-purple-300">Processing...</span>
        </div>
      )}

      {/* Current Actions */}
      {currentPhase.initiator_action && (
        <div className="text-xs">
          <p className="text-gray-300 mb-1">
            <strong>{currentPhase.initiator === 'player' ? 'You' : 'Opponent'}:</strong> {currentPhase.initiator_action.name}
          </p>
          {currentPhase.reactor_action && (
            <p className="text-gray-300">
              <strong>{currentPhase.initiator === 'opponent' ? 'You' : 'Opponent'}:</strong> {currentPhase.reactor_action.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}