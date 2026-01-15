const MarbleRun = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Marble Run game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Marble Run game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default MarbleRun;
