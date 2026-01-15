/**
 * BARANS SPILLVERKSTED - Canvas Manager
 * Manages the builder canvas with pan and zoom
 */

const CanvasManager = {
  canvas: null,
  ctx: null,
  container: null,

  // View transformation
  viewX: 0,
  viewY: 0,
  zoom: 1,
  minZoom: 0.5,
  maxZoom: 2,

  // Canvas size
  canvasWidth: 2400,
  canvasHeight: 600,

  // Grid settings
  gridSize: 40,
  showGrid: true,

  // Background
  backgroundColor: '#87CEEB',
  backgroundImage: null,

  /**
   * Initialize the canvas
   */
  init(options = {}) {
    this.canvas = document.getElementById('builder-canvas');
    this.container = document.getElementById('canvas-container');

    if (!this.canvas || !this.container) {
      console.error('Canvas elements not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');

    // Set canvas size based on options
    this.canvasWidth = options.width || 2400;
    this.canvasHeight = options.height || 600;
    this.backgroundColor = options.backgroundColor || '#87CEEB';

    // Set up responsive sizing
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Set up touch/mouse handlers for pan and zoom
    this.setupInteraction();

    console.log('Canvas Manager initialized');
  },

  /**
   * Resize canvas to fit container
   */
  resize() {
    if (!this.container) return;

    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    this.render();
  },

  /**
   * Set up pan/zoom interaction
   */
  setupInteraction() {
    // Initialize touch handler for canvas
    TouchHandler.init(this.canvas, {
      onDrag: (data) => {
        if (BuilderCore.currentTool === 'select' && !BuilderCore.selectedObject) {
          this.pan(data.deltaX, data.deltaY);
        }
      },
      onPinch: (data) => {
        this.zoomAt(data.center.x, data.center.y, data.scale);
      }
    });

    // Mouse wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = this.canvas.getBoundingClientRect();
      this.zoomAt(e.clientX - rect.left, e.clientY - rect.top, delta);
    });
  },

  /**
   * Pan the view
   */
  pan(dx, dy) {
    this.viewX += dx / this.zoom;
    this.viewY += dy / this.zoom;

    // Clamp to canvas bounds
    this.viewX = Math.max(0, Math.min(this.canvasWidth - this.canvas.width / this.zoom, this.viewX));
    this.viewY = Math.max(0, Math.min(this.canvasHeight - this.canvas.height / this.zoom, this.viewY));

    this.render();
  },

  /**
   * Zoom at a specific point
   */
  zoomAt(x, y, factor) {
    const oldZoom = this.zoom;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));

    // Adjust view to zoom toward cursor
    if (this.zoom !== oldZoom) {
      const worldX = this.viewX + x / oldZoom;
      const worldY = this.viewY + y / oldZoom;
      this.viewX = worldX - x / this.zoom;
      this.viewY = worldY - y / this.zoom;
    }

    this.render();
  },

  /**
   * Set zoom level
   */
  setZoom(level) {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, level));
    this.render();
  },

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenX, screenY) {
    return {
      x: this.viewX + screenX / this.zoom,
      y: this.viewY + screenY / this.zoom
    };
  },

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.viewX) * this.zoom,
      y: (worldY - this.viewY) * this.zoom
    };
  },

  /**
   * Render the canvas
   */
  render() {
    if (!this.ctx) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Save context state
    this.ctx.save();

    // Apply view transformation
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.translate(-this.viewX, -this.viewY);

    // Draw background
    this.drawBackground();

    // Draw grid
    if (this.showGrid) {
      this.drawGrid();
    }

    // Draw placed objects (from BuilderCore)
    if (typeof BuilderCore !== 'undefined') {
      BuilderCore.renderObjects(this.ctx);
    }

    // Restore context state
    this.ctx.restore();
  },

  /**
   * Draw background
   */
  drawBackground() {
    if (this.backgroundImage) {
      // Tile the background image
      const pattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
      this.ctx.fillStyle = pattern;
    } else {
      this.ctx.fillStyle = this.backgroundColor;
    }

    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  },

  /**
   * Draw grid
   */
  drawGrid() {
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= this.canvasWidth; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvasHeight);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.canvasHeight; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvasWidth, y);
      this.ctx.stroke();
    }
  },

  /**
   * Set background color
   */
  setBackgroundColor(color) {
    this.backgroundColor = color;
    this.render();
  },

  /**
   * Load background image
   */
  async setBackgroundImage(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.backgroundImage = img;
        this.render();
        resolve();
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  },

  /**
   * Clear background image
   */
  clearBackgroundImage() {
    this.backgroundImage = null;
    this.render();
  },

  /**
   * Toggle grid visibility
   */
  toggleGrid() {
    this.showGrid = !this.showGrid;
    this.render();
  },

  /**
   * Snap position to grid
   */
  snapToGrid(x, y) {
    return {
      x: Math.round(x / this.gridSize) * this.gridSize,
      y: Math.round(y / this.gridSize) * this.gridSize
    };
  },

  /**
   * Center view on a position
   */
  centerOn(worldX, worldY) {
    this.viewX = worldX - (this.canvas.width / this.zoom) / 2;
    this.viewY = worldY - (this.canvas.height / this.zoom) / 2;
    this.render();
  },

  /**
   * Reset view to origin
   */
  resetView() {
    this.viewX = 0;
    this.viewY = 0;
    this.zoom = 1;
    this.render();
  },

  /**
   * Get visible area in world coordinates
   */
  getVisibleArea() {
    return {
      x: this.viewX,
      y: this.viewY,
      width: this.canvas.width / this.zoom,
      height: this.canvas.height / this.zoom
    };
  },

  /**
   * Export canvas as image
   */
  exportAsImage() {
    // Create a temporary canvas at full resolution
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvasWidth;
    tempCanvas.height = this.canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw background
    if (this.backgroundImage) {
      const pattern = tempCtx.createPattern(this.backgroundImage, 'repeat');
      tempCtx.fillStyle = pattern;
    } else {
      tempCtx.fillStyle = this.backgroundColor;
    }
    tempCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw objects
    if (typeof BuilderCore !== 'undefined') {
      BuilderCore.renderObjects(tempCtx);
    }

    return tempCanvas.toDataURL('image/png');
  }
};
