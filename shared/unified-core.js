// Simple unified brain training system - just toggle button + dat.GUI

class UnifiedBrainTraining {
  constructor() {
    this.sidebarOpen = false;
    this.currentGameId = null;
    this.reactiveSettings = null;
    this.settingsListeners = new Map();
    this.init();
  }

  // Simple Reactive Settings System (Tasks 1, 2, 3 integrated)
  createReactiveSettings(gameId) {
    const defaultSettings = this.getGameSpecificSettings(gameId);
    
    // Load saved settings from localStorage
    const savedSettings = this.loadSettingsFromStorage(gameId);
    const gameSettings = { ...defaultSettings, ...savedSettings };
    
    console.log(`🔄 [REACTIVE] Creating settings for ${gameId}:`, gameSettings);
    
    // Add game loading functions to the target object BEFORE creating proxy
    gameSettings.loadJiggleFactorial = () => {
      this.loadGameWithStatus('jiggle-factorial');
    };
    gameSettings.loadHyperNBack = () => {
      this.loadGameWithStatus('3d-hyper-nback');
    };
    gameSettings.loadDichoticDualNBack = () => {
      this.loadGameWithStatus('dichotic-dual-nback');
    };
    gameSettings.loadQuadBox = () => {
      this.loadGameWithStatus('quad-box');
    };
    
    // Create a simple reactive proxy
    this.reactiveSettings = new Proxy(gameSettings, {
      set: (target, prop, value) => {
        // Functions: store but don't sync to game
        if (typeof value === 'function') {
          target[prop] = value;
          return true;
        }
        
        // SAFETY: Don't overwrite functions with undefined
        if (typeof target[prop] === 'function' && value === undefined) {
          console.warn(`⚠️ [SAFETY] Blocked undefined from overwriting function: ${prop}`);
          return true;
        }
        
        // Settings: store AND sync to game
        const oldValue = target[prop];
        target[prop] = value;
        
        // Notify listeners for setting changes
        if (this.settingsListeners.has(prop)) {
          this.settingsListeners.get(prop).forEach(callback => {
            try {
              callback(value, oldValue);
            } catch (error) {
              console.error('Settings listener error:', error);
            }
          });
        }
        
        // Send to game immediately
        if (oldValue !== value && this.currentGameId) {
          this.sendSettingToGame(prop, value);
          
          // Save settings to localStorage when they change
          this.saveSettingsToStorage(this.currentGameId, target);
        }
        
        console.log(`[ReactiveSettings] ${prop}: ${oldValue} → ${value}`);
        return true;
      },
      
      get: (target, prop) => {
        return target[prop];
      },
      
      has: (target, prop) => {
        return prop in target;
      },
      
      ownKeys: (target) => {
        return Object.keys(target);
      },
      
      getOwnPropertyDescriptor: (target, prop) => {
        return Object.getOwnPropertyDescriptor(target, prop);
      }
    });
    
    return this.reactiveSettings;
  }
  
  // Add onChange listener for settings
  onSettingChange(property, callback) {
    if (!this.settingsListeners.has(property)) {
      this.settingsListeners.set(property, []);
    }
    this.settingsListeners.get(property).push(callback);
  }
  
  // Load settings from localStorage
  loadSettingsFromStorage(gameId) {
    try {
      const key = `unified-brain-training-${gameId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log(`💾 [STORAGE] Loaded saved settings for ${gameId}:`, parsed);
        return parsed;
      }
    } catch (error) {
      console.warn(`💾 [STORAGE] Failed to load settings for ${gameId}:`, error);
    }
    return {};
  }
  
  // Save settings to localStorage
  saveSettingsToStorage(gameId, settings) {
    try {
      const key = `unified-brain-training-${gameId}`;
      // Filter out functions before saving
      const settingsToSave = {};
      Object.keys(settings).forEach(prop => {
        if (typeof settings[prop] !== 'function') {
          settingsToSave[prop] = settings[prop];
        }
      });
      localStorage.setItem(key, JSON.stringify(settingsToSave));
      console.log(`💾 [STORAGE] Saved settings for ${gameId}:`, settingsToSave);
    } catch (error) {
      console.warn(`💾 [STORAGE] Failed to save settings for ${gameId}:`, error);
    }
  }
  
  // Send individual setting to game with visual feedback (Task 4)
  sendSettingToGame(property, value) {
    if (!this.currentGameId) return;
    
    // Skip function properties - they can't be cloned in postMessage
    if (typeof value === 'function') {
      return;
    }
    
    const iframe = document.getElementById(`game-iframe-${this.currentGameId}`);
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'settingsUpdate',
        gameId: this.currentGameId,
        settings: { [property]: value }
      }, '*');
      
      // Visual feedback - console logging with distinctive prefix (Requirement 3.2)
      console.log(`🔄 [REACTIVE-SYNC] ${property} = ${value} → ${this.currentGameId}`);
      
      // Show visual indicator (Requirement 3.1)
      this.showSettingChangeIndicator(property, value);
    }
  }
  
  // Visual feedback for setting changes (Task 4 - Requirement 3.1)
  showSettingChangeIndicator(property, value) {
    // Create or update visual indicator
    let indicator = document.getElementById('setting-change-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'setting-change-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 50px;
        left: 60px;
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-family: Arial, sans-serif;
        z-index: 1001;
        transition: opacity 0.3s;
        pointer-events: none;
      `;
      document.body.appendChild(indicator);
    }
    
    indicator.textContent = `${property}: ${value}`;
    indicator.style.opacity = '1';
    
    // Auto-hide after 2 seconds
    clearTimeout(this.indicatorTimeout);
    this.indicatorTimeout = setTimeout(() => {
      indicator.style.opacity = '0';
    }, 2000);
  }
  
  // Test reactive functionality (Task 4 - Requirements 6.1, 6.2)
  testReactiveSettings() {
    console.log('🧪 [REACTIVE-TEST] Testing reactive settings functionality...');
    
    if (!this.reactiveSettings) {
      console.warn('🧪 [REACTIVE-TEST] No reactive settings available');
      return;
    }
    
    // Test with ball speed if available
    if ('ballSpeed' in this.reactiveSettings) {
      const originalValue = this.reactiveSettings.ballSpeed;
      const testValue = originalValue === 0.5 ? 1.0 : 0.5;
      
      console.log(`🧪 [REACTIVE-TEST] Changing ballSpeed: ${originalValue} → ${testValue}`);
      this.reactiveSettings.ballSpeed = testValue;
      
      // Restore after 2 seconds
      setTimeout(() => {
        this.reactiveSettings.ballSpeed = originalValue;
        console.log(`🧪 [REACTIVE-TEST] Restored ballSpeed to: ${originalValue}`);
      }, 2000);
    } else {
      console.log('🧪 [REACTIVE-TEST] No ballSpeed setting available for testing');
    }
  }
  
  // Force sync all current settings to game
  syncAllCurrentSettingsToGame() {
    if (!this.currentGameId) {
      console.warn('🔄 [SYNC] No game loaded for settings sync');
      return;
    }
    
    if (!this.reactiveSettings) {
      console.warn('🔄 [SYNC] No reactive settings available');
      return;
    }
    
    // Get all current settings (excluding functions)
    const currentSettings = {};
    Object.keys(this.reactiveSettings).forEach(key => {
      if (typeof this.reactiveSettings[key] !== 'function') {
        currentSettings[key] = this.reactiveSettings[key];
      }
    });
    
    const iframe = document.getElementById(`game-iframe-${this.currentGameId}`);
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'settingsUpdate',
        gameId: this.currentGameId,
        settings: currentSettings
      }, '*');
      
      console.log(`🔄 [SYNC] Sent ${Object.keys(currentSettings).length} current settings to ${this.currentGameId}:`, currentSettings);
      return currentSettings;
    }
    
    return null;
  }
  
  // Test settings sync with game (Task 4 - Requirements 6.1, 6.2)
  testSettingsSync() {
    console.log('🧪 [REACTIVE-TEST] Testing settings sync with game...');
    
    const syncedSettings = this.syncAllCurrentSettingsToGame();
    if (syncedSettings) {
      this.showSettingChangeIndicator('Sync Test', `${Object.keys(syncedSettings).length} settings`);
    }
  }

  // Test direct connection to game
  testDirectConnection() {
    console.log('🧪 Testing direct connection to game...');
    
    if (!this.currentGameId) {
      console.warn('No game loaded');
      return;
    }
    
    // Send test settings
    this.sendSettingToGame('level', 5);
    this.sendSettingToGame('ballSpeed', 0.3);
    
    console.log('Test settings sent to game');
  }
  
  // Apply current settings and start game (like Start Game button in sidebar)
  setCurrentSettings() {
    if (!this.currentGameId) {
      console.warn('⚙️ [SET-SETTINGS] No game loaded');
      return;
    }
    
    console.log(`⚙️ [SET-SETTINGS] Applying current settings and starting ${this.currentGameId}`);
    
    // First, sync all current settings to the game
    const syncedSettings = this.syncAllCurrentSettingsToGame();
    
    if (syncedSettings) {
      // Then call the game's startGame function (like the Start Game button does)
      const iframe = document.getElementById(`game-iframe-${this.currentGameId}`);
      if (iframe && iframe.contentWindow) {
        // Send a special message to call startGame
        iframe.contentWindow.postMessage({
          type: 'startGame',
          gameId: this.currentGameId
        }, '*');
        
        this.showSettingChangeIndicator('Starting Game', `${Object.keys(syncedSettings).length} settings applied`);
        console.log(`⚙️ [SET-SETTINGS] Called startGame() with ${Object.keys(syncedSettings).length} settings`);
      }
    } else {
      this.showSettingChangeIndicator('Settings Failed', 'No game found');
      console.warn('⚙️ [SET-SETTINGS] Failed to apply settings');
    }
  }

  // Show keybinds popup
  showKeybinds() {
    console.log('🎮 [KEYBINDS] Showing keybinds popup');
    
    // Get current hotkeys from settings or use defaults
    const currentHotkeys = this.reactiveSettings?.hotkeys || {
      'position': 'A',
      'color': 'F', 
      'shape': 'J',
      'audio': 'L'
    };
    
    const keybindsHTML = `
      <div id="keybinds-popup" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
           background: #1a1a1a; border: 1px solid #444; border-radius: 4px; padding: 0; z-index: 10000; 
           color: #fff; font-family: 'Lucida Grande', sans-serif; width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.8);
           font-size: 11px;">
        <div style="background: #2a2a2a; padding: 8px 12px; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #ddd; font-weight: bold;">Customize Keybindings</span>
          <button id="close-keybinds" style="background: none; border: none; color: #999; cursor: pointer; font-size: 14px; padding: 2px 6px;">✕</button>
        </div>
        <div style="padding: 12px;">
          <div style="margin-bottom: 12px;">
            <div style="color: #aaa; font-size: 10px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">N-Back Controls</div>
            ${Object.entries(currentHotkeys).map(([action, key]) => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 4px 0;">
                <span style="color: #ddd; text-transform: capitalize;">${action}:</span>
                <button class="keybind-edit-btn" data-action="${action}" 
                        style="background: #333; border: 1px solid #555; color: #fff; padding: 4px 12px; 
                               border-radius: 2px; cursor: pointer; min-width: 40px; font-family: monospace;">
                  ${key}
                </button>
              </div>
            `).join('')}
          </div>
          
          <div style="border-top: 1px solid #333; padding-top: 12px; margin-top: 12px;">
            <div style="color: #aaa; font-size: 10px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Game Controls</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; color: #bbb;">
              <div><span style="color: #fff;">Space:</span> Start Game</div>
              <div><span style="color: #fff;">Esc:</span> End Game</div>
              <div><span style="color: #fff;">PgDown:</span> Next Mode</div>
              <div><span style="color: #fff;">PgUp:</span> Previous Mode</div>
            </div>
          </div>
          
          <div style="margin-top: 16px; text-align: center;">
            <button id="reset-keybinds" style="background: #444; border: 1px solid #666; color: #fff; 
                    padding: 6px 16px; border-radius: 2px; cursor: pointer; font-size: 10px;">
              Reset to Default
            </button>
          </div>
        </div>
      </div>
      <div id="keybinds-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
           background: rgba(0,0,0,0.6); z-index: 9999;"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', keybindsHTML);
    
    // Setup event handlers
    this.setupKeybindHandlers(currentHotkeys);
  }
  
  setupKeybindHandlers(currentHotkeys) {
    let editingKey = null;
    
    const closeKeybinds = () => {
      const popup = document.getElementById('keybinds-popup');
      const overlay = document.getElementById('keybinds-overlay');
      if (popup) popup.remove();
      if (overlay) overlay.remove();
      if (editingKey) {
        document.removeEventListener('keydown', handleKeyDown);
        editingKey = null;
      }
    };
    
    const handleKeyDown = (event) => {
      if (!editingKey || event.key === 'Escape' || event.key === ' ') {
        return;
      }
      
      event.preventDefault();
      event.stopPropagation();
      
      const keyCombo = event.key.length === 1 ? event.key.toUpperCase() : event.key;
      currentHotkeys[editingKey] = keyCombo;
      
      // Update reactive settings
      if (this.reactiveSettings) {
        this.reactiveSettings.hotkeys = { ...currentHotkeys };
      }
      
      // Update button text
      const button = document.querySelector(`[data-action="${editingKey}"]`);
      if (button) {
        button.textContent = keyCombo;
        button.style.background = '#333';
        button.textContent = keyCombo;
      }
      
      // Send to game
      if (this.currentGameId) {
        this.sendSettingToGame('hotkeys', currentHotkeys);
      }
      
      this.showSettingChangeIndicator('Keybind Updated', `${editingKey}: ${keyCombo}`);
      console.log(`🎮 [KEYBINDS] Updated ${editingKey} to ${keyCombo}`);
      
      editingKey = null;
      document.removeEventListener('keydown', handleKeyDown);
    };
    
    // Close button handler
    const closeBtn = document.getElementById('close-keybinds');
    if (closeBtn) closeBtn.addEventListener('click', closeKeybinds);
    
    // Overlay click handler
    const overlay = document.getElementById('keybinds-overlay');
    if (overlay) overlay.addEventListener('click', closeKeybinds);
    
    // Edit button handlers
    document.querySelectorAll('.keybind-edit-btn').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        editingKey = action;
        button.textContent = 'Press key...';
        button.style.background = '#555';
        document.addEventListener('keydown', handleKeyDown);
      });
    });
    
    // Reset button handler
    const resetBtn = document.getElementById('reset-keybinds');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const defaultHotkeys = {
          'position': 'A',
          'color': 'F',
          'shape': 'J', 
          'audio': 'L'
        };
        
        // Update reactive settings
        if (this.reactiveSettings) {
          this.reactiveSettings.hotkeys = { ...defaultHotkeys };
        }
        
        // Update button texts
        Object.entries(defaultHotkeys).forEach(([action, key]) => {
          const button = document.querySelector(`[data-action="${action}"]`);
          if (button) {
            button.textContent = key;
            button.style.background = '#333';
          }
        });
        
        // Send to game
        if (this.currentGameId) {
          this.sendSettingToGame('hotkeys', defaultHotkeys);
        }
        
        this.showSettingChangeIndicator('Keybinds Reset', 'Restored to default');
        console.log('🎮 [KEYBINDS] Reset to default hotkeys');
      });
    }
    
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !editingKey) {
        closeKeybinds();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Toggle theme between dark and light
  toggleTheme() {
    console.log('🌙 [THEME] Toggling theme');
    
    // Get current theme from settings or default to dark
    const currentTheme = this.reactiveSettings?.theme || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update the theme in reactive settings if available
    if (this.reactiveSettings) {
      this.reactiveSettings.theme = newTheme;
    }
    
    // Update the button icon
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
      themeBtn.style.background = newTheme === 'dark' ? '#333' : '#f39c12';
    }
    
    // Apply theme to the unified sidebar
    const sidebar = document.getElementById('unified-sidebar');
    if (sidebar) {
      sidebar.style.background = newTheme === 'dark' ? '#1a1a1a' : '#f5f5f5';
      sidebar.style.color = newTheme === 'dark' ? '#eee' : '#333';
    }
    
    // Send theme change to current game
    if (this.currentGameId) {
      this.sendSettingToGame('theme', newTheme);
    }
    
    this.showSettingChangeIndicator('Theme Changed', `Switched to ${newTheme} mode`);
    console.log(`🌙 [THEME] Theme changed to: ${newTheme}`);
  }
  
  // Setup test button handlers (Task 4)
  setupTestButtons() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const testReactiveBtn = document.getElementById('test-reactive-btn');
      const testSyncBtn = document.getElementById('test-sync-btn');
      const setSettingsBtn = document.getElementById('set-settings-btn');
      const keybindsBtn = document.getElementById('keybinds-btn');
      const themeToggleBtn = document.getElementById('theme-toggle-btn');
      
      if (testReactiveBtn) {
        testReactiveBtn.addEventListener('click', () => {
          this.testReactiveSettings();
        });
      }
      
      if (testSyncBtn) {
        testSyncBtn.addEventListener('click', () => {
          this.testSettingsSync();
        });
      }
      
      if (setSettingsBtn) {
        setSettingsBtn.addEventListener('click', () => {
          this.setCurrentSettings();
        });
      }
      
      if (keybindsBtn) {
        keybindsBtn.addEventListener('click', () => {
          this.showKeybinds();
        });
      }
      
      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
          this.toggleTheme();
        });
      }
    }, 100);
  }

  detectCurrentGame() {
    // For unified system, detect from current loaded game or default
    return this.currentGameId || 'jiggle-factorial';
  }

  async loadGame(gameId) {
    try {
      console.log('=== LOADING GAME ===');
      console.log('Requested game:', gameId);
      console.log('Current game:', this.currentGameId);
      
      // Cleanup previous game
      this.cleanupCurrentGame();
      
      // Show loading with progress
      const container = document.getElementById('game-container');
      if (!container) {
        throw new Error('Game container not found');
      }
      container.innerHTML = '<div class="loading" style="background: #000;"><img src="Syn_Logo_A_1.gif" style="width: 333px; height: 333px;"></div>';
      
      console.log('Loading game:', gameId);
      
      // Check if this game needs direct iframe loading (for compiled apps with dynamic resource loading)
      if (this.needsDirectIframeLoading(gameId)) {
        console.log('Using direct iframe loading for:', gameId);
        await this.loadGameDirectly(gameId);
        return;
      }
      
      // Try to load from cache first, then fetch if not available
      let html;
      if (this.gameCache && this.gameCache.has(gameId)) {
        console.log('Loading game from cache:', gameId);
        html = this.gameCache.get(gameId);
      } else {
        // Get the correct path for this game (handles special cases like compiled apps)
        const gamePath = this.getGamePath(gameId);
        console.log('Using game path:', gamePath);
        
        // Try multiple path approaches to handle different serving scenarios
        const possiblePaths = [
          gamePath,
          `./${gamePath}`,
          `/${gameId}/index.html`
        ];
        
        let response = null;
        let lastError = null;
        
        for (const path of possiblePaths) {
          try {
            console.log('Trying path:', path);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per attempt
            
            response = await fetch(path, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (response.ok) {
              console.log('Successfully fetched from:', path);
              break;
            } else {
              console.warn('Path failed:', path, response.status, response.statusText);
              lastError = new Error(`${response.status} ${response.statusText}`);
            }
          } catch (error) {
            console.warn('Path error:', path, error.message);
            lastError = error;
            response = null;
          }
        }
        
        if (!response || !response.ok) {
          console.error('All paths failed for game:', gameId);
          throw new Error(`Failed to load game ${gameId}. Last error: ${lastError?.message || 'Unknown error'}`);
        }
        
        html = await response.text();
        
        // Cache for future use
        if (!this.gameCache) this.gameCache = new Map();
        this.gameCache.set(gameId, html);
      }
      console.log('HTML loaded, length:', html.length);
      
      // Update loading message
      container.innerHTML = '<div class="loading" style="background: #000;"><img src="Syn_Logo_A_1.gif" style="width: 333px; height: 333px;"></div>';
      
      // Modify script and asset paths to be absolute using the improved method
      const baseURL = this.getGameBaseURL(gameId);
      console.log('Using base URL:', baseURL);
      const modifiedHTML = this.processGameHtmlWithAbsolutePaths(html, baseURL, gameId);
      
      // Create blob URL - this creates a virtual HTML file in memory
      const blob = new Blob([modifiedHTML], { type: 'text/html;charset=utf-8' });
      const blobURL = URL.createObjectURL(blob);
      
      // Store blob URL for cleanup
      this.currentBlobUrl = blobURL;
      
      // Create iframe and load the blob URL (faster than regular iframe loading)
      const iframe = this.createGameIframe(blobURL, gameId);
      
      // Clear container and add iframe
      container.innerHTML = '';
      container.appendChild(iframe);
      
      // Setup bidirectional communication
      this.setupEnhancedIframeComm(iframe, gameId);
      
      // Update current game reference
      this.currentGameId = gameId;
      
      // Update GUI to reflect the loaded game
      this.updateGameSelectorGUI(gameId);
      
      console.log('Game loaded successfully via blob URL:', gameId);
      
    } catch (error) {
      console.error('Failed to load game:', error);
      const errorMsg = error.name === 'AbortError' ? 'Game loading timed out' : error.message;
      document.getElementById('game-container').innerHTML = 
        `<div class="loading" style="flex-direction: column; align-items: center; background: #000;">
          <img src="Syn_Logo_A_1.gif" style="width: 333px; height: 333px; margin-bottom: 20px;">
          <div style="color: #eee; font-size: 14px; margin-bottom: 20px; text-align: center;">${errorMsg}</div>
          <button onclick="window.unifiedBrainTraining.loadGame('${gameId}')" style="background: #000; border: 2px solid #fff; color: #fff; padding: 8px 16px; cursor: pointer; font-family: Arial, sans-serif;">Retry</button>
        </div>`;
    }
  }

  cleanupCurrentGame() {
    console.log('🧹 [CLEANUP] Starting thorough game cleanup...');
    
    // Cleanup blob URL if exists
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
      console.log('🧹 [CLEANUP] Blob URL revoked');
    }
    
    // Remove message handler
    if (this.currentMessageHandler) {
      window.removeEventListener('message', this.currentMessageHandler);
      this.currentMessageHandler = null;
      console.log('🧹 [CLEANUP] Message handler removed');
    }
    
    // Get iframe before destroying it
    const iframe = document.getElementById(`game-iframe-${this.currentGameId}`);
    if (iframe) {
      // Try to cleanup game resources if possible
      try {
        if (iframe.contentWindow && iframe.contentWindow.cleanup) {
          iframe.contentWindow.cleanup();
        }
      } catch (e) {
        // Ignore cross-origin errors
      }
      console.log('🧹 [CLEANUP] Iframe cleaned up');
    }
    
    // Clear container content (this will destroy the iframe)
    const container = document.getElementById('game-container');
    if (container) {
      container.innerHTML = '';
      console.log('🧹 [CLEANUP] Container cleared');
    }
    
    // Clear any cached game data
    if (this.gameCache && this.currentGameId) {
      // Keep cache but could clear it here if memory is a concern
      // this.gameCache.delete(this.currentGameId);
    }
    
    // Reset current game reference
    const previousGame = this.currentGameId;
    this.currentGameId = null;
    
    console.log(`🧹 [CLEANUP] Game cleanup completed for: ${previousGame}`);
  }

  // Test if a game file is accessible
  async testGameAccess(gameId) {
    try {
      const url = this.getGamePath(gameId);
      console.log('Testing access to:', url);
      const response = await fetch(url, { method: 'HEAD' });
      console.log('Test result:', {
        url: url,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      });
      return response.ok;
    } catch (error) {
      console.error('Access test failed:', error);
      return false;
    }
  }

  // Optional: Preload games for faster switching (disabled for performance)
  async preloadGame(gameId) {
    console.log(`🎮 [PERFORMANCE] Preloading disabled for ${gameId} - will load on-demand`);
  }
  
  // Clear game cache to free memory
  clearGameCache() {
    if (this.gameCache) {
      const cacheSize = this.gameCache.size;
      this.gameCache.clear();
      console.log(`🧹 [CLEANUP] Cleared game cache (${cacheSize} games)`);
    }
  }
  
  // Get memory usage info
  getMemoryInfo() {
    const info = {
      cachedGames: this.gameCache ? this.gameCache.size : 0,
      currentGame: this.currentGameId || 'none',
      hasActiveIframe: !!document.getElementById(`game-iframe-${this.currentGameId}`)
    };
    console.log('📊 [MEMORY] Current usage:', info);
    return info;
  }

  // Enhanced loadGame that uses cache if available
  async loadGameFromCache(gameId) {
    if (this.gameCache && this.gameCache.has(gameId)) {
      console.log('Loading game from cache:', gameId);
      const html = this.gameCache.get(gameId);
      
      // Process and create blob URL
      const baseURL = `${window.location.origin}/games/${gameId}/`;
      const modifiedHTML = this.processGameHtmlWithAbsolutePaths(html, baseURL, gameId);
      const blob = new Blob([modifiedHTML], { type: 'text/html;charset=utf-8' });
      const blobURL = URL.createObjectURL(blob);
      
      return blobURL;
    }
    return null;
  }

  processGameHtmlWithAbsolutePaths(html, baseURL, gameId) {
    let modifiedHTML = html;
    
    // Convert relative script sources to absolute URLs (excluding CDN and already absolute URLs)
    modifiedHTML = modifiedHTML.replace(
      /src="(?!http|\/\/|data:)([^"]*?)"/g, 
      `src="${baseURL}$1"`
    );
    
    // Convert relative CSS href to absolute URLs
    modifiedHTML = modifiedHTML.replace(
      /href="(?!http|\/\/|data:|#)([^"]*?)"/g, 
      `href="${baseURL}$1"`
    );
    
    // Convert relative image sources to absolute URLs
    modifiedHTML = modifiedHTML.replace(
      /src="(?!http|\/\/|data:)([^"]*?\.(png|jpg|jpeg|gif|svg|webp|ico))"/gi, 
      `src="${baseURL}$1"`
    );
    
    // Fix CSS url() references in style blocks and attributes
    modifiedHTML = modifiedHTML.replace(
      /url\(["']?(?!http|\/\/|data:)([^"')]+)["']?\)/g, 
      `url("${baseURL}$1")`
    );
    
    // Fix fetch() calls and other relative URLs in JavaScript
    modifiedHTML = modifiedHTML.replace(
      /fetch\s*\(\s*["'](?!http|\/\/|data:)([^"']+)["']/g, 
      `fetch("${baseURL}$1"`
    );
    
    // Inject communication bridge script
    const bridgeScript = this.createCommunicationBridge(gameId);
    modifiedHTML = modifiedHTML.replace(/<\/head>/i, `${bridgeScript}</head>`);
    
    // Add error handling wrapper
    const errorHandler = `
      <script>
        window.addEventListener('error', (e) => {
          parent.postMessage({
            type: 'gameError',
            gameId: '${gameId}',
            error: e.message,
            filename: e.filename,
            lineno: e.lineno
          }, '*');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
          parent.postMessage({
            type: 'gameError',
            gameId: '${gameId}',
            error: e.reason?.message || 'Unhandled promise rejection'
          }, '*');
        });
      </script>
    `;
    modifiedHTML = modifiedHTML.replace(/<\/head>/i, `${errorHandler}</head>`);
    
    return modifiedHTML;
  }

  // Keep the old method for backward compatibility
  processGameHtml(html, gameId) {
    const baseURL = `${window.location.origin}/games/${gameId}/`;
    return this.processGameHtmlWithAbsolutePaths(html, baseURL, gameId);
  }

  fixRelativePaths(html, gameId) {
    let fixedHtml = html;
    
    // Fix CSS links (more comprehensive pattern)
    fixedHtml = fixedHtml.replace(/href=["'](?!https?:\/\/|\/\/|data:|#)([^"']+)["']/g, `href="games/${gameId}/$1"`);
    
    // Fix script sources (exclude CDN and absolute URLs)
    fixedHtml = fixedHtml.replace(/src=["'](?!https?:\/\/|\/\/|data:)([^"']+)["']/g, `src="games/${gameId}/$1"`);
    
    // Fix image sources
    fixedHtml = fixedHtml.replace(/src=["'](?!https?:\/\/|\/\/|data:)([^"']+\.(png|jpg|jpeg|gif|svg|webp))["']/gi, `src="games/${gameId}/$1"`);
    
    // Fix CSS url() references
    fixedHtml = fixedHtml.replace(/url\(["']?(?!https?:\/\/|\/\/|data:)([^"')]+)["']?\)/g, `url("games/${gameId}/$1")`);
    
    // Fix any fetch() or XMLHttpRequest relative URLs in scripts
    fixedHtml = fixedHtml.replace(/fetch\s*\(\s*["'](?!https?:\/\/|\/\/|data:)([^"']+)["']/g, `fetch("games/${gameId}/$1"`);
    
    // Add base tag for remaining relative paths
    fixedHtml = fixedHtml.replace(/<head([^>]*)>/i, `<head$1><base href="games/${gameId}/">`);
    
    return fixedHtml;
  }

  createGameIframe(blobURL, gameId) {
    const iframe = document.createElement('iframe');
    iframe.src = blobURL;
    iframe.style.cssText = `
      width: 100%;
      height: 100vh;
      border: none;
      display: block;
      background: #202020;
    `;
    
    // Enhanced iframe attributes for security and functionality
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals');
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('importance', 'high');
    iframe.id = `game-iframe-${gameId}`;
    
    // Cleanup blob URL after load (but now it's faster since it's a blob)
    iframe.onload = () => {
      console.log('Game iframe loaded successfully via blob URL:', gameId);
      // Don't revoke immediately - keep it available for potential reloads
      setTimeout(() => {
        if (this.currentBlobUrl) {
          URL.revokeObjectURL(this.currentBlobUrl);
          this.currentBlobUrl = null;
          console.log('Blob URL cleaned up for:', gameId);
        }
      }, 1000); // Small delay to ensure everything is loaded
    };
    
    // Handle iframe load errors
    iframe.onerror = (error) => {
      console.error('Iframe failed to load:', error);
      document.getElementById('game-container').innerHTML = 
        `<div class="loading" style="flex-direction: column; align-items: center; background: #000;">
          <img src="Syn_Logo_A_1.gif" style="width: 333px; height: 333px; margin-bottom: 20px;">
          <div style="color: #eee; font-size: 14px; margin-bottom: 20px; text-align: center;">Failed to load game iframe</div>
          <button onclick="window.unifiedBrainTraining.loadGame('${gameId}')" style="background: #000; border: 2px solid #fff; color: #fff; padding: 8px 16px; cursor: pointer; font-family: Arial, sans-serif;">Retry</button>
        </div>`;
    };
    
    return iframe;
  }

  createCommunicationBridge(gameId) {
    return `
      <script>
        // Enhanced communication bridge for game iframe
        window.unifiedBridge = {
          gameId: '${gameId}',
          
          // Send message to parent
          sendToParent: (type, data) => {
            parent.postMessage({
              type: type,
              gameId: '${gameId}',
              timestamp: Date.now(),
              ...data
            }, '*');
          },
          
          // Game lifecycle events
          gameReady: () => {
            window.unifiedBridge.sendToParent('gameReady');
          },
          
          gameStarted: () => {
            window.unifiedBridge.sendToParent('gameStarted');
          },
          
          gameEnded: (score, stats) => {
            window.unifiedBridge.sendToParent('gameEnded', { score, stats });
          },
          
          // Settings sync
          settingsChanged: (settings) => {
            window.unifiedBridge.sendToParent('settingsChanged', { settings });
          },
          
          // Error reporting
          reportError: (error) => {
            window.unifiedBridge.sendToParent('gameError', { error });
          }
        };
        
        // Enhanced Reactive Settings Bridge (Task 3) with feedback (Task 4)
        window.reactiveSettingsBridge = {
          updateSettings: function(newSettings) {
            console.log('🎮 [GAME-BRIDGE] Received settings update:', newSettings);
            
            // Update window.settings object
            if (window.settings) {
              Object.assign(window.settings, newSettings);
              console.log('🎮 [GAME-BRIDGE] Updated window.settings');
            } else {
              // Create settings object if it doesn't exist
              window.settings = { ...newSettings };
              console.log('🎮 [GAME-BRIDGE] Created window.settings');
            }
            
            // Call legacy update functions for backward compatibility
            if (window.updateSettings) {
              console.log('🎮 [GAME-BRIDGE] Calling updateSettings()');
              // Some games expect no parameters, just read from window.settings
              try {
                window.updateSettings(newSettings);
              } catch (e) {
                // Try without parameters
                window.updateSettings();
              }
            }
            
            if (window.repopulateGui) {
              console.log('🎮 [GAME-BRIDGE] Calling repopulateGui()');
              window.repopulateGui();
            }
            
            // Try additional common update functions
            if (window.applySettings) {
              console.log('🎮 [GAME-BRIDGE] Calling applySettings()');
              window.applySettings(newSettings);
            }
            
            if (window.refreshSettings) {
              console.log('🎮 [GAME-BRIDGE] Calling refreshSettings()');
              window.refreshSettings();
            }
            
            // Force GUI update if dat.GUI exists
            if (window.gui && window.gui.__controllers) {
              console.log('🎮 [GAME-BRIDGE] Updating dat.GUI controllers');
              window.gui.__controllers.forEach(controller => {
                if (controller.updateDisplay) {
                  controller.updateDisplay();
                }
              });
            }
            
            // Enhanced logging with distinctive prefix (Task 4 - Requirement 3.2)
            console.log('🎮 [GAME-BRIDGE] Settings applied successfully:', newSettings);
            
            // Notify parent that settings were received (Task 4 - visual feedback)
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'settingsReceived',
                gameId: '${gameId}',
                settingsCount: Object.keys(newSettings).length,
                timestamp: Date.now()
              }, '*');
            }
          }
        };
        
        // Enhanced message listener for settings updates and game control
        window.addEventListener('message', (event) => {
          if (event.data.gameId === '${gameId}') {
            if (event.data.type === 'settingsUpdate') {
              console.log('🎮 [GAME-BRIDGE] Received settingsUpdate message');
              window.reactiveSettingsBridge.updateSettings(event.data.settings);
            } else if (event.data.type === 'startGame') {
              console.log('🎮 [GAME-BRIDGE] Received startGame message');
              if (window.startGame) {
                console.log('🎮 [GAME-BRIDGE] Calling startGame() function');
                window.startGame();
              } else {
                console.warn('🎮 [GAME-BRIDGE] No startGame() function found');
              }
            }
          }
        });
        
        // Auto-initialize bridge when DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            console.log('🎮 [GAME-BRIDGE] DOM ready, bridge initialized');
          });
        } else {
          console.log('🎮 [GAME-BRIDGE] Bridge initialized immediately');
        }
        
        // Auto-notify when game is ready
        document.addEventListener('DOMContentLoaded', () => {
          window.unifiedBridge.gameReady();
        });
      </script>
    `;
  }

  setupEnhancedIframeComm(iframe, gameId) {
    // Enhanced message handling
    const messageHandler = (event) => {
      if (event.data.gameId !== gameId) return;
      
      switch (event.data.type) {
        case 'gameReady':
          console.log('Game ready:', gameId);
          this.onGameReady(gameId);
          break;
          
        case 'gameStarted':
          console.log('Game started:', gameId);
          break;
          
        case 'gameEnded':
          console.log('Game ended:', gameId, 'Score:', event.data.score);
          if (event.data.score !== undefined) {
            window.gameStats.recordScore(event.data.score);
          }
          break;
          
        case 'settingsChanged':
          console.log('Settings changed in game:', gameId);
          this.syncSettingsFromGame(event.data.settings);
          break;
          
        case 'settingsReceived':
          console.log('🎮 [GAME-BRIDGE] Game confirmed settings received:', event.data.settingsCount, 'settings');
          break;
          
        case 'gameError':
          console.error('Game error:', gameId, event.data.error);
          this.handleGameError(gameId, event.data.error);
          break;
          
        default:
          console.log('Unknown message from game:', event.data);
      }
    };
    
    // Remove previous listener if exists
    if (this.currentMessageHandler) {
      window.removeEventListener('message', this.currentMessageHandler);
    }
    
    // Add new listener
    window.addEventListener('message', messageHandler);
    this.currentMessageHandler = messageHandler;
  }

  onGameReady(gameId) {
    console.log(`🎮 [GAME-READY] ${gameId} is ready, sending current settings`);
    
    // Send current reactive settings to the game (not defaults)
    if (this.reactiveSettings) {
      // Get current values from reactive settings
      const currentSettings = {};
      Object.keys(this.reactiveSettings).forEach(key => {
        if (typeof this.reactiveSettings[key] !== 'function') {
          currentSettings[key] = this.reactiveSettings[key];
        }
      });
      
      console.log(`🎮 [GAME-READY] Sending ${Object.keys(currentSettings).length} current settings:`, currentSettings);
      this.sendSettingsToGame(gameId, currentSettings);
    } else if (this.settings) {
      // Fallback to regular settings
      this.sendSettingsToGame(gameId, this.settings);
    }
  }

  sendSettingsToGame(gameId, settings) {
    const iframe = document.getElementById(`game-iframe-${gameId}`);
    if (iframe && iframe.contentWindow) {
      // Filter out function properties to avoid postMessage cloning error
      const cleanSettings = {};
      Object.keys(settings).forEach(key => {
        if (typeof settings[key] !== 'function') {
          cleanSettings[key] = settings[key];
        }
      });
      
      iframe.contentWindow.postMessage({
        type: 'settingsUpdate',
        gameId: gameId,
        settings: cleanSettings
      }, '*');
      
      console.log(`🔄 [REACTIVE-SYNC] Sent ${Object.keys(cleanSettings).length} settings to ${gameId}`);
    }
  }

  syncSettingsFromGame(gameSettings) {
    // Update unified settings from game changes
    Object.assign(this.settings, gameSettings);
    if (this.gui) {
      this.gui.__controllers.forEach(controller => {
        controller.updateDisplay();
      });
    }
  }

  handleGameError(gameId, error) {
    console.error(`Game ${gameId} error:`, error);
    // Could show error notification to user
  }

  executeScripts() {
    // Execute any script tags in the loaded content
    const scripts = document.getElementById('game-container').querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src) {
        // External script
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.onload = () => {
          // Script loaded
        };
        document.head.appendChild(newScript);
      } else {
        // Inline script
        try {
          eval(script.textContent);
        } catch (error) {
          console.error('Error executing script:', error);
        }
      }
    });
  }

  switchToGame(gameId) {
    console.log('Switching to game:', gameId, 'from:', this.currentGameId);
    if (gameId && gameId !== this.currentGameId) {
      console.log('Loading new game:', gameId);
      this.loadGame(gameId);
    } else if (gameId === this.currentGameId) {
      console.log('Game already loaded:', gameId);
    } else {
      console.error('Invalid game ID:', gameId);
    }
  }

  loadGameWithStatus(gameId) {
    // Close the sidebar/menu immediately when loading a game
    this.closeSidebar();
    
    // Determine loading method like in test version
    let loadingMethod = 'Blob URL';
    if (this.needsDirectIframeLoading(gameId)) {
      loadingMethod = gameId === 'quad-box' ? 'Blob URL (Fixed Paths)' : 'Direct Iframe';
    }
    
    // Show loading notification (logo only)
    this.showStatusNotification('', 'loading');
    
    // Load the game
    this.loadGame(gameId).then(() => {
      this.showStatusNotification(`Loaded via ${loadingMethod}`, 'success');
    }).catch(error => {
      this.showErrorNotification(error.message);
    });
  }

  showErrorNotification(errorMessage) {
    // Remove existing notification
    const existing = document.getElementById('status-notification');
    if (existing) {
      existing.remove();
    }

    // Create error notification with just red error text
    const notification = document.createElement('div');
    notification.id = 'status-notification';
    notification.innerHTML = `
      <div style="color: #F44336; font-size: 12px; font-family: Arial, sans-serif;">
        Failed to load<br>
        <span style="font-size: 10px; opacity: 0.8;">${errorMessage}</span>
      </div>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 15px;
      left: 60px;
      z-index: 999;
      max-width: 300px;
      display: flex;
      align-items: flex-start;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after longer delay for errors
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  showStatusNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.getElementById('status-notification');
    if (existing) {
      existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'status-notification';
    
    if (type === 'loading') {
      // Don't show anything for loading - logo is in center
      notification.style.display = 'none';
      return;
    } else {
      // Show colored text for success/error
      notification.textContent = message;
    }
    
    // Style the notification - no background, just colored text
    notification.style.cssText = `
      position: fixed;
      top: 15px;
      left: 60px;
      color: ${type === 'success' ? '#4CAF50' : 
               type === 'error' ? '#F44336' : '#eee'};
      font-size: 12px;
      font-family: Arial, sans-serif;
      z-index: 999;
      max-width: 300px;
      display: flex;
      align-items: center;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after delay (except for loading messages)
    if (type !== 'loading') {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.3s';
          setTimeout(() => notification.remove(), 300);
        }
      }, 3000);
    }
  }

  updateGameSelectorGUI(gameId) {
    if (this.settings && this.gui) {
      // Set the current game ID FIRST
      this.currentGameId = gameId;
      
      // Create new reactive settings for the new game (functions already included)
      this.settings = this.createReactiveSettings(gameId);
      
      // Rebuild the GUI with game-specific controls for THIS game only
      this.buildGameSpecificGUI();
      this.setupReactiveSync();
      
      console.log('🔄 [REACTIVE-SYNC] Updated reactive GUI for game:', gameId);
    }
  }

  init() {
    // Check if we're running from a web server
    this.checkServerStatus();
    
    this.createToggleButton();
    this.createSidebar();
    this.setupEventListeners();
    
    // Optional: Preload common games for faster switching
    this.initializeGamePreloading();
  }

  getGamePath(gameId) {
    // Special cases for games that need different paths
    const specialPaths = {
      'quad-box': 'games/quad-box/dist/index.html'  // Compiled Svelte app
    };
    
    // Return special path if exists, otherwise use standard path
    return specialPaths[gameId] || `games/${gameId}/index.html`;
  }

  getGameBaseURL(gameId) {
    // Special cases for games that need different base URLs
    const specialBaseURLs = {
      'quad-box': `${window.location.origin}/games/quad-box/dist/`
    };
    
    // Return special base URL if exists, otherwise use standard base URL
    return specialBaseURLs[gameId] || `${window.location.origin}/games/${gameId}/`;
  }

  needsDirectIframeLoading(gameId) {
    // Games that need special handling due to dynamic resource loading or compilation
    // dichotic-dual-nback: Howler.js can't load audio from blob URLs
    // quad-box: Compiled Svelte app with dynamic imports
    const specialHandlingGames = ['quad-box', 'dichotic-dual-nback'];
    return specialHandlingGames.includes(gameId);
  }

  async loadGameDirectly(gameId) {
    try {
      const container = document.getElementById('game-container');
      const gamePath = this.getGamePath(gameId);
      
      console.log('Loading game directly from:', gamePath);
      
      // For quad-box, we need to load it with a proper base href to fix relative paths
      if (gameId === 'quad-box') {
        await this.loadQuadBoxWithFixedPaths(container, gamePath, gameId);
      } else {
        // Standard direct loading for other games
        await this.loadGameWithDirectIframe(container, gamePath, gameId);
      }
      
    } catch (error) {
      console.error('Failed to load game directly:', error);
      const container = document.getElementById('game-container');
      container.innerHTML = 
        `<div class="loading" style="flex-direction: column; align-items: center; background: #000;">
          <img src="Syn_Logo_A_1.gif" style="width: 333px; height: 333px; margin-bottom: 20px;">
          <div style="color: #eee; font-size: 14px; margin-bottom: 20px; text-align: center;">${error.message}</div>
          <button onclick="window.unifiedBrainTraining.loadGame('${gameId}')" style="background: #000; border: 2px solid #fff; color: #fff; padding: 8px 16px; cursor: pointer; font-family: Arial, sans-serif;">Retry</button>
        </div>`;
    }
  }

  async loadQuadBoxWithFixedPaths(container, gamePath, gameId) {
    // Fetch the HTML and modify it to fix base path issues
    const response = await fetch(gamePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch quad-box: ${response.status}`);
    }
    
    let html = await response.text();
    
    // Add base tag to fix relative path resolution
    const baseURL = this.getGameBaseURL(gameId);
    const baseTag = `<base href="${baseURL}">`;
    
    // Insert base tag after <head>
    html = html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
    
    // Also fix any remaining relative paths in the HTML
    html = html.replace(/src="\.\/([^"]+)"/g, `src="${baseURL}$1"`);
    html = html.replace(/href="\.\/([^"]+)"/g, `href="${baseURL}$1"`);
    
    // Create blob URL with the fixed HTML
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const blobURL = URL.createObjectURL(blob);
    this.currentBlobUrl = blobURL;
    
    // Create iframe with the fixed HTML
    const iframe = this.createGameIframe(blobURL, gameId);
    
    // Clear container and add iframe
    container.innerHTML = '';
    container.appendChild(iframe);
    
    // Setup communication
    this.setupEnhancedIframeComm(iframe, gameId);
    
    // Update current game reference
    this.currentGameId = gameId;
    this.updateGameSelectorGUI(gameId);
    
    console.log('Quad-box loaded with fixed paths via blob URL');
  }

  async loadGameWithDirectIframe(container, gamePath, gameId) {
    // Create iframe that loads directly from the server (no blob URL)
    const iframe = document.createElement('iframe');
    iframe.src = gamePath;
    iframe.style.cssText = `
      width: 100%;
      height: 100vh;
      border: none;
      display: block;
      background: #202020;
    `;
    
    // Enhanced iframe attributes
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals');
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('importance', 'high');
    iframe.id = `game-iframe-${gameId}`;
    
    // Handle iframe load events
    iframe.onload = () => {
      console.log('Game iframe loaded directly:', gameId);
      this.injectCommunicationBridge(iframe, gameId);
    };
    
    iframe.onerror = (error) => {
      console.error('Direct iframe failed to load:', error);
      container.innerHTML = 
        `<div class="loading" style="flex-direction: column; align-items: center; background: #000;">
          <img src="Syn_Logo_A_1.gif" style="width: 333px; height: 333px; margin-bottom: 20px;">
          <div style="color: #eee; font-size: 14px; margin-bottom: 20px; text-align: center;">Failed to load game</div>
          <button onclick="window.unifiedBrainTraining.loadGame('${gameId}')" style="background: #000; border: 2px solid #fff; color: #fff; padding: 8px 16px; cursor: pointer; font-family: Arial, sans-serif;">Retry</button>
        </div>`;
    };
    
    // Clear container and add iframe
    container.innerHTML = '';
    container.appendChild(iframe);
    
    // Setup communication
    this.setupEnhancedIframeComm(iframe, gameId);
    
    // Update current game reference
    this.currentGameId = gameId;
    this.updateGameSelectorGUI(gameId);
    
    console.log('Game loaded directly via iframe:', gameId);
  }

  injectCommunicationBridge(iframe, gameId) {
    // Inject communication bridge into the directly loaded iframe
    try {
      const bridgeScript = this.createCommunicationBridge(gameId);
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      if (doc) {
        const script = doc.createElement('script');
        script.innerHTML = bridgeScript.replace(/<\/?script[^>]*>/g, '');
        doc.head.appendChild(script);
        console.log('Communication bridge injected into direct iframe');
      }
    } catch (error) {
      console.warn('Could not inject communication bridge:', error);
      // This is expected due to CORS, but the game should still work
    }
  }

  checkServerStatus() {
    const protocol = window.location.protocol;
    const isFileProtocol = protocol === 'file:';
    
    console.log('Running from:', protocol);
    
    if (isFileProtocol) {
      console.warn('⚠️  Running from file:// protocol. Game loading may fail due to CORS restrictions.');
      console.warn('💡 Please serve this from a web server for full functionality.');
      console.warn('📖 See START_SERVER.md for instructions.');
      
      // Show warning to user
      const container = document.getElementById('game-container');
      if (container) {
        container.innerHTML = `
          <div class="loading" style="flex-direction: column; text-align: center;">
            <div style="font-size: 18px; margin-bottom: 20px;">⚠️ Server Required</div>
            <div style="font-size: 14px; max-width: 500px; line-height: 1.5;">
              This application needs to run from a web server, not opened directly as a file.<br><br>
              <strong>Quick start:</strong><br>
              1. Open terminal/command prompt in this folder<br>
              2. Run: <code>python -m http.server 8000</code><br>
              3. Open: <a href="http://localhost:8000" style="color: #4CAF50;">http://localhost:8000</a><br><br>
              See START_SERVER.md for more options.
            </div>
          </div>
        `;
      }
    } else {
      console.log('✅ Running from web server. Game loading should work properly.');
    }
  }

  initializeGamePreloading() {
    // Disabled preloading for better performance
    // Games will be loaded on-demand only
    console.log('🎮 [PERFORMANCE] Game preloading disabled - loading on-demand only');
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
    // Enhanced sidebar with reactive settings status and test buttons (Task 4)
    const sidebarHTML = `
      <div class="unified-sidebar" id="unified-sidebar">
        <div id="reactive-settings-status" style="padding: 10px; border-bottom: 1px solid #444; font-size: 12px; color: #aaa;">
          <div id="reactive-status-indicator">
            Reactive Settings: <span id="reactive-status-text" style="color: #4CAF50;">Connected</span>
          </div>
          <div id="reactive-test-buttons" style="margin-top: 8px;">
            <button id="test-reactive-btn" style="background: #333; border: 1px solid #666; color: #fff; padding: 4px 8px; margin-right: 4px; cursor: pointer; font-size: 11px;">Test Reactive</button>
            <button id="test-sync-btn" style="background: #333; border: 1px solid #666; color: #fff; padding: 4px 8px; margin-right: 4px; cursor: pointer; font-size: 11px;">Test Sync</button>
            <button id="set-settings-btn" style="background: #333; border: 1px solid #666; color: #fff; padding: 4px 8px; margin-right: 4px; cursor: pointer; font-size: 11px;">Set Settings</button>
            <button id="keybinds-btn" style="background: #333; border: 1px solid #666; color: #fff; padding: 4px 8px; margin-right: 4px; cursor: pointer; font-size: 11px;">Keybinds</button>
            <button id="theme-toggle-btn" style="background: #333; border: 1px solid #666; color: #fff; padding: 4px 8px; cursor: pointer; font-size: 11px;">🌙</button>
          </div>
        </div>
        <div id="unified-gui-container"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);
    
    // Setup test button handlers
    this.setupTestButtons();
    
    // Create the actual dat.GUI
    this.createDatGUI();
  }



  getGameSpecificSettings(gameId) {
    const settingsMap = {
      'jiggle-factorial': {
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
        trialStartDelay: 2000
      },
      '3d-hyper-nback': {
        wallsEnabled: true,
        cameraEnabled: true,
        faceEnabled: true,
        positionEnabled: true,
        rotationEnabled: false,
        wordEnabled: true,
        shapeEnabled: true,
        cornerEnabled: true,
        soundEnabled: true,
        colorEnabled: true,
        randomizeEnabled: false,
        nLevel: 2,
        numStimuliSelect: 2,
        sceneDimmer: 0.5,
        zoom: 0.7,
        perspective: 15,
        targetNumOfStimuli: 5,
        baseDelay: 5000,
        maxAllowedMistakes: 3,
        previousLevelThreshold: 0.5,
        nextLevelThreshold: 0.8
      },
      'dichotic-dual-nback': {
        nLevel: 2,
        stimulusTime: 4000,
        matchingClues: 10,
        soundsLeft: 'Letters English (USA)',
        soundsRight: 'Numbers English (USA)',
        feedback: true,
        dailyGoal: 20
      },
      'quad-box': {
        mode: 'quad',
        theme: 'dark',
        nBack: 2,
        numTrials: 35,
        trialTime: 2500,
        matchChance: 25,
        interference: 20,
        enableAudio: true,
        enableShape: true,
        enableColor: true,
        enableImage: false,
        grid: 'rotate3D',
        rules: 'none',
        audioSource: 'letters2',
        colorSource: 'basic',
        shapeSource: 'basic',
        imageSource: 'voronoi',
        feedback: 'show',
        rotationSpeed: 35,
        enableAutoProgression: true,
        successCriteria: 80,
        successComboRequired: 1,
        failureCriteria: 50,
        failureComboRequired: 3,
        positionWidth: 2,
        enablePositionWidthSequence: false,
        hotkeys: {
          'position': 'A',
          'color': 'F',
          'shape': 'J',
          'audio': 'L'
        }
      }
    };

    return settingsMap[gameId] || settingsMap['jiggle-factorial'];
  }

  createDatGUI() {
    // Wait for dat.GUI to be available
    if (typeof dat === 'undefined') {
      setTimeout(() => this.createDatGUI(), 100);
      return;
    }

    // Create reactive settings for current game (functions already included)
    const currentGame = this.currentGameId || 'jiggle-factorial';
    this.settings = this.createReactiveSettings(currentGame);

    // Create dat.GUI
    this.gui = new dat.GUI({ autoPlace: false });
    document.getElementById('unified-gui-container').appendChild(this.gui.domElement);

    this.buildGameSpecificGUI();
    this.setupReactiveSync();
  }

  buildGameSpecificGUI() {
    // Clear existing controllers and folders instead of destroying the whole GUI
    while (this.gui.__controllers.length > 0) {
      this.gui.remove(this.gui.__controllers[0]);
    }
    
    // Clear existing folders
    for (let folderName in this.gui.__folders) {
      this.gui.removeFolder(this.gui.__folders[folderName]);
    }

    // Add game loading buttons
    this.gui.add(this.settings, 'loadJiggleFactorial').name('Load Jiggle Factorial 3D');
    this.gui.add(this.settings, 'loadHyperNBack').name('Load 3D Hyper N-back');
    this.gui.add(this.settings, 'loadDichoticDualNBack').name('Load Dichotic Dual N-back');
    this.gui.add(this.settings, 'loadQuadBox').name('Load Quad Box');

    // Add ONLY the settings for the currently loaded game
    const currentGame = this.currentGameId || 'jiggle-factorial';
    
    if (currentGame === 'jiggle-factorial') {
      this.buildJiggleFactorialGUI();
    } else if (currentGame === '3d-hyper-nback') {
      this.build3DHyperNBackGUI();
    } else if (currentGame === 'dichotic-dual-nback') {
      this.buildDichoticDualNBackGUI();
    } else if (currentGame === 'quad-box') {
      this.buildQuadBoxGUI();
    } else {
      // Default message if no specific game is loaded
      const note = document.createElement('div');
      note.style.cssText = 'color: #aaa; font-size: 12px; text-align: center; margin: 20px; line-height: 1.4;';
      note.textContent = 'Load a game to see its settings';
      this.gui.domElement.appendChild(note);
    }
  }

  buildJiggleFactorialGUI() {
    // Add all controls exactly like Jiggle Factorial does
    this.gui.add(this.settings, 'level').name('Level');
    this.gui.add(this.settings, 'movementMode', ['Non-Rotating', 'Rotating', 'Combination']).name('Movement Mode');
    
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
  }

  build3DHyperNBackGUI() {
    // Enable Stimuli folder (open by default)
    const stimuliFolder = this.gui.addFolder('Enable Stimuli');
    stimuliFolder.add(this.settings, 'wallsEnabled').name('Walls');
    stimuliFolder.add(this.settings, 'cameraEnabled').name('Camera');
    stimuliFolder.add(this.settings, 'faceEnabled').name('Face');
    stimuliFolder.add(this.settings, 'positionEnabled').name('Position');
    stimuliFolder.add(this.settings, 'rotationEnabled').name('Rotation');
    stimuliFolder.add(this.settings, 'wordEnabled').name('Word');
    
    const cornerController = stimuliFolder.add(this.settings, 'cornerEnabled').name('Corner');
    const shapeController = stimuliFolder.add(this.settings, 'shapeEnabled').name('Shape');
    
    // Shape depends on Corner - disable when corner is off
    const updateShapeState = () => {
      if (this.settings.cornerEnabled) {
        shapeController.__li.classList.remove('disabled');
      } else {
        this.settings.shapeEnabled = false;
        shapeController.updateDisplay();
        shapeController.__li.classList.add('disabled');
      }
    };
    
    // Prevent shape from being enabled when corner is disabled
    shapeController.onChange((value) => {
      if (!this.settings.cornerEnabled && value) {
        // Revert the change
        this.settings.shapeEnabled = false;
        shapeController.updateDisplay();
        console.log('⚠️ Shape cannot be enabled when Corner is disabled');
        return false;
      }
    });
    
    cornerController.onChange(updateShapeState);
    this.updateShapeState = updateShapeState;
    updateShapeState();
    
    stimuliFolder.add(this.settings, 'soundEnabled').name('Sound');
    stimuliFolder.add(this.settings, 'colorEnabled').name('Color');
    stimuliFolder.open(); // Open folder by default

    // Game Settings
    this.gui.add(this.settings, 'randomizeEnabled').name('Randomize Stimuli');
    this.gui.add(this.settings, 'nLevel').name('N Back Level');
    this.gui.add(this.settings, 'numStimuliSelect').name('Number of Stimuli');
    this.gui.add(this.settings, 'sceneDimmer').name('Scene Dimmer');
    this.gui.add(this.settings, 'zoom').name('Zoom');
    this.gui.add(this.settings, 'perspective').name('Perspective');
    this.gui.add(this.settings, 'targetNumOfStimuli').name('Target Number of Matches');
    this.gui.add(this.settings, 'baseDelay').name('Base Delay (ms)');
    this.gui.add(this.settings, 'maxAllowedMistakes').name('Maximum Allowed Mistakes');
    this.gui.add(this.settings, 'previousLevelThreshold').name('Level Down Correct Stimuli %');
    this.gui.add(this.settings, 'nextLevelThreshold').name('Level Up Correct Stimuli %');
  }

  buildDichoticDualNBackGUI() {
    // Core game settings
    this.gui.add(this.settings, 'nLevel', 1, 9, 1).name('N-Back Level');
    this.gui.add(this.settings, 'stimulusTime', 1500, 15000, 250).name('Stimulus Time (ms)');
    this.gui.add(this.settings, 'matchingClues', 5, 30, 5).name('Matching Clues');
    
    // Sound settings
    const soundOptions = [
      'Letters English (USA)',
      'Letters English (UK)', 
      'Letters German',
      'Letters Russian',
      'Letters Italian',
      'Numbers English (USA)',
      'Numbers English (UK)',
      'Numbers German', 
      'Numbers Russian',
      'Numbers Italian',
      'Piano',
      'Shapes English',
      'Shapes Italian'
    ];
    
    this.gui.add(this.settings, 'soundsLeft', soundOptions).name('Sounds Left');
    this.gui.add(this.settings, 'soundsRight', soundOptions).name('Sounds Right');
    
    // Game options
    this.gui.add(this.settings, 'feedback').name('Clue Feedback');
    this.gui.add(this.settings, 'dailyGoal', 1, 50, 1).name('Daily Goal');
  }

  buildQuadBoxGUI() {
    // Game mode selection
    this.gui.add(this.settings, 'mode', ['quad', 'dual', 'custom', 'customB', 'tally', 'vtally']).name('Game Mode');
    
    // Theme selection
    this.gui.add(this.settings, 'theme', ['dark', 'light']).name('Theme');
    
    // Core N-Back settings
    this.gui.add(this.settings, 'nBack', 1, 12, 1).name('N-Back Level');
    this.gui.add(this.settings, 'numTrials', 10, 999, 1).name('Number of Trials');
    this.gui.add(this.settings, 'trialTime', 1000, 5000, 100).name('Trial Time (ms)');
    
    // Game difficulty settings
    this.gui.add(this.settings, 'matchChance', 5, 75, 1).name('Match Chance (%)');
    this.gui.add(this.settings, 'interference', 0, 75, 1).name('Interference (%)');
    
    // Modalities folder - grouped by type (enable toggles first, then sources)
    const modalitiesFolder = this.gui.addFolder('Modalities');
    
    // Enable toggles grouped together
    modalitiesFolder.add(this.settings, 'enableAudio').name('Audio Enabled');
    modalitiesFolder.add(this.settings, 'enableColor').name('Color Enabled');
    modalitiesFolder.add(this.settings, 'enableShape').name('Shape Enabled');
    modalitiesFolder.add(this.settings, 'enableImage').name('Image Enabled');
    
    // Source selectors grouped together
    modalitiesFolder.add(this.settings, 'audioSource', ['letters2', 'letters3', 'letters5', 'letters4', 'letters', 'numbers', 'nato', 'syl5', 'syl10']).name('Audio Source');
    modalitiesFolder.add(this.settings, 'colorSource', ['basic', 'gradient', 'voronoi', 'generative']).name('Color Source');
    modalitiesFolder.add(this.settings, 'shapeSource', ['basic', 'tetris', 'iconsA', 'iconsB', 'all']).name('Shape Source');
    modalitiesFolder.add(this.settings, 'imageSource', ['voronoi', 'generative']).name('Image Source');
    
    modalitiesFolder.open();
    
    // Visual settings folder (open by default)
    const visualFolder = this.gui.addFolder('Visual Settings');
    visualFolder.add(this.settings, 'grid', ['rotate3D', 'static2D']).name('Grid Type');
    visualFolder.add(this.settings, 'rotationSpeed', 0, 140, 1).name('Rotation Speed');
    visualFolder.add(this.settings, 'feedback', ['show', 'hide', 'hide-counter']).name('Feedback');
    visualFolder.open(); // Open folder by default
    
    // Advanced rules folder
    const rulesFolder = this.gui.addFolder('Advanced Rules');
    rulesFolder.add(this.settings, 'rules', ['none', 'variable', 'tally', 'vtally']).name('Rules Type');
    
    // Auto progression folder (open by default)
    const progressionFolder = this.gui.addFolder('Auto Progression');
    progressionFolder.add(this.settings, 'enableAutoProgression').name('Enable Auto Progression');
    progressionFolder.add(this.settings, 'successCriteria', 0, 100, 1).name('Success Criteria (%)');
    progressionFolder.add(this.settings, 'successComboRequired', 1, 9, 1).name('Success Combo Required');
    progressionFolder.add(this.settings, 'failureCriteria', 0, 100, 1).name('Failure Criteria (%)');
    progressionFolder.add(this.settings, 'failureComboRequired', 1, 9, 1).name('Failure Combo Required');
    progressionFolder.open(); // Open folder by default
    
    // Tally mode settings folder
    const tallyFolder = this.gui.addFolder('Tally Mode Settings');
    tallyFolder.add(this.settings, 'positionWidth', 1, 4, 1).name('Position Width');
    tallyFolder.add(this.settings, 'enablePositionWidthSequence').name('Enable Position Width Sequence');
  }



  // Setup reactive synchronization with dat.GUI (Task 2)
  setupReactiveSync() {
    // Sync GUI changes to reactive settings with visual feedback
    this.gui.__controllers.forEach(controller => {
      const originalOnChange = controller.__onChange;
      
      controller.onChange((value) => {
        // Call original onChange if it exists
        if (originalOnChange) {
          originalOnChange.call(controller, value);
        }
        
        // Update reactive settings (this will trigger sendSettingToGame automatically)
        if (this.reactiveSettings && controller.property in this.reactiveSettings) {
          // Skip if this is a function button (value will be undefined)
          if (typeof this.reactiveSettings[controller.property] === 'function') {
            return; // Don't overwrite functions with undefined
          }
          // The proxy will handle the update and send to game
          this.reactiveSettings[controller.property] = value;
          
          // Update shape state when corner changes (3D Hyper N-Back dependency)
          if (controller.property === 'cornerEnabled' && this.updateShapeState) {
            this.updateShapeState();
          }
        }
      });
    });
    
    console.log('🔄 [REACTIVE-SYNC] Reactive synchronization setup complete');
  }
  
  setupSync() {
    // Legacy sync method - kept for backward compatibility
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

// Initialize game stats system
window.gameStats = {
  init: () => {
    console.log('Game stats initialized for:', window.unifiedBrainTraining?.currentGameId);
  },
  recordScore: (score) => {
    const gameId = window.unifiedBrainTraining?.currentGameId;
    if (gameId) {
      const stats = JSON.parse(localStorage.getItem('brainTrainingStats') || '{}');
      if (!stats[gameId]) stats[gameId] = [];
      stats[gameId].push({
        score: score,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem('brainTrainingStats', JSON.stringify(stats));
      console.log('Score recorded:', score, 'for game:', gameId);
    }
  },
  getStats: (gameId) => {
    const stats = JSON.parse(localStorage.getItem('brainTrainingStats') || '{}');
    return stats[gameId] || [];
  }
};