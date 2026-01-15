/**
 * BARANS SPILLVERKSTED - Character Definitions
 * All playable characters and unlockables
 */

const CHARACTERS = {
  // Standard characters (always available)
  standard: [
    {
      id: 'robot',
      emoji: '🤖',
      name: 'Robot',
      description: 'En kul robot!',
      unlocked: true
    },
    {
      id: 'cat',
      emoji: '🐱',
      name: 'Katt',
      description: 'Mjau! En søt katt.',
      unlocked: true
    },
    {
      id: 'unicorn',
      emoji: '🦄',
      name: 'Enhjørning',
      description: 'Magisk og fargerik!',
      unlocked: true
    },
    {
      id: 'dog',
      emoji: '🐶',
      name: 'Hund',
      description: 'Voff! En glad hund.',
      unlocked: true
    },
    {
      id: 'bunny',
      emoji: '🐰',
      name: 'Kanin',
      description: 'Hopp, hopp!',
      unlocked: true
    },
    {
      id: 'bear',
      emoji: '🐻',
      name: 'Bjørn',
      description: 'En koselig bjørn.',
      unlocked: true
    },
    {
      id: 'frog',
      emoji: '🐸',
      name: 'Frosk',
      description: 'Kvekk! Hopper høyt!',
      unlocked: true
    },
    {
      id: 'penguin',
      emoji: '🐧',
      name: 'Pingvin',
      description: 'Fra Antarktis!',
      unlocked: true
    }
  ],

  // Unlockable characters
  unlockable: [
    {
      id: 'dragon',
      emoji: '🐉',
      name: 'Drage',
      description: 'Spruter ild!',
      requirement: '5_games',
      requirementDesc: 'Lag 5 spill'
    },
    {
      id: 'astronaut',
      emoji: '🧑‍🚀',
      name: 'Astronaut',
      description: 'Til månen og tilbake!',
      requirement: 'try_all',
      requirementDesc: 'Prøv alle spilltyper'
    },
    {
      id: 'skier',
      emoji: '⛷️',
      name: 'Skiløper',
      description: 'Suser nedover!',
      requirement: 'first_slalom',
      requirementDesc: 'Fullfør en slalåm'
    },
    {
      id: 'ninja',
      emoji: '🥷',
      name: 'Ninja',
      description: 'Rask og smidig!',
      requirement: '10_games',
      requirementDesc: 'Lag 10 spill'
    },
    {
      id: 'superhero',
      emoji: '🦸',
      name: 'Superhelt',
      description: 'Redder verden!',
      requirement: 'high_scorer',
      requirementDesc: 'Få over 5000 poeng'
    },
    {
      id: 'wizard',
      emoji: '🧙',
      name: 'Trollmann',
      description: 'Magiske krefter!',
      requirement: 'artist',
      requirementDesc: 'Bruk tegneverktøyet'
    },
    {
      id: 'mermaid',
      emoji: '🧜‍♀️',
      name: 'Havfrue',
      description: 'Svømmer elegant!',
      requirement: 'swimmer',
      requirementDesc: 'Svøm 1000 meter'
    },
    {
      id: 'fairy',
      emoji: '🧚',
      name: 'Fe',
      description: 'Sprenger støv!',
      requirement: '1000_coins',
      requirementDesc: 'Samle 1000 mynter'
    },
    {
      id: 'dinosaur',
      emoji: '🦖',
      name: 'Dinosaur',
      description: 'RAAAWR!',
      requirement: 'dino_expert',
      requirementDesc: 'Finn alle fossiler'
    },
    {
      id: 'alien',
      emoji: '👽',
      name: 'Romvesen',
      description: 'Fra en annen planet!',
      requirement: 'dragon_rider',
      requirementDesc: 'Fly 5 minutter på drage'
    },
    {
      id: 'ghost',
      emoji: '👻',
      name: 'Spøkelse',
      description: 'Bøøø! Gjennomsiktig!',
      requirement: 'memory_master',
      requirementDesc: 'Finn alle par uten feil'
    },
    {
      id: 'pirate',
      emoji: '🏴‍☠️',
      name: 'Pirat',
      description: 'Arrr! Jakter på skatter!',
      requirement: 'treasure_hunter',
      requirementDesc: 'Samle 50 skatter'
    }
  ],

  // Special ski characters
  skiCharacters: [
    {
      id: 'skier_blue',
      emoji: '⛷️',
      name: 'Blå skiløper',
      suit: '#3742FA',
      unlocked: true
    },
    {
      id: 'skier_red',
      emoji: '⛷️',
      name: 'Rød skiløper',
      suit: '#FF4757',
      requirement: 'ski_master',
      requirementDesc: 'Spill alle ski-spill'
    },
    {
      id: 'snowboarder',
      emoji: '🏂',
      name: 'Snowboarder',
      requirement: 'freestyle_master',
      requirementDesc: 'Gjør 10 triks'
    }
  ],

  // Vehicle characters (for racing)
  vehicles: [
    { id: 'car', emoji: '🚗', name: 'Bil', unlocked: true },
    { id: 'racecar', emoji: '🏎️', name: 'Racerbil', unlocked: true },
    { id: 'motorcycle', emoji: '🏍️', name: 'Motorsykkel', unlocked: true },
    { id: 'gokart', emoji: '🛺', name: 'Go-kart', unlocked: true },
    { id: 'tractor', emoji: '🚜', name: 'Traktor', description: 'Sakte men stabil', unlocked: true }
  ],

  // Space vehicles
  spaceVehicles: [
    { id: 'rocket', emoji: '🚀', name: 'Romskip', unlocked: true },
    { id: 'satellite', emoji: '🛰️', name: 'Satellitt', requirement: 'space_explorer' }
  ],

  // Sea creatures (for underwater)
  seaCreatures: [
    { id: 'fish_player', emoji: '🐟', name: 'Fisk', unlocked: true },
    { id: 'dolphin_player', emoji: '🐬', name: 'Delfin', unlocked: true },
    { id: 'turtle_player', emoji: '🐢', name: 'Skilpadde', unlocked: true },
    { id: 'shark_player', emoji: '🦈', name: 'Hai', requirement: 'ocean_master' },
    { id: 'whale', emoji: '🐋', name: 'Hval', requirement: 'deep_diver' }
  ],

  // Flying creatures (for dragon flight)
  flyingCreatures: [
    { id: 'dragon_player', emoji: '🐉', name: 'Drage', unlocked: true },
    { id: 'bird_player', emoji: '🦅', name: 'Ørn', unlocked: true },
    { id: 'butterfly', emoji: '🦋', name: 'Sommerfugl', unlocked: true },
    { id: 'phoenix', emoji: '🔥', name: 'Føniks', requirement: 'fire_master' }
  ]
};

// Helper function to get all unlocked characters
function getUnlockedCharacters(userAchievements = []) {
  const unlocked = [...CHARACTERS.standard];

  CHARACTERS.unlockable.forEach(char => {
    if (userAchievements.includes(char.requirement)) {
      unlocked.push({ ...char, unlocked: true });
    } else {
      unlocked.push({ ...char, unlocked: false });
    }
  });

  return unlocked;
}

// Helper function to check if character is unlocked
function isCharacterUnlocked(characterId, userAchievements = []) {
  // Check standard characters
  const standardChar = CHARACTERS.standard.find(c => c.id === characterId);
  if (standardChar) return true;

  // Check unlockable characters
  const unlockableChar = CHARACTERS.unlockable.find(c => c.id === characterId);
  if (unlockableChar) {
    return userAchievements.includes(unlockableChar.requirement);
  }

  return false;
}

// Helper function to get character by id
function getCharacterById(characterId) {
  const allCharacters = [
    ...CHARACTERS.standard,
    ...CHARACTERS.unlockable,
    ...CHARACTERS.skiCharacters,
    ...CHARACTERS.vehicles,
    ...CHARACTERS.spaceVehicles,
    ...CHARACTERS.seaCreatures,
    ...CHARACTERS.flyingCreatures
  ];

  return allCharacters.find(c => c.id === characterId);
}

// Helper function to get characters for a specific game type
function getCharactersForGameType(gameType) {
  switch (gameType) {
    case 'racing':
      return CHARACTERS.vehicles;
    case 'spaceAdventure':
      return CHARACTERS.spaceVehicles;
    case 'underwater':
    case 'swimmingRace':
    case 'fishingGame':
      return CHARACTERS.seaCreatures;
    case 'dragonFlight':
      return CHARACTERS.flyingCreatures;
    case 'skiSlalom':
    case 'skiLangrenn':
    case 'skiHopp':
    case 'skiSkiskyting':
    case 'skiFreestyle':
      return CHARACTERS.skiCharacters;
    default:
      return [...CHARACTERS.standard, ...CHARACTERS.unlockable];
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CHARACTERS,
    getUnlockedCharacters,
    isCharacterUnlocked,
    getCharacterById,
    getCharactersForGameType
  };
}
