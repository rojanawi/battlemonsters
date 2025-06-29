import type { Opponent } from '../types/game';

export const SHADOW_REAPER: Opponent = {
  character_name: "Shadow Reaper",
  description: "A dark entity from the void realm, wielding ancient necromantic powers and feeding on the life force of its enemies.",
  hp: 120,
  energy: 100,
  mana: 85,
  powers: [
    {
      name: "Soul Drain",
      description: "Shadow Reaper extends spectral tendrils that pierce through the enemy's defenses, siphoning their life force while dark energy flows back to restore the reaper's own vitality",
      energy_cost: 25,
      cooldown: 4,
      damage_range: "20-35"
    },
    {
      name: "Shadow Strike",
      description: "Shadow Reaper melts into the darkness and materializes behind the enemy, delivering a swift strike with void-touched claws that bypasses all armor and shields",
      energy_cost: 20,
      cooldown: 3,
      damage_range: "15-30"
    },
    {
      name: "Void Blast",
      description: "Shadow Reaper channels the raw power of the void realm, unleashing a devastating explosion of dark energy that tears through reality itself to devastate the battlefield",
      energy_cost: 40,
      cooldown: 6,
      damage_range: "35-50"
    }
  ],
  image_url: "https://i.ibb.co/HLNJNcKg/Gemini-Generated-Image-6tj37f6tj37f6tj3.jpg",
  image_prompt: "Dark hooded figure wreathed in shadows and purple energy, skeletal hands with glowing claws, tattered black robes flowing in supernatural wind, glowing red eyes piercing through darkness, necromantic aura, void energy swirling around, menacing presence, dark fantasy villain, gothic horror aesthetic"
};

export const CRYSTAL_GOLEM: Opponent = {
  character_name: "Crystal Golem",
  description: "An ancient construct made of living crystal, powered by elemental magic and nearly indestructible armor plating.",
  hp: 150,
  energy: 80,
  mana: 60,
  powers: [
    {
      name: "Crystal Spear",
      description: "Crystal Golem raises its massive arm and launches razor-sharp crystalline projectiles at incredible velocity, each shard gleaming with magical energy as they pierce through the air",
      energy_cost: 20,
      cooldown: 3,
      damage_range: "18-28"
    },
    {
      name: "Earthquake Slam",
      description: "Crystal Golem pounds the ground with tremendous force, causing the earth to crack and split as devastating shockwaves ripple outward, destabilizing everything in their path",
      energy_cost: 35,
      cooldown: 5,
      damage_range: "25-40"
    },
    {
      name: "Crystal Barrier",
      description: "Crystal Golem summons protective crystalline shields that erupt from the ground while simultaneously launching crystal fragments at enemies, creating both defense and offense",
      energy_cost: 30,
      cooldown: 4,
      damage_range: "15-25"
    }
  ],
  image_url: "https://i.ibb.co/DHczZmc0/golem.jpg",
  image_prompt: "Massive crystalline golem with translucent blue-white crystal body, glowing magical runes carved into crystal surface, towering humanoid form made of living gemstone, prismatic light refracting through crystal limbs, ancient magical construct, elemental earth magic, imposing stone guardian, fantasy creature"
};

export const FLAME_PHOENIX: Opponent = {
  character_name: "Flame Phoenix",
  description: "A majestic fire bird reborn from eternal flames, wielding devastating fire magic and the power of resurrection.",
  hp: 110,
  energy: 120,
  mana: 95,
  powers: [
    {
      name: "Inferno Wing",
      description: "Flame Phoenix spreads its magnificent wings wide and sweeps them forward, creating towering walls of searing flame that engulf the battlefield in a blazing inferno",
      energy_cost: 25,
      cooldown: 3,
      damage_range: "22-32"
    },
    {
      name: "Phoenix Dive",
      description: "Flame Phoenix soars high into the sky before diving down like a meteor, its entire body wreathed in intense flames as it crashes into enemies with devastating impact",
      energy_cost: 40,
      cooldown: 6,
      damage_range: "30-45"
    },
    {
      name: "Solar Flare",
      description: "Flame Phoenix channels the power of the sun itself, unleashing a blinding burst of solar energy that radiates outward in all directions, scorching everything within reach",
      energy_cost: 35,
      cooldown: 5,
      damage_range: "25-38"
    }
  ],
  image_url: "https://i.ibb.co/Mxnt4xFM/phoenix.jpg",
  image_prompt: "Magnificent phoenix with brilliant orange and red flame feathers, wings spread wide with fire trailing behind, golden beak and talons, eyes like burning embers, surrounded by swirling flames and sparks, majestic fire bird, mythical creature, elemental fire magic, rebirth symbolism"
};

export const ICE_WITCH: Opponent = {
  character_name: "Ice Witch",
  description: "A sorceress of the frozen wastes, master of ice magic and winter storms, with a heart as cold as her spells.",
  hp: 95,
  energy: 110,
  mana: 100,
  powers: [
    {
      name: "Frost Bolt",
      description: "Ice Witch conjures and hurls piercing shards of magical ice that streak through the air like frozen lightning, each bolt crackling with arctic energy",
      energy_cost: 20,
      cooldown: 2,
      damage_range: "16-26"
    },
    {
      name: "Blizzard Storm",
      description: "Ice Witch raises her staff to the sky and summons a devastating ice storm that engulfs the entire battlefield, with howling winds and razor-sharp ice shards tearing through everything",
      energy_cost: 45,
      cooldown: 7,
      damage_range: "35-50"
    },
    {
      name: "Ice Prison",
      description: "Ice Witch gestures toward her enemy and encases them in a prison of solid ice, the frozen tomb continuously draining their warmth and dealing ongoing damage",
      energy_cost: 30,
      cooldown: 4,
      damage_range: "20-30"
    }
  ],
  image_url: "https://i.ibb.co/z347mQy/witch.jpg",
  image_prompt: "Elegant ice witch with pale blue skin and white hair, wearing flowing robes made of ice crystals, staff topped with frozen gem, surrounded by swirling snow and ice magic, piercing blue eyes, frost patterns on clothing, winter sorceress, magical ice powers, frozen beauty"
};

export const STORM_DRAGON: Opponent = {
  character_name: "Storm Dragon",
  description: "An ancient dragon lord of the skies, commanding lightning and thunder with devastating aerial attacks.",
  hp: 140,
  energy: 90,
  mana: 85,
  powers: [
    {
      name: "Lightning Breath",
      description: "Storm Dragon opens its massive jaws and breathes forth crackling bolts of pure electricity that arc and dance through the air, striking with the fury of a thunderstorm",
      energy_cost: 30,
      cooldown: 4,
      damage_range: "25-35"
    },
    {
      name: "Thunder Roar",
      description: "Storm Dragon unleashes a deafening roar that creates powerful shockwaves of sound, the thunderous bellow reverberating across the battlefield and stunning all who hear it",
      energy_cost: 25,
      cooldown: 3,
      damage_range: "20-30"
    },
    {
      name: "Storm Call",
      description: "Storm Dragon spreads its wings and calls upon the heavens, summoning a massive lightning storm that rains down bolts of electricity from the sky in a spectacular display of draconic power",
      energy_cost: 50,
      cooldown: 8,
      damage_range: "40-55"
    }
  ],
  image_url: "https://i.ibb.co/5gPPJZZP/dragon.jpg",
  image_prompt: "Massive storm dragon with blue-silver scales crackling with electricity, wings spread wide with lightning arcing between them, glowing yellow eyes, sharp claws and teeth, surrounded by storm clouds and lightning bolts, ancient dragon, elemental lightning magic, sky lord, tempest creature"
};

export const VOID_ASSASSIN: Opponent = {
  character_name: "Void Assassin",
  description: "A master of stealth and shadow magic, striking from the darkness with lethal precision and otherworldly speed.",
  hp: 85,
  energy: 130,
  mana: 75,
  powers: [
    {
      name: "Shadow Step",
      description: "Void Assassin dissolves into shadows and teleports through the darkness, materializing behind the enemy to strike with twin poisoned blades dripping with void essence",
      energy_cost: 25,
      cooldown: 3,
      damage_range: "20-30"
    },
    {
      name: "Void Slash",
      description: "Void Assassin draws a blade that cuts through the fabric of reality itself, creating dimensional rifts that slice through space and time to reach the enemy",
      energy_cost: 35,
      cooldown: 5,
      damage_range: "28-42"
    },
    {
      name: "Dark Mirage",
      description: "Void Assassin creates multiple shadow clones that emerge from the darkness, each duplicate attacking simultaneously in a coordinated assault that overwhelms the enemy's defenses",
      energy_cost: 40,
      cooldown: 6,
      damage_range: "30-45"
    }
  ],
  image_url: "https://i.ibb.co/FqL2zqVh/assassin.jpg",
  image_prompt: "Sleek assassin in dark leather armor with void-black cloak, twin curved daggers glowing with purple energy, face partially hidden by shadow mask, surrounded by wisps of dark smoke, agile build, stealth warrior, shadow magic, dimensional assassin, dark fantasy rogue"
};

// Array of all available opponents
export const ALL_OPPONENTS = [
  SHADOW_REAPER,
  CRYSTAL_GOLEM,
  FLAME_PHOENIX,
  ICE_WITCH,
  STORM_DRAGON,
  VOID_ASSASSIN
] as const;

// Function to get a random opponent
export function getRandomOpponent(): Opponent {
  const randomIndex = Math.floor(Math.random() * ALL_OPPONENTS.length);
  return ALL_OPPONENTS[randomIndex];
}

// Export the random opponent as the default opponent
export const FIXED_OPPONENT = getRandomOpponent();

// Legacy exports for backward compatibility
export const OPPONENTS = {
  SHADOW_REAPER,
  CRYSTAL_GOLEM,
  FLAME_PHOENIX,
  ICE_WITCH,
  STORM_DRAGON,
  VOID_ASSASSIN,
} as const;