import React from 'react';
import { GameProvider } from './context/GameContext';
import { GameLayout } from './components/GameLayout';
import { CharacterCreation } from './components/CharacterCreation';

function App() {
  return (
    <GameProvider>
      <GameLayout>
        <CharacterCreation />
      </GameLayout>
    </GameProvider>
  );
}

export default App;