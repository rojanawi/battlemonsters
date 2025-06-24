import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { BattleStatus } from './BattleStatus';
import { PlayerHealthBar } from './PlayerHealthBar';
import { CharacterPortrait } from './CharacterPortrait';
import { PowersList } from './PowersList';
import type { Character } from '../../types/game';

interface PlayerSidebarProps {
  character: Character;
  playerHp: number;
  battleEnded: boolean;
  playerWon: boolean;
  onGoBack: () => void;
  onAttack: (powerIndex: number) => void;
  onCustomAction?: (actionDescription: string) => void;
  isGeneratingActions?: boolean;
}

export function PlayerSidebar({ 
  character, 
  playerHp, 
  battleEnded, 
  playerWon, 
  onGoBack, 
  onAttack,
  onCustomAction,
  isGeneratingActions = false
}: PlayerSidebarProps) {
  return (
    <div className="w-80 bg-gray-900/80 backdrop-blur-sm border-r border-purple-500/20 p-6 flex flex-col">
      <button
        onClick={onGoBack}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Battle Setup
      </button>

      <div className="text-center mb-6">
        <div className="text-lg font-semibold text-purple-200 mb-2">{character.character_name}</div>
        
        <PlayerHealthBar character={character} currentHp={playerHp} />
        <CharacterPortrait character={character} size="medium" className="mb-4" />
      </div>

      <BattleStatus battleEnded={battleEnded} playerWon={playerWon} />
      <PowersList 
        powers={character.powers}
        battleActions={character.current_actions}
        onPowerSelect={onAttack} 
        onCustomAction={onCustomAction}
        disabled={battleEnded}
        isGeneratingActions={isGeneratingActions}
      />
    </div>
  );
}