# Implementation Plan

- [x] 1. Set up project structure and core interfaces



  - Create directory structure for Syllogimous integration
  - Define TypeScript interfaces for all data models (Question, Session, Profile, Settings)
  - Set up testing framework (Jest/Vitest) with fast-check for property-based testing
  - _Requirements: All requirements - foundational setup_

- [x] 2. Implement Unified Popup Manager


- [x] 2.1 Create popup manager core functionality


  - Implement PopupManager class with show/hide/hideAll methods
  - Implement popup configuration interface (type, position, theme, animation)
  - Implement popup instance management with unique IDs
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2.2 Implement popup positioning system

  - Implement center, top, bottom, left, right positioning
  - Implement mouse-follow positioning
  - Implement custom coordinate positioning
  - Add responsive positioning for mobile devices
  - _Requirements: 2.3_

- [x] 2.3 Implement popup theming and animations

  - Create CSS themes (dark, light, success, warning, error, info)
  - Implement animations (fade, slide, scale, bounce, none)
  - Add GPU-accelerated CSS transforms
  - _Requirements: 2.4, 2.5_

- [x] 2.4 Implement popup queue and stack management

  - Implement queue system for sequential popups
  - Implement stack system for simultaneous popups
  - Add z-index management for stacked popups
  - _Requirements: 2.6_

- [x] 2.5 Implement popup cleanup and callbacks

  - Implement DOM cleanup on popup close
  - Implement callback system (onShow, onHide, onClose)
  - Add event listener cleanup
  - _Requirements: 2.7, 2.8_

- [ ]* 2.6 Write property test for popup manager
  - **Property 5: Popup manager centralization**
  - **Property 6: Popup configuration completeness**
  - **Property 7: Popup queue ordering**
  - **Property 8: Popup cleanup completeness**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8**

- [x] 3. Implement Explanation Renderer


- [x] 3.1 Create explanation renderer core



  - Implement ExplanationRenderer class
  - Implement question type detection
  - Implement render method dispatcher
  - _Requirements: 3.1, 3.2_

- [x] 3.2 Implement 2D grid visualization

  - Implement createGridFromMap for 2D coordinates
  - Implement HTML table rendering with centered text
  - Add color-coding for word positions
  - _Requirements: 3.3_

- [x] 3.3 Implement 3D grid visualization

  - Implement layered 2D grid rendering
  - Add CSS perspective transforms for depth
  - Implement plane labeling
  - _Requirements: 3.4_

- [x] 3.4 Implement 4D space-time visualization

  - Implement multiple 3D grid rendering
  - Add time slice labeling
  - Implement horizontal layout for time progression
  - _Requirements: 3.5_

- [x] 3.5 Implement distinction bucket visualization

  - Implement bucket grouping renderer
  - Add visual separators between buckets
  - Implement flexbox layout for buckets
  - _Requirements: 3.6_

- [x] 3.6 Implement linear sequence visualization

  - Implement ordered sequence renderer
  - Add directional arrows between items
  - Implement comparison operator display
  - _Requirements: 3.7, 3.8_

- [x] 3.7 Implement binary nested visualization

  - Implement recursive sub-explanation rendering
  - Add visual separators between sub-results
  - Handle deep nesting gracefully
  - _Requirements: 3.9_

- [x] 3.8 Integrate explanation renderer with popup manager

  - Connect explanation button to popup manager
  - Implement hover preview tooltips
  - Add explanation close handling
  - _Requirements: 3.10, 3.11, 3.12_

- [ ]* 3.9 Write property test for explanation renderer
  - **Property 9: Explanation visualization correctness**
  - **Validates: Requirements 3.1-3.12**

- [x] 4. Implement Tutorial and Tips System



- [x] 4.1 Create tips manager

  - Implement TipsManager class
  - Implement tip dismissal tracking in localStorage
  - Implement tip reset functionality
  - _Requirements: 4.7_

- [x] 4.2 Implement contextual tip triggers

  - Implement first-time play detection
  - Implement new question type detection
  - Implement struggle detection (low accuracy threshold)
  - Implement milestone detection
  - Implement feature enable detection
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4.3 Create tip content library

  - Write introductory tutorial content
  - Write question type explanation content
  - Write strategy tip content
  - Write milestone congratulation content
  - Write feature explanation content
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4.4 Integrate tips with popup manager

  - Connect tip triggers to popup manager
  - Apply appropriate styling for tips
  - Implement tip dismissal callbacks
  - _Requirements: 4.6_

- [ ]* 4.5 Write property test for tips system
  - **Property 10: Tutorial and tips contextual display**
  - **Property 11: Tip dismissal persistence**
  - **Validates: Requirements 4.1-4.7**

- [-] 5. Implement Question Generator (v3 features)






- [ ] 5.1 Create question generator base
  - Implement QuestionGenerator base class
  - Implement question type registry
  - Implement random question type selection with weights


  - _Requirements: 5.1_

- [ ] 5.2 Implement distinction question generator
  - Implement same/opposite relationship logic
  - Implement bucket creation
  - Implement conclusion generation
  - _Requirements: 5.1_

- [ ] 5.3 Implement linear question generator
  - Implement directional relationship logic (left/right, top/under, comparison, temporal, contains)
  - Implement sequence creation
  - Implement 180° mode for direction flipping
  - _Requirements: 5.1_

- [ ] 5.4 Implement spatial question generators
  - Implement 2D spatial (8 directions)
  - Implement 3D spatial (26 directions)
  - Implement 4D space-time (with temporal dimension)
  - Implement anchor space (diamond starting pattern)
  - _Requirements: 5.1_

- [ ] 5.5 Implement syllogism question generator
  - Implement categorical logic (All/Some/No)
  - Implement valid/invalid syllogism generation
  - _Requirements: 5.1_

- [ ] 5.6 Implement binary question generator
  - Implement nested binary logic
  - Implement recursive sub-question generation
  - Implement configurable nesting depth
  - _Requirements: 5.1_

- [ ] 5.7 Implement analogy question generator
  - Implement "A is to B as C is to D" logic
  - Implement analogy wrapping for other question types
  - _Requirements: 5.1_

- [ ] 5.8 Implement negation and meta-relation modifiers
  - Implement negation wrapper (invert red text)
  - Implement meta-relation wrapper (nested relations)
  - _Requirements: 5.1_

- [ ] 5.9 Implement stimuli generation
  - Implement nonsense word generator (configurable length)
  - Implement garbage word generator (configurable length)
  - Implement meaningful word selection (nouns/adjectives)
  - Implement emoji selection
  - Implement voronoi emoji generation
  - Implement visual noise overlay
  - _Requirements: 5.2_

- [ ] 5.10 Implement difficulty modifiers
  - Implement scramble factor (premise reordering)
  - Implement connection branching (words in >2 premises)
  - Implement spoiler conclusion mode
  - _Requirements: 5.3_

- [ ]* 5.11 Write property test for question generation
  - **Property 12: Feature availability completeness (v3 features)**
  - **Validates: Requirements 5.1-5.12**

- [ ] 5.12 Implement fill-in-the-blank question mode
- [ ] 5.12.1 Implement answer mode selection logic
  - Implement logic to choose between validity, fill-in-the-blank, or mixed mode
  - Implement random mode selection for mixed mode
  - _Requirements: 8.8, 8.9_

- [ ] 5.12.2 Implement element hiding logic
  - Implement random selection of premise or conclusion to hide
  - Store hidden element index and correct answer
  - _Requirements: 8.1_

- [ ] 5.12.3 Implement alternative generation
  - Generate 3-5 plausible but incorrect alternatives
  - Ensure grammatical consistency with question structure
  - Ensure logical distinctness from correct answer
  - _Requirements: 8.2, 8.5_

- [ ] 5.12.4 Implement fill-in-the-blank UI components
  - Create blank placeholder display
  - Create multiple choice button/option display
  - Implement option selection handling
  - Implement correct answer highlighting on incorrect response
  - _Requirements: 8.3, 8.7_

- [ ] 5.12.5 Implement fill-in-the-blank answer checking
  - Compare selected option with correct answer
  - Handle string matching and semantic equivalence
  - Provide appropriate feedback
  - _Requirements: 8.4, 8.6_

- [ ] 5.12.6 Update statistics tracking for answer modes
  - Track separate accuracy for validity vs fill-in-the-blank
  - Store answer mode with each question record
  - Calculate mode-specific metrics
  - Display mode breakdown in statistics
  - _Requirements: 8.10_

- [ ] 6. Implement Settings System (v3 features)
- [ ] 6.1 Create settings manager
  - Implement SettingsManager class
  - Implement settings validation
  - Implement settings persistence to localStorage
  - Implement settings loading with defaults
  - _Requirements: 5.4, 5.5, 5.6, 5.7, 11.3, 11.4_

- [ ] 6.2 Implement profile system
  - Implement profile creation, switching, deletion
  - Implement profile import/export
  - Implement profile sharing via URL encoding
  - _Requirements: 5.7_

- [ ] 6.3 Implement appearance settings
  - Implement background image upload and storage
  - Implement color theme customization
  - Implement dark/light mode toggle
  - Implement sound effects system (game/zen/none)
  - Implement fast UI mode toggle
  - Implement minimal mode toggle
  - Implement wide premises mode toggle
  - _Requirements: 5.6_

- [ ] 6.4 Implement keyboard shortcuts
  - Implement Space (start game)
  - Implement Esc (end game)
  - Implement PgUp/PgDn (mode switching)
  - Implement custom keybinds for true/false
  - _Requirements: 5.11_

- [ ] 6.5 Implement carousel mode
  - Implement premise-by-premise display
  - Implement navigation controls (back/next)
  - Implement progress indicator
  - _Requirements: 5.12_

- [ ]* 6.6 Write property test for settings system
  - **Property 1: Settings persistence round-trip**
  - **Property 16: Settings synchronization bidirectionality**
  - **Validates: Requirements 5.4-5.12, 11.1-11.4**

- [ ] 7. Implement Timer System
- [ ] 7.1 Create timer system base
  - Implement TimerSystem class
  - Implement countdown timer with visual bar
  - Implement timer pause/resume
  - _Requirements: 5.5_

- [ ] 7.2 Implement custom timer mode
  - Implement per-question-type timer configuration
  - Implement timer override display
  - _Requirements: 5.5_

- [ ] 7.3 Implement adaptive timer mode (v4 algorithm)
  - Implement last 10 questions analysis
  - Implement correctness/incorrectness/timeout rate adjustments
  - Implement new level bonus
  - Implement negation bonus
  - Implement meta-relation bonus
  - Implement fallback to defaults when insufficient data
  - _Requirements: 6.3, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ]* 7.4 Write property test for adaptive timer
  - **Property 14: Adaptive timer calculation accuracy**
  - **Validates: Requirements 8.1-8.6**

- [ ] 8. Implement Progress Tracking System
- [ ] 8.1 Create progress tracker
  - Implement ProgressTracker class
  - Implement trailing progress storage (last N questions)
  - Implement success/failure rate calculation
  - _Requirements: 5.8, 7.1_

- [ ] 8.2 Implement auto-progression logic
  - Implement threshold checking (success/failure percentages)
  - Implement difficulty increase strategy (decrease timer OR increase premises)
  - Implement difficulty decrease strategy (increase timer OR decrease premises)
  - Implement progression grouping modes (simple/separate)
  - _Requirements: 5.4, 7.2, 7.3, 7.4, 7.5_

- [ ] 8.3 Implement progression change modes
  - Implement auto mode (calculate optimal timer from percentiles)
  - Implement custom mode (fixed time drop/bump amounts)
  - _Requirements: 5.4_

- [ ] 8.4 Implement progression visualization
  - Implement trailing progress indicator (colored dots)
  - Implement daily progress bar
  - Implement weekly progress bar
  - _Requirements: 5.8_

- [ ] 8.5 Implement progression feedback
  - Implement level change notification popup
  - Implement visual feedback for progression trigger
  - _Requirements: 7.6, 14.4_

- [ ]* 8.6 Write property test for auto-progression
  - **Property 13: Auto-progression threshold logic**
  - **Validates: Requirements 7.1-7.7**

- [ ] 9. Implement Stats Engine
- [ ] 9.1 Create stats engine core
  - Implement StatsEngine class
  - Implement session storage to IndexedDB
  - Implement session retrieval and filtering
  - _Requirements: 5.10, 6.2_

- [ ] 9.2 Implement type-based statistics (v4)
  - Implement per-question-type stats
  - Implement premise-level breakdown (2, 3, 4, 5, 6+)
  - Implement last 10 questions metrics
  - _Requirements: 6.2_

- [ ] 9.3 Implement metric calculations
  - Implement accuracy calculation (correct / total * 100)
  - Implement response time calculation with outlier filtering
  - Implement difficulty score calculation
  - Implement progression rate calculation (linear regression)
  - Implement confidence interval calculation
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 9.4 Implement history display
  - Implement question history list with all details
  - Implement response time display
  - Implement explanation button integration
  - _Requirements: 5.9_

- [ ] 9.5 Implement statistics display
  - Implement total time, average time, average correct time
  - Implement percent correct
  - Implement per-question-type breakdowns
  - _Requirements: 5.10_

- [ ] 9.6 Implement stats export (v4)
  - Implement JSON export
  - Implement CSV export
  - _Requirements: 6.9_

- [ ]* 9.7 Write property test for metrics calculations
  - **Property 18: Metrics calculation correctness**
  - **Validates: Requirements 13.1-13.5**

- [ ] 10. Implement Time Tracking System
- [ ] 10.1 Create time tracking service
  - Implement TimeTrackingService class
  - Implement session start timestamp recording
  - Implement session end timestamp recording
  - Implement duration calculation (end - start)
  - _Requirements: 9.1, 9.2_

- [ ] 10.2 Implement game-specific time tracking
  - Implement per-game time storage
  - Implement per-question-type time tracking
  - _Requirements: 9.3_

- [ ] 10.3 Implement time aggregation
  - Implement total time per game calculation
  - Implement daily time calculation (4am cutoff)
  - Implement weekly time calculation (Monday 4am cutoff)
  - Implement time distribution across games
  - _Requirements: 9.4, 9.5, 9.6_

- [ ] 10.4 Integrate time tracking with cognitive system
  - Connect time tracking to cognitive progression system
  - Implement weighted cognitive score contributions by time
  - _Requirements: 9.7_

- [ ]* 10.5 Write property test for time tracking
  - **Property 15: Time tracking accuracy**
  - **Validates: Requirements 9.1-9.7**

- [ ] 11. Implement Cognitive Integration
- [ ] 11.1 Create cognitive integration service
  - Implement CognitiveIntegrationService class
  - Implement question-to-domain mapping
  - Implement cognitive score normalization (0-999 inverted scale)
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 11.2 Implement domain mappings
  - Implement distinction → executive functions (0.70) + working memory (0.50)
  - Implement linear → working memory (0.80) + executive functions (0.60)
  - Implement spatial 2D → perceptual processing (0.85) + working memory (0.70)
  - Implement spatial 3D → perceptual processing (0.90) + working memory (0.75)
  - Implement syllogism → executive functions (0.85) + long-term memory (0.40)
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 11.3 Implement session lifecycle integration
  - Implement cognitive session start
  - Implement cognitive session end with domain updates
  - Implement cognitive score updates
  - _Requirements: 1.4_

- [ ] 11.4 Integrate with unified cognitive progression system
  - Connect to existing CognitiveProgressionSystem
  - Implement data format conversion
  - Implement error handling for integration failures
  - _Requirements: 1.4_

- [ ]* 11.5 Write property test for cognitive mapping
  - **Property 17: Cognitive domain mapping accuracy**
  - **Validates: Requirements 12.1-12.6**

- [ ] 12. Implement Visual Feedback System
- [ ] 12.1 Create feedback system
  - Implement FeedbackSystem class
  - Implement feedback animation triggers
  - _Requirements: 14.1, 14.2, 14.3_

- [ ] 12.2 Implement feedback animations
  - Implement green success animation (correct answer)
  - Implement red failure animation (incorrect answer)
  - Implement yellow timeout animation (time expired)
  - Implement level change notification animation
  - Implement settings sync indicator animation
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 12.3 Implement fast UI mode
  - Implement minimal feedback for fast UI mode
  - Implement animation disabling
  - Implement button swap disabling
  - _Requirements: 14.6_

- [ ] 12.4 Implement sound effects
  - Implement sound effect system (game/zen/none)
  - Implement success sound
  - Implement failure sound
  - Implement timeout sound
  - Implement volume fade-out
  - _Requirements: 5.6_

- [ ]* 12.5 Write property test for visual feedback
  - **Property 19: Visual feedback appropriateness**
  - **Validates: Requirements 14.1-14.6**

- [ ] 13. Implement Syllogimous Service Integration
- [ ] 13.1 Create Syllogimous service
  - Implement SyllogimousService class
  - Implement game state management
  - Implement question lifecycle (generate → display → answer → feedback)
  - _Requirements: 1.1_

- [ ] 13.2 Implement settings synchronization
  - Implement reactive settings proxy
  - Implement bidirectional sync (UI ↔ game)
  - Implement change detection and propagation
  - Implement visual sync indicator
  - _Requirements: 11.1, 11.2_

- [ ] 13.3 Implement session management
  - Implement session start
  - Implement question recording
  - Implement session end
  - Implement session summary generation
  - _Requirements: 1.3, 1.4_

- [ ] 13.4 Integrate all subsystems
  - Connect question generator
  - Connect timer system
  - Connect progress tracker
  - Connect stats engine
  - Connect feedback system
  - Connect cognitive integration
  - Connect time tracking
  - _Requirements: All requirements_

- [ ]* 13.5 Write property test for session data
  - **Property 2: Session data completeness**
  - **Property 3: Data persistence integrity**
  - **Validates: Requirements 1.3, 1.4**

- [ ] 14. Implement v4 Angular Components (if using Angular architecture)
- [ ] 14.1 Create card component
  - Implement question display card
  - Implement premise rendering
  - Implement conclusion rendering
  - _Requirements: 6.5_

- [ ] 14.2 Create feedback page component
  - Implement detailed results display
  - Implement explanation integration
  - _Requirements: 6.6_

- [ ] 14.3 Create tier matrix component
  - Implement tier display with score ranges
  - Implement tier colors
  - _Requirements: 6.7_

- [ ] 14.4 Create playground mode
  - Implement separate statistics tracking for practice
  - Implement playground mode toggle
  - _Requirements: 6.8_

- [ ] 14.5 Create tutorial system
  - Implement comprehensive tutorial pages
  - Implement tutorial navigation
  - _Requirements: 6.10_

- [ ] 15. Implement Game Loading and Cleanup
- [ ] 15.1 Implement game loading
  - Implement Syllogimous game registration
  - Implement game initialization
  - Implement settings restoration
  - _Requirements: 1.1, 1.2_

- [ ] 15.2 Implement resource cleanup
  - Implement event listener cleanup
  - Implement timer cleanup
  - Implement DOM cleanup
  - Implement state preservation
  - _Requirements: 1.5_

- [ ]* 15.3 Write property test for cleanup
  - **Property 4: Resource cleanup preservation**
  - **Validates: Requirements 1.5**

- [ ] 16. Implement Analytics Dashboard Integration
- [ ] 16.1 Add Syllogimous to analytics dashboard
  - Implement Syllogimous-specific metrics display
  - Implement timeline chart for Syllogimous
  - Implement breakdown chart for question types
  - _Requirements: 10.1_

- [ ] 16.2 Implement cognitive domain visualization
  - Display Syllogimous contributions to cognitive domains
  - Implement domain score charts
  - _Requirements: 10.2_

- [ ] 16.3 Implement time tracking visualization
  - Display Syllogimous time alongside other games
  - Implement time distribution charts
  - Implement daily/weekly time displays
  - _Requirements: 10.3_

- [ ] 16.4 Implement trend visualization
  - Display Syllogimous performance trends
  - Implement linear regression visualization
  - _Requirements: 10.4_

- [ ] 16.5 Implement achievement display
  - Display Syllogimous-specific achievements
  - Implement achievement unlock notifications
  - _Requirements: 10.5_

- [ ] 17. Integration Testing and Bug Fixes
- [ ] 17.1 Test complete game flow
  - Test game loading
  - Test question generation for all types
  - Test answering and feedback
  - Test session end and data persistence
  - _Requirements: All requirements_

- [ ] 17.2 Test settings synchronization
  - Test UI → game sync
  - Test game → UI sync
  - Test localStorage persistence
  - Test profile switching
  - _Requirements: 11.1-11.5_

- [ ] 17.3 Test popup system
  - Test all popup types
  - Test all positions and themes
  - Test queue and stack management
  - Test cleanup
  - _Requirements: 2.1-2.8, 3.1-3.12, 4.1-4.7_

- [ ] 17.4 Test auto-progression
  - Test threshold triggers
  - Test difficulty adjustments
  - Test visual feedback
  - _Requirements: 7.1-7.7_

- [ ] 17.5 Test time tracking
  - Test session timing
  - Test aggregations
  - Test cognitive integration
  - _Requirements: 9.1-9.7_

- [ ] 17.6 Test cognitive integration
  - Test domain mappings
  - Test score calculations
  - Test database updates
  - _Requirements: 12.1-12.6_

- [ ] 17.7 Fix identified bugs
  - Address any issues found during testing
  - Verify fixes with additional tests
  - _Requirements: All requirements_

- [ ] 18. Implement Neuroscience Metrics Engine
- [ ] 18.1 Create neuroscience metrics engine core
  - Implement NeuroscienceMetricsEngine class
  - Implement data collection from game sessions
  - Implement score normalization (0-100 scale)
  - _Requirements: 15.10_

- [ ] 18.2 Implement cognitive flexibility calculation
  - Implement question type transition tracking
  - Calculate switch cost (time penalty on type change)
  - Calculate adaptation rate (recovery speed)
  - Calculate type variety score
  - _Requirements: 15.1_

- [ ] 18.3 Implement interference resistance calculation
  - Track accuracy on questions with negations
  - Track accuracy on questions with red herrings
  - Calculate complexity handling score
  - Aggregate into interference resistance score
  - _Requirements: 15.2_

- [ ] 18.4 Implement pattern recognition speed calculation
  - Measure time to first interaction
  - Track learning curve on repeated patterns
  - Calculate transfer ability to novel patterns
  - Aggregate into pattern recognition score
  - _Requirements: 15.3_

- [ ] 18.5 Implement strategic thinking calculation
  - Measure planning time before answer
  - Track error recovery patterns
  - Calculate solution efficiency
  - Aggregate into strategic thinking score
  - _Requirements: 15.4_

- [ ] 18.6 Implement brain visualization
  - Create SVG brain diagram with labeled regions
  - Implement color intensity mapping (0-100 scale)
  - Implement interactive hover tooltips
  - Implement animated transitions
  - Implement responsive design for mobile
  - _Requirements: 15.5, 15.6, 15.7, 15.8_

- [ ] 18.7 Implement historical trend tracking
  - Store neuroscience metrics over time
  - Implement trend visualization charts
  - Calculate improvement rates
  - _Requirements: 15.9_

- [ ]* 18.8 Write property test for neuroscience metrics
  - **Property 20: Neuroscience metrics calculation accuracy**
  - **Property 21: Brain visualization correctness**
  - **Validates: Requirements 15.1-15.10**

- [ ] 19. Implement Three.js Explanation System
- [ ] 19.1 Set up Three.js infrastructure
  - Add Three.js library dependency
  - Create ThreeJSExplanationRenderer class
  - Implement WebGL detection
  - Implement fallback to 2D HTML
  - _Requirements: 16.15, 16.17_

- [ ] 19.2 Implement Brilliant.org-inspired aesthetic system
  - Define color palette (white background, soft pastels)
  - Create material presets (MeshStandardMaterial with subtle glow)
  - Implement lighting setup (soft ambient + warm directional)
  - Configure soft shadow mapping (PCFSoftShadowMap)
  - _Requirements: 16.12, 16.13, 16.14, 16.15_

- [ ] 19.3 Implement scene setup utilities
  - Implement scene creation with white background
  - Implement camera setup (perspective camera)
  - Implement OrbitControls for mouse interaction
  - Implement touch gesture support for mobile
  - Implement animation loop with requestAnimationFrame
  - _Requirements: 16.2, 16.3, 16.4, 16.11, 16.17, 16.19_

- [ ] 19.4 Implement GSAP animation system
  - Add GSAP library dependency
  - Create entrance animation helper (scale from 0 with fade)
  - Implement stagger animation system (100-150ms delays)
  - Configure easing functions (back.out, power2.out, power1.inOut)
  - _Requirements: 16.21, 16.22_

- [ ] 19.5 Implement aesthetic utilities
  - Create subtle grid helper (light gray, low opacity)
  - Create soft sphere helper (white with colored glow)
  - Create text sprite helper (dark gray text)
  - Create connection line helper (subtle gray)
  - _Requirements: 16.12, 16.13, 16.14, 16.15, 16.16_

- [ ] 19.6 Implement 2D spatial visualization with Brilliant aesthetic
  - Create subtle flat grid on XY plane (light gray, low opacity)
  - Create soft spheres at 2D coordinates (white with blue glow)
  - Position text sprites above spheres (dark gray text)
  - Animate entrance with staggered fade and scale
  - _Requirements: 16.5, 16.12, 16.13, 16.21, 16.22_

- [ ] 19.7 Implement 3D spatial visualization with Brilliant aesthetic
  - Create subtle 3D grid helpers (XY and XZ planes)
  - Create soft white spheres at 3D coordinates with colored glow
  - Position text sprites above spheres
  - Add subtle connection lines to ground (light gray)
  - Animate entrance with staggered bounce effect
  - _Requirements: 16.6, 16.12, 16.13, 16.14, 16.15, 16.21, 16.22_

- [ ] 19.8 Implement 4D space-time visualization with Brilliant aesthetic
  - Create multiple 3D scenes for time slices
  - Add soft time labels (purple text)
  - Create glowing spheres with green emissive
  - Position scenes horizontally with spacing
  - Implement smooth camera animation through time
  - _Requirements: 16.7, 16.12, 16.13, 16.21, 16.22_

- [ ] 19.9 Implement linear sequence visualization with Brilliant aesthetic
  - Create smooth curved path using CatmullRomCurve3
  - Add white tube geometry with blue glow along path
  - Position text sprites along path
  - Add subtle directional arrows (light gray)
  - Animate entrance with sequential stagger
  - _Requirements: 16.8, 16.12, 16.13, 16.21, 16.22_

- [ ] 19.10 Implement distinction cluster visualization with Brilliant aesthetic
  - Create separated 3D clusters with different pastel colors
  - Create soft spheres with color-coded emissive glow
  - Add subtle bounding boxes (low opacity)
  - Implement random positioning within clusters
  - Animate entrance with cluster-based stagger
  - _Requirements: 16.9, 16.12, 16.13, 16.14, 16.21, 16.22_

- [ ] 19.11 Implement binary nested visualization with Brilliant aesthetic
  - Create tree structure with white spheres
  - Implement recursive rendering with depth-based glow intensity
  - Add subtle connection lines between nodes (light gray)
  - Implement proper spacing for hierarchy
  - Animate entrance with depth-based stagger
  - _Requirements: 16.10, 16.12, 16.13, 16.14, 16.15, 16.21, 16.22_

- [ ] 19.12 Implement performance optimizations
  - Use instanced meshes for repeated geometries
  - Implement frustum culling
  - Implement LOD (Level of Detail) system
  - Limit particle count on mobile devices
  - Monitor and maintain 60fps
  - _Requirements: 16.17_

- [ ] 19.13 Implement resource cleanup
  - Dispose geometries on scene cleanup
  - Dispose materials on scene cleanup
  - Dispose textures on scene cleanup
  - Remove event listeners
  - Stop animation loop
  - _Requirements: 16.1_

- [ ] 19.14 Integrate with popup system
  - Connect 3D renderer to unified popup manager
  - Implement 3D/2D mode toggle in settings
  - Add loading indicator for 3D scene initialization
  - Handle rendering errors gracefully
  - _Requirements: 16.1, 16.20_

- [ ]* 19.15 Write property test for Three.js system
  - **Property 22: Three.js scene rendering completeness**
  - **Property 23: Three.js interaction responsiveness**
  - **Property 24: Three.js graceful degradation**
  - **Validates: Requirements 16.1-16.22**

- [ ] 20. Test New Features
- [ ] 20.1 Test neuroscience metrics
  - Test all metric calculations with sample data
  - Test brain visualization rendering
  - Test historical trend tracking
  - Verify score normalization
  - _Requirements: 15.1-15.10_

- [ ] 20.2 Test Three.js explanations
  - Test all question type visualizations with Brilliant aesthetic
  - Test interaction controls (rotate, zoom, pan)
  - Test mobile touch gestures
  - Test animation smoothness and timing
  - Test color palette and visual consistency
  - Test performance on various devices (60fps target)
  - Test fallback to 2D mode
  - Test resource cleanup
  - _Requirements: 16.1-16.22_

- [ ] 20.3 Fix identified bugs in new features
  - Address any issues found during testing
  - Verify fixes with additional tests
  - _Requirements: 15.1-15.10, 16.1-16.22_

- [ ] 21. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
