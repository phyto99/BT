# Implementation Plan

- [ ] 1. Set up enhanced stimuli generation system
  - Create StimuliService with all generation methods
  - Implement nonsense word generator with consonant-vowel alternation
  - Implement garbage word generator with consonant-only logic
  - Add meaningful word selection (nouns/adjectives)
  - Add emoji and junk emoji support
  - Add visual noise tag generation
  - Implement stimuli cycling for even distribution
  - Add uniqueness validation within questions
  - _Requirements: 1.1-1.12_

- [ ]* 1.1 Write property test for nonsense word pattern
  - **Property 1: Nonsense Word Pattern Consistency**
  - **Validates: Requirements 1.2**

- [ ]* 1.2 Write property test for banned pattern filtering
  - **Property 2: Nonsense Word Pattern Filtering**
  - **Validates: Requirements 1.3**

- [ ]* 1.3 Write property test for garbage word uniqueness
  - **Property 3: Garbage Word Consonant Uniqueness**
  - **Validates: Requirements 1.5**

- [ ]* 1.4 Write property test for stimuli distribution
  - **Property 4: Stimuli Type Distribution**
  - **Validates: Requirements 1.10**

- [ ]* 1.5 Write property test for stimuli uniqueness
  - **Property 5: Stimuli Uniqueness Within Question**
  - **Validates: Requirements 1.11**

- [ ]* 1.6 Write property test for stimuli fallback
  - **Property 6: Stimuli Type Fallback**
  - **Validates: Requirements 1.12**

- [ ] 2. Integrate stimuli service with question generation
  - Inject StimuliService into SyllogimousService
  - Replace hardcoded word arrays with stimuli service calls
  - Add stimuli settings to Settings model
  - Update all question generation methods to use stimuli service
  - Add stimuli configuration UI in settings
  - _Requirements: 1.1-1.12_

- [ ] 3. Implement 180° backtracking linear questions
  - Create LinearGenerator class for each wording type
  - Implement bucket-based logic for word positioning
  - Add backwards relationship generation
  - Implement connection branching support
  - Add comparison operator conclusions (less than, equal to, greater than)
  - Calculate ideal distance for conclusion pairs
  - Store bucket data for visualization
  - _Requirements: 2.1-2.8_

- [ ]* 3.1 Write property test for backtracking backwards relationships
  - **Property 7: Backtracking Allows Backwards Relationships**
  - **Validates: Requirements 2.1**

- [ ]* 3.2 Write property test for bucket structure
  - **Property 8: Backtracking Uses Bucket Structure**
  - **Validates: Requirements 2.2, 2.6**

- [ ]* 3.3 Write property test for branching support
  - **Property 9: Backtracking Supports Branching**
  - **Validates: Requirements 2.3**

- [ ]* 3.4 Write property test for conclusion format
  - **Property 10: Backtracking Conclusion Format**
  - **Validates: Requirements 2.4**

- [ ]* 3.5 Write property test for distance calculation
  - **Property 11: Backtracking Distance Calculation**
  - **Validates: Requirements 2.5**

- [ ] 4. Implement multiple linear wording types
  - Create LinearGenerator for "left of/right of" wording
  - Create LinearGenerator for "on top of/under" wording
  - Create LinearGenerator for "more than/less than" wording
  - Create LinearGenerator for "before/after" wording
  - Create LinearGenerator for "contains/is within" wording
  - Implement weighted random selection for wording types
  - Add wording configuration to Settings model
  - Add wording selection UI in settings
  - _Requirements: 3.1-3.10_

- [ ]* 4.1 Write property test for wording weight distribution
  - **Property 12: Linear Wording Weight Distribution**
  - **Validates: Requirements 3.6**

- [ ]* 4.2 Write property test for minimal symbol consistency
  - **Property 13: Linear Minimal Symbol Consistency**
  - **Validates: Requirements 3.9**

- [ ]* 4.3 Write property test for wording consistency
  - **Property 14: Linear Wording Consistency**
  - **Validates: Requirements 3.10**

- [ ] 5. Implement spatial 2D questions
  - Create SpatialGeneratorService
  - Implement 8-direction grid system (N, S, E, W, NE, NW, SE, SW)
  - Assign random [x, y] coordinates within grid bounds
  - Generate spatial premises from coordinate map
  - Store wordCoordMap for visualization
  - Ensure coordinate uniqueness per word
  - Add spatial 2D configuration to Settings
  - _Requirements: 4.1, 4.5, 4.6, 4.9, 4.10_

- [ ]* 5.1 Write property test for 2D direction validity
  - **Property 15: Spatial 2D Direction Validity**
  - **Validates: Requirements 4.1**

- [ ]* 5.2 Write property test for coordinate map presence
  - **Property 19: Spatial Coordinate Map Presence**
  - **Validates: Requirements 4.5**

- [ ]* 5.3 Write property test for 2D coordinate bounds
  - **Property 20: Spatial 2D Coordinate Bounds**
  - **Validates: Requirements 4.6**

- [ ]* 5.4 Write property test for coordinate uniqueness
  - **Property 23: Spatial Coordinate Uniqueness**
  - **Validates: Requirements 4.10**

- [ ] 6. Implement spatial 3D questions
  - Implement 26-direction cube system
  - Assign random [x, y, z] coordinates within cube bounds
  - Generate 3D spatial premises
  - Support level-based relationships (above/below)
  - Store 3D coordinate map
  - Add spatial 3D configuration to Settings
  - _Requirements: 4.2, 4.5, 4.7, 4.9, 4.10_

- [ ]* 6.1 Write property test for 3D direction validity
  - **Property 16: Spatial 3D Direction Validity**
  - **Validates: Requirements 4.2**

- [ ]* 6.2 Write property test for 3D coordinate bounds
  - **Property 21: Spatial 3D Coordinate Bounds**
  - **Validates: Requirements 4.7**

- [ ] 7. Implement spatial 4D questions
  - Add temporal dimension to 3D space
  - Assign random [x, y, z, t] coordinates
  - Implement space-time relationships
  - Support temporal ordering (before/after in time)
  - Store 4D coordinate map
  - Add spatial 4D configuration to Settings
  - _Requirements: 4.3, 4.5, 4.8, 4.9, 4.10_

- [ ]* 7.1 Write property test for temporal dimension
  - **Property 17: Spatial 4D Temporal Dimension**
  - **Validates: Requirements 4.3**

- [ ]* 7.2 Write property test for 4D coordinate dimensions
  - **Property 22: Spatial 4D Coordinate Dimensions**
  - **Validates: Requirements 4.8**

- [ ] 8. Implement anchor space questions
  - Implement diamond starting pattern
  - Add anchor point relationships
  - Generate radial positioning
  - Store anchor space coordinate map
  - Add anchor space configuration to Settings
  - _Requirements: 4.4, 4.5, 4.9, 4.10_

- [ ]* 8.1 Write property test for diamond pattern
  - **Property 18: Anchor Space Diamond Pattern**
  - **Validates: Requirements 4.4**

- [ ] 9. Create theme service for UI customization
  - Create ThemeService with dependency injection
  - Implement background image upload and base64 conversion
  - Implement background color customization
  - Add dark/light mode toggle with CSS custom properties
  - Implement fast UI mode (disable animations)
  - Implement minimal mode (simplified UI)
  - Implement wide premises mode (horizontal layout)
  - Implement carousel mode (one premise at a time)
  - Add theme settings to Settings model
  - Use BehaviorSubject for reactive theme updates
  - _Requirements: 5.1-5.18_

- [ ] 10. Create theme UI components
  - Create theme settings page/component
  - Add background image upload file picker
  - Add background color picker
  - Add dark/light mode toggle switch
  - Add sound effects dropdown (none/game/zen)
  - Add fast UI mode toggle
  - Add minimal mode toggle
  - Add wide premises mode toggle
  - Add carousel mode toggle with navigation controls
  - Apply theme changes immediately without reload
  - _Requirements: 5.1-5.18_

- [ ] 11. Create profile management service
  - Create ProfileService with dependency injection
  - Implement profile CRUD operations (create, read, update, delete)
  - Implement active profile management with BehaviorSubject
  - Add profile storage in localStorage
  - Implement profile export to JSON
  - Implement profile import with validation
  - Implement URL encoding for profile sharing
  - Implement URL decoding for profile import
  - Handle name conflicts by appending numbers
  - Prevent deletion of last remaining profile
  - _Requirements: 6.1-6.15_

- [ ]* 11.1 Write property test for profile name uniqueness
  - **Property 24: Profile Name Uniqueness**
  - **Validates: Requirements 6.2**

- [ ]* 11.2 Write property test for default settings initialization
  - **Property 25: New Profile Default Settings**
  - **Validates: Requirements 6.3**

- [ ]* 11.3 Write property test for profile switch saves state
  - **Property 26: Profile Switch Saves Current State**
  - **Validates: Requirements 6.4**

- [ ]* 11.4 Write property test for profile switch loads data
  - **Property 27: Profile Switch Loads Correct Data**
  - **Validates: Requirements 6.5**

- [ ]* 11.5 Write property test for last profile deletion prevention
  - **Property 28: Last Profile Deletion Prevention**
  - **Validates: Requirements 6.7**

- [ ]* 11.6 Write property test for export completeness
  - **Property 29: Profile Export Completeness**
  - **Validates: Requirements 6.8**

- [ ]* 11.7 Write property test for import validation
  - **Property 30: Profile Import Validation**
  - **Validates: Requirements 6.10**

- [ ]* 11.8 Write property test for name conflict resolution
  - **Property 31: Profile Import Name Conflict Resolution**
  - **Validates: Requirements 6.11**

- [ ]* 11.9 Write property test for URL encoding round trip
  - **Property 32: Profile URL Encoding Correctness**
  - **Validates: Requirements 6.12**

- [ ]* 11.10 Write property test for URL decoding
  - **Property 33: Profile URL Decoding Creates Profile**
  - **Validates: Requirements 6.14**

- [ ] 12. Create profile UI components
  - Create profile selector component for navigation
  - Create profile manager modal/page
  - Add profile creation form with name input
  - Add profile list with edit/delete actions
  - Add profile deletion confirmation dialog
  - Add profile export button with download trigger
  - Add profile import file picker with validation
  - Add profile sharing URL generation and display
  - Integrate profile selector in main navigation
  - _Requirements: 6.1-6.15_

- [ ] 13. Create keyboard shortcut service
  - Create KeyboardService with dependency injection
  - Implement shortcut registration with @HostListener
  - Add default shortcut definitions (Space, Esc, PgUp, PgDn)
  - Implement custom keybind configuration
  - Add keybind conflict detection
  - Add keybind validation (avoid browser reserved keys)
  - Store keybinds in Settings model
  - Provide keybinds observable for UI hints
  - _Requirements: 7.1-7.13_

- [ ]* 13.1 Write property test for conflict detection
  - **Property 34: Keyboard Conflict Detection**
  - **Validates: Requirements 7.9**

- [ ]* 13.2 Write property test for conflict prevention
  - **Property 35: Keyboard Conflict Prevention**
  - **Validates: Requirements 7.10**

- [ ] 14. Create keyboard UI components
  - Create keybind settings page/component
  - Add keybind editor with key capture
  - Display current keybinds in table format
  - Add conflict warnings with visual indicators
  - Add "Reset to Defaults" button
  - Show visual hints in game UI (e.g., "Press Space to start")
  - Add visual feedback when keys are pressed
  - Integrate keybind settings in settings menu
  - _Requirements: 7.1-7.13_

- [ ] 15. Create sound service
  - Create SoundService with dependency injection
  - Implement Web Audio API sound playback
  - Add sound preloading on app init
  - Create playCorrect(), playIncorrect(), playTimeout() methods
  - Add playLevelUp() and playLevelDown() methods
  - Implement sound mode selection (none/game/zen)
  - Add volume control (0-1 range)
  - Handle audio context restrictions (user gesture)
  - Add sound files to assets/sounds/
  - _Requirements: 5.6, 5.7_

- [ ] 16. Create progress visualization components
  - Create TrailingProgressComponent
  - Display last N questions as colored dots (green/red/yellow)
  - Add tooltips on hover with question details
  - Use CSS Grid for dot layout
  - Create ProgressBarsComponent for daily/weekly stats
  - Calculate daily stats with 4am cutoff
  - Calculate weekly stats with Monday 4am cutoff
  - Add progress configuration to Settings (window size, grouping)
  - Support simple vs separate grouping modes
  - _Requirements: 8.1-8.13_

- [ ]* 16.1 Write property test for dot color correctness
  - **Property 36: Progress Dot Color Correctness**
  - **Validates: Requirements 8.2**

- [ ]* 16.2 Write property test for daily 4am cutoff
  - **Property 37: Daily Progress 4am Cutoff**
  - **Validates: Requirements 8.6**

- [ ]* 16.3 Write property test for weekly Monday 4am cutoff
  - **Property 38: Weekly Progress Monday 4am Cutoff**
  - **Validates: Requirements 8.9**

- [ ]* 16.4 Write property test for simple grouping
  - **Property 39: Progress Grouping Simple Mode**
  - **Validates: Requirements 8.12**

- [ ]* 16.5 Write property test for separate grouping
  - **Property 40: Progress Grouping Separate Mode**
  - **Validates: Requirements 8.13**

- [ ] 17. Enhance settings model with all v3 options
  - Add stimuli settings to Settings model
  - Add backtracking and linear wording settings
  - Add spatial question type settings
  - Add theme settings
  - Add keyboard shortcut settings
  - Add progress settings (window size, grouping)
  - Add advanced settings (scramble factor, spoiler mode)
  - Add progression settings (thresholds, strategy)
  - Ensure backward compatibility with existing v4 settings
  - Add default values for all new settings
  - _Requirements: All_

- [ ] 18. Create advanced settings UI
  - Create advanced settings page/component
  - Add scramble factor slider (0-100%)
  - Add spoiler conclusion toggle
  - Add progression settings (trailing window, thresholds)
  - Add strategy selection (auto/custom)
  - Add time drop/bump inputs for custom strategy
  - Add grouping selection (simple/separate)
  - Implement settings validation
  - Save settings immediately to localStorage
  - Show validation errors when settings are invalid
  - _Requirements: 9.1-9.14_

- [ ]* 18.1 Write property test for scramble factor application
  - **Property 41: Scramble Factor Application**
  - **Validates: Requirements 9.2**

- [ ]* 18.2 Write property test for auto strategy calculation
  - **Property 42: Auto Strategy Timer Calculation**
  - **Validates: Requirements 9.9**

- [ ]* 18.3 Write property test for settings persistence
  - **Property 43: Settings Persistence**
  - **Validates: Requirements 9.13**

- [ ]* 18.4 Write property test for settings validation
  - **Property 44: Settings Validation**
  - **Validates: Requirements 9.14**

- [ ] 19. Create enhanced history page
  - Create HistoryPage component with routing
  - Display all answered questions in reverse chronological order
  - Create HistoryItemComponent showing all question details
  - Add "Show Explanation" button with popup
  - Create HistoryFiltersComponent
  - Add filter by question type dropdown
  - Add filter by correctness (all/correct/incorrect/timeout)
  - Add date range filter
  - Add text search box
  - Add sort options (date/time/type/correctness)
  - Implement pagination or virtual scrolling for 50+ items
  - Add "Export History" button (JSON/CSV)
  - Add "Clear History" button with confirmation
  - Show helpful empty state when history is empty
  - _Requirements: 10.1-10.19_

- [ ]* 19.1 Write property test for chronological order
  - **Property 45: History Chronological Order**
  - **Validates: Requirements 10.1**

- [ ] 20. Implement fill-in-the-blank question mode
  - Create FillInBlankService with dependency injection
  - Implement element selection logic (random premise or conclusion)
  - Implement alternative generation for each question type
  - Ensure grammatical consistency of alternatives
  - Ensure logical distinctness of alternatives
  - Add answer mode selection to Settings (validity/fill-in-blank/mixed)
  - Update question display component for fill-in-blank mode
  - Add multiple choice button UI
  - Implement answer validation for fill-in-blank
  - Track statistics separately for each answer mode
  - Add mixed mode with random alternation
  - _Requirements: 11.1-11.10_

- [ ]* 20.1 Write property test for element selection
  - **Property 52: Fill-in-Blank Element Selection**
  - **Validates: Requirements 11.1**

- [ ]* 20.2 Write property test for alternative count
  - **Property 53: Fill-in-Blank Alternative Count**
  - **Validates: Requirements 11.2**

- [ ]* 20.3 Write property test for alternative distinctness
  - **Property 54: Fill-in-Blank Alternative Distinctness**
  - **Validates: Requirements 11.5**

- [ ]* 20.4 Write property test for correct answer inclusion
  - **Property 55: Fill-in-Blank Correct Answer Inclusion**
  - **Validates: Requirements 11.2**

- [ ]* 20.5 Write property test for answer validation
  - **Property 56: Fill-in-Blank Answer Validation**
  - **Validates: Requirements 11.4**

- [ ]* 20.6 Write property test for statistics separation
  - **Property 57: Answer Mode Statistics Separation**
  - **Validates: Requirements 11.10**

- [ ]* 20.7 Write property test for mixed mode alternation
  - **Property 58: Mixed Mode Alternation**
  - **Validates: Requirements 11.9**

- [ ] 21. Integrate unified popup system
  - Import UnifiedPopupManager from shared/unified-popup-manager.js
  - Create PopupIntegrationService wrapper for Angular
  - Replace all existing popup/modal code with unified system
  - Use unified popups for explanations
  - Use unified popups for tips and tutorials
  - Use unified popups for achievements
  - Use unified popups for notifications and errors
  - Ensure consistent styling across all popup types
  - Test popup queue management
  - Test popup cleanup and callbacks
  - _Requirements: 12.1-12.10_

- [ ]* 21.1 Write property test for popup manager centralization
  - **Property 59: Popup Manager Centralization**
  - **Validates: Requirements 12.1, 12.2, 12.3**

- [ ]* 21.2 Write property test for popup configuration
  - **Property 60: Popup Configuration Completeness**
  - **Validates: Requirements 12.4, 12.5, 12.6, 12.7**

- [ ]* 21.3 Write property test for popup queue ordering
  - **Property 61: Popup Queue Ordering**
  - **Validates: Requirements 12.8**

- [ ]* 21.4 Write property test for popup cleanup
  - **Property 62: Popup Cleanup Completeness**
  - **Validates: Requirements 12.9**

- [ ] 22. Enhance analogy questions to wrap all types
  - Update analogy generation to support wrapping distinction
  - Support wrapping all linear wording types
  - Support wrapping spatial 2D questions
  - Support wrapping spatial 3D questions
  - Support wrapping spatial 4D questions
  - Support wrapping arrangement questions
  - Support wrapping direction questions
  - Pick 4 subjects from wrapped question
  - Determine relationship equivalence
  - Use "is alike" or "is unlike" phrasing
  - Format as "A to B [is alike/unlike] C to D"
  - Handle negation by inverting relationship
  - Compare coordinate differences for spatial equivalence
  - Show both sub-question explanations
  - _Requirements: 13.1-13.14_

- [ ]* 22.1 Write property test for analogy subject count
  - **Property 46: Analogy Subject Count**
  - **Validates: Requirements 13.8**

- [ ]* 22.2 Write property test for equivalence determination
  - **Property 47: Analogy Equivalence Determination**
  - **Validates: Requirements 13.9**

- [ ]* 22.3 Write property test for phrasing correctness
  - **Property 48: Analogy Phrasing Correctness**
  - **Validates: Requirements 13.10**

- [ ]* 22.4 Write property test for format consistency
  - **Property 49: Analogy Format Consistency**
  - **Validates: Requirements 13.11**

- [ ]* 22.5 Write property test for negation inversion
  - **Property 50: Analogy Negation Inversion**
  - **Validates: Requirements 13.12**

- [ ]* 22.6 Write property test for spatial equivalence
  - **Property 51: Analogy Spatial Equivalence**
  - **Validates: Requirements 13.14**

- [ ] 23. Implement data migration for backward compatibility
  - Detect old v4 settings format on app load
  - Add new fields with default values
  - Preserve existing values
  - Create default profile from existing settings
  - Migrate existing statistics to default profile
  - Set migration flag to prevent re-running
  - Test migration with various v4 data states
  - _Requirements: All (Compatibility)_

- [ ] 24. Add explanation visualizations for new question types
  - Enhance explanation renderer for spatial 2D grids
  - Add 3D cube visualization
  - Add 4D space-time visualization
  - Add bucket visualization for distinction/backtracking
  - Add diamond pattern visualization for anchor space
  - Integrate visualizations with unified popup system
  - Ensure visualizations work in history page
  - _Requirements: 2.7, 4.9, 12.1_

- [ ] 25. Checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests
  - Fix any failing tests
  - Verify no regressions in existing v4 functionality
  - Ask user if questions arise

- [ ] 26. Performance optimization and polish
  - Implement lazy loading for history page
  - Implement lazy loading for profile management
  - Cache generated stimuli configurations
  - Cache theme calculations
  - Debounce settings changes (300ms)
  - Debounce search input (300ms)
  - Optimize question generation (target < 100ms)
  - Optimize theme changes (target < 50ms)
  - _Requirements: Performance_

- [ ] 27. Accessibility improvements
  - Ensure all interactive elements are keyboard accessible
  - Add alt text to all images
  - Add ARIA labels where appropriate
  - Ensure focus indicators are visible
  - Test with screen readers
  - Verify color is not the only means of conveying information
  - _Requirements: Accessibility_

- [ ] 28. Final testing and documentation
  - Complete E2E testing for all new features
  - Test profile import/export workflows
  - Test keyboard shortcuts in all contexts
  - Test theme switching and persistence
  - Test fill-in-the-blank mode with all question types
  - Test unified popup system across all features
  - Verify all acceptance criteria are met
  - Update user documentation
  - Create migration guide for v4 users
  - Document all new features
  - _Requirements: All_
