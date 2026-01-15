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

    // Add event listeners for drag
    document.addEventListener('mousemove', this.handleDragMove);
    document.addEventListener('mouseup', this.handleDragEnd);
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd);
  },

  /**
   * Create ghost element for dragging
   */
  createGhost(block, x, y) {
    this.ghostElement = document.createElement('div');
    this.ghostElement.className = 'block-ghost';
    this.ghostElement.innerHTML = `<span style="font-size: 48px;">${block.icon}</span>`;
    this.ghostElement.style.position = 'fixed';
    this.ghostElement.style.pointerEvents = 'none';
    this.ghostElement.style.zIndex = '1000';
    this.ghostElement.style.opacity = '0.8';

    this.updateGhostPosition(x, y);
    document.body.appendChild(this.ghostElement);
  },

  /**
   * Update ghost element position
   */
  updateGhostPosition(x, y) {
    if (this.ghostElement) {
      this.ghostElement.style.left = (x - 24) + 'px';
      this.ghostElement.style.top = (y - 24) + 'px';
    }
  },

  /**
   * Handle mouse move during drag
   */
  handleDragMove: function(e) {
    if (!DragDrop.isDragging) return;
    DragDrop.updateGhostPosition(e.clientX, e.clientY);
  },

  /**
   * Handle touch move during drag
   */
  handleTouchMove: function(e) {
    if (!DragDrop.isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    DragDrop.updateGhostPosition(touch.clientX, touch.clientY);
  },

  /**
   * Handle drag end (mouse)
   */
  handleDragEnd: function(e) {
    DragDrop.endDrag(e.clientX, e.clientY);
  },

  /**
   * Handle drag end (touch)
   */
  handleTouchEnd: function(e) {
    const touch = e.changedTouches[0];
    DragDrop.endDrag(touch.clientX, touch.clientY);
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
    if (canvas) {
      const rect = canvas.getBoundingClientRect();

      if (clientX >= rect.left && clientX <= rect.right &&
          clientY >= rect.top && clientY <= rect.bottom) {
        // Dropped on canvas - place block
        const canvasX = clientX - rect.left;
        const canvasY = clientY - rect.top;

        // Convert to world coordinates
        const worldPos = CanvasManager.screenToWorld(canvasX, canvasY);

        // Snap to grid
        const snapped = CanvasManager.snapToGrid(worldPos.x, worldPos.y);

        // Place the block
        BuilderCore.placeBlock(this.draggedBlock, snapped.x, snapped.y);
        SoundManager.play('tap');
      }
    }

    // Clean up
    this.isDragging = false;
    this.draggedBlock = null;

    // Remove event listeners
    document.removeEventListener('mousemove', this.handleDragMove);
    document.removeEventListener('mouseup', this.handleDragEnd);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
  },

  /**
   * Start dragging an existing object on canvas
   */
  startObjectDrag(object, clientX, clientY) {
    const canvas = document.getElementById('builder-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const worldPos = CanvasManager.screenToWorld(clientX - rect.left, clientY - rect.top);

    this.offsetX = worldPos.x - object.x;
    this.offsetY = worldPos.y - object.y;

    this.isDragging = true;
    this.draggedObject = object;

    document.addEventListener('mousemove', this.handleObjectDragMove);
    document.addEventListener('mouseup', this.handleObjectDragEnd);
    document.addEventListener('touchmove', this.handleObjectTouchMove, { passive: false });
    document.addEventListener('touchend', this.handleObjectTouchEnd);
  },

  /**
   * Handle object drag move
   */
  handleObjectDragMove: function(e) {
    DragDrop.updateObjectPosition(e.clientX, e.clientY);
  },

  /**
   * Handle object touch move
   */
  handleObjectTouchMove: function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    DragDrop.updateObjectPosition(touch.clientX, touch.clientY);
  },

  /**
   * Update dragged object position
   */
  updateObjectPosition(clientX, clientY) {
    if (!this.isDragging || !this.draggedObject) return;

    const canvas = document.getElementById('builder-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const worldPos = CanvasManager.screenToWorld(clientX - rect.left, clientY - rect.top);

    // Update object position (with offset)
    let newX = worldPos.x - this.offsetX;
    let newY = worldPos.y - this.offsetY;

    // Snap to grid if enabled
    const snapped = CanvasManager.snapToGrid(newX, newY);
    this.draggedObject.x = snapped.x;
    this.draggedObject.y = snapped.y;

    // Clamp to canvas bounds
    this.draggedObject.x = Math.max(0, Math.min(
      CanvasManager.canvasWidth - this.draggedObject.width,
      this.draggedObject.x
    ));
    this.draggedObject.y = Math.max(0, Math.min(
      CanvasManager.canvasHeight - this.draggedObject.height,
      this.draggedObject.y
    ));

    CanvasManager.render();
  },

  /**
   * Handle object drag end
   */
  handleObjectDragEnd: function(e) {
    DragDrop.endObjectDrag();
  },

  /**
   * Handle object touch end
   */
  handleObjectTouchEnd: function(e) {
    DragDrop.endObjectDrag();
  },

  /**
   * End object drag
   */
  endObjectDrag() {
    this.isDragging = false;
    this.draggedObject = null;

    document.removeEventListener('mousemove', this.handleObjectDragMove);
    document.removeEventListener('mouseup', this.handleObjectDragEnd);
    document.removeEventListener('touchmove', this.handleObjectTouchMove);
    document.removeEventListener('touchend', this.handleObjectTouchEnd);
  }
};
