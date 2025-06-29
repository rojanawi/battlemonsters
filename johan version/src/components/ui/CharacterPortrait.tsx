import React from 'react';
import type { Character } from '../../types/game';

interface CharacterPortraitProps {
  character: Character;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function CharacterPortrait({ character, size = 'medium', className = '' }: CharacterPortraitProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto rounded-lg overflow-hidden bg-gray-800/50 ${className}`}>
      {character.image_url ? (
        <img
          src={character.image_url}
          alt={character.character_name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
            <span className="text-2xl">⚔️</span>
          </div>
        </div>
      )}
    </div>
  );
}