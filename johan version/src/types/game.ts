export interface Power {
  name: string;
  description: string;
  energy_cost: number;
  cooldown: number;
  damage_range: string;
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
  | { type: 'RESET_GAME' };