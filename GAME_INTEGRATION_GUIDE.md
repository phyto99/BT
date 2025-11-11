# Game Integration Guide - Cognitive Progression System

## Overview

This guide shows how to integrate games with the Cognitive Progression System to track cognitive performance metrics.

## Quick Start

### 1. Game Start - Send Session Start Event

When your game starts, send a message to notify the system:

```javascript
// At the start of your game
window.parent.postMessage({
    type: 'gameStarted',
    gameId: 'your-game-id', // e.g., '3d-hyper-nback'
    timestamp: Date.now()
}, '*');
```

### 2. Game End - Send Performance Metrics

When your game ends, send the performance data:

```javascript
// At the end of your game session
window.parent.postMessage({
    type: 'sessionMetrics',
    gameId: 'your-game-id',
    metrics: {
        // Core metrics (all games should provide these)
        level: 5,                    // Current difficulty level
        accuracy: 0.85,              // Accuracy as decimal (0-1)
        
        // Signal Detection Theory metrics (for N-back games)
        hits: 17,                    // Correct matches identified
        misses: 3,                   // Matches missed
        falseAlarms: 2,              // Incorrect match responses
        correctRejections: 18,       // Correct non-match responses
        
        // Working Memory metrics
        setSize: 4,                  // Number of items to remember
        
        // Processing Speed metrics
        reactionTimes: [850, 920, 780, ...], // Array of RTs in ms
        
        // Optional: Game-specific metrics
        score: 850,
        duration: 120000             // Session duration in ms
    },
    timestamp: Date.now()
}, '*');
```

## Metric Requirements by Game Type

### N-Back Games (3D Hyper N-Back, Quad Box, etc.)

**Required:**
- `level` - N-back level
- `accuracy` - Overall accuracy
- `hits`, `misses`, `falseAlarms`, `correctRejections` - For d-prime calculation

**Optional:**
- `reactionTimes` - Array of response times
- `perStimulusAccuracy` - Accuracy per stimulus type

### Multiple Object Tracking (Jiggle Factorial)

**Required:**
- `level` - Number of objects tracked
- `accuracy` - Tracking accuracy
- `setSize` - Number of targets

**Optional:**
- `trackingAccuracy` - Per-object accuracy
- `distractorResistance` - Performance with distractors

### Memory Games

**Required:**
- `level` - Span length
- `accuracy` - Recall accuracy
- `setSize` - Sequence length

**Optional:**
- `spanLength` - Maximum span achieved
- `recallAccuracy` - Per-item recall

## Example: Complete Game Integration

```javascript
// Example: 3D Hyper N-Back Integration

class HyperNBackGame {
    constructor() {
        this.gameId = '3d-hyper-nback';
        this.sessionData = {
            hits: 0,
            misses: 0,
            falseAlarms: 0,
            correctRejections: 0,
            reactionTimes: [],
            level: 2
        };
    }
    
    startGame() {
        // Notify system that game started
        window.parent.postMessage({
            type: 'gameStarted',
            gameId: this.gameId,
            timestamp: Date.now()
        }, '*');
        
        // Start your game logic...
    }
    
    onUserResponse(isMatch, userSaidMatch, reactionTime) {
        // Track response
        if (isMatch && userSaidMatch) {
            this.sessionData.hits++;
        } else if (isMatch && !userSaidMatch) {
            this.sessionData.misses++;
        } else if (!isMatch && userSaidMatch) {
            this.sessionData.falseAlarms++;
        } else {
            this.sessionData.correctRejections++;
        }
        
        if (reactionTime) {
            this.sessionData.reactionTimes.push(reactionTime);
        }
    }
    
    endGame() {
        // Calculate accuracy
        const total = this.sessionData.hits + this.sessionData.misses + 
                     this.sessionData.falseAlarms + this.sessionData.correctRejections;
        const correct = this.sessionData.hits + this.sessionData.correctRejections;
        const accuracy = correct / total;
        
        // Send metrics to cognitive system
        window.parent.postMessage({
            type: 'sessionMetrics',
            gameId: this.gameId,
            metrics: {
                level: this.sessionData.level,
                accuracy: accuracy,
                hits: this.sessionData.hits,
                misses: this.sessionData.misses,
                falseAlarms: this.sessionData.falseAlarms,
                correctRejections: this.sessionData.correctRejections,
                reactionTimes: this.sessionData.reactionTimes
            },
            timestamp: Date.now()
        }, '*');
    }
}
```

## Testing Your Integration

1. Open browser console
2. Start your game
3. Look for: `🧠 Cognitive session started: [session-id]`
4. Complete a game session
5. Look for: `🧠 Session metrics processed`
6. Check cognitive scores: `window.unifiedBrainTraining.cognitiveSystem.cognitiveScores`

## Cognitive Domain Mappings

Your game's metrics will automatically be mapped to cognitive domains:

- **3D Hyper N-Back**: Working Memory (90%), Attention (60%), Executive Functions (50%)
- **Jiggle Factorial**: Attention (95%), Perceptual Processing (80%), Working Memory (60%)
- **Dichotic Dual N-Back**: Working Memory (95%), Attention (70%), Executive Functions (40%)

## Troubleshooting

**Session not starting?**
- Check that `gameId` matches exactly (e.g., '3d-hyper-nback', not '3D Hyper N-Back')
- Verify message is sent to `window.parent`

**Metrics not recording?**
- Ensure all required fields are present
- Check that values are in correct format (accuracy as 0-1, not 0-100)
- Verify `sessionMetrics` type is spelled correctly

**Scores not updating?**
- Check browser console for errors
- Verify IndexedDB is working (not in private mode)
- Check that game is in GAME_MAPPINGS in cognitive-progression.js

## Next Steps

1. Add session start message to your game's initialization
2. Track performance metrics during gameplay
3. Send metrics when game ends
4. Test with browser console
5. View results in Statistics popup

For questions or issues, check the browser console for detailed logging.
