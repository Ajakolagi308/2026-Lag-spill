/**
 * BARANS SPILLVERKSTED - Game Selector
 * Displays game categories and types for selection
 */

const GameSelector = {
  /**
   * Game categories with their games
   */
  categories: [
    {
      id: 'action',
      name: 'ACTION',
      icon: '🎮',
      games: [
        { id: 'platformer', icon: '🦄', name: 'Plattform' },
        { id: 'racing', icon: '🏎️', name: 'Racing' },
        { id: 'angryBirds', icon: '🎯', name: 'Ball-kast' },
        { id: 'catcher', icon: '🧺', name: 'Fang' },
        { id: 'spaceAdventure', icon: '🚀', name: 'Rom' }
      ]
    },
    {
      id: 'ski',
      name: 'SKI',
      icon: '⛷️',
      games: [
        { id: 'skiSlalom', icon: '⛷️', name: 'Slalåm' },
        { id: 'skiLangrenn', icon: '🎿', name: 'Langrenn' },
        { id: 'skiHopp', icon: '🦅', name: 'Skihopp' },
        { id: 'skiSkiskyting', icon: '🎯', name: 'Skiskyting' },
        { id: 'skiFreestyle', icon: '🤸', name: 'Freestyle' }
      ]
    },
    {
      id: 'kreativ',
      name: 'KREATIV',
      icon: '🎨',
      games: [
        { id: 'paintCreate', icon: '🖌️', name: 'Tegne' },
        { id: 'musicMaker', icon: '🎵', name: 'Musikk' },
        { id: 'puzzleBuilder', icon: '🧩', name: 'Puslespill' },
        { id: 'cityBuilder', icon: '🏙️', name: 'By-bygger' },
        { id: 'robotWorkshop', icon: '🤖', name: 'Robot' }
      ]
    },
    {
      id: 'laering',
      name: 'LÆRE',
      icon: '🧠',
      games: [
        { id: 'memoryMatch', icon: '🃏', name: 'Memory' },
        { id: 'fishingGame', icon: '🎣', name: 'Fiske' },
        { id: 'sortingGame', icon: '🗂️', name: 'Sortere' },
        { id: 'numberAdventure', icon: '🔢', name: 'Tall' },
        { id: 'letterHunt', icon: '🔤', name: 'Bokstaver' }
      ]
    },
    {
      id: 'sport',
      name: 'SPORT',
      icon: '🏃',
      games: [
        { id: 'bikeTrack', icon: '🚴', name: 'Sykkel' },
        { id: 'swimmingRace', icon: '🏊', name: 'Svømme' },
        { id: 'football', icon: '⚽', name: 'Fotball' },
        { id: 'trampoline', icon: '🤸', name: 'Trampoline' },
        { id: 'marbleRun', icon: '🔮', name: 'Kule-løype' }
      ]
    },
    {
      id: 'fantasy',
      name: 'FANTASY',
      icon: '🧙',
      games: [
        { id: 'dragonFlight', icon: '🐉', name: 'Drage' },
        { id: 'underwater', icon: '🐬', name: 'Under vann' },
        { id: 'fairyTale', icon: '👸', name: 'Eventyr' },
        { id: 'dinosaurWorld', icon: '🦕', name: 'Dinosaur' },
        { id: 'maze', icon: '🧩', name: 'Labyrint' }
      ]
    }
  ],

  /**
   * Initialize the game selector
   */
  init() {
    this.render();
  },

  /**
   * Render the game categories
   */
  render() {
    const container = document.querySelector('.game-categories');
    if (!container) return;

    container.innerHTML = '';

    this.categories.forEach(category => {
      const card = this.createCategoryCard(category);
      container.appendChild(card);
    });
  },

  /**
   * Create a category card element
   */
  createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.category = category.id;

    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
      <span class="category-icon">${category.icon}</span>
      <span class="category-title">${category.name}</span>
    `;

    const grid = document.createElement('div');
    grid.className = 'game-grid';

    category.games.forEach(game => {
      const btn = this.createGameButton(game);
      grid.appendChild(btn);
    });

    card.appendChild(header);
    card.appendChild(grid);

    return card;
  },

  /**
   * Create a game button element
   */
  createGameButton(game) {
    const btn = document.createElement('button');
    btn.className = 'game-btn';
    btn.dataset.gameType = game.id;

    btn.innerHTML = `
      <span class="game-icon">${game.icon}</span>
      <span class="game-name">${game.name}</span>
    `;

    btn.addEventListener('click', () => {
      this.selectGame(game.id);
    });

    return btn;
  },

  /**
   * Handle game selection
   */
  selectGame(gameType) {
    App.selectGameType(gameType);
  },

  /**
   * Get game info by ID
   */
  getGameInfo(gameId) {
    for (const category of this.categories) {
      const game = category.games.find(g => g.id === gameId);
      if (game) {
        return { ...game, category: category.id };
      }
    }
    return null;
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  GameSelector.init();
});
