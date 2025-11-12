import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { error } from './stores/errorStore'

window.addEventListener('error', (e) => {
  error.set({ message: e.message, stacktrace: e.stack })
})

window.addEventListener('unhandledrejection', (e) => {
  error.set({
    message: (e.reason?.message || 'Unhandled promise rejection'),
    stacktrace: (e.reason?.stack || e.reason)
  })
})

const app = mount(App, {
  target: document.getElementById('app'),
})

// Notify parent that game is ready
if (window.parent !== window) {
  window.parent.postMessage({ type: 'gameReady', gameId: 'quad-box' }, '*')
}

// Expose settings store for unified system integration
import { settings } from './stores/settingsStore'
import { get } from 'svelte/store'

window.quadBoxStore = {
  getSettings: () => get(settings),
  updateSettings: (updates) => {
    const current = get(settings)
    const mode = current.mode || 'quad'
    
    // Create updated settings object
    const updated = { ...current }
    
    // Update top-level settings
    if (updates.mode !== undefined) updated.mode = updates.mode
    if (updates.theme !== undefined) updated.theme = updates.theme
    if (updates.feedback !== undefined) updated.feedback = updates.feedback
    if (updates.rotationSpeed !== undefined) updated.rotationSpeed = updates.rotationSpeed
    if (updates.enableAutoProgression !== undefined) updated.enableAutoProgression = updates.enableAutoProgression
    
    // Update mode-specific game settings (deep clone to avoid mutation)
    if (updated.gameSettings && updated.gameSettings[mode]) {
      updated.gameSettings = {
        ...updated.gameSettings,
        [mode]: {
          ...updated.gameSettings[mode],
          ...(updates.nBack !== undefined && { nBack: updates.nBack }),
          ...(updates.numTrials !== undefined && { numTrials: updates.numTrials }),
          ...(updates.trialTime !== undefined && { trialTime: updates.trialTime }),
          ...(updates.matchChance !== undefined && { matchChance: updates.matchChance })
        }
      }
    }
    
    // Use the store's set method which handles saving and reactivity
    console.log('🎮 [QUAD-BOX] Before update:', { current, mode })
    console.log('🎮 [QUAD-BOX] Applying updates:', updates)
    console.log('🎮 [QUAD-BOX] Updated object:', updated)
    
    settings.set(updated)
    
    // Verify the update worked
    setTimeout(() => {
      const after = get(settings)
      console.log('🎮 [QUAD-BOX] After update:', { 
        mode: after.mode, 
        nBack: after.gameSettings?.[mode]?.nBack,
        theme: after.theme 
      })
    }, 100)
  }
}

export default app
