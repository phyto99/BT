## Micro-Level Algorithm Summary

The micro-level system provides fine-grained progression tracking (e.g., 2.45 instead of just level 2).

**Core Components:**

1. **Format**: Levels range from 1.00 to 9.99 (two decimal places)
   - Integer part = traditional N-back level
   - Decimal part = progress toward next level (0-99%)

2. **Advancement Criteria**:
   - **Primary factor**: d'prime score (signal detection sensitivity)
   - **Secondary factors**: Response bias and lure resistance
   - **Personal baseline**: Compares against your last 20 sessions

3. **Progression Rules**:
   - **Advance** (+0.01 to +0.05): When d'prime exceeds baseline AND bias is low
   - **Stay same**: When performance meets baseline
   - **Regress** (-0.05): When d'prime < 70% of baseline

4. **Lure Integration**:
   - Lure frequency scales with micro-progress: 10% at .00 → 25% at .99
   - Creates "interference" that must be resisted
   - N-1 lures (80%) and N+1 lures (20%)

5. **Level Transitions**:
   - Only changes integer level when crossing boundaries (e.g., 2.99 → 3.01)
   - Micro-progress provides smoother difficulty scaling
   - More precise skill tracking than integer-only levels

**Key Innovation**: The system adapts difficulty continuously based on signal detection theory rather than simple accuracy, making progression more nuanced and personalized.

---

## Technical Improvements & Implementation Details

### 1. Stimulus History Buffer System

**Problem Solved**: Original implementation generated completely new stimulus sequences each round, making the first N trials of every round impossible to score (no valid N-back history).

**Solution**: Implemented a 50-stimulus rolling buffer per modality that maintains cross-session continuity.

**Technical Implementation**:
```javascript
// Global history buffer (50 stimuli per modality)
let stimulusHistory = {
  walls: [], cameras: [], faces: [], positions: [],
  words: [], shapes: [], corners: [], sounds: [],
  colors: [], rotations: [], currentN: 2
};

// Block generation with history awareness
function createBlocksWithFixedDensity(symbols, n, matchDensity, modalityHistory) {
  // First N positions can reference history for valid matches
  if (historyAvailable) {
    for (let i = 0; i < n; i++) {
      const historyIndex = modalityHistory.length - n + i;
      // 25% chance to create history-based match
      if (Math.random() < matchDensity) {
        blocks[i] = {
          isMatching: true,
          symbol: historicalSymbol,
          referencesHistory: true,
          canScore: true
        };
      }
    }
  }
}
```

**Impact**:
- ✅ Eliminates 7.5% wasted trials (first N per round)
- ✅ Enables valid matches from round start
- ✅ Accurate d-prime calculations (no artificial inflation)
- ✅ Seamless cognitive challenge across rounds
- ✅ Valid lure placement at session boundaries

### 2. Scorable Trial Tracking

**Problem Solved**: Trials without valid N-back history (first N of first round) were incorrectly counted in d-prime calculations, inflating performance metrics.

**Solution**: Added `canScore` flag to mark trials that can be validly scored.

**Technical Implementation**:
```javascript
// Mark unscorable trials
if (i < n && !historyAvailable) {
  canScore = false;
}

blocks[i] = {
  isMatching: createsMatch,
  symbol: symbol,
  canScore: canScore  // Only score if valid history exists
};

// In scoring logic
if (canScore) {
  if (curr.isMatching) {
    sessionMetrics.hits++;
  } else {
    sessionMetrics.falseAlarms++;
  }
}
```

**Impact**:
- ✅ Accurate signal detection metrics
- ✅ No artificial performance boost
- ✅ Valid d-prime calculations
- ✅ Fair progression system

### 3. Continuous Mode with Seamless Transitions

**Problem Solved**: Original showed modal dialogs between rounds, breaking flow and requiring manual restart.

**Solution**: Implemented continuous gameplay with live sidebar statistics.

**Technical Implementation**:
```javascript
// At round end, automatically continue
updateContinuousStatsSidebar();
resetIntervals();
const newSpeed = getSpeedTarget(newMicroLevel);

// Save history before starting new round
saveToHistory(walls, stimulusHistory.walls, n);

// Start next round immediately
const nextGameCycle = getGameCycle(Math.floor(newMicroLevel));
nextGameCycle(); // Immediate first stimulus
intervals.push(setInterval(nextGameCycle, newSpeed));
```

**Impact**:
- ✅ Uninterrupted training sessions
- ✅ Real-time performance feedback
- ✅ Automatic difficulty adjustment
- ✅ Better flow state maintenance

### 4. Phase-Based Difficulty Scaling

**Problem Solved**: Linear progression didn't provide enough granularity within integer levels.

**Solution**: Three phases per level with distinct difficulty parameters.

**Technical Implementation**:
```javascript
const { nLevel, microProgress } = getMicroLevelComponents(currentMicroLevel);

// Phase 1 (.00-.33): 2 target matches, 5-40% lures
// Phase 2 (.34-.66): 3 target matches, 5-40% lures  
// Phase 3 (.67-.99): 4 target matches, 5-40% lures

if (microProgress < 0.34) {
  targetNumOfStimuli = 2;
} else if (microProgress < 0.67) {
  targetNumOfStimuli = 3;
} else {
  targetNumOfStimuli = 4;
}

// Lure frequency scales within phase
const phaseProgress = calculatePhaseProgress(microProgress);
const lureFrequency = baseLureFreq + (phaseProgress * (maxLureFreq - baseLureFreq));
```

**Impact**:
- ✅ Smoother difficulty curve
- ✅ More granular progression
- ✅ Better skill assessment
- ✅ Reduced frustration from sudden jumps

### 5. Personal Baseline Adaptation

**Problem Solved**: Fixed thresholds don't account for individual differences in cognitive ability.

**Solution**: Dynamic baseline calculated from last 20 sessions per configuration.

**Technical Implementation**:
```javascript
function calculateBaseline(sessionHistory) {
  const dPrimes = sessionHistory.map(s => s.dPrime);
  const avgDPrime = dPrimes.reduce((a, b) => a + b) / dPrimes.length;
  const stdDPrime = calculateStdDev(dPrimes);
  
  return {
    avgDPrime: avgDPrime,
    stdDPrime: stdDPrime,
    n1LureResistance: avgLureResistance
  };
}

// Compare current performance to personal baseline
const dPrimeThreshold = Math.max(0.5, baseline.avgDPrime);
if (dPrime >= dPrimeThreshold * 1.5) {
  // Excellent performance - advance faster
  advance += 0.05;
}
```

**Impact**:
- ✅ Personalized difficulty
- ✅ Fair for all skill levels
- ✅ Prevents ceiling/floor effects
- ✅ Maintains optimal challenge

### 6. Signal Detection Theory Integration

**Problem Solved**: Simple accuracy conflates detection ability with response bias.

**Solution**: Full d-prime (d') and criterion (c) calculation using signal detection theory.

**Technical Implementation**:
```javascript
function calculateDPrime(hits, misses, falseAlarms, correctRejections) {
  // Log-linear correction for small samples
  const hitRate = (hits + 0.5) / (hits + misses + 1);
  const faRate = (falseAlarms + 0.5) / (falseAlarms + correctRejections + 1);
  
  // Z-score conversion
  const zHit = gaussianInverse(hitRate);
  const zFA = gaussianInverse(faRate);
  
  // d' = sensitivity (ability to detect signals)
  const dPrime = zHit - zFA;
  
  // c = criterion (response bias)
  const c = -0.5 * (zHit + zFA);
  
  return { dPrime, bias: c };
}
```

**Impact**:
- ✅ Separates sensitivity from bias
- ✅ More accurate cognitive assessment
- ✅ Prevents gaming the system
- ✅ Research-grade metrics

### 7. Lure-Based Interference Control

**Problem Solved**: Standard N-back doesn't measure interference resistance.

**Solution**: N-1 and N+1 lures that test proactive/retroactive interference.

**Technical Implementation**:
```javascript
function placeLures(blocks, n, lureFrequency) {
  // 80% N-1 lures (previous position)
  // 20% N+1 lures (next position)
  
  const n1LureFreq = lureFrequency * 0.80;
  const nPlusLureFreq = lureFrequency * 0.20;
  
  // Place N-1 lure: matches position i-1, not i-n
  blocks[i] = {
    isMatching: false,
    isLure: true,
    lureType: 'n-1',
    symbol: blocks[i-1].symbol
  };
}

// Track lure resistance
const lureResistance = correctRejections / totalLures;
```

**Impact**:
- ✅ Measures interference control
- ✅ More comprehensive assessment
- ✅ Identifies specific weaknesses
- ✅ Better training effectiveness

---

## References

- **d-prime (Signal Detection Theory)**: https://pmc.ncbi.nlm.nih.gov/articles/PMC4597481/
- **Working Memory Training**: Jaeggi et al. (2008) - Improving fluid intelligence with training on working memory
- **N-back Task**: Kirchner (1958) - Age differences in short-term retention of rapidly changing information
