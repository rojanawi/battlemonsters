import React from 'react';
import { ScrollText, Sword, Shield, Sparkles, RotateCcw } from 'lucide-react';
import type { CombatPhase } from '../../types/combat';

interface CombatLogProps {
  combatLog: CombatPhase[];
}

export function CombatLog({ combatLog }: CombatLogProps) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'attack':
        return <Sword className="w-4 h-4 text-red-400" />;
      case 'defend':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'special':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'counter':
        return <RotateCcw className="w-4 h-4 text-yellow-400" />;
      default:
        return <Sword className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 h-full">
      <div className="flex items-center gap-2 mb-4">
        <ScrollText className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Combat Log</h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {combatLog.length === 0 ? (
          <p className="text-purple-300 text-sm italic">Combat has not yet begun...</p>
        ) : (
          combatLog.map((phase, index) => (
            <div key={index} className="border-l-2 border-purple-500/30 pl-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-purple-300">
                  Turn {phase.turn_number} - {phase.phase === 'player_initiative' ? 'Player Initiative' : 'Opponent Initiative'}
                </span>
              </div>

              {phase.initiator_action && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    {getActionIcon(phase.initiator_action.type)}
                    <span className="text-sm font-semibold text-white">
                      {phase.initiator === 'player' ? 'You' : 'Opponent'} used {phase.initiator_action.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 ml-6">
                    {phase.initiator_action.description}
                  </p>
                </div>
              )}

              {phase.reactor_action && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    {getActionIcon(phase.reactor_action.type)}
                    <span className="text-sm font-semibold text-white">
                      {phase.initiator === 'opponent' ? 'You' : 'Opponent'} reacted with {phase.reactor_action.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 ml-6">
                    {phase.reactor_action.description}
                  </p>
                </div>
              )}

              {phase.resolution && (
                <div className="bg-gray-800/50 p-3 rounded-lg ml-2">
                  <p className="text-sm text-purple-200 mb-2">{phase.resolution.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-blue-300">
                        {phase.initiator === 'player' ? 'You' : 'Opponent'}:
                      </span>
                      <span className="text-red-400 ml-1">
                        -{phase.resolution.initiator_damage_taken} HP
                      </span>
                    </div>
                    <div>
                      <span className="text-red-300">
                        {phase.initiator === 'opponent' ? 'You' : 'Opponent'}:
                      </span>
                      <span className="text-red-400 ml-1">
                        -{phase.resolution.reactor_damage_taken} HP
                      </span>
                    </div>
                  </div>
                  {phase.resolution.special_effects.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-600/30">
                      {phase.resolution.special_effects.map((effect, effectIndex) => (
                        <p key={effectIndex} className="text-xs text-yellow-300">
                          • {effect}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}