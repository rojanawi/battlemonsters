import React from 'react';
import { Heart, Zap, Shield } from 'lucide-react';
import type { CombatState, Character, Opponent } from '../../types/combat';

interface CombatStatsProps {
  character: Character;
  opponent: Opponent;
  combatState: CombatState;
}

export function CombatStats({ character, opponent, combatState }: CombatStatsProps) {
  const playerHpPercentage = (combatState.player_hp / combatState.player_max_hp) * 100;
  const opponentHpPercentage = (combatState.opponent_hp / combatState.opponent_max_hp) * 100;
  const playerEnergyPercentage = (combatState.player_energy / combatState.player_max_energy) * 100;
  const opponentEnergyPercentage = (combatState.opponent_energy / combatState.opponent_max_energy) * 100;

  return (
    <div className="space-y-6">
      {/* Player Stats */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800/50">
            {character.image_url ? (
              <img
                src={character.image_url}
                alt={character.character_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{character.character_name}</h3>
            <p className="text-blue-200 text-sm">Player</p>
          </div>
        </div>

        {/* HP Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-red-200 mb-1">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Health
            </span>
            <span>{combatState.player_hp}/{combatState.player_max_hp}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
              style={{ width: `${playerHpPercentage}%` }}
            />
          </div>
        </div>

        {/* Energy Bar */}
        <div>
          <div className="flex justify-between text-sm text-yellow-200 mb-1">
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Energy
            </span>
            <span>{combatState.player_energy}/{combatState.player_max_energy}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${playerEnergyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Opponent Stats */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-red-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800/50">
            {opponent.image_url ? (
              <img
                src={opponent.image_url}
                alt={opponent.character_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{opponent.character_name}</h3>
            <p className="text-red-200 text-sm">Opponent</p>
          </div>
        </div>

        {/* HP Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-red-200 mb-1">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Health
            </span>
            <span>{combatState.opponent_hp}/{combatState.opponent_max_hp}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
              style={{ width: `${opponentHpPercentage}%` }}
            />
          </div>
        </div>

        {/* Energy Bar */}
        <div>
          <div className="flex justify-between text-sm text-yellow-200 mb-1">
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Energy
            </span>
            <span>{combatState.opponent_energy}/{combatState.opponent_max_energy}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${opponentEnergyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Combat Info */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20">
        <h4 className="text-white font-semibold mb-2">Combat Rules</h4>
        <ul className="text-xs text-purple-200 space-y-1">
          <li>• <strong>Player Initiative:</strong> You act first, opponent reacts</li>
          <li>• <strong>Opponent Initiative:</strong> Opponent acts first, you react</li>
          <li>• <strong>Actions:</strong> Attack, Defend, Special, Counter</li>
          <li>• <strong>Strategy:</strong> Choose actions strong against opponent's type</li>
          <li>• <strong>Energy:</strong> Regenerates +10 each turn</li>
        </ul>
      </div>
    </div>
  );
}