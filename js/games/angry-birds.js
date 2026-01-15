const AngryBirds = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Angry Birds game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Angry Birds game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default AngryBirds;
