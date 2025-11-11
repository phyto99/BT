# Unified Progression System - Design Document

## Overview

The Unified Progression System extends the existing unified brain training platform with comprehensive progress tracking, analytics, and goal management that works across all games. Built on the existing reactive settings architecture, it provides visual progress indicators, cross-game statistics, achievements, and tier-based progression while maintaining the lightweight, local-first approach.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Unified Brain Training System               │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Existing Unified Core (unified-core.js)       │  │
│  │  - Game Loading (Blob URL system)                     │  │
│  │  - Reactive Settings (Proxy-based)                    │  │
│  │  - Settings Persistence (localStorage)                │  │
│  │  - Game Communication (postMessage)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │      NEW: Unified Progression System (NEW FILE)       │  │
│  │  - Progress Tracking                                  │  │
│  │  - Statistics Calculation                             │  │
│  │  - Achievement Management                             │  │
│  │  - Tier System                                        │  │
│  │  - Session Management                                 │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │      NEW: Progress UI Components (NEW FILE)           │  │
│  │  - Daily Progress Bar (left side, vertical)          │  │
│  │  - Weekly Progress Bar (right side, vertical)        │  │
│  │  - Statistics Modal                                   │  │
│  │  - Achievements Modal                                 │  │
│  │  - Tier Badge                                         │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Data Persistence Layer                   │  │
│  │  ┌─────────────────┐  ┌──────────────────────────┐   │  │
│  │  │  localStorage   │  │      IndexedDB           │   │  │
│  │  │  - Settings     │  │  - Session History       │   │  │
│  │  │  - Profiles     │  │  - Progress Data         │   │  │
│  │  │  - Preferences  │  │  - Statistics Cache      │   │  │
│  │  │                 │  │  - Achievements          │   │  │
│  │  └─────────────────┘  └──────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Module Structure

#### New Files to Create

1. **shared/unified-progression.js** - Core progression logic
2. **shared/unified-progress-ui.js** - UI components for progress visualization
3. **shared/unified-stats.js** - Statistics calculation and analytics



## Core Components

### 1. UnifiedProgressionSystem Class

Main class that manages all progression features:

```javascript
class UnifiedProgressionSystem {
  constructor() {
    this.db = null;
    this.currentProfile = null;
    this.currentSession = null;
    this.progressListeners = new Map();
    this.achievements = new Map();
    this.tiers = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    this.init();
  }
  
  // Core Methods
  async init()
  async initDatabase()
  async loadProfile(profileId)
  async createProfile(name)
  
  // Session Management
  startSession(gameId)
  endSession()
  updateSessionMetrics(metrics)
  
  // Progress Tracking
  trackTime(gameId, seconds)
  getDailyProgress()
  getWeeklyProgress()
  updateProgressBars()
  
  // Statistics
  calculateOverallStats()
  calculateGameStats(gameId)
  calculateTrends(period)
  
  // Achievements
  checkAchievements()
  unlockAchievement(achievementId)
  getAchievements()
  
  // Tier System
  calculateTier()
  advanceTier()
  getTierProgress()
  
  // Data Management
  exportData(format)
  importData(data)
  cleanupOldData(retentionDays)
}
```

### 2. Progress Bar Components

Visual indicators for daily and weekly progress:

```javascript
class ProgressBar {
  constructor(options) {
    this.position = options.position; // 'left' or 'right'
    this.type = options.type; // 'daily' or 'weekly'
    this.goal = options.goal;
    this.current = 0;
    this.element = null;
    this.create();
  }
  
  create()
  update(current, goal)
  animate()
  showTooltip()
  celebrate()
}
```

### 3. Statistics Dashboard

Comprehensive analytics view:

```javascript
class StatisticsDashboard {
  constructor(progressionSystem) {
    this.system = progressionSystem;
    this.charts = new Map();
  }
  
  render()
  renderOverallStats()
  renderGameBreakdown()
  renderTrendChart()
  renderAchievements()
  renderTierProgress()
  exportStats(format)
}
```

## Data Models

### Profile Schema

```javascript
{
  id: 'uuid',
  name: 'User Name',
  createdAt: timestamp,
  lastActiveAt: timestamp,
  settings: {
    dailyGoal: 30, // minutes
    weeklyGoal: 210, // minutes
    retentionDays: 90,
    theme: 'dark',
    notifications: {
      dailyGoal: true,
      weeklyGoal: true,
      achievements: true,
      tierAdvance: true
    }
  },
  stats: {
    totalTime: 0, // seconds
    totalSessions: 0,
    currentStreak: 0,
    bestStreak: 0,
    currentTier: 'Beginner',
    gamesPlayed: []
  }
}
```

### Session Schema

```javascript
{
  id: 'uuid',
  profileId: 'uuid',
  gameId: 'game-name',
  startTime: timestamp,
  endTime: timestamp,
  duration: seconds,
  metrics: {
    // Game-specific metrics
    accuracy: 0.85,
    level: 5,
    score: 1000
  }
}
```

### Progress Schema

```javascript
{
  date: 'YYYY-MM-DD',
  profileId: 'uuid',
  daily: {
    goal: 30,
    current: 25,
    sessions: ['session-id-1', 'session-id-2'],
    games: {
      'quad-box': 15,
      'jiggle-factorial': 10
    }
  },
  weekly: {
    goal: 210,
    current: 150,
    weekStart: 'YYYY-MM-DD'
  }
}
```

### Achievement Schema

```javascript
{
  id: 'achievement-id',
  name: 'Marathon Trainer',
  description: 'Train for 100 hours total',
  category: 'time', // 'time', 'streak', 'performance', 'variety'
  requirement: {
    type: 'totalTime',
    value: 360000 // seconds
  },
  unlocked: false,
  unlockedAt: null,
  progress: 0.45 // 0-1
}
```



## UI Design

### Progress Bars

**Daily Progress Bar (Left Side)**
```
Position: Fixed, left: 10px, top: 50%, transform: translateY(-50%)
Size: 40px wide, 300px tall
Style: Vertical bar with gradient (red → yellow → green)
Display: Percentage on hover, celebration animation on goal completion
```

**Weekly Progress Bar (Right Side)**
```
Position: Fixed, right: 10px, top: 50%, transform: translateY(-50%)
Size: 40px wide, 300px tall
Style: Vertical bar with gradient (red → yellow → green)
Display: Percentage on hover, celebration animation on goal completion
```

### Statistics Modal

Triggered by the existing stats button, enhanced with:
- Overall statistics (total time, sessions, streak)
- Per-game breakdown (pie chart)
- Trend chart (line graph, last 30 days)
- Achievement showcase
- Tier progress indicator
- Export button

### Achievements Modal

New modal showing:
- Grid of achievement cards
- Locked/unlocked states
- Progress bars for locked achievements
- Unlock dates for earned achievements
- Share functionality

### Tier Badge

Small badge showing current tier:
```
Position: Fixed, top: 10px, left: 50%, transform: translateX(-50%)
Size: 100px wide, 40px tall
Style: Badge with tier name and icon
Display: Tooltip with tier progress on hover
```

## Integration with Existing System

### Minimal Changes to Existing Code

The progression system integrates with minimal changes to `unified-core.js`:

```javascript
// In UnifiedBrainTraining constructor:
this.progressionSystem = new UnifiedProgressionSystem();

// In loadGame method (after game loads):
this.progressionSystem.startSession(gameId);

// In cleanupCurrentGame method:
this.progressionSystem.endSession();

// Listen for game metrics:
window.addEventListener('message', (e) => {
  if (e.data.type === 'gameMetrics') {
    this.progressionSystem.updateSessionMetrics(e.data.metrics);
  }
});
```

### Game Integration

Games send metrics via postMessage:

```javascript
// In game code:
window.parent.postMessage({
  type: 'gameMetrics',
  metrics: {
    accuracy: 0.85,
    level: 5,
    score: 1000
  }
}, '*');
```

## IndexedDB Schema

### Database: UnifiedBrainTrainingDB

**Version**: 2 (extends existing if present)

#### Object Stores

**1. profiles**
- keyPath: `id`
- indexes: `name`, `lastActiveAt`

**2. sessions**
- keyPath: `id`
- indexes: `profileId`, `gameId`, `startTime`, `endTime`

**3. progress**
- keyPath: `[profileId+date]`
- indexes: `profileId`, `date`

**4. achievements**
- keyPath: `[profileId+achievementId]`
- indexes: `profileId`, `unlocked`, `unlockedAt`

**5. statistics_cache**
- keyPath: `[profileId+cacheKey]`
- indexes: `profileId`, `timestamp`

## Performance Optimizations

### 1. Debounced Updates
```javascript
// Update progress bars max once per second
const updateProgressBars = debounce(() => {
  this.progressionSystem.updateProgressBars();
}, 1000);
```

### 2. Cached Statistics
```javascript
// Cache expensive calculations for 5 minutes
const getCachedStats = async (cacheKey) => {
  const cached = await db.statistics_cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.data;
  }
  // Calculate and cache
};
```

### 3. Batch Writes
```javascript
// Batch session updates every 30 seconds
const sessionUpdateQueue = [];
setInterval(() => {
  if (sessionUpdateQueue.length > 0) {
    db.sessions.bulkPut(sessionUpdateQueue);
    sessionUpdateQueue.length = 0;
  }
}, 30000);
```

### 4. Virtual Scrolling
```javascript
// For session history with 1000+ items
class VirtualSessionList {
  constructor(sessions) {
    this.sessions = sessions;
    this.visibleRange = { start: 0, end: 20 };
    this.itemHeight = 60;
  }
  
  render() {
    // Only render visible items
  }
}
```

## Achievement Definitions

### Time-Based Achievements
```javascript
const timeAchievements = [
  { id: 'first-hour', name: 'Getting Started', requirement: 3600 },
  { id: 'ten-hours', name: 'Dedicated Trainer', requirement: 36000 },
  { id: 'hundred-hours', name: 'Marathon Trainer', requirement: 360000 },
  { id: 'thousand-hours', name: 'Master Trainer', requirement: 3600000 }
];
```

### Streak-Based Achievements
```javascript
const streakAchievements = [
  { id: 'week-streak', name: '7-Day Streak', requirement: 7 },
  { id: 'month-streak', name: '30-Day Streak', requirement: 30 },
  { id: 'year-streak', name: '365-Day Streak', requirement: 365 }
];
```

### Variety-Based Achievements
```javascript
const varietyAchievements = [
  { id: 'try-all', name: 'Explorer', requirement: 'play all 6 games' },
  { id: 'balanced', name: 'Balanced Trainer', requirement: '10+ hours in each game' }
];
```

### Performance-Based Achievements
```javascript
const performanceAchievements = [
  { id: 'perfect-session', name: 'Perfect Session', requirement: '100% accuracy' },
  { id: 'high-level', name: 'Advanced Player', requirement: 'reach level 10 in any game' }
];
```

## Tier Calculation Algorithm

```javascript
function calculateTier(profile) {
  const totalHours = profile.stats.totalTime / 3600;
  const gamesPlayed = profile.stats.gamesPlayed.length;
  const avgAccuracy = calculateAverageAccuracy(profile);
  const streak = profile.stats.currentStreak;
  
  // Weighted score
  const score = (
    (totalHours * 2) +
    (gamesPlayed * 10) +
    (avgAccuracy * 50) +
    (streak * 1)
  );
  
  // Tier thresholds
  if (score < 50) return 'Beginner';
  if (score < 150) return 'Intermediate';
  if (score < 300) return 'Advanced';
  if (score < 500) return 'Expert';
  return 'Master';
}
```



## Visual Design

### Color Palette

**Progress Indicators**
- 0-33%: `#f44336` (red) - needs work
- 34-66%: `#ff9800` (orange) - making progress
- 67-99%: `#ffc107` (yellow) - almost there
- 100%: `#4caf50` (green) - goal achieved

**Tier Colors**
- Beginner: `#9e9e9e` (gray)
- Intermediate: `#2196f3` (blue)
- Advanced: `#9c27b0` (purple)
- Expert: `#ff9800` (orange)
- Master: `#ffd700` (gold)

**Achievement States**
- Locked: `#424242` (dark gray)
- In Progress: `#2196f3` (blue)
- Unlocked: `#4caf50` (green)

### Animations

**Progress Bar Fill**
```css
.progress-fill {
  transition: height 0.5s ease-out;
}
```

**Goal Celebration**
```css
@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

**Achievement Unlock**
```css
@keyframes unlock {
  0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
  50% { transform: scale(1.1) rotate(5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
```

**Tier Advance**
```css
@keyframes tier-advance {
  0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
  100% { box-shadow: 0 0 0 20px rgba(255, 215, 0, 0); }
}
```

## Responsive Design

### Desktop (≥ 1024px)
- Progress bars: Vertical, 40px wide, 300px tall
- Statistics modal: 800px wide, centered
- Tier badge: Top center, 100px wide

### Tablet (768px - 1023px)
- Progress bars: Vertical, 30px wide, 250px tall
- Statistics modal: 90% width, max 700px
- Tier badge: Top center, 80px wide

### Mobile (< 768px)
- Progress bars: Horizontal, top (daily) and bottom (weekly), 100% wide, 30px tall
- Statistics modal: Full screen
- Tier badge: Top left, 60px wide

## Error Handling

### Storage Quota Exceeded
```javascript
try {
  await db.sessions.add(session);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    // Offer to cleanup old data
    showCleanupDialog();
  }
}
```

### IndexedDB Unavailable
```javascript
if (!window.indexedDB) {
  // Fall back to localStorage with limited features
  console.warn('IndexedDB not available, using localStorage fallback');
  this.useFallbackStorage = true;
}
```

### Data Corruption
```javascript
try {
  const profile = await db.profiles.get(profileId);
  validateProfile(profile);
} catch (error) {
  // Attempt recovery or create new profile
  console.error('Profile data corrupted, attempting recovery');
  await recoverOrCreateProfile(profileId);
}
```

## Testing Strategy

### Unit Tests
- Progress calculation functions
- Tier calculation algorithm
- Achievement checking logic
- Statistics calculations
- Data validation functions

### Integration Tests
- Session lifecycle (start → update → end)
- Progress bar updates
- Achievement unlocking flow
- Data persistence and retrieval
- Export/import functionality

### E2E Tests
- Complete training session with progress tracking
- Goal completion and celebration
- Achievement earning
- Tier advancement
- Statistics viewing
- Data export/import

### Performance Tests
- Progress bar update latency (< 16ms)
- Statistics calculation time (< 500ms for 10k sessions)
- IndexedDB query performance
- Memory usage with large datasets
- UI responsiveness during updates

## Migration Strategy

### From Existing System

Since this is a new feature, migration is straightforward:

1. **Detect existing users**: Check for existing localStorage data
2. **Create default profile**: Generate profile from existing settings
3. **Initialize progress tracking**: Start tracking from migration date
4. **Preserve settings**: Maintain all existing game settings
5. **No data loss**: All existing functionality remains intact

```javascript
async function migrateExistingUser() {
  const hasExistingData = localStorage.getItem('unified-brain-training-jiggle-factorial');
  
  if (hasExistingData && !localStorage.getItem('unified-profile-id')) {
    // Create default profile
    const profile = await progressionSystem.createProfile('Default User');
    
    // Mark as migrated
    localStorage.setItem('unified-profile-id', profile.id);
    localStorage.setItem('unified-migrated', 'true');
    
    console.log('✅ Migrated existing user to progression system');
  }
}
```

## Privacy Considerations

### Local-First Architecture
- All data stored locally in IndexedDB/localStorage
- No server communication
- No external tracking
- No cookies (except essential)

### Data Control
- User can export all data
- User can delete all data
- User can configure retention period
- Clear data deletion UI

### Transparency
- Document what data is collected
- Explain how data is used
- Provide data access tools
- Respect user preferences

## Future Enhancements

### Phase 2 Features
- **Cloud Sync**: Optional cloud backup and multi-device sync
- **Social Features**: Share achievements, compare stats with friends
- **Advanced Analytics**: ML-powered insights and recommendations
- **Custom Goals**: User-defined goals and challenges
- **Leaderboards**: Optional competitive features

### Phase 3 Features
- **Mobile Apps**: Native iOS/Android apps with sync
- **Coaching System**: AI-powered training recommendations
- **Research Mode**: Data export for cognitive research
- **Team Features**: Group training and collaboration

## Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Create `unified-progression.js` with core classes
- [ ] Implement IndexedDB schema and initialization
- [ ] Create profile management system
- [ ] Implement session tracking
- [ ] Add progress calculation logic

### Phase 2: UI Components
- [ ] Create `unified-progress-ui.js` with UI components
- [ ] Implement daily progress bar
- [ ] Implement weekly progress bar
- [ ] Create tier badge component
- [ ] Add celebration animations

### Phase 3: Statistics
- [ ] Create `unified-stats.js` with analytics
- [ ] Implement statistics calculations
- [ ] Create statistics dashboard modal
- [ ] Add trend charts
- [ ] Implement data export

### Phase 4: Achievements
- [ ] Define achievement system
- [ ] Implement achievement checking
- [ ] Create achievements modal
- [ ] Add unlock animations
- [ ] Implement achievement sharing

### Phase 5: Integration
- [ ] Integrate with `unified-core.js`
- [ ] Add game communication protocol
- [ ] Update existing games with metrics
- [ ] Test cross-game functionality
- [ ] Add migration for existing users

### Phase 6: Polish
- [ ] Add responsive design
- [ ] Implement accessibility features
- [ ] Add error handling
- [ ] Optimize performance
- [ ] Write documentation

## Conclusion

The Unified Progression System transforms the existing brain training platform into a comprehensive cognitive training ecosystem with:

1. **Consistent Progress Tracking**: Visual indicators showing daily and weekly progress across all games
2. **Cross-Game Analytics**: Comprehensive statistics revealing training patterns and improvements
3. **Motivation Systems**: Achievements and tier progression to maintain engagement
4. **Data Ownership**: Complete control over training data with export/import capabilities
5. **Performance**: Optimized for smooth operation even with extensive training history

The design maintains the existing system's strengths:
- Local-first architecture (privacy-focused)
- Lightweight implementation (minimal dependencies)
- Reactive settings system (instant updates)
- Easy game integration (simple postMessage protocol)

Key technical decisions:
- **IndexedDB** for efficient local data storage
- **Minimal changes** to existing codebase
- **Progressive enhancement** - works without breaking existing features
- **Performance-first** - debouncing, caching, batch writes
- **Accessibility** - WCAG 2.1 AA compliance

The system is ready for implementation with clear component boundaries, well-defined data models, and comprehensive error handling. The modular design allows incremental development and testing of each feature independently.
