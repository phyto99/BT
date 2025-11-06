// Simple unified brain training system - just toggle button + dat.GUI

class UnifiedBrainTraining {
  constructor() {
    this.sidebarOpen = false;
    this.currentGameId = null;
    this.init();
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
    // Cleanup blob URL if exists
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    
    // Remove message handler
    if (this.currentMessageHandler) {
      window.removeEventListener('message', this.currentMessageHandler);
      this.currentMessageHandler = null;
    }
    
    // Clear container content (this will destroy the iframe)
    const container = document.getElementById('game-container');
    if (container) {
      container.innerHTML = '';
    }
    
    // Reset current game reference
    this.currentGameId = null;
    
    console.log('Game cleanup completed');
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

  // Optional: Preload games for faster switching
  async preloadGame(gameId) {
    try {
      console.log('Preloading game:', gameId);
      const gamePath = this.getGamePath(gameId);
      const response = await fetch(gamePath);
      if (response.ok) {
        const html = await response.text();
        // Store in cache for faster loading
        if (!this.gameCache) this.gameCache = new Map();
        this.gameCache.set(gameId, html);
        console.log('Game preloaded:', gameId);
      } else {
        console.warn('Failed to preload game:', gameId, response.status, response.statusText);
      }
    } catch (error) {
      console.warn('Failed to preload game:', gameId, error);
    }
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
        
        // Listen for messages from parent
        window.addEventListener('message', (event) => {
          if (event.data.type === 'settingsUpdate' && event.data.gameId === '${gameId}') {
            if (window.updateSettings) {
              window.updateSettings(event.data.settings);
            }
          }
        });
        
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
    // Sync current settings to the game
    if (this.settings) {
      this.sendSettingsToGame(gameId, this.settings);
    }
  }

  sendSettingsToGame(gameId, settings) {
    const iframe = document.getElementById(`game-iframe-${gameId}`);
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'settingsUpdate',
        gameId: gameId,
        settings: settings
      }, '*');
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
      
      // Get game-specific settings
      const gameSettings = this.getGameSpecificSettings(gameId);
      
      // Preserve the loading functions and merge with game settings
      this.settings = {
        ...gameSettings,
        loadJiggleFactorial: () => {
          this.loadGameWithStatus('jiggle-factorial');
        },
        loadHyperNBack: () => {
          this.loadGameWithStatus('3d-hyper-nback');
        },
        loadDichoticDualNBack: () => {
          this.loadGameWithStatus('dichotic-dual-nback');
        },
        loadQuadBox: () => {
          this.loadGameWithStatus('quad-box');
        }
      };
      
      // Rebuild the GUI with game-specific controls for THIS game only
      this.buildGameSpecificGUI();
      
      console.log('Updated GUI for game:', gameId, 'Current game ID:', this.currentGameId);
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
    const specialHandlingGames = ['quad-box'];
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
    // Preload games after a short delay to not block initial load
    setTimeout(() => {
      const commonGames = ['jiggle-factorial', '3d-hyper-nback'];
      commonGames.forEach(gameId => {
        if (gameId !== this.currentGameId) {
          this.preloadGame(gameId);
        }
      });
    }, 2000);
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
        targetStimuli: 5,
        baseDelay: 5000,
        maxAllowedMistakes: 3,
        previousLevelThreshold: 0.5,
        nextLevelThreshold: 0.8
      },
      'dichotic-dual-nback': {
        nLevel: 2,
        duration: 3000,
        interval: 3000,
        feedback: true,
        audioEnabled: true,
        visualEnabled: true,
        trials: 20
      },
      'quad-box': {
        nLevel: 2,
        positionEnabled: true,
        colorEnabled: true,
        shapeEnabled: true,
        audioEnabled: true,
        stimulusDuration: 500,
        interStimulusInterval: 2500,
        trials: 20,
        autoAdvance: true
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

    // Use game-specific settings
    this.settings = this.getGameSpecificSettings(this.currentGameId || 'jiggle-factorial');
    
    // Add game loading functions
    this.settings.loadJiggleFactorial = () => {
      this.loadGameWithStatus('jiggle-factorial');
    };
    this.settings.loadHyperNBack = () => {
      this.loadGameWithStatus('3d-hyper-nback');
    };
    this.settings.loadDichoticDualNBack = () => {
      this.loadGameWithStatus('dichotic-dual-nback');
    };
    this.settings.loadQuadBox = () => {
      this.loadGameWithStatus('quad-box');
    };

    // Create dat.GUI
    this.gui = new dat.GUI({ autoPlace: false });
    document.getElementById('unified-gui-container').appendChild(this.gui.domElement);

    this.buildGameSpecificGUI();
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
    // Enable Stimuli folder
    const stimuliFolder = this.gui.addFolder('Enable Stimuli');
    stimuliFolder.add(this.settings, 'wallsEnabled').name('Walls');
    stimuliFolder.add(this.settings, 'cameraEnabled').name('Camera');
    stimuliFolder.add(this.settings, 'faceEnabled').name('Face');
    stimuliFolder.add(this.settings, 'positionEnabled').name('Position');
    stimuliFolder.add(this.settings, 'rotationEnabled').name('Rotation');
    stimuliFolder.add(this.settings, 'wordEnabled').name('Word');
    stimuliFolder.add(this.settings, 'shapeEnabled').name('Shape');
    stimuliFolder.add(this.settings, 'cornerEnabled').name('Corner');
    stimuliFolder.add(this.settings, 'soundEnabled').name('Sound');
    stimuliFolder.add(this.settings, 'colorEnabled').name('Color');

    // Game Settings
    this.gui.add(this.settings, 'randomizeEnabled').name('Randomize Stimuli');
    this.gui.add(this.settings, 'nLevel').name('N Back Level');
    this.gui.add(this.settings, 'numStimuliSelect').name('Number of Stimuli');
    this.gui.add(this.settings, 'sceneDimmer').name('Scene Dimmer');
    this.gui.add(this.settings, 'zoom').name('Zoom');
    this.gui.add(this.settings, 'perspective').name('Perspective');
    this.gui.add(this.settings, 'targetStimuli').name('Target Number of Matches');
    this.gui.add(this.settings, 'baseDelay').name('Base Delay (ms)');
    this.gui.add(this.settings, 'maxAllowedMistakes').name('Maximum Allowed Mistakes');
    this.gui.add(this.settings, 'previousLevelThreshold').name('Level Down Correct Stimuli %');
    this.gui.add(this.settings, 'nextLevelThreshold').name('Level Up Correct Stimuli %');
  }

  buildDichoticDualNBackGUI() {
    this.gui.add(this.settings, 'nLevel').name('N-Back Level');
    this.gui.add(this.settings, 'duration').name('Duration (ms)');
    this.gui.add(this.settings, 'interval').name('Interval (ms)');
    this.gui.add(this.settings, 'feedback').name('Feedback');
    this.gui.add(this.settings, 'audioEnabled').name('Audio Enabled');
    this.gui.add(this.settings, 'visualEnabled').name('Visual Enabled');
    this.gui.add(this.settings, 'trials').name('Number of Trials');
  }

  buildQuadBoxGUI() {
    this.gui.add(this.settings, 'nLevel').name('N-Back Level');
    
    // Modalities folder
    const modalitiesFolder = this.gui.addFolder('Modalities');
    modalitiesFolder.add(this.settings, 'positionEnabled').name('Position');
    modalitiesFolder.add(this.settings, 'colorEnabled').name('Color');
    modalitiesFolder.add(this.settings, 'shapeEnabled').name('Shape');
    modalitiesFolder.add(this.settings, 'audioEnabled').name('Audio');

    // Timing settings
    this.gui.add(this.settings, 'stimulusDuration').name('Stimulus Duration (ms)');
    this.gui.add(this.settings, 'interStimulusInterval').name('Inter-Stimulus Interval (ms)');
    this.gui.add(this.settings, 'trials').name('Number of Trials');
    this.gui.add(this.settings, 'autoAdvance').name('Auto Advance Level');
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