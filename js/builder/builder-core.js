/**
 * BARANS SPILLVERKSTED - Builder Core
 * Main builder logic for creating game levels
 */

const BuilderCore = {
  // Current state
  gameType: null,
  character: null,
  objects: [],
  drawings: [],
  selectedObject: null,

  // Tools
  currentTool: 'select', // select, draw, shape, erase
  currentColor: '#FF6B9D',

  // History for undo/redo
  history: [],
  historyIndex: -1,
  maxHistory: 50,

  /**
   * Initialize the builder
   */
  init(gameType, character) {
    this.gameType = gameType;
    this.character = character;
    this.objects = [];
    this.drawings = [];
    this.selectedObject = null;
    this.history = [];
    this.historyIndex = -1;

    // Initialize canvas
    const canvasOptions = this.getCanvasOptionsForGameType(gameType);
    CanvasManager.init(canvasOptions);

    // Initialize block palette
    BlockPalette.init(gameType);

    // Initialize drawing tools
    DrawingTools.init();

    // Set up canvas click handling
    this.setupCanvasInteraction();

    // Update title
    const title = document.getElementById('builder-title');
    if (title) {
      title.textContent = `Bygg: ${App.getGameTypeName(gameType)}`;
    }

    console.log('Builder initialized for:', gameType);
  },

  /**
   * Get canvas options based on game type
   */
  getCanvasOptionsForGameType(gameType) {
    const options = {
      platformer: { width: 2400, height: 600, backgroundColor: '#87CEEB' },
      racing: { width: 1600, height: 1600, backgroundColor: '#90EE90' },
      marbleRun: { width: 1200, height: 1600, backgroundColor: '#F5F5DC' },
      maze: { width: 800, height: 800, backgroundColor: '#DEB887' },
      skiSlalom: { width: 600, height: 2400, backgroundColor: '#F0F8FF' },
      skiLangrenn: { width: 800, height: 2400, backgroundColor: '#F8FAFF' },
      skiHopp: { width: 800, height: 1200, backgroundColor: '#87CEEB' },
      skiSkiskyting: { width: 1200, height: 1600, backgroundColor: '#F0F8FF' },
      skiFreestyle: { width: 1200, height: 800, backgroundColor: '#F0F8FF' },
      spaceAdventure: { width: 800, height: 2400, backgroundColor: '#0a0a2e' },
      underwater: { width: 1200, height: 1600, backgroundColor: '#006994' },
      dragonFlight: { width: 800, height: 2400, backgroundColor: '#87CEEB' },
      cityBuilder: { width: 1600, height: 1200, backgroundColor: '#90EE90' }
    };

    return options[gameType] || { width: 2400, height: 600, backgroundColor: '#87CEEB' };
  },

  /**
   * Set up canvas interaction
   */
  setupCanvasInteraction() {
    const canvas = document.getElementById('builder-canvas');
    if (!canvas) return;

    canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    canvas.addEventListener('dblclick', (e) => this.handleCanvasDoubleClick(e));
  },

  /**
   * Handle canvas click
   */
  handleCanvasClick(e) {
    const rect = e.target.getBoundingClientRect();
    const worldPos = CanvasManager.screenToWorld(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    switch (this.currentTool) {
      case 'select':
        this.selectObjectAt(worldPos.x, worldPos.y);
        break;
      case 'erase':
        this.eraseAt(worldPos.x, worldPos.y);
        break;
    }
  },

  /**
   * Handle double click (delete object)
   */
  handleCanvasDoubleClick(e) {
    const rect = e.target.getBoundingClientRect();
    const worldPos = CanvasManager.screenToWorld(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    const obj = this.getObjectAt(worldPos.x, worldPos.y);
    if (obj) {
      this.deleteObject(obj);
    }
  },

  /**
   * Set current tool
   */
  setTool(tool) {
    this.currentTool = tool;
    this.selectedObject = null;
    CanvasManager.render();
  },

  /**
   * Set current color
   */
  setColor(color) {
    this.currentColor = color;
    DrawingTools.setColor(color);
  },

  /**
   * Place a block on the canvas
   */
  placeBlock(block, x, y) {
    const obj = {
      id: 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: block.id,
      blockData: { ...block },
      x: x,
      y: y,
      width: block.width || 40,
      height: block.height || 40,
      rotation: 0,
      properties: { ...block }
    };

    this.objects.push(obj);
    this.saveToHistory();
    CanvasManager.render();

    return obj;
  },

  /**
   * Add a drawing to the canvas
   */
  addDrawing(drawing) {
    this.drawings.push(drawing);
    this.saveToHistory();
    CanvasManager.render();
  },

  /**
   * Select object at position
   */
  selectObjectAt(x, y) {
    this.selectedObject = this.getObjectAt(x, y);

    if (this.selectedObject) {
      // Start drag
      DragDrop.startObjectDrag(this.selectedObject, x, y);
    }

    CanvasManager.render();
  },

  /**
   * Get object at position
   */
  getObjectAt(x, y) {
    // Search in reverse order (top-most first)
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      if (x >= obj.x && x <= obj.x + obj.width &&
          y >= obj.y && y <= obj.y + obj.height) {
        return obj;
      }
    }
    return null;
  },

  /**
   * Delete an object
   */
  deleteObject(obj) {
    const index = this.objects.indexOf(obj);
    if (index >= 0) {
      this.objects.splice(index, 1);
      if (this.selectedObject === obj) {
        this.selectedObject = null;
      }
      this.saveToHistory();
      CanvasManager.render();
      SoundManager.play('tap');
    }
  },

  /**
   * Erase at position
   */
  eraseAt(x, y, radius = 20) {
    // Check objects
    const obj = this.getObjectAt(x, y);
    if (obj) {
      this.deleteObject(obj);
      return;
    }

    // Check drawings
    let changed = false;
    this.drawings = this.drawings.filter(drawing => {
      if (drawing.type === 'rectangle') {
        if (x >= drawing.x && x <= drawing.x + drawing.width &&
            y >= drawing.y && y <= drawing.y + drawing.height) {
          changed = true;
          return false;
        }
      } else if (drawing.type === 'freehand') {
        // Check if any point is within radius
        for (const point of drawing.points) {
          const dist = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
          if (dist < radius) {
            changed = true;
            return false;
          }
        }
      }
      return true;
    });

    if (changed) {
      this.saveToHistory();
      CanvasManager.render();
      SoundManager.play('tap');
    }
  },

  /**
   * Render all objects
   */
  renderObjects(ctx) {
    // Render drawings first (background)
    DrawingTools.renderDrawings(ctx, this.drawings);

    // Render placed objects
    this.objects.forEach(obj => {
      this.renderObject(ctx, obj);
    });

    // Render selection highlight
    if (this.selectedObject) {
      this.renderSelection(ctx, this.selectedObject);
    }
  },

  /**
   * Render a single object
   */
  renderObject(ctx, obj) {
    ctx.save();
    ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
    ctx.rotate(obj.rotation || 0);

    // Draw emoji/icon
    ctx.font = `${Math.min(obj.width, obj.height) * 0.8}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obj.blockData?.icon || '?', 0, 0);

    ctx.restore();
  },

  /**
   * Render selection highlight
   */
  renderSelection(ctx, obj) {
    ctx.strokeStyle = '#9B6BFF';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(obj.x - 2, obj.y - 2, obj.width + 4, obj.height + 4);
    ctx.setLineDash([]);
  },

  /**
   * Save current state to history
   */
  saveToHistory() {
    // Remove any future history if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    // Add current state
    this.history.push({
      objects: JSON.parse(JSON.stringify(this.objects)),
      drawings: JSON.parse(JSON.stringify(this.drawings))
    });

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  },

  /**
   * Undo last action
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const state = this.history[this.historyIndex];
      this.objects = JSON.parse(JSON.stringify(state.objects));
      this.drawings = JSON.parse(JSON.stringify(state.drawings));
      this.selectedObject = null;
      CanvasManager.render();
      SoundManager.play('tap');
    }
  },

  /**
   * Redo last undone action
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const state = this.history[this.historyIndex];
      this.objects = JSON.parse(JSON.stringify(state.objects));
      this.drawings = JSON.parse(JSON.stringify(state.drawings));
      this.selectedObject = null;
      CanvasManager.render();
      SoundManager.play('tap');
    }
  },

  /**
   * Export game data for saving/playing
   */
  exportGameData() {
    return {
      id: null, // Will be set on save
      name: '',
      type: this.gameType,
      createdAt: null,
      updatedAt: null,
      timesPlayed: 0,
      character: this.character,
      canvas: {
        width: CanvasManager.canvasWidth,
        height: CanvasManager.canvasHeight,
        backgroundColor: CanvasManager.backgroundColor,
        backgroundTheme: null
      },
      objects: JSON.parse(JSON.stringify(this.objects)),
      drawings: JSON.parse(JSON.stringify(this.drawings)),
      settings: {
        difficulty: 'easy',
        timeLimit: null,
        livesCount: 3
      },
      stats: {
        highScore: 0,
        bestTime: null,
        totalCoinsCollected: 0,
        timesCompleted: 0
      }
    };
  },

  /**
   * Load game data for editing
   */
  loadGameData(gameData) {
    if (!gameData) return;

    this.objects = JSON.parse(JSON.stringify(gameData.objects || []));
    this.drawings = JSON.parse(JSON.stringify(gameData.drawings || []));

    if (gameData.canvas) {
      CanvasManager.canvasWidth = gameData.canvas.width || 2400;
      CanvasManager.canvasHeight = gameData.canvas.height || 600;
      CanvasManager.backgroundColor = gameData.canvas.backgroundColor || '#87CEEB';
    }

    this.selectedObject = null;
    this.history = [];
    this.historyIndex = -1;
    this.saveToHistory();

    CanvasManager.render();
  },

  /**
   * Clear all objects and drawings
   */
  clearAll() {
    this.objects = [];
    this.drawings = [];
    this.selectedObject = null;
    this.saveToHistory();
    CanvasManager.render();
  },

  /**
   * Get object count
   */
  getObjectCount() {
    return this.objects.length + this.drawings.length;
  }
};
