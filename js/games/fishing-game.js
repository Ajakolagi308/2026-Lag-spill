const FishingGame = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Fishing Game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Fishing Game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default FishingGame;
