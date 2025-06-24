import type { CombatAction, CombatState, CombatPhase, CombatResolution, ActionEffectiveness, Character, Opponent } from '../types/combat';

// Base action templates that can be customized per character
export const BASE_ACTIONS: Record<string, Omit<CombatAction, 'id'>> = {
  // Attack Actions
  quick_strike: {
    name: "Quick Strike",
    description: "A fast, precise attack that's hard to counter",
    damage: 25,
    type: 'attack',
    energy_cost: 15,
    strengths: ['defend', 'special'],
    weaknesses: ['counter'],
  },
  power_attack: {
    name: "Power Attack",
    description: "A devastating blow that breaks through defenses",
    damage: 40,
    type: 'attack',
    energy_cost: 25,
    strengths: ['defend'],
    weaknesses: ['counter', 'attack'],
  },
  combo_strike: {
    name: "Combo Strike",
    description: "Multiple hits that overwhelm counters",
    damage: 30,
    type: 'attack',
    energy_cost: 20,
    strengths: ['counter'],
    weaknesses: ['defend', 'special'],
  },

  // Defend Actions
  block: {
    name: "Block",
    description: "Reduces incoming damage and builds energy",
    damage: 10,
    type: 'defend',
    energy_cost: 10,
    strengths: ['attack'],
    weaknesses: ['special'],
    effects: {
      damage_reduction: 50,
      self_heal: 5,
    },
  },
  parry: {
    name: "Parry",
    description: "Deflects attacks and counters with precision",
    damage: 20,
    type: 'defend',
    energy_cost: 15,
    strengths: ['attack'],
    weaknesses: ['special'],
    effects: {
      counter_damage: 15,
      damage_reduction: 30,
    },
  },
  dodge: {
    name: "Dodge",
    description: "Evades attacks completely but leaves you exposed",
    damage: 5,
    type: 'defend',
    energy_cost: 12,
    strengths: ['attack'],
    weaknesses: ['special'],
    effects: {
      damage_reduction: 80,
    },
  },

  // Special Actions
  power_surge: {
    name: "Power Surge",
    description: "Unleashes raw energy, ignoring defenses",
    damage: 35,
    type: 'special',
    energy_cost: 30,
    strengths: ['defend'],
    weaknesses: ['attack', 'counter'],
  },
  energy_drain: {
    name: "Energy Drain",
    description: "Steals opponent's energy while dealing damage",
    damage: 20,
    type: 'special',
    energy_cost: 20,
    strengths: ['defend', 'special'],
    weaknesses: ['attack'],
    effects: {
      enemy_debuff: 'energy_drain',
    },
  },
  berserker_rage: {
    name: "Berserker Rage",
    description: "Sacrifices defense for overwhelming offense",
    damage: 45,
    type: 'special',
    energy_cost: 35,
    strengths: ['defend', 'counter'],
    weaknesses: ['attack'],
  },

  // Counter Actions
  counter_attack: {
    name: "Counter Attack",
    description: "Waits for enemy action then strikes back harder",
    damage: 15,
    type: 'counter',
    energy_cost: 18,
    strengths: ['attack'],
    weaknesses: ['defend', 'special'],
    effects: {
      counter_damage: 25,
    },
  },
  reflect: {
    name: "Reflect",
    description: "Turns enemy's power against them",
    damage: 10,
    type: 'counter',
    energy_cost: 22,
    strengths: ['special'],
    weaknesses: ['attack', 'defend'],
    effects: {
      counter_damage: 30,
    },
  },
  anticipate: {
    name: "Anticipate",
    description: "Predicts and counters any incoming attack",
    damage: 20,
    type: 'counter',
    energy_cost: 25,
    strengths: ['attack', 'special'],
    weaknesses: ['defend'],
    effects: {
      counter_damage: 20,
      damage_reduction: 25,
    },
  },
};

export function generateActionId(): string {
  return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createCombatAction(baseAction: string, customizations?: Partial<CombatAction>): CombatAction {
  const base = BASE_ACTIONS[baseAction];
  if (!base) {
    throw new Error(`Unknown base action: ${baseAction}`);
  }

  return {
    id: generateActionId(),
    ...base,
    ...customizations,
  };
}

export function createCustomInputAction(): CombatAction {
  return {
    id: generateActionId(),
    name: "Custom Action",
    description: "Type your own action...",
    damage: 0,
    type: 'custom_input',
    energy_cost: 0,
    strengths: [],
    weaknesses: [],
  };
}

export function createDynamicAction(
  name: string,
  description: string,
  damage: number,
  energyCost: number,
  type: 'character_trait' | 'funny' | 'reactive'
): CombatAction {
  // Assign strengths and weaknesses based on type
  let strengths: string[] = [];
  let weaknesses: string[] = [];

  switch (type) {
    case 'character_trait':
      strengths = ['defend', 'special'];
      weaknesses = ['counter'];
      break;
    case 'funny':
      strengths = ['counter', 'special'];
      weaknesses = ['attack'];
      break;
    case 'reactive':
      strengths = ['attack', 'defend'];
      weaknesses = ['special'];
      break;
  }

  return {
    id: generateActionId(),
    name,
    description,
    damage,
    type,
    energy_cost: energyCost,
    strengths,
    weaknesses,
  };
}

export async function generateDynamicActions(
  character: Character,
  opponent: Opponent,
  phase: 'declaring' | 'reacting',
  opponentAction?: CombatAction,
  turnNumber?: number
): Promise<CombatAction[]> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dynamic-actions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character,
          opponent,
          phase,
          opponent_action: opponentAction,
          turn_number: turnNumber,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate dynamic actions: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.actions || !Array.isArray(data.actions)) {
      throw new Error('Invalid response format from dynamic actions API');
    }

    // Convert API response to CombatAction objects
    const dynamicActions = data.actions.map((action: any) => 
      createDynamicAction(action.name, action.description, action.damage, action.energy_cost, action.type)
    );

    // Add the custom input action as the 4th option
    const customInputAction = createCustomInputAction();

    return [...dynamicActions, customInputAction];
  } catch (error) {
    console.error('Failed to generate dynamic actions:', error);
    
    // Fallback to static actions if API fails
    return [
      createCombatAction('quick_strike'),
      createCombatAction('block'),
      createCombatAction('power_surge'),
      createCustomInputAction(),
    ];
  }
}

export function calculateActionEffectiveness(initiatorAction: CombatAction, reactorAction: CombatAction): ActionEffectiveness {
  const isStrong = initiatorAction.strengths.includes(reactorAction.type);
  const isWeak = initiatorAction.weaknesses.includes(reactorAction.type);

  if (isStrong && !isWeak) {
    return {
      damage_multiplier: 1.5,
      description: `${initiatorAction.name} is effective against ${reactorAction.name}!`,
      is_effective: true,
    };
  } else if (isWeak && !isStrong) {
    return {
      damage_multiplier: 0.7,
      description: `${initiatorAction.name} is weak against ${reactorAction.name}!`,
      is_effective: false,
    };
  } else {
    return {
      damage_multiplier: 1.0,
      description: `${initiatorAction.name} clashes evenly with ${reactorAction.name}.`,
      is_effective: true,
    };
  }
}

export function resolveCombatActions(
  initiatorAction: CombatAction,
  reactorAction: CombatAction,
  initiatorHp: number,
  reactorHp: number,
  initiatorEnergy: number,
  reactorEnergy: number
): CombatResolution {
  // Calculate base effectiveness
  const initiatorEffectiveness = calculateActionEffectiveness(initiatorAction, reactorAction);
  const reactorEffectiveness = calculateActionEffectiveness(reactorAction, initiatorAction);

  // Calculate base damage
  let initiatorDamage = Math.floor(initiatorAction.damage * initiatorEffectiveness.damage_multiplier);
  let reactorDamage = Math.floor(reactorAction.damage * reactorEffectiveness.damage_multiplier);

  // Apply defensive effects
  if (reactorAction.effects?.damage_reduction) {
    const reduction = reactorAction.effects.damage_reduction / 100;
    initiatorDamage = Math.floor(initiatorDamage * (1 - reduction));
  }

  if (initiatorAction.effects?.damage_reduction) {
    const reduction = initiatorAction.effects.damage_reduction / 100;
    reactorDamage = Math.floor(reactorDamage * (1 - reduction));
  }

  // Apply counter damage
  if (reactorAction.effects?.counter_damage && initiatorAction.type === 'attack') {
    reactorDamage += reactorAction.effects.counter_damage;
  }

  if (initiatorAction.effects?.counter_damage && reactorAction.type === 'attack') {
    initiatorDamage += initiatorAction.effects.counter_damage;
  }

  // Ensure minimum damage
  initiatorDamage = Math.max(1, initiatorDamage);
  reactorDamage = Math.max(1, reactorDamage);

  // Determine advantage
  let advantage: 'initiator' | 'reactor' | 'neutral' = 'neutral';
  if (initiatorEffectiveness.is_effective && !reactorEffectiveness.is_effective) {
    advantage = 'initiator';
  } else if (reactorEffectiveness.is_effective && !initiatorEffectiveness.is_effective) {
    advantage = 'reactor';
  }

  // Build special effects description
  const specialEffects: string[] = [];
  
  if (initiatorAction.effects?.self_heal) {
    specialEffects.push(`${initiatorAction.name} heals for ${initiatorAction.effects.self_heal} HP`);
  }
  
  if (reactorAction.effects?.self_heal) {
    specialEffects.push(`${reactorAction.name} heals for ${reactorAction.effects.self_heal} HP`);
  }

  if (initiatorAction.effects?.energy_drain) {
    specialEffects.push(`${initiatorAction.name} drains energy from opponent`);
  }

  if (reactorAction.effects?.energy_drain) {
    specialEffects.push(`${reactorAction.name} drains energy from opponent`);
  }

  // Create resolution description
  let description = `${initiatorAction.name} vs ${reactorAction.name}: `;
  if (advantage === 'initiator') {
    description += `${initiatorAction.name} dominates the exchange!`;
  } else if (advantage === 'reactor') {
    description += `${reactorAction.name} turns the tables!`;
  } else {
    description += `Both fighters clash with equal force!`;
  }

  return {
    initiator_damage_dealt: initiatorDamage,
    reactor_damage_dealt: reactorDamage,
    initiator_damage_taken: reactorDamage,
    reactor_damage_taken: initiatorDamage,
    special_effects: specialEffects,
    advantage,
    description,
  };
}

export function initializeCombatState(
  playerHp: number,
  opponentHp: number,
  playerEnergy: number,
  opponentEnergy: number
): CombatState {
  return {
    current_phase: {
      phase: 'player_initiative',
      turn_number: 1,
      initiator: 'player',
      status: 'declaring',
    },
    player_hp: playerHp,
    opponent_hp: opponentHp,
    player_energy: playerEnergy,
    opponent_energy: opponentEnergy,
    player_max_hp: playerHp,
    opponent_max_hp: opponentHp,
    player_max_energy: playerEnergy,
    opponent_max_energy: opponentEnergy,
    available_actions: [], // Will be populated dynamically
    opponent_available_actions: generateOpponentActions(),
    combat_log: [],
    is_battle_ended: false,
    waiting_for_reaction: false,
    is_generating_actions: false,
  };
}

export function generatePlayerActions(): CombatAction[] {
  // This is now replaced by generateDynamicActions
  // Keeping for fallback purposes
  const actionTypes = ['quick_strike', 'block', 'power_surge', 'counter_attack'];
  return actionTypes.map(type => createCombatAction(type));
}

export function generateOpponentActions(): CombatAction[] {
  // Generate opponent actions (AI will choose from these)
  const actionTypes = ['power_attack', 'parry', 'energy_drain', 'reflect'];
  return actionTypes.map(type => createCombatAction(type));
}

export function selectOpponentReaction(playerAction: CombatAction, availableActions: CombatAction[]): CombatAction {
  // Simple AI: Choose action that's strong against player's action
  const strongActions = availableActions.filter(action => 
    action.strengths.includes(playerAction.type)
  );

  if (strongActions.length > 0) {
    return strongActions[Math.floor(Math.random() * strongActions.length)];
  }

  // Fallback: Choose random action
  return availableActions[Math.floor(Math.random() * availableActions.length)];
}

export function selectOpponentInitiative(availableActions: CombatAction[]): CombatAction {
  // AI chooses initiative action - prefer attacks and specials
  const preferredActions = availableActions.filter(action => 
    action.type === 'attack' || action.type === 'special'
  );

  if (preferredActions.length > 0) {
    return preferredActions[Math.floor(Math.random() * preferredActions.length)];
  }

  return availableActions[Math.floor(Math.random() * availableActions.length)];
}

export function advanceCombatPhase(state: CombatState): CombatState {
  const newState = { ...state };

  if (state.current_phase.phase === 'player_initiative') {
    // Switch to opponent initiative
    newState.current_phase = {
      phase: 'opponent_initiative',
      turn_number: state.current_phase.turn_number,
      initiator: 'opponent',
      status: 'declaring',
    };
  } else {
    // Complete the turn and start new player initiative
    newState.current_phase = {
      phase: 'player_initiative',
      turn_number: state.current_phase.turn_number + 1,
      initiator: 'player',
      status: 'declaring',
    };
    
    // Clear actions - they will be regenerated dynamically
    newState.available_actions = [];
    newState.opponent_available_actions = generateOpponentActions();
    
    // Restore some energy each turn
    newState.player_energy = Math.min(
      newState.player_max_energy, 
      newState.player_energy + 10
    );
    newState.opponent_energy = Math.min(
      newState.opponent_max_energy, 
      newState.opponent_energy + 10
    );
  }

  newState.waiting_for_reaction = false;
  newState.declared_action = undefined;
  newState.opponent_declared_action = undefined;

  return newState;
}

export function checkVictoryCondition(state: CombatState): CombatState {
  const newState = { ...state };

  if (state.player_hp <= 0) {
    newState.is_battle_ended = true;
    newState.winner = 'opponent';
  } else if (state.opponent_hp <= 0) {
    newState.is_battle_ended = true;
    newState.winner = 'player';
  }

  return newState;
}