/**
 * BARANS SPILLVERKSTED - Main Application
 * Handles routing, screen management, and app initialization
 */

const App = {
  // Current state
  currentScreen: 'loading-screen',
  currentGameType: null,
  currentGame: null,
  selectedCharacter: null,

  // DOM elements
  screens: {},
  modals: {},

  /**
   * Initialize the application
   */
  async init() {
    console.log('🎮 Barans Spillverksted starter opp...');

    // Cache DOM elements
    this.cacheElements();

    // Initialize storage
    StorageManager.init();
    StorageManager.recordPlaySession();

    // Initialize sound
    SoundManager.init();

    // Load settings
    this.loadSettings();

    // Set up event listeners
    this.bindEvents();

    // Simulate loading (or do actual asset loading)
    await this.simulateLoading();

    // Show main menu
    this.showScreen('main-menu');

    console.log('✅ App initialisert!');
  },

  /**
   * Cache commonly used DOM elements
   */
  cacheElements() {
    // Screens
    const screenIds = [
      'loading-screen', 'main-menu', 'character-picker',
      'builder', 'play-mode', 'saved-games'
    ];
    screenIds.forEach(id => {
      this.screens[id] = document.getElementById(id);
    });

    // Modals
    const modalIds = [
      'pause-modal', 'win-modal', 'settings-modal', 'save-modal'
    ];
    modalIds.forEach(id => {
      this.modals[id] = document.getElementById(id);
    });
  },

  /**
   * Simulate loading (or load actual assets)
   */
  async simulateLoading() {
    const progressBar = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');

    const steps = [
      { progress: 20, text: 'Laster bilder...' },
      { progress: 40, text: 'Forbereder spill...' },
      { progress: 60, text: 'Laster lyder...' },
      { progress: 80, text: 'Nesten klar...' },
      { progress: 100, text: 'Ferdig!' }
    ];

    for (const step of steps) {
      progressBar.style.width = step.progress + '%';
      loadingText.textContent = step.text;
      await this.delay(400);
    }

    await this.delay(300);
  },

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Back buttons
    document.getElementById('btn-back-character')?.addEventListener('click', () => {
      SoundManager.play('back');
      this.showScreen('main-menu');
    });

    document.getElementById('btn-back-builder')?.addEventListener('click', () => {
      SoundManager.play('back');
      this.showScreen('character-picker');
    });

    document.getElementById('btn-back-saved')?.addEventListener('click', () => {
      SoundManager.play('back');
      this.showScreen('main-menu');
    });

    // Saved games button
    document.getElementById('btn-saved-games')?.addEventListener('click', () => {
      SoundManager.play('select');
      this.showSavedGames();
    });

    // Settings button
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      SoundManager.play('tap');
      this.showModal('settings-modal');
    });

    document.getElementById('btn-close-settings')?.addEventListener('click', () => {
      SoundManager.play('tap');
      this.hideModal('settings-modal');
      this.saveSettings();
    });

    // Character picker
    document.getElementById('btn-upload-character')?.addEventListener('click', () => {
      document.getElementById('character-upload')?.click();
    });

    document.getElementById('character-upload')?.addEventListener('change', (e) => {
      this.handleCharacterUpload(e);
    });

    document.getElementById('btn-start-building')?.addEventListener('click', () => {
      SoundManager.play('success');
      this.startBuilder();
    });

    // Builder actions
    document.getElementById('btn-test-game')?.addEventListener('click', () => {
      SoundManager.play('select');
      this.testGame();
    });

    document.getElementById('btn-save-game')?.addEventListener('click', () => {
      SoundManager.play('tap');
      this.showSaveDialog();
    });

    // Save dialog
    document.getElementById('btn-confirm-save')?.addEventListener('click', () => {
      this.saveCurrentGame();
    });

    document.getElementById('btn-cancel-save')?.addEventListener('click', () => {
      this.hideModal('save-modal');
    });

    // Pause modal
    document.getElementById('btn-pause')?.addEventListener('click', () => {
      this.pauseGame();
    });

    document.getElementById('btn-resume')?.addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('btn-restart')?.addEventListener('click', () => {
      this.restartGame();
    });

    document.getElementById('btn-exit-game')?.addEventListener('click', () => {
      this.exitGame();
    });

    // Win modal
    document.getElementById('btn-play-again')?.addEventListener('click', () => {
      SoundManager.play('select');
      this.restartGame();
    });

    document.getElementById('btn-back-to-builder')?.addEventListener('click', () => {
      SoundManager.play('back');
      this.exitGame();
    });

    // Settings sliders
    document.getElementById('music-volume')?.addEventListener('input', (e) => {
      SoundManager.setMusicVolume(e.target.value / 100);
    });

    document.getElementById('sfx-volume')?.addEventListener('input', (e) => {
      SoundManager.setSfxVolume(e.target.value / 100);
      SoundManager.play('tap');
    });

    // Tool buttons in builder
    document.querySelectorAll('.btn-tool').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-tool').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (typeof BuilderCore !== 'undefined') {
          BuilderCore.setTool(btn.dataset.tool);
        }
        SoundManager.play('tap');
      });
    });

    // Color picker
    document.querySelectorAll('.color-option').forEach(color => {
      color.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
        color.classList.add('selected');
        if (typeof BuilderCore !== 'undefined') {
          BuilderCore.setColor(color.dataset.color);
        }
        SoundManager.play('tap');
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    // Prevent zoom on double tap (iOS)
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  },

  /**
   * Handle keyboard input
   */
  handleKeyDown(e) {
    // Escape key - go back or close modals
    if (e.key === 'Escape') {
      if (this.isModalOpen()) {
        this.hideAllModals();
      } else if (this.currentScreen === 'play-mode') {
        this.pauseGame();
      } else if (this.currentScreen === 'builder') {
        this.showScreen('character-picker');
      }
    }
  },

  /**
   * Screen management
   */
  showScreen(screenId) {
    // Hide all screens
    Object.values(this.screens).forEach(screen => {
      if (screen) {
        screen.classList.remove('active');
      }
    });

    // Show target screen
    const targetScreen = this.screens[screenId];
    if (targetScreen) {
      targetScreen.classList.add('active');
      this.currentScreen = screenId;
    }
  },

  /**
   * Modal management
   */
  showModal(modalId) {
    const modal = this.modals[modalId];
    if (modal) {
      modal.hidden = false;
    }
  },

  hideModal(modalId) {
    const modal = this.modals[modalId];
    if (modal) {
      modal.hidden = true;
    }
  },

  hideAllModals() {
    Object.values(this.modals).forEach(modal => {
      if (modal) modal.hidden = true;
    });
  },

  isModalOpen() {
    return Object.values(this.modals).some(modal => modal && !modal.hidden);
  },

  /**
   * Select a game type and proceed to character selection
   */
  selectGameType(gameType) {
    this.currentGameType = gameType;
    SoundManager.play('select');

    // Initialize character picker for this game type
    if (typeof CharacterPicker !== 'undefined') {
      CharacterPicker.init(gameType);
    }

    // Track exploration
    StorageManager.addGameTypePlayed(gameType);

    this.showScreen('character-picker');
  },

  /**
   * Handle character image upload
   */
  async handleCharacterUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await ImageUtils.loadFromFile(file);
      const circularImage = await ImageUtils.cropCircle(imageData, 100);

      this.selectedCharacter = {
        type: 'custom',
        image: circularImage,
        name: ''
      };

      // Show preview
      const preview = document.querySelector('.character-preview');
      if (preview) {
        preview.innerHTML = `<img src="${circularImage}" alt="Din karakter">`;
      }

      const selectedSection = document.getElementById('selected-character');
      if (selectedSection) {
        selectedSection.hidden = false;
      }

      const startBtn = document.getElementById('btn-start-building');
      if (startBtn) {
        startBtn.disabled = false;
      }

      // Unlock achievement
      StorageManager.unlockAchievement('photographer');

      SoundManager.play('success');
    } catch (error) {
      console.error('Failed to load image:', error);
      SoundManager.play('error');
    }
  },

  /**
   * Start the builder
   */
  startBuilder() {
    // Get character name
    const nameInput = document.getElementById('character-name');
    if (nameInput && this.selectedCharacter) {
      this.selectedCharacter.name = nameInput.value || 'Helten';
    }

    // Initialize builder
    if (typeof BuilderCore !== 'undefined') {
      BuilderCore.init(this.currentGameType, this.selectedCharacter);
    }

    this.showScreen('builder');
  },

  /**
   * Test the current game
   */
  testGame() {
    if (typeof BuilderCore !== 'undefined') {
      const gameData = BuilderCore.exportGameData();
      this.startPlayMode(gameData);
    }
  },

  /**
   * Start play mode with game data
   */
  startPlayMode(gameData) {
    this.currentGame = gameData;

    // Get the appropriate game engine
    const GameEngine = this.getGameEngine(gameData.type);
    if (GameEngine) {
      GameEngine.init(gameData);
      GameEngine.start();
    }

    this.showScreen('play-mode');
  },

  /**
   * Get the game engine for a game type
   */
  getGameEngine(gameType) {
    const engines = {
      platformer: typeof PlatformerGame !== 'undefined' ? PlatformerGame : null,
      racing: typeof RacingGame !== 'undefined' ? RacingGame : null,
      marbleRun: typeof MarbleRunGame !== 'undefined' ? MarbleRunGame : null,
      skiSlalom: typeof SkiSlalomGame !== 'undefined' ? SkiSlalomGame : null,
      skiLangrenn: typeof SkiLangrennGame !== 'undefined' ? SkiLangrennGame : null,
      skiHopp: typeof SkiHoppGame !== 'undefined' ? SkiHoppGame : null,
      skiSkiskyting: typeof SkiSkiskytingGame !== 'undefined' ? SkiSkiskytingGame : null,
      skiFreestyle: typeof SkiFreestyleGame !== 'undefined' ? SkiFreestyleGame : null,
      // Add other game engines as they're implemented
    };

    return engines[gameType] || null;
  },

  /**
   * Pause the game
   */
  pauseGame() {
    const GameEngine = this.getGameEngine(this.currentGame?.type);
    if (GameEngine) {
      GameEngine.pause();
    }
    this.showModal('pause-modal');
  },

  /**
   * Resume the game
   */
  resumeGame() {
    this.hideModal('pause-modal');
    const GameEngine = this.getGameEngine(this.currentGame?.type);
    if (GameEngine) {
      GameEngine.resume();
    }
  },

  /**
   * Restart the game
   */
  restartGame() {
    this.hideAllModals();
    const GameEngine = this.getGameEngine(this.currentGame?.type);
    if (GameEngine) {
      GameEngine.restart();
    }
  },

  /**
   * Exit play mode
   */
  exitGame() {
    this.hideAllModals();
    const GameEngine = this.getGameEngine(this.currentGame?.type);
    if (GameEngine) {
      GameEngine.stop();
    }
    this.showScreen('builder');
  },

  /**
   * Show game complete screen
   */
  showWinScreen(stats) {
    document.getElementById('final-coins').textContent = stats.coins || 0;
    document.getElementById('final-stars').textContent = stats.stars || 0;
    document.getElementById('final-time').textContent = this.formatTime(stats.time || 0);

    // Create confetti
    this.createConfetti();

    SoundManager.play('win');
    this.showModal('win-modal');
  },

  /**
   * Show save dialog
   */
  showSaveDialog() {
    const nameInput = document.getElementById('game-name-input');
    if (nameInput) {
      nameInput.value = this.currentGame?.name || '';
      nameInput.focus();
    }
    this.showModal('save-modal');
  },

  /**
   * Save the current game
   */
  saveCurrentGame() {
    const nameInput = document.getElementById('game-name-input');
    const name = nameInput?.value || 'Mitt spill';

    if (typeof BuilderCore !== 'undefined') {
      const gameData = BuilderCore.exportGameData();
      gameData.name = name;
      gameData.character = this.selectedCharacter;

      const gameId = StorageManager.saveGame(gameData);
      console.log('Game saved with ID:', gameId);

      this.hideModal('save-modal');
      SoundManager.play('success');

      // Show confirmation
      this.showEncouragement('Spillet er lagret! 💾');
    }
  },

  /**
   * Show saved games screen
   */
  showSavedGames() {
    const games = StorageManager.getGames();
    const grid = document.getElementById('saved-games-grid');
    const emptyState = document.getElementById('empty-saved-games');

    if (!grid) return;

    grid.innerHTML = '';

    if (games.length === 0) {
      if (emptyState) emptyState.hidden = false;
    } else {
      if (emptyState) emptyState.hidden = true;

      games.forEach(game => {
        const card = this.createSavedGameCard(game);
        grid.appendChild(card);
      });
    }

    this.showScreen('saved-games');
  },

  /**
   * Create a saved game card element
   */
  createSavedGameCard(game) {
    const card = document.createElement('div');
    card.className = 'saved-game-card';
    card.innerHTML = `
      <div class="saved-game-preview">
        ${this.getGameTypeIcon(game.type)}
      </div>
      <div class="saved-game-info">
        <div class="saved-game-name">${game.name || 'Uten navn'}</div>
        <div class="saved-game-type">
          ${this.getGameTypeName(game.type)}
        </div>
      </div>
      <div class="saved-game-actions">
        <button class="btn btn-play">▶️ Spill</button>
        <button class="btn btn-edit">✏️ Rediger</button>
        <button class="btn btn-delete">🗑️</button>
      </div>
    `;

    // Event listeners
    card.querySelector('.btn-play')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.playSavedGame(game);
    });

    card.querySelector('.btn-edit')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.editSavedGame(game);
    });

    card.querySelector('.btn-delete')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteSavedGame(game);
    });

    return card;
  },

  /**
   * Play a saved game
   */
  playSavedGame(game) {
    this.currentGameType = game.type;
    this.selectedCharacter = game.character;
    StorageManager.incrementGamePlays(game.id);
    this.startPlayMode(game);
  },

  /**
   * Edit a saved game
   */
  editSavedGame(game) {
    this.currentGameType = game.type;
    this.selectedCharacter = game.character;
    this.currentGame = game;

    if (typeof BuilderCore !== 'undefined') {
      BuilderCore.init(game.type, game.character);
      BuilderCore.loadGameData(game);
    }

    this.showScreen('builder');
  },

  /**
   * Delete a saved game
   */
  deleteSavedGame(game) {
    if (confirm('Er du sikker på at du vil slette dette spillet?')) {
      StorageManager.deleteGame(game.id);
      this.showSavedGames(); // Refresh list
      SoundManager.play('tap');
    }
  },

  /**
   * Show achievement notification
   */
  showAchievement(achievementId) {
    const achievement = this.findAchievement(achievementId);
    if (!achievement) return;

    const toast = document.getElementById('achievement-toast');
    if (!toast) return;

    toast.querySelector('.achievement-icon').textContent = achievement.icon;
    toast.querySelector('.achievement-title').textContent = achievement.name;
    toast.querySelector('.achievement-desc').textContent = achievement.description;

    toast.hidden = false;
    toast.classList.add('show');

    SoundManager.play('achievement');

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.hidden = true;
      }, 500);
    }, 3000);
  },

  /**
   * Find achievement by ID
   */
  findAchievement(achievementId) {
    const allAchievements = Object.values(ACHIEVEMENTS).flat();
    return allAchievements.find(a => a.id === achievementId);
  },

  /**
   * Show encouragement message
   */
  showEncouragement(message) {
    const existing = document.querySelector('.encouragement');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'encouragement';
    el.textContent = message;
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 2000);
  },

  /**
   * Create confetti effect
   */
  createConfetti() {
    const container = document.querySelector('.confetti-container');
    if (!container) return;

    container.innerHTML = '';

    const colors = ['#FF6B9D', '#9B6BFF', '#6BB5FF', '#6BFFB8', '#FFD66B'];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      container.appendChild(confetti);
    }
  },

  /**
   * Get game type icon
   */
  getGameTypeIcon(gameType) {
    const icons = {
      platformer: '🦄',
      racing: '🏎️',
      marbleRun: '🔮',
      maze: '🧩',
      angryBirds: '🎯',
      catcher: '🧺',
      skiSlalom: '⛷️',
      skiLangrenn: '🎿',
      skiHopp: '🦅',
      skiSkiskyting: '🎯',
      skiFreestyle: '🤸',
      paintCreate: '🖌️',
      musicMaker: '🎵',
      puzzleBuilder: '🧩',
      spaceAdventure: '🚀',
      memoryMatch: '🃏',
      fishingGame: '🎣',
      sortingGame: '🗂️',
      numberAdventure: '🔢',
      letterHunt: '🔤',
      bikeTrack: '🚴',
      swimmingRace: '🏊',
      football: '⚽',
      trampoline: '🤸',
      dragonFlight: '🐉',
      underwater: '🐬',
      fairyTale: '👸',
      dinosaurWorld: '🦕',
      cityBuilder: '🏙️',
      robotWorkshop: '🤖'
    };
    return icons[gameType] || '🎮';
  },

  /**
   * Get game type name in Norwegian
   */
  getGameTypeName(gameType) {
    const names = {
      platformer: 'Plattform',
      racing: 'Racing',
      marbleRun: 'Kuleløype',
      maze: 'Labyrint',
      angryBirds: 'Ball-kast',
      catcher: 'Fang-spillet',
      skiSlalom: 'Slalåm',
      skiLangrenn: 'Langrenn',
      skiHopp: 'Skihopp',
      skiSkiskyting: 'Skiskyting',
      skiFreestyle: 'Freestyle',
      paintCreate: 'Tegne & male',
      musicMaker: 'Musikk-lager',
      puzzleBuilder: 'Puslespill',
      spaceAdventure: 'Rom-eventyr',
      memoryMatch: 'Memory',
      fishingGame: 'Fiske',
      sortingGame: 'Sortering',
      numberAdventure: 'Tall-eventyr',
      letterHunt: 'Bokstav-jakt',
      bikeTrack: 'Sykkel',
      swimmingRace: 'Svømming',
      football: 'Fotball',
      trampoline: 'Trampoline',
      dragonFlight: 'Drage-flyging',
      underwater: 'Under vann',
      fairyTale: 'Eventyr',
      dinosaurWorld: 'Dinosaur',
      cityBuilder: 'By-bygger',
      robotWorkshop: 'Robotverksted'
    };
    return names[gameType] || gameType;
  },

  /**
   * Load settings
   */
  loadSettings() {
    const settings = StorageManager.getSettings();

    const musicSlider = document.getElementById('music-volume');
    if (musicSlider) {
      musicSlider.value = (settings.musicVolume ?? 0.7) * 100;
    }

    const sfxSlider = document.getElementById('sfx-volume');
    if (sfxSlider) {
      sfxSlider.value = (settings.sfxVolume ?? 1.0) * 100;
    }

    const hapticToggle = document.getElementById('haptic-feedback');
    if (hapticToggle) {
      hapticToggle.checked = settings.hapticFeedback ?? true;
    }

    SoundManager.setMusicVolume(settings.musicVolume ?? 0.7);
    SoundManager.setSfxVolume(settings.sfxVolume ?? 1.0);
  },

  /**
   * Save settings
   */
  saveSettings() {
    const musicSlider = document.getElementById('music-volume');
    const sfxSlider = document.getElementById('sfx-volume');
    const hapticToggle = document.getElementById('haptic-feedback');

    StorageManager.updateSettings({
      musicVolume: musicSlider ? musicSlider.value / 100 : 0.7,
      sfxVolume: sfxSlider ? sfxSlider.value / 100 : 1.0,
      hapticFeedback: hapticToggle ? hapticToggle.checked : true
    });
  },

  /**
   * Format time in mm:ss
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * Helper to wait
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Make App globally available
window.App = App;
