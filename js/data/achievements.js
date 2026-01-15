/**
 * BARANS SPILLVERKSTED - Achievement Definitions
 * All achievements and unlockables
 */

const ACHIEVEMENTS = {
  // ============================================
  // FIRST STEPS
  // ============================================
  firstSteps: [
    {
      id: 'first_game',
      name: 'Spillskaper!',
      description: 'Lag ditt første spill',
      icon: '🎮',
      category: 'milestone'
    },
    {
      id: 'first_win',
      name: 'Vinner!',
      description: 'Fullfør et spill du lagde',
      icon: '🏆',
      category: 'milestone'
    },
    {
      id: 'first_character',
      name: 'Min helt!',
      description: 'Velg din første karakter',
      icon: '🦸',
      category: 'milestone'
    },
    {
      id: 'first_drawing',
      name: 'Kunstner i farten!',
      description: 'Tegn noe i byggeren',
      icon: '🎨',
      category: 'milestone'
    }
  ],

  // ============================================
  // QUANTITY ACHIEVEMENTS
  // ============================================
  quantity: [
    {
      id: '5_games',
      name: 'Kreativ!',
      description: 'Lag 5 spill',
      icon: '🎨',
      category: 'quantity',
      target: 5
    },
    {
      id: '10_games',
      name: 'Spillmester!',
      description: 'Lag 10 spill',
      icon: '👑',
      category: 'quantity',
      target: 10
    },
    {
      id: '25_games',
      name: 'Spilldesigner!',
      description: 'Lag 25 spill',
      icon: '🎯',
      category: 'quantity',
      target: 25
    },
    {
      id: '50_games',
      name: 'Superskaper!',
      description: 'Lag 50 spill',
      icon: '🏆',
      category: 'quantity',
      target: 50
    }
  ],

  // ============================================
  // EXPLORATION
  // ============================================
  exploration: [
    {
      id: 'try_5',
      name: 'Nysgjerrig!',
      description: 'Prøv 5 forskjellige spilltyper',
      icon: '🔍',
      category: 'exploration',
      target: 5
    },
    {
      id: 'try_15',
      name: 'Halvveis!',
      description: 'Prøv 15 forskjellige spilltyper',
      icon: '🌟',
      category: 'exploration',
      target: 15
    },
    {
      id: 'try_all',
      name: 'Utforsker!',
      description: 'Prøv alle 30 spilltyper',
      icon: '🌍',
      category: 'exploration',
      target: 30
    }
  ],

  // ============================================
  // SKI ACHIEVEMENTS
  // ============================================
  ski: [
    {
      id: 'first_slalom',
      name: 'Slalåmkjører!',
      description: 'Fullfør en slalåmbane',
      icon: '⛷️',
      category: 'ski'
    },
    {
      id: 'perfect_run',
      name: 'Perfekt kjøring!',
      description: 'Slalåm uten å misse noen porter',
      icon: '💯',
      category: 'ski'
    },
    {
      id: 'langrenn_finish',
      name: 'Langrennsløper!',
      description: 'Fullfør en langrennsløype',
      icon: '🎿',
      category: 'ski'
    },
    {
      id: 'big_jump',
      name: 'Flyger!',
      description: 'Hopp over 50 meter i skihopp',
      icon: '🦅',
      category: 'ski'
    },
    {
      id: 'perfect_shot',
      name: 'Skarpskytter!',
      description: 'Treff alle 5 blinker i skiskyting',
      icon: '🎯',
      category: 'ski'
    },
    {
      id: 'first_trick',
      name: 'Triksmester!',
      description: 'Gjør ditt første triks i freestyle',
      icon: '🤸',
      category: 'ski'
    },
    {
      id: 'ski_master',
      name: 'Skimester!',
      description: 'Spill alle 5 ski-spillene',
      icon: '🏔️',
      category: 'ski'
    },
    {
      id: 'freestyle_master',
      name: 'Freestyle-mester!',
      description: 'Gjør 10 forskjellige triks',
      icon: '🌟',
      category: 'ski'
    }
  ],

  // ============================================
  // POINTS & COLLECTING
  // ============================================
  collecting: [
    {
      id: '100_coins',
      name: 'Myntesamler!',
      description: 'Samle 100 mynter totalt',
      icon: '🪙',
      category: 'collecting',
      target: 100
    },
    {
      id: '1000_coins',
      name: 'Skattejeger!',
      description: 'Samle 1000 mynter totalt',
      icon: '💰',
      category: 'collecting',
      target: 1000
    },
    {
      id: '5000_coins',
      name: 'Gullgraver!',
      description: 'Samle 5000 mynter totalt',
      icon: '👑',
      category: 'collecting',
      target: 5000
    },
    {
      id: 'high_scorer',
      name: 'Poengkonge!',
      description: 'Få over 5000 poeng i ett spill',
      icon: '⭐',
      category: 'collecting',
      target: 5000
    },
    {
      id: 'treasure_hunter',
      name: 'Skattejeger!',
      description: 'Samle 50 skatter',
      icon: '💎',
      category: 'collecting',
      target: 50
    }
  ],

  // ============================================
  // CREATIVITY
  // ============================================
  creativity: [
    {
      id: 'artist',
      name: 'Kunstner!',
      description: 'Bruk tegneverktøyet',
      icon: '🖌️',
      category: 'creativity'
    },
    {
      id: 'photographer',
      name: 'Fotograf!',
      description: 'Last opp eget bilde som karakter',
      icon: '📸',
      category: 'creativity'
    },
    {
      id: 'musician',
      name: 'Musiker!',
      description: 'Lag en melodi i Musikk-lageren',
      icon: '🎵',
      category: 'creativity'
    },
    {
      id: 'puzzle_maker',
      name: 'Puslespillmaker!',
      description: 'Lag et puslespill med eget bilde',
      icon: '🧩',
      category: 'creativity'
    },
    {
      id: 'city_planner',
      name: 'Byplanlegger!',
      description: 'Bygg en by med 20 bygninger',
      icon: '🏙️',
      category: 'creativity'
    },
    {
      id: 'robot_programmer',
      name: 'Robotprogrammerer!',
      description: 'Fullfør 10 robotutfordringer',
      icon: '🤖',
      category: 'creativity'
    }
  ],

  // ============================================
  // LEARNING
  // ============================================
  learning: [
    {
      id: 'memory_master',
      name: 'Hukommelsesmester!',
      description: 'Finn alle par uten feil',
      icon: '🧠',
      category: 'learning'
    },
    {
      id: 'fish_king',
      name: 'Fiskekonge!',
      description: 'Fang 100 fisk totalt',
      icon: '🎣',
      category: 'learning',
      target: 100
    },
    {
      id: 'sorting_pro',
      name: 'Sorteringsekspert!',
      description: 'Sorter 50 ting riktig',
      icon: '🗂️',
      category: 'learning',
      target: 50
    },
    {
      id: 'math_wizard',
      name: 'Mattemagi!',
      description: '10 riktige tall-oppgaver på rad',
      icon: '🔢',
      category: 'learning'
    },
    {
      id: 'letter_hero',
      name: 'Bokstavhelt!',
      description: 'Finn alle bokstavene A-Å',
      icon: '🔤',
      category: 'learning'
    }
  ],

  // ============================================
  // SPORTS
  // ============================================
  sports: [
    {
      id: 'bike_pro',
      name: 'Sykkelproff!',
      description: 'Fullfør en sykkelløype uten å krasje',
      icon: '🚴',
      category: 'sports'
    },
    {
      id: 'swimmer',
      name: 'Svømmestjerne!',
      description: 'Svøm 1000 meter totalt',
      icon: '🏊',
      category: 'sports',
      target: 1000
    },
    {
      id: 'goal_scorer',
      name: 'Målscorer!',
      description: 'Skyt 50 mål',
      icon: '⚽',
      category: 'sports',
      target: 50
    },
    {
      id: 'high_jumper',
      name: 'Høytflyger!',
      description: 'Nå 50 meter høyde på trampolinen',
      icon: '🤸',
      category: 'sports'
    }
  ],

  // ============================================
  // FANTASY & ADVENTURE
  // ============================================
  fantasy: [
    {
      id: 'dragon_rider',
      name: 'Dragerytter!',
      description: 'Fly 5 minutter uten å krasje',
      icon: '🐉',
      category: 'fantasy'
    },
    {
      id: 'deep_diver',
      name: 'Dyphavsutforsker!',
      description: 'Utforsk hele undervannsriket',
      icon: '🐬',
      category: 'fantasy'
    },
    {
      id: 'fairy_tale_hero',
      name: 'Eventyrhelt!',
      description: 'Redd prinsessen/prinsen',
      icon: '👸',
      category: 'fantasy'
    },
    {
      id: 'dino_expert',
      name: 'Dinosaurekspert!',
      description: 'Finn alle fossiler',
      icon: '🦕',
      category: 'fantasy'
    },
    {
      id: 'space_explorer',
      name: 'Romutforsker!',
      description: 'Besøk 10 romstasjoner',
      icon: '🚀',
      category: 'fantasy',
      target: 10
    }
  ],

  // ============================================
  // SPECIAL
  // ============================================
  special: [
    {
      id: 'play_daily',
      name: 'Trofast spiller!',
      description: 'Spill 7 dager på rad',
      icon: '📅',
      category: 'special'
    },
    {
      id: 'share_game',
      name: 'Generøs!',
      description: 'Del et spill med en venn',
      icon: '🤝',
      category: 'special'
    },
    {
      id: 'night_owl',
      name: 'Nattugle!',
      description: 'Spill etter kl. 20:00',
      icon: '🦉',
      category: 'special'
    },
    {
      id: 'early_bird',
      name: 'Morgenfugl!',
      description: 'Spill før kl. 08:00',
      icon: '🐦',
      category: 'special'
    }
  ]
};

// Encouragement messages (Norwegian)
const ENCOURAGEMENTS = {
  building: [
    'Wow, dette blir kult! 🌟',
    'Du er en ekte spilldesigner! 🎮',
    'Fantastisk ide! 💡',
    'Fortsett sånn! 👏',
    'Dette blir et morsomt spill! 🎉',
    'Du er så kreativ! 🎨',
    'Kjempebra jobbet! ⭐',
    'Jeg gleder meg til å spille dette! 🚀'
  ],
  playing: [
    'Kjempebra! ⭐',
    'Du klarte det! 🎉',
    'Imponerende! 🏆',
    'Wow, så flink! 💪',
    'Fantastisk! 🌟',
    'Du er en mester! 👑',
    'Utrolig bra! 🔥'
  ],
  encouragement: [
    'Nesten! Prøv igjen! 💪',
    'Du klarer det! 🌟',
    'Ikke gi opp! 💪',
    'Øvelse gjør mester! ⭐',
    'Du blir bedre og bedre! 📈',
    'Bare fortsett! 🚀'
  ],
  skiing: [
    'Flott sving! ⛷️',
    'Bøy knærne! 🎿',
    'Du er en ekte skiløper! 🏔️',
    'Perfekt landing! 🎯',
    'Hold balansen! ⚖️',
    'Fantastisk teknikk! 💫',
    'Du suser nedover! 💨'
  ],
  learning: [
    'Riktig! Du er så smart! 🧠',
    'Perfekt! 💯',
    'Du lærer fort! 📚',
    'Kjempebra tenkt! 💡',
    'Du er en mester! 🏆'
  ],
  collecting: [
    'Fin fangst! 🪙',
    'Samler på gang! 💰',
    'Mer skatter! 💎',
    'Du er rik! 👑'
  ]
};

// Unlockable backgrounds
const UNLOCKABLE_BACKGROUNDS = [
  { id: 'sky', name: 'Himmel', preview: '☁️', unlocked: true },
  { id: 'forest', name: 'Skog', preview: '🌲', unlocked: true },
  { id: 'mountains', name: 'Fjell', preview: '🏔️', unlocked: true },
  { id: 'beach', name: 'Strand', preview: '🏖️', unlocked: true },
  { id: 'space', name: 'Verdensrom', preview: '🌌', requirement: '5_games' },
  { id: 'underwater', name: 'Under vann', preview: '🐠', requirement: '10_games' },
  { id: 'candy', name: 'Godteriland', preview: '🍬', requirement: '1000_coins' },
  { id: 'castle', name: 'Slott', preview: '🏰', requirement: 'fairy_tale_hero' },
  { id: 'volcano', name: 'Vulkanland', preview: '🌋', requirement: 'dino_expert' },
  { id: 'rainbow', name: 'Regnbueland', preview: '🌈', requirement: 'try_all' }
];

// Unlockable special blocks
const UNLOCKABLE_BLOCKS = [
  {
    id: 'rainbow_platform',
    emoji: '🌈',
    name: 'Regnbue-plattform',
    requirement: 'artist'
  },
  {
    id: 'magic_star',
    emoji: '💫',
    name: 'Magisk stjerne',
    requirement: 'ski_master'
  },
  {
    id: 'golden_coin',
    emoji: '🥇',
    name: 'Gullmynt',
    requirement: '1000_coins'
  },
  {
    id: 'super_bounce',
    emoji: '🦘',
    name: 'Supertrampoline',
    requirement: 'high_jumper'
  },
  {
    id: 'rocket_boost',
    emoji: '🚀',
    name: 'Rakett-boost',
    requirement: 'space_explorer'
  }
];

// Helper function to get all achievements as flat array
function getAllAchievements() {
  return Object.values(ACHIEVEMENTS).flat();
}

// Helper function to check if achievement is unlocked
function isAchievementUnlocked(achievementId, userStats) {
  // Implementation depends on user stats structure
  return userStats.achievements?.includes(achievementId) || false;
}

// Helper function to get random encouragement
function getRandomEncouragement(category = 'playing') {
  const messages = ENCOURAGEMENTS[category] || ENCOURAGEMENTS.playing;
  return messages[Math.floor(Math.random() * messages.length)];
}

// Helper function to check achievement progress
function checkAchievementProgress(achievement, userStats) {
  if (achievement.target) {
    // Numeric achievement
    const currentValue = userStats[achievement.id] || 0;
    return {
      current: currentValue,
      target: achievement.target,
      progress: Math.min(currentValue / achievement.target, 1),
      completed: currentValue >= achievement.target
    };
  }
  // Boolean achievement
  return {
    completed: userStats.achievements?.includes(achievement.id) || false
  };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ACHIEVEMENTS,
    ENCOURAGEMENTS,
    UNLOCKABLE_BACKGROUNDS,
    UNLOCKABLE_BLOCKS,
    getAllAchievements,
    isAchievementUnlocked,
    getRandomEncouragement,
    checkAchievementProgress
  };
}
