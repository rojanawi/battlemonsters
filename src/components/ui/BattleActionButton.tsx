import React from 'react';
import { Sword, Laugh, Sparkles, Wand2 } from 'lucide-react';
import { Tooltip } from './Tooltip';
import type { BattleAction } from '../../types/game';

interface BattleActionButtonProps {
  action: BattleAction;
  index: number;
  disabled: boolean;
  onClick: (index: number) => void;
}

export function BattleActionButton({ action, index, disabled, onClick }: BattleActionButtonProps) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'generic':
        return <Sword className="w-4 h-4" />;
      case 'funny':
        return <Laugh className="w-4 h-4" />;
      case 'thematic':
        return <Sparkles className="w-4 h-4" />;
      case 'custom':
        return <Wand2 className="w-4 h-4" />;
      default:
        return <Sword className="w-4 h-4" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'generic':
        return disabled 
          ? 'border-gray-600/20 text-gray-500' 
          : 'border-blue-500/20 hover:border-blue-500/40 text-blue-200';
      case 'funny':
        return disabled 
          ? 'border-gray-600/20 text-gray-500' 
          : 'border-yellow-500/20 hover:border-yellow-500/40 text-yellow-200';
      case 'thematic':
        return disabled 
          ? 'border-gray-600/20 text-gray-500' 
          : 'border-purple-500/20 hover:border-purple-500/40 text-purple-200';
      case 'custom':
        return disabled 
          ? 'border-gray-600/20 text-gray-500' 
          : 'border-green-500/20 hover:border-green-500/40 text-green-200';
      default:
        return disabled 
          ? 'border-gray-600/20 text-gray-500' 
          : 'border-purple-500/20 hover:border-purple-500/40 text-purple-200';
    }
  };

  const getActionBg = (type: string) => {
    if (disabled) return 'bg-gray-800/30';
    
    switch (type) {
      case 'generic':
        return 'bg-gray-800/50 hover:bg-blue-900/30';
      case 'funny':
        return 'bg-gray-800/50 hover:bg-yellow-900/30';
      case 'thematic':
        return 'bg-gray-800/50 hover:bg-purple-900/30';
      case 'custom':
        return 'bg-gray-800/50 hover:bg-green-900/30';
      default:
        return 'bg-gray-800/50 hover:bg-purple-900/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'generic':
        return 'Basic';
      case 'funny':
        return 'Quirky';
      case 'thematic':
        return 'Special';
      case 'custom':
        return 'Custom';
      default:
        return 'Action';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    if (disabled) return 'bg-gray-700/50 text-gray-500';
    
    switch (type) {
      case 'generic':
        return 'bg-blue-900/50 text-blue-300';
      case 'funny':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'thematic':
        return 'bg-purple-900/50 text-purple-300';
      case 'custom':
        return 'bg-green-900/50 text-green-300';
      default:
        return 'bg-purple-900/50 text-purple-300';
    }
  };

  return (
    <Tooltip content={action.description} position="top">
      <button
        onClick={() => onClick(index)}
        disabled={disabled}
        className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
          getActionBg(action.type)
        } ${getActionColor(action.type)} ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {getActionIcon(action.type)}
            <h4 className="font-semibold text-sm">
              {action.name}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${getTypeBadgeColor(action.type)}`}>
              {getTypeLabel(action.type)}
            </span>
            <span className={`text-xs font-bold ${
              disabled ? 'text-gray-600' : 'text-red-400'
            }`}>
              {action.attack_points} DMG
            </span>
          </div>
        </div>
      </button>
    </Tooltip>
  );
}