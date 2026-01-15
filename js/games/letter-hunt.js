const LetterHunt = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Letter Hunt game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Letter Hunt game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default LetterHunt;
