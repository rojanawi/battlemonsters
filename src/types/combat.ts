export interface CombatAction {
  id: string;
  name: string;
  description: string;
  damage: number;
  type: 'attack' | 'defend' | 'special' | 'counter' | 'character_trait' | 'funny' | 'reactive' | 'custom_input';
  energy_cost: number;
  strengths: string[]; // What this action is strong against
  weaknesses: string[]; // What this action is weak to
  effects?: {
    self_heal?: number;
    enemy_debuff?: string;
    self_buff?: string;
    damage_reduction?: number;
    counter_damage?: number;
  };
}

export interface CombatPhase {
  phase: 'player_initiative' | 'opponent_initiative';
  turn_number: number;
  initiator: 'player' | 'opponent';
  initiator_action?: CombatAction;
  reactor_action?: CombatAction;
  resolution?: CombatResolution;
  status: 'declaring' | 'reacting' | 'resolving' | 'completed';
}

export interface CombatResolution {
  initiator_damage_dealt: number;
  reactor_damage_dealt: number;
  initiator_damage_taken: number;
  reactor_damage_taken: number;
  special_effects: string[];
  advantage: 'initiator' | 'reactor' | 'neutral';
  description: string;
}

export interface CombatState {
  current_phase: CombatPhase;
  player_hp: number;
  opponent_hp: number;
  player_energy: number;
  opponent_energy: number;
  player_max_hp: number;
  opponent_max_hp: number;
  player_max_energy: number;
  opponent_max_energy: number;
  available_actions: CombatAction[];
  opponent_available_actions: CombatAction[];
  combat_log: CombatPhase[];
  is_battle_ended: boolean;
  winner?: 'player' | 'opponent';
  waiting_for_reaction: boolean;
  declared_action?: CombatAction;
  opponent_declared_action?: CombatAction;
  is_generating_actions?: boolean;
}

export type CombatActionType = 'attack' | 'defend' | 'special' | 'counter' | 'character_trait' | 'funny' | 'reactive' | 'custom_input';

export interface ActionEffectiveness {
  damage_multiplier: number;
  description: string;
  is_effective: boolean;
}

// Re-export for compatibility with existing game types
export interface Character {
  character_name: string;
  description: string;
  hp: number;
  energy: number;
  mana: number;
  powers: Array<{
    name: string;
    description: string;
    energy_cost: number;
    cooldown: number;
    damage_range: string;
  }>;
  image_prompt: string;
  image_url?: string;
  current_actions?: Array<{
    name: string;
    description: string;
    attack_points: number;
    type: 'generic' | 'funny' | 'thematic' | 'custom';
  }>;
}

export interface Opponent {
  character_name: string;
  description: string;
  hp: number;
  energy: number;
  mana: number;
  powers: Array<{
    name: string;
    description: string;
    energy_cost: number;
    cooldown: number;
    damage_range: string;
  }>;
  image_url: string;
  image_prompt: string;
}