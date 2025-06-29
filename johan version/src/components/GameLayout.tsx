import React from 'react';
import { useGame } from '../context/GameContext';
import { LoadingOverlay } from './LoadingOverlay';

export function GameLayout({ children }: { children: React.ReactNode }) {
  const { state } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {children}
      {state.isLoading && <LoadingOverlay />}
    </div>
  );
}