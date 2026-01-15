/**
 * BARANS SPILLVERKSTED - Block Palette
 * Displays available blocks for the current game type
 */

const BlockPalette = {
  currentBlocks: [],
  container: null,

  /**
   * Initialize the palette for a game type
   */
  init(gameType) {
    this.container = document.getElementById('block-palette');
    if (!this.container) return;

    // Get blocks for this game type
    this.currentBlocks = this.getBlocksForGameType(gameType);

    this.render();
  },

  /**
   * Get blocks configuration for a game type
   */
  getBlocksForGameType(gameType) {
    const blockSet = BLOCKS[gameType];
    if (!blockSet) {
      console.warn(`No blocks found for game type: ${gameType}`);
      return BLOCKS.platformer.blocks; // Default to platformer
    }
    return blockSet.blocks;
  },

  /**
   * Render the palette
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = '';

    // Group blocks by category
    const categories = this.groupByCategory(this.currentBlocks);

    Object.entries(categories).forEach(([category, blocks]) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'block-category';

      blocks.forEach(block => {
        const blockEl = this.createBlockElement(block);
        categoryDiv.appendChild(blockEl);
      });

      this.container.appendChild(categoryDiv);
    });
  },

  /**
   * Group blocks by category
   */
  groupByCategory(blocks) {
    const groups = {};
    blocks.forEach(block => {
      const cat = block.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(block);
    });
    return groups;
  },

  /**
   * Create a block element for the palette
   */
  createBlockElement(block) {
    const el = document.createElement('div');
    el.className = 'block-item';
    el.dataset.blockId = block.id;

    el.innerHTML = `
      <span class="block-icon">${block.icon}</span>
      <span class="block-name">${block.name}</span>
    `;

    // Make draggable
    el.draggable = true;

    // Touch events for mobile
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startDrag(block, e.touches[0]);
    });

    // Mouse events for desktop
    el.addEventListener('mousedown', (e) => {
      this.startDrag(block, e);
    });

    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('application/json', JSON.stringify(block));
      e.dataTransfer.effectAllowed = 'copy';
    });

    return el;
  },

  /**
   * Start dragging a block
   */
  startDrag(block, event) {
    if (typeof DragDrop !== 'undefined') {
      DragDrop.startBlockDrag(block, event.clientX, event.clientY);
    }
    SoundManager.play('tap');
  },

  /**
   * Get block by ID
   */
  getBlockById(blockId) {
    return this.currentBlocks.find(b => b.id === blockId);
  },

  /**
   * Filter blocks by category
   */
  filterByCategory(category) {
    const filtered = category === 'all'
      ? this.currentBlocks
      : this.currentBlocks.filter(b => b.category === category);

    this.renderFiltered(filtered);
  },

  /**
   * Render filtered blocks
   */
  renderFiltered(blocks) {
    if (!this.container) return;

    this.container.innerHTML = '';

    blocks.forEach(block => {
      const blockEl = this.createBlockElement(block);
      this.container.appendChild(blockEl);
    });
  },

  /**
   * Get available categories
   */
  getCategories() {
    const categories = new Set();
    this.currentBlocks.forEach(block => {
      if (block.category) {
        categories.add(block.category);
      }
    });
    return Array.from(categories);
  }
};
