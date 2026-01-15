/**
 * BARANS SPILLVERKSTED - Sound Manager
 * Handles all audio playback with volume control
 */

const SoundManager = {
  // Audio context
  context: null,
  masterGain: null,

  // Volume settings
  musicVolume: 0.7,
  sfxVolume: 1.0,

  // Audio buffers cache
  buffers: {},

  // Currently playing
  currentMusic: null,
  activeSounds: [],

  // Sound definitions
  sounds: {
    // UI Sounds
    tap: { frequency: 800, duration: 0.05, type: 'sine' },
    select: { frequency: 600, duration: 0.1, type: 'sine' },
    back: { frequency: 400, duration: 0.1, type: 'sine' },
    error: { frequency: 200, duration: 0.2, type: 'sawtooth' },
    success: { frequency: [523, 659, 784], duration: 0.3, type: 'sine' },

    // Game Sounds
    coin: { frequency: [987, 1319], duration: 0.15, type: 'sine' },
    star: { frequency: [784, 987, 1175], duration: 0.2, type: 'sine' },
    jump: { frequency: 300, duration: 0.15, type: 'square', slide: 600 },
    land: { frequency: 150, duration: 0.1, type: 'sine' },
    bounce: { frequency: [400, 600], duration: 0.2, type: 'sine' },
    hit: { frequency: 100, duration: 0.15, type: 'sawtooth' },
    crash: { duration: 0.3, noise: true },
    explosion: { duration: 0.5, noise: true, decay: true },

    // Win/Lose
    win: { frequency: [523, 659, 784, 1047], duration: 0.5, type: 'sine' },
    lose: { frequency: [400, 350, 300, 250], duration: 0.6, type: 'sawtooth' },

    // Ski Sounds
    swoosh: { duration: 0.2, noise: true, filter: 'highpass' },
    gate: { frequency: [600, 800], duration: 0.1, type: 'sine' },
    landing: { frequency: 200, duration: 0.2, type: 'sine' },

    // Achievement
    achievement: { frequency: [523, 659, 784, 1047, 1319], duration: 0.6, type: 'sine' },

    // Bell (for marble run)
    bell: { frequency: 1200, duration: 0.5, type: 'sine', decay: true }
  },

  /**
   * Initialize the sound manager
   */
  init() {
    // Create audio context on first user interaction
    const initContext = () => {
      if (!this.context) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
      }
      // Remove listener after first use
      document.removeEventListener('click', initContext);
      document.removeEventListener('touchstart', initContext);
    };

    document.addEventListener('click', initContext);
    document.addEventListener('touchstart', initContext);

    // Load settings from storage
    const settings = StorageManager?.getSettings() || {};
    this.musicVolume = settings.musicVolume ?? 0.7;
    this.sfxVolume = settings.sfxVolume ?? 1.0;

    return this;
  },

  /**
   * Resume audio context (needed for iOS)
   */
  resume() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  },

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.gain.gain.value = this.musicVolume;
    }
  },

  /**
   * Set SFX volume (0-1)
   */
  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  },

  /**
   * Play a predefined sound effect
   */
  play(soundName) {
    if (!this.context || this.sfxVolume === 0) return;

    this.resume();

    const sound = this.sounds[soundName];
    if (!sound) {
      console.warn(`Sound not found: ${soundName}`);
      return;
    }

    if (sound.noise) {
      this.playNoise(sound);
    } else if (Array.isArray(sound.frequency)) {
      this.playChord(sound);
    } else {
      this.playTone(sound);
    }
  },

  /**
   * Play a single tone
   */
  playTone(sound) {
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = sound.type || 'sine';
    oscillator.frequency.value = sound.frequency;

    // Frequency slide if specified
    if (sound.slide) {
      oscillator.frequency.linearRampToValueAtTime(
        sound.slide,
        this.context.currentTime + sound.duration
      );
    }

    gainNode.gain.value = this.sfxVolume * 0.3;

    // Decay envelope
    if (sound.decay) {
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.context.currentTime + sound.duration
      );
    } else {
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + sound.duration);
    }

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start();
    oscillator.stop(this.context.currentTime + sound.duration);
  },

  /**
   * Play multiple tones (chord/arpeggio)
   */
  playChord(sound) {
    const frequencies = sound.frequency;
    const delay = sound.duration / frequencies.length;

    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone({
          frequency: freq,
          duration: sound.duration - (i * delay),
          type: sound.type,
          decay: sound.decay
        });
      }, i * delay * 1000);
    });
  },

  /**
   * Play noise (for crash, swoosh, etc.)
   */
  playNoise(sound) {
    const bufferSize = this.context.sampleRate * sound.duration;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;

    const gainNode = this.context.createGain();
    gainNode.gain.value = this.sfxVolume * 0.2;

    if (sound.decay) {
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.context.currentTime + sound.duration
      );
    }

    // Apply filter if specified
    if (sound.filter) {
      const filter = this.context.createBiquadFilter();
      filter.type = sound.filter;
      filter.frequency.value = 2000;

      noise.connect(filter);
      filter.connect(gainNode);
    } else {
      noise.connect(gainNode);
    }

    gainNode.connect(this.masterGain);

    noise.start();
    noise.stop(this.context.currentTime + sound.duration);
  },

  /**
   * Play background music (simple generated loop)
   */
  playMusic(type = 'default') {
    if (!this.context || this.musicVolume === 0) return;

    this.stopMusic();
    this.resume();

    // Simple music patterns
    const patterns = {
      default: {
        notes: [262, 294, 330, 349, 392, 349, 330, 294],
        duration: 0.5,
        tempo: 120
      },
      ski: {
        notes: [392, 440, 494, 523, 494, 440, 392, 330],
        duration: 0.4,
        tempo: 140
      },
      space: {
        notes: [196, 220, 262, 294, 262, 220, 196, 165],
        duration: 0.8,
        tempo: 80
      },
      adventure: {
        notes: [330, 392, 494, 523, 494, 392, 330, 262],
        duration: 0.4,
        tempo: 130
      }
    };

    const pattern = patterns[type] || patterns.default;
    let noteIndex = 0;

    const gainNode = this.context.createGain();
    gainNode.gain.value = this.musicVolume * 0.15;
    gainNode.connect(this.masterGain);

    const playNote = () => {
      if (!this.currentMusic) return;

      const oscillator = this.context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = pattern.notes[noteIndex];

      const noteGain = this.context.createGain();
      noteGain.gain.value = 1;
      noteGain.gain.linearRampToValueAtTime(0, this.context.currentTime + pattern.duration * 0.9);

      oscillator.connect(noteGain);
      noteGain.connect(gainNode);

      oscillator.start();
      oscillator.stop(this.context.currentTime + pattern.duration);

      noteIndex = (noteIndex + 1) % pattern.notes.length;
    };

    // Start music loop
    const interval = (60 / pattern.tempo) * 1000;
    this.currentMusic = {
      gain: gainNode,
      interval: setInterval(playNote, interval)
    };

    playNote(); // Play first note immediately
  },

  /**
   * Stop background music
   */
  stopMusic() {
    if (this.currentMusic) {
      clearInterval(this.currentMusic.interval);
      this.currentMusic.gain.disconnect();
      this.currentMusic = null;
    }
  },

  /**
   * Play a musical note by name (for music maker)
   */
  playNote(noteName, instrument = 'piano') {
    if (!this.context) return;

    this.resume();

    const noteFrequencies = {
      'C': 262, 'D': 294, 'E': 330, 'F': 349,
      'G': 392, 'A': 440, 'B': 494, 'C2': 523
    };

    const freq = noteFrequencies[noteName];
    if (!freq) return;

    const instrumentTypes = {
      piano: 'sine',
      guitar: 'triangle',
      trumpet: 'sawtooth',
      bell: 'sine'
    };

    this.playTone({
      frequency: freq,
      duration: 0.5,
      type: instrumentTypes[instrument] || 'sine',
      decay: true
    });
  },

  /**
   * Play drum sound
   */
  playDrum(type = 'kick') {
    if (!this.context) return;

    this.resume();

    switch (type) {
      case 'kick':
        this.playTone({ frequency: 150, duration: 0.2, type: 'sine', slide: 50 });
        break;
      case 'snare':
        this.playNoise({ duration: 0.15 });
        break;
      case 'hihat':
        this.playNoise({ duration: 0.05, filter: 'highpass' });
        break;
    }
  },

  /**
   * Preload sounds (optional - currently using generated sounds)
   */
  preload(soundUrls) {
    // Could be implemented for loaded audio files
    // For now, we use generated sounds which don't need preloading
  },

  /**
   * Stop all sounds
   */
  stopAll() {
    this.stopMusic();
    // Stop any other active sounds if tracking them
  }
};

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SoundManager.init());
  } else {
    SoundManager.init();
  }
}
