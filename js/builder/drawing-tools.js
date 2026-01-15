/**
 * BARANS SPILLVERKSTED - Drawing Tools
 * Freehand drawing and shape tools
 */

const DrawingTools = {
  isDrawing: false,
  currentPath: [],
  currentColor: '#FF6B9D',
  brushSize: 5,
  currentTool: 'pencil', // pencil, brush, eraser, rectangle, circle

  // Shape drawing
  shapeStart: null,
  shapePreview: null,

  /**
   * Initialize drawing tools
   */
  init() {
    const canvas = document.getElementById('builder-canvas');
    if (!canvas) return;

    // Set up drawing events
    canvas.addEventListener('mousedown', this.handleStart.bind(this));
    canvas.addEventListener('mousemove', this.handleMove.bind(this));
    canvas.addEventListener('mouseup', this.handleEnd.bind(this));

    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  },

  /**
   * Set current tool
   */
  setTool(tool) {
    this.currentTool = tool;
  },

  /**
   * Set brush color
   */
  setColor(color) {
    this.currentColor = color;
  },

  /**
   * Set brush size
   */
  setBrushSize(size) {
    this.brushSize = size;
  },

  /**
   * Handle drawing start
   */
  handleStart(e) {
    if (BuilderCore.currentTool !== 'draw' && BuilderCore.currentTool !== 'shape') return;

    const canvas = document.getElementById('builder-canvas');
    const rect = canvas.getBoundingClientRect();
    const worldPos = CanvasManager.screenToWorld(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    if (BuilderCore.currentTool === 'shape') {
      this.startShape(worldPos.x, worldPos.y);
    } else {
      this.startDrawing(worldPos.x, worldPos.y);
    }
  },

  /**
   * Handle touch start
   */
  handleTouchStart(e) {
    if (BuilderCore.currentTool !== 'draw' && BuilderCore.currentTool !== 'shape') return;

    e.preventDefault();
    const touch = e.touches[0];
    const canvas = document.getElementById('builder-canvas');
    const rect = canvas.getBoundingClientRect();
    const worldPos = CanvasManager.screenToWorld(
      touch.clientX - rect.left,
      touch.clientY - rect.top
    );

    if (BuilderCore.currentTool === 'shape') {
      this.startShape(worldPos.x, worldPos.y);
    } else {
      this.startDrawing(worldPos.x, worldPos.y);
    }
  },

  /**
   * Handle drawing move
   */
  handleMove(e) {
    if (!this.isDrawing) return;

    const canvas = document.getElementById('builder-canvas');
    const rect = canvas.getBoundingClientRect();
    const worldPos = CanvasManager.screenToWorld(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    if (BuilderCore.currentTool === 'shape') {
      this.updateShapePreview(worldPos.x, worldPos.y);
    } else {
      this.continueDrawing(worldPos.x, worldPos.y);
    }
  },

  /**
   * Handle touch move
   */
  handleTouchMove(e) {
    if (!this.isDrawing) return;

    e.preventDefault();
    const touch = e.touches[0];
    const canvas = document.getElementById('builder-canvas');
    const rect = canvas.getBoundingClientRect();
    const worldPos = CanvasManager.screenToWorld(
      touch.clientX - rect.left,
      touch.clientY - rect.top
    );

    if (BuilderCore.currentTool === 'shape') {
      this.updateShapePreview(worldPos.x, worldPos.y);
    } else {
      this.continueDrawing(worldPos.x, worldPos.y);
    }
  },

  /**
   * Handle drawing end
   */
  handleEnd(e) {
    if (!this.isDrawing) return;

    if (BuilderCore.currentTool === 'shape') {
      this.finishShape();
    } else {
      this.finishDrawing();
    }
  },

  /**
   * Handle touch end
   */
  handleTouchEnd(e) {
    if (!this.isDrawing) return;

    if (BuilderCore.currentTool === 'shape') {
      this.finishShape();
    } else {
      this.finishDrawing();
    }
  },

  /**
   * Start freehand drawing
   */
  startDrawing(x, y) {
    this.isDrawing = true;
    this.currentPath = [{ x, y }];
  },

  /**
   * Continue freehand drawing
   */
  continueDrawing(x, y) {
    this.currentPath.push({ x, y });
    CanvasManager.render();
    this.drawCurrentPath();
  },

  /**
   * Finish freehand drawing
   */
  finishDrawing() {
    this.isDrawing = false;

    if (this.currentPath.length > 1) {
      // Create drawing object
      const drawing = {
        id: 'draw_' + Date.now(),
        type: 'freehand',
        points: [...this.currentPath],
        color: this.currentColor,
        strokeWidth: this.brushSize,
        isSolid: true
      };

      BuilderCore.addDrawing(drawing);
      SoundManager.play('tap');

      // Unlock artist achievement
      StorageManager.unlockAchievement('artist');
    }

    this.currentPath = [];
    CanvasManager.render();
  },

  /**
   * Draw current path (preview)
   */
  drawCurrentPath() {
    const ctx = CanvasManager.ctx;
    if (!ctx || this.currentPath.length < 2) return;

    ctx.save();
    ctx.scale(CanvasManager.zoom, CanvasManager.zoom);
    ctx.translate(-CanvasManager.viewX, -CanvasManager.viewY);

    ctx.strokeStyle = this.currentColor;
    ctx.lineWidth = this.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);

    for (let i = 1; i < this.currentPath.length; i++) {
      ctx.lineTo(this.currentPath[i].x, this.currentPath[i].y);
    }

    ctx.stroke();
    ctx.restore();
  },

  /**
   * Start drawing a shape
   */
  startShape(x, y) {
    this.isDrawing = true;
    this.shapeStart = { x, y };
    this.shapePreview = null;
  },

  /**
   * Update shape preview
   */
  updateShapePreview(x, y) {
    if (!this.shapeStart) return;

    this.shapePreview = {
      x: Math.min(this.shapeStart.x, x),
      y: Math.min(this.shapeStart.y, y),
      width: Math.abs(x - this.shapeStart.x),
      height: Math.abs(y - this.shapeStart.y)
    };

    CanvasManager.render();
    this.drawShapePreview();
  },

  /**
   * Draw shape preview
   */
  drawShapePreview() {
    if (!this.shapePreview) return;

    const ctx = CanvasManager.ctx;
    ctx.save();
    ctx.scale(CanvasManager.zoom, CanvasManager.zoom);
    ctx.translate(-CanvasManager.viewX, -CanvasManager.viewY);

    ctx.strokeStyle = this.currentColor;
    ctx.fillStyle = this.currentColor + '40'; // Semi-transparent
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    ctx.strokeRect(
      this.shapePreview.x,
      this.shapePreview.y,
      this.shapePreview.width,
      this.shapePreview.height
    );
    ctx.fillRect(
      this.shapePreview.x,
      this.shapePreview.y,
      this.shapePreview.width,
      this.shapePreview.height
    );

    ctx.restore();
  },

  /**
   * Finish drawing shape
   */
  finishShape() {
    this.isDrawing = false;

    if (this.shapePreview && this.shapePreview.width > 10 && this.shapePreview.height > 10) {
      // Create shape object
      const shape = {
        id: 'shape_' + Date.now(),
        type: 'rectangle',
        x: this.shapePreview.x,
        y: this.shapePreview.y,
        width: this.shapePreview.width,
        height: this.shapePreview.height,
        color: this.currentColor,
        isSolid: true
      };

      BuilderCore.addDrawing(shape);
      SoundManager.play('tap');
    }

    this.shapeStart = null;
    this.shapePreview = null;
    CanvasManager.render();
  },

  /**
   * Erase at position
   */
  eraseAt(x, y, radius = 20) {
    // Remove drawings that intersect with eraser
    BuilderCore.eraseAt(x, y, radius);
  },

  /**
   * Render all drawings
   */
  renderDrawings(ctx, drawings) {
    drawings.forEach(drawing => {
      if (drawing.type === 'freehand') {
        this.renderFreehand(ctx, drawing);
      } else if (drawing.type === 'rectangle') {
        this.renderRectangle(ctx, drawing);
      }
    });
  },

  /**
   * Render freehand drawing
   */
  renderFreehand(ctx, drawing) {
    if (!drawing.points || drawing.points.length < 2) return;

    ctx.strokeStyle = drawing.color;
    ctx.lineWidth = drawing.strokeWidth || 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(drawing.points[0].x, drawing.points[0].y);

    for (let i = 1; i < drawing.points.length; i++) {
      ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
    }

    ctx.stroke();
  },

  /**
   * Render rectangle
   */
  renderRectangle(ctx, drawing) {
    ctx.fillStyle = drawing.color;
    ctx.fillRect(drawing.x, drawing.y, drawing.width, drawing.height);

    // Optional border
    ctx.strokeStyle = drawing.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(drawing.x, drawing.y, drawing.width, drawing.height);
  }
};
