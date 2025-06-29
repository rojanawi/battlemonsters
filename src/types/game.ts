interface Power {
  name: string;
  description: string;
  energy_cost: number;
  cooldown: number;
  damage_range: string;
}

interface BattleAction {
  name: string;
  description: string;
  attack_points: number;
  type: 'generic' | 'funny' | 'thematic' | 'custom';
}

export interface Character {
  character_name: string;
  description: string;
  hp: number;
  energy: number;
  mana: number;
  powers: Power[];
  image_prompt: string;
  image_url?: string;
  current_actions?: BattleAction[];
}

export interface Opponent {
  character_name: string;
  description: string;
  hp: number;
  energy: number;
  mana: number;
  powers: Power[];
  image_url: string;
  image_prompt: string;
}

export interface GameState {
  character: Character | null;
  opponent: Opponent | null;
  isLoading: boolean;
  error: string | null;
  selectedPower?: number;
  isGeneratingImage: boolean;
  imageGenerationError: boolean;
  demoMode: boolean;
  isGeneratingActions: boolean;
}

export type GameAction =
  | { type: 'SET_CHARACTER'; payload: Character }
  | { type: 'SET_OPPONENT'; payload: Opponent }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_POWER'; payload: number | undefined }
  | { type: 'SET_CHARACTER_IMAGE'; payload: string }
  | { type: 'SET_GENERATING_IMAGE'; payload: boolean }
  | { type: 'SET_IMAGE_GENERATION_ERROR'; payload: boolean }
  | { type: 'TOGGLE_DEMO_MODE'; payload: boolean }
  | { type: 'RESET_GAME' }
  | { type: 'SET_CHARACTER_ACTIONS'; payload: BattleAction[] }
  | { type: 'SET_GENERATING_ACTIONS'; payload: boolean };

// Re-export combat types for compatibility;