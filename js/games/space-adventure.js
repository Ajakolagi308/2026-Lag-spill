const SpaceAdventure = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Space Adventure game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Space Adventure game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default SpaceAdventure;
