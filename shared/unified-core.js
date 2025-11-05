// Simple unified brain training system - just toggle button + dat.GUI

class UnifiedBrainTraining {
  constructor() {
    this.sidebarOpen = false;
    this.init();
  }

  detectCurrentGame() {
    const path = window.location.pathname;
    if (path.includes('dichotic-dual-nback')) return 'dichotic-dual-nback';
    if (path.includes('jiggle-factorial')) return 'jiggle-factorial';
    if (path.includes('quad-box')) return 'quad-box';
    return 'jiggle-factorial'; // default
  }

  switchToGame(gameId) {
    const gameUrls = {
      'dichotic-dual-nback': 'games/dichotic-dual-nback/index.html',
      'jiggle-factorial': 'games/jiggle-factorial/index.html',
      'quad-box': 'games/quad-box/index.html'
    };
    
    if (gameUrls[gameId] && gameId !== this.detectCurrentGame()) {
      // Navigate to the selected game
      window.location.href = gameUrls[gameId];
    }
  }

  init() {
    this.createToggleButton();
    this.createSidebar();
    this.setupEventListeners();
  }

  createToggleButton() {
    // Use the same top bar system but minimal - just the button
    const topBarHTML = `
      <div class="unified-top-bar">
        <div class="unified-top-bar-left">
          <button class="unified-panel-btn" id="unified-sidebar-toggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M9 3v18"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', topBarHTML);
  }

  createSidebar() {
    // Use the same sidebar system as before
    const sidebarHTML = `
      <div class="unified-sidebar" id="unified-sidebar">
        <div id="unified-gui-container"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);
    
    // Create the actual dat.GUI
    this.createDatGUI();
  }

  createDatGUI() {
    // Wait for dat.GUI to be available
    if (typeof dat === 'undefined') {
      setTimeout(() => this.createDatGUI(), 100);
      return;
    }

    // Use the exact same settings structure as Jiggle Factorial
    this.settings = {
      level: 2,
      movementMode: 'Combination',
      verticalRotationGroups: 2,
      horizontalRotationGroups: 2,
      rotationSpeed: 0.01,
      isRandomMode: false,
      orderMode: 'Combined',
      isNonConsecutiveMode: true,
      autoProgression: true,
      showAnswers: true,
      isRegular3DMOT: false,
      numBlueDistractors: 5,
      numColoredDistractors: 5,
      ballSpeed: 0.1,
      ballOpacity: 1.0,
      boxX: 50,
      boxY: 50,
      boxZ: 50,
      screenRotation: true,
      screenRotationSpeed: 0.002,
      screenRotationDistance: 60,
      rotateX: true,
      rotateY: true,
      rotateZ: true,
      varyRotationDistance: false,
      highlightDuration: 1000,
      highlightSimultaneously: false,
      delayAfterSequence: 1000,
      numberSize: 3,
      dotSize: 5,
      blinkDot: false,
      flashMode: false,
      flashDurationMin: 160,
      flashDurationMax: 400,
      intervalDurationMin: 2000,
      intervalDurationMax: 3000,
      levelChangeByCorrect: 1,
      everyCorrectLevel: 1,
      levelChangeByIncorrect: -1,
      everyIncorrectLevel: 1,
      trialStartDelay: 2000,
      startGame: () => { if (window.startGame) window.startGame(); },
      resetApp: () => { if (window.resetApp) window.resetApp(); }
    };

    // Create dat.GUI exactly like Jiggle Factorial
    this.gui = new dat.GUI({ autoPlace: false });
    document.getElementById('unified-gui-container').appendChild(this.gui.domElement);

    // Add game selector dropdown at the top
    this.settings.currentGame = this.detectCurrentGame() || 'jiggle-factorial';
    const gameSelector = this.gui.add(this.settings, 'currentGame', {
      'Dichotic Dual N-back': 'dichotic-dual-nback',
      'Jiggle Factorial 3D': 'jiggle-factorial', 
      'Quad Box': 'quad-box'
    }).name('Training Method');
    
    gameSelector.onChange((value) => {
      this.switchToGame(value);
    });

    // Add separator/spacing
    const separator = document.createElement('div');
    separator.style.height = '10px';
    separator.style.borderBottom = '1px solid #2c2c2c';
    separator.style.margin = '10px 0';
    this.gui.domElement.appendChild(separator);

    // Add all controls exactly like Jiggle Factorial does
    this.gui.add(this.settings, 'level').name('Level');
    const movementModeController = this.gui.add(this.settings, 'movementMode', ['Non-Rotating', 'Rotating', 'Combination']).name('Movement Mode');
    
    const rotationFolder = this.gui.addFolder('Rotation Mode Settings');
    rotationFolder.add(this.settings, 'verticalRotationGroups').name('Vertical Groups');
    rotationFolder.add(this.settings, 'horizontalRotationGroups').name('Horizontal Groups');
    rotationFolder.add(this.settings, 'rotationSpeed').name('Rotation Speed');

    this.gui.add(this.settings, 'isRandomMode').name('Random Mode');
    this.gui.add(this.settings, 'orderMode', ['Ascending', 'Descending', 'Combined', 'Extended Combined']).name('Order Mode');
    this.gui.add(this.settings, 'isNonConsecutiveMode').name('Non-Consecutive Mode');
    
    const regularMOTController = this.gui.add(this.settings, 'isRegular3DMOT').name('Regular 3D MOT Mode');
    regularMOTController.__li.style.backgroundColor = '#ffa500';

    this.gui.add(this.settings, 'showAnswers').name('Show Answers');
    this.gui.add(this.settings, 'numBlueDistractors').name('# Blue Distractors');
    this.gui.add(this.settings, 'numColoredDistractors').name('# Colored Distractors');
    this.gui.add(this.settings, 'ballSpeed').name('Ball Speed');
    this.gui.add(this.settings, 'boxX').name('Box Width');
    this.gui.add(this.settings, 'boxY').name('Box Height');
    this.gui.add(this.settings, 'boxZ').name('Box Depth');
    this.gui.add(this.settings, 'ballOpacity').min(0.5).max(1.0).name('Ball Opacity');

    const screenRotationFolder = this.gui.addFolder('Screen Rotation');
    screenRotationFolder.add(this.settings, 'screenRotation').name('Enable');
    screenRotationFolder.add(this.settings, 'screenRotationSpeed').name('Speed');
    screenRotationFolder.add(this.settings, 'screenRotationDistance').name('Distance');
    screenRotationFolder.add(this.settings, 'rotateX').name('Rotate X');
    screenRotationFolder.add(this.settings, 'rotateY').name('Rotate Y');
    screenRotationFolder.add(this.settings, 'rotateZ').name('Rotate Z');
    screenRotationFolder.add(this.settings, 'varyRotationDistance').name('Vary Distance');

    this.gui.add(this.settings, 'highlightDuration').name('Highlight Duration');
    this.gui.add(this.settings, 'highlightSimultaneously').name('Highlight Together');
    this.gui.add(this.settings, 'delayAfterSequence').name('Delay After');
    this.gui.add(this.settings, 'numberSize').name('Number Size');
    this.gui.add(this.settings, 'dotSize').name('Center Dot Size').min(0);
    this.gui.add(this.settings, 'blinkDot').name('Make Dot Blink');

    const flashModeFolder = this.gui.addFolder('Flash Mode Settings');
    flashModeFolder.add(this.settings, 'flashMode').name('Enable Flash Mode');
    flashModeFolder.add(this.settings, 'flashDurationMin').name('Flash Duration Min (ms)');
    flashModeFolder.add(this.settings, 'flashDurationMax').name('Flash Duration Max (ms)');
    flashModeFolder.add(this.settings, 'intervalDurationMin').name('Interval Min (ms)');
    flashModeFolder.add(this.settings, 'intervalDurationMax').name('Interval Max (ms)');

    const autoProgressionFolder = this.gui.addFolder('Auto Progression');
    autoProgressionFolder.add(this.settings, 'autoProgression').name('Enable');
    
    const levelAdjustmentFolder = autoProgressionFolder.addFolder('Level Adjustment');
    levelAdjustmentFolder.add(this.settings, 'levelChangeByCorrect').name('Change by');
    levelAdjustmentFolder.add(this.settings, 'everyCorrectLevel').name('Every Correct').min(1).step(1);
    levelAdjustmentFolder.add(this.settings, 'levelChangeByIncorrect').name('Change by');
    levelAdjustmentFolder.add(this.settings, 'everyIncorrectLevel').name('Every Incorrect').min(1).step(1);

    this.gui.add(this.settings, 'trialStartDelay').name('Trial Start Delay (ms)');

    const resetFolder = this.gui.addFolder('Reset App');
    resetFolder.add(this.settings, 'resetApp').name('Reset to default');

    this.gui.add(this.settings, 'startGame').name('Start Game');

    // Sync with original game settings
    this.setupSync();
  }

  setupSync() {
    // Sync changes to original game settings
    this.gui.__controllers.forEach(controller => {
      controller.onChange((value) => {
        if (window.settings && window.settings.hasOwnProperty(controller.property)) {
          window.settings[controller.property] = value;
          if (window.saveSettings) window.saveSettings();
          if (window.repopulateGui) window.repopulateGui();
        }
      });
    });
  }

  setupEventListeners() {
    // Toggle sidebar using the same system as before
    document.getElementById('unified-sidebar-toggle').addEventListener('click', () => {
      this.toggleSidebar();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('unified-sidebar');
      const toggle = document.getElementById('unified-sidebar-toggle');
      
      if (this.sidebarOpen && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        this.closeSidebar();
      }
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    const sidebar = document.getElementById('unified-sidebar');
    sidebar.classList.toggle('open', this.sidebarOpen);
  }

  closeSidebar() {
    this.sidebarOpen = false;
    document.getElementById('unified-sidebar').classList.remove('open');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.unifiedBrainTraining = new UnifiedBrainTraining();
});