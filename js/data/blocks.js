/**
 * BARANS SPILLVERKSTED - Block Definitions
 * All building blocks for each game type
 */

const BLOCKS = {
  // ============================================
  // PLATFORMER BLOCKS
  // ============================================
  platformer: {
    name: 'Plattform',
    blocks: [
      // Platforms
      { id: 'brick', icon: '🧱', name: 'Murstein', category: 'platform', solid: true, width: 40, height: 40 },
      { id: 'dirt', icon: '🟫', name: 'Jord', category: 'platform', solid: true, width: 40, height: 40 },
      { id: 'ice', icon: '🧊', name: 'Is', category: 'platform', solid: true, width: 40, height: 40, friction: 0.98 },
      { id: 'cloud', icon: '☁️', name: 'Sky', category: 'platform', solid: true, oneWay: true, width: 60, height: 30 },
      { id: 'mushroom', icon: '🍄', name: 'Sopp', category: 'platform', solid: true, bounce: true, width: 40, height: 40 },
      { id: 'moving', icon: '🪵', name: 'Bevegelig', category: 'platform', solid: true, moving: true, width: 80, height: 20 },

      // Collectibles
      { id: 'coin', icon: '🪙', name: 'Mynt', category: 'collectible', points: 10, width: 30, height: 30 },
      { id: 'star', icon: '⭐', name: 'Stjerne', category: 'collectible', points: 50, width: 35, height: 35 },
      { id: 'diamond', icon: '💎', name: 'Diamant', category: 'collectible', points: 100, width: 35, height: 35 },
      { id: 'apple', icon: '🍎', name: 'Eple', category: 'collectible', extraLife: true, width: 30, height: 30 },

      // Hazards
      { id: 'lava', icon: '🔥', name: 'Lava', category: 'hazard', deadly: true, width: 40, height: 40 },
      { id: 'spike', icon: '🔺', name: 'Pigg', category: 'hazard', deadly: true, width: 30, height: 30 },

      // Enemies
      { id: 'monster', icon: '👾', name: 'Monster', category: 'enemy', moving: true, width: 40, height: 40 },
      { id: 'bat', icon: '🦇', name: 'Flaggermus', category: 'enemy', flying: true, width: 40, height: 30 },

      // Special
      { id: 'portal', icon: '🌀', name: 'Portal', category: 'special', teleport: true, width: 50, height: 60 },
      { id: 'key', icon: '🔑', name: 'Nøkkel', category: 'special', key: true, width: 30, height: 30 },
      { id: 'door', icon: '🚪', name: 'Dør', category: 'special', door: true, width: 50, height: 70 },
      { id: 'flag', icon: '🚩', name: 'Mål', category: 'special', goal: true, width: 40, height: 60 }
    ]
  },

  // ============================================
  // RACING BLOCKS
  // ============================================
  racing: {
    name: 'Racing',
    blocks: [
      // Road pieces
      { id: 'road_straight', icon: '🛣️', name: 'Vei', category: 'road', width: 60, height: 60 },
      { id: 'road_curve', icon: '↪️', name: 'Sving', category: 'road', width: 60, height: 60 },
      { id: 'bridge', icon: '🌉', name: 'Bro', category: 'road', width: 60, height: 60 },

      // Obstacles
      { id: 'barrier', icon: '🚧', name: 'Barriere', category: 'obstacle', solid: true, width: 40, height: 40 },
      { id: 'rock', icon: '🪨', name: 'Stein', category: 'obstacle', solid: true, width: 35, height: 35 },
      { id: 'puddle', icon: '💧', name: 'Vannpytt', category: 'obstacle', slowdown: true, width: 50, height: 30 },
      { id: 'oil', icon: '🛢️', name: 'Oljesøl', category: 'obstacle', slippery: true, width: 50, height: 50 },

      // Power-ups
      { id: 'boost', icon: '💨', name: 'Boost', category: 'powerup', boost: true, width: 40, height: 40 },
      { id: 'star_racing', icon: '⭐', name: 'Bonus', category: 'powerup', points: 100, width: 35, height: 35 },

      // Markers
      { id: 'start_line', icon: '🏁', name: 'Start', category: 'marker', start: true, width: 80, height: 20 },
      { id: 'finish_line', icon: '🏁', name: 'Mål', category: 'marker', finish: true, width: 80, height: 20 },

      // Decoration
      { id: 'tree', icon: '🌲', name: 'Tre', category: 'decoration', width: 40, height: 50 },
      { id: 'house', icon: '🏠', name: 'Hus', category: 'decoration', width: 50, height: 50 }
    ]
  },

  // ============================================
  // MARBLE RUN BLOCKS
  // ============================================
  marbleRun: {
    name: 'Kuleløype',
    blocks: [
      { id: 'pipe_down', icon: '📦', name: 'Rør ned', category: 'track', width: 40, height: 60 },
      { id: 'ramp_right', icon: '↗️', name: 'Rampe', category: 'track', width: 60, height: 40 },
      { id: 'ramp_left', icon: '↘️', name: 'Rampe', category: 'track', width: 60, height: 40 },
      { id: 'loop', icon: '⭕', name: 'Loop', category: 'track', width: 80, height: 80 },
      { id: 'spiral', icon: '🌀', name: 'Spiral', category: 'track', width: 60, height: 80 },
      { id: 'bell', icon: '🔔', name: 'Bjelle', category: 'interactive', sound: true, width: 30, height: 40 },
      { id: 'funnel', icon: '🎯', name: 'Trakt', category: 'track', width: 50, height: 40 },
      { id: 'accelerator', icon: '⚡', name: 'Akselerator', category: 'powerup', width: 40, height: 40 },
      { id: 'splitter', icon: '🔀', name: 'Splitter', category: 'track', width: 50, height: 50 },
      { id: 'bucket', icon: '🪣', name: 'Samleboks', category: 'goal', width: 50, height: 40 },
      { id: 'marble_green', icon: '🟢', name: 'Grønn kule', category: 'marble', width: 25, height: 25 },
      { id: 'marble_blue', icon: '🔵', name: 'Blå kule', category: 'marble', width: 25, height: 25 },
      { id: 'marble_red', icon: '🔴', name: 'Rød kule', category: 'marble', width: 25, height: 25 }
    ]
  },

  // ============================================
  // MAZE BLOCKS
  // ============================================
  maze: {
    name: 'Labyrint',
    blocks: [
      { id: 'wall', icon: '🧱', name: 'Vegg', category: 'wall', solid: true, width: 40, height: 40 },
      { id: 'entrance', icon: '🚪', name: 'Inngang', category: 'special', entrance: true, width: 40, height: 50 },
      { id: 'exit', icon: '🚪', name: 'Utgang', category: 'special', exit: true, width: 40, height: 50 },
      { id: 'key_maze', icon: '🔑', name: 'Nøkkel', category: 'collectible', width: 25, height: 25 },
      { id: 'treasure', icon: '💎', name: 'Skatt', category: 'collectible', points: 100, width: 30, height: 30 },
      { id: 'enemy_maze', icon: '👾', name: 'Fiende', category: 'enemy', width: 35, height: 35 },
      { id: 'timer', icon: '⏰', name: 'Tidsgiver', category: 'powerup', extraTime: 10, width: 30, height: 30 },
      { id: 'bonus_box', icon: '🎁', name: 'Bonus', category: 'collectible', width: 35, height: 35 },
      { id: 'teleport', icon: '🌀', name: 'Teleport', category: 'special', width: 40, height: 40 },
      { id: 'trap', icon: '🕳️', name: 'Felle', category: 'hazard', width: 35, height: 35 }
    ]
  },

  // ============================================
  // ANGRY BIRDS STYLE BLOCKS
  // ============================================
  angryBirds: {
    name: 'Ball-kast',
    blocks: [
      { id: 'wood_box', icon: '📦', name: 'Treboks', category: 'structure', material: 'wood', health: 50, width: 40, height: 40 },
      { id: 'stone_block', icon: '🧱', name: 'Steinblokk', category: 'structure', material: 'stone', health: 100, width: 40, height: 40 },
      { id: 'ice_block', icon: '🧊', name: 'Is-blokk', category: 'structure', material: 'ice', health: 25, width: 40, height: 40 },
      { id: 'balloon', icon: '🎈', name: 'Ballong', category: 'structure', floats: true, width: 35, height: 45 },
      { id: 'target', icon: '👾', name: 'Fiende', category: 'target', width: 40, height: 40 },
      { id: 'bomb', icon: '💣', name: 'Bombe', category: 'special', explosive: true, width: 35, height: 35 },
      { id: 'star_angry', icon: '⭐', name: 'Bonus', category: 'collectible', points: 500, width: 30, height: 30 }
    ]
  },

  // ============================================
  // CATCHER BLOCKS
  // ============================================
  catcher: {
    name: 'Fang-spillet',
    blocks: [
      // Good items
      { id: 'apple_catch', icon: '🍎', name: 'Eple', category: 'good', points: 10, width: 35, height: 35 },
      { id: 'orange', icon: '🍊', name: 'Appelsin', category: 'good', points: 10, width: 35, height: 35 },
      { id: 'banana', icon: '🍌', name: 'Banan', category: 'good', points: 15, width: 40, height: 35 },
      { id: 'grape', icon: '🍇', name: 'Druer', category: 'good', points: 20, width: 35, height: 35 },
      { id: 'strawberry', icon: '🍓', name: 'Jordbær', category: 'good', points: 25, width: 30, height: 30 },
      { id: 'candy', icon: '🍬', name: 'Godteri', category: 'good', points: 30, width: 30, height: 25 },
      { id: 'star_catch', icon: '⭐', name: 'Stjerne', category: 'good', points: 50, width: 35, height: 35 },
      { id: 'diamond_catch', icon: '💎', name: 'Diamant', category: 'good', points: 100, width: 30, height: 30 },

      // Bad items
      { id: 'bomb_catch', icon: '💣', name: 'Bombe', category: 'bad', damage: true, width: 35, height: 35 },
      { id: 'spider', icon: '🕷️', name: 'Edderkopp', category: 'bad', damage: true, width: 35, height: 30 },
      { id: 'rock_catch', icon: '🪨', name: 'Stein', category: 'bad', damage: true, width: 35, height: 30 },

      // Winter theme
      { id: 'snowflake', icon: '❄️', name: 'Snøfnugg', category: 'good', points: 15, width: 30, height: 30 },
      { id: 'present', icon: '🎁', name: 'Gave', category: 'good', points: 50, width: 35, height: 35 }
    ]
  },

  // ============================================
  // SKI SLALOM BLOCKS
  // ============================================
  skiSlalom: {
    name: 'Slalåm',
    blocks: [
      { id: 'gate_blue', icon: '🔵', name: 'Blå port', category: 'gate', direction: 'left', width: 20, height: 60 },
      { id: 'gate_red', icon: '🔴', name: 'Rød port', category: 'gate', direction: 'right', width: 20, height: 60 },
      { id: 'start_ski', icon: '⛷️', name: 'Start', category: 'special', start: true, width: 50, height: 30 },
      { id: 'finish_ski', icon: '🏁', name: 'Mål', category: 'special', finish: true, width: 80, height: 20 },
      { id: 'tree_ski', icon: '🌲', name: 'Tre', category: 'obstacle', solid: true, width: 40, height: 50 },
      { id: 'rock_ski', icon: '🪨', name: 'Stein', category: 'obstacle', solid: true, width: 35, height: 30 },
      { id: 'snow_pile', icon: '❄️', name: 'Snøhaug', category: 'obstacle', slowdown: true, width: 50, height: 30 },
      { id: 'time_bonus', icon: '⭐', name: 'Tidbonus', category: 'powerup', extraTime: 3, width: 30, height: 30 },
      { id: 'speed_boost', icon: '💨', name: 'Fart-boost', category: 'powerup', boost: true, width: 40, height: 40 }
    ]
  },

  // ============================================
  // SKI LANGRENN BLOCKS
  // ============================================
  skiLangrenn: {
    name: 'Langrenn',
    blocks: [
      { id: 'track_straight', icon: '🛤️', name: 'Løype', category: 'track', width: 60, height: 30 },
      { id: 'track_curve', icon: '↪️', name: 'Sving', category: 'track', width: 60, height: 60 },
      { id: 'track_uphill', icon: '⬆️', name: 'Oppover', category: 'track', uphill: true, width: 60, height: 60 },
      { id: 'track_downhill', icon: '⬇️', name: 'Nedover', category: 'track', downhill: true, width: 60, height: 60 },
      { id: 'forest', icon: '🌲', name: 'Skog', category: 'decoration', width: 50, height: 60 },
      { id: 'mountain', icon: '🏔️', name: 'Fjell', category: 'decoration', width: 80, height: 60 },
      { id: 'rest_station', icon: '⛺', name: 'Hvilestasjon', category: 'powerup', energy: 30, width: 50, height: 50 },
      { id: 'chocolate', icon: '🍫', name: 'Sjokolade', category: 'powerup', energy: 20, width: 30, height: 25 },
      { id: 'cocoa', icon: '☕', name: 'Kakao', category: 'powerup', energy: 15, speed: true, width: 30, height: 35 },
      { id: 'checkpoint', icon: '⭐', name: 'Checkpoint', category: 'special', checkpoint: true, width: 40, height: 40 },
      { id: 'finish_langrenn', icon: '🏁', name: 'Mål', category: 'special', finish: true, width: 80, height: 20 }
    ]
  },

  // ============================================
  // SKI JUMP BLOCKS
  // ============================================
  skiHopp: {
    name: 'Skihopp',
    blocks: [
      { id: 'jump_small', icon: '📐', name: 'K20', category: 'jump', size: 'small', width: 80, height: 100 },
      { id: 'jump_medium', icon: '📐', name: 'K40', category: 'jump', size: 'medium', width: 100, height: 150 },
      { id: 'jump_large', icon: '📐', name: 'K60', category: 'jump', size: 'large', width: 120, height: 200 },
      { id: 'wind_zone', icon: '🌬️', name: 'Vind', category: 'modifier', wind: true, width: 60, height: 60 },
      { id: 'cloud_decor', icon: '☁️', name: 'Sky', category: 'decoration', width: 50, height: 30 },
      { id: 'landing_target', icon: '🎯', name: 'Landingsmål', category: 'target', points: 100, width: 60, height: 20 },
      { id: 'bonus_zone', icon: '⭐', name: 'Bonus-sone', category: 'powerup', points: 50, width: 50, height: 40 }
    ]
  },

  // ============================================
  // BIATHLON BLOCKS
  // ============================================
  skiSkiskyting: {
    name: 'Skiskyting',
    blocks: [
      { id: 'track_biathlon', icon: '🛤️', name: 'Løype', category: 'track', width: 60, height: 30 },
      { id: 'shooting_range', icon: '🎯', name: 'Skytebane', category: 'special', shooting: true, width: 100, height: 60 },
      { id: 'target_1', icon: '⚪', name: 'Blink 1', category: 'target', width: 20, height: 20 },
      { id: 'target_2', icon: '⚪', name: 'Blink 2', category: 'target', width: 20, height: 20 },
      { id: 'target_3', icon: '⚪', name: 'Blink 3', category: 'target', width: 20, height: 20 },
      { id: 'target_4', icon: '⚪', name: 'Blink 4', category: 'target', width: 20, height: 20 },
      { id: 'target_5', icon: '⚪', name: 'Blink 5', category: 'target', width: 20, height: 20 },
      { id: 'penalty_loop', icon: '🔄', name: 'Strafferunde', category: 'special', penalty: true, width: 60, height: 60 },
      { id: 'star_biathlon', icon: '⭐', name: 'Bonus', category: 'powerup', points: 50, width: 30, height: 30 }
    ]
  },

  // ============================================
  // FREESTYLE SKI BLOCKS
  // ============================================
  skiFreestyle: {
    name: 'Freestyle',
    blocks: [
      { id: 'rail', icon: '🛷', name: 'Rail', category: 'feature', grind: true, width: 80, height: 20 },
      { id: 'kicker_small', icon: '📐', name: 'Lite hopp', category: 'feature', jump: 'small', width: 50, height: 30 },
      { id: 'kicker_medium', icon: '📐', name: 'Medium hopp', category: 'feature', jump: 'medium', width: 70, height: 45 },
      { id: 'kicker_large', icon: '📐', name: 'Stort hopp', category: 'feature', jump: 'large', width: 90, height: 60 },
      { id: 'halfpipe', icon: '🌀', name: 'Half-pipe', category: 'feature', halfpipe: true, width: 150, height: 80 },
      { id: 'trick_zone', icon: '⭐', name: 'Triks-sone', category: 'special', trickBonus: true, width: 50, height: 50 },
      { id: 'camera', icon: '🎥', name: 'Kamera', category: 'special', replay: true, width: 30, height: 30 }
    ]
  },

  // ============================================
  // SPACE ADVENTURE BLOCKS
  // ============================================
  spaceAdventure: {
    name: 'Rom-eventyr',
    blocks: [
      { id: 'planet', icon: '🌑', name: 'Planet', category: 'decoration', width: 60, height: 60 },
      { id: 'asteroid', icon: '☄️', name: 'Asteroide', category: 'hazard', moving: true, width: 40, height: 35 },
      { id: 'star_space', icon: '⭐', name: 'Stjerne', category: 'collectible', points: 10, width: 25, height: 25 },
      { id: 'ufo', icon: '🛸', name: 'UFO', category: 'enemy', width: 50, height: 30 },
      { id: 'rocket', icon: '🚀', name: 'Romskip', category: 'player', width: 40, height: 50 },
      { id: 'blackhole', icon: '🌌', name: 'Svart hull', category: 'special', teleport: true, width: 60, height: 60 },
      { id: 'spacestation', icon: '🛰️', name: 'Romstasjon', category: 'special', checkpoint: true, width: 70, height: 50 },
      { id: 'superstar', icon: '💫', name: 'Superstjerne', category: 'powerup', boost: true, width: 35, height: 35 }
    ]
  },

  // ============================================
  // MEMORY MATCH BLOCKS
  // ============================================
  memoryMatch: {
    name: 'Memory',
    blocks: [
      { id: 'card_dog', icon: '🐶', name: 'Hund', category: 'card', width: 60, height: 80 },
      { id: 'card_cat', icon: '🐱', name: 'Katt', category: 'card', width: 60, height: 80 },
      { id: 'card_bird', icon: '🐦', name: 'Fugl', category: 'card', width: 60, height: 80 },
      { id: 'card_fish', icon: '🐟', name: 'Fisk', category: 'card', width: 60, height: 80 },
      { id: 'card_star', icon: '⭐', name: 'Stjerne', category: 'card', width: 60, height: 80 },
      { id: 'card_heart', icon: '❤️', name: 'Hjerte', category: 'card', width: 60, height: 80 },
      { id: 'card_sun', icon: '☀️', name: 'Sol', category: 'card', width: 60, height: 80 },
      { id: 'card_moon', icon: '🌙', name: 'Måne', category: 'card', width: 60, height: 80 }
    ]
  },

  // ============================================
  // FISHING GAME BLOCKS
  // ============================================
  fishingGame: {
    name: 'Fiske-spillet',
    blocks: [
      { id: 'fish_normal', icon: '🐟', name: 'Fisk', category: 'catch', points: 10, width: 40, height: 25 },
      { id: 'crab', icon: '🦀', name: 'Krabbe', category: 'catch', points: 25, width: 35, height: 30 },
      { id: 'octopus', icon: '🐙', name: 'Blekksprut', category: 'avoid', points: -10, width: 40, height: 40 },
      { id: 'starfish', icon: '⭐', name: 'Sjøstjerne', category: 'catch', points: 30, width: 35, height: 35 },
      { id: 'boot', icon: '👢', name: 'Støvel', category: 'junk', points: 0, width: 30, height: 40 },
      { id: 'trash', icon: '🗑️', name: 'Søppel', category: 'avoid', points: -5, width: 30, height: 35 },
      { id: 'treasure_fish', icon: '💎', name: 'Skatt', category: 'catch', points: 100, width: 35, height: 35 }
    ]
  },

  // ============================================
  // SORTING GAME BLOCKS
  // ============================================
  sortingGame: {
    name: 'Sorterings-spillet',
    blocks: [
      // Fruits
      { id: 'sort_apple', icon: '🍎', name: 'Eple', category: 'fruit', width: 40, height: 40 },
      { id: 'sort_carrot', icon: '🥕', name: 'Gulrot', category: 'vegetable', width: 35, height: 45 },
      { id: 'sort_banana', icon: '🍌', name: 'Banan', category: 'fruit', width: 45, height: 35 },
      // Animals
      { id: 'sort_dog', icon: '🐶', name: 'Hund', category: 'pet', width: 40, height: 40 },
      { id: 'sort_lion', icon: '🦁', name: 'Løve', category: 'wild', width: 45, height: 45 },
      // Shapes
      { id: 'sort_circle', icon: '⭕', name: 'Sirkel', category: 'shape_round', width: 40, height: 40 },
      { id: 'sort_square', icon: '⬜', name: 'Firkant', category: 'shape_square', width: 40, height: 40 },
      { id: 'sort_triangle', icon: '🔺', name: 'Trekant', category: 'shape_triangle', width: 40, height: 40 },
      // Colors
      { id: 'sort_red', icon: '🔴', name: 'Rød', category: 'color_red', width: 35, height: 35 },
      { id: 'sort_blue', icon: '🔵', name: 'Blå', category: 'color_blue', width: 35, height: 35 },
      { id: 'sort_green', icon: '🟢', name: 'Grønn', category: 'color_green', width: 35, height: 35 }
    ]
  },

  // ============================================
  // NUMBER ADVENTURE BLOCKS
  // ============================================
  numberAdventure: {
    name: 'Tall-eventyr',
    blocks: [
      { id: 'num_1', icon: '1️⃣', name: '1', category: 'number', value: 1, width: 50, height: 50 },
      { id: 'num_2', icon: '2️⃣', name: '2', category: 'number', value: 2, width: 50, height: 50 },
      { id: 'num_3', icon: '3️⃣', name: '3', category: 'number', value: 3, width: 50, height: 50 },
      { id: 'num_4', icon: '4️⃣', name: '4', category: 'number', value: 4, width: 50, height: 50 },
      { id: 'num_5', icon: '5️⃣', name: '5', category: 'number', value: 5, width: 50, height: 50 },
      { id: 'num_6', icon: '6️⃣', name: '6', category: 'number', value: 6, width: 50, height: 50 },
      { id: 'num_7', icon: '7️⃣', name: '7', category: 'number', value: 7, width: 50, height: 50 },
      { id: 'num_8', icon: '8️⃣', name: '8', category: 'number', value: 8, width: 50, height: 50 },
      { id: 'num_9', icon: '9️⃣', name: '9', category: 'number', value: 9, width: 50, height: 50 },
      { id: 'num_10', icon: '🔟', name: '10', category: 'number', value: 10, width: 50, height: 50 },
      { id: 'plus', icon: '➕', name: 'Pluss', category: 'operator', width: 40, height: 40 },
      { id: 'minus', icon: '➖', name: 'Minus', category: 'operator', width: 40, height: 40 }
    ]
  },

  // ============================================
  // LETTER HUNT BLOCKS
  // ============================================
  letterHunt: {
    name: 'Bokstav-jakt',
    blocks: [
      { id: 'letter_a', icon: '🅰️', name: 'A', category: 'letter', width: 45, height: 45 },
      { id: 'letter_b', icon: '🅱️', name: 'B', category: 'letter', width: 45, height: 45 },
      { id: 'letter_c', icon: 'Ⓒ', name: 'C', category: 'letter', width: 45, height: 45 },
      { id: 'letter_d', icon: 'Ⓓ', name: 'D', category: 'letter', width: 45, height: 45 },
      { id: 'letter_e', icon: 'Ⓔ', name: 'E', category: 'letter', width: 45, height: 45 },
      // Pictures for matching
      { id: 'pic_apple', icon: '🍎', name: 'Eple', category: 'picture', startsWith: 'e', width: 50, height: 50 },
      { id: 'pic_banana', icon: '🍌', name: 'Banan', category: 'picture', startsWith: 'b', width: 50, height: 50 },
      { id: 'pic_cat', icon: '🐱', name: 'Katt', category: 'picture', startsWith: 'k', width: 50, height: 50 },
      { id: 'pic_dog', icon: '🐶', name: 'Hund', category: 'picture', startsWith: 'h', width: 50, height: 50 }
    ]
  },

  // ============================================
  // BIKE TRACK BLOCKS
  // ============================================
  bikeTrack: {
    name: 'Sykkel-løype',
    blocks: [
      { id: 'bike_road', icon: '🛤️', name: 'Vei', category: 'track', width: 60, height: 30 },
      { id: 'bike_ramp', icon: '📐', name: 'Rampe', category: 'feature', jump: true, width: 60, height: 40 },
      { id: 'bike_rock', icon: '🪨', name: 'Stein', category: 'obstacle', solid: true, width: 35, height: 30 },
      { id: 'bike_puddle', icon: '💧', name: 'Vannpytt', category: 'obstacle', slowdown: true, width: 50, height: 25 },
      { id: 'bike_tree', icon: '🌳', name: 'Tre', category: 'decoration', width: 50, height: 60 },
      { id: 'bike_star', icon: '⭐', name: 'Stjerne', category: 'collectible', points: 20, width: 30, height: 30 },
      { id: 'bike_finish', icon: '🏁', name: 'Mål', category: 'special', finish: true, width: 60, height: 40 }
    ]
  },

  // ============================================
  // SWIMMING RACE BLOCKS
  // ============================================
  swimmingRace: {
    name: 'Svømme-race',
    blocks: [
      { id: 'wave', icon: '🌊', name: 'Bølge', category: 'decoration', width: 60, height: 30 },
      { id: 'lane', icon: '🧱', name: 'Banedeler', category: 'structure', width: 20, height: 80 },
      { id: 'bubble', icon: '🫧', name: 'Boble', category: 'collectible', points: 10, width: 25, height: 25 },
      { id: 'fish_swim', icon: '🐠', name: 'Fisk', category: 'collectible', points: 25, width: 35, height: 25 },
      { id: 'shark', icon: '🦈', name: 'Hai', category: 'obstacle', width: 50, height: 35 },
      { id: 'medal', icon: '🏅', name: 'Medalje', category: 'special', finish: true, width: 40, height: 50 }
    ]
  },

  // ============================================
  // FOOTBALL BLOCKS
  // ============================================
  football: {
    name: 'Fotball',
    blocks: [
      { id: 'ball', icon: '⚽', name: 'Ball', category: 'player', width: 30, height: 30 },
      { id: 'goal', icon: '🥅', name: 'Mål', category: 'goal', width: 80, height: 60 },
      { id: 'wall_fb', icon: '🧱', name: 'Mur', category: 'obstacle', solid: true, width: 60, height: 30 },
      { id: 'keeper', icon: '🤖', name: 'Keeper', category: 'obstacle', moving: true, width: 40, height: 50 },
      { id: 'spinner', icon: '🔄', name: 'Svingmur', category: 'obstacle', rotating: true, width: 60, height: 20 },
      { id: 'bonus_zone', icon: '⭐', name: 'Bonus-sone', category: 'powerup', points: 100, width: 50, height: 50 }
    ]
  },

  // ============================================
  // TRAMPOLINE BLOCKS
  // ============================================
  trampoline: {
    name: 'Trampoline',
    blocks: [
      { id: 'trampoline_main', icon: '🔵', name: 'Trampoline', category: 'main', bounce: true, width: 100, height: 30 },
      { id: 'star_air', icon: '⭐', name: 'Stjerne', category: 'collectible', points: 20, width: 30, height: 30 },
      { id: 'balloon_tramp', icon: '🎈', name: 'Ballong', category: 'collectible', points: 30, width: 35, height: 45 },
      { id: 'cloud_tramp', icon: '☁️', name: 'Sky', category: 'decoration', width: 60, height: 35 },
      { id: 'rainbow', icon: '🌈', name: 'Regnbue', category: 'powerup', bonus: true, width: 80, height: 40 }
    ]
  },

  // ============================================
  // DRAGON FLIGHT BLOCKS
  // ============================================
  dragonFlight: {
    name: 'Drage-flyging',
    blocks: [
      { id: 'cloud_dragon', icon: '☁️', name: 'Sky', category: 'obstacle', width: 60, height: 40 },
      { id: 'storm', icon: '⛈️', name: 'Storm', category: 'hazard', damage: true, width: 70, height: 50 },
      { id: 'rainbow_dragon', icon: '🌈', name: 'Regnbue', category: 'powerup', width: 100, height: 50 },
      { id: 'diamond_dragon', icon: '💎', name: 'Diamant', category: 'collectible', points: 50, width: 35, height: 35 },
      { id: 'castle', icon: '🏰', name: 'Slott', category: 'checkpoint', width: 80, height: 100 },
      { id: 'volcano', icon: '🌋', name: 'Vulkan', category: 'hazard', width: 70, height: 80 },
      { id: 'wizard', icon: '🧙', name: 'Trollmann', category: 'powerup', shield: true, width: 40, height: 50 }
    ]
  },

  // ============================================
  // UNDERWATER BLOCKS
  // ============================================
  underwater: {
    name: 'Under vann',
    blocks: [
      { id: 'fish_uw', icon: '🐠', name: 'Fisk', category: 'creature', width: 40, height: 30 },
      { id: 'dolphin', icon: '🐬', name: 'Delfin', category: 'creature', friendly: true, width: 50, height: 35 },
      { id: 'octopus_uw', icon: '🐙', name: 'Blekksprut', category: 'creature', width: 45, height: 45 },
      { id: 'turtle', icon: '🐢', name: 'Skilpadde', category: 'creature', rideable: true, width: 50, height: 35 },
      { id: 'squid', icon: '🦑', name: 'Kjempeblekksprut', category: 'boss', width: 80, height: 100 },
      { id: 'treasure_uw', icon: '💎', name: 'Skatt', category: 'collectible', points: 100, width: 40, height: 40 },
      { id: 'amphora', icon: '🏺', name: 'Amfora', category: 'collectible', points: 50, width: 35, height: 50 },
      { id: 'shipwreck', icon: '🚢', name: 'Skipsvrak', category: 'decoration', width: 100, height: 80 },
      { id: 'seaweed', icon: '🌿', name: 'Tang', category: 'decoration', width: 30, height: 60 },
      { id: 'air_bubble', icon: '🫧', name: 'Luftboble', category: 'powerup', oxygen: true, width: 30, height: 30 }
    ]
  },

  // ============================================
  // FAIRY TALE BLOCKS
  // ============================================
  fairyTale: {
    name: 'Eventyr',
    blocks: [
      { id: 'castle_wall', icon: '🏰', name: 'Slott-vegg', category: 'structure', width: 50, height: 60 },
      { id: 'tower', icon: '🗼', name: 'Tårn', category: 'structure', width: 40, height: 80 },
      { id: 'gate', icon: '🚪', name: 'Port', category: 'structure', width: 50, height: 70 },
      { id: 'princess', icon: '👸', name: 'Prinsesse', category: 'character', width: 40, height: 50 },
      { id: 'prince', icon: '🤴', name: 'Prins', category: 'character', width: 40, height: 50 },
      { id: 'horse', icon: '🐴', name: 'Hest', category: 'creature', rideable: true, width: 50, height: 45 },
      { id: 'dragon_ft', icon: '🐉', name: 'Drage', category: 'creature', width: 60, height: 50 },
      { id: 'wizard_ft', icon: '🧙', name: 'Trollmann', category: 'character', width: 40, height: 50 },
      { id: 'fairy', icon: '🧚', name: 'Fe', category: 'character', helpful: true, width: 35, height: 40 },
      { id: 'treasure_ft', icon: '💎', name: 'Skatt', category: 'collectible', points: 100, width: 40, height: 40 },
      { id: 'key_ft', icon: '🗝️', name: 'Nøkkel', category: 'special', key: true, width: 30, height: 35 },
      { id: 'secret_door', icon: '🚪', name: 'Hemmelig dør', category: 'special', locked: true, width: 50, height: 70 }
    ]
  },

  // ============================================
  // DINOSAUR WORLD BLOCKS
  // ============================================
  dinosaurWorld: {
    name: 'Dinosaur-verden',
    blocks: [
      { id: 'bronto', icon: '🦕', name: 'Brontosaurus', category: 'creature', friendly: true, width: 80, height: 70 },
      { id: 'trex', icon: '🦖', name: 'T-Rex', category: 'creature', enemy: true, width: 70, height: 60 },
      { id: 'fossil', icon: '🦴', name: 'Fossil', category: 'collectible', points: 50, width: 40, height: 25 },
      { id: 'volcano_dino', icon: '🌋', name: 'Vulkan', category: 'hazard', width: 80, height: 100 },
      { id: 'egg', icon: '🥚', name: 'Dinosaur-egg', category: 'collectible', points: 100, width: 35, height: 40 },
      { id: 'palm', icon: '🌴', name: 'Palme', category: 'decoration', width: 50, height: 70 },
      { id: 'rock_dino', icon: '🪨', name: 'Stein', category: 'obstacle', width: 45, height: 35 },
      { id: 'waterhole', icon: '💧', name: 'Vannhull', category: 'special', width: 60, height: 40 }
    ]
  },

  // ============================================
  // CITY BUILDER BLOCKS
  // ============================================
  cityBuilder: {
    name: 'By-bygger',
    blocks: [
      { id: 'house_cb', icon: '🏠', name: 'Hus', category: 'building', width: 50, height: 50 },
      { id: 'building', icon: '🏢', name: 'Bygning', category: 'building', width: 50, height: 80 },
      { id: 'shop', icon: '🏪', name: 'Butikk', category: 'building', width: 50, height: 50 },
      { id: 'school', icon: '🏫', name: 'Skole', category: 'building', width: 70, height: 60 },
      { id: 'hospital', icon: '🏥', name: 'Sykehus', category: 'building', width: 70, height: 70 },
      { id: 'firestation', icon: '🚒', name: 'Brannstasjon', category: 'building', width: 60, height: 50 },
      { id: 'road_cb', icon: '🛣️', name: 'Vei', category: 'road', width: 50, height: 50 },
      { id: 'park', icon: '🌳', name: 'Park', category: 'decoration', width: 60, height: 60 },
      { id: 'playground', icon: '🎡', name: 'Lekeplass', category: 'building', width: 70, height: 70 },
      { id: 'car_cb', icon: '🚗', name: 'Bil', category: 'vehicle', width: 40, height: 25 }
    ]
  },

  // ============================================
  // ROBOT WORKSHOP BLOCKS
  // ============================================
  robotWorkshop: {
    name: 'Robotverksted',
    blocks: [
      { id: 'arm', icon: '🦾', name: 'Arm', category: 'part', width: 30, height: 50 },
      { id: 'leg', icon: '🦿', name: 'Ben', category: 'part', width: 25, height: 60 },
      { id: 'wheel', icon: '⚙️', name: 'Hjul', category: 'part', width: 40, height: 40 },
      { id: 'eye', icon: '👁️', name: 'Øye', category: 'sensor', width: 25, height: 25 },
      { id: 'speaker', icon: '🔊', name: 'Høyttaler', category: 'part', width: 30, height: 30 },
      { id: 'battery', icon: '🔋', name: 'Batteri', category: 'power', width: 25, height: 40 },
      { id: 'gear', icon: '⚙️', name: 'Gir', category: 'part', width: 35, height: 35 },
      { id: 'armor', icon: '🛡️', name: 'Rustning', category: 'part', width: 50, height: 60 },
      { id: 'cmd_forward', icon: '⬆️', name: 'Fremover', category: 'command', width: 50, height: 50 },
      { id: 'cmd_turn', icon: '↩️', name: 'Snu', category: 'command', width: 50, height: 50 },
      { id: 'cmd_grab', icon: '✊', name: 'Grip', category: 'command', width: 50, height: 50 },
      { id: 'cmd_speak', icon: '💬', name: 'Si', category: 'command', width: 50, height: 50 }
    ]
  },

  // ============================================
  // PAINT & CREATE BLOCKS (Tools rather than blocks)
  // ============================================
  paintCreate: {
    name: 'Tegne & male',
    blocks: [
      { id: 'pencil', icon: '✏️', name: 'Blyant', category: 'tool', brushSize: 2, width: 40, height: 40 },
      { id: 'brush', icon: '🖌️', name: 'Pensel', category: 'tool', brushSize: 8, width: 40, height: 40 },
      { id: 'rainbow_brush', icon: '🌈', name: 'Regnbue', category: 'tool', rainbow: true, width: 40, height: 40 },
      { id: 'glitter', icon: '✨', name: 'Glitter', category: 'tool', glitter: true, width: 40, height: 40 },
      { id: 'eraser', icon: '🧽', name: 'Viskelær', category: 'tool', eraser: true, width: 40, height: 40 },
      { id: 'sticker_star', icon: '⭐', name: 'Stjerne', category: 'sticker', width: 50, height: 50 },
      { id: 'sticker_heart', icon: '❤️', name: 'Hjerte', category: 'sticker', width: 50, height: 50 },
      { id: 'sticker_animal', icon: '🐶', name: 'Dyr', category: 'sticker', width: 50, height: 50 }
    ]
  },

  // ============================================
  // MUSIC MAKER BLOCKS
  // ============================================
  musicMaker: {
    name: 'Musikk-lager',
    blocks: [
      { id: 'note_c', icon: '🎵', name: 'Do', category: 'note', pitch: 'C', width: 40, height: 50 },
      { id: 'note_d', icon: '🎵', name: 'Re', category: 'note', pitch: 'D', width: 40, height: 50 },
      { id: 'note_e', icon: '🎵', name: 'Mi', category: 'note', pitch: 'E', width: 40, height: 50 },
      { id: 'note_f', icon: '🎵', name: 'Fa', category: 'note', pitch: 'F', width: 40, height: 50 },
      { id: 'note_g', icon: '🎵', name: 'Sol', category: 'note', pitch: 'G', width: 40, height: 50 },
      { id: 'drum', icon: '🥁', name: 'Tromme', category: 'percussion', width: 50, height: 45 },
      { id: 'guitar', icon: '🎸', name: 'Gitar', category: 'instrument', width: 45, height: 60 },
      { id: 'piano', icon: '🎹', name: 'Piano', category: 'instrument', width: 60, height: 40 },
      { id: 'bell', icon: '🔔', name: 'Bjelle', category: 'percussion', width: 35, height: 40 },
      { id: 'trumpet', icon: '🎺', name: 'Trompet', category: 'instrument', width: 50, height: 35 }
    ]
  },

  // ============================================
  // PUZZLE BUILDER BLOCKS
  // ============================================
  puzzleBuilder: {
    name: 'Puslespill',
    blocks: [
      { id: 'puzzle_4', icon: '🧩', name: '4 brikker', category: 'setting', pieces: 4, width: 60, height: 60 },
      { id: 'puzzle_9', icon: '🧩', name: '9 brikker', category: 'setting', pieces: 9, width: 60, height: 60 },
      { id: 'puzzle_16', icon: '🧩', name: '16 brikker', category: 'setting', pieces: 16, width: 60, height: 60 },
      { id: 'puzzle_25', icon: '🧩', name: '25 brikker', category: 'setting', pieces: 25, width: 60, height: 60 }
    ]
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BLOCKS;
}
