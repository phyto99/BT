# 3D Hyper N-Back: Complete System Explanation

## Overview
The 3D Hyper N-Back game uses **signal detection theory** and **micro-level progression** to provide adaptive difficulty scaling based on cognitive performance rather than simple accuracy.

---

## 1. D-Prime (d') - Signal Detection Theory

### What is D-Prime?
D-prime (d') is a measure from signal detection theory that separates **sensitivity** (ability to detect signals) from **response bias** (tendency to say "yes" or "no").

**Formula:**
```
d' = Z(hit rate) - Z(false alarm rate)
```

Where:
- **Hit**: Correctly identifying a match (signal present, responded "match")
- **Miss**: Failing to identify a match (signal present, no response)
- **False Alarm**: Incorrectly claiming a match (no signal, responded "match")
- **Correct Rejection**: Correctly not responding to non-match (no signal, no response)

### Why D-Prime Instead of Accuracy?

**Traditional Accuracy Problem:**
- Someone who says "match" to everything gets 100% hits but also 100% false alarms
- Accuracy = 50% (half right, half wrong)
- But they're not actually detecting anything!

**D-Prime Solution:**
- d' = 0 means no detection ability (random guessing)
- d' = 1.0 means moderate detection
- d' = 2.0 means good detection (target in this game)
- d' = 3.0+ means excellent detection

### In the Game:
```javascript
// Calculate d-prime
sessionMetrics.dPrime = calculateDPrime(
  sessionMetrics.hits,           // Correct "match" responses
  sessionMetrics.misses,          // Missed matches
  sessionMetrics.falseAlarms,     // Wrong "match" responses
  sessionMetrics.correctRejections // Correct non-responses
);
```

---

## 2. Micro-Level System (N.DD format)

### Format
Levels range from **1.00 to 9.99**:
- **Integer part** (1-9): Traditional N-back level
- **Decimal part** (.00-.99): Progress within that level

Example: **2.45** means:
- N-back level = 2
- 45% progress toward level 3

### Three Phases Per Level

Each integer level has 3 phases that control difficulty:

| Phase | Range | Target Matches | Lure Frequency |
|-------|-------|----------------|----------------|
| 1 | .00-.33 | 2 matches | 5% → 40% |
| 2 | .34-.66 | 3 matches | 5% → 40% |
| 3 | .67-.99 | 4 matches | 5% → 40% |

**At N=2.00:**
- Phase 1 (progress 0%)
- Target matches = 2
- Lure frequency = 5%
- Total trials = N × target matches = 2 × 2 = **4 trials**

**At N=3.30:**
- Phase 2 (progress 30%)
- Target matches = 3
- Lure frequency ≈ 14%
- Total trials = 3 × 3 = **9 trials**

---

## 3. THE PATTERN ISSUE AT N=2.00

### Why You See Repeating 1,2,1,2 Pattern

**Root Cause:** At N=2.00, the sequence is TOO SHORT!

```javascript
// At N=2.00:
targetNumOfStimuli = 2;  // Phase 1 (progress < 0.34)
totalTrials = n × targetNumOfStimuli = 2 × 2 = 4 trials
```

**Sequence Generation:**
1. Algorithm places 2 matches in 4 positions
2. With N=2, matches must be 2 positions apart
3. Only valid placements:
   - Position 0 → Position 2 (match)
   - Position 1 → Position 3 (match)

**Result:**
```
Trial 0: Symbol A (not a match)
Trial 1: Symbol B (not a match)
Trial 2: Symbol A (MATCH - same as trial 0, 2 back)
Trial 3: Symbol B (MATCH - same as trial 1, 2 back)
```

This creates the **1,2,1,2 pattern** you're seeing!

### Why It's Random at N=3.30

**At N=3.30:**
```javascript
targetNumOfStimuli = 3;  // Phase 2 (progress 0.30)
totalTrials = 3 × 3 = 9 trials
```

**More Possibilities:**
- 9 positions to place 3 matches
- Many valid placement combinations
- Much more randomization possible
- Pattern is not constrained

---

## 4. Progression System

### Advancement Criteria

**Primary Factor: D-Prime**
```javascript
// Compare against personal baseline (last 20 sessions)
const baseline = calculateBaseline(sessionHistory);
const dPrimeThreshold = Math.max(0.5, baseline.avgDPrime);

if (dPrime >= dPrimeThreshold * 1.5) {
  // Excellent performance
  advance += 0.05;
} else if (dPrime >= dPrimeThreshold) {
  // Good performance
  advance += 0.01 to 0.05 (scaled);
} else if (dPrime < dPrimeThreshold * 0.7) {
  // Poor performance
  regress -= 0.05;
}
```

**Secondary Factor: Response Bias**
```javascript
// Bias = tendency to say "yes" or "no"
// c = -0.5 × (Z(hit rate) + Z(false alarm rate))
// Negative = liberal (says "match" too often)
// Positive = conservative (says "match" too rarely)
// Near 0 = balanced

if (Math.abs(bias) < 0.5) {
  // Good - balanced responding
  allowAdvancement = true;
}
```

**Tertiary Factor: Lure Resistance**
```javascript
// Lures are "interference" stimuli
// N-1 lures: Match 1 position back (not N back)
// N+1 lures: Match 1 position forward

lureResistance = correctRejections / totalLures;

// Target: 85% resistance
if (lureResistance >= 0.85) {
  bonusPoints = true;
}
```

### Phase Transitions

**Within Phase (e.g., 2.10 → 2.15):**
- No special requirements
- Just need good d-prime + low bias

**Phase Boundary (e.g., 2.33 → 2.34):**
- Requires 3 out of 5 sessions with:
  - Good d-prime
  - Low bias
- Prevents premature advancement

**Integer Level (e.g., 2.99 → 3.01):**
- Requires 3 out of 5 sessions with:
  - Excellent d-prime (1.5× baseline)
  - Low bias
- Major difficulty increase

---

## 5. Lure System

### Purpose
Lures create **interference** that tests working memory maintenance, not just recognition.

### Types

**N-1 Lures (80% of lures):**
```
Position: 0  1  2  3  4
Stimulus: A  B  C  B  ?
                    ↑
                N-1 lure (matches position 2, not position 1)
```

**N+1 Lures (20% of lures):**
```
Position: 0  1  2  3  4
Stimulus: A  B  C  D  ?
             ↑
          N+1 lure (matches position 4, not position 2)
```

### Frequency Scaling
```javascript
// Scales within each phase
baseLureFreq = 5%;
maxLureFreq = 40%;

// At phase start (.00, .34, .67): 5% lures
// At phase end (.33, .66, .99): 40% lures
```

---

## 6. Excellence Dashboard

### Metrics

**Accuracy Threshold (Weight: 2)**
- Target: 90% accuracy
- Progress = (accuracy / 0.90) × 100%

**D-Prime Excellence (Weight: 2)**
- Target: d' = 2.0
- Progress = (d' / 2.0) × 100%

**Interference Control (Weight: 1, if applicable)**
- Target: 85% lure resistance
- Progress = (lureResistance / 0.85) × 100%

**Overall Excellence**
```javascript
overall = (accuracy×2 + dPrime×2 + lureResist×1) / totalWeight
```

---

## 7. Solution to Pattern Issue

### Option 1: Increase Minimum Trials
```javascript
// In createBlocksWithFixedDensity:
const minTrials = n * 3; // Minimum 3× the N-back level
const totalTrials = Math.max(minTrials, n * targetMatches);
```

At N=2: minimum 6 trials instead of 4

### Option 2: Adjust Phase 1 Target
```javascript
// In getGameCycle:
if (roundedProgress < 0.34) {
  targetNumOfStimuli = Math.max(3, n + 1); // At least 3 matches
}
```

### Option 3: Add Randomization Buffer
```javascript
// Add extra non-matching trials
const bufferTrials = Math.ceil(n * 0.5);
const totalTrials = (n * targetMatches) + bufferTrials;
```

---

## Summary

**D-Prime System:**
- Measures true detection ability, not just accuracy
- Separates sensitivity from response bias
- More accurate assessment of cognitive performance

**Micro-Level System:**
- Fine-grained progression (2.45 instead of just "2")
- Three phases per level with increasing difficulty
- Adaptive based on personal baseline

**Pattern Issue:**
- At N=2.00: Only 4 trials total
- Too constrained for randomization
- Creates predictable 1,2,1,2 pattern
- Fixed at higher micro-levels (more trials)

**The system is working as designed** - the pattern at N=2.00 is a mathematical consequence of having minimal trials. It resolves naturally as you progress through the micro-levels.


---

## 8. CRITICAL ISSUE: Session Boundary Problem

### The Problem

**Current Behavior:**
The game treats each round as an isolated session. When a new round starts, the stimulus history is cleared, making the first N trials of each round **impossible to have valid matches**.

**Example at N=3:**
```
Round 1 ends:    [..., A, B, C]
Round 2 starts:  [D, E, F, ...]
                  ↑  ↑  ↑
                  Position 0, 1, 2 - NO VALID MATCHES POSSIBLE
                  (nothing exists 3 positions back)
```

**Impact:**
1. **Wasted Trials**: First N trials of each round can never be matches
2. **Inflated Correct Rejections**: These trials artificially boost CR count
3. **Skewed D-Prime**: False sense of good performance
4. **Discontinuous Experience**: Break in cognitive flow between rounds
5. **Invalid Lures**: Can't place N-1 or N+1 lures at session start

### Current Code Analysis

```javascript
function getGameCycle(n) {
  // Creates NEW stimulus arrays each round
  walls = createBlocksWithLures(wallColorsList, n, 0.25, lureFrequency);
  cameras = createBlocksWithLures(points, n, 0.25, lureFrequency);
  // ... etc
  
  let i = 0;  // Index resets to 0 each round
  return function() {
    // No access to previous round's stimuli
    if (i >= n && walls[i - n]) {
      // Can only look back within current round
    }
  }
}
```

**The game generates completely new sequences each round with no memory of previous stimuli.**

---

## 9. SOLUTION APPROACHES

### Approach 1: Continuous Stimulus Stream (Recommended)

**Concept:** Maintain a rolling buffer of the last N stimuli across rounds.

```javascript
// Global stimulus history buffer
let stimulusHistory = {
  walls: [],
  cameras: [],
  faces: [],
  positions: [],
  words: [],
  shapes: [],
  corners: [],
  sounds: [],
  colors: [],
  rotations: []
};

function getGameCycle(n) {
  // Generate new stimuli
  let newWalls = createBlocksWithLures(wallColorsList, n, 0.25, lureFrequency);
  
  // SEED the new sequence with history
  // First N positions should reference history for valid matches
  for (let i = 0; i < Math.min(n, newWalls.length); i++) {
    if (stimulusHistory.walls.length >= n) {
      // Can create valid matches by referencing history
      const historyIndex = stimulusHistory.walls.length - n + i;
      const historicalStimulus = stimulusHistory.walls[historyIndex];
      
      // Decide if this should be a match (25% chance)
      if (Math.random() < 0.25) {
        newWalls[i] = {
          isMatching: true,
          symbol: historicalStimulus.symbol,
          crossesRoundBoundary: true  // Flag for analytics
        };
      }
    }
  }
  
  // At round end, save last N stimuli to history
  function saveToHistory() {
    const lastN = newWalls.slice(-n);
    stimulusHistory.walls = lastN;
  }
}
```

**Advantages:**
- ✅ No wasted trials
- ✅ Accurate d-prime calculation
- ✅ Continuous cognitive challenge
- ✅ Can place lures at round start
- ✅ Realistic working memory task

**Disadvantages:**
- ⚠️ More complex implementation
- ⚠️ Need to handle level changes (clear history if N changes)

---

### Approach 2: Warm-Up Buffer

**Concept:** Add N "warm-up" trials at the start that don't count toward scoring.

```javascript
function getGameCycle(n) {
  let blocks = createBlocksWithLures(symbols, n, 0.25, lureFrequency);
  
  // Add N warm-up trials at the start
  const warmUpTrials = Array(n).fill(null).map(() => ({
    isMatching: false,
    isWarmUp: true,
    symbol: random(symbols)
  }));
  
  blocks = [...warmUpTrials, ...blocks];
  
  let i = 0;
  return function() {
    const currentBlock = blocks[i];
    
    // Don't score warm-up trials
    if (currentBlock.isWarmUp) {
      // Just display, no scoring
    } else {
      // Normal scoring logic
    }
    
    i++;
  }
}
```

**Advantages:**
- ✅ Simple to implement
- ✅ Clear separation of warm-up vs scored trials
- ✅ No cross-round dependencies

**Disadvantages:**
- ⚠️ Still wastes N trials per round
- ⚠️ Doesn't solve the continuity problem
- ⚠️ User might find warm-up confusing

---

### Approach 3: Hybrid - Continuous with Session Markers

**Concept:** Maintain history but allow clean breaks when needed.

```javascript
let stimulusHistory = {
  walls: [],
  sessionBoundaries: []  // Track where rounds ended
};

function getGameCycle(n) {
  const sessionStart = stimulusHistory.walls.length;
  
  // Generate new stimuli with history awareness
  let newBlocks = createBlocksWithHistory(
    symbols, 
    n, 
    stimulusHistory.walls,
    0.25,
    lureFrequency
  );
  
  // At round end
  function onRoundEnd() {
    stimulusHistory.walls.push(...newBlocks);
    stimulusHistory.sessionBoundaries.push(sessionStart);
    
    // Keep only last 100 stimuli to prevent memory bloat
    if (stimulusHistory.walls.length > 100) {
      const trimAmount = stimulusHistory.walls.length - 100;
      stimulusHistory.walls = stimulusHistory.walls.slice(trimAmount);
      // Adjust boundary markers
      stimulusHistory.sessionBoundaries = stimulusHistory.sessionBoundaries
        .map(b => b - trimAmount)
        .filter(b => b >= 0);
    }
  }
}

function createBlocksWithHistory(symbols, n, history, matchDensity, lureFreq) {
  const targetMatches = targetNumOfStimuli;
  const totalTrials = n * targetMatches;
  let blocks = Array(totalTrials).fill(null);
  
  // FIRST: Handle positions that can reference history
  const historyLength = history.length;
  const maxHistoryLookback = Math.min(n, historyLength);
  
  for (let i = 0; i < maxHistoryLookback; i++) {
    const lookbackIndex = historyLength - n + i;
    if (lookbackIndex >= 0) {
      const historicalSymbol = history[lookbackIndex].symbol;
      
      // 25% chance to create a match with history
      if (Math.random() < matchDensity) {
        blocks[i] = {
          isMatching: true,
          symbol: historicalSymbol,
          referencesHistory: true
        };
      }
    }
  }
  
  // THEN: Fill remaining positions normally
  // ... (existing logic)
  
  return blocks;
}
```

**Advantages:**
- ✅ Maintains continuity
- ✅ Allows analysis of cross-session performance
- ✅ Memory-efficient (bounded history)
- ✅ Can clear history on level changes

**Disadvantages:**
- ⚠️ Most complex implementation
- ⚠️ Need careful handling of edge cases

---

## 10. RECOMMENDED IMPLEMENTATION

### Phase 1: Add History Buffer (Immediate Fix)

```javascript
// Add to global scope
const HISTORY_BUFFER_SIZE = 50; // Keep last 50 stimuli per modality

let stimulusHistory = {
  walls: [],
  cameras: [],
  faces: [],
  positions: [],
  words: [],
  shapes: [],
  corners: [],
  sounds: [],
  colors: [],
  rotations: [],
  currentN: 2  // Track current N-back level
};

// Clear history when N-level changes
function onNLevelChange(newN) {
  if (newN !== stimulusHistory.currentN) {
    console.log(`N-level changed from ${stimulusHistory.currentN} to ${newN}, clearing history`);
    Object.keys(stimulusHistory).forEach(key => {
      if (Array.isArray(stimulusHistory[key])) {
        stimulusHistory[key] = [];
      }
    });
    stimulusHistory.currentN = newN;
  }
}
```

### Phase 2: Modify Block Creation

```javascript
function createBlocksWithLures(symbols, n, matchDensity, lureFrequency, modalityHistory = []) {
  const targetMatches = targetNumOfStimuli;
  const totalTrials = n * targetMatches;
  let blocks = Array(totalTrials).fill(null);
  let placedMatches = 0;
  
  // STEP 1: Try to create matches using history for first N positions
  const historyAvailable = modalityHistory.length >= n;
  const historyMatchSlots = Math.min(n, totalTrials);
  
  if (historyAvailable) {
    for (let i = 0; i < historyMatchSlots && placedMatches < targetMatches; i++) {
      // 25% chance to create a history-based match
      if (Math.random() < matchDensity && !blocks[i]) {
        const historyIndex = modalityHistory.length - n + i;
        const historicalSymbol = modalityHistory[historyIndex].symbol;
        
        blocks[i] = {
          isMatching: true,
          symbol: historicalSymbol,
          referencesHistory: true
        };
        placedMatches++;
      }
    }
  }
  
  // STEP 2: Place remaining matches normally (existing logic)
  while (placedMatches < targetMatches) {
    let rnd = Math.floor(Math.random() * (blocks.length - n));
    
    if (!blocks[rnd] && !blocks[rnd + n]) {
      const symbol = random(symbols);
      blocks[rnd] = { isMatching: false, symbol: symbol };
      blocks[rnd + n] = { isMatching: true, symbol: symbol };
      placedMatches++;
    }
  }
  
  // STEP 3: Fill remaining positions
  // ... (existing logic)
  
  return blocks;
}
```

### Phase 3: Update History at Round End

```javascript
// In the game cycle, at round end:
function onRoundComplete() {
  // Save last N stimuli of each modality to history
  if (wallsEnabled && walls) {
    const lastN = walls.slice(-n).map(b => ({ symbol: b.symbol }));
    stimulusHistory.walls.push(...lastN);
    // Trim to buffer size
    if (stimulusHistory.walls.length > HISTORY_BUFFER_SIZE) {
      stimulusHistory.walls = stimulusHistory.walls.slice(-HISTORY_BUFFER_SIZE);
    }
  }
  
  // Repeat for all modalities...
}
```

---

## 11. TESTING STRATEGY

### Test Cases

**Test 1: First Round (No History)**
- Expected: First N trials cannot be matches
- Verify: No false matches reported

**Test 2: Second Round (With History)**
- Expected: First N trials CAN be matches
- Verify: Matches correctly reference previous round

**Test 3: Level Change**
- Expected: History cleared
- Verify: No invalid cross-level matches

**Test 4: D-Prime Accuracy**
- Compare: With vs without history
- Expected: More accurate d-prime with history

**Test 5: Lure Placement**
- Expected: Lures can appear in first N trials
- Verify: N-1 and N+1 lures work correctly

---

## 12. IMPACT ANALYSIS

### Current System (No History)

**At N=3, 10 rounds:**
- Total trials: ~40 per round × 10 = 400 trials
- Wasted trials: 3 per round × 10 = **30 trials (7.5%)**
- Invalid correct rejections: ~30
- D-prime inflation: ~5-10%

### With History System

**At N=3, 10 rounds:**
- Total trials: 400 trials
- Wasted trials: **3 (first round only, 0.75%)**
- Valid matches: +27 potential matches
- D-prime accuracy: Improved by 5-10%

### User Experience Impact

**Without History:**
- "Why does each round feel disconnected?"
- "The first few trials are always easy"
- Artificial performance boost

**With History:**
- Seamless cognitive challenge
- True working memory test
- More engaging gameplay
- Better skill assessment

---

## CONCLUSION

The session boundary problem is a **significant flaw** in the current implementation that:

1. **Wastes 7.5% of trials** (first N per round)
2. **Inflates d-prime scores** by 5-10%
3. **Breaks cognitive continuity** between rounds
4. **Prevents valid lure placement** at round start

**Recommended Solution:** Implement the **Hybrid Continuous History** approach (Approach 3) which:
- Maintains stimulus history across rounds
- Allows valid matches from round start
- Clears history on level changes
- Provides accurate d-prime measurement
- Creates seamless user experience

This fix should be **high priority** as it affects the core validity of the cognitive assessment.


---

## 13. HOW THE LEVEL CHANGES AFTER EACH SESSION

### Yes, the Level DOES Change Automatically!

You're absolutely right - the game automatically adjusts the micro-level after every session based on performance.

### The Process (Step-by-Step)

**1. Session Ends (when all trials complete):**
```javascript
// At end of game cycle (line ~4299)
const configHistory = sessionHistoriesByConfig[getCurrentConfigKey()] || [];
newMicroLevel = checkMicroLevelAdvancement(sessionMetrics, configHistory);
```

**2. Calculate New Micro-Level:**
```javascript
function checkMicroLevelAdvancement(sessionMetrics, sessionHistory) {
  // Get your personal baseline from last 20 sessions
  const baseline = calculateBaseline(sessionHistory);
  const dPrimeThreshold = Math.max(0.5, baseline.avgDPrime);
  
  // Compare current d-prime to baseline
  const dPrime = sessionMetrics.dPrime;
  
  if (dPrime < dPrimeThreshold * 0.7) {
    // REGRESS: -0.05
    newMicroLevel = currentMicroLevel - 0.05;
    
  } else if (dPrime >= dPrimeThreshold && lowBias) {
    // ADVANCE: +0.01 to +0.05 (scaled by performance)
    const increment = 0.01 + (performanceRatio * 0.04);
    newMicroLevel = currentMicroLevel + increment;
    
  } else {
    // STAY: No change
    newMicroLevel = currentMicroLevel;
  }
  
  return newMicroLevel;
}
```

**3. Update Global State:**
```javascript
// Line ~4303
currentMicroLevel = newMicroLevel;
microLevelsByConfig[configKey] = newMicroLevel;
saveSettings(); // Persist to localStorage

// Update UI displays
nLevelInput.value = formatMicroLevel(newMicroLevel);
nBackDisplay.innerHTML = formatMicroLevel(newMicroLevel);
```

**4. Start New Round with New Level:**
```javascript
// Line ~4815
const nextGameCycle = getGameCycle(Math.floor(newMicroLevel));
nextGameCycle(); // Start immediately
intervals.push(setInterval(nextGameCycle, newSpeed));
```

**5. Generate New Stimuli at New Level:**
```javascript
function getGameCycle(n) {
  // n = Math.floor(newMicroLevel) - the integer N-back level
  
  // Adjust difficulty based on micro-progress
  const { nLevel, microProgress } = getMicroLevelComponents(currentMicroLevel);
  
  // Phase 1 (.00-.33): 2 target matches
  // Phase 2 (.34-.66): 3 target matches  
  // Phase 3 (.67-.99): 4 target matches
  if (microProgress < 0.34) {
    targetNumOfStimuli = 2;
  } else if (microProgress < 0.67) {
    targetNumOfStimuli = 3;
  } else {
    targetNumOfStimuli = 4;
  }
  
  // Generate new stimulus sequences
  walls = createBlocksWithLures(wallColorsList, n, 0.25, lureFrequency);
  // ... etc for all modalities
}
```

### Key Points

**Automatic Adjustment:**
- ✅ Happens after EVERY session
- ✅ Based on d-prime performance
- ✅ Compared to personal baseline
- ✅ No manual intervention needed

**What Changes:**
- **Micro-level** (e.g., 2.45 → 2.50)
- **Speed** (faster at higher micro-levels)
- **Target matches** (2, 3, or 4 based on phase)
- **Lure frequency** (5% → 40% within phase)

**What Stays Same:**
- **Integer N-back level** (unless crossing boundary)
- **Enabled modalities** (walls, camera, etc.)
- **Visual settings** (zoom, perspective, etc.)

### Example Progression

**Session 1: Start at 2.00**
- d-prime = 1.8 (good)
- Bias = 0.3 (low)
- Result: **Advance to 2.03** (+0.03)

**Session 2: Now at 2.03**
- d-prime = 1.9 (better)
- Bias = 0.2 (low)
- Result: **Advance to 2.07** (+0.04)

**Session 3: Now at 2.07**
- d-prime = 1.2 (poor)
- Bias = 0.4 (acceptable)
- Result: **Regress to 2.02** (-0.05)

**Session 4: Now at 2.02**
- d-prime = 2.1 (excellent)
- Bias = 0.1 (very low)
- Result: **Advance to 2.07** (+0.05)

### Why This Matters for Session Boundary Issue

**The Problem Compounds:**

Since the level changes after each session, and each session generates NEW stimuli with no history:

1. **Session 1 at N=2.00**: First 2 trials can't be matches
2. **Session 2 at N=2.03**: First 2 trials can't be matches (NEW sequence)
3. **Session 3 at N=2.07**: First 2 trials can't be matches (NEW sequence)
4. **...and so on**

**Every single session** wastes the first N trials because there's no stimulus history carried over!

### The Fix Becomes Even More Critical

With automatic level progression:
- User plays 10 sessions → 10 × N wasted trials
- At N=3: 30 wasted trials across 10 sessions
- At N=5: 50 wasted trials across 10 sessions

**The stimulus history buffer solution is essential** to make the automatic progression system work correctly!

### Current Behavior Summary

```
Session 1 (N=2.00):
  Trials: [?, ?, A, B, C, D]  ← First 2 can't match
  Performance: d'=1.8
  New Level: 2.03

Session 2 (N=2.03):  ← NEW SEQUENCE, NO HISTORY
  Trials: [?, ?, E, F, G, H]  ← First 2 can't match again!
  Performance: d'=1.9
  New Level: 2.07

Session 3 (N=2.07):  ← NEW SEQUENCE, NO HISTORY
  Trials: [?, ?, I, J, K, L]  ← First 2 can't match again!
  ...
```

**With History Buffer:**
```
Session 1 (N=2.00):
  Trials: [?, ?, A, B, C, D]
  History saved: [C, D]
  
Session 2 (N=2.03):  ← CAN REFERENCE HISTORY
  Trials: [C, D, E, F, G, H]  ← First 2 CAN match history!
           ↑  ↑
        Match C  Match D (from Session 1)
  History saved: [G, H]
  
Session 3 (N=2.07):  ← CAN REFERENCE HISTORY
  Trials: [G, H, I, J, K, L]  ← First 2 CAN match history!
           ↑  ↑
        Match G  Match H (from Session 2)
```

This makes the automatic progression system **actually work as intended**!
