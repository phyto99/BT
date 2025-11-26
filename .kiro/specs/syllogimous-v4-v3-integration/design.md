# Design Document

## Overview

This design document outlines the architecture for integrating v3 features into the existing Syllogimous v4 Angular application. The approach is to extend v4's existing services and components with v3's features while maintaining v4's superior architecture, adaptive algorithms, and Angular best practices.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular Application Layer                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │  Directives  │     │
│  │  (Routes)    │  │   (UI)       │  │   (Pipes)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Services Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Syllogimous │  │   Profile    │  │   Theme      │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  │  (Enhanced)  │  │    (New)     │  │    (New)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Stimuli    │  │  Keyboard    │  │   Sound      │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  │    (New)     │  │    (New)     │  │    (New)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Data & Storage Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ localStorage │  │  IndexedDB   │  │   Session    │     │
│  │  (Settings)  │  │  (History)   │  │   Storage    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Enhanced Stimuli Service

**Purpose:** Generate diverse stimuli types for questions

**Interface:**
```typescript
@Injectable({ providedIn: 'root' })
export class StimuliService {
  // Configuration
  generateStimuli(count: number, settings: StimuliSettings): string[]
  
  // Individual generators
  generateNonsenseWord(length: number): string
  generateGarbageWord(length: number): string
  selectMeaningfulWord(type: 'noun' | 'adjective'): string
  selectEmoji(): string
  generateJunkEmoji(): string
  generateVisualNoiseTag(splits: number): string
  
  // Utilities
  createStimuliConfigs(settings: StimuliSettings): StimuliConfig[]
  ensureUniqueness(stimuli: string[]): boolean
}

interface StimuliSettings {
  useNonsenseWords: boolean
  nonsenseWordLength: number
  useGarbageWords: boolean
  garbageWordLength: number
  useMeaningfulWords: boolean
  meaningfulNouns: boolean
  meaningfulAdjectives: boolean
  useEmoji: boolean
  useJunkEmoji: boolean
  useVisualNoise: boolean
  visualNoiseSplits: number
}

interface StimuliConfig {
  type: 'nonsense' | 'garbage' | 'meaningful' | 'emoji' | 'junk-emoji' | 'visual-noise'
  limit: number
  generate: () => string
  unique: Set<string>
}
```

**Implementation Details:**
- Port v3's stimuli.js logic to TypeScript
- Use Set for uniqueness tracking
- Cycle through enabled types for distribution
- Filter banned word patterns for nonsense words
- Prevent consecutive consonants in garbage words

### 2. Enhanced Linear Question Generation

**Purpose:** Add 180° backtracking mode and multiple wording types

**Interface:**
```typescript
// Add to SyllogimousService
class SyllogimousService {
  // New methods
  createLinearBacktracking(numOfPremises: number, wording: LinearWording): Question
  buildBacktrackingMap(words: string[], generator: LinearGenerator): BacktrackingResult
  findTwoWordIndexes(words: string[]): [number, number]
  
  // Enhanced existing
  createComparison(numOfPremises: number, type: ComparisonType): Question // Enhanced
}

enum LinearWording {
  LeftRight = 'leftright',
  TopUnder = 'topunder',
  Comparison = 'comparison',
  Temporal = 'temporal',
  Contains = 'contains'
}

class LinearGenerator {
  constructor(
    public name: string,
    public prev: string,
    public prevMin: string,
    public next: string,
    public nextMin: string,
    public equal: string,
    public equalMin: string
  ) {}
  
  forwards(a: string, b: string): Premise
  backwards(a: string, b: string): Premise
  createLinearPremise(a: string, b: string): Premise
  createBacktrackingLinearPremise(a: string, b: string, options: number[], negationOptions: number[]): string
}

interface BacktrackingResult {
  premises: Premise[]
  conclusion: string
  isValid: boolean
  buckets: string[][]
  bucketMap: Record<string, number>
}
```

**Implementation Details:**
- Create LinearGenerator class for each wording type
- Implement bucket-based logic for backtracking
- Use weighted random selection for wording types
- Support connection branching (words in multiple premises)
- Calculate ideal distance for conclusion pairs

### 3. Spatial Question Generators

**Purpose:** Add true spatial questions with coordinate maps

**New Files:**
- `src/app/syllogimous/generators/spatial.generator.ts`

**Interface:**
```typescript
@Injectable({ providedIn: 'root' })
export class SpatialGeneratorService {
  createSpatial2D(numOfPremises: number, settings: Settings): Question
  createSpatial3D(numOfPremises: number, settings: Settings): Question
  createSpatial4D(numOfPremises: number, settings: Settings): Question
  createAnchorSpace(numOfPremises: number, settings: Settings): Question
  
  // Utilities
  assignCoordinates2D(words: string[], gridSize: number): Map<string, [number, number]>
  assignCoordinates3D(words: string[], cubeSize: number): Map<string, [number, number, number]>
  assignCoordinates4D(words: string[], size: number): Map<string, [number, number, number, number]>
  generateSpatialPremises(wordCoordMap: Map<string, number[]>, dimensions: number): string[]
}

// Add to Question model
interface Question {
  // ... existing fields
  wordCoordMap?: Map<string, number[]>  // NEW
}
```

**Implementation Details:**
- Store coordinates in wordCoordMap for visualization
- Use 8 directions for 2D (N, S, E, W, NE, NW, SE, SW)
- Use 26 directions for 3D (all combinations)
- Add temporal dimension for 4D
- Implement diamond pattern for anchor space

### 4. Theme Service

**Purpose:** Manage UI customization and theming

**New Files:**
- `src/app/syllogimous/services/theme.service.ts`

**Interface:**
```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Theme management
  applyTheme(theme: ThemeSettings): void
  setBackgroundImage(imageData: string): void
  setBackgroundColor(color: string): void
  setDarkMode(enabled: boolean): void
  
  // Mode management
  setFastUIMode(enabled: boolean): void
  setMinimalMode(enabled: boolean): void
  setWidePremisesMode(enabled: boolean): void
  setCarouselMode(enabled: boolean): void
  
  // Observables
  theme$: Observable<ThemeSettings>
  darkMode$: Observable<boolean>
}

interface ThemeSettings {
  backgroundImage?: string  // base64
  backgroundColor: string
  darkMode: boolean
  fastUI: boolean
  minimalMode: boolean
  widePremises: boolean
  carouselMode: boolean
}
```

**Implementation Details:**
- Use CSS custom properties for dynamic theming
- Store background image as base64 in localStorage
- Apply theme changes via document.documentElement.style
- Disable animations in fast UI mode via CSS class
- Use BehaviorSubject for reactive theme updates

### 5. Profile Service

**Purpose:** Manage multiple user profiles

**New Files:**
- `src/app/syllogimous/services/profile.service.ts`
- `src/app/syllogimous/models/profile.model.ts`

**Interface:**
```typescript
@Injectable({ providedIn: 'root' })
export class ProfileService {
  // CRUD operations
  createProfile(name: string): Profile
  getProfile(id: string): Profile | null
  getAllProfiles(): Profile[]
  updateProfile(id: string, updates: Partial<Profile>): void
  deleteProfile(id: string): void
  
  // Active profile
  setActiveProfile(id: string): void
  getActiveProfile(): Profile
  activeProfile$: Observable<Profile>
  
  // Import/Export
  exportProfile(id: string): string  // JSON
  importProfile(json: string): Profile
  
  // Sharing
  generateShareURL(id: string): string
  importFromURL(url: string): Profile
}

interface Profile {
  id: string
  name: string
  settings: Settings
  createdAt: number
  lastUsed: number
  statistics: ProfileStatistics
}

interface ProfileStatistics {
  totalSessions: number
  totalQuestions: number
  totalTime: number
  overallAccuracy: number
  questionTypeStats: Record<string, TypeStats>
}
```

**Implementation Details:**
- Store profiles in localStorage as JSON
- Use UUID for profile IDs
- Encode settings in URL parameters for sharing
- Validate imported JSON structure
- Handle name conflicts by appending numbers

### 6. Keyboard Service

**Purpose:** Manage keyboard shortcuts

**New Files:**
- `src/app/syllogimous/services/keyboard.service.ts`

**Interface:**
```typescript
@Injectable({ providedIn: 'root' })
export class KeyboardService {
  // Registration
  registerShortcut(key: string, action: string, handler: () => void): void
  unregisterShortcut(key: string, action: string): void
  
  // Configuration
  setKeybind(action: string, key: string): void
  getKeybind(action: string): string
  resetToDefaults(): void
  
  // Validation
  detectConflicts(): KeybindConflict[]
  isValidKeybind(key: string): boolean
  
  // Observables
  keybinds$: Observable<Record<string, string>>
}

interface KeybindConflict {
  key: string
  actions: string[]
}

enum KeyboardAction {
  StartGame = 'start-game',
  EndGame = 'end-game',
  PreviousMode = 'previous-mode',
  NextMode = 'next-mode',
  AnswerTrue = 'answer-true',
  AnswerFalse = 'answer-false'
}
```

**Implementation Details:**
- Use @HostListener for global key events
- Store keybinds in Settings model
- Prevent default browser behavior for registered keys
- Show visual hints in UI for active shortcuts
- Validate against browser reserved keys

### 7. Sound Service

**Purpose:** Manage sound effects

**New Files:**
- `src/app/syllogimous/services/sound.service.ts`
- `src/assets/sounds/` - Sound effect files

**Interface:**
```typescript
@Injectable({ providedIn: 'root' })
export class SoundService {
  // Playback
  playCorrect(): void
  playIncorrect(): void
  playTimeout(): void
  playLevelUp(): void
  playLevelDown(): void
  
  // Configuration
  setSoundMode(mode: 'none' | 'game' | 'zen'): void
  setVolume(volume: number): void  // 0-1
  
  // Preloading
  preloadSounds(): Promise<void>
}
```

**Implementation Details:**
- Use Web Audio API for sound playback
- Preload sounds on app init
- Different sound sets for 'game' vs 'zen' modes
- Fade out sounds smoothly
- Handle audio context restrictions (user gesture required)

### 8. Progress Visualization Components

**New Files:**
- `src/app/syllogimous/components/trailing-progress/`
- `src/app/syllogimous/components/progress-bars/`

**Interface:**
```typescript
@Component({
  selector: 'app-trailing-progress',
  template: '...'
})
export class TrailingProgressComponent {
  @Input() questions: QuestionRecord[]
  @Input() windowSize: number = 20
  @Input() grouping: 'simple' | 'separate' = 'simple'
}

@Component({
  selector: 'app-progress-bars',
  template: '...'
})
export class ProgressBarsComponent {
  @Input() period: 'daily' | 'weekly'
  @Input() data: ProgressData
}

interface ProgressData {
  timeSpent: number
  questionsAnswered: number
  accuracy: number
}
```

**Implementation Details:**
- Use colored dots (green/red/yellow) for trailing progress
- Show tooltips on hover with question details
- Use CSS Grid for dot layout
- Calculate daily/weekly stats with 4am cutoff
- Use Monday 4am for week boundary

### 9. Enhanced Settings Model

**Purpose:** Extend Settings with all v3 options

**Files to Modify:**
- `src/app/syllogimous/models/settings.models.ts`

**New Fields:**
```typescript
export class Settings {
  // ... existing fields
  
  // Stimuli (NEW)
  stimuli: StimuliSettings
  
  // Linear enhancements (NEW)
  enableBacktrackingLinear: boolean
  linearWording: string  // comma-separated
  linearWordingWeights: Record<LinearWording, number>
  
  // Spatial (NEW)
  enableSpatial2D: boolean
  enableSpatial3D: boolean
  enableSpatial4D: boolean
  enableAnchorSpace: boolean
  
  // UI Customization (NEW)
  theme: ThemeSettings
  
  // Keyboard (NEW)
  keyboardShortcuts: Record<KeyboardAction, string>
  
  // Progress (NEW)
  trailingProgressWindow: number
  progressGrouping: 'simple' | 'separate'
  
  // Advanced (NEW)
  scrambleFactor: number  // 0-100
  spoilerConclusion: boolean
  autoProgressionTrailing: number
  autoProgressionSuccessPercent: number
  autoProgressionFailPercent: number
  autoProgressionChange: 'auto' | 'custom'
  autoProgressionTimeDrop: number
  autoProgressionTimeBump: number
  autoProgressionGrouping: 'simple' | 'separate'
}
```

### 10. Fill-in-the-Blank Service

**Purpose:** Generate fill-in-the-blank questions with plausible alternatives

**New Files:**
- `src/app/syllogimous/services/fill-in-blank.service.ts`

**Interface:**
```typescript
@Injectable({ providedIn: 'root' })
export class FillInBlankService {
  // Main methods
  convertToFillInBlank(question: Question): FillInBlankQuestion
  generateAlternatives(hiddenElement: string, question: Question, count: number): string[]
  
  // Selection methods
  selectElementToHide(question: Question): HiddenElementInfo
  
  // Validation
  validateAlternatives(alternatives: string[], correct: string): boolean
  ensureGrammaticalConsistency(alternatives: string[]): boolean
  ensureLogicalDistinctness(alternatives: string[], question: Question): boolean
}

interface FillInBlankQuestion extends Question {
  answerMode: 'fill-in-blank'
  hiddenElementIndex: number  // Index of hidden premise (-1 for conclusion)
  correctAnswer: string
  alternatives: string[]
}

interface HiddenElementInfo {
  index: number  // -1 for conclusion, 0+ for premise index
  element: string
  type: 'premise' | 'conclusion'
}
```

**Implementation Details:**
- Randomly select premise or conclusion to hide
- Generate 3-5 grammatically consistent alternatives
- Ensure alternatives are logically distinct from correct answer
- Use question type context to generate plausible alternatives
- For linear questions: generate alternatives with different orderings
- For spatial questions: generate alternatives with different directions
- For distinction questions: generate alternatives with different groupings
- Validate that correct answer is always included in alternatives

### 11. Unified Popup Manager Integration

**Purpose:** Integrate with existing unified popup system for consistent UI

**Existing Files:**
- `shared/unified-popup-manager.js` (already implemented)

**Integration Points:**
```typescript
// Import unified popup manager
import { UnifiedPopupManager } from '../../../shared/unified-popup-manager.js';

// Use in Angular services
@Injectable({ providedIn: 'root' })
export class PopupIntegrationService {
  private popupManager: UnifiedPopupManager;
  
  constructor() {
    this.popupManager = new UnifiedPopupManager();
  }
  
  // Explanation popups
  showExplanation(question: Question): void {
    const content = this.renderExplanation(question);
    this.popupManager.show({
      type: 'explanation',
      content,
      position: 'center',
      theme: 'dark',
      animation: 'fade',
      modal: true
    });
  }
  
  // Tip popups
  showTip(tipContent: string): void {
    this.popupManager.show({
      type: 'tip',
      content: tipContent,
      position: 'top',
      theme: 'info',
      animation: 'slide',
      duration: 5000
    });
  }
  
  // Achievement popups
  showAchievement(achievement: Achievement): void {
    this.popupManager.show({
      type: 'achievement',
      content: this.renderAchievement(achievement),
      position: 'top',
      theme: 'success',
      animation: 'bounce',
      duration: 3000
    });
  }
}
```

**Implementation Details:**
- Wrap existing UnifiedPopupManager in Angular service
- Use for all explanation displays
- Use for tips and tutorials
- Use for achievement notifications
- Use for error messages and warnings
- Maintain consistent styling across all popups
- Support queue management for sequential popups

### 12. Enhanced History Page

**New Files:**
- `src/app/syllogimous/pages/history/history.page.ts`
- `src/app/syllogimous/components/history-item/history-item.component.ts`
- `src/app/syllogimous/components/history-filters/history-filters.component.ts`

**Interface:**
```typescript
@Component({
  selector: 'app-history-page',
  template: '...'
})
export class HistoryPage {
  questions$: Observable<Question[]>
  filters: HistoryFilters
  sortBy: 'date' | 'time' | 'type' | 'correctness'
  
  applyFilters(): void
  exportHistory(format: 'json' | 'csv'): void
  clearHistory(): void
}

interface HistoryFilters {
  questionType?: EnumQuestionType
  correctness?: 'all' | 'correct' | 'incorrect' | 'timeout'
  dateRange?: { start: Date, end: Date }
  searchText?: string
}
```

**Implementation Details:**
- Use virtual scrolling for large histories (CDK)
- Implement client-side filtering and sorting
- Show explanation popup on button click
- Export to JSON/CSV using Blob API
- Confirm before clearing history

## Data Models

### Enhanced Question Model

```typescript
interface Question {
  // Existing v4 fields
  type: EnumQuestionType
  premises: string[]
  conclusion: string
  isValid: boolean
  createdAt: number
  answeredAt?: number
  userAnswer?: boolean
  
  // Enhanced fields
  wordCoordMap?: Map<string, number[]>  // For spatial questions
  buckets?: string[][]  // For distinction/backtracking
  bucket?: string[]  // For linear
  modifiers?: string[]  // e.g., ['180', 'negation']
  
  // Metadata
  difficulty: {
    premises: number
    timer: number
    scrambleFactor: number
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Nonsense Word Pattern Consistency
*For any* generated nonsense word, the characters should alternate between consonants and vowels.
**Validates: Requirements 1.2**

### Property 2: Nonsense Word Pattern Filtering
*For any* generated nonsense word, it should not contain any banned word patterns.
**Validates: Requirements 1.3**

### Property 3: Garbage Word Consonant Uniqueness
*For any* generated garbage word, no two consecutive characters should be identical.
**Validates: Requirements 1.5**

### Property 4: Stimuli Type Distribution
*For any* set of generated stimuli with multiple types enabled, the distribution across types should be approximately even.
**Validates: Requirements 1.10**

### Property 5: Stimuli Uniqueness Within Question
*For any* generated question, all stimuli within that question should be unique (no duplicates).
**Validates: Requirements 1.11**

### Property 6: Stimuli Type Fallback
*For any* stimuli generation where one type is exhausted, the system should automatically switch to the next available type.
**Validates: Requirements 1.12**

### Property 7: Backtracking Allows Backwards Relationships
*For any* linear question with 180° backtracking enabled, at least some relationships should go backwards in the sequence.
**Validates: Requirements 2.1**

### Property 8: Backtracking Uses Bucket Structure
*For any* backtracking question, words should be organized into ordered buckets with bucket data available.
**Validates: Requirements 2.2, 2.6**

### Property 9: Backtracking Supports Branching
*For any* backtracking question with branching enabled, some words should appear in multiple premises.
**Validates: Requirements 2.3**

### Property 10: Backtracking Conclusion Format
*For any* backtracking question conclusion, it should use comparison operators (less than, equal to, or greater than).
**Validates: Requirements 2.4**

### Property 11: Backtracking Distance Calculation
*For any* backtracking question, the ideal distance between conclusion word pairs should be correctly calculated based on bucket positions.
**Validates: Requirements 2.5**

### Property 12: Linear Wording Weight Distribution
*For any* set of generated linear questions with multiple wordings enabled, the distribution should match the configured weights.
**Validates: Requirements 3.6**

### Property 13: Linear Minimal Symbol Consistency
*For any* linear question with a specific wording type, all premises should use the appropriate minimal symbols for that wording.
**Validates: Requirements 3.9**

### Property 14: Linear Wording Consistency
*For any* linear question, all premises should use the same wording type throughout.
**Validates: Requirements 3.10**

### Property 15: Spatial 2D Direction Validity
*For any* spatial 2D question, all directional relationships should use only the 8 valid directions (N, S, E, W, NE, NW, SE, SW).
**Validates: Requirements 4.1**

### Property 16: Spatial 3D Direction Validity
*For any* spatial 3D question, all directional relationships should use only valid 3D directions (26 total).
**Validates: Requirements 4.2**

### Property 17: Spatial 4D Temporal Dimension
*For any* spatial 4D question, coordinates should include a temporal dimension (4th coordinate).
**Validates: Requirements 4.3**

### Property 18: Anchor Space Diamond Pattern
*For any* anchor space question, the initial word positions should form a diamond pattern.
**Validates: Requirements 4.4**

### Property 19: Spatial Coordinate Map Presence
*For any* spatial question, a wordCoordMap should be present with coordinate data for all words.
**Validates: Requirements 4.5**

### Property 20: Spatial 2D Coordinate Bounds
*For any* spatial 2D question, all coordinates should be [x, y] pairs within the configured grid bounds.
**Validates: Requirements 4.6**

### Property 21: Spatial 3D Coordinate Bounds
*For any* spatial 3D question, all coordinates should be [x, y, z] triples within the configured cube bounds.
**Validates: Requirements 4.7**

### Property 22: Spatial 4D Coordinate Dimensions
*For any* spatial 4D question, all coordinates should be [x, y, z, t] quadruples.
**Validates: Requirements 4.8**

### Property 23: Spatial Coordinate Uniqueness
*For any* spatial question, no two words should share the same coordinates.
**Validates: Requirements 4.10**

### Property 24: Profile Name Uniqueness
*For any* profile creation attempt, if the name already exists, the system should reject it or make it unique.
**Validates: Requirements 6.2**

### Property 25: New Profile Default Settings
*For any* newly created profile, it should be initialized with default settings.
**Validates: Requirements 6.3**

### Property 26: Profile Switch Saves Current State
*For any* profile switch operation, the current profile's state should be saved before switching.
**Validates: Requirements 6.4**

### Property 27: Profile Switch Loads Correct Data
*For any* profile switch operation, the loaded profile should contain its own settings and statistics.
**Validates: Requirements 6.5**

### Property 28: Last Profile Deletion Prevention
*For any* profile deletion attempt, if it's the last remaining profile, the deletion should be prevented.
**Validates: Requirements 6.7**

### Property 29: Profile Export Completeness
*For any* exported profile, the JSON should contain all settings and statistics data.
**Validates: Requirements 6.8**

### Property 30: Profile Import Validation
*For any* profile import attempt, invalid JSON structure should be rejected with an error.
**Validates: Requirements 6.10**

### Property 31: Profile Import Name Conflict Resolution
*For any* profile import with a name conflict, the system should append a number to make the name unique.
**Validates: Requirements 6.11**

### Property 32: Profile URL Encoding Correctness
*For any* profile shared via URL, the encoded settings should be decodable back to the original settings.
**Validates: Requirements 6.12**

### Property 33: Profile URL Decoding Creates Profile
*For any* valid shared URL, decoding should create a new profile with the encoded settings.
**Validates: Requirements 6.14**

### Property 34: Keyboard Conflict Detection
*For any* keybind configuration, if two actions are assigned the same key, the system should detect and report the conflict.
**Validates: Requirements 7.9**

### Property 35: Keyboard Conflict Prevention
*For any* keybind save attempt with conflicts, the save should be blocked until conflicts are resolved.
**Validates: Requirements 7.10**

### Property 36: Progress Dot Color Correctness
*For any* trailing progress display, dots should be colored green for correct, red for incorrect, and yellow for timeout.
**Validates: Requirements 8.2**

### Property 37: Daily Progress 4am Cutoff
*For any* daily progress calculation, the day boundary should be at 4am (not midnight).
**Validates: Requirements 8.6**

### Property 38: Weekly Progress Monday 4am Cutoff
*For any* weekly progress calculation, the week boundary should be Monday at 4am.
**Validates: Requirements 8.9**

### Property 39: Progress Grouping Simple Mode
*For any* progress tracking with "simple" grouping, progress should be tracked across all question types combined.
**Validates: Requirements 8.12**

### Property 40: Progress Grouping Separate Mode
*For any* progress tracking with "separate" grouping, progress should be tracked independently per question type.
**Validates: Requirements 8.13**

### Property 41: Scramble Factor Application
*For any* set of generated questions with scramble factor N, approximately N% should have scrambled premise order.
**Validates: Requirements 9.2**

### Property 42: Auto Strategy Timer Calculation
*For any* auto progression strategy, the timer should be calculated from response time percentiles.
**Validates: Requirements 9.9**

### Property 43: Settings Persistence
*For any* settings change, the new settings should be immediately saved to localStorage.
**Validates: Requirements 9.13**

### Property 44: Settings Validation
*For any* invalid settings, the system should show a validation error and prevent saving.
**Validates: Requirements 9.14**

### Property 45: History Chronological Order
*For any* history display, questions should be sorted in reverse chronological order (newest first).
**Validates: Requirements 10.1**

### Property 46: Analogy Subject Count
*For any* generated analogy question, it should have exactly 4 subjects (A, B, C, D).
**Validates: Requirements 11.8**

### Property 47: Analogy Equivalence Determination
*For any* analogy question, the system should correctly determine if the two relationships are equivalent.
**Validates: Requirements 11.9**

### Property 48: Analogy Phrasing Correctness
*For any* analogy question, it should use "is alike" for equivalent relationships and "is unlike" for non-equivalent.
**Validates: Requirements 11.10**

### Property 49: Analogy Format Consistency
*For any* analogy question, it should be formatted as "A to B [is alike/unlike] C to D".
**Validates: Requirements 11.11**

### Property 50: Analogy Negation Inversion
*For any* analogy question with negation, the relationship statement should be inverted.
**Validates: Requirements 11.12**

### Property 51: Analogy Spatial Equivalence
*For any* analogy wrapping spatial questions, equivalence should be determined by comparing coordinate differences.
**Validates: Requirements 13.14**

### Property 52: Fill-in-Blank Element Selection
*For any* question converted to fill-in-the-blank mode, exactly one premise or the conclusion should be hidden.
**Validates: Requirements 11.1**

### Property 53: Fill-in-Blank Alternative Count
*For any* fill-in-the-blank question, the number of alternatives should be between 3 and 5 (inclusive).
**Validates: Requirements 11.2**

### Property 54: Fill-in-Blank Alternative Distinctness
*For any* fill-in-the-blank question, all alternatives should be logically distinct from each other and grammatically consistent.
**Validates: Requirements 11.5**

### Property 55: Fill-in-Blank Correct Answer Inclusion
*For any* fill-in-the-blank question, the correct answer should always be included in the alternatives list.
**Validates: Requirements 11.2**

### Property 56: Fill-in-Blank Answer Validation
*For any* fill-in-the-blank question, selecting the correct alternative should be validated as correct, and selecting any other alternative should be validated as incorrect.
**Validates: Requirements 11.4**

### Property 57: Answer Mode Statistics Separation
*For any* set of questions with mixed answer modes, statistics should be tracked separately for validity mode and fill-in-the-blank mode.
**Validates: Requirements 11.10**

### Property 58: Mixed Mode Alternation
*For any* sequence of questions in mixed mode, the answer mode should alternate randomly between validity and fill-in-the-blank.
**Validates: Requirements 11.9**

### Property 59: Popup Manager Centralization
*For any* popup request (explanation, tip, notification), it should be routed through the unified popup manager.
**Validates: Requirements 12.1, 12.2, 12.3**

### Property 60: Popup Configuration Completeness
*For any* popup with specified configuration (type, position, theme, animation), all specified properties should be applied to the rendered popup.
**Validates: Requirements 12.4, 12.5, 12.6, 12.7**

### Property 61: Popup Queue Ordering
*For any* sequence of queued popups, they should appear in the order they were requested.
**Validates: Requirements 12.8**

### Property 62: Popup Cleanup Completeness
*For any* dismissed popup, all DOM elements should be removed and cleanup callbacks should be invoked.
**Validates: Requirements 12.9**

## Error Handling

### Error Categories

1. **Storage Errors**
   - localStorage quota exceeded
   - IndexedDB unavailable
   - Profile import/export failures

2. **Generation Errors**
   - Insufficient stimuli available
   - Invalid settings configuration
   - Maximum iteration count reached

3. **UI Errors**
   - Theme application failures
   - Sound playback errors
   - Keyboard conflict detection

### Error Handling Strategies

**Graceful Degradation:**
- If localStorage full, warn user and disable new profiles
- If sounds fail to load, continue without audio
- If theme fails to apply, use default theme
- If stimuli type exhausted, fall back to nonsense words

**User Feedback:**
- Show toast notifications for errors
- Provide actionable error messages
- Log errors to console for debugging
- Offer retry options where applicable

## Testing Strategy

### Unit Tests

**New Services:**
- StimuliService: Test each generator function
- ProfileService: Test CRUD operations
- ThemeService: Test theme application
- KeyboardService: Test shortcut registration
- SoundService: Test playback logic

**Enhanced Services:**
- SyllogimousService: Test new question types
- Test backtracking logic
- Test spatial coordinate generation

### Integration Tests

- Test profile switching with settings reload
- Test theme changes across components
- Test keyboard shortcuts in different contexts
- Test progress tracking across sessions

### E2E Tests

- Complete game flow with new features
- Profile import/export workflow
- Settings customization workflow
- History filtering and export

## Performance Considerations

### Optimization Strategies

**Lazy Loading:**
- Lazy load history page
- Lazy load profile management page
- Lazy load sound files

**Caching:**
- Cache generated stimuli configurations
- Cache theme calculations
- Cache profile data in memory

**Debouncing:**
- Debounce settings changes (300ms)
- Debounce search input (300ms)
- Debounce theme updates (100ms)

### Performance Targets

- Question generation: < 100ms
- Settings save: < 50ms
- Profile switch: < 200ms
- Theme change: < 50ms
- History filter: < 100ms (1000 items)

## Migration Strategy

### Backward Compatibility

1. **Settings Migration:**
   - Detect old v4 settings format
   - Add new fields with defaults
   - Preserve existing values
   - No data loss

2. **History Migration:**
   - Existing history continues to work
   - New fields optional
   - Graceful handling of missing fields

3. **Profile Creation:**
   - Create default profile from existing settings
   - Name it "Default Profile"
   - Migrate existing statistics

### Migration Steps

1. On app load, check for migration flag
2. If not migrated, run migration
3. Create default profile from current settings
4. Set migration flag
5. Continue normal operation

## Deployment Strategy

### Phased Rollout

**Phase 1: Foundation (Week 1-2)**
- Deploy StimuliService
- Deploy enhanced linear questions
- Deploy spatial questions

**Phase 2: UI (Week 3-4)**
- Deploy ThemeService
- Deploy KeyboardService
- Deploy SoundService

**Phase 3: Features (Week 5-6)**
- Deploy ProfileService
- Deploy progress visualization
- Deploy enhanced settings

**Phase 4: Polish (Week 7-8)**
- Deploy enhanced history
- Deploy improved analogy
- Bug fixes and optimization

### Rollback Plan

- Feature flags for each new feature
- Ability to disable features individually
- Fallback to v4 behavior if errors
- Data backup before migration

## Success Metrics

✅ All new services implemented and tested
✅ All new components implemented and tested
✅ 80%+ code coverage
✅ Zero regression in v4 functionality
✅ < 5% performance degradation
✅ All acceptance criteria met
✅ User testing positive feedback

