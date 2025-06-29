import React from 'react';
import { Sword, Shield, Zap, Skull, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import type { Character, Opponent } from '../../types/game';

interface CharacterCardProps {
  character: Character | Opponent;
  isPlayer?: boolean;
  isGeneratingImage?: boolean;
  imageGenerationError?: boolean;
  onRetryImageGeneration?: () => void;
}

export function CharacterCard({ 
  character, 
  isPlayer = false, 
  isGeneratingImage = false, 
  imageGenerationError = false,
  onRetryImageGeneration 
}: CharacterCardProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
      <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-800/50">
        {isPlayer && isGeneratingImage ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-2" />
            <p className="text-sm text-purple-300">Generating image...</p>
          </div>
        ) : isPlayer && imageGenerationError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-sm text-red-300 text-center mb-3">Failed to generate image</p>
            <button
              onClick={onRetryImageGeneration}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : character.image_url ? (
          <img
            src={character.image_url}
            alt={character.character_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center">
              {isPlayer ? <Sword className="w-8 h-8 text-purple-400" /> : <Skull className="w-8 h-8 text-red-400" />}
            </div>
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4">{character.character_name}</h2>
      <p className="text-purple-200 mb-6">{character.description}</p>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-red-900/30 border border-red-500/30">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-sm text-red-200">HP</div>
          <div className="font-bold text-red-400">{character.hp}</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-900/30 border border-yellow-500/30">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-sm text-yellow-200">Energy</div>
          <div className="font-bold text-yellow-400">{character.energy}</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-blue-900/30 border border-blue-500/30">
            <Sword className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-sm text-blue-200">Mana</div>
          <div className="font-bold text-blue-400">{character.mana}</div>
        </div>
      </div>
    </div>
  );
}