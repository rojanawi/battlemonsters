import React, { createContext, useContext, useReducer } from 'react';
import type { GameState, GameAction, Character, Opponent } from '../types/game';

const initialState: GameState = {
  character: null,
  opponent: null,
  isLoading: false,
  error: null,
  isGeneratingImage: false,
  imageGenerationError: false,
  demoMode: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CHARACTER':
      return { 
        ...state, 
        character: action.payload, 
        isLoading: false,
        imageGenerationError: false // Reset image error when new character is set
      };
    case 'SET_OPPONENT':
      return { ...state, opponent: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SELECT_POWER':
      return { ...state, selectedPower: action.payload };
    case 'SET_CHARACTER_IMAGE':
      return state.character
        ? { ...state, character: { ...state.character, image_url: action.payload } }
        : state;
    case 'SET_GENERATING_IMAGE':
      return { ...state, isGeneratingImage: action.payload };
    case 'SET_IMAGE_GENERATION_ERROR':
      return { ...state, imageGenerationError: action.payload };
    case 'TOGGLE_DEMO_MODE':
      return { ...state, demoMode: action.payload };
    case 'RESET_GAME':
      return { 
        ...initialState, 
        demoMode: state.demoMode // Preserve demo mode setting
      };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}