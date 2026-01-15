/**
 * BARANS SPILLVERKSTED - Character Picker
 * Handles character selection and customization
 */

const CharacterPicker = {
  selectedCharacter: null,
  currentGameType: null,

  /**
   * Initialize character picker for a game type
   */
  init(gameType) {
    this.currentGameType = gameType;
    this.selectedCharacter = null;
    this.render();
    this.updateStartButton();
  },

  /**
   * Get characters available for the current game type
   */
  getAvailableCharacters() {
    // Get user achievements for unlockables
    const achievements = StorageManager.getAchievements();

    // Get characters based on game type
    let characters;

    if (this.currentGameType?.startsWith('ski')) {
      characters = [...CHARACTERS.standard, ...CHARACTERS.skiCharacters];
    } else if (this.currentGameType === 'racing') {
      characters = CHARACTERS.vehicles;
    } else if (this.currentGameType === 'spaceAdventure') {
      characters = [...CHARACTERS.spaceVehicles, ...CHARACTERS.standard.slice(0, 4)];
    } else if (this.currentGameType === 'underwater' || this.currentGameType === 'swimmingRace') {
      characters = CHARACTERS.seaCreatures;
    } else if (this.currentGameType === 'dragonFlight') {
      characters = CHARACTERS.flyingCreatures;
    } else {
      characters = [...CHARACTERS.standard, ...CHARACTERS.unlockable];
    }

    // Mark unlocked status
    return characters.map(char => {
      if (char.unlocked === true) {
        return { ...char, isUnlocked: true };
      }
      if (char.requirement) {
        return {
          ...char,
          isUnlocked: achievements.includes(char.requirement)
        };
      }
      return { ...char, isUnlocked: true };
    });
  },

  /**
   * Render the character grid
   */
  render() {
    const grid = document.getElementById('character-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const characters = this.getAvailableCharacters();

    characters.forEach(char => {
      const option = this.createCharacterOption(char);
      grid.appendChild(option);
    });

    // Reset preview
    const selectedSection = document.getElementById('selected-character');
    if (selectedSection) {
      selectedSection.hidden = true;
    }

    // Clear name input
    const nameInput = document.getElementById('character-name');
    if (nameInput) {
      nameInput.value = '';
    }
  },

  /**
   * Create a character option element
   */
  createCharacterOption(character) {
    const option = document.createElement('div');
    option.className = 'character-option';
    option.dataset.characterId = character.id;

    if (!character.isUnlocked) {
      option.classList.add('locked');
    }

    option.innerHTML = `
      <span class="char-icon">${character.emoji}</span>
      <span class="char-name">${character.name}</span>
    `;

    option.addEventListener('click', () => {
      if (character.isUnlocked) {
        this.selectCharacter(character);
      } else {
        this.showLockedMessage(character);
      }
    });

    return option;
  },

  /**
   * Select a character
   */
  selectCharacter(character) {
    this.selectedCharacter = {
      type: 'preset',
      presetId: character.id,
      emoji: character.emoji,
      name: character.name,
      image: null
    };

    // Update visual selection
    document.querySelectorAll('.character-option').forEach(opt => {
      opt.classList.remove('selected');
      if (opt.dataset.characterId === character.id) {
        opt.classList.add('selected');
      }
    });

    // Show preview
    const selectedSection = document.getElementById('selected-character');
    if (selectedSection) {
      selectedSection.hidden = false;
    }

    const preview = document.querySelector('.character-preview');
    if (preview) {
      preview.innerHTML = `<span style="font-size: 60px;">${character.emoji}</span>`;
    }

    // Set default name
    const nameInput = document.getElementById('character-name');
    if (nameInput && !nameInput.value) {
      nameInput.value = character.name;
    }

    // Update App's selected character
    App.selectedCharacter = this.selectedCharacter;

    this.updateStartButton();
    SoundManager.play('select');
  },

  /**
   * Show message for locked character
   */
  showLockedMessage(character) {
    SoundManager.play('error');
    App.showEncouragement(`${character.requirementDesc || 'Lås opp denne karakteren!'} 🔒`);
  },

  /**
   * Update the start button state
   */
  updateStartButton() {
    const btn = document.getElementById('btn-start-building');
    if (btn) {
      btn.disabled = !this.selectedCharacter && !App.selectedCharacter;
    }
  },

  /**
   * Get the currently selected character
   */
  getSelectedCharacter() {
    return App.selectedCharacter || this.selectedCharacter;
  }
};
