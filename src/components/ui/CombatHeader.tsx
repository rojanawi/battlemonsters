import React from 'react';
import { Heart, Zap, Shield } from 'lucide-react';
import { Tooltip } from './Tooltip';
import type { CombatState, Character, Opponent } from '../../types/combat';

interface CombatHeaderProps {
  character: Character | Opponent;
  combatState: CombatState;
  isPlayer: boolean;
}

export function CombatHeader({ character, combatState, isPlayer }: CombatHeaderProps) {
  const currentHp = isPlayer ? combatState.player_hp : combatState.opponent_hp;
  const maxHp = isPlayer ? combatState.player_max_hp : combatState.opponent_max_hp;
  const currentEnergy = isPlayer ? combatState.player_energy : combatState.opponent_energy;
  const maxEnergy = isPlayer ? combatState.player_max_energy : combatState.opponent_max_energy;
  
  const hpPercentage = (currentHp / maxHp) * 100;
  const energyPercentage = (currentEnergy / maxEnergy) * 100;

  return (
    <div className="space-y-4">
      {/* Character Portrait and Name */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800/50 flex-shrink-0">
          {character.image_url ? (
            <img
              src={character.image_url}
              alt={character.character_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shield className={`w-6 h-6 ${isPlayer ? 'text-blue-400' : 'text-red-400'}`} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{character.character_name}</h3>
          <p className={`text-xs ${isPlayer ? 'text-blue-200' : 'text-red-200'}`}>
            {isPlayer ? 'Player' : 'Opponent'}
          </p>
        </div>
      </div>

      {/* HP Bar */}
      <div>
        <div className="flex justify-between text-xs text-red-200 mb-1">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            Health
          </span>
          <span className="font-mono">{currentHp}/{maxHp}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>

      {/* Energy Bar with Tooltip */}
      <div>
        <div className="flex justify-between text-xs text-yellow-200 mb-1">
          <Tooltip content="Energy regenerates +10 every turn" position="top">
            <span className="flex items-center gap-1 cursor-help">
              <Zap className="w-3 h-3" />
              Energy
            </span>
          </Tooltip>
          <span className="font-mono">{currentEnergy}/{maxEnergy}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
            style={{ width: `${energyPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}