/**
 * BARANS SPILLVERKSTED - Storage Manager
 * Handles all LocalStorage operations
 */

const StorageManager = {
  STORAGE_KEY: 'barans_spillverksted',
  VERSION: '1.0.0',

  /**
   * Initialize storage with default values if needed
   */
  init() {
    const existing = this.getData();
    if (!existing) {
      this.setData(this.getDefaultData());
    } else if (existing.version !== this.VERSION) {
      // Migration logic if needed
      this.migrateData(existing);
    }
    return this.getData();
  },

  /**
   * Get default data structure
   */
  getDefaultData() {
    return {
      version: this.VERSION,
      lastOpened: new Date().toISOString(),

      user: {
        name: '',
        avatar: null,
        totalGamesCreated: 0,
        totalTimePlayed: 0,
        achievements: [],
        unlockedCharacters: [],
        unlockedBackgrounds: [],
        unlockedBlocks: []
      },

      games: [],

      stats: {
        totalCoinsCollected: 0,
        totalStarsCollected: 0,
        totalGamesPlayed: 0,
        totalGamesCompleted: 0,
        gameTypesPlayed: [],
        highScores: {},
        fishCaught: 0,
        itemsSorted: 0,
        metersSwam: 0,
        goalsScored: 0,
        tricksPerformed: 0,
        fossilsFound: 0,
        buildingsBuilt: 0,
        robotChallenges: 0,
        consecutiveDays: 0,
        lastPlayDate: null
      },

      settings: {
        language: 'no',
        musicVolume: 0.7,
        sfxVolume: 1.0,
        hapticFeedback: true
      }
    };
  },

  /**
   * Get all data from storage
   */
  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading from storage:', e);
      return null;
    }
  },

  /**
   * Save all data to storage
   */
  setData(data) {
    try {
      data.lastOpened = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error writing to storage:', e);
      return false;
    }
  },

  /**
   * Migrate data from older version
   */
  migrateData(oldData) {
    const newData = this.getDefaultData();
    // Merge old data into new structure
    newData.user = { ...newData.user, ...oldData.user };
    newData.games = oldData.games || [];
    newData.stats = { ...newData.stats, ...oldData.stats };
    newData.settings = { ...newData.settings, ...oldData.settings };
    this.setData(newData);
  },

  // ===========================================
  // USER METHODS
  // ===========================================

  getUser() {
    const data = this.getData();
    return data?.user || null;
  },

  updateUser(updates) {
    const data = this.getData();
    if (data) {
      data.user = { ...data.user, ...updates };
      this.setData(data);
    }
  },

  setUserName(name) {
    this.updateUser({ name });
  },

  setUserAvatar(avatar) {
    this.updateUser({ avatar });
  },

  // ===========================================
  // GAME METHODS
  // ===========================================

  /**
   * Save a new game
   */
  saveGame(game) {
    const data = this.getData();
    if (!data) return null;

    // Generate ID if new game
    if (!game.id) {
      game.id = 'game_' + Date.now();
      game.createdAt = new Date().toISOString();
      data.user.totalGamesCreated++;
    }

    game.updatedAt = new Date().toISOString();

    // Find existing or add new
    const existingIndex = data.games.findIndex(g => g.id === game.id);
    if (existingIndex >= 0) {
      data.games[existingIndex] = game;
    } else {
      data.games.push(game);
    }

    this.setData(data);

    // Check for achievements
    this.checkGameCreationAchievements(data);

    return game.id;
  },

  /**
   * Get all saved games
   */
  getGames() {
    const data = this.getData();
    return data?.games || [];
  },

  /**
   * Get a specific game by ID
   */
  getGame(gameId) {
    const games = this.getGames();
    return games.find(g => g.id === gameId) || null;
  },

  /**
   * Delete a game
   */
  deleteGame(gameId) {
    const data = this.getData();
    if (!data) return false;

    const index = data.games.findIndex(g => g.id === gameId);
    if (index >= 0) {
      data.games.splice(index, 1);
      this.setData(data);
      return true;
    }
    return false;
  },

  /**
   * Update game play count
   */
  incrementGamePlays(gameId) {
    const data = this.getData();
    const game = data?.games.find(g => g.id === gameId);
    if (game) {
      game.timesPlayed = (game.timesPlayed || 0) + 1;
      this.setData(data);
    }
  },

  // ===========================================
  // STATS METHODS
  // ===========================================

  getStats() {
    const data = this.getData();
    return data?.stats || {};
  },

  updateStats(updates) {
    const data = this.getData();
    if (data) {
      data.stats = { ...data.stats, ...updates };
      this.setData(data);
      this.checkStatAchievements(data);
    }
  },

  addCoins(amount) {
    const data = this.getData();
    if (data) {
      data.stats.totalCoinsCollected = (data.stats.totalCoinsCollected || 0) + amount;
      this.setData(data);
      this.checkCoinAchievements(data);
    }
  },

  addGameTypePlayed(gameType) {
    const data = this.getData();
    if (data) {
      if (!data.stats.gameTypesPlayed.includes(gameType)) {
        data.stats.gameTypesPlayed.push(gameType);
        this.setData(data);
        this.checkExplorationAchievements(data);
      }
    }
  },

  recordHighScore(gameId, score) {
    const data = this.getData();
    if (data) {
      const currentHigh = data.stats.highScores[gameId] || 0;
      if (score > currentHigh) {
        data.stats.highScores[gameId] = score;
        this.setData(data);

        // Check for high score achievement
        if (score >= 5000) {
          this.unlockAchievement('high_scorer');
        }
      }
    }
  },

  recordPlaySession() {
    const data = this.getData();
    if (data) {
      const today = new Date().toDateString();
      const lastPlay = data.stats.lastPlayDate;

      if (lastPlay !== today) {
        // Check if consecutive day
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastPlay === yesterday.toDateString()) {
          data.stats.consecutiveDays = (data.stats.consecutiveDays || 0) + 1;
          if (data.stats.consecutiveDays >= 7) {
            this.unlockAchievement('play_daily');
          }
        } else {
          data.stats.consecutiveDays = 1;
        }

        data.stats.lastPlayDate = today;
        this.setData(data);
      }
    }
  },

  // ===========================================
  // ACHIEVEMENT METHODS
  // ===========================================

  getAchievements() {
    const data = this.getData();
    return data?.user.achievements || [];
  },

  hasAchievement(achievementId) {
    return this.getAchievements().includes(achievementId);
  },

  unlockAchievement(achievementId) {
    const data = this.getData();
    if (data && !data.user.achievements.includes(achievementId)) {
      data.user.achievements.push(achievementId);
      this.setData(data);

      // Trigger achievement notification
      if (typeof window !== 'undefined' && window.App) {
        window.App.showAchievement(achievementId);
      }

      return true;
    }
    return false;
  },

  checkGameCreationAchievements(data) {
    const count = data.user.totalGamesCreated;
    if (count >= 1) this.unlockAchievement('first_game');
    if (count >= 5) this.unlockAchievement('5_games');
    if (count >= 10) this.unlockAchievement('10_games');
    if (count >= 25) this.unlockAchievement('25_games');
    if (count >= 50) this.unlockAchievement('50_games');
  },

  checkCoinAchievements(data) {
    const coins = data.stats.totalCoinsCollected;
    if (coins >= 100) this.unlockAchievement('100_coins');
    if (coins >= 1000) this.unlockAchievement('1000_coins');
    if (coins >= 5000) this.unlockAchievement('5000_coins');
  },

  checkExplorationAchievements(data) {
    const count = data.stats.gameTypesPlayed.length;
    if (count >= 5) this.unlockAchievement('try_5');
    if (count >= 15) this.unlockAchievement('try_15');
    if (count >= 30) this.unlockAchievement('try_all');
  },

  checkStatAchievements(data) {
    if (data.stats.fishCaught >= 100) this.unlockAchievement('fish_king');
    if (data.stats.itemsSorted >= 50) this.unlockAchievement('sorting_pro');
    if (data.stats.metersSwam >= 1000) this.unlockAchievement('swimmer');
    if (data.stats.goalsScored >= 50) this.unlockAchievement('goal_scorer');
  },

  // ===========================================
  // SETTINGS METHODS
  // ===========================================

  getSettings() {
    const data = this.getData();
    return data?.settings || {};
  },

  updateSettings(updates) {
    const data = this.getData();
    if (data) {
      data.settings = { ...data.settings, ...updates };
      this.setData(data);
    }
  },

  // ===========================================
  // UNLOCKABLES METHODS
  // ===========================================

  unlockCharacter(characterId) {
    const data = this.getData();
    if (data && !data.user.unlockedCharacters.includes(characterId)) {
      data.user.unlockedCharacters.push(characterId);
      this.setData(data);
    }
  },

  unlockBackground(backgroundId) {
    const data = this.getData();
    if (data && !data.user.unlockedBackgrounds.includes(backgroundId)) {
      data.user.unlockedBackgrounds.push(backgroundId);
      this.setData(data);
    }
  },

  isCharacterUnlocked(characterId) {
    const data = this.getData();
    return data?.user.unlockedCharacters.includes(characterId) || false;
  },

  isBackgroundUnlocked(backgroundId) {
    const data = this.getData();
    return data?.user.unlockedBackgrounds.includes(backgroundId) || false;
  },

  // ===========================================
  // EXPORT/IMPORT
  // ===========================================

  exportData() {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.version) {
        this.setData(data);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  /**
   * Clear all data (use with caution!)
   */
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.init();
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  StorageManager.init();
}
