# Implementation Plan

- [x] 1. Create D-Prime Calculator Module



  - Create `games/3d-hyper-nback/dprimeCalculator.js` with DPrimeCalculator class
  - Implement trial data accumulation with rolling window (50 trials)
  - Implement z-score calculation with log-linear correction for extreme values
  - Implement d-prime formula: d' = Z(hit rate) - Z(false alarm rate)
  - Implement response bias calculation
  - Add modality-specific metric calculation
  - Add rolling average calculation (last 20 trials)
  - _Requirements: 1.1, 1.3, 3.1, 3.2, 3.3, 3.4_

- [x] 2. Integrate Calculator with Game Loop

  - Import dprimeCalculator into main.js
  - Initialize calculator on game start
  - Hook into trial completion event to call `calculator.addTrial()`
  - Pass trial outcome data (isMatch, responded, correct, modality, timestamp)
  - Ensure calculation completes within 5ms per trial
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 3. Create Live Statistics Overlay
  - Create `games/3d-hyper-nback/liveStatsOverlay.js` with LiveStatsOverlay class
  - Design minimal HUD showing: current d', rolling avg d', hit rate, FA rate
  - Style with semi-transparent background and compact layout
  - Position in top-right corner by default
  - Add CSS for fade-in/out on hover
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4. Wire Overlay to Calculator
  - Initialize LiveStatsOverlay in main.js
  - Update overlay after each trial with latest metrics
  - Add toggle functionality (keyboard shortcut: 'S' key)
  - Implement position configuration (save to localStorage)
  - Handle edge case: display "Calculating..." for first 10 trials
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 5. Remove Automatic Recap Dialog Interruptions

  - Locate recap dialog trigger code in main.js
  - Remove automatic showModal() calls after round completion
  - Keep recap dialog code but make it manual-trigger only
  - Ensure game continues seamlessly after each round
  - _Requirements: 1.2, 1.3_

- [x] 6. Add Manual Statistics Button


  - Add "Stats" button to game UI (top-left corner)
  - Wire button to show detailed statistics modal
  - Pause game timer when modal opens
  - Resume game timer when modal closes
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 7. Create Detailed Statistics Modal
  - Create `games/3d-hyper-nback/detailedStatsModal.js` with DetailedStatsModal class
  - Design modal layout with tabs: Overview, Trends, Modalities
  - Add close button and ESC key handler
  - Implement pause/resume game logic
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 8. Add D-Prime Trend Chart
  - Use Chart.js to create line chart of d-prime over trials
  - Show trial-by-trial d-prime values
  - Add rolling average trend line
  - Highlight baseline (first 20 trials) vs current performance
  - _Requirements: 4.5, 3.3_

- [ ] 9. Add Modality Performance Breakdown
  - Create table showing d-prime for each modality (position, color, shape, audio)
  - Display hit rate and false alarm rate per modality
  - Show trial count per modality
  - Add visual indicators (color coding) for performance levels
  - _Requirements: 3.4, 4.2_

- [ ] 10. Create Session Manager Module
  - Create `games/3d-hyper-nback/sessionManager.js` with SessionManager class
  - Implement session lifecycle: start, end, save
  - Generate unique session IDs (timestamp-based)
  - Track session metadata (nLevel, modalities, start/end time)
  - _Requirements: 5.1, 5.5, 6.1_

- [ ] 11. Implement Trial-by-Trial Data Persistence
  - Save each trial data to localStorage immediately after completion
  - Use key format: `nback-session-{sessionId}-trials`
  - Implement efficient append-only storage
  - Add error handling for storage quota exceeded
  - _Requirements: 6.1, 6.2, 3.5_

- [ ] 12. Implement Session History Management
  - Save session summary to localStorage on session end
  - Use key format: `nback-session-history`
  - Maintain array of last 100 sessions
  - Implement LRU eviction when storage limit reached
  - _Requirements: 6.2, 6.5_

- [ ] 13. Add End-of-Session Summary
  - Create summary modal triggered on manual session end
  - Display: session-wide d-prime average, peak d-prime, improvement rate
  - Show performance breakdown by modality
  - Compare to previous session (if available)
  - Add "Continue Training" and "End Session" buttons
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 14. Implement Baseline Calculation
  - Calculate baseline d-prime from first 20 trials of session
  - Store baseline in session data
  - Display baseline comparison in detailed stats and summary
  - _Requirements: 6.3, 5.4_

- [ ] 15. Add Data Export Functionality
  - Add "Export Data" button to detailed stats modal
  - Generate JSON export of current session
  - Include: all trials, metrics, session metadata
  - Trigger browser download of JSON file
  - _Requirements: 6.4_

- [ ] 16. Handle Edge Cases and Errors
  - Add minimum trial check (10 trials) before showing d-prime
  - Implement log-linear correction for perfect performance (hit rate = 1.0 or FA rate = 0.0)
  - Handle no-match scenarios gracefully (display "N/A")
  - Add try-catch blocks around calculations
  - Implement localStorage error recovery (queue in memory, retry)
  - _Requirements: 3.1, 3.2, 6.5_

- [ ] 17. Add User Preferences
  - Create preferences object in localStorage: `nback-preferences`
  - Add settings: overlay position, overlay visibility, auto-show summary
  - Add preferences UI in settings menu
  - Apply preferences on game load
  - _Requirements: 2.5_

- [ ] 18. Optimize Performance
  - Profile calculation time (target: <5ms per trial)
  - Optimize rolling window implementation (use circular buffer)
  - Minimize DOM updates (batch updates, use requestAnimationFrame)
  - Test with 1000+ trials to ensure no memory leaks
  - _Requirements: 1.3_

- [ ] 19. Add Visual Polish
  - Add smooth transitions for overlay updates
  - Implement color coding for d-prime levels (green: >2.0, yellow: 1.0-2.0, red: <1.0)
  - Add subtle animations for metric changes
  - Ensure consistent styling with game theme
  - _Requirements: 2.1, 2.5_

- [ ] 20. Update Game UI and Controls
  - Add keyboard shortcut documentation (S: toggle stats, D: detailed stats)
  - Update help/info modal with new features
  - Add tooltips to stats overlay elements
  - Ensure mobile-friendly touch controls
  - _Requirements: 4.1_

- [ ]* 21. Write Unit Tests
  - Test DPrimeCalculator with various trial sequences
  - Test edge cases: perfect performance, no matches, insufficient data
  - Test z-score calculation and log-linear correction
  - Test rolling window behavior
  - Test modality-specific calculations
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 22. Write Integration Tests
  - Test calculator integration with game loop
  - Test overlay updates during gameplay
  - Test modal pause/resume behavior
  - Test data persistence and recovery
  - Test session history management
  - _Requirements: 1.1, 1.2, 2.2, 4.3, 6.1_

- [ ]* 23. Performance Testing
  - Measure calculation time per trial (target: <5ms)
  - Test memory usage with 1000 trials (target: <10MB)
  - Test localStorage usage with 100 sessions (target: <5MB)
  - Profile and optimize bottlenecks
  - _Requirements: 1.3_

- [ ]* 24. User Acceptance Testing
  - Test uninterrupted training flow
  - Verify statistics accuracy
  - Test all UI interactions
  - Verify data persistence across sessions
  - Test on multiple browsers
  - _Requirements: 1.2, 2.1, 4.1, 6.1_
