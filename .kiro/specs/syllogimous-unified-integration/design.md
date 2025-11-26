# Design Document

## Overview

This design integrates Syllogimous (combining features from v3 and v4) into the unified cognitive training system. The architecture uses a modular approach with a unified popup system, reactive settings synchronization, comprehensive time tracking, and cognitive domain mapping. The design prioritizes code reuse, maintainability, and scientific validity of metrics.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Unified System Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Popup      │  │  Cognitive   │  │   Settings   │     │
│  │   Manager    │  │  Progression │  │   Manager    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  Syllogimous Integration Layer               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Syllogimous │  │  Explanation │  │  Progress    │     │
│  │   Service    │  │   Renderer   │  │   Tracker    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Syllogimous Core Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Question    │  │   Timer      │  │   Stats      │     │
│  │  Generator   │  │   System     │  │   Engine     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Data Persistence Layer                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  IndexedDB   │  │ localStorage │  │   Session    │     │
│  │   (History)  │  │  (Settings)  │  │   Storage    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Action → Settings Manager → Reactive Proxy → Game Update
                                                  ↓
Question Answered → Stats Engine → Cognitive Progression → IndexedDB
                                                  ↓
                                          Popup Manager → Explanation Renderer
```

## Components and Interfaces

### 1. Unified Popup Manager

**Purpose:** Centralized system for displaying all types of popups across all games.

**Interface:**
```javascript
class UnifiedPopupManager {
  // Core methods
  show(config: PopupConfig): PopupInstance
  hide(popupId: string): void
  hideAll(): void
  
  // Queue management
  queue(config: PopupConfig): void
  processQueue(): void
  
  // Lifecycle hooks
  onShow(callback: Function): void
  onHide(callback: Function): void
}

interface PopupConfig {
  type: 'explanation' | 'tip' | 'tutorial' | 'achievement' | 'notification'
  content: string | HTMLElement | PopupContent
  position: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'mouse' | {x: number, y: number}
  theme: 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'
  animation: 'fade' | 'slide' | 'scale' | 'bounce' | 'none'
  duration?: number  // Auto-hide after ms (0 = manual close)
  modal?: boolean    // Block interaction with background
  closeButton?: boolean
  onClose?: Function
  zIndex?: number
}

interface PopupInstance {
  id: string
  element: HTMLElement
  close(): void
  update(content: string | HTMLElement): void
}
```

**Implementation Details:**
- Uses CSS Grid for flexible positioning
- Supports stacking multiple popups with z-index management
- Implements queue system for sequential popups
- Provides animation system using CSS transitions
- Handles escape key and click-outside-to-close
- Responsive design for mobile devices

### 2. Explanation Renderer

**Purpose:** Generates visual representations of logical question structures.

**Interface:**
```javascript
class ExplanationRenderer {
  // Main rendering methods
  render(question: Question): HTMLElement
  renderGrid2D(wordCoordMap: Map<string, [number, number]>): HTMLElement
  renderGrid3D(wordCoordMap: Map<string, [number, number, number]>): HTMLElement
  renderGrid4D(wordCoordMap: Map<string, [number, number, number, number]>): HTMLElement
  renderBuckets(buckets: string[][]): HTMLElement
  renderSequence(sequence: string[]): HTMLElement
  
  // Utility methods
  createGridFromMap(wordCoordMap: Map): Grid
  centerText(text: string, width: number): string
  createFiller(grid: Grid): string
}

interface Question {
  type: 'distinction' | 'linear' | 'space-2d' | 'space-3d' | 'space-4d' | 'syllogism' | 'binary'
  premises: string[]
  conclusion: string
  isValid: boolean
  wordCoordMap?: Map<string, number[]>
  buckets?: string[][]
  bucket?: string[]
  subresults?: Question[]
  category?: string
}
```

**Visualization Strategies:**
- **2D Grid:** HTML table with centered text, color-coded cells
- **3D Grid:** Layered 2D grids with perspective CSS transforms
- **4D Grid:** Multiple 3D grids labeled by time slice
- **Buckets:** Flexbox containers with visual grouping
- **Sequence:** Horizontal flow with directional arrows
- **Binary:** Recursive rendering with visual separators

### 3. Syllogimous Service

**Purpose:** Core game logic, state management, and question generation.

**Interface:**
```javascript
class SyllogimousService {
  // State
  currentQuestion: Question
  settings: SyllogimousSettings
  session: GameSession
  
  // Core methods
  init(settings: SyllogimousSettings): void
  generateQuestion(): Question
  checkAnswer(userAnswer: boolean): AnswerResult
  endSession(): SessionSummary
  
  // Question generation
  createDistinctionQuestion(premises: number): Question
  createLinearQuestion(premises: number): Question
  createSpatialQuestion(premises: number, dimensions: 2|3|4): Question
  createSyllogismQuestion(premises: number): Question
  createBinaryQuestion(premises: number): Question
  createAnalogyQuestion(premises: number): Question
  
  // Settings management
  updateSettings(partial: Partial<SyllogimousSettings>): void
  loadSettings(): SyllogimousSettings
  saveSettings(): void
}

interface SyllogimousSettings {
  // Question types
  enableDistinction: boolean
  enableLinear: boolean
  enableSpatial2D: boolean
  enableSpatial3D: boolean
  enableSpatial4D: boolean
  enableSyllogism: boolean
  enableBinary: boolean
  enableAnalogy: boolean
  enableNegation: boolean
  enableMeta: boolean
  enableAnchorSpace: boolean
  
  // Difficulty
  premises: number
  scrambleFactor: number  // 0-100
  connectionBranching: boolean
  spoilerConclusion: boolean
  linear180Mode: boolean
  
  // Stimuli
  useNonsenseWords: boolean
  nonsenseWordLength: number
  useGarbageWords: boolean
  garbageWordLength: number
  useMeaningfulWords: boolean
  meaningfulNouns: boolean
  meaningfulAdjectives: boolean
  useEmoji: boolean
  useVoronoiEmoji: boolean
  useVisualNoise: boolean
  visualNoiseSplit: number
  
  // Timer
  timerMode: 'none' | 'custom' | 'adaptive'
  customTimers: Record<string, number>
  adaptiveTimerConfig: AdaptiveTimerConfig
  
  // Progression
  autoProgression: boolean
  autoProgressionGoal: number
  autoProgressionTrailing: number
  autoProgressionSuccessPercent: number
  autoProgressionFailPercent: number
  autoProgressionGrouping: 'simple' | 'separate'
  autoProgressionChange: 'auto' | 'custom'
  autoProgressionTimeDrop: number
  autoProgressionTimeBump: number
  
  // Appearance
  darkMode: boolean
  backgroundColor: string
  backgroundImage?: string
  soundEffects: 'none' | 'game' | 'zen'
  fastUI: boolean
  minimalMode: boolean
  widePremises: boolean
  carouselMode: boolean
  
  // Profiles
  currentProfile: string
  profiles: Record<string, SyllogimousSettings>
}

interface AdaptiveTimerConfig {
  correctRate: number      // Time reduction per correct answer
  incorrectRate: number    // Time addition per incorrect answer
  timeoutRate: number      // Time addition per timeout
  newLevelBonus: number    // Extra time for new difficulty level
  negationBonus: number    // Extra time per negation
  metaRelationBonus: number // Extra time per meta-relation
}

interface AnswerResult {
  correct: boolean
  responseTime: number
  question: Question
  userAnswer: boolean
  progressionTriggered: boolean
  newDifficulty?: {
    premises: number
    timer: number
  }
}

interface SessionSummary {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  timeouts: number
  accuracy: number
  averageResponseTime: number
  questionTypeBreakdown: Record<string, TypeStats>
  duration: number
}
```

### 4. Progress Tracker

**Purpose:** Tracks auto-progression and difficulty adjustment.

**Interface:**
```javascript
class ProgressTracker {
  // Core methods
  recordAnswer(question: Question, result: AnswerResult): void
  checkProgressionTrigger(questionType: string): ProgressionResult
  adjustDifficulty(questionType: string, direction: 'up' | 'down'): DifficultyAdjustment
  
  // Data retrieval
  getTrailingProgress(questionType: string, count: number): AnswerResult[]
  getSuccessRate(questionType: string, count: number): number
  
  // Visualization
  renderProgressIndicator(): HTMLElement
  renderDailyProgress(): HTMLElement
  renderWeeklyProgress(): HTMLElement
}

interface ProgressionResult {
  triggered: boolean
  direction?: 'up' | 'down'
  reason?: string
  oldDifficulty: DifficultyLevel
  newDifficulty?: DifficultyLevel
}

interface DifficultyLevel {
  premises: number
  timer: number
  questionType: string
}

interface DifficultyAdjustment {
  premises: number
  timer: number
  strategy: 'decrease-timer' | 'increase-premises' | 'increase-timer' | 'decrease-premises'
}
```

### 5. Stats Engine

**Purpose:** Calculates and stores performance statistics.

**Interface:**
```javascript
class StatsEngine {
  // Calculation methods
  calculateTypeBasedStats(sessions: GameSession[]): TypeBasedStats
  calculatePremiseBreakdown(sessions: GameSession[]): PremiseBreakdown
  calculateTrends(sessions: GameSession[], timeWindow: number): TrendAnalysis
  
  // Metric calculations
  calculateAccuracy(sessions: GameSession[]): number
  calculateAverageResponseTime(sessions: GameSession[]): number
  calculateLast10Metrics(sessions: GameSession[]): Last10Metrics
  
  // Export
  exportStats(format: 'json' | 'csv'): string
}

interface TypeBasedStats {
  [questionType: string]: {
    completed: number
    accuracy: number
    stats: {
      [premises: string]: PremiseStats
    }
  }
}

interface PremiseStats {
  count: number
  sum: number
  correct: number
  incorrect: number
  timeout: number
  fastest: number
  slowest: number
  last10Count: number
  last10Sum: number
  last10Correct: number
  last10Incorrect: number
  last10Timeout: number
  last10Fastest: number
  last10Slowest: number
}

interface TrendAnalysis {
  trend: 'improving' | 'stable' | 'declining' | 'insufficient_data'
  slope: number
  intercept: number
  rSquared: number
  equation: string
  confidence: number
}
```

### 6. Cognitive Integration Service

**Purpose:** Maps Syllogimous performance to cognitive domains.

**Interface:**
```javascript
class CognitiveIntegrationService {
  // Mapping methods
  mapQuestionToDomains(question: Question): DomainContribution[]
  calculateCognitiveScore(result: AnswerResult): CognitiveUpdate
  
  // Session handling
  startCognitiveSession(gameId: string): string
  endCognitiveSession(sessionId: string, summary: SessionSummary): void
  
  // Time tracking
  recordGameTime(gameId: string, duration: number): void
  getGameTimeStats(gameId: string): TimeStats
}

interface DomainContribution {
  domain: 'workingMemory' | 'attention' | 'processingSpeed' | 'executiveFunctions' | 'perceptualProcessing' | 'longTermMemory'
  weight: number
  constructs: string[]
}

interface CognitiveUpdate {
  domains: Record<string, number>  // domain -> normalized score (0-999)
  confidence: number
}

interface TimeStats {
  totalTime: number
  sessionCount: number
  averageSessionTime: number
  dailyTime: number
  weeklyTime: number
  timeByQuestionType: Record<string, number>
}
```

## Data Models

### Question Model
```javascript
interface Question {
  id: string
  type: QuestionType
  premises: string[]
  conclusion: string
  isValid: boolean
  difficulty: {
    premises: number
    timer: number
    scrambleFactor: number
  }
  metadata: {
    wordCoordMap?: Map<string, number[]>
    buckets?: string[][]
    bucket?: string[]
    subresults?: Question[]
    category?: string
    modifiers?: string[]
    negations?: number
    metaRelations?: number
  }
  createdAt: number
}

type QuestionType = 
  | 'distinction'
  | 'linear'
  | 'space-2d'
  | 'space-3d'
  | 'space-4d'
  | 'syllogism'
  | 'binary'
  | 'analogy'
  | 'anchor-space'
```

### Session Model
```javascript
interface GameSession {
  id: string
  gameId: 'syllogimous'
  startTime: number
  endTime?: number
  duration?: number
  questions: QuestionRecord[]
  settings: SyllogimousSettings
  summary?: SessionSummary
  cognitiveContributions?: Record<string, number>
}

interface QuestionRecord {
  question: Question
  userAnswer?: boolean
  correct: boolean
  responseTime: number
  timestamp: number
  progressionTriggered: boolean
}
```

### Profile Model
```javascript
interface Profile {
  id: string
  name: string
  settings: SyllogimousSettings
  createdAt: number
  lastUsed: number
  statistics: {
    totalSessions: number
    totalQuestions: number
    totalTime: number
    overallAccuracy: number
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified several areas where properties can be consolidated:

**Redundancy Analysis:**
- Properties 3.3-3.10 (visualization types) can be combined into a single comprehensive property about correct visualization rendering
- Properties 5.1-5.12 and 6.1-6.10 (feature sets) can be grouped into feature availability properties
- Properties 11.1 and 11.2 (bidirectional sync) can be combined into a single sync property
- Properties 11.3 and 11.4 (settings persistence) form a round-trip property
- Properties 14.1-14.3 (feedback animations) can be combined into a single feedback property

**Consolidated Properties:**
The following properties provide unique validation value and will be implemented:

1. Game loading and initialization (1.1, 1.2 combined as round-trip)
2. Session data tracking completeness (1.3)
3. Data persistence (1.4)
4. Resource cleanup and state preservation (1.5)
5. Popup manager usage (2.1)
6. Popup configuration support (2.2-2.5 combined)
7. Popup queue/stack management (2.6)
8. Popup cleanup (2.7)
9. Explanation rendering (3.1-3.10 combined)
10. Tutorial and tips system (4.1-4.7 combined)
11. Feature completeness (5.1-5.12, 6.1-6.10 combined)
12. Auto-progression logic (7.1-7.7 combined)
13. Adaptive timer calculation (8.1-8.6 combined)
14. Time tracking (9.1-9.7 combined)
15. Settings synchronization round-trip (11.1-11.4 combined)
16. Cognitive domain mapping (12.1-12.6 combined)
17. Metrics calculation accuracy (13.1-13.5 combined)
18. Visual feedback system (14.1-14.6 combined)

### Correctness Properties

Property 1: Settings persistence round-trip
*For any* valid settings object, saving to localStorage then loading should produce an equivalent settings object
**Validates: Requirements 1.2, 11.3, 11.4**

Property 2: Session data completeness
*For any* game session, the tracked data should contain all required fields (question type, premises count, timer settings, accuracy, timestamps)
**Validates: Requirements 1.3**

Property 3: Data persistence integrity
*For any* completed session, ending the session should result in the session data being retrievable from the database
**Validates: Requirements 1.4**

Property 4: Resource cleanup preservation
*For any* game switch operation, switching games should cleanup all resources (event listeners, timers, DOM elements) while preserving the game state
**Validates: Requirements 1.5**

Property 5: Popup manager centralization
*For any* popup request from any game, the request should be routed through the unified popup manager
**Validates: Requirements 2.1**

Property 6: Popup configuration completeness
*For any* popup configuration with valid parameters (type, position, theme, animation), the popup should render with all specified properties applied
**Validates: Requirements 2.2, 2.3, 2.4, 2.5**

Property 7: Popup queue ordering
*For any* sequence of popup requests, if queuing is enabled, popups should appear in the order they were requested
**Validates: Requirements 2.6**

Property 8: Popup cleanup completeness
*For any* dismissed popup, all associated DOM elements should be removed and cleanup callbacks should be invoked
**Validates: Requirements 2.7, 2.8**

Property 9: Explanation visualization correctness
*For any* question with visualization data (wordCoordMap, buckets, or subresults), requesting an explanation should render the appropriate visualization type matching the question structure
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12**

Property 10: Tutorial and tips contextual display
*For any* user action that triggers a tutorial or tip condition (first play, new question type, struggle, milestone, feature enable), the appropriate popup should be displayed via the unified popup manager
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

Property 11: Tip dismissal persistence
*For any* dismissed tip, dismissing it should prevent it from appearing again in future sessions unless explicitly reset
**Validates: Requirements 4.7**

Property 12: Feature availability completeness
*For any* feature from v3 or v4 feature sets, the feature should be available and functional in the unified system
**Validates: Requirements 5.1-5.12, 6.1-6.10**

Property 13: Auto-progression threshold logic
*For any* sequence of N questions with auto-progression enabled, if the success rate exceeds the success threshold, difficulty should increase; if it falls below the failure threshold, difficulty should decrease
**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7**

Property 14: Adaptive timer calculation accuracy
*For any* set of recent questions at a given difficulty, the adaptive timer should calculate as: average response time - (correctRate × correct) + (incorrectRate × incorrect) + (timeoutRate × timeout) + applicable bonuses
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**

Property 15: Time tracking accuracy
*For any* game session, the recorded duration should equal the end timestamp minus the start timestamp, and aggregations (daily, weekly, per-game) should sum correctly
**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7**

Property 16: Settings synchronization bidirectionality
*For any* setting change in either the unified UI or the game, the change should propagate to the other side and persist to localStorage
**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

Property 17: Cognitive domain mapping accuracy
*For any* completed question, the cognitive domain contributions should match the predefined mappings with correct weights for that question type
**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6**

Property 18: Metrics calculation correctness
*For any* set of session data, calculated metrics (accuracy, response time, difficulty score, progression rate) should match their mathematical definitions
**Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**

Property 19: Visual feedback appropriateness
*For any* answer result (correct, incorrect, timeout), the displayed feedback should match the result type (green for correct, red for incorrect, yellow for timeout), unless fast UI mode is enabled
**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6**

Property 20: Neuroscience metrics calculation accuracy
*For any* set of game sessions, the calculated neuroscience metrics (cognitive flexibility, interference resistance, pattern recognition speed, strategic thinking) should match their mathematical definitions and be normalized to 0-100 scale
**Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.10**

Property 21: Brain visualization correctness
*For any* set of neuroscience metrics, the brain visualization should display all tracked cognitive domains with color intensity proportional to the metric scores
**Validates: Requirements 15.5, 15.6, 15.7, 15.8, 15.9**

Property 22: Three.js scene rendering completeness
*For any* question with spatial data (wordCoordMap, buckets, or subresults), rendering in 3D mode should produce a valid Three.js scene with all elements positioned correctly
**Validates: Requirements 16.1, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10**

Property 23: Three.js interaction responsiveness
*For any* rendered 3D scene, user interactions (rotation, zoom, pan) should update the camera position and maintain 60fps performance
**Validates: Requirements 16.2, 16.3, 16.4, 16.14, 16.16**

Property 24: Three.js graceful degradation
*For any* system without WebGL support or when 3D mode is disabled, the explanation system should fall back to 2D HTML visualizations without errors
**Validates: Requirements 16.15, 16.17**

## Error Handling

### Error Categories

1. **Data Errors**
   - Invalid question generation
   - Corrupted localStorage data
   - IndexedDB transaction failures
   - Missing required fields

2. **Sync Errors**
   - Settings sync timeout
   - Message passing failures
   - State inconsistency

3. **UI Errors**
   - Popup rendering failures
   - Animation errors
   - DOM manipulation errors

4. **Calculation Errors**
   - Division by zero in metrics
   - Invalid statistical calculations
   - Overflow/underflow in scores

### Error Handling Strategies

**Graceful Degradation:**
- If popup system fails, fall back to console logging
- If settings sync fails, use cached values
- If visualization fails, show text-only explanation
- If timer calculation fails, use default values

**Error Recovery:**
- Retry failed IndexedDB operations (max 3 attempts)
- Validate and sanitize all user input
- Provide clear error messages to users
- Log errors for debugging

**Data Validation:**
```javascript
function validateQuestion(question: Question): ValidationResult {
  const errors = [];
  
  if (!question.type) errors.push('Missing question type');
  if (!question.premises || question.premises.length === 0) errors.push('Missing premises');
  if (question.conclusion === undefined) errors.push('Missing conclusion');
  if (question.isValid === undefined) errors.push('Missing validity');
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateSettings(settings: SyllogimousSettings): ValidationResult {
  const errors = [];
  
  if (settings.premises < 1 || settings.premises > 100) errors.push('Invalid premises count');
  if (settings.scrambleFactor < 0 || settings.scrambleFactor > 100) errors.push('Invalid scramble factor');
  if (settings.autoProgressionSuccessPercent < 50 || settings.autoProgressionSuccessPercent > 100) errors.push('Invalid success threshold');
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

## Testing Strategy

### Unit Testing

**Core Logic Tests:**
- Question generation for each type
- Settings validation and sanitization
- Metrics calculation functions
- Cognitive domain mapping
- Timer calculation algorithms
- Progress tracking logic

**Component Tests:**
- Popup manager lifecycle
- Explanation renderer output
- Stats engine calculations
- Settings synchronization

**Test Framework:** Jest or Vitest
**Coverage Approach:** Comprehensive testing of all features - every function, component, and user flow must be tested to ensure perfect implementation

### Property-Based Testing

**Property Testing Library:** fast-check (JavaScript/TypeScript)

**Test Configuration:**
- Minimum 100 iterations per property
- Seed-based reproducibility for debugging
- Shrinking enabled for minimal failing examples

**Generator Strategies:**
- **Question Generator:** Random question types, premises counts (2-20), valid/invalid conclusions
- **Settings Generator:** Random but valid settings within constraints
- **Session Generator:** Random sequences of questions with realistic timing
- **Popup Config Generator:** Random valid popup configurations

**Example Property Test:**
```javascript
import fc from 'fast-check';

// Property 1: Settings persistence round-trip
test('Settings persistence round-trip', () => {
  fc.assert(
    fc.property(
      settingsGenerator(),
      (settings) => {
        // Save settings
        saveSettings(settings);
        
        // Load settings
        const loaded = loadSettings();
        
        // Should be equivalent
        expect(loaded).toEqual(settings);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 13: Auto-progression threshold logic
test('Auto-progression threshold logic', () => {
  fc.assert(
    fc.property(
      fc.array(answerResultGenerator(), { minLength: 20, maxLength: 20 }),
      fc.integer({ min: 50, max: 100 }),
      fc.integer({ min: 0, max: 99 }),
      (answers, successThreshold, failureThreshold) => {
        fc.pre(failureThreshold < successThreshold); // Precondition
        
        const successRate = (answers.filter(a => a.correct).length / answers.length) * 100;
        const result = checkProgressionTrigger(answers, successThreshold, failureThreshold);
        
        if (successRate >= successThreshold) {
          expect(result.triggered).toBe(true);
          expect(result.direction).toBe('up');
        } else if (successRate <= failureThreshold) {
          expect(result.triggered).toBe(true);
          expect(result.direction).toBe('down');
        } else {
          expect(result.triggered).toBe(false);
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Test Scenarios:**
1. Complete game session flow (start → questions → end → save)
2. Settings change propagation (UI → game → localStorage)
3. Popup lifecycle (show → interact → close → cleanup)
4. Auto-progression trigger (questions → analysis → difficulty change)
5. Cognitive integration (session → domain mapping → score update)

**Test Environment:**
- Headless browser (Playwright or Puppeteer)
- Mock IndexedDB
- Mock localStorage
- Simulated user interactions

### End-to-End Testing

**User Flows:**
1. New user onboarding (tutorial → first game → explanation)
2. Experienced user session (load settings → play → auto-progression → view stats)
3. Profile management (create → switch → export → import)
4. Multi-game session (Syllogimous → switch → other game → return)

## Performance Considerations

### Optimization Strategies

**Question Generation:**
- Cache generated questions for reuse
- Lazy load visualization data
- Use Web Workers for complex calculations

**Popup System:**
- Virtual DOM for popup content
- CSS transforms for animations (GPU acceleration)
- Debounce rapid popup requests

**Data Storage:**
- Batch IndexedDB writes
- Compress large session data
- Implement data retention policies (auto-delete old sessions)

**Settings Sync:**
- Debounce rapid setting changes
- Use requestAnimationFrame for UI updates
- Implement change detection to avoid unnecessary syncs

### Performance Targets

- Question generation: < 50ms
- Popup render: < 16ms (60fps)
- Settings sync: < 10ms
- Database write: < 100ms
- Explanation render: < 100ms

## Security Considerations

### Data Privacy

- All data stored locally (IndexedDB, localStorage)
- No external API calls for core functionality
- Profile sharing uses URL encoding (no server storage)

### Input Validation

- Sanitize all user input
- Validate settings ranges
- Escape HTML in user-generated content
- Prevent XSS in popup content

### Resource Limits

- Maximum session history: 10,000 questions
- Maximum popup queue: 10 popups
- Maximum profile count: 50 profiles
- Automatic cleanup of old data

## Deployment Strategy

### Build Process

1. TypeScript compilation
2. Bundle with Vite/Webpack
3. Minification and tree-shaking
4. Source map generation
5. Asset optimization

### Integration Steps

1. Add Syllogimous to game registry
2. Implement unified popup manager
3. Integrate cognitive mapping
4. Add time tracking hooks
5. Update analytics dashboard
6. Test all integrations
7. Deploy to production

### Rollback Plan

- Feature flags for gradual rollout
- Ability to disable Syllogimous integration
- Fallback to standalone v3/v4 if critical issues
- Data migration tools for reverting

## Maintenance and Extensibility

### Code Organization

```
shared/
  unified-popup-manager.js
  cognitive-integration.js
  time-tracking.js
  
games/
  syllogimous/
    core/
      question-generator.js
      timer-system.js
      stats-engine.js
    components/
      explanation-renderer.js
      progress-tracker.js
      settings-manager.js
    services/
      syllogimous-service.js
      cognitive-integration-service.js
    utils/
      validators.js
      calculators.js
    types/
      interfaces.ts
      models.ts
```

### Extension Points

- **New Question Types:** Implement `QuestionGenerator` interface
- **New Visualizations:** Extend `ExplanationRenderer`
- **New Metrics:** Add to `StatsEngine`
- **New Cognitive Domains:** Update `CognitiveIntegrationService`
- **New Popup Types:** Extend `PopupConfig` interface

### Documentation Requirements

- API documentation for all public interfaces
- User guide for Syllogimous features
- Developer guide for extending the system
- Migration guide from v3/v4 to unified
- Troubleshooting guide for common issues

### 7. Neuroscience Metrics Engine

**Purpose:** Calculate advanced cognitive metrics beyond basic accuracy and speed.

**Interface:**
```javascript
class NeuroscienceMetricsEngine {
  // Core calculations
  calculateCognitiveFlexibility(sessions: GameSession[]): FlexibilityScore
  calculateInterferenceResistance(sessions: GameSession[]): InterferenceScore
  calculatePatternRecognitionSpeed(sessions: GameSession[]): PatternScore
  calculateStrategicThinking(sessions: GameSession[]): StrategyScore
  
  // Aggregation
  calculateAllMetrics(sessions: GameSession[]): NeuroscienceMetrics
  
  // Visualization
  renderBrainVisualization(metrics: NeuroscienceMetrics): HTMLElement
}

interface FlexibilityScore {
  score: number  // 0-100
  switchCost: number  // Average time penalty when switching question types
  adaptationRate: number  // How quickly performance recovers after switch
  typeVariety: number  // Number of different question types attempted
}

interface InterferenceScore {
  score: number  // 0-100
  negationAccuracy: number  // Accuracy on questions with negations
  redHerringResistance: number  // Accuracy with distractor premises
  complexityHandling: number  // Performance degradation with increased complexity
}

interface PatternScore {
  score: number  // 0-100
  structureRecognitionTime: number  // Time to first interaction
  learningCurve: number  // Improvement rate on repeated patterns
  transferAbility: number  // Performance on novel but similar patterns
}

interface StrategyScore {
  score: number  // 0-100
  solutionEfficiency: number  // Optimal vs actual solution path
  planningTime: number  // Time spent before first answer attempt
  errorRecovery: number  // Ability to correct mistakes
}

interface NeuroscienceMetrics {
  cognitiveFlexibility: FlexibilityScore
  interferenceResistance: InterferenceScore
  patternRecognition: PatternScore
  strategicThinking: StrategyScore
  timestamp: number
  confidence: number
}
```

**Calculation Strategies:**

**Cognitive Flexibility:**
- Track question type transitions
- Measure performance drop immediately after switch
- Calculate recovery rate over next N questions
- Weight by variety of types attempted

**Interference Resistance:**
- Compare accuracy on clean vs noisy questions
- Measure performance with negations vs without
- Track accuracy as premise count increases
- Analyze red herring detection rate

**Pattern Recognition Speed:**
- Measure time from question display to first interaction
- Track improvement on repeated question structures
- Analyze transfer to novel but similar patterns
- Calculate learning curve slope

**Strategic Thinking:**
- Analyze solution path efficiency (if trackable)
- Measure planning time (time before first answer)
- Track error correction patterns
- Evaluate systematic vs random approach

**Brain Visualization:**
- SVG-based brain diagram with labeled regions
- Color intensity mapping (0-100 scale)
- Interactive hover tooltips with detailed metrics
- Animated transitions when metrics update
- Responsive design for mobile

### 8. Three.js Explanation Renderer

**Purpose:** Provide interactive 3D visualizations of logical question structures.

**Interface:**
```javascript
class ThreeJSExplanationRenderer {
  // Core rendering
  render3DExplanation(question: Question, container: HTMLElement): Scene3D
  
  // Question type renderers
  render2DSpatial(wordCoordMap: Map<string, [number, number]>): Scene3D
  render3DSpatial(wordCoordMap: Map<string, [number, number, number]>): Scene3D
  render4DSpatial(wordCoordMap: Map<string, [number, number, number, number]>): Scene3D
  renderLinear(sequence: string[], relationships: string[]): Scene3D
  renderDistinction(buckets: string[][]): Scene3D
  renderBinary(subresults: Question[]): Scene3D
  
  // Scene management
  setupScene(): THREE.Scene
  setupCamera(): THREE.PerspectiveCamera
  setupLights(): THREE.Light[]
  setupControls(camera: THREE.Camera, renderer: THREE.Renderer): OrbitControls
  
  // Utilities
  createTextSprite(text: string, color: string): THREE.Sprite
  createGridHelper(size: number, divisions: number): THREE.GridHelper
  createConnectionLine(start: THREE.Vector3, end: THREE.Vector3): THREE.Line
  animateScene(): void
  dispose(): void
}

interface Scene3D {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  animate: () => void
  dispose: () => void
}
```

**Implementation Details:**

**Brilliant.org-Inspired Aesthetic:**
- **Color Palette:**
  - Background: Pure white (#FFFFFF) or very light gray (#F8F9FA)
  - Primary elements: Soft white (#FFFFFF) with subtle shadows
  - Accent colors: Muted pastels (soft blue #6B9BD1, soft green #7BC47F, soft purple #9B8FC4)
  - Text: Dark gray (#2C3E50) for contrast
  - Grid lines: Very light gray (#E8E8E8) with low opacity

- **Materials:**
  - Use `THREE.MeshStandardMaterial` for realistic lighting
  - Metalness: 0.1 (subtle shine)
  - Roughness: 0.8 (matte finish)
  - Emissive: Subtle glow for highlights

- **Lighting:**
  - Ambient light: Soft white (#FFFFFF, intensity 0.6)
  - Directional light: Warm white (#FFF8F0, intensity 0.4)
  - No harsh shadows, use `shadowMap.type = THREE.PCFSoftShadowMap`

- **Animations:**
  - Use GSAP or Tween.js for smooth easing
  - Easing function: `Power2.easeInOut` or `Cubic.easeInOut`
  - Duration: 800-1200ms for calming effect
  - Stagger animations for sequential reveals

**2D Spatial (Grid on Plane):**
```javascript
// Create a clean white grid with subtle lines
const gridHelper = new THREE.GridHelper(10, 10, 0xE8E8E8, 0xE8E8E8);
gridHelper.material.opacity = 0.3;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Add word sprites with soft colors
for (const [word, [x, y]] of wordCoordMap) {
  const sprite = createTextSprite(word, '#6B9BD1');
  sprite.position.set(x, y, 0);
  
  // Animate entrance with fade and scale
  sprite.scale.set(0, 0, 0);
  sprite.material.opacity = 0;
  gsap.to(sprite.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'power2.out' });
  gsap.to(sprite.material, { opacity: 1, duration: 0.8, ease: 'power2.out' });
  
  scene.add(sprite);
}
```

**3D Spatial (Cube):**
```javascript
// Create 3D grid helper
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Add word sprites at 3D positions
for (const [word, [x, y, z]] of wordCoordMap) {
  const sprite = createTextSprite(word, '#00ff00');
  sprite.position.set(x, y, z);
  scene.add(sprite);
  
  // Add connection lines to show relationships
  const line = createConnectionLine(
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(x, 0, z)  // Drop line to ground
  );
  scene.add(line);
}
```

**4D Space-Time (Animated Cubes):**
```javascript
// Create multiple 3D scenes for each time slice
const timeSlices = [];
for (let t = 0; t < timeSteps; t++) {
  const sliceGroup = new THREE.Group();
  sliceGroup.position.x = t * 15;  // Offset each time slice
  
  for (const [word, [x, y, z, time]] of wordCoordMap) {
    if (time === t) {
      const sprite = createTextSprite(word, '#00ff00');
      sprite.position.set(x, y, z);
      sliceGroup.add(sprite);
    }
  }
  
  timeSlices.push(sliceGroup);
  scene.add(sliceGroup);
}

// Animate camera moving through time
function animateTime() {
  camera.position.x = Math.sin(Date.now() * 0.001) * 20;
}
```

**Linear (3D Path):**
```javascript
// Create a curved path showing sequence
const points = [];
for (let i = 0; i < sequence.length; i++) {
  points.push(new THREE.Vector3(i * 2, Math.sin(i) * 2, 0));
}

const curve = new THREE.CatmullRomCurve3(points);
const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(tube);

// Add word sprites along path
for (let i = 0; i < sequence.length; i++) {
  const sprite = createTextSprite(sequence[i], '#ffffff');
  sprite.position.copy(points[i]);
  scene.add(sprite);
}
```

**Distinction (3D Clusters):**
```javascript
// Create separated clusters for each bucket
for (let b = 0; b < buckets.length; b++) {
  const clusterGroup = new THREE.Group();
  clusterGroup.position.x = b * 5;
  
  for (let i = 0; i < buckets[b].length; i++) {
    const sprite = createTextSprite(buckets[b][i], '#00ff00');
    sprite.position.set(
      Math.random() * 2 - 1,
      i * 0.5,
      Math.random() * 2 - 1
    );
    clusterGroup.add(sprite);
  }
  
  // Add bounding box for cluster
  const box = new THREE.BoxHelper(clusterGroup, 0x00ff00);
  scene.add(box);
  scene.add(clusterGroup);
}
```

**Binary (Nested Hierarchy):**
```javascript
// Create tree structure showing nested logic
function renderBinaryTree(question: Question, depth: number, position: THREE.Vector3) {
  const sprite = createTextSprite(question.conclusion, '#00ff00');
  sprite.position.copy(position);
  scene.add(sprite);
  
  if (question.subresults) {
    for (let i = 0; i < question.subresults.length; i++) {
      const childPos = new THREE.Vector3(
        position.x + (i - 0.5) * 3 / depth,
        position.y - 2,
        position.z
      );
      
      // Draw connection line
      const line = createConnectionLine(position, childPos);
      scene.add(line);
      
      // Recursively render children
      renderBinaryTree(question.subresults[i], depth + 1, childPos);
    }
  }
}
```

**Performance Optimization:**
- Use instanced meshes for repeated geometries
- Implement frustum culling
- Use LOD (Level of Detail) for complex scenes
- Limit particle count for mobile devices
- Use requestAnimationFrame for smooth 60fps
- Dispose of geometries and materials on cleanup

**Fallback Strategy:**
- Detect WebGL support on initialization
- Provide settings toggle for 3D mode
- Gracefully degrade to 2D HTML visualizations
- Show performance warning on low-end devices

## Conclusion

This design provides a comprehensive integration of Syllogimous into the unified cognitive training system, combining the best features from both v3 and v4 while adding new capabilities for time tracking, cognitive domain mapping, a modular popup system, neuroscience-backed metrics, and interactive Three.js visualizations. The architecture is designed for maintainability, extensibility, and scientific validity of cognitive assessments.


### 8. Three.js Explanation Renderer (Brilliant.org-Inspired)

**Purpose:** Provide interactive 3D visualizations with calming white aesthetic inspired by Brilliant.org.

**Brilliant.org Aesthetic Principles:**
- Clean white background with subtle grays
- Soft pastel accent colors (blue, green, purple, orange)
- Smooth, calming animations with gentle easing
- Minimalist geometry with clean lines
- Soft shadows and subtle depth cues
- Staggered entrance animations for visual flow

**Color Palette:**
- Background: Pure white (#FFFFFF) or very light gray (#F8F9FA)
- Primary elements: Soft white (#FFFFFF) with subtle shadows
- Accent colors:
  - Soft blue: #6B9BD1
  - Soft green: #7BC47F
  - Soft purple: #9B8FC4
  - Soft orange: #F4A460
- Text: Dark gray (#2C3E50) for contrast
- Grid lines: Very light gray (#E8E8E8) with low opacity (0.2-0.3)

**Materials (THREE.MeshStandardMaterial):**
- Color: 0xFFFFFF (white base)
- Metalness: 0.1 (subtle shine)
- Roughness: 0.7-0.8 (matte finish)
- Emissive: Accent color (0x6B9BD1, 0x7BC47F, etc.)
- EmissiveIntensity: 0.1-0.2 (subtle glow)

**Lighting:**
- Ambient light: Soft white (#FFFFFF, intensity 0.6)
- Directional light: Warm white (#FFF8F0, intensity 0.4)
- Shadow map: `THREE.PCFSoftShadowMap` for soft shadows
- No harsh contrasts or dramatic lighting

**Animations (GSAP):**
- Entrance: `back.out(1.7)` for playful bounce effect
- Transitions: `power2.out` for smooth fade
- Camera: `power1.inOut` for smooth movement
- Duration: 800-1200ms for calming effect
- Stagger: 100-150ms between elements
- Scale: From 0 to 1 with fade-in

**Interface:**
```javascript
class ThreeJSExplanationRenderer {
  // Core rendering
  render3DExplanation(question: Question, container: HTMLElement): Scene3D
  
  // Question type renderers
  render2DSpatial(wordCoordMap: Map): Scene3D
  render3DSpatial(wordCoordMap: Map): Scene3D
  render4DSpatial(wordCoordMap: Map): Scene3D
  renderLinear(sequence: string[]): Scene3D
  renderDistinction(buckets: string[][]): Scene3D
  renderBinary(subresults: Question[]): Scene3D
  
  // Scene utilities
  setupScene(): THREE.Scene
  setupCamera(): THREE.PerspectiveCamera
  setupLights(): THREE.Light[]
  setupControls(camera, renderer): OrbitControls
  
  // Aesthetic utilities
  createSubtleGrid(size, divisions): THREE.GridHelper
  createSoftSphere(radius, color): THREE.Mesh
  createTextSprite(text, color): THREE.Sprite
  animateEntrance(object, delay): void
  
  dispose(): void
}
```

**Key Implementation Details:**
- All spheres: White base with colored emissive glow
- All grids: Very light gray with low opacity
- All lines: Subtle gray with transparency
- All text: Dark gray for readability
- All animations: Smooth with stagger for flow
- All shadows: Soft and subtle

See THREEJS_FEASIBILITY_ANALYSIS.md for detailed code examples of each question type.
