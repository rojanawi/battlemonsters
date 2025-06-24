import React from 'react';
import { Trophy, Skull, RotateCcw } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import type { Character, Opponent, CombatPhase } from '../../types/combat';

interface VictoryScreenProps {
  winner: 'player' | 'opponent';
  character: Character;
  opponent: Opponent;
  combatLog: CombatPhase[];
}

export function VictoryScreen({ winner, character, opponent, combatLog }: VictoryScreenProps) {
  const { dispatch } = useGame();

  const handlePlayAgain = () => {
    // Reset to character creation
    dispatch({ type: 'SET_CHARACTER', payload: null });
    dispatch({ type: 'SET_OPPONENT', payload: null });
    dispatch({ type: 'SELECT_POWER', payload: undefined });
  };

  const isVictory = winner === 'player';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <div className={`bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl border-2 ${
          isVictory ? 'border-yellow-500/50' : 'border-red-500/50'
        }`}>
          {/* Victory/Defeat Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              isVictory ? 'bg-yellow-500/20' : 'bg-red-500/20'
            }`}>
              {isVictory ? (
                <Trophy className="w-10 h-10 text-yellow-400" />
              ) : (
                <Skull className="w-10 h-10 text-red-400" />
              )}
            </div>
            
            <h1 className={`text-4xl font-bold mb-2 ${
              isVictory ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {isVictory ? 'VICTORY!' : 'DEFEAT!'}
            </h1>
            
            <p className="text-purple-200 text-lg">
              {isVictory 
                ? `${character.character_name} emerges triumphant!`
                : `${opponent.character_name} has defeated you!`
              }
            </p>
          </div>

          {/* Character Portraits */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className={`text-center ${isVictory ? 'opacity-100' : 'opacity-60'}`}>
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-800/50 mb-2">
                {character.image_url ? (
                  <img
                    src={character.image_url}
                    alt={character.character_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-blue-400" />
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold">{character.character_name}</h3>
              <p className="text-blue-200 text-sm">Player</p>
            </div>

            <div className="text-4xl text-purple-400">VS</div>

            <div className={`text-center ${!isVictory ? 'opacity-100' : 'opacity-60'}`}>
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-800/50 mb-2">
                {opponent.image_url ? (
                  <img
                    src={opponent.image_url}
                    alt={opponent.character_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skull className="w-8 h-8 text-red-400" />
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold">{opponent.character_name}</h3>
              <p className="text-red-200 text-sm">Opponent</p>
            </div>
          </div>

          {/* Battle Summary */}
          <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
            <h4 className="text-white font-semibold mb-2">Battle Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-purple-200">Total Turns: <span className="text-white font-semibold">{combatLog.length}</span></p>
              </div>
              <div>
                <p className="text-purple-200">Combat Style: <span className="text-white font-semibold">Turn-Based</span></p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePlayAgain}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-semibold"
            >
              <RotateCcw className="w-5 h-5" />
              Create New Character
            </button>
          </div>

          {/* Flavor Text */}
          <div className="text-center mt-6">
            <p className="text-purple-300 text-sm italic">
              {isVictory 
                ? "Your strategic prowess has led you to victory! The battlefield remembers your name."
                : "Defeat is but a lesson in disguise. Rise again, warrior, and claim your destiny!"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}