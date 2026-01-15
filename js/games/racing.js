const Racing = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Racing game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Racing game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default Racing;
