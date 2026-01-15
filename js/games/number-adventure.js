const NumberAdventure = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Number Adventure game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Number Adventure game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default NumberAdventure;
