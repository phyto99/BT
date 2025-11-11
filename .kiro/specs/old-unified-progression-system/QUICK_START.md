# Unified Progression System - Quick Start Guide

## For Developers

### Overview
The Unified Progression System adds cross-game progress tracking, statistics, achievements, and tier-based progression to the existing brain training platform.

## Architecture at a Glance

```
Existing System          New System
├── unified-core.js      ├── unified-progression.js (NEW)
├── unified-styles.css   ├── unified-progress-ui.js (NEW)
└── index.html           ├── unified-stats.js (NEW)
                         └── unified-db.js (NEW)
```

## Quick Integration

### 1. Add to index.html

```html
<!-- After existing unified-core.js -->
<script src="shared/unified-db.js"></script>
<script src="shared/unified-progression.js"></script>
<script src="shared/unified-progress-ui.js"></script>
<script src="shared/unified-stats.js"></script>
```

### 2. Initialize in unified-core.js

```javascript
// In UnifiedBrainTraining constructor:
constructor() {
  // ... existing code ...
  this.progressionSystem = new UnifiedProgressionSystem();
}

// In loadGame method (after game loads):
async loadGame(gameId) {
  // ... existing code ...
  this.progressionSystem.startSession(gameId);
}

// In cleanupCurrentGame method:
cleanupCurrentGame() {
  this.progressionSystem.endSession();
  // ... existing code ...
}
```

### 3. Add Game Metrics (Optional but Recommended)

In your game's HTML, add:

```javascript
// Send metrics to unified system
function sendMetrics() {
  window.parent.postMessage({
    type: 'gameMetrics',
    metrics: {
      accuracy: 0.85,
      level: 5,
      score: 1000
    }
  }, '*');
}

// Call after each round/trial
sendMetrics();
```

## Key Features

### Progress Bars
- **Daily**: Left side (desktop) or top (mobile)
- **Weekly**: Right side (desktop) or bottom (mobile)
- **Auto-updates**: Real-time progress tracking
- **Celebrations**: Animations on goal completion

### Statistics
- **Overall stats**: Total time, sessions, streak
- **Per-game stats**: Time and performance per game
- **Trends**: Line graphs showing improvement
- **Export**: JSON/CSV data export

### Achievements
- **Time-based**: "Train for 100 hours"
- **Streak-based**: "30-day streak"
- **Variety-based**: "Play all 6 games"
- **Performance-based**: "Reach level 10"

### Tiers
- **5 levels**: Beginner → Intermediate → Advanced → Expert → Master
- **Auto-calculated**: Based on time, variety, performance, streak
- **Visual badge**: Shows current tier
- **Progress tracking**: See advancement toward next tier

## Data Models

### Profile
```javascript
{
  id: 'uuid',
  name: 'User Name',
  settings: {
    dailyGoal: 30,      // minutes
    weeklyGoal: 210,    // minutes
    retentionDays: 90
  },
  stats: {
    totalTime: 0,       // seconds
    totalSessions: 0,
    currentStreak: 0,
    currentTier: 'Beginner'
  }
}
```

### Session
```javascript
{
  id: 'uuid',
  profileId: 'uuid',
  gameId: 'quad-box',
  startTime: timestamp,
  endTime: timestamp,
  duration: seconds,
  metrics: {
    accuracy: 0.85,
    level: 5,
    score: 1000
  }
}
```

### Progress
```javascript
{
  date: 'YYYY-MM-DD',
  profileId: 'uuid',
  daily: {
    goal: 30,
    current: 25,
    games: {
      'quad-box': 15,
      'jiggle-factorial': 10
    }
  },
  weekly: {
    goal: 210,
    current: 150
  }
}
```

## API Reference

### UnifiedProgressionSystem

```javascript
// Initialize
const progression = new UnifiedProgressionSystem();
await progression.init();

// Profile Management
await progression.createProfile('User Name');
await progression.loadProfile(profileId);
await progression.switchProfile(profileId);

// Session Management
progression.startSession('quad-box');
progression.updateSessionMetrics({ accuracy: 0.85 });
progression.endSession();

// Progress Tracking
const daily = await progression.getDailyProgress();
const weekly = await progression.getWeeklyProgress();

// Statistics
const stats = await progression.calculateOverallStats();
const gameStats = await progression.calculateGameStats('quad-box');
const trends = await progression.calculateTrends('week');

// Achievements
const achievements = await progression.getAchievements();
await progression.checkAchievements();

// Tier System
const tier = await progression.calculateTier();
const progress = await progression.getTierProgress();

// Data Management
const json = await progression.exportData('json');
const csv = await progression.exportData('csv');
await progression.importData(data);
await progression.cleanupOldData(90);
```

### ProgressBar

```javascript
// Create progress bar
const dailyBar = new ProgressBar({
  position: 'left',
  type: 'daily',
  goal: 30
});

// Update progress
dailyBar.update(25, 30);

// Show celebration
dailyBar.celebrate();
```

### StatisticsDashboard

```javascript
// Create dashboard
const dashboard = new StatisticsDashboard(progressionSystem);

// Render in modal
dashboard.render();

// Export stats
const csv = dashboard.exportStats('csv');
```

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Performance Considerations

### Debouncing
```javascript
// Progress bars update max once per second
const updateProgressBars = debounce(() => {
  progressionSystem.updateProgressBars();
}, 1000);
```

### Caching
```javascript
// Statistics cached for 5 minutes
const getCachedStats = async (key) => {
  const cached = await db.statistics_cache.get(key);
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.data;
  }
  // Calculate and cache
};
```

### Batch Writes
```javascript
// Session updates batched every 30 seconds
const sessionUpdateQueue = [];
setInterval(() => {
  if (sessionUpdateQueue.length > 0) {
    db.sessions.bulkPut(sessionUpdateQueue);
    sessionUpdateQueue.length = 0;
  }
}, 30000);
```

## Troubleshooting

### Progress bars not showing
- Check if `unified-progress-ui.js` is loaded
- Verify initialization in console
- Check CSS for positioning conflicts

### Statistics not calculating
- Verify IndexedDB is available
- Check for data in `sessions` object store
- Look for errors in console

### Achievements not unlocking
- Verify achievement definitions loaded
- Check achievement checking logic
- Ensure session data is persisting

### Performance issues
- Check IndexedDB query performance
- Verify caching is working
- Look for memory leaks in console

## Best Practices

### 1. Always End Sessions
```javascript
// Good
window.addEventListener('beforeunload', () => {
  progressionSystem.endSession();
});

// Bad - sessions left open
// (no cleanup)
```

### 2. Send Meaningful Metrics
```javascript
// Good
sendMetrics({
  accuracy: calculateAccuracy(),
  level: currentLevel,
  score: totalScore
});

// Bad - empty metrics
sendMetrics({});
```

### 3. Handle Errors Gracefully
```javascript
// Good
try {
  await progressionSystem.startSession(gameId);
} catch (error) {
  console.error('Failed to start session:', error);
  // Continue without progression tracking
}

// Bad - unhandled errors
await progressionSystem.startSession(gameId);
```

### 4. Respect User Privacy
```javascript
// Good - local storage only
await progressionSystem.exportData('json');

// Bad - sending to external server
fetch('https://external.com/stats', { method: 'POST', body: stats });
```

## Common Patterns

### Adding a New Game

1. **Add game files** to `games/your-game/`
2. **Add settings** to `getGameSpecificSettings()` in unified-core.js
3. **Add GUI builder** to `buildGameSpecificGUI()` in unified-core.js
4. **Add metrics** to your game's code
5. **Test integration** with progression system

### Creating Custom Achievements

```javascript
// Define achievement
const customAchievement = {
  id: 'speed-demon',
  name: 'Speed Demon',
  description: 'Complete 100 sessions in under 5 minutes each',
  category: 'performance',
  requirement: {
    type: 'custom',
    check: (profile, sessions) => {
      const fastSessions = sessions.filter(s => s.duration < 300);
      return fastSessions.length >= 100;
    }
  }
};

// Register achievement
progressionSystem.achievements.set(customAchievement.id, customAchievement);
```

### Custom Statistics

```javascript
// Add custom stat calculation
class CustomStatistics extends StatisticsCalculator {
  calculateCustomStat(sessions) {
    // Your calculation logic
    return customValue;
  }
}

// Use custom calculator
const customStats = new CustomStatistics();
const result = customStats.calculateCustomStat(sessions);
```

## Resources

### Documentation
- [Requirements](./requirements.md) - Detailed requirements
- [Design](./design.md) - Architecture and design decisions
- [Tasks](./tasks.md) - Implementation task list
- [Adaptation Notes](./ADAPTATION_NOTES.md) - How Syllogimous features were adapted

### Examples
- See existing games for integration examples
- Check `unified-core.js` for patterns
- Review test files for usage examples

### Support
- GitHub Issues: Report bugs and request features
- Code Comments: Inline documentation in source files
- Console Logging: Debug output with `[PROGRESSION]` prefix

## Next Steps

1. **Read the design document** to understand architecture
2. **Review the task list** to see implementation plan
3. **Check adaptation notes** to understand feature origins
4. **Start with Phase 1** (Core Infrastructure)
5. **Test thoroughly** at each phase
6. **Iterate based on feedback**

## Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Deploy
npm run deploy
```

## Contact

- **Repository**: https://github.com/phyto99/BT
- **Issues**: https://github.com/phyto99/BT/issues
- **Maintainer**: phyto99

---

**Happy coding! 🧠✨**
