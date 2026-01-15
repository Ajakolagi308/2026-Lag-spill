/**
 * BARANS SPILLVERKSTED - Touch Handler
 * Unified touch/mouse event handling for cross-platform support
 */

const TouchHandler = {
  // Configuration
  config: {
    longPressDelay: 500,
    doubleTapDelay: 300,
    swipeThreshold: 50,
    pinchThreshold: 0.1
  },

  // State tracking
  state: {
    isTouch: false,
    isDragging: false,
    isPinching: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    lastTap: 0,
    longPressTimer: null,
    initialPinchDistance: 0,
    activePointers: new Map()
  },

  // Event callbacks
  callbacks: {
    onTap: null,
    onDoubleTap: null,
    onLongPress: null,
    onDragStart: null,
    onDrag: null,
    onDragEnd: null,
    onSwipe: null,
    onPinchStart: null,
    onPinch: null,
    onPinchEnd: null
  },

  /**
   * Initialize touch handling on an element
   */
  init(element, callbacks = {}) {
    this.element = element;
    this.callbacks = { ...this.callbacks, ...callbacks };

    // Detect touch support
    this.state.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Add event listeners
    if (this.state.isTouch) {
      element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
      element.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
    }

    // Also add mouse events for desktop
    element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    element.addEventListener('mouseup', this.handleMouseUp.bind(this));
    element.addEventListener('mouseleave', this.handleMouseUp.bind(this));

    // Prevent context menu on long press
    element.addEventListener('contextmenu', e => e.preventDefault());

    return this;
  },

  /**
   * Get pointer position relative to element
   */
  getPointerPosition(e) {
    const rect = this.element.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      clientX,
      clientY
    };
  },

  /**
   * Calculate distance between two points
   */
  getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  },

  /**
   * Get pinch distance from touch event
   */
  getPinchDistance(e) {
    if (e.touches && e.touches.length >= 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
    return 0;
  },

  /**
   * Get pinch center point
   */
  getPinchCenter(e) {
    if (e.touches && e.touches.length >= 2) {
      return {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
    }
    return { x: 0, y: 0 };
  },

  // ===========================================
  // TOUCH EVENT HANDLERS
  // ===========================================

  handleTouchStart(e) {
    const pos = this.getPointerPosition(e);
    this.state.startX = pos.x;
    this.state.startY = pos.y;
    this.state.currentX = pos.x;
    this.state.currentY = pos.y;

    // Track all active pointers
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      this.state.activePointers.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY
      });
    }

    // Check for pinch (two fingers)
    if (e.touches.length >= 2) {
      e.preventDefault();
      this.state.isPinching = true;
      this.state.initialPinchDistance = this.getPinchDistance(e);

      if (this.callbacks.onPinchStart) {
        this.callbacks.onPinchStart({
          center: this.getPinchCenter(e),
          distance: this.state.initialPinchDistance
        });
      }
      return;
    }

    // Start long press timer
    this.state.longPressTimer = setTimeout(() => {
      if (!this.state.isDragging && this.callbacks.onLongPress) {
        this.callbacks.onLongPress({ x: pos.x, y: pos.y });
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, this.config.longPressDelay);
  },

  handleTouchMove(e) {
    if (this.state.isPinching && e.touches.length >= 2) {
      e.preventDefault();
      const currentDistance = this.getPinchDistance(e);
      const scale = currentDistance / this.state.initialPinchDistance;

      if (this.callbacks.onPinch) {
        this.callbacks.onPinch({
          center: this.getPinchCenter(e),
          scale,
          distance: currentDistance
        });
      }
      return;
    }

    const pos = this.getPointerPosition(e);
    const dx = pos.x - this.state.startX;
    const dy = pos.y - this.state.startY;

    // Cancel long press if moved
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      this.cancelLongPress();

      // Start dragging
      if (!this.state.isDragging) {
        this.state.isDragging = true;
        if (this.callbacks.onDragStart) {
          this.callbacks.onDragStart({
            x: this.state.startX,
            y: this.state.startY
          });
        }
      }
    }

    this.state.currentX = pos.x;
    this.state.currentY = pos.y;

    if (this.state.isDragging && this.callbacks.onDrag) {
      e.preventDefault();
      this.callbacks.onDrag({
        x: pos.x,
        y: pos.y,
        deltaX: dx,
        deltaY: dy,
        startX: this.state.startX,
        startY: this.state.startY
      });
    }
  },

  handleTouchEnd(e) {
    this.cancelLongPress();

    // Handle pinch end
    if (this.state.isPinching) {
      this.state.isPinching = false;
      if (this.callbacks.onPinchEnd) {
        this.callbacks.onPinchEnd();
      }

      // Clear active pointers
      this.state.activePointers.clear();
      return;
    }

    const pos = this.getPointerPosition(e);
    const dx = pos.x - this.state.startX;
    const dy = pos.y - this.state.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check for swipe
    if (distance > this.config.swipeThreshold && !this.state.isDragging) {
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      let direction;

      if (angle > -45 && angle <= 45) direction = 'right';
      else if (angle > 45 && angle <= 135) direction = 'down';
      else if (angle > -135 && angle <= -45) direction = 'up';
      else direction = 'left';

      if (this.callbacks.onSwipe) {
        this.callbacks.onSwipe({
          direction,
          distance,
          deltaX: dx,
          deltaY: dy
        });
      }
    }

    // Check for drag end
    if (this.state.isDragging) {
      this.state.isDragging = false;
      if (this.callbacks.onDragEnd) {
        this.callbacks.onDragEnd({
          x: pos.x,
          y: pos.y,
          startX: this.state.startX,
          startY: this.state.startY
        });
      }
      return;
    }

    // Check for tap/double tap
    if (distance < 10) {
      const now = Date.now();
      const timeSinceLastTap = now - this.state.lastTap;

      if (timeSinceLastTap < this.config.doubleTapDelay && this.callbacks.onDoubleTap) {
        this.callbacks.onDoubleTap({ x: pos.x, y: pos.y });
        this.state.lastTap = 0; // Reset to prevent triple tap
      } else {
        if (this.callbacks.onTap) {
          this.callbacks.onTap({ x: pos.x, y: pos.y });
        }
        this.state.lastTap = now;
      }
    }

    // Clear active pointers
    this.state.activePointers.clear();
  },

  // ===========================================
  // MOUSE EVENT HANDLERS
  // ===========================================

  handleMouseDown(e) {
    if (this.state.isTouch) return; // Ignore mouse on touch devices

    const pos = this.getPointerPosition(e);
    this.state.startX = pos.x;
    this.state.startY = pos.y;
    this.state.currentX = pos.x;
    this.state.currentY = pos.y;

    // Start long press timer
    this.state.longPressTimer = setTimeout(() => {
      if (!this.state.isDragging && this.callbacks.onLongPress) {
        this.callbacks.onLongPress({ x: pos.x, y: pos.y });
      }
    }, this.config.longPressDelay);

    // Mark as potential drag
    this.state.mouseDown = true;
  },

  handleMouseMove(e) {
    if (!this.state.mouseDown || this.state.isTouch) return;

    const pos = this.getPointerPosition(e);
    const dx = pos.x - this.state.startX;
    const dy = pos.y - this.state.startY;

    // Cancel long press if moved
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      this.cancelLongPress();

      if (!this.state.isDragging) {
        this.state.isDragging = true;
        if (this.callbacks.onDragStart) {
          this.callbacks.onDragStart({
            x: this.state.startX,
            y: this.state.startY
          });
        }
      }
    }

    this.state.currentX = pos.x;
    this.state.currentY = pos.y;

    if (this.state.isDragging && this.callbacks.onDrag) {
      this.callbacks.onDrag({
        x: pos.x,
        y: pos.y,
        deltaX: dx,
        deltaY: dy,
        startX: this.state.startX,
        startY: this.state.startY
      });
    }
  },

  handleMouseUp(e) {
    if (!this.state.mouseDown || this.state.isTouch) return;

    this.cancelLongPress();
    this.state.mouseDown = false;

    const pos = this.getPointerPosition(e);
    const dx = pos.x - this.state.startX;
    const dy = pos.y - this.state.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (this.state.isDragging) {
      this.state.isDragging = false;
      if (this.callbacks.onDragEnd) {
        this.callbacks.onDragEnd({
          x: pos.x,
          y: pos.y,
          startX: this.state.startX,
          startY: this.state.startY
        });
      }
      return;
    }

    // Check for click (tap)
    if (distance < 5) {
      const now = Date.now();
      const timeSinceLastTap = now - this.state.lastTap;

      if (timeSinceLastTap < this.config.doubleTapDelay && this.callbacks.onDoubleTap) {
        this.callbacks.onDoubleTap({ x: pos.x, y: pos.y });
        this.state.lastTap = 0;
      } else {
        if (this.callbacks.onTap) {
          this.callbacks.onTap({ x: pos.x, y: pos.y });
        }
        this.state.lastTap = now;
      }
    }
  },

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  cancelLongPress() {
    if (this.state.longPressTimer) {
      clearTimeout(this.state.longPressTimer);
      this.state.longPressTimer = null;
    }
  },

  /**
   * Clean up event listeners
   */
  destroy() {
    if (this.element) {
      this.element.removeEventListener('touchstart', this.handleTouchStart);
      this.element.removeEventListener('touchmove', this.handleTouchMove);
      this.element.removeEventListener('touchend', this.handleTouchEnd);
      this.element.removeEventListener('touchcancel', this.handleTouchEnd);
      this.element.removeEventListener('mousedown', this.handleMouseDown);
      this.element.removeEventListener('mousemove', this.handleMouseMove);
      this.element.removeEventListener('mouseup', this.handleMouseUp);
      this.element.removeEventListener('mouseleave', this.handleMouseUp);
    }
  },

  /**
   * Check if device supports touch
   */
  isTouchDevice() {
    return this.state.isTouch;
  }
};

/**
 * Simple button press handler for game controls
 */
class GameButton {
  constructor(element, options = {}) {
    this.element = element;
    this.isPressed = false;
    this.onPress = options.onPress || (() => {});
    this.onRelease = options.onRelease || (() => {});
    this.repeatInterval = options.repeatInterval || 0;
    this.repeatTimer = null;

    this.bindEvents();
  }

  bindEvents() {
    // Touch events
    this.element.addEventListener('touchstart', e => {
      e.preventDefault();
      this.press();
    }, { passive: false });

    this.element.addEventListener('touchend', e => {
      e.preventDefault();
      this.release();
    }, { passive: false });

    this.element.addEventListener('touchcancel', e => {
      this.release();
    });

    // Mouse events
    this.element.addEventListener('mousedown', e => {
      e.preventDefault();
      this.press();
    });

    this.element.addEventListener('mouseup', e => {
      this.release();
    });

    this.element.addEventListener('mouseleave', e => {
      if (this.isPressed) {
        this.release();
      }
    });
  }

  press() {
    if (this.isPressed) return;

    this.isPressed = true;
    this.element.classList.add('pressed');
    this.onPress();

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Set up repeat if configured
    if (this.repeatInterval > 0) {
      this.repeatTimer = setInterval(() => {
        this.onPress();
      }, this.repeatInterval);
    }
  }

  release() {
    if (!this.isPressed) return;

    this.isPressed = false;
    this.element.classList.remove('pressed');
    this.onRelease();

    // Clear repeat timer
    if (this.repeatTimer) {
      clearInterval(this.repeatTimer);
      this.repeatTimer = null;
    }
  }

  destroy() {
    this.release();
    // Remove event listeners would go here
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TouchHandler, GameButton };
}
