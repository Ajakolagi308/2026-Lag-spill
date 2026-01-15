const DragonFlight = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Dragon Flight game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Dragon Flight game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default DragonFlight;
