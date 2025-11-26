# Requirements Document

## Introduction

This specification defines the integration of Syllogimous (both v3 and v4) into the unified cognitive training system. The goal is to combine the best features from both versions: v3's comprehensive progress tracking, auto-progression system, and visual feedback with v4's Angular architecture, popup explanation system, and adaptive timer. Additionally, we will integrate time tracking per game into the unified cognitive progression system.

## Glossary

- **Syllogimous**: A logical reasoning game that tests deductive reasoning through various question types (distinction, linear, spatial, syllogism)
- **Unified System**: The overarching brain training platform that manages multiple cognitive games
- **Auto-Progression**: Automatic difficulty adjustment based on performance metrics
- **d-Prime**: Signal detection theory metric measuring sensitivity
- **Explanation Popup**: Visual representation showing the logical structure of a question
- **Reactive Settings**: Real-time synchronized settings between UI and game
- **Cognitive Domain**: One of six cognitive abilities tracked (working memory, attention, processing speed, executive functions, perceptual processing, long-term memory)
- **Session**: A single play-through of a game from start to end
- **Time Tracking**: Recording and analyzing time spent per game and per cognitive domain

## Requirements

### Requirement 1: Syllogimous Game Integration

**User Story:** As a user, I want to play Syllogimous within the unified system, so that my logical reasoning performance is tracked alongside other cognitive abilities.

#### Acceptance Criteria

1. WHEN the user selects Syllogimous from the game menu THEN the system SHALL load the game in the unified interface
2. WHEN Syllogimous loads THEN the system SHALL initialize with saved user settings from localStorage
3. WHEN the user plays Syllogimous THEN the system SHALL track session data including question type, premises count, timer settings, and accuracy
4. WHEN a session ends THEN the system SHALL save performance data to the unified cognitive database
5. WHEN the user switches games THEN the system SHALL properly cleanup Syllogimous resources and preserve state

### Requirement 2: Modular Popup System

**User Story:** As a user, I want a unified popup system that can display various types of content (explanations, tips, tutorials, achievements), so that I have a consistent and rich learning experience across all games.

#### Acceptance Criteria

1. WHEN any game needs to show a popup THEN the system SHALL use the unified popup manager
2. WHEN creating a popup THEN the system SHALL support multiple content types (explanation, tip, tutorial, achievement, notification)
3. WHEN displaying a popup THEN the system SHALL support positioning (center, top, bottom, left, right, mouse-follow)
4. WHEN displaying a popup THEN the system SHALL support styling themes (dark, light, success, warning, error, info)
5. WHEN displaying a popup THEN the system SHALL support animations (fade, slide, scale, bounce)
6. WHEN multiple popups are requested THEN the system SHALL queue them or stack them based on configuration
7. WHEN a popup is dismissed THEN the system SHALL clean up resources and trigger callbacks
8. WHEN a popup contains interactive elements THEN the system SHALL handle user input appropriately

### Requirement 3: Syllogimous Explanation Popups

**User Story:** As a user, I want to see visual explanations of logical questions using the unified popup system, so that I can understand the spatial/relational structure and learn from my mistakes.

#### Acceptance Criteria

1. WHEN a question is answered THEN the system SHALL provide an option to view the explanation via the unified popup
2. WHEN the user requests an explanation THEN the system SHALL render the appropriate visualization in a popup
3. WHEN displaying 2D spatial questions THEN the system SHALL render a grid visualization with word positions
4. WHEN displaying 3D spatial questions THEN the system SHALL render a layered 3D visualization with depth planes
5. WHEN displaying 4D space-time questions THEN the system SHALL render multiple 3D grids representing time slices
6. WHEN displaying distinction questions THEN the system SHALL render grouped buckets showing same/opposite relationships
7. WHEN displaying linear questions THEN the system SHALL render an ordered sequence showing directional relationships
8. WHEN displaying comparison questions THEN the system SHALL render a sorted list with comparison operators
9. WHEN displaying binary questions THEN the system SHALL render nested sub-explanations with separators
10. WHEN displaying syllogism questions THEN the system SHALL indicate no visual explanation is available
11. WHEN the user hovers over the explanation button THEN the system SHALL show a preview tooltip
12. WHEN the user closes the explanation THEN the system SHALL remove the popup via the unified popup manager

### Requirement 4: Syllogimous Tutorial and Tips System

**User Story:** As a user, I want contextual tips and tutorials for Syllogimous using the unified popup system, so that I can learn how to play effectively.

#### Acceptance Criteria

1. WHEN the user first plays Syllogimous THEN the system SHALL show an introductory tutorial popup
2. WHEN the user encounters a new question type THEN the system SHALL offer a tip popup explaining the mechanics
3. WHEN the user struggles with a question type THEN the system SHALL suggest strategy tips via popup
4. WHEN the user achieves a milestone THEN the system SHALL show a congratulatory popup
5. WHEN the user enables a new feature THEN the system SHALL show an explanatory popup
6. WHEN tips are displayed THEN the system SHALL use the unified popup manager with appropriate styling
7. WHEN the user dismisses a tip THEN the system SHALL remember not to show it again (unless reset)

### Requirement 5: Complete v3 Feature Set

**User Story:** As a user, I want all features from Syllogimous v3, so that I don't lose any functionality in the unified system.

#### Acceptance Criteria

1. WHEN configuring questions THEN the system SHALL support all v3 question types (distinction, linear, syllogism, analogy, binary, negation, meta, space 2D/3D/4D, anchor space)
2. WHEN configuring stimuli THEN the system SHALL support nonsense words, garbage words, meaningful words (nouns/adjectives), emoji, voronoi emoji, and visual noise
3. WHEN configuring difficulty THEN the system SHALL support scramble factor (0-100%), connection branching, spoiler conclusion, and 180° mode for linear
4. WHEN configuring progression THEN the system SHALL support auto-progression with customizable goal, tracking window, success/failure criteria, and grouping modes
5. WHEN configuring timers THEN the system SHALL support no timer, custom timer per question type, and adaptive timer
6. WHEN configuring appearance THEN the system SHALL support background images, color themes, dark/light mode, sound effects (game-like/zen/none), and fast UI mode
7. WHEN configuring profiles THEN the system SHALL support multiple profiles, profile switching, profile sharing via URL, and profile import/export
8. WHEN viewing progress THEN the system SHALL show trailing progress indicator, daily progress bar, and weekly progress bar
9. WHEN viewing history THEN the system SHALL show all answered questions with premises, conclusion, user answer, correct answer, response time, and explanation button
10. WHEN viewing statistics THEN the system SHALL show total time, average time, average correct time, percent correct, and per-question-type breakdowns
11. WHEN using keyboard THEN the system SHALL support Space (start), Esc (end), PgUp/PgDn (mode switching), and custom keybinds for true/false
12. WHEN using carousel mode THEN the system SHALL show premises one at a time with navigation controls

### Requirement 6: Complete v4 Feature Set

**User Story:** As a user, I want all features from Syllogimous v4, so that I benefit from the improved architecture and new capabilities.

#### Acceptance Criteria

1. WHEN using the game THEN the system SHALL use Angular services for state management
2. WHEN calculating statistics THEN the system SHALL provide type-based stats with premise-level breakdowns
3. WHEN using adaptive timer THEN the system SHALL use v4's algorithm with correctness/incorrectness/timeout rates
4. WHEN viewing stats THEN the system SHALL show last 10 questions metrics (sum, count, correct, incorrect, timeout, fastest, slowest)
5. WHEN viewing the game THEN the system SHALL use v4's card component system for question display
6. WHEN viewing feedback THEN the system SHALL use v4's feedback page with detailed results
7. WHEN viewing tiers THEN the system SHALL show tier matrix with score ranges and colors
8. WHEN using playground mode THEN the system SHALL support separate statistics tracking for practice sessions
9. WHEN exporting data THEN the system SHALL support stats export functionality
10. WHEN viewing tutorials THEN the system SHALL show v4's comprehensive tutorial system

### Requirement 7: Auto-Progression System

**User Story:** As a user, I want the game difficulty to automatically adjust based on my performance, so that I am always challenged at the appropriate level.

#### Acceptance Criteria

1. WHEN auto-progression is enabled THEN the system SHALL track the last N questions (configurable, default 20)
2. WHEN the success rate exceeds the success threshold (configurable, default 90%) THEN the system SHALL increase difficulty
3. WHEN the success rate falls below the failure threshold (configurable, default 65%) THEN the system SHALL decrease difficulty
4. WHEN increasing difficulty THEN the system SHALL either decrease timer OR increase premises count
5. WHEN decreasing difficulty THEN the system SHALL either increase timer OR decrease premises count
6. WHEN difficulty changes THEN the system SHALL provide visual feedback to the user
7. WHEN the user disables auto-progression THEN the system SHALL maintain manual settings

### Requirement 8: Adaptive Timer System

**User Story:** As a user, I want intelligent timer adaptation based on my historical performance, so that I have appropriate time pressure for my skill level.

#### Acceptance Criteria

1. WHEN adaptive timer is enabled THEN the system SHALL analyze the last 10 questions of the current difficulty
2. WHEN calculating timer THEN the system SHALL use average response time minus correct responses plus incorrect responses plus timeout responses
3. WHEN moving to a new difficulty level THEN the system SHALL add a bonus time buffer (default 15 seconds)
4. WHEN negations are present THEN the system SHALL add bonus time per negation (default 3 seconds)
5. WHEN meta-relations are present THEN the system SHALL add bonus time per meta-relation (default 4 seconds)
6. WHEN insufficient data exists THEN the system SHALL use default timer values (default 90 seconds)

### Requirement 9: Time Tracking Per Game

**User Story:** As a user, I want to see how much time I spend on each game, so that I can understand my training patterns and balance my cognitive development.

#### Acceptance Criteria

1. WHEN a game session starts THEN the system SHALL record the start timestamp
2. WHEN a game session ends THEN the system SHALL record the end timestamp and calculate duration
3. WHEN storing session data THEN the system SHALL associate duration with the specific game ID
4. WHEN displaying statistics THEN the system SHALL show total time per game
5. WHEN displaying statistics THEN the system SHALL show time distribution across games
6. WHEN displaying statistics THEN the system SHALL show daily and weekly time totals per game
7. WHEN calculating cognitive scores THEN the system SHALL weight contributions by time spent

### Requirement 10: Unified Progress Visualization

**User Story:** As a user, I want to see my Syllogimous progress integrated with my overall cognitive development, so that I understand how logical reasoning fits into my broader training.

#### Acceptance Criteria

1. WHEN viewing the analytics dashboard THEN the system SHALL display Syllogimous-specific metrics
2. WHEN viewing cognitive domain scores THEN the system SHALL show contributions from Syllogimous
3. WHEN viewing time tracking THEN the system SHALL show Syllogimous time alongside other games
4. WHEN viewing trends THEN the system SHALL display Syllogimous performance over time
5. WHEN viewing achievements THEN the system SHALL include Syllogimous-specific achievements

### Requirement 11: Settings Synchronization

**User Story:** As a user, I want my Syllogimous settings to sync with the unified system, so that I have a consistent experience and my preferences are preserved.

#### Acceptance Criteria

1. WHEN the user changes a setting in the unified UI THEN the system SHALL immediately update the game
2. WHEN the user changes a setting in the game THEN the system SHALL update the unified UI
3. WHEN settings are changed THEN the system SHALL save to localStorage
4. WHEN the game loads THEN the system SHALL restore settings from localStorage
5. WHEN settings sync fails THEN the system SHALL log the error and use default values

### Requirement 12: Question Type Mapping to Cognitive Domains

**User Story:** As a developer, I want clear mappings between Syllogimous question types and cognitive domains, so that performance data contributes accurately to cognitive scores.

#### Acceptance Criteria

1. WHEN a distinction question is completed THEN the system SHALL contribute to executive functions (weight 0.70) and working memory (weight 0.50)
2. WHEN a linear question is completed THEN the system SHALL contribute to working memory (weight 0.80) and executive functions (weight 0.60)
3. WHEN a spatial 2D question is completed THEN the system SHALL contribute to perceptual processing (weight 0.85) and working memory (weight 0.70)
4. WHEN a spatial 3D question is completed THEN the system SHALL contribute to perceptual processing (weight 0.90) and working memory (weight 0.75)
5. WHEN a syllogism question is completed THEN the system SHALL contribute to executive functions (weight 0.85) and long-term memory (weight 0.40)
6. WHEN calculating contributions THEN the system SHALL normalize scores to the 000-999 inverted scale

### Requirement 13: Performance Metrics Calculation

**User Story:** As a user, I want scientifically valid performance metrics, so that I can trust the accuracy of my cognitive assessments.

#### Acceptance Criteria

1. WHEN calculating accuracy THEN the system SHALL use (correct answers / total answers) * 100
2. WHEN calculating response time THEN the system SHALL exclude outliers (< 200ms or > mean + 3SD)
3. WHEN calculating difficulty score THEN the system SHALL weight premises count and timer setting
4. WHEN calculating progression rate THEN the system SHALL use linear regression over the last 30 days
5. WHEN displaying metrics THEN the system SHALL show confidence intervals based on sample size

### Requirement 14: Visual Feedback System

**User Story:** As a user, I want immediate visual feedback on my answers, so that I can learn from my performance in real-time.

#### Acceptance Criteria

1. WHEN an answer is correct THEN the system SHALL display a green success animation
2. WHEN an answer is incorrect THEN the system SHALL display a red failure animation
3. WHEN time expires THEN the system SHALL display a yellow timeout animation
4. WHEN auto-progression triggers THEN the system SHALL display a level change notification
5. WHEN settings sync THEN the system SHALL display a brief sync indicator
6. WHEN animations are disabled (fast UI mode) THEN the system SHALL use minimal visual feedback

### Requirement 15: Neuroscience-Backed Metrics Tracking

**User Story:** As a user, I want to see advanced cognitive metrics beyond accuracy and speed, so that I can understand my cognitive development in depth.

#### Acceptance Criteria

1. WHEN tracking performance THEN the system SHALL calculate cognitive flexibility score based on question type switching performance
2. WHEN tracking performance THEN the system SHALL calculate interference resistance score based on performance with distractors (red herrings, negations)
3. WHEN tracking performance THEN the system SHALL calculate pattern recognition speed based on time to identify question structure
4. WHEN tracking performance THEN the system SHALL calculate strategic thinking score based on solution path efficiency
5. WHEN displaying metrics THEN the system SHALL show a brain-shaped visualization with cognitive domain development
6. WHEN displaying the brain visualization THEN the system SHALL highlight regions corresponding to tracked cognitive abilities
7. WHEN displaying the brain visualization THEN the system SHALL use color intensity to represent skill level in each domain
8. WHEN hovering over brain regions THEN the system SHALL display detailed metrics for that cognitive domain
9. WHEN viewing trends THEN the system SHALL show historical development of each neuroscience-backed metric
10. WHEN calculating metrics THEN the system SHALL normalize scores to a 0-100 scale for easy interpretation

### Requirement 16: Interactive Three.js Explanation System

**User Story:** As a user, I want interactive 3D visualizations of logical questions, so that I can manipulate and explore the spatial relationships to deepen my understanding.

#### Acceptance Criteria

1. WHEN viewing an explanation for spatial questions THEN the system SHALL render an interactive Three.js 3D scene
2. WHEN interacting with the 3D scene THEN the system SHALL support mouse rotation (orbit controls)
3. WHEN interacting with the 3D scene THEN the system SHALL support zoom in/out with mouse wheel
4. WHEN interacting with the 3D scene THEN the system SHALL support pan with right-click drag
5. WHEN viewing 2D spatial questions THEN the system SHALL render a 3D grid with items positioned on a plane
6. WHEN viewing 3D spatial questions THEN the system SHALL render a 3D cube with items positioned in 3D space
7. WHEN viewing 4D space-time questions THEN the system SHALL render multiple 3D cubes with animation between time slices
8. WHEN viewing linear questions THEN the system SHALL render a 3D path showing directional relationships
9. WHEN viewing distinction questions THEN the system SHALL render 3D grouped clusters with visual separation
10. WHEN viewing binary questions THEN the system SHALL render nested 3D structures with visual hierarchy
11. WHEN rendering 3D scenes THEN the system SHALL use appropriate lighting (ambient + directional)
12. WHEN rendering 3D scenes THEN the system SHALL use a clean white aesthetic with subtle colors inspired by Brilliant.org
13. WHEN rendering 3D scenes THEN the system SHALL use smooth, calming animations with easing functions
14. WHEN rendering 3D scenes THEN the system SHALL use minimalist geometry with clean lines and simple shapes
15. WHEN rendering 3D scenes THEN the system SHALL use soft shadows and subtle depth cues
16. WHEN rendering 3D scenes THEN the system SHALL use labels/text sprites for word identification
17. WHEN rendering 3D scenes THEN the system SHALL optimize performance for smooth 60fps interaction
18. WHEN the user enables/disables 3D mode THEN the system SHALL fall back to 2D HTML visualizations
19. WHEN on mobile devices THEN the system SHALL support touch gestures (pinch-zoom, two-finger rotate)
20. WHEN rendering fails THEN the system SHALL gracefully degrade to 2D HTML visualizations
21. WHEN animating scene elements THEN the system SHALL use smooth easing (ease-in-out cubic) for calming effect
22. WHEN transitioning between states THEN the system SHALL use gentle fade and scale animations
