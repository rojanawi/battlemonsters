// Character upgrade suggestion data organized by categories
const WEAPON_UPGRADES = [
  'equipped with a legendary sword', 'wielding a massive hammer', 'carrying twin daggers',
  'armed with a crystal staff', 'holding a flaming axe', 'bearing a frost bow',
  'with a lightning spear', 'carrying a void blade', 'wielding shadow claws',
  'armed with a plasma cannon', 'holding a storm mace', 'bearing ancient runes',
  'equipped with energy gauntlets', 'carrying a mystic orb', 'wielding chain whips',
  'armed with throwing stars', 'holding a battle scythe', 'bearing a war hammer',
  'equipped with dual swords', 'carrying a magic wand', 'wielding a crossbow',
  'armed with a trident', 'holding a crystal blade', 'bearing flame daggers',
  'equipped with ice shards', 'carrying a thunder staff', 'wielding void weapons',
  'armed with light sabers', 'holding dark blades', 'bearing storm weapons',
  'equipped with nature staff', 'carrying tech weapons', 'wielding ancient arms'
];

const ARMOR_UPGRADES = [
  'wearing dragon scale armor', 'clad in crystal plate mail', 'donning shadow robes',
  'armored in lightning mail', 'wearing flame-resistant gear', 'clad in ice armor',
  'donning void protection', 'armored in light mail', 'wearing storm gear',
  'clad in nature armor', 'donning tech suit', 'armored in ancient mail',
  'wearing mystic robes', 'clad in battle armor', 'donning stealth gear',
  'armored in heavy plate', 'wearing magical vestments', 'clad in energy shields',
  'donning protective wards', 'armored in blessed mail', 'wearing cursed armor',
  'clad in elemental gear', 'donning spirit armor', 'armored in cosmic mail',
  'wearing dimensional robes', 'clad in time armor', 'donning space gear',
  'armored in quantum mail', 'wearing bio-suit', 'clad in nano armor',
  'donning power armor', 'armored in mech suit', 'wearing exo-skeleton'
];

const ELEMENTAL_UPGRADES = [
  'surrounded by crackling lightning', 'wreathed in dancing flames', 'encased in swirling ice',
  'enveloped by shadow tendrils', 'glowing with divine light', 'pulsing with void energy',
  'radiating crystal power', 'flowing with water magic', 'charged with storm energy',
  'blooming with nature magic', 'humming with tech power', 'resonating with ancient magic',
  'sparkling with star dust', 'shimmering with time energy', 'warping space around them',
  'crackling with plasma', 'glowing with neon light', 'pulsing with bio-energy',
  'radiating heat waves', 'emanating cold mist', 'generating wind currents',
  'creating earth tremors', 'bending light rays', 'casting dark shadows',
  'projecting force fields', 'emitting sonic waves', 'distorting gravity',
  'manipulating matter', 'controlling elements', 'channeling pure energy',
  'weaving magic spells', 'harnessing cosmic power', 'commanding natural forces'
];

const COMPANION_UPGRADES = [
  'accompanied by a spirit wolf', 'followed by a flame phoenix', 'guarded by ice dragons',
  'aided by shadow familiars', 'blessed by light angels', 'served by void minions',
  'partnered with crystal golems', 'joined by storm eagles', 'helped by nature sprites',
  'assisted by tech drones', 'guided by ancient spirits', 'protected by mystic guardians',
  'accompanied by battle pets', 'followed by loyal servants', 'guarded by summoned beasts',
  'aided by elemental allies', 'blessed by divine beings', 'served by dark creatures',
  'partnered with robot companions', 'joined by magical familiars', 'helped by spirit guides',
  'assisted by cyber pets', 'guided by ghost allies', 'protected by energy beings',
  'accompanied by time echoes', 'followed by space entities', 'guarded by dimension walkers',
  'aided by quantum doubles', 'blessed by cosmic forces', 'served by bio-constructs',
  'partnered with nano-swarms', 'joined by holo-projections', 'helped by AI assistants'
];

const ENHANCEMENT_UPGRADES = [
  'with enhanced speed', 'with increased strength', 'with improved agility',
  'with boosted intelligence', 'with heightened senses', 'with extended reach',
  'with amplified power', 'with enhanced durability', 'with improved reflexes',
  'with increased stamina', 'with boosted magic', 'with enhanced vision',
  'with improved hearing', 'with extended range', 'with amplified damage',
  'with enhanced healing', 'with increased defense', 'with boosted energy',
  'with improved accuracy', 'with extended duration', 'with amplified effects',
  'with enhanced mobility', 'with increased versatility', 'with boosted efficiency',
  'with improved control', 'with extended capabilities', 'with amplified potential',
  'with enhanced mastery', 'with increased expertise', 'with boosted proficiency',
  'with improved technique', 'with extended knowledge', 'with amplified wisdom'
];

const TRANSFORMATION_UPGRADES = [
  'able to transform into energy', 'capable of phase shifting', 'able to become invisible',
  'capable of size changing', 'able to shape-shift', 'capable of time travel',
  'able to teleport instantly', 'capable of flight', 'able to walk through walls',
  'capable of duplication', 'able to merge with elements', 'capable of possession',
  'able to control minds', 'capable of reality bending', 'able to manipulate time',
  'capable of space warping', 'able to dimension hop', 'capable of astral projection',
  'able to soul travel', 'capable of energy conversion', 'able to matter manipulation',
  'capable of molecular control', 'able to atomic restructuring', 'capable of quantum tunneling',
  'able to probability shifting', 'capable of fate manipulation', 'able to destiny control',
  'capable of karma adjustment', 'able to luck modification', 'capable of chance alteration',
  'able to outcome influence', 'capable of result shaping', 'able to future sight'
];

// All upgrade categories combined
const ALL_UPGRADE_CATEGORIES = {
  weapons: WEAPON_UPGRADES,
  armor: ARMOR_UPGRADES,
  elemental: ELEMENTAL_UPGRADES,
  companions: COMPANION_UPGRADES,
  enhancements: ENHANCEMENT_UPGRADES,
  transformations: TRANSFORMATION_UPGRADES
};

// Track recently used suggestions to avoid repetition
let recentUpgradeSuggestions: Set<string> = new Set();
const MAX_RECENT_UPGRADE_SUGGESTIONS = 15;

// Function to get random upgrade suggestions without repetition
function getRandomUpgradeItemsWithoutRepetition(array: string[], count: number): string[] {
  // Filter out recently used items
  const availableItems = array.filter(item => !recentUpgradeSuggestions.has(item));
  
  // If we don't have enough available items, clear some recent suggestions
  if (availableItems.length < count) {
    const recentArray = Array.from(recentUpgradeSuggestions);
    const toRemove = recentArray.slice(0, Math.ceil(recentArray.length / 2));
    toRemove.forEach(item => recentUpgradeSuggestions.delete(item));
  }
  
  // Get final available items
  const finalAvailable = array.filter(item => !recentUpgradeSuggestions.has(item));
  
  // Shuffle and select
  const shuffled = [...finalAvailable].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  
  // Add to recent suggestions
  selected.forEach(item => {
    recentUpgradeSuggestions.add(item);
    if (recentUpgradeSuggestions.size > MAX_RECENT_UPGRADE_SUGGESTIONS) {
      const oldest = recentUpgradeSuggestions.values().next().value;
      recentUpgradeSuggestions.delete(oldest);
    }
  });
  
  return selected;
}

// Function to get mixed upgrade suggestions from different categories
export function getRandomUpgradeSuggestions(count: number = 3): string[] {
  const categories = Object.keys(ALL_UPGRADE_CATEGORIES);
  const suggestions: string[] = [];
  
  // Ensure we get suggestions from different categories for variety
  const usedCategories = new Set<string>();
  
  while (suggestions.length < count && usedCategories.size < categories.length) {
    // Pick a random category we haven't used yet
    const availableCategories = categories.filter(cat => !usedCategories.has(cat));
    if (availableCategories.length === 0) break;
    
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const categoryArray = ALL_UPGRADE_CATEGORIES[randomCategory as keyof typeof ALL_UPGRADE_CATEGORIES];
    
    const categorySuggestions = getRandomUpgradeItemsWithoutRepetition(categoryArray, 1);
    if (categorySuggestions.length > 0) {
      suggestions.push(categorySuggestions[0]);
      usedCategories.add(randomCategory);
    }
  }
  
  // If we still need more suggestions, fill from any category
  while (suggestions.length < count) {
    const allSuggestions = Object.values(ALL_UPGRADE_CATEGORIES).flat();
    const remainingSuggestions = getRandomUpgradeItemsWithoutRepetition(allSuggestions, count - suggestions.length);
    suggestions.push(...remainingSuggestions);
    break; // Prevent infinite loop
  }
  
  return suggestions.slice(0, count);
}

// Function to get suggestions for a specific category
export function getUpgradeSuggestionsByCategory(category: keyof typeof ALL_UPGRADE_CATEGORIES, count: number = 3): string[] {
  const categoryArray = ALL_UPGRADE_CATEGORIES[category];
  return getRandomUpgradeItemsWithoutRepetition(categoryArray, count);
}

// Export categories for reference
export const UPGRADE_CATEGORIES = Object.keys(ALL_UPGRADE_CATEGORIES);