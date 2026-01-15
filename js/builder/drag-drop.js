/**
 * BARANS SPILLVERKSTED - Drag & Drop System
 * Handles dragging blocks from palette to canvas
 */

const DragDrop = {
  isDragging: false,
  draggedBlock: null,
  ghostElement: null,
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
  draggedObject: null,

  /**
   * Start dragging a block from the palette
   */
  startBlockDrag(block, clientX, clientY) {
    this.isDragging = true;
    this.draggedBlock = block;
    this.startX = clientX;
    this.startY = clientY;

    // Create ghost element
    this.createGhost(block, clientX, clientY);

    // Bind event handlers with correct context
    this._handleDragMove = (e) => {
      if (!this.isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      this.updateGhostPosition(x, y);
    };

    this._handleDragEnd = (e) => {
      const x = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
      const y = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
      this.endDrag(x, y);
    };

    // Add event listeners for drag
    document.addEventListener('mousemove', this._handleDragMove);
    document.addEventListener('mouseup', this._handleDragEnd);
    document.addEventListener('touchmove', this._handleDragMove, { passive: false });
    document.addEventListener('touchend', this._handleDragEnd);
  },

  /**
   * Create ghost element for dragging
   */
  createGhost(block, x, y) {
    this.ghostElement = document.createElement('div');
    this.ghostElement.className = 'block-ghost';
    this.ghostElement.innerHTML = `<span style="font-size: 48px;">${block.icon}</span>`;
    this.ghostElement.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 10000;
      opacity: 0.8;
      transform: translate(-50%, -50%);
      background: rgba(255,255,255,0.9);
      border-radius: 12px;
      padding: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    this.updateGhostPosition(x, y);
    document.body.appendChild(this.ghostElement);
  },

  /**
   * Update ghost element position
   */
  updateGhostPosition(x, y) {
    if (this.ghostElement && x && y) {
      this.ghostElement.style.left = x + 'px';
      this.ghostElement.style.top = y + 'px';
    }
  },

  /**
   * End the drag operation
   */
  endDrag(clientX, clientY) {
    if (!this.isDragging) return;

    // Remove ghost
    if (this.ghostElement) {
      this.ghostElement.remove();
      this.ghostElement = null;
    }

    // Check if dropped on canvas
    const canvas = document.getElementById('builder-canvas');
    const container = document.getElementById('canvas-container');

    if (canvas && container && clientX && clientY) {
      const rect = container.getBoundingClientRect();

      // Check if within canvas bounds
      if (clientX >= rect.left && clientX <= rect.right &&
          clientY >= rect.top && clientY <= rect.bottom) {

        // Calculate position relative to canvas
        const canvasX = clientX - rect.left;
        const canvasY = clientY - rect.top;

        // Convert to world coordinates if CanvasManager is available
        let worldX = canvasX;
        let worldY = canvasY;

        if (typeof CanvasManager !== 'undefined' && CanvasManager.screenToWorld) {
          const worldPos = CanvasManager.screenToWorld(canvasX, canvasY);
          worldX = worldPos.x;
          worldY = worldPos.y;
        }

        // Snap to grid
        if (typeof CanvasManager !== 'undefined' && CanvasManager.snapToGrid) {
          const snapped = CanvasManager.snapToGrid(worldX, worldY);
          worldX = snapped.x;
          worldY = snapped.y;
        }

        // Place the block
        if (typeof BuilderCore !== 'undefined' && this.draggedBlock) {
          BuilderCore.placeBlock(this.draggedBlock, worldX, worldY);
          console.log('Block placed at:', worldX, worldY);

          if (typeof SoundManager !== 'undefined') {
            SoundManager.play('tap');
          }
        }
      }
    }

    // Clean up
    this.isDragging = false;
    this.draggedBlock = null;

    // Remove event listeners
    document.removeEventListener('mousemove', this._handleDragMove);
    document.removeEventListener('mouseup', this._handleDragEnd);
    document.removeEventListener('touchmove', this._handleDragMove);
    document.removeEventListener('touchend', this._handleDragEnd);
  },

  /**
   * Start dragging an existing object on canvas
   */
  startObjectDrag(object, clientX, clientY) {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();

    let worldX = clientX - rect.left;
    let worldY = clientY - rect.top;

    if (typeof CanvasManager !== 'undefined' && CanvasManager.screenToWorld) {
      const worldPos = CanvasManager.screenToWorld(worldX, worldY);
      worldX = worldPos.x;
      worldY = worldPos.y;
    }

    this.offsetX = worldX - object.x;
    this.offsetY = worldY - object.y;

    this.isDragging = true;
    this.draggedObject = object;

    this._handleObjectDragMove = (e) => {
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      this.updateObjectPosition(x, y);
    };

    this._handleObjectDragEnd = () => {
      this.endObjectDrag();
    };

    document.addEventListener('mousemove', this._handleObjectDragMove);
    document.addEventListener('mouseup', this._handleObjectDragEnd);
    document.addEventListener('touchmove', this._handleObjectDragMove, { passive: false });
    document.addEventListener('touchend', this._handleObjectDragEnd);
  },

  /**
   * Update dragged object position
   */
  updateObjectPosition(clientX, clientY) {
    if (!this.isDragging || !this.draggedObject) return;

    const container = document.getElementById('canvas-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let canvasX = clientX - rect.left;
    let canvasY = clientY - rect.top;

    let worldX = canvasX;
    let worldY = canvasY;

    if (typeof CanvasManager !== 'undefined' && CanvasManager.screenToWorld) {
      const worldPos = CanvasManager.screenToWorld(canvasX, canvasY);
      worldX = worldPos.x;
      worldY = worldPos.y;
    }

    // Update object position (with offset)
    let newX = worldX - this.offsetX;
    let newY = worldY - this.offsetY;

    // Snap to grid if enabled
    if (typeof CanvasManager !== 'undefined' && CanvasManager.snapToGrid) {
      const snapped = CanvasManager.snapToGrid(newX, newY);
      newX = snapped.x;
      newY = snapped.y;
    }

    this.draggedObject.x = newX;
    this.draggedObject.y = newY;

    // Clamp to canvas bounds
    if (typeof CanvasManager !== 'undefined') {
      this.draggedObject.x = Math.max(0, Math.min(
        CanvasManager.canvasWidth - this.draggedObject.width,
        this.draggedObject.x
      ));
      this.draggedObject.y = Math.max(0, Math.min(
        CanvasManager.canvasHeight - this.draggedObject.height,
        this.draggedObject.y
      ));
    }

    if (typeof CanvasManager !== 'undefined') {
      CanvasManager.render();
    }
  },

  /**
   * End object drag
   */
  endObjectDrag() {
    this.isDragging = false;
    this.draggedObject = null;

    document.removeEventListener('mousemove', this._handleObjectDragMove);
    document.removeEventListener('mouseup', this._handleObjectDragEnd);
    document.removeEventListener('touchmove', this._handleObjectDragMove);
    document.removeEventListener('touchend', this._handleObjectDragEnd);
  }
};
