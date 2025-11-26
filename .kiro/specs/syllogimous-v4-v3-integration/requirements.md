# Requirements Document

## Introduction

This specification defines the integration of v3 features into the existing Syllogimous v4 Angular application. The goal is to enhance v4 with v3's comprehensive customization options, additional question types, and user experience features while maintaining v4's superior architecture and algorithms.

## Glossary

- **v3**: Original JavaScript implementation with extensive customization and features
- **v4**: Current Angular-based implementation with advanced algorithms and architecture
- **Stimuli**: The words, symbols, or images used as subjects in logical reasoning questions
- **Backtracking**: Linear question mode where relationships can go backwards in sequence
- **Trailing Progress**: Visual indicator showing results of last N questions as colored dots
- **Profile**: Complete saved configuration including all settings, preferences, and statistics
- **Scramble Factor**: Percentage probability that premises will be randomly reordered
- **Carousel Mode**: Display mode showing premises one at a time with navigation controls
- **Wide Premises**: Alternative layout mode for premise display
- **Voronoi Emoji**: Junk emoji with sequencing algorithm for distribution
- **Anchor Space**: Spatial question type with diamond starting pattern
- **Wording Type**: Specific relationship language for linear questions (left/right, before/after, etc.)
- **Fill-in-the-Blank Mode**: Question format where one premise or the conclusion is hidden and must be selected from multiple choices
- **Answer Mode**: The question format type - either validity judgment (true/false) or fill-in-the-blank (multiple choice)
- **Unified Popup System**: Centralized popup manager for displaying explanations, tips, tutorials, and notifications across all games

## Requirements

### Requirement 1: Enhanced Stimuli Generation System

**User Story:** As a user, I want diverse stimuli types beyond basic words, so that questions are more varied, engaging, and challenging.

#### Acceptance Criteria

1. WHEN configuring stimuli THEN the system SHALL support nonsense words with configurable length (3-10 characters)
2. WHEN generating nonsense words THEN the system SHALL alternate consonants and vowels in pattern
3. WHEN generating nonsense words THEN the system SHALL filter out banned word patterns
4. WHEN configuring stimuli THEN the system SHALL support garbage words (consonants only) with configurable length
5. WHEN generating garbage words THEN the system SHALL prevent consecutive identical consonants
6. WHEN configuring stimuli THEN the system SHALL support meaningful words with separate noun/adjective options
7. WHEN configuring stimuli THEN the system SHALL support emoji from a predefined set
8. WHEN configuring stimuli THEN the system SHALL support voronoi emoji (junk emoji with sequencing)
9. WHEN configuring stimuli THEN the system SHALL support visual noise overlay with configurable splits
10. WHEN multiple stimuli types are enabled THEN the system SHALL cycle through types for even distribution
11. WHEN generating stimuli THEN the system SHALL ensure uniqueness within a single question
12. WHEN stimuli type reaches limit THEN the system SHALL automatically switch to next available type

### Requirement 2: Linear Question 180° Backtracking Mode

**User Story:** As a user, I want linear questions with backtracking relationships, so that questions are more challenging and test deeper reasoning.

#### Acceptance Criteria

1. WHEN 180° backtracking mode is enabled THEN the system SHALL allow relationships to go backwards in sequence
2. WHEN generating backtracking questions THEN the system SHALL use bucket-based logic for word positions
3. WHEN generating backtracking questions THEN the system SHALL support connection branching (words in multiple premises)
4. WHEN generating backtracking conclusions THEN the system SHALL use comparison operators (less than, equal to, greater than)
5. WHEN backtracking is enabled THEN the system SHALL calculate ideal distance for conclusion word pairs
6. WHEN backtracking questions are created THEN the system SHALL organize words into ordered buckets by position
7. WHEN displaying backtracking questions THEN the system SHALL show bucket visualization in explanations
8. WHEN backtracking mode is disabled THEN the system SHALL use simple linear sequence logic

### Requirement 3: Multiple Linear Wording Types

**User Story:** As a user, I want different types of linear relationships, so that I can practice various reasoning patterns and relationship types.

#### Acceptance Criteria

1. WHEN configuring linear questions THEN the system SHALL support "left of/right of" (horizontal) wording
2. WHEN configuring linear questions THEN the system SHALL support "on top of/under" (vertical) wording
3. WHEN configuring linear questions THEN the system SHALL support "more than/less than" (comparison) wording
4. WHEN configuring linear questions THEN the system SHALL support "before/after" (temporal) wording
5. WHEN configuring linear questions THEN the system SHALL support "contains/is within" wording
6. WHEN multiple wordings are enabled THEN the system SHALL randomly select based on individual weights
7. WHEN configuring wordings THEN the system SHALL allow individual enable/disable per wording type
8. WHEN configuring wordings THEN the system SHALL allow weight adjustment per wording type
9. WHEN generating linear questions THEN the system SHALL use appropriate minimal symbols per wording (arrows, <, >, etc.)
10. WHEN displaying linear questions THEN the system SHALL use consistent wording throughout all premises

### Requirement 4: True Spatial Question Types

**User Story:** As a user, I want spatial reasoning questions with coordinate-based logic, so that I can train spatial visualization and navigation skills.

#### Acceptance Criteria

1. WHEN spatial 2D is enabled THEN the system SHALL generate questions with 8-direction grids (N, S, E, W, NE, NW, SE, SW)
2. WHEN spatial 3D is enabled THEN the system SHALL generate questions with 26-direction cubes
3. WHEN spatial 4D is enabled THEN the system SHALL generate questions with space-time (3D + temporal dimension)
4. WHEN anchor space is enabled THEN the system SHALL generate questions with diamond starting patterns
5. WHEN generating spatial questions THEN the system SHALL store wordCoordMap (Map<string, number[]>) for visualization
6. WHEN generating spatial 2D THEN the system SHALL assign random [x, y] coordinates within grid bounds
7. WHEN generating spatial 3D THEN the system SHALL assign random [x, y, z] coordinates within cube bounds
8. WHEN generating spatial 4D THEN the system SHALL assign random [x, y, z, t] coordinates with time dimension
9. WHEN displaying spatial explanations THEN the system SHALL render coordinate-based grid visualizations
10. WHEN spatial questions are created THEN the system SHALL ensure coordinate uniqueness per word

### Requirement 5: Comprehensive UI Customization

**User Story:** As a user, I want to customize the game's appearance and behavior extensively, so that it matches my preferences, accessibility needs, and play style.

#### Acceptance Criteria

1. WHEN accessing settings THEN the system SHALL allow background image upload via file picker
2. WHEN uploading background THEN the system SHALL convert and store image as base64 in localStorage
3. WHEN accessing settings THEN the system SHALL allow background color customization via color picker
4. WHEN accessing settings THEN the system SHALL provide dark/light mode toggle
5. WHEN dark mode is enabled THEN the system SHALL apply dark theme to all UI elements
6. WHEN accessing settings THEN the system SHALL provide sound effects options (none/game-like/zen)
7. WHEN sound effects are enabled THEN the system SHALL play appropriate sounds for correct/incorrect/timeout
8. WHEN accessing settings THEN the system SHALL provide fast UI mode toggle
9. WHEN fast UI mode is enabled THEN the system SHALL disable all animations and transitions
10. WHEN accessing settings THEN the system SHALL provide minimal mode toggle
11. WHEN minimal mode is enabled THEN the system SHALL use simplified UI with minimal decorations
12. WHEN accessing settings THEN the system SHALL provide wide premises mode toggle
13. WHEN wide premises mode is enabled THEN the system SHALL use alternative horizontal layout
14. WHEN accessing settings THEN the system SHALL provide carousel mode toggle
15. WHEN carousel mode is enabled THEN the system SHALL display premises one at a time
16. WHEN carousel mode is active THEN the system SHALL provide back/next navigation buttons
17. WHEN carousel mode is active THEN the system SHALL display progress indicator (e.g., "2 of 5")
18. WHEN theme changes are made THEN the system SHALL apply changes immediately without page reload

### Requirement 6: Profile Management System

**User Story:** As a user, I want to create and manage multiple profiles, so that different users or play styles can have completely separate settings and statistics.

#### Acceptance Criteria

1. WHEN accessing profile menu THEN the system SHALL display list of all existing profiles
2. WHEN creating a new profile THEN the system SHALL require a unique profile name
3. WHEN creating a new profile THEN the system SHALL initialize with default settings
4. WHEN switching profiles THEN the system SHALL save current profile state
5. WHEN switching profiles THEN the system SHALL load selected profile's settings and statistics
6. WHEN deleting a profile THEN the system SHALL show confirmation dialog
7. WHEN deleting a profile THEN the system SHALL prevent deletion of last remaining profile
8. WHEN exporting a profile THEN the system SHALL generate JSON file with all settings and statistics
9. WHEN exporting a profile THEN the system SHALL trigger browser download
10. WHEN importing a profile THEN the system SHALL validate JSON structure and version
11. WHEN importing a profile THEN the system SHALL handle name conflicts by appending number
12. WHEN sharing a profile THEN the system SHALL encode settings in URL parameters
13. WHEN sharing a profile THEN the system SHALL generate shareable URL
14. WHEN receiving a shared URL THEN the system SHALL decode parameters and create new profile
15. WHEN profiles exist THEN the system SHALL display profile selector in main navigation

### Requirement 7: Comprehensive Keyboard Shortcuts

**User Story:** As a user, I want keyboard shortcuts for all common actions, so that I can play efficiently without using the mouse.

#### Acceptance Criteria

1. WHEN on start screen THEN pressing Space SHALL start a new game
2. WHEN in active game THEN pressing Esc SHALL end the current game and return to start
3. WHEN on start screen THEN pressing PgUp SHALL switch to previous game mode
4. WHEN on start screen THEN pressing PgDn SHALL switch to next game mode
5. WHEN in active game THEN custom keybind for "true" SHALL submit true answer
6. WHEN in active game THEN custom keybind for "false" SHALL submit false answer
7. WHEN accessing settings THEN the system SHALL display keybind editor
8. WHEN customizing keybinds THEN the system SHALL capture key press for assignment
9. WHEN customizing keybinds THEN the system SHALL detect and warn about conflicts
10. WHEN key conflicts exist THEN the system SHALL prevent saving until resolved
11. WHEN accessing keybind settings THEN the system SHALL provide "Reset to Defaults" button
12. WHEN keybinds are active THEN the system SHALL display visual hints in UI (e.g., "Press Space to start")
13. WHEN keybinds are pressed THEN the system SHALL provide visual feedback

### Requirement 8: Rich Progress Visualization

**User Story:** As a user, I want visual progress indicators throughout the interface, so that I can see my performance trends and patterns at a glance.

#### Acceptance Criteria

1. WHEN playing game THEN the system SHALL display trailing progress indicator showing last N questions
2. WHEN displaying trailing progress THEN the system SHALL use colored dots (green=correct, red=incorrect, yellow=timeout)
3. WHEN hovering over progress dots THEN the system SHALL show tooltip with question details
4. WHEN viewing statistics page THEN the system SHALL display daily progress bar
5. WHEN displaying daily progress THEN the system SHALL show time spent and questions answered today
6. WHEN displaying daily progress THEN the system SHALL use 4am cutoff for day boundary
7. WHEN viewing statistics page THEN the system SHALL display weekly progress bar
8. WHEN displaying weekly progress THEN the system SHALL show time spent and questions answered this week
9. WHEN displaying weekly progress THEN the system SHALL use Monday 4am cutoff for week boundary
10. WHEN configuring progress THEN the system SHALL allow setting trailing window size (default 20)
11. WHEN configuring progress THEN the system SHALL allow choosing grouping mode (simple/separate)
12. WHEN grouping is "simple" THEN the system SHALL track progress across all question types combined
13. WHEN grouping is "separate" THEN the system SHALL track progress per question type independently

### Requirement 9: Granular Settings Control

**User Story:** As a user, I want fine-grained control over all game difficulty and behavior parameters, so that I can precisely customize my training experience.

#### Acceptance Criteria

1. WHEN accessing advanced settings THEN the system SHALL provide scramble factor slider (0-100%)
2. WHEN scramble factor is set THEN the system SHALL randomly reorder premises with that probability
3. WHEN accessing advanced settings THEN the system SHALL provide spoiler conclusion toggle
4. WHEN spoiler mode is enabled THEN the system SHALL display conclusion before premises
5. WHEN accessing progression settings THEN the system SHALL allow configuring trailing window size (default 20)
6. WHEN accessing progression settings THEN the system SHALL allow configuring success threshold (default 90%)
7. WHEN accessing progression settings THEN the system SHALL allow configuring failure threshold (default 65%)
8. WHEN accessing progression settings THEN the system SHALL allow choosing strategy (auto/custom)
9. WHEN auto strategy is selected THEN the system SHALL calculate optimal timer from percentiles
10. WHEN custom strategy is selected THEN the system SHALL allow setting time drop amount (seconds)
11. WHEN custom strategy is selected THEN the system SHALL allow setting time bump amount (seconds)
12. WHEN accessing progression settings THEN the system SHALL allow choosing grouping (simple/separate)
13. WHEN settings are changed THEN the system SHALL save immediately to localStorage
14. WHEN settings are invalid THEN the system SHALL show validation error and prevent saving

### Requirement 10: Enhanced Question History

**User Story:** As a user, I want a comprehensive, searchable history of all answered questions, so that I can review my performance and learn from mistakes.

#### Acceptance Criteria

1. WHEN accessing history page THEN the system SHALL display all answered questions in reverse chronological order
2. WHEN displaying history item THEN the system SHALL show all premises
3. WHEN displaying history item THEN the system SHALL show conclusion
4. WHEN displaying history item THEN the system SHALL show user's answer
5. WHEN displaying history item THEN the system SHALL show correct answer
6. WHEN displaying history item THEN the system SHALL show response time
7. WHEN displaying history item THEN the system SHALL show timestamp
8. WHEN displaying history item THEN the system SHALL provide "Show Explanation" button
9. WHEN clicking "Show Explanation" THEN the system SHALL render same visualization as during gameplay
10. WHEN accessing history THEN the system SHALL provide filter by question type dropdown
11. WHEN accessing history THEN the system SHALL provide filter by correctness (all/correct/incorrect/timeout)
12. WHEN accessing history THEN the system SHALL provide date range filter
13. WHEN accessing history THEN the system SHALL provide search box for text search
14. WHEN accessing history THEN the system SHALL provide sort options (date/time/type/correctness)
15. WHEN history exceeds 50 items THEN the system SHALL implement pagination or virtual scrolling
16. WHEN accessing history THEN the system SHALL provide "Export History" button (JSON/CSV)
17. WHEN accessing history THEN the system SHALL provide "Clear History" button
18. WHEN clearing history THEN the system SHALL show confirmation dialog with warning
19. WHEN history is empty THEN the system SHALL display helpful empty state message

### Requirement 11: Fill-in-the-Blank Question Mode

**User Story:** As a user, I want to answer questions by filling in missing premises or conclusions from multiple choices, so that I have cognitive variety beyond true/false judgments and can practice active recall.

#### Acceptance Criteria

1. WHEN fill-in-the-blank mode is enabled THEN the system SHALL randomly hide one premise or the conclusion
2. WHEN a premise or conclusion is hidden THEN the system SHALL generate 3-5 plausible alternative options
3. WHEN displaying fill-in-the-blank questions THEN the system SHALL show the hidden element as a blank with multiple choice buttons
4. WHEN the user selects an option THEN the system SHALL check if it matches the correct hidden element
5. WHEN generating alternatives THEN the system SHALL ensure they are grammatically consistent but logically distinct
6. WHEN the user answers correctly THEN the system SHALL provide the same feedback as validity judgment mode
7. WHEN the user answers incorrectly THEN the system SHALL show which option was correct
8. WHEN configuring the game THEN the system SHALL allow users to choose between validity judgment mode, fill-in-the-blank mode, or mixed mode
9. WHEN in mixed mode THEN the system SHALL randomly alternate between validity judgment and fill-in-the-blank questions
10. WHEN tracking statistics THEN the system SHALL separately track performance for each answer mode

### Requirement 12: Unified Popup System Integration

**User Story:** As a user, I want a consistent popup system for explanations, tips, and notifications, so that I have a unified and polished experience across all features.

#### Acceptance Criteria

1. WHEN displaying explanations THEN the system SHALL use the unified popup manager
2. WHEN showing tips or tutorials THEN the system SHALL use the unified popup manager
3. WHEN displaying notifications THEN the system SHALL use the unified popup manager
4. WHEN creating popups THEN the system SHALL support multiple content types (explanation, tip, tutorial, achievement, notification)
5. WHEN displaying popups THEN the system SHALL support positioning (center, top, bottom, left, right, custom coordinates)
6. WHEN displaying popups THEN the system SHALL support themes (dark, light, success, warning, error, info)
7. WHEN displaying popups THEN the system SHALL support animations (fade, slide, scale, bounce, none)
8. WHEN multiple popups are requested THEN the system SHALL queue them or stack them based on configuration
9. WHEN a popup is dismissed THEN the system SHALL clean up resources and trigger callbacks
10. WHEN a popup contains interactive elements THEN the system SHALL handle user input appropriately

### Requirement 13: Improved Analogy Questions

**User Story:** As a user, I want analogy questions that wrap all available question types, so that I can practice relationship reasoning across all domains.

#### Acceptance Criteria

1. WHEN analogy is enabled THEN the system SHALL support wrapping distinction questions
2. WHEN analogy is enabled THEN the system SHALL support wrapping all linear wording types
3. WHEN analogy is enabled THEN the system SHALL support wrapping spatial 2D questions
4. WHEN analogy is enabled THEN the system SHALL support wrapping spatial 3D questions
5. WHEN analogy is enabled THEN the system SHALL support wrapping spatial 4D questions
6. WHEN analogy is enabled THEN the system SHALL support wrapping arrangement questions
7. WHEN analogy is enabled THEN the system SHALL support wrapping direction questions
8. WHEN generating analogy THEN the system SHALL pick 4 subjects from wrapped question
9. WHEN generating analogy THEN the system SHALL determine if relationships are equivalent
10. WHEN generating analogy THEN the system SHALL use "is alike" or "is unlike" phrasing
11. WHEN displaying analogy THEN the system SHALL format as "A to B [is alike/unlike] C to D"
12. WHEN analogy uses negation THEN the system SHALL invert the relationship statement
13. WHEN explaining analogy THEN the system SHALL show both sub-question explanations
14. WHEN analogy wraps spatial THEN the system SHALL compare coordinate differences for equivalence

---

## Non-Functional Requirements

### Performance

1. Question generation SHALL complete in < 100ms for all question types
2. Settings changes SHALL apply in < 50ms
3. Profile switching SHALL complete in < 200ms
4. History filtering SHALL complete in < 100ms for 1000 questions
5. UI theme changes SHALL apply in < 50ms

### Usability

1. All new features SHALL have tooltips explaining their purpose
2. Settings SHALL be organized into logical categories (General, Appearance, Progression, Advanced)
3. UI SHALL remain responsive on mobile devices (min width 320px)
4. Keyboard shortcuts SHALL not conflict with browser default shortcuts
5. Error messages SHALL be clear and actionable

### Compatibility

1. Existing v4 localStorage data SHALL continue to work without migration
2. New settings SHALL have sensible defaults when not present
3. Graceful degradation SHALL occur if browser features unavailable (e.g., localStorage full)
4. All features SHALL work in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Maintainability

1. Code SHALL follow Angular style guide
2. All new services SHALL use dependency injection
3. All new features SHALL have unit tests with 80%+ coverage
4. Complex algorithms SHALL have inline documentation
5. All public methods SHALL have JSDoc comments

### Accessibility

1. All interactive elements SHALL be keyboard accessible
2. All images SHALL have alt text
3. Color SHALL not be the only means of conveying information
4. Focus indicators SHALL be visible
5. ARIA labels SHALL be used where appropriate

---

## Success Criteria

✅ All 13 requirements fully implemented and tested
✅ 80%+ code coverage for new features
✅ Zero regression in existing v4 functionality
✅ < 5% performance degradation from baseline
✅ User can access all v3 features from v4 UI
✅ Settings persist correctly across sessions and profiles
✅ Profiles import/export without data loss
✅ All acceptance criteria passing
✅ Documentation complete and accurate
✅ User testing shows positive feedback

