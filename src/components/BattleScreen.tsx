import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { ComicBattleInterface } from './ComicBattleInterface';
import { getRandomOpponent } from '../data/opponents';
import { DEMO_TIME_MANIPULATOR } from '../data/demoCharacters';

export function BattleScreen() {
  const { state, dispatch } = useGame();
  const { character, opponent, demoMode } = state;
  const opponentSelected = useRef(false);

  // Select opponent when character is created
  useEffect(() => {
    if (character && !opponent && !opponentSelected.current) {
      opponentSelected.current = true;
      
      if (demoMode) {
        // Use demo opponent
        dispatch({ type: 'SET_OPPONENT', payload: DEMO_TIME_MANIPULATOR });
      } else {
        // Use random opponent
        const randomOpponent = getRandomOpponent();
        dispatch({ type: 'SET_OPPONENT', payload: randomOpponent });
      }
    }
  }, [character, opponent, demoMode, dispatch]);

  if (!character || !opponent) return null;

  return <ComicBattleInterface />;
}