const PaintCreate = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Paint Create game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Paint Create game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default PaintCreate;
