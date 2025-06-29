import type { Character, Opponent } from '../types/game';

// Demo Character 1: Phoenix warrior wielding lightning fists
export const DEMO_PHOENIX_WARRIOR: Character = {
  character_name: "Zephyr Stormwing",
  description: "A legendary phoenix warrior whose body crackles with electric energy, combining the rebirth power of flames with devastating lightning strikes that can shatter mountains.",
  hp: 125,
  energy: 110,
  mana: 95,
  powers: [
    {
      name: "Lightning Phoenix Strike",
      description: "Channels phoenix fire and lightning into devastating punches that explode on impact",
      energy_cost: 35,
      cooldown: 4,
      damage_range: "30-45"
    },
    {
      name: "Electric Rebirth",
      description: "Resurrects with full health while unleashing a massive lightning storm",
      energy_cost: 50,
      cooldown: 8,
      damage_range: "25-40"
    },
    {
      name: "Thunder Wing Barrage",
      description: "Spreads wings to release a barrage of lightning-charged feathers",
      energy_cost: 25,
      cooldown: 3,
      damage_range: "20-35"
    }
  ],
  image_prompt: "Majestic phoenix warrior with brilliant orange and red flame feathers crackling with electric blue lightning, muscular humanoid form with phoenix wings spread wide, lightning bolts arcing between feathers, glowing electric-blue eyes, flame-wreathed fists surrounded by crackling electricity, standing in heroic pose with electrical storm swirling around, epic fantasy warrior, fire and lightning elemental magic, mythical creature hybrid, dynamic action pose",
  image_url: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800"
};

// Demo Character 2: Legendary Time manipulator who masters phase shifting
export const DEMO_TIME_MANIPULATOR: Opponent = {
  character_name: "Chronos Voidwalker",
  description: "An ancient time manipulator who exists between dimensions, wielding temporal magic and phase-shifting abilities that allow movement through space and time itself.",
  hp: 100,
  energy: 130,
  mana: 120,
  powers: [
    {
      name: "Temporal Fracture",
      description: "Splits timeline to attack from multiple temporal positions simultaneously",
      energy_cost: 40,
      cooldown: 6,
      damage_range: "35-50"
    },
    {
      name: "Phase Shift Strike",
      description: "Phases through dimensions to deliver an untouchable attack",
      energy_cost: 30,
      cooldown: 4,
      damage_range: "25-40"
    },
    {
      name: "Time Dilation Burst",
      description: "Slows enemy time while accelerating own attack speed",
      energy_cost: 35,
      cooldown: 5,
      damage_range: "20-35"
    }
  ],
  image_url: "https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=800",
  image_prompt: "Mysterious time manipulator in flowing ethereal robes that shimmer between dimensions, partially translucent form phasing in and out of reality, clock gears and temporal energy swirling around body, glowing time-distortion eyes, hands crackling with chronological magic, standing in cosmic void with stars and galaxies bending around them, ancient time magic symbols floating in air, dimensional rifts opening behind figure, epic fantasy time mage"
};