// Character prompt generation data
export const CHARACTER_ARCHETYPES = [
  'Cyber samurai', 'Ancient dragon mage', 'Shadow assassin', 'Crystal golem', 'Storm witch',
  'Void knight', 'Phoenix warrior', 'Ice queen', 'Lightning monk', 'Dark necromancer',
  'Celestial guardian', 'Demon hunter', 'Arcane scholar', 'Battle android', 'Mystic shaman',
  'Frost giant', 'Fire elemental', 'Wind dancer', 'Earth titan', 'Star weaver',
  'Blood vampire', 'Holy paladin', 'Chaos sorcerer', 'Time manipulator', 'Space pirate',
  'Quantum hacker', 'Bio-engineer', 'Psionic warrior', 'Ethereal ghost', 'Primal beast'
];

export const MAGICAL_ABILITIES = [
  'lightning fists', 'time magic', 'shadow manipulation', 'crystal armor', 'storm control',
  'void powers', 'flame wings', 'ice shards', 'thunder strikes', 'dark energy',
  'celestial light', 'demon summoning', 'arcane missiles', 'nano-tech', 'spirit animals',
  'frost breath', 'lava control', 'wind blades', 'earthquake fists', 'starlight beams',
  'blood magic', 'divine healing', 'chaos bolts', 'temporal shifts', 'gravity wells',
  'quantum tunneling', 'genetic morphing', 'mind control', 'phase shifting', 'primal roars'
];

export const UNIQUE_TRAITS = [
  'who can melt into darkness', 'with eyes that see through time', 'whose touch freezes enemies',
  'that phases between dimensions', 'who commands the weather', 'with unbreakable crystal skin',
  'that burns with eternal flames', 'who speaks to the dead', 'with mechanical limbs',
  'that feeds on fear', 'who controls gravity', 'with wings of pure energy',
  'that can duplicate themselves', 'who breathes underwater', 'with poisonous claws',
  'that never feels pain', 'who can become invisible', 'with telepathic powers',
  'that controls plant life', 'who manipulates memories', 'with diamond-hard bones',
  'that can shrink or grow', 'who sees all possible futures', 'with acidic blood',
  'that regenerates instantly', 'who controls technology', 'with sonic screams',
  'that walks through walls', 'who bends reality', 'with infinite stamina'
];

export const VISUAL_STYLES = [
  'cyberpunk aesthetic', 'ancient mystical robes', 'sleek modern armor', 'tribal war paint',
  'glowing tattoos', 'mechanical augmentations', 'ethereal translucent form', 'battle scars',
  'ornate jewelry', 'flowing cape', 'spiked armor', 'elegant silk garments',
  'runic inscriptions', 'bioluminescent skin', 'crystalline features', 'metallic sheen',
  'shadowy aura', 'fiery emanations', 'icy breath', 'electric sparks',
  'divine halo', 'demonic horns', 'angelic wings', 'bestial claws',
  'holographic projections', 'living tattoos', 'shape-shifting form', 'prismatic colors',
  'void-black appearance', 'starlight patterns', 'temporal distortions'
];

// Function to generate a random character prompt
export function generateRandomPrompt(): string {
  const archetype = CHARACTER_ARCHETYPES[Math.floor(Math.random() * CHARACTER_ARCHETYPES.length)];
  const ability = MAGICAL_ABILITIES[Math.floor(Math.random() * MAGICAL_ABILITIES.length)];
  const trait = UNIQUE_TRAITS[Math.floor(Math.random() * UNIQUE_TRAITS.length)];
  const style = VISUAL_STYLES[Math.floor(Math.random() * VISUAL_STYLES.length)];
  
  // Create different prompt structures for variety
  const structures = [
    `${archetype} wielding ${ability}`,
    `${archetype} ${trait}`,
    `${archetype} with ${ability} and ${style}`,
    `${archetype} ${trait} with ${style}`,
    `Legendary ${archetype} who masters ${ability}`,
    `Ancient ${archetype} ${trait} and commands ${ability}`,
    `Mystical ${archetype} with ${ability}, featuring ${style}`,
    `Powerful ${archetype} ${trait}, adorned with ${style}`
  ];
  
  return structures[Math.floor(Math.random() * structures.length)];
}

// Generate multiple random prompts
export function generateExamplePrompts(count: number = 3): string[] {
  const prompts = new Set<string>();
  
  while (prompts.size < count) {
    prompts.add(generateRandomPrompt());
  }
  
  return Array.from(prompts);
}