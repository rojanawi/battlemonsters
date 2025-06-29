import React from 'react';
import { Loader2, Zap, Skull, Sword } from 'lucide-react';

interface SkeletonPanelProps {
  isVillainAction?: boolean;
  index: number;
}

export function SkeletonPanel({ isVillainAction = false, index }: SkeletonPanelProps) {
  return (
    <div className="h-full flex flex-col relative">
      {/* Comic Panel */}
      <div className="flex-1 bg-gray-800/50 rounded-t-xl border-4 border-b-0 border-purple-500/30 overflow-hidden shadow-xl relative">
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 animate-pulse">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
          <div className="flex items-center gap-2 mb-3">
            {isVillainAction ? (
              <Skull className="w-6 h-6 text-red-400" />
            ) : (
              <Sword className="w-6 h-6 text-purple-400" />
            )}
            <p className="text-purple-300 font-medium">
              {isVillainAction ? 'Villain' : 'Hero'} Action
            </p>
          </div>
          <div className="flex items-center gap-2 text-purple-400 text-sm">
            <Zap className="w-4 h-4" />
            <span>Generating Epic Scene...</span>
          </div>
        </div>
      </div>

      {/* Skeleton Description */}
      <div className="h-16 p-2 bg-gray-800/30 rounded-b-xl border-4 border-t-0 border-purple-500/20 flex items-center justify-center">
        <div className="w-full h-4 bg-gray-700/50 rounded animate-pulse"></div>
      </div>
    </div>
  );
}