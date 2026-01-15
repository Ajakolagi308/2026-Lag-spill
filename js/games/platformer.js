/**
 * BARANS SPILLVERKSTED - Platformer Game
 * Classic side-scrolling platform game engine
 */

const PlatformerGame = {
  // Game state
  running: false,
  paused: false,
  gameData: null,

  // Canvas and rendering
  canvas: null,
  ctx: null,

  // Physics
  physics: null,

  // Player
  player: null,
  playerBody: null,

  // Game objects
  platforms: [],
  collectibles: [],
  hazards: [],
  enemies: [],
  goal: null,

  // Stats
  score: 0,
  coins: 0,
  stars: 0,
  totalStars: 0,
  lives: 3,
  startTime: 0,

  // Controls
  keys: {
    left: false,
    right: false,
    jump: false
  },

  // Animation
  animationFrame: null,
  lastTime: 0,

  // Particles
  particles: null,

  // Camera
  cameraX: 0,

  /**
   * Initialize the game
   */
  init(gameData) {
    this.gameData = gameData;
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Set canvas size
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Initialize physics
    this.physics = new PhysicsEngine(PhysicsPresets.platformer);

    // Initialize particles
    this.particles = new ParticleSystem(this.canvas);

    // Load level
    this.loadLevel(gameData);

    // Set up controls
    this.setupControls();

    // Update UI
    this.updateUI();

    console.log('Platformer game initialized');
  },

  /**
   * Resize canvas to fit container
   */
  resizeCanvas() {
    const container = this.canvas.parentElement;
    if (container) {
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;
    }
  },

  /**
   * Load level from game data
   */
  loadLevel(gameData) {
    // Reset state
    this.platforms = [];
    this.collectibles = [];
    this.hazards = [];
    this.enemies = [];
    this.goal = null;
    this.physics.clear();

    // Create player
    this.createPlayer(gameData.character);

    // Process objects from game data
    if (gameData.objects) {
      gameData.objects.forEach(obj => {
        this.createGameObject(obj);
      });
    }

    // Process drawings as platforms
    if (gameData.drawings) {
      gameData.drawings.forEach(drawing => {
        if (drawing.isSolid) {
          this.createPlatformFromDrawing(drawing);
        }
      });
    }

    // Count total stars
    this.totalStars = this.collectibles.filter(c => c.type === 'star').length;

    // Reset stats
    this.score = 0;
    this.coins = 0;
    this.stars = 0;
    this.lives = gameData.settings?.livesCount || 3;
    this.cameraX = 0;
  },

  /**
   * Create player
   */
  createPlayer(character) {
    const startX = 100;
    const startY = 100;

    this.player = {
      x: startX,
      y: startY,
      width: 40,
      height: 50,
      emoji: character?.emoji || '🤖',
      facing: 1,
      jumping: false,
      onGround: false
    };

    this.playerBody = this.physics.createBody({
      x: startX,
      y: startY,
      width: 40,
      height: 50,
      mass: 1,
      restitution: 0,
      friction: 0.8,
      userData: { type: 'player' }
    });
  },

  /**
   * Create game object from data
   */
  createGameObject(obj) {
    const blockData = obj.blockData || obj.properties || {};

    // Platform types
    if (blockData.solid) {
      const platform = {
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        icon: blockData.icon,
        friction: blockData.friction || 0.8,
        bounce: blockData.bounce || false,
        moving: blockData.moving || false,
        oneWay: blockData.oneWay || false
      };

      this.platforms.push(platform);

      // Create physics body
      const body = this.physics.createBody({
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        isStatic: true,
        friction: platform.friction,
        restitution: platform.bounce ? 0.8 : 0,
        userData: { type: 'platform', data: platform }
      });

      platform.body = body;
    }

    // Collectibles
    if (blockData.points || blockData.extraLife) {
      this.collectibles.push({
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        icon: blockData.icon,
        type: obj.type,
        points: blockData.points || 0,
        extraLife: blockData.extraLife || false,
        collected: false
      });
    }

    // Hazards
    if (blockData.deadly) {
      this.hazards.push({
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        icon: blockData.icon
      });
    }

    // Enemies
    if (blockData.category === 'enemy') {
      this.enemies.push({
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        icon: blockData.icon,
        startX: obj.x,
        direction: 1,
        speed: 2,
        range: blockData.range || 100,
        flying: blockData.flying || false
      });
    }

    // Goal
    if (blockData.goal) {
      this.goal = {
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        icon: blockData.icon
      };
    }
  },

  /**
   * Create platform from drawing
   */
  createPlatformFromDrawing(drawing) {
    if (drawing.type === 'rectangle') {
      const platform = {
        x: drawing.x,
        y: drawing.y,
        width: drawing.width,
        height: drawing.height,
        color: drawing.color,
        isDrawn: true
      };

      this.platforms.push(platform);

      this.physics.createBody({
        x: drawing.x,
        y: drawing.y,
        width: drawing.width,
        height: drawing.height,
        isStatic: true,
        userData: { type: 'platform', data: platform }
      });
    }
  },

  /**
   * Set up controls
   */
  setupControls() {
    // Keyboard
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Touch buttons
    this.setupTouchControls();
  },

  /**
   * Set up touch controls
   */
  setupTouchControls() {
    const controlsContainer = document.getElementById('game-controls');
    if (!controlsContainer) return;

    controlsContainer.innerHTML = `
      <div class="platform-controls">
        <div class="direction-buttons">
          <button class="btn btn-direction" id="btn-left">◀️</button>
          <button class="btn btn-direction" id="btn-right">▶️</button>
        </div>
        <button class="btn btn-jump" id="btn-jump">🦘</button>
      </div>
    `;

    // Left button
    const leftBtn = document.getElementById('btn-left');
    new GameButton(leftBtn, {
      onPress: () => { this.keys.left = true; },
      onRelease: () => { this.keys.left = false; },
      repeatInterval: 0
    });

    // Right button
    const rightBtn = document.getElementById('btn-right');
    new GameButton(rightBtn, {
      onPress: () => { this.keys.right = true; },
      onRelease: () => { this.keys.right = false; },
      repeatInterval: 0
    });

    // Jump button
    const jumpBtn = document.getElementById('btn-jump');
    new GameButton(jumpBtn, {
      onPress: () => { this.keys.jump = true; this.jump(); },
      onRelease: () => { this.keys.jump = false; }
    });
  },

  /**
   * Handle key down
   */
  handleKeyDown(e) {
    if (this.paused) return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        this.keys.left = true;
        break;
      case 'ArrowRight':
      case 'd':
        this.keys.right = true;
        break;
      case 'ArrowUp':
      case 'w':
      case ' ':
        if (!this.keys.jump) {
          this.keys.jump = true;
          this.jump();
        }
        e.preventDefault();
        break;
    }
  },

  /**
   * Handle key up
   */
  handleKeyUp(e) {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        this.keys.left = false;
        break;
      case 'ArrowRight':
      case 'd':
        this.keys.right = false;
        break;
      case 'ArrowUp':
      case 'w':
      case ' ':
        this.keys.jump = false;
        break;
    }
  },

  /**
   * Jump
   */
  jump() {
    if (this.playerBody.onGround) {
      this.physics.setVelocity(this.playerBody, this.playerBody.vx, -14);
      this.player.jumping = true;
      SoundManager.play('jump');
    }
  },

  /**
   * Start the game
   */
  start() {
    this.running = true;
    this.paused = false;
    this.startTime = Date.now();
    this.lastTime = performance.now();

    // Start music
    SoundManager.playMusic('adventure');

    // Start game loop
    this.gameLoop();
  },

  /**
   * Pause the game
   */
  pause() {
    this.paused = true;
    SoundManager.stopMusic();
  },

  /**
   * Resume the game
   */
  resume() {
    this.paused = false;
    this.lastTime = performance.now();
    SoundManager.playMusic('adventure');
    this.gameLoop();
  },

  /**
   * Restart the game
   */
  restart() {
    this.loadLevel(this.gameData);
    this.start();
  },

  /**
   * Stop the game
   */
  stop() {
    this.running = false;
    this.paused = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    SoundManager.stopMusic();
  },

  /**
   * Main game loop
   */
  gameLoop() {
    if (!this.running || this.paused) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    this.animationFrame = requestAnimationFrame(() => this.gameLoop());
  },

  /**
   * Update game state
   */
  update(deltaTime) {
    // Handle input
    this.handleInput();

    // Update physics
    this.physics.update(deltaTime);

    // Sync player position with physics body
    this.player.x = this.playerBody.x;
    this.player.y = this.playerBody.y;
    this.player.onGround = this.playerBody.onGround;

    if (this.player.onGround) {
      this.player.jumping = false;
    }

    // Update enemies
    this.updateEnemies();

    // Check collisions
    this.checkCollisions();

    // Update camera
    this.updateCamera();

    // Update particles
    this.particles.update();

    // Check win/lose conditions
    this.checkGameState();
  },

  /**
   * Handle player input
   */
  handleInput() {
    const speed = 5;

    if (this.keys.left) {
      this.physics.setVelocity(this.playerBody, -speed, this.playerBody.vy);
      this.player.facing = -1;
    } else if (this.keys.right) {
      this.physics.setVelocity(this.playerBody, speed, this.playerBody.vy);
      this.player.facing = 1;
    } else {
      // Apply friction when not moving
      this.physics.setVelocity(this.playerBody, this.playerBody.vx * 0.8, this.playerBody.vy);
    }
  },

  /**
   * Update enemies
   */
  updateEnemies() {
    this.enemies.forEach(enemy => {
      // Simple back and forth movement
      enemy.x += enemy.speed * enemy.direction;

      if (enemy.x > enemy.startX + enemy.range) {
        enemy.direction = -1;
      } else if (enemy.x < enemy.startX - enemy.range) {
        enemy.direction = 1;
      }
    });
  },

  /**
   * Check collisions
   */
  checkCollisions() {
    // Check collectibles
    this.collectibles.forEach(item => {
      if (!item.collected && this.checkOverlap(this.player, item)) {
        this.collectItem(item);
      }
    });

    // Check hazards
    this.hazards.forEach(hazard => {
      if (this.checkOverlap(this.player, hazard)) {
        this.hitHazard();
      }
    });

    // Check enemies
    this.enemies.forEach(enemy => {
      if (this.checkOverlap(this.player, enemy)) {
        // Check if jumping on top
        if (this.playerBody.vy > 0 && this.player.y + this.player.height < enemy.y + enemy.height / 2) {
          this.defeatEnemy(enemy);
        } else {
          this.hitHazard();
        }
      }
    });

    // Check goal
    if (this.goal && this.checkOverlap(this.player, this.goal)) {
      this.win();
    }

    // Check fall off screen
    if (this.player.y > this.gameData.canvas.height + 100) {
      this.hitHazard();
    }
  },

  /**
   * Check overlap between two rectangles
   */
  checkOverlap(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  },

  /**
   * Collect an item
   */
  collectItem(item) {
    item.collected = true;

    if (item.points) {
      this.score += item.points;

      if (item.type === 'coin') {
        this.coins++;
        SoundManager.play('coin');
        this.particles.coinCollect(item.x + item.width / 2, item.y + item.height / 2);
      } else if (item.type === 'star') {
        this.stars++;
        SoundManager.play('star');
        this.particles.starCollect(item.x + item.width / 2, item.y + item.height / 2);
      } else {
        SoundManager.play('coin');
      }
    }

    if (item.extraLife) {
      this.lives++;
      SoundManager.play('success');
    }

    this.updateUI();
    this.showScorePopup(item.x, item.y, `+${item.points || ''}`);
  },

  /**
   * Defeat an enemy
   */
  defeatEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index >= 0) {
      this.enemies.splice(index, 1);
      this.score += 100;
      this.physics.setVelocity(this.playerBody, this.playerBody.vx, -10);
      SoundManager.play('bounce');
      this.particles.explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#FF6B6B');
      this.showScorePopup(enemy.x, enemy.y, '+100');
      this.updateUI();
    }
  },

  /**
   * Hit a hazard
   */
  hitHazard() {
    this.lives--;
    this.updateUI();

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Respawn
      SoundManager.play('hit');
      this.playerBody.x = 100;
      this.playerBody.y = 100;
      this.playerBody.vx = 0;
      this.playerBody.vy = 0;
      this.showEncouragement();
    }
  },

  /**
   * Update camera position
   */
  updateCamera() {
    const targetX = this.player.x - this.canvas.width / 2;
    this.cameraX += (targetX - this.cameraX) * 0.1;
    this.cameraX = Math.max(0, Math.min(this.gameData.canvas.width - this.canvas.width, this.cameraX));
  },

  /**
   * Check game state
   */
  checkGameState() {
    // Additional checks can go here
  },

  /**
   * Win the game
   */
  win() {
    this.running = false;
    SoundManager.stopMusic();

    const time = (Date.now() - this.startTime) / 1000;

    // Save stats
    StorageManager.addCoins(this.coins);
    StorageManager.recordHighScore(this.gameData.id, this.score);

    // Show win screen
    App.showWinScreen({
      coins: this.coins,
      stars: this.stars,
      time: time,
      score: this.score
    });

    // Check achievements
    StorageManager.unlockAchievement('first_win');
  },

  /**
   * Game over
   */
  gameOver() {
    this.running = false;
    SoundManager.play('lose');
    SoundManager.stopMusic();

    // Could show game over screen
    setTimeout(() => {
      this.restart();
    }, 2000);
  },

  /**
   * Render the game
   */
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.ctx.fillStyle = this.gameData.canvas?.backgroundColor || '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Save context and apply camera
    this.ctx.save();
    this.ctx.translate(-this.cameraX, 0);

    // Draw platforms
    this.platforms.forEach(platform => {
      if (platform.isDrawn) {
        this.ctx.fillStyle = platform.color;
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      } else {
        this.ctx.font = `${Math.min(platform.width, platform.height) * 0.8}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(platform.icon, platform.x + platform.width / 2, platform.y + platform.height / 2);
      }
    });

    // Draw collectibles
    this.collectibles.forEach(item => {
      if (!item.collected) {
        this.ctx.font = `${item.width * 0.8}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(item.icon, item.x + item.width / 2, item.y + item.height / 2);
      }
    });

    // Draw hazards
    this.hazards.forEach(hazard => {
      this.ctx.font = `${hazard.width * 0.8}px serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(hazard.icon, hazard.x + hazard.width / 2, hazard.y + hazard.height / 2);
    });

    // Draw enemies
    this.enemies.forEach(enemy => {
      this.ctx.font = `${enemy.width * 0.8}px serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(enemy.icon, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    });

    // Draw goal
    if (this.goal) {
      this.ctx.font = `${this.goal.width * 0.8}px serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(this.goal.icon, this.goal.x + this.goal.width / 2, this.goal.y + this.goal.height / 2);
    }

    // Draw player
    this.ctx.save();
    this.ctx.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
    this.ctx.scale(this.player.facing, 1);
    this.ctx.font = `${this.player.width * 0.9}px serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.player.emoji, 0, 0);
    this.ctx.restore();

    this.ctx.restore();

    // Draw particles (in screen space)
    this.particles.draw();
  },

  /**
   * Update UI elements
   */
  updateUI() {
    document.getElementById('stat-coins').textContent = this.coins;
    document.getElementById('stat-stars').textContent = `${this.stars}/${this.totalStars}`;
    document.getElementById('stat-lives').textContent = '❤️'.repeat(this.lives);
  },

  /**
   * Show score popup
   */
  showScorePopup(x, y, text) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    popup.style.left = (x - this.cameraX) + 'px';
    popup.style.top = y + 'px';
    document.querySelector('.game-area')?.appendChild(popup);

    setTimeout(() => popup.remove(), 1000);
  },

  /**
   * Show encouragement message
   */
  showEncouragement() {
    const message = getRandomEncouragement('encouragement');
    App.showEncouragement(message);
  }
};
