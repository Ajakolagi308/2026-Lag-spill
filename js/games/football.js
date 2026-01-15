const Football = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Football game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Football game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default Football;
