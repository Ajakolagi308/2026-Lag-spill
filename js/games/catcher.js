const Catcher = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Catcher game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Catcher game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default Catcher;
