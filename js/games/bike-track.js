const BikeTrack = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('Bike Track game initialized');
  },
  
  start() {
    this.running = true;
    console.log('Bike Track game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default BikeTrack;
