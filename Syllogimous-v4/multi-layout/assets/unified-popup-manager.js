// Unified Popup Manager
// Feature: syllogimous-unified-integration
// Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8

/**
 * Centralized popup system for displaying various types of content across all games
 * Supports multiple content types, positioning, themes, animations, and queue management
 */
class UnifiedPopupManager {
  constructor() {
    this.popups = new Map(); // Active popups by ID
    this.queue = []; // Queued popup configs
    this.nextId = 1;
    this.showCallbacks = [];
    this.hideCallbacks = [];
    this.isProcessingQueue = false;
    
    // Create container for popups if it doesn't exist
    this.ensureContainer();
    
    // Setup global event listeners
    this.setupGlobalListeners();
  }

  /**
   * Ensure popup container exists in DOM
   */
  ensureContainer() {
    let container = document.getElementById('unified-popup-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'unified-popup-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10000;
      `;
      document.body.appendChild(container);
    }
    this.container = container;
  }

  /**
   * Setup global event listeners (ESC key, etc.)
   */
  setupGlobalListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close topmost popup
        const popupIds = Array.from(this.popups.keys());
        if (popupIds.length > 0) {
          const topPopupId = popupIds[popupIds.length - 1];
          this.hide(topPopupId);
        }
      }
    });
  }

  /**
   * Show a popup with the given configuration
   * @param {Object} config - Popup configuration
   * @returns {Object} PopupInstance
   */
  show(config) {
    // Validate config
    if (!config || !config.type) {
      console.error('[PopupManager] Invalid config:', config);
      return null;
    }

    // Generate unique ID
    const id = `popup-${this.nextId++}`;

    // Create popup element
    const element = this.createPopupElement(id, config);

    // Store popup instance
    const instance = {
      id,
      element,
      config,
      close: () => this.hide(id),
      update: (content) => this.updateContent(id, content)
    };

    this.popups.set(id, instance);

    // Add to DOM
    this.container.appendChild(element);

    // Apply animation
    requestAnimationFrame(() => {
      this.applyAnimation(element, config.animation || 'fade', 'in');
    });

    // Auto-hide if duration specified
    if (config.duration && config.duration > 0) {
      setTimeout(() => this.hide(id), config.duration);
    }

    // Trigger show callbacks
    this.showCallbacks.forEach(cb => {
      try {
        cb(instance);
      } catch (error) {
        console.error('[PopupManager] Show callback error:', error);
      }
    });

    return instance;
  }

  /**
   * Hide a popup by ID
   * @param {string} popupId - Popup ID to hide
   */
  hide(popupId) {
    const instance = this.popups.get(popupId);
    if (!instance) return;

    const { element, config } = instance;

    // Apply exit animation
    this.applyAnimation(element, config.animation || 'fade', 'out');

    // Remove after animation completes
    setTimeout(() => {
      // Remove from DOM
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // Remove from map
      this.popups.delete(popupId);

      // Trigger hide callbacks
      this.hideCallbacks.forEach(cb => {
        try {
          cb(instance);
        } catch (error) {
          console.error('[PopupManager] Hide callback error:', error);
        }
      });

      // Trigger onClose callback if provided
      if (config.onClose) {
        try {
          config.onClose();
        } catch (error) {
          console.error('[PopupManager] onClose callback error:', error);
        }
      }

      // Process queue if not already processing
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    }, 300); // Animation duration
  }

  /**
   * Hide all popups
   */
  hideAll() {
    const popupIds = Array.from(this.popups.keys());
    popupIds.forEach(id => this.hide(id));
  }

  /**
   * Queue a popup for later display
   * @param {Object} config - Popup configuration
   */
  queue(config) {
    this.queue.push(config);
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  /**
   * Process queued popups
   */
  processQueue() {
    if (this.queue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const config = this.queue.shift();
    
    // Show popup and wait for it to close before showing next
    const instance = this.show(config);
    if (instance) {
      // Override onClose to process next in queue
      const originalOnClose = config.onClose;
      config.onClose = () => {
        if (originalOnClose) originalOnClose();
        setTimeout(() => this.processQueue(), 100);
      };
    } else {
      // If show failed, process next immediately
      this.processQueue();
    }
  }

  /**
   * Register callback for popup show events
   * @param {Function} callback - Callback function
   */
  onShow(callback) {
    if (typeof callback === 'function') {
      this.showCallbacks.push(callback);
    }
  }

  /**
   * Register callback for popup hide events
   * @param {Function} callback - Callback function
   */
  onHide(callback) {
    if (typeof callback === 'function') {
      this.hideCallbacks.push(callback);
    }
  }

  /**
   * Create popup DOM element
   * @param {string} id - Popup ID
   * @param {Object} config - Popup configuration
   * @returns {HTMLElement} Popup element
   */
  createPopupElement(id, config) {
    const popup = document.createElement('div');
    popup.id = id;
    popup.className = `unified-popup unified-popup-${config.type}`;
    popup.style.cssText = `
      position: absolute;
      pointer-events: auto;
      opacity: 0;
      transform: scale(0.9);
      transition: opacity 0.3s, transform 0.3s;
    `;

    // Apply theme
    this.applyTheme(popup, config.theme || 'dark');

    // Apply positioning
    this.applyPosition(popup, config.position || 'center');

    // Apply z-index
    popup.style.zIndex = config.zIndex || (10000 + this.popups.size);

    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'popup-content';
    contentWrapper.style.cssText = `
      padding: 20px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    `;

    // Add content
    if (typeof config.content === 'string') {
      contentWrapper.innerHTML = config.content;
    } else if (config.content instanceof HTMLElement) {
      contentWrapper.appendChild(config.content);
    } else if (config.content && config.content.html) {
      contentWrapper.innerHTML = config.content.html;
    }

    popup.appendChild(contentWrapper);

    // Add close button if requested
    if (config.closeButton !== false) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'popup-close-btn';
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: inherit;
        opacity: 0.6;
        transition: opacity 0.2s;
        padding: 0;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
      `;
      closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
      closeBtn.onmouseout = () => closeBtn.style.opacity = '0.6';
      closeBtn.onclick = () => this.hide(id);
      popup.appendChild(closeBtn);
    }

    // Add modal overlay if requested
    if (config.modal) {
      const overlay = document.createElement('div');
      overlay.className = 'popup-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: -1;
      `;
      overlay.onclick = () => {
        if (config.closeButton !== false) {
          this.hide(id);
        }
      };
      popup.appendChild(overlay);
    }

    return popup;
  }

  /**
   * Apply theme styling to popup
   * @param {HTMLElement} element - Popup element
   * @param {string} theme - Theme name
   */
  applyTheme(element, theme) {
    const themes = {
      dark: {
        background: '#1a1a1a',
        color: '#eee',
        border: '1px solid #444'
      },
      light: {
        background: '#ffffff',
        color: '#333',
        border: '1px solid #ddd'
      },
      success: {
        background: '#4caf50',
        color: '#fff',
        border: '1px solid #45a049'
      },
      warning: {
        background: '#ff9800',
        color: '#fff',
        border: '1px solid #f57c00'
      },
      error: {
        background: '#f44336',
        color: '#fff',
        border: '1px solid #d32f2f'
      },
      info: {
        background: '#2196f3',
        color: '#fff',
        border: '1px solid #1976d2'
      }
    };

    const themeStyle = themes[theme] || themes.dark;
    Object.assign(element.style, {
      background: themeStyle.background,
      color: themeStyle.color,
      border: themeStyle.border,
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    });
  }

  /**
   * Apply positioning to popup
   * @param {HTMLElement} element - Popup element
   * @param {string|Object} position - Position specification
   */
  applyPosition(element, position) {
    // Reset positioning
    element.style.top = '';
    element.style.left = '';
    element.style.right = '';
    element.style.bottom = '';
    element.style.transform = '';

    if (typeof position === 'object' && position.x !== undefined) {
      // Custom coordinates
      element.style.left = `${position.x}px`;
      element.style.top = `${position.y}px`;
    } else if (position === 'center') {
      element.style.left = '50%';
      element.style.top = '50%';
      element.style.transform = 'translate(-50%, -50%)';
    } else if (position === 'top') {
      element.style.left = '50%';
      element.style.top = '20px';
      element.style.transform = 'translateX(-50%)';
    } else if (position === 'bottom') {
      element.style.left = '50%';
      element.style.bottom = '20px';
      element.style.transform = 'translateX(-50%)';
    } else if (position === 'left') {
      element.style.left = '20px';
      element.style.top = '50%';
      element.style.transform = 'translateY(-50%)';
    } else if (position === 'right') {
      element.style.right = '20px';
      element.style.top = '50%';
      element.style.transform = 'translateY(-50%)';
    } else if (position === 'mouse') {
      // Mouse-follow positioning (will be updated on mousemove)
      element.classList.add('mouse-follow');
      const updatePosition = (e) => {
        element.style.left = `${e.clientX + 10}px`;
        element.style.top = `${e.clientY + 10}px`;
      };
      document.addEventListener('mousemove', updatePosition);
      element.dataset.mouseMoveHandler = 'attached';
    }
  }

  /**
   * Apply animation to popup
   * @param {HTMLElement} element - Popup element
   * @param {string} animation - Animation type
   * @param {string} direction - 'in' or 'out'
   */
  applyAnimation(element, animation, direction) {
    if (animation === 'none') {
      element.style.opacity = direction === 'in' ? '1' : '0';
      return;
    }

    if (direction === 'in') {
      element.style.opacity = '1';
      element.style.transform = element.style.transform.replace('scale(0.9)', 'scale(1)');
      
      if (animation === 'slide') {
        element.style.transform += ' translateY(0)';
      } else if (animation === 'bounce') {
        element.style.animation = 'popup-bounce-in 0.5s';
      }
    } else {
      element.style.opacity = '0';
      element.style.transform = element.style.transform.replace('scale(1)', 'scale(0.9)');
      
      if (animation === 'slide') {
        element.style.transform += ' translateY(-20px)';
      }
    }
  }

  /**
   * Update popup content
   * @param {string} popupId - Popup ID
   * @param {string|HTMLElement} content - New content
   */
  updateContent(popupId, content) {
    const instance = this.popups.get(popupId);
    if (!instance) return;

    const contentWrapper = instance.element.querySelector('.popup-content');
    if (!contentWrapper) return;

    if (typeof content === 'string') {
      contentWrapper.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      contentWrapper.innerHTML = '';
      contentWrapper.appendChild(content);
    }
  }
}

// Add bounce animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes popup-bounce-in {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UnifiedPopupManager;
}
