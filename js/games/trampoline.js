const Trampoline = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Trampoline game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Trampoline game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default Trampoline;
