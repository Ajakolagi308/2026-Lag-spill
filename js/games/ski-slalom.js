/**
 * BARANS SPILLVERKSTED - Ski Slalom Game
 * Slalom skiing game - navigate through gates!
 */

const SkiSlalomGame = {
  // Game state
  running: false,
  paused: false,
  gameData: null,

  // Canvas
  canvas: null,
  ctx: null,

  // Player
  player: {
    x: 0,
    y: 0,
    width: 40,
    height: 50,
    vx: 0,
    angle: 0,
    speed: 0,
    maxSpeed: 12,
    emoji: '⛷️'
  },

  // Course
  gates: [],
  obstacles: [],
  powerups: [],
  courseLength: 2400,

  // Stats
  gatesCorrect: 0,
  gatesWrong: 0,
  totalGates: 0,
  startTime: 0,
  bonusTime: 0,

  // Camera
  cameraY: 0,

  // Controls
  tiltControl: false,
  tiltAngle: 0,

  // Animation
  animationFrame: null,
  lastTime: 0,

  // Particles
  particles: null,

  /**
   * Initialize the game
   */
  init(gameData) {
    this.gameData = gameData;
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.particles = new ParticleSystem(this.canvas);

    this.loadCourse(gameData);
    this.setupControls();
    this.updateUI();

    console.log('Ski Slalom game initialized');
  },

  /**
   * Resize canvas
   */
  resizeCanvas() {
    const container = this.canvas.parentElement;
    if (container) {
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;
    }
  },

  /**
   * Load course from game data
   */
  loadCourse(gameData) {
    this.gates = [];
    this.obstacles = [];
    this.powerups = [];

    // Get course length from canvas
    this.courseLength = gameData.canvas?.height || 2400;

    // Start position
    this.player.x = gameData.canvas?.width / 2 || 300;
    this.player.y = 50;
    this.player.speed = 0;
    this.player.vx = 0;
    this.player.angle = 0;

    // Process objects
    if (gameData.objects) {
      gameData.objects.forEach(obj => {
        const blockData = obj.blockData || obj.properties || {};

        if (blockData.category === 'gate') {
          this.gates.push({
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            direction: blockData.direction,
            icon: blockData.icon,
            passed: false,
            correct: false
          });
        } else if (blockData.solid || blockData.category === 'obstacle') {
          this.obstacles.push({
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            icon: blockData.icon,
            slowdown: blockData.slowdown
          });
        } else if (blockData.category === 'powerup') {
          this.powerups.push({
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            icon: blockData.icon,
            extraTime: blockData.extraTime,
            boost: blockData.boost,
            collected: false
          });
        }
      });
    }

    // Sort gates by Y position
    this.gates.sort((a, b) => a.y - b.y);

    this.totalGates = this.gates.length;
    this.gatesCorrect = 0;
    this.gatesWrong = 0;
    this.bonusTime = 0;
    this.cameraY = 0;
  },

  /**
   * Setup controls
   */
  setupControls() {
    const controlsContainer = document.getElementById('game-controls');
    if (!controlsContainer) return;

    // Check if device supports motion
    this.tiltControl = window.DeviceOrientationEvent && 'ontouchstart' in window;

    if (this.tiltControl) {
      controlsContainer.innerHTML = `
        <div class="ski-controls">
          <div class="tilt-indicator">
            <span class="tilt-label">◀️</span>
            <div class="tilt-bar">
              <div class="tilt-marker" id="tilt-marker"></div>
            </div>
            <span class="tilt-label">▶️</span>
          </div>
          <p style="text-align: center; color: white; margin-top: 10px;">Vipp iPad-en for å svinge!</p>
        </div>
      `;

      // Request permission for iOS
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', (e) => this.handleTilt(e));
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', (e) => this.handleTilt(e));
      }
    } else {
      // Touch/keyboard controls
      controlsContainer.innerHTML = `
        <div class="ski-controls">
          <div class="ski-touch-buttons">
            <button class="btn btn-ski-left" id="btn-ski-left">◀️ Venstre</button>
            <button class="btn btn-ski-right" id="btn-ski-right">Høyre ▶️</button>
          </div>
        </div>
      `;

      const leftBtn = document.getElementById('btn-ski-left');
      const rightBtn = document.getElementById('btn-ski-right');

      new GameButton(leftBtn, {
        onPress: () => { this.tiltAngle = -30; },
        onRelease: () => { this.tiltAngle = 0; }
      });

      new GameButton(rightBtn, {
        onPress: () => { this.tiltAngle = 30; },
        onRelease: () => { this.tiltAngle = 0; }
      });
    }

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.tiltAngle = -30;
      if (e.key === 'ArrowRight') this.tiltAngle = 30;
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') this.tiltAngle = 0;
    });
  },

  /**
   * Handle device tilt
   */
  handleTilt(event) {
    if (this.paused) return;

    // gamma is left/right tilt (-90 to 90)
    this.tiltAngle = event.gamma || 0;

    // Update tilt marker
    const marker = document.getElementById('tilt-marker');
    if (marker) {
      const percent = 50 + (this.tiltAngle / 45) * 50;
      marker.style.left = Math.max(0, Math.min(100, percent)) + '%';
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

    SoundManager.playMusic('ski');

    this.gameLoop();
  },

  /**
   * Pause
   */
  pause() {
    this.paused = true;
    SoundManager.stopMusic();
  },

  /**
   * Resume
   */
  resume() {
    this.paused = false;
    this.lastTime = performance.now();
    SoundManager.playMusic('ski');
    this.gameLoop();
  },

  /**
   * Restart
   */
  restart() {
    this.loadCourse(this.gameData);
    this.start();
  },

  /**
   * Stop
   */
  stop() {
    this.running = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    SoundManager.stopMusic();
  },

  /**
   * Game loop
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
    // Accelerate down the slope
    this.player.speed = Math.min(this.player.maxSpeed, this.player.speed + 0.1);

    // Apply steering
    const steerForce = this.tiltAngle / 90 * 8;
    this.player.vx += steerForce * 0.1;
    this.player.vx *= 0.95; // Friction

    // Update position
    this.player.x += this.player.vx;
    this.player.y += this.player.speed;

    // Keep within bounds
    const courseWidth = this.gameData.canvas?.width || 600;
    this.player.x = Math.max(30, Math.min(courseWidth - 30, this.player.x));

    // Update angle based on velocity
    this.player.angle = this.player.vx * 2 * Math.PI / 180;

    // Update camera
    this.cameraY = this.player.y - this.canvas.height * 0.3;
    this.cameraY = Math.max(0, this.cameraY);

    // Check gates
    this.checkGates();

    // Check obstacles
    this.checkObstacles();

    // Check powerups
    this.checkPowerups();

    // Create snow particles
    if (Math.random() < 0.3) {
      this.particles.sparkleTrail(this.player.x, this.player.y + this.player.height);
    }

    // Update particles
    this.particles.update();

    // Check if finished
    if (this.player.y >= this.courseLength - 100) {
      this.finish();
    }
  },

  /**
   * Check gate passage
   */
  checkGates() {
    this.gates.forEach(gate => {
      if (gate.passed) return;

      // Check if player passed the gate line
      if (this.player.y > gate.y && this.player.y < gate.y + gate.height + this.player.speed) {
        gate.passed = true;

        // Check if on correct side
        const gateCenter = gate.x + gate.width / 2;
        const playerCenter = this.player.x;

        if (gate.direction === 'left' && playerCenter < gateCenter) {
          gate.correct = true;
          this.gatesCorrect++;
          SoundManager.play('gate');
          this.showMessage('Flott sving! ⛷️');
        } else if (gate.direction === 'right' && playerCenter > gateCenter) {
          gate.correct = true;
          this.gatesCorrect++;
          SoundManager.play('gate');
          this.showMessage('Perfekt! ⭐');
        } else {
          gate.correct = false;
          this.gatesWrong++;
          SoundManager.play('error');
          this.showMessage('Feil side! 😅');
        }

        this.updateUI();
      }
    });
  },

  /**
   * Check obstacle collision
   */
  checkObstacles() {
    this.obstacles.forEach(obs => {
      if (this.checkOverlap(this.player, obs)) {
        if (obs.slowdown) {
          this.player.speed *= 0.8;
        } else {
          // Crash!
          this.crash();
        }
      }
    });
  },

  /**
   * Check powerup collection
   */
  checkPowerups() {
    this.powerups.forEach(pu => {
      if (pu.collected) return;

      if (this.checkOverlap(this.player, pu)) {
        pu.collected = true;
        SoundManager.play('star');
        this.particles.starCollect(pu.x + pu.width / 2, pu.y + pu.height / 2 - this.cameraY);

        if (pu.extraTime) {
          this.bonusTime += pu.extraTime;
          this.showMessage(`+${pu.extraTime}s ⏱️`);
        }

        if (pu.boost) {
          this.player.speed = this.player.maxSpeed;
          this.showMessage('BOOST! 💨');
        }
      }
    });
  },

  /**
   * Check overlap
   */
  checkOverlap(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  },

  /**
   * Handle crash
   */
  crash() {
    SoundManager.play('crash');
    this.particles.dustCloud(this.player.x, this.player.y - this.cameraY);
    this.player.speed = 0;

    // Brief pause then continue
    setTimeout(() => {
      this.player.speed = 3;
    }, 500);
  },

  /**
   * Finish the course
   */
  finish() {
    this.running = false;
    SoundManager.stopMusic();

    const totalTime = (Date.now() - this.startTime) / 1000 - this.bonusTime;

    // Check for achievements
    StorageManager.unlockAchievement('first_slalom');
    if (this.gatesWrong === 0 && this.gatesCorrect > 0) {
      StorageManager.unlockAchievement('perfect_run');
    }

    // Track ski games played
    StorageManager.addGameTypePlayed('skiSlalom');

    App.showWinScreen({
      coins: this.gatesCorrect * 10,
      stars: this.gatesCorrect,
      time: totalTime
    });
  },

  /**
   * Render
   */
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw snow background
    this.ctx.fillStyle = '#F0F8FF';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw course edges
    this.ctx.strokeStyle = '#E0E8F0';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([10, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(20, 0);
    this.ctx.lineTo(20, this.canvas.height);
    this.ctx.moveTo(this.canvas.width - 20, 0);
    this.ctx.lineTo(this.canvas.width - 20, this.canvas.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Save and transform for camera
    this.ctx.save();
    this.ctx.translate(0, -this.cameraY);

    // Draw gates
    this.gates.forEach(gate => {
      const color = gate.direction === 'left' ? '#3742FA' : '#FF4757';
      this.ctx.fillStyle = gate.passed ? (gate.correct ? '#6BFFB8' : '#FF6B6B') : color;

      // Draw gate poles
      this.ctx.fillRect(gate.x, gate.y, 8, gate.height);
      this.ctx.fillRect(gate.x + gate.width - 8, gate.y, 8, gate.height);

      // Draw gate flag
      this.ctx.font = '24px serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(gate.icon, gate.x + gate.width / 2, gate.y - 10);
    });

    // Draw obstacles
    this.obstacles.forEach(obs => {
      this.ctx.font = `${obs.width * 0.8}px serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(obs.icon, obs.x + obs.width / 2, obs.y + obs.height / 2);
    });

    // Draw powerups
    this.powerups.forEach(pu => {
      if (!pu.collected) {
        this.ctx.font = `${pu.width * 0.8}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(pu.icon, pu.x + pu.width / 2, pu.y + pu.height / 2);
      }
    });

    // Draw finish line
    const finishY = this.courseLength - 50;
    this.ctx.fillStyle = '#333';
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) {
        this.ctx.fillRect(i * 30, finishY, 30, 30);
        this.ctx.fillRect(i * 30 + 30, finishY + 30, 30, 30);
      }
    }

    // Draw player
    this.ctx.save();
    this.ctx.translate(this.player.x, this.player.y);
    this.ctx.rotate(this.player.angle);
    this.ctx.font = `${this.player.width}px serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.player.emoji, 0, 0);
    this.ctx.restore();

    this.ctx.restore();

    // Draw particles in screen space
    this.particles.draw();

    // Draw speed indicator
    this.drawSpeedIndicator();
  },

  /**
   * Draw speed indicator
   */
  drawSpeedIndicator() {
    const speedPercent = this.player.speed / this.player.maxSpeed;
    const barWidth = 100;
    const barHeight = 10;
    const x = this.canvas.width - barWidth - 20;
    const y = 20;

    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(x, y, barWidth, barHeight);

    this.ctx.fillStyle = speedPercent > 0.8 ? '#FF4757' : '#6BFFB8';
    this.ctx.fillRect(x, y, barWidth * speedPercent, barHeight);

    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, barWidth, barHeight);
  },

  /**
   * Update UI
   */
  updateUI() {
    document.getElementById('stat-coins').textContent = this.gatesCorrect * 10;
    document.getElementById('stat-stars').textContent = `${this.gatesCorrect}/${this.totalGates}`;

    const timeEl = document.getElementById('stat-lives');
    if (timeEl) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      timeEl.textContent = `⏱️ ${elapsed.toFixed(1)}s`;
    }
  },

  /**
   * Show message
   */
  showMessage(text) {
    App.showEncouragement(text);
  }
};
