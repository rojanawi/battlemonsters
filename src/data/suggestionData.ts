// Character suggestion data organized by categories with focus on physical characteristics, weapons, and accessories
export const CHARACTER_TYPES = [
  // Fantasy Warriors
  'Phoenix warrior', 'Crystal mage', 'Shadow hunter', 'Storm knight', 'Void assassin',
  'Ice queen', 'Fire demon', 'Lightning monk', 'Earth titan', 'Wind dancer',
  'Blood vampire', 'Holy paladin', 'Dark necromancer', 'Celestial guardian', 'Chaos sorcerer',
  'Time manipulator', 'Space pirate', 'Quantum hacker', 'Bio-engineer', 'Psionic warrior',
  'Ethereal ghost', 'Primal beast', 'Cyber samurai', 'Ancient dragon', 'Mystic shaman',
  'Frost giant', 'Lava golem', 'Thunder god', 'Star weaver', 'Dream walker',
  
  // Elemental Beings
  'Flame elemental', 'Water spirit', 'Air djinn', 'Stone guardian', 'Metal construct',
  'Plasma entity', 'Void wraith', 'Light bearer', 'Shadow fiend', 'Crystal being',
  'Energy phantom', 'Astral wanderer', 'Cosmic drifter', 'Dimensional shifter', 'Reality bender',
  
  // Mythical Creatures
  'Dragon lord', 'Griffin rider', 'Unicorn knight', 'Sphinx oracle', 'Kraken master',
  'Phoenix sage', 'Basilisk hunter', 'Chimera tamer', 'Hydra slayer', 'Leviathan caller',
  'Pegasus rider', 'Manticore warrior', 'Cerberus guardian', 'Banshee singer', 'Valkyrie champion',
  
  // Sci-Fi Classes
  'Nano-warrior', 'Cyber-witch', 'Plasma knight', 'Quantum mage', 'Digital ghost',
  'Bio-hacker', 'Gene-splicer', 'Mech-pilot', 'AI-symbiont', 'Void-jumper',
  'Star-forger', 'Planet-shaper', 'Time-weaver', 'Reality-coder', 'Dimension-walker',
  
  // Dark Fantasy
  'Lich king', 'Death knight', 'Soul reaper', 'Bone mage', 'Plague doctor',
  'Demon hunter', 'Angel slayer', 'Fallen seraph', 'Cursed prophet', 'Doom herald',
  'Night terror', 'Nightmare weaver', 'Fear incarnate', 'Madness bringer', 'Chaos spawn',
  
  // Nature Classes
  'Forest guardian', 'Ocean caller', 'Mountain lord', 'Desert wanderer', 'Jungle stalker',
  'Flower maiden', 'Tree shepherd', 'Beast master', 'Swarm queen', 'Hive mind',
  'Coral sage', 'Mushroom druid', 'Vine whisperer', 'Thorn knight', 'Petal dancer',
  
  // Cosmic Entities
  'Star destroyer', 'Galaxy shaper', 'Nebula walker', 'Comet rider', 'Solar flare',
  'Black hole master', 'Supernova herald', 'Cosmic storm', 'Asteroid miner', 'Meteor caller',
  'Pulsar guardian', 'Quasar sage', 'Dark matter wraith', 'Antimatter being', 'Gravity well'
];

export const PHYSICAL_FEATURES = {
  // Fire/Heat themed - Physical characteristics and weapons
  fire: [
    'with flame wings', 'with burning eyes', 'with molten armor', 'with fire-wreathed hands',
    'with phoenix feathers', 'with ember-glowing skin', 'with solar crown', 'with blazing sword',
    'with lava veins', 'with scorching breath', 'with inferno cloak', 'with magma gauntlets',
    'with volcanic scars', 'with plasma hair', 'with furnace helmet', 'with cinder boots',
    'with solar flare wings', 'with meteor hammer', 'with comet spear', 'with star-fire tattoos',
    'with thermal goggles', 'with heat-resistant scales', 'with flame tattoos', 'with burning runes',
    'with molten jewelry', 'with fire-forged bones', 'with ash-gray skin', 'with ember breath',
    'with solar panels', 'with fusion core', 'with plasma rifle', 'with flame whips'
  ],
  
  // Ice/Cold themed - Physical characteristics and weapons
  ice: [
    'with frost armor', 'with crystalline skin', 'with icy breath', 'with frozen crown',
    'with glacial eyes', 'with snow-white hair', 'with diamond scales', 'with arctic fur',
    'with ice shards', 'with frozen tears', 'with crystal bones', 'with permafrost claws',
    'with blizzard cloak', 'with icicle spears', 'with frozen heart pendant', 'with glacier shield',
    'with snowflake jewelry', 'with frost bite marks', 'with winter coat', 'with ice crystals',
    'with polar bear fur', 'with frozen blood vessels', 'with ice-blue veins', 'with crystal horns',
    'with frozen wings', 'with ice daggers', 'with snow boots', 'with frost gauntlets',
    'with arctic goggles', 'with ice prison shackles', 'with frozen timepiece', 'with crystal staff'
  ],
  
  // Lightning/Storm themed - Physical characteristics and weapons
  storm: [
    'with electric veins', 'with storm clouds hair', 'with lightning scars', 'with thunder gauntlets',
    'with crackling energy tattoos', 'with tempest eyes', 'with wind-swept cloak', 'with static hair',
    'with plasma bolts', 'with electric collar', 'with storm-charged armor', 'with lightning rod staff',
    'with thunder fists', 'with electric wings', 'with storm-born jewelry', 'with wind blades',
    'with hurricane goggles', 'with tornado boots', 'with electric pulse generator', 'with storm heart amulet',
    'with lightning reflexes enhancer', 'with thunder roar amplifier', 'with electric touch gloves', 'with storm surge cape',
    'with wind armor plating', 'with electric field generator', 'with storm-forged weapons', 'with lightning speed boots',
    'with tempest fury mask', 'with electric discharge nodes', 'with storm-caller staff', 'with wind walker sandals'
  ],
  
  // Shadow/Dark themed - Physical characteristics and weapons
  shadow: [
    'with shadow cloak', 'with void eyes', 'with dark tendrils', 'with obsidian armor',
    'with smoky form', 'with midnight wings', 'with eclipse crown', 'with phantom limbs',
    'with shadow daggers', 'with void touch gloves', 'with dark matter sword', 'with nightmare mask',
    'with shadow merge ability', 'with darkness cloak', 'with void portal ring', 'with shadow clone jutsu',
    'with dark energy orb', 'with shadow bind chains', 'with void blade', 'with darkness veil',
    'with shadow dance shoes', 'with void heart crystal', 'with dark whisper earrings', 'with shadow realm key',
    'with void magic staff', 'with dark ritual dagger', 'with shadow puppet strings', 'with void walker boots',
    'with darkness eternal robe', 'with shadow master hood', 'with void lord scepter', 'with dark sovereign crown'
  ],
  
  // Light/Holy themed - Physical characteristics and weapons
  light: [
    'with golden armor', 'with radiant wings', 'with divine halo', 'with glowing tattoos',
    'with celestial marks', 'with prismatic shield', 'with starlight eyes', 'with holy symbols',
    'with angelic wings', 'with divine light sword', 'with sacred geometry armor', 'with holy fire staff',
    'with celestial crown', 'with divine grace amulet', 'with holy water vials', 'with sacred flame torch',
    'with light beam projector', 'with divine shield', 'with holy sword', 'with celestial armor',
    'with divine blessing ring', 'with holy spirit pendant', 'with sacred power gauntlets', 'with divine wrath hammer',
    'with celestial choir bell', 'with holy ground boots', 'with divine intervention scroll', 'with sacred ritual knife',
    'with light magic wand', 'with divine purpose compass', 'with holy mission badge', 'with celestial destiny map'
  ],
  
  // Crystal/Earth themed - Physical characteristics and weapons
  crystal: [
    'with crystal armor', 'with gemstone eyes', 'with rocky skin', 'with mineral veins',
    'with diamond claws', 'with quartz crown', 'with stone limbs', 'with metallic sheen',
    'with granite gauntlets', 'with marble skin', 'with crystal growth spikes', 'with gem-studded belt',
    'with earth power bracelet', 'with stone heart pendant', 'with crystal formation shield', 'with mineral core staff',
    'with rock solid boots', 'with crystal clear goggles', 'with stone cold mask', 'with diamond hard knuckles',
    'with crystal resonance tuning fork', 'with earth tremor hammer', 'with stone throw sling', 'with crystal shard daggers',
    'with mineral wealth pouch', 'with gem collection necklace', 'with crystal ball', 'with stone tablet',
    'with earth elemental summoning circle', 'with crystal magic wand', 'with stone guardian statue', 'with mineral spirit totem'
  ],
  
  // Nature/Organic themed - Physical characteristics and weapons
  nature: [
    'with bark skin', 'with leaf hair', 'with vine armor', 'with flower crown',
    'with root limbs', 'with moss cloak', 'with thorn spikes', 'with petal wings',
    'with tree branch staff', 'with flower petal dress', 'with grass blade sword', 'with mushroom cap helmet',
    'with coral growth armor', 'with seaweed hair ornaments', 'with shell armor', 'with pearl eyes',
    'with butterfly wing cloak', 'with bee swarm gauntlets', 'with spider silk rope', 'with ant colony boots',
    'with bird feather accessories', 'with wolf fur coat', 'with bear claw necklace', 'with eagle feather headdress',
    'with snake scale armor', 'with fish gill slits', 'with frog webbed feet', 'with turtle shell shield',
    'with plant growth seeds', 'with animal spirit totem', 'with nature bond bracelet', 'with wild heart pendant'
  ],
  
  // Tech/Cyber themed - Physical characteristics and weapons
  tech: [
    'with cyber implants', 'with holographic display visor', 'with mechanical limbs', 'with neon circuit tattoos',
    'with digital eyes', 'with plasma weapons', 'with nano-armor suit', 'with energy core chest piece',
    'with AI interface headset', 'with quantum processor brain', 'with neural link cables', 'with data stream goggles',
    'with hologram projector gauntlets', 'with laser sight rifle', 'with energy shield generator', 'with power core backpack',
    'with cybernetic enhancement ports', 'with digital consciousness uplink', 'with virtual reality headset', 'with augmented reality glasses',
    'with quantum entanglement communicator', 'with time dilation device', 'with space warp drive', 'with dimension hop boots',
    'with teleportation pad', 'with force field belt', 'with energy beam cannon', 'with particle accelerator gloves',
    'with fusion power reactor', 'with antimatter engine', 'with warp drive core', 'with hyperspace jump module'
  ],
  
  // Generic/Mystical - Physical characteristics and weapons
  generic: [
    'with ancient armor', 'with glowing eyes', 'with mystical tattoos', 'with ethereal robes',
    'with magical aura', 'with runic symbols', 'with spectral wings', 'with enchanted weapons',
    'with arcane staff', 'with mystic jewelry', 'with ancient helmet', 'with forbidden tome',
    'with legendary sword', 'with mythical shield', 'with divine artifacts', 'with cursed accessories',
    'with prophetic crystal ball', 'with destiny compass', 'with fate dice', 'with karma scales',
    'with soul bonded weapon', 'with spirit guide familiar', 'with guardian angel wings', 'with demon pact scroll',
    'with time loop watch', 'with parallel dimension mirror', 'with alternate reality goggles', 'with quantum state detector',
    'with probability field generator', 'with chaos theory calculator', 'with butterfly effect tracker', 'with ripple effect sensor'
  ]
};

export const DISTINCTIVE_ATTRIBUTES = {
  // Weapons and Accessories focus - Expanded
  fire: [
    'and flaming sword', 'and molten shield', 'and fire bow', 'and lava axe',
    'and phoenix feather arrows', 'and ember throwing stars', 'and solar spear', 'and inferno whip',
    'and magma hammer', 'and volcanic crossbow', 'and flame dagger', 'and fire staff',
    'and burning chain mail', 'and heat-resistant gloves', 'and flame-proof boots', 'and fire-retardant cloak',
    'and thermal vision goggles', 'and heat sensor device', 'and flame thrower', 'and fire extinguisher',
    'and molten metal jewelry', 'and fire opal gems', 'and ruby accessories', 'and amber ornaments',
    'and salamander leather armor', 'and dragon scale mail', 'and phoenix down padding', 'and fire elemental core',
    'and solar panel backpack', 'and heat battery pack', 'and flame generator', 'and fire starter kit'
  ],
  
  ice: [
    'and ice sword', 'and frost shield', 'and snow bow', 'and glacier axe',
    'and icicle arrows', 'and frozen throwing stars', 'and arctic spear', 'and blizzard whip',
    'and ice hammer', 'and frost crossbow', 'and crystal dagger', 'and ice staff',
    'and frozen chain mail', 'and insulated gloves', 'and snow boots', 'and winter cloak',
    'and thermal goggles', 'and cold sensor device', 'and ice maker', 'and snow blower',
    'and crystal jewelry', 'and ice gems', 'and sapphire accessories', 'and diamond ornaments',
    'and polar bear fur armor', 'and penguin feather padding', 'and seal skin boots', 'and ice elemental core',
    'and cooling system', 'and freeze ray', 'and ice generator', 'and snow maker'
  ],
  
  storm: [
    'and lightning sword', 'and thunder shield', 'and wind bow', 'and storm axe',
    'and electric arrows', 'and plasma throwing stars', 'and tempest spear', 'and lightning whip',
    'and thunder hammer', 'and storm crossbow', 'and electric dagger', 'and weather staff',
    'and conductive chain mail', 'and rubber gloves', 'and insulated boots', 'and storm cloak',
    'and night vision goggles', 'and weather sensor', 'and lightning rod', 'and wind turbine',
    'and copper jewelry', 'and electric gems', 'and topaz accessories', 'and storm glass ornaments',
    'and storm petrel feather armor', 'and cloud padding', 'and rain boots', 'and storm elemental core',
    'and generator backpack', 'and battery pack', 'and electric fence', 'and weather station'
  ],
  
  shadow: [
    'and shadow blade', 'and void shield', 'and darkness bow', 'and nightmare axe',
    'and phantom arrows', 'and shadow throwing stars', 'and void spear', 'and darkness whip',
    'and shadow hammer', 'and void crossbow', 'and obsidian dagger', 'and darkness staff',
    'and shadow chain mail', 'and stealth gloves', 'and silent boots', 'and invisibility cloak',
    'and night vision goggles', 'and shadow detector', 'and darkness generator', 'and void portal',
    'and black jewelry', 'and void gems', 'and onyx accessories', 'and shadow crystal ornaments',
    'and raven feather armor', 'and bat wing padding', 'and spider silk boots', 'and shadow elemental core',
    'and stealth device', 'and cloaking field', 'and shadow projector', 'and darkness amplifier'
  ],
  
  light: [
    'and holy sword', 'and divine shield', 'and light bow', 'and celestial axe',
    'and blessed arrows', 'and radiant throwing stars', 'and divine spear', 'and light whip',
    'and holy hammer', 'and celestial crossbow', 'and blessed dagger', 'and divine staff',
    'and holy chain mail', 'and blessed gloves', 'and sacred boots', 'and divine cloak',
    'and holy vision goggles', 'and light detector', 'and divine generator', 'and holy portal',
    'and golden jewelry', 'and light gems', 'and pearl accessories', 'and crystal ornaments',
    'and angel feather armor', 'and dove wing padding', 'and silk boots', 'and light elemental core',
    'and blessing device', 'and holy field', 'and light projector', 'and divine amplifier'
  ],
  
  crystal: [
    'and crystal sword', 'and gem shield', 'and mineral bow', 'and stone axe',
    'and crystal arrows', 'and gem throwing stars', 'and mineral spear', 'and crystal whip',
    'and stone hammer', 'and crystal crossbow', 'and gem dagger', 'and mineral staff',
    'and crystal chain mail', 'and gem gloves', 'and stone boots', 'and mineral cloak',
    'and crystal vision goggles', 'and gem detector', 'and mineral generator', 'and crystal portal',
    'and precious jewelry', 'and rare gems', 'and crystal accessories', 'and mineral ornaments',
    'and crystal armor', 'and gem padding', 'and stone boots', 'and crystal elemental core',
    'and resonance device', 'and crystal field', 'and gem projector', 'and mineral amplifier'
  ],
  
  nature: [
    'and wooden sword', 'and bark shield', 'and thorn bow', 'and branch axe',
    'and thorn arrows', 'and seed throwing stars', 'and vine spear', 'and root whip',
    'and stone hammer', 'and wooden crossbow', 'and thorn dagger', 'and branch staff',
    'and bark chain mail', 'and leaf gloves', 'and root boots', 'and vine cloak',
    'and animal vision goggles', 'and plant detector', 'and growth generator', 'and nature portal',
    'and wooden jewelry', 'and seed gems', 'and flower accessories', 'and leaf ornaments',
    'and bark armor', 'and moss padding', 'and root boots', 'and nature elemental core',
    'and growth device', 'and nature field', 'and plant projector', 'and growth amplifier'
  ],
  
  tech: [
    'and plasma sword', 'and energy shield', 'and laser bow', 'and cyber axe',
    'and energy arrows', 'and nano throwing stars', 'and plasma spear', 'and energy whip',
    'and power hammer', 'and laser crossbow', 'and plasma dagger', 'and tech staff',
    'and nano chain mail', 'and cyber gloves', 'and power boots', 'and energy cloak',
    'and cyber vision goggles', 'and tech detector', 'and energy generator', 'and tech portal',
    'and cyber jewelry', 'and energy gems', 'and tech accessories', 'and nano ornaments',
    'and cyber armor', 'and nano padding', 'and power boots', 'and tech elemental core',
    'and enhancement device', 'and cyber field', 'and tech projector', 'and power amplifier'
  ],
  
  generic: [
    'and enchanted sword', 'and magical shield', 'and mystic bow', 'and ancient axe',
    'and blessed arrows', 'and runic throwing stars', 'and legendary spear', 'and mystic whip',
    'and ancient hammer', 'and magical crossbow', 'and enchanted dagger', 'and wizard staff',
    'and magical chain mail', 'and enchanted gloves', 'and mystic boots', 'and ancient cloak',
    'and magical vision goggles', 'and mystic detector', 'and ancient generator', 'and magical portal',
    'and enchanted jewelry', 'and magical gems', 'and mystic accessories', 'and ancient ornaments',
    'and legendary armor', 'and magical padding', 'and enchanted boots', 'and mystic elemental core',
    'and enhancement device', 'and magical field', 'and mystic projector', 'and ancient amplifier'
  ]
};

// Track recently used suggestions to avoid repetition
let recentSuggestions: Set<string> = new Set();
const MAX_RECENT_SUGGESTIONS = 20;

// Function to get truly random items without recent repetition
function getRandomItemsWithoutRepetition<T>(array: T[], count: number): T[] {
  // Filter out recently used items
  const availableItems = array.filter(item => !recentSuggestions.has(String(item)));
  
  // If we don't have enough available items, clear some recent suggestions
  if (availableItems.length < count) {
    const recentArray = Array.from(recentSuggestions);
    const toRemove = recentArray.slice(0, Math.ceil(recentArray.length / 2));
    toRemove.forEach(item => recentSuggestions.delete(item));
  }
  
  // Get final available items
  const finalAvailable = array.filter(item => !recentSuggestions.has(String(item)));
  
  // Shuffle and select
  const shuffled = [...finalAvailable].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  
  // Add to recent suggestions
  selected.forEach(item => {
    recentSuggestions.add(String(item));
    if (recentSuggestions.size > MAX_RECENT_SUGGESTIONS) {
      const oldest = recentSuggestions.values().next().value;
      recentSuggestions.delete(oldest);
    }
  });
  
  return selected;
}

// Function to determine theme from character type
export function getThemeFromCharacterType(characterType: string): string {
  const lowerType = characterType.toLowerCase();
  
  if (lowerType.includes('fire') || lowerType.includes('flame') || lowerType.includes('phoenix') || 
      lowerType.includes('lava') || lowerType.includes('solar') || lowerType.includes('demon') ||
      lowerType.includes('plasma') || lowerType.includes('inferno') || lowerType.includes('ember')) {
    return 'fire';
  }
  if (lowerType.includes('ice') || lowerType.includes('frost') || lowerType.includes('crystal') || 
      lowerType.includes('frozen') || lowerType.includes('glacial') || lowerType.includes('queen') ||
      lowerType.includes('arctic') || lowerType.includes('winter') || lowerType.includes('snow')) {
    return 'ice';
  }
  if (lowerType.includes('storm') || lowerType.includes('lightning') || lowerType.includes('thunder') || 
      lowerType.includes('electric') || lowerType.includes('wind') || lowerType.includes('tempest') ||
      lowerType.includes('hurricane') || lowerType.includes('tornado') || lowerType.includes('cyclone')) {
    return 'storm';
  }
  if (lowerType.includes('shadow') || lowerType.includes('void') || lowerType.includes('dark') || 
      lowerType.includes('night') || lowerType.includes('assassin') || lowerType.includes('necromancer') ||
      lowerType.includes('phantom') || lowerType.includes('wraith') || lowerType.includes('nightmare')) {
    return 'shadow';
  }
  if (lowerType.includes('holy') || lowerType.includes('celestial') || lowerType.includes('divine') || 
      lowerType.includes('light') || lowerType.includes('paladin') || lowerType.includes('guardian') ||
      lowerType.includes('angel') || lowerType.includes('seraph') || lowerType.includes('radiant')) {
    return 'light';
  }
  if (lowerType.includes('crystal') || lowerType.includes('earth') || lowerType.includes('stone') || 
      lowerType.includes('rock') || lowerType.includes('titan') || lowerType.includes('golem') ||
      lowerType.includes('granite') || lowerType.includes('mineral') || lowerType.includes('gem')) {
    return 'crystal';
  }
  if (lowerType.includes('nature') || lowerType.includes('forest') || lowerType.includes('plant') || 
      lowerType.includes('tree') || lowerType.includes('leaf') || lowerType.includes('shaman') ||
      lowerType.includes('druid') || lowerType.includes('beast') || lowerType.includes('wild')) {
    return 'nature';
  }
  if (lowerType.includes('cyber') || lowerType.includes('tech') || lowerType.includes('quantum') || 
      lowerType.includes('digital') || lowerType.includes('hacker') || lowerType.includes('engineer') ||
      lowerType.includes('nano') || lowerType.includes('mech') || lowerType.includes('ai')) {
    return 'tech';
  }
  
  return 'generic';
}

// Function to get random suggestions for each category
export function getRandomCharacterTypes(count: number = 3): string[] {
  return getRandomItemsWithoutRepetition(CHARACTER_TYPES, count);
}

export function getRandomPhysicalFeatures(theme: string, count: number = 3): string[] {
  const features = PHYSICAL_FEATURES[theme as keyof typeof PHYSICAL_FEATURES] || PHYSICAL_FEATURES.generic;
  return getRandomItemsWithoutRepetition(features, count);
}

export function getRandomDistinctiveAttributes(theme: string, count: number = 3): string[] {
  const attributes = DISTINCTIVE_ATTRIBUTES[theme as keyof typeof DISTINCTIVE_ATTRIBUTES] || DISTINCTIVE_ATTRIBUTES.generic;
  return getRandomItemsWithoutRepetition(attributes, count);
}