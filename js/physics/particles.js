/**
 * BARANS SPILLVERKSTED - Particle System
 * Visual effects like confetti, snow, sparkles, etc.
 */

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.emitters = [];
    this.running = false;
  }

  /**
   * Create a single particle
   */
  createParticle(options) {
    return {
      x: options.x || 0,
      y: options.y || 0,
      vx: options.vx || (Math.random() - 0.5) * 4,
      vy: options.vy || -Math.random() * 4,
      size: options.size || 5 + Math.random() * 5,
      color: options.color || this.randomColor(),
      alpha: options.alpha ?? 1,
      rotation: options.rotation || Math.random() * Math.PI * 2,
      rotationSpeed: options.rotationSpeed || (Math.random() - 0.5) * 0.2,
      gravity: options.gravity ?? 0.1,
      friction: options.friction ?? 0.99,
      life: options.life || 60 + Math.random() * 60,
      maxLife: options.life || 60 + Math.random() * 60,
      shape: options.shape || 'circle',
      emoji: options.emoji || null
    };
  }

  /**
   * Add particles
   */
  emit(x, y, count, options = {}) {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle({
        x,
        y,
        ...options,
        vx: options.vx ?? (Math.random() - 0.5) * (options.spread || 8),
        vy: options.vy ?? -Math.random() * (options.speed || 6) - 2
      }));
    }
  }

  /**
   * Create a particle emitter
   */
  createEmitter(options) {
    const emitter = {
      x: options.x || 0,
      y: options.y || 0,
      rate: options.rate || 5,
      particleOptions: options.particleOptions || {},
      active: true,
      timer: 0
    };
    this.emitters.push(emitter);
    return emitter;
  }

  /**
   * Remove an emitter
   */
  removeEmitter(emitter) {
    const index = this.emitters.indexOf(emitter);
    if (index >= 0) {
      this.emitters.splice(index, 1);
    }
  }

  /**
   * Update all particles
   */
  update() {
    // Update emitters
    for (const emitter of this.emitters) {
      if (emitter.active) {
        emitter.timer++;
        if (emitter.timer >= 60 / emitter.rate) {
          this.emit(emitter.x, emitter.y, 1, emitter.particleOptions);
          emitter.timer = 0;
        }
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Apply physics
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      // Age particle
      p.life--;
      p.alpha = p.life / p.maxLife;

      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Draw all particles
   */
  draw() {
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.alpha;

      if (p.emoji) {
        this.ctx.font = `${p.size * 2}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(p.emoji, 0, 0);
      } else {
        this.ctx.fillStyle = p.color;

        switch (p.shape) {
          case 'circle':
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            break;

          case 'square':
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            break;

          case 'star':
            this.drawStar(0, 0, p.size / 2);
            break;

          case 'heart':
            this.drawHeart(0, 0, p.size / 2);
            break;

          case 'triangle':
            this.ctx.beginPath();
            this.ctx.moveTo(0, -p.size / 2);
            this.ctx.lineTo(p.size / 2, p.size / 2);
            this.ctx.lineTo(-p.size / 2, p.size / 2);
            this.ctx.closePath();
            this.ctx.fill();
            break;
        }
      }

      this.ctx.restore();
    }
  }

  /**
   * Draw a star shape
   */
  drawStar(cx, cy, size) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;

    this.ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / spikes) * i - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Draw a heart shape
   */
  drawHeart(cx, cy, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy + size / 4);
    this.ctx.bezierCurveTo(cx, cy - size / 2, cx - size, cy - size / 2, cx - size, cy + size / 4);
    this.ctx.bezierCurveTo(cx - size, cy + size, cx, cy + size * 1.5, cx, cy + size * 1.5);
    this.ctx.bezierCurveTo(cx, cy + size * 1.5, cx + size, cy + size, cx + size, cy + size / 4);
    this.ctx.bezierCurveTo(cx + size, cy - size / 2, cx, cy - size / 2, cx, cy + size / 4);
    this.ctx.fill();
  }

  /**
   * Get random bright color
   */
  randomColor() {
    const colors = [
      '#FF6B9D', '#9B6BFF', '#6BB5FF', '#6BFFB8',
      '#FFD66B', '#FF9F6B', '#FF6B6B', '#FF6BFF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
    this.emitters = [];
  }

  // ===========================================
  // PRESET EFFECTS
  // ===========================================

  /**
   * Confetti burst
   */
  confetti(x, y, count = 50) {
    const shapes = ['square', 'triangle', 'circle'];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle({
        x,
        y,
        vx: (Math.random() - 0.5) * 15,
        vy: -Math.random() * 10 - 5,
        size: 6 + Math.random() * 6,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        gravity: 0.15,
        life: 120 + Math.random() * 60
      }));
    }
  }

  /**
   * Coin collect effect
   */
  coinCollect(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push(this.createParticle({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 4 - 2,
        color: '#FFD700',
        size: 4 + Math.random() * 4,
        shape: 'circle',
        gravity: 0.1,
        life: 30 + Math.random() * 20
      }));
    }
  }

  /**
   * Star collect effect
   */
  starCollect(x, y) {
    for (let i = 0; i < 12; i++) {
      this.particles.push(this.createParticle({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color: '#FFD66B',
        size: 6 + Math.random() * 6,
        shape: 'star',
        gravity: 0,
        life: 40 + Math.random() * 20
      }));
    }
  }

  /**
   * Explosion effect
   */
  explosion(x, y, color = '#FF6B6B') {
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 / 30) * i;
      const speed = 3 + Math.random() * 5;
      this.particles.push(this.createParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 5,
        shape: 'circle',
        gravity: 0.05,
        life: 40 + Math.random() * 30
      }));
    }
  }

  /**
   * Snow effect (continuous)
   */
  createSnowEmitter(width) {
    return this.createEmitter({
      x: 0,
      y: -10,
      rate: 10,
      particleOptions: {
        vx: () => (Math.random() - 0.5) * 2,
        vy: () => Math.random() * 2 + 1,
        size: 3 + Math.random() * 4,
        color: '#FFFFFF',
        shape: 'circle',
        gravity: 0,
        life: 200,
        get x() { return Math.random() * width; }
      }
    });
  }

  /**
   * Sparkle trail effect
   */
  sparkleTrail(x, y) {
    this.particles.push(this.createParticle({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: 0,
      vy: 0,
      color: '#FFD66B',
      size: 2 + Math.random() * 4,
      shape: 'star',
      gravity: 0,
      life: 15 + Math.random() * 10
    }));
  }

  /**
   * Water splash
   */
  waterSplash(x, y) {
    for (let i = 0; i < 15; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
      const speed = 3 + Math.random() * 5;
      this.particles.push(this.createParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#6BB5FF',
        size: 3 + Math.random() * 4,
        shape: 'circle',
        gravity: 0.2,
        life: 30 + Math.random() * 20
      }));
    }
  }

  /**
   * Emoji burst
   */
  emojiBurst(x, y, emoji, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 8 - 3,
        emoji,
        size: 10 + Math.random() * 10,
        gravity: 0.15,
        life: 60 + Math.random() * 40
      }));
    }
  }

  /**
   * Dust cloud (for landing, etc.)
   */
  dustCloud(x, y, color = '#C9B38C') {
    for (let i = 0; i < 10; i++) {
      this.particles.push(this.createParticle({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 2 - 0.5,
        color,
        size: 8 + Math.random() * 8,
        shape: 'circle',
        gravity: -0.02,
        friction: 0.95,
        life: 30 + Math.random() * 20
      }));
    }
  }

  /**
   * Fire effect
   */
  fire(x, y) {
    const colors = ['#FF6B6B', '#FF9F6B', '#FFD66B'];
    for (let i = 0; i < 3; i++) {
      this.particles.push(this.createParticle({
        x: x + (Math.random() - 0.5) * 10,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 8,
        shape: 'circle',
        gravity: -0.1,
        life: 20 + Math.random() * 20
      }));
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParticleSystem;
}
