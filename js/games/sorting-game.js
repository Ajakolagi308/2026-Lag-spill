const SortingGame = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Sorting Game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Sorting Game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default SortingGame;
