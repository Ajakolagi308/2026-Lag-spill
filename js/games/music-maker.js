const MusicMaker = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Music Maker game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Music Maker game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default MusicMaker;
