const CityBuilder = {
  running: false,
  paused: false,
  
  init(gameData) {
    console.log('City Builder game initialized');
  },
  
  start() {
    this.running = true;
    console.log('City Builder game started - coming soon!');
  },
  
  pause() { this.paused = true; },
  resume() { this.paused = false; },
  restart() { this.start(); },
  stop() { this.running = false; }
};

export default CityBuilder;
