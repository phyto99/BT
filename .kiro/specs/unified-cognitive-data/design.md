# Unified Cognitive Data Management System - Design

## Overview

This document defines the architecture for a scientifically-grounded cognitive data management system that maps each brain training game to specific cognitive domains and constructs, enabling transparent data organization, cross-game analytics, and comprehensive cognitive profiling.

## Scoring System Philosophy

### Inverted Scoring (000-999)

The system uses an **inverted scoring paradigm** where **lower scores indicate better performance**, similar to:
- Golf scores (lower is better)
- Reaction times (faster is better)
- Error rates (fewer is better)
- Ranking systems (1st place is better than 100th)

**Score Ranges**:
- **000-333**: Elite performance (green zone)
- **334-666**: Average performance (yellow zone)
- **667-999**: Below average performance (red zone)

**Percentile Interpretation**:
- Lower percentile = Better performance
- 10th percentile = Top 10% of performers
- 50th percentile = Median performance
- 90th percentile = Bottom 10% of performers

**Trend Interpretation**:
- Negative rate = Improvement (score decreasing)
- Positive rate = Decline (score increasing)
- Zero rate = Stable performance

**Rationale**:
This inverted system aligns with cognitive science conventions where:
1. Reaction times are measured in milliseconds (lower = faster = better)
2. Error rates are percentages (lower = more accurate = better)
3. Processing costs are measured in cognitive load (lower = more efficient = better)
4. The system naturally represents "cognitive efficiency" rather than arbitrary points

## Cognitive Domain Taxonomy

### Primary Cognitive Domains

The system organizes cognitive abilities into six primary domains based on established neuropsychological frameworks:

1. **Working Memory (WM)** - Temporary storage and manipulation of information
2. **Attention (ATT)** - Selection and maintenance of relevant information
3. **Processing Speed (PS)** - Speed of cognitive operations
4. **Executive Functions (EF)** - Higher-order control processes
5. **Perceptual Processing (PP)** - Sensory information processing
6. **Long-Term Memory (LTM)** - Encoding and retrieval of stored information

### Cognitive Constructs by Domain

Each domain contains specific measurable constructs:

#### Working Memory Constructs
- **Visuospatial WM**: Temporary storage of visual and spatial information
- **Verbal WM**: Temporary storage of linguistic information
- **Auditory WM**: Temporary storage of sound-based information
- **Multimodal WM**: Integration of multiple information types
- **WM Updating**: Dynamic modification of WM contents
- **WM Capacity**: Maximum amount of information maintainable

#### Attention Constructs
- **Sustained Attention**: Maintaining focus over time
- **Selective Attention**: Focusing on relevant while ignoring irrelevant
- **Divided Attention**: Attending to multiple streams simultaneously
- **Attentional Control**: Voluntary direction of attention
- **Vigilance**: Detection of rare events over extended periods

#### Processing Speed Constructs
- **Perceptual Speed**: Speed of visual/auditory processing
- **Psychomotor Speed**: Speed of motor responses
- **Decision Speed**: Speed of choice reactions
- **Mental Rotation Speed**: Speed of spatial transformations

#### Executive Function Constructs
- **Inhibitory Control**: Suppression of prepotent responses
- **Cognitive Flexibility**: Switching between mental sets
- **Planning**: Formulation of action sequences
- **Problem Solving**: Novel situation resolution
- **Interference Control**: Resistance to distracting information

#### Perceptual Processing Constructs
- **Visual Discrimination**: Distinguishing visual features
- **Spatial Processing**: Processing spatial relationships
- **Pattern Recognition**: Identifying regularities
- **Motion Processing**: Tracking moving objects
- **Synesthetic Integration**: Cross-modal sensory binding

#### Long-Term Memory Constructs
- **Episodic Memory**: Memory for events and experiences
- **Spatial Memory**: Memory for locations and layouts
- **Sequence Memory**: Memory for temporal order
- **Recognition Memory**: Identifying previously encountered items


## Game-to-Cognitive Domain Mapping

### 3D Hyper N-Back

**Primary Domains**: Working Memory (90%), Attention (60%), Executive Functions (50%)

**Cognitive Construct Mapping**:

| Stimulus Type | Primary Construct | Secondary Construct | Tertiary Construct | Weight |
|--------------|-------------------|---------------------|-------------------|--------|
| Position | Visuospatial WM | Spatial Processing | Selective Attention | 1.0 |
| Walls | Visuospatial WM | Pattern Recognition | Spatial Memory | 0.9 |
| Camera | Visuospatial WM | Perspective Taking | Mental Rotation | 0.9 |
| Face | Visuospatial WM | Face Processing | Visual Discrimination | 0.8 |
| Rotation | Visuospatial WM | Mental Rotation Speed | Spatial Processing | 1.0 |
| Word | Verbal WM | Semantic Processing | Recognition Memory | 0.9 |
| Shape | Visuospatial WM | Pattern Recognition | Visual Discrimination | 0.8 |
| Corner | Visuospatial WM | Spatial Processing | Selective Attention | 0.8 |
| Sound | Auditory WM | Auditory Processing | Temporal Processing | 0.9 |
| Color | Visuospatial WM | Color Processing | Visual Discrimination | 0.7 |

**Scientific Metrics**:
- **d'-Prime**: Signal detection sensitivity (discriminability)
- **Criterion (Bias)**: Response bias (conservative vs liberal)
- **Lure Resistance**: Interference control strength
- **N-Level**: Working memory capacity estimate
- **Accuracy**: Overall performance measure
- **Speed**: Processing speed under WM load

**Cognitive Load Factors**:
- Number of active stimuli (1-10): Linear WM load increase
- N-back level (1-9): Exponential WM demand
- Stimulus randomization: Increases cognitive flexibility demand
- Lure trials: Adds interference control requirement

**Scientific Validation**:
- Based on Jaeggi et al. (2008) dual n-back paradigm
- Signal detection theory (Green & Swets, 1966)
- Multiple object tracking literature (Pylyshyn & Storm, 1988)


### Dichotic Dual N-Back

**Primary Domains**: Working Memory (95%), Attention (70%), Executive Functions (40%)

**Cognitive Construct Mapping**:

| Modality | Primary Construct | Secondary Construct | Tertiary Construct | Weight |
|----------|-------------------|---------------------|-------------------|--------|
| Visual Left | Visuospatial WM | Spatial Processing | Divided Attention | 1.0 |
| Visual Right | Visuospatial WM | Spatial Processing | Divided Attention | 1.0 |
| Audio Left | Auditory WM | Dichotic Listening | Selective Attention | 1.0 |
| Audio Right | Auditory WM | Dichotic Listening | Selective Attention | 1.0 |
| Dual Task | Multimodal WM | Divided Attention | Attentional Control | 1.2 |

**Scientific Metrics**:
- **Dual-Task Cost**: Performance decrement under dual-task conditions
- **Modality-Specific Accuracy**: Separate visual and auditory performance
- **Integration Score**: Cross-modal binding efficiency
- **N-Level**: Working memory capacity
- **Reaction Time**: Processing speed under WM load

**Cognitive Load Factors**:
- Dichotic presentation: Adds selective attention demand
- Dual modality: Requires divided attention and cross-modal integration
- N-back level: Scales WM capacity requirement
- Stimulus timing: Affects temporal processing demands

**Scientific Validation**:
- Dual n-back training effects (Jaeggi et al., 2008, 2010)
- Dichotic listening paradigm (Broadbent, 1954)
- Dual-task methodology (Pashler, 1994)
- Cross-modal integration (Calvert et al., 2004)


### Jiggle Factorial 3D (Multiple Object Tracking)

**Primary Domains**: Attention (95%), Perceptual Processing (80%), Working Memory (60%)

**Cognitive Construct Mapping**:

| Task Component | Primary Construct | Secondary Construct | Tertiary Construct | Weight |
|----------------|-------------------|---------------------|-------------------|--------|
| Target Tracking | Sustained Attention | Selective Attention | Visuospatial WM | 1.0 |
| Distractor Rejection | Selective Attention | Inhibitory Control | Interference Control | 0.9 |
| Motion Processing | Motion Processing | Perceptual Speed | Spatial Processing | 0.8 |
| 3D Spatial Tracking | Spatial Processing | Depth Perception | Mental Rotation | 0.9 |
| Sequential Selection | Sequence Memory | Planning | Visuospatial WM | 0.8 |
| Number Recognition | Pattern Recognition | Visual Discrimination | Episodic Memory | 0.6 |

**Scientific Metrics**:
- **Tracking Accuracy**: Percentage of correctly identified targets
- **Capacity Estimate (K)**: Number of objects trackable (K = N × accuracy)
- **Selection Accuracy**: Correct sequence selection rate
- **Speed Threshold**: Maximum tracking speed maintained
- **Distractor Resistance**: Performance with colored distractors

**Cognitive Load Factors**:
- Number of targets (1-10): Linear attention load increase
- Movement complexity (rotating vs non-rotating): Adds spatial processing demand
- Distractor presence: Increases selective attention requirement
- Sequential selection: Adds WM and planning demands
- 3D rotation: Increases spatial processing complexity

**Scientific Validation**:
- Multiple Object Tracking paradigm (Pylyshyn & Storm, 1988)
- Attentional capacity limits (Cowan, 2001)
- Visual attention theory (Treisman & Gelade, 1980)
- 3D MOT training effects (Faubert, 2013)


### Quad Box

**Primary Domains**: Working Memory (90%), Attention (65%), Perceptual Processing (55%)

**Cognitive Construct Mapping**:

| Modality | Primary Construct | Secondary Construct | Tertiary Construct | Weight |
|----------|-------------------|---------------------|-------------------|--------|
| Position | Visuospatial WM | Spatial Processing | Selective Attention | 1.0 |
| Color | Visuospatial WM | Color Processing | Visual Discrimination | 0.8 |
| Shape | Visuospatial WM | Pattern Recognition | Visual Discrimination | 0.8 |
| Audio | Auditory WM | Auditory Processing | Temporal Processing | 0.9 |
| Quad Mode | Multimodal WM | Divided Attention | Attentional Control | 1.2 |
| 3D Rotation | Mental Rotation | Spatial Processing | Perceptual Speed | 0.7 |

**Scientific Metrics**:
- **Modality-Specific Accuracy**: Performance per modality
- **Quad Accuracy**: Combined four-modality performance
- **Dual-Task Cost**: Performance decrement in multi-modality conditions
- **N-Level**: Working memory capacity
- **Rotation Speed Tolerance**: Spatial processing under motion

**Cognitive Load Factors**:
- Number of modalities (1-4): Scales divided attention demand
- N-back level: Scales WM capacity requirement
- Rotation speed: Adds perceptual processing demand
- Trial timing: Affects processing speed requirements
- Match probability: Influences decision criteria

**Scientific Validation**:
- Multi-modal n-back paradigm
- Divided attention theory (Kahneman, 1973)
- Cross-modal integration research
- Spatial cognition under motion (Wolbers & Hegarty, 2010)


### Fast Sequence N-Back

**Primary Domains**: Working Memory (85%), Perceptual Processing (70%), Executive Functions (55%)

**Cognitive Construct Mapping**:

| Task Component | Primary Construct | Secondary Construct | Tertiary Construct | Weight |
|----------------|-------------------|---------------------|-------------------|--------|
| Spatial Sequence | Visuospatial WM | Sequence Memory | Spatial Processing | 1.0 |
| Letter Sequence | Verbal WM | Sequence Memory | Pattern Recognition | 0.9 |
| Grapheme-Color | Synesthetic Integration | Color Processing | Cross-Modal Binding | 0.8 |
| Spatial-Music | Synesthetic Integration | Auditory Processing | Spatial-Auditory Binding | 0.8 |
| Rapid Presentation | Processing Speed | Perceptual Speed | Temporal Processing | 0.9 |
| Interference Control | Inhibitory Control | Interference Control | Selective Attention | 0.7 |

**Scientific Metrics**:
- **Spatial Accuracy**: Spatial sequence matching performance
- **Letter Accuracy**: Verbal sequence matching performance
- **Overall Score**: Combined performance across modalities
- **Synesthesia Benefit**: Performance enhancement from cross-modal cues
- **Processing Speed**: Performance under rapid presentation

**Cognitive Load Factors**:
- Sequence length (1-20 items): Scales WM capacity demand
- Presentation speed: Affects processing speed requirements
- N-back level: Scales WM updating demand
- Synesthetic cues: Adds cross-modal integration
- Interference trials: Increases executive control demand

**Scientific Validation**:
- Sequential memory research (Hitch et al., 1996)
- Synesthesia and cross-modal integration (Spence, 2011)
- Rapid serial visual presentation (RSVP) paradigm
- Working memory for sequences (Burgess & Hitch, 1999)


### Memory Game (Corsi-like)

**Primary Domains**: Long-Term Memory (80%), Working Memory (70%), Attention (50%)

**Cognitive Construct Mapping**:

| Task Component | Primary Construct | Secondary Construct | Tertiary Construct | Weight |
|----------------|-------------------|---------------------|-------------------|--------|
| Spatial Recall | Spatial Memory | Visuospatial WM | Sequence Memory | 1.0 |
| Sequence Encoding | Episodic Memory | Sequence Memory | Attention | 0.9 |
| Immediate Recall | Visuospatial WM | Spatial Processing | Pattern Recognition | 0.8 |
| Span Measurement | WM Capacity | Spatial Memory Span | Attention Capacity | 1.0 |

**Scientific Metrics**:
- **Span Length**: Maximum correctly recalled sequence
- **Accuracy**: Percentage of correct recalls
- **Recall Time**: Speed of sequence reproduction
- **Learning Curve**: Improvement over repeated trials

**Cognitive Load Factors**:
- Sequence length: Scales memory span demand
- Presentation speed: Affects encoding time
- Grid size: Influences spatial complexity
- Repetition: Enables learning and consolidation

**Scientific Validation**:
- Corsi Block-Tapping Test (Corsi, 1972)
- Visuospatial working memory (Baddeley, 1986)
- Spatial span measurement (Kessels et al., 2000)


## Unified Data Schema

### Core Data Structure

```javascript
{
  "schemaVersion": "1.0.0",
  "userId": "generated-uuid",
  "profileCreated": "ISO-8601-timestamp",
  "lastUpdated": "ISO-8601-timestamp",
  
  "cognitiveProfile": {
    "domains": {
      "workingMemory": { /* domain metrics */ },
      "attention": { /* domain metrics */ },
      "processingSpeed": { /* domain metrics */ },
      "executiveFunctions": { /* domain metrics */ },
      "perceptualProcessing": { /* domain metrics */ },
      "longTermMemory": { /* domain metrics */ }
    },
    "constructs": {
      "visuospatialWM": { /* construct metrics */ },
      "verbalWM": { /* construct metrics */ },
      // ... all constructs
    }
  },
  
  "games": {
    "3d-hyper-nback": { /* game data */ },
    "dichotic-dual-nback": { /* game data */ },
    "jiggle-factorial": { /* game data */ },
    "quad-box": { /* game data */ },
    "fast-sequence-nback": { /* game data */ },
    "memory": { /* game data */ }
  },
  
  "analytics": {
    "totalTrainingTime": 0,
    "totalSessions": 0,
    "trainingStreak": 0,
    "lastTrainingDate": "ISO-8601-date"
  }
}
```

### Domain Metrics Structure

```javascript
{
  "domainId": "workingMemory",
  "domainName": "Working Memory",
  "overallScore": 250,   // 000-999 normalized score (lower is better)
  "percentile": 32,      // Compared to normative data (lower percentile = better performance)
  "confidence": 0.85,    // Statistical confidence (0-1)
  "dataPoints": 150,     // Number of contributing measurements
  "trend": {
    "direction": "improving",  // improving = score decreasing
    "rate": -5,               // Change per week (negative = improvement)
    "significance": 0.03      // p-value
  },
  "lastUpdated": "ISO-8601-timestamp",
  "contributingGames": [
    {
      "gameId": "3d-hyper-nback",
      "weight": 0.9,
      "sessions": 45
    }
  ]
}
```

### Construct Metrics Structure

```javascript
{
  "constructId": "visuospatialWM",
  "constructName": "Visuospatial Working Memory",
  "definition": "The ability to temporarily store and manipulate visual and spatial information",
  "score": 280,  // 000-999 normalized score (lower is better)
  "percentile": 35,  // Lower percentile = better performance
  "capacity": 4.2,  // Estimated items (K-value)
  "confidence": 0.88,
  "measurements": [
    {
      "gameId": "3d-hyper-nback",
      "metric": "nLevel",
      "value": 5.2,
      "weight": 1.0,
      "timestamp": "ISO-8601-timestamp"
    }
  ],
  "trend": {
    "direction": "improving",  // Score decreasing over time
    "rate": -8,  // Negative rate = improvement
    "significance": 0.01
  }
}
```


### Game Session Data Structure

```javascript
{
  "sessionId": "uuid",
  "gameId": "3d-hyper-nback",
  "timestamp": "ISO-8601-timestamp",
  "duration": 1200000,  // milliseconds
  "gameVersion": "1.2.0",
  "settings": {
    // Game-specific settings at time of session
  },
  
  "performance": {
    "primaryMetrics": {
      "accuracy": 0.85,
      "nLevel": 5.0,
      "dPrime": 2.1,
      "criterion": 0.15
    },
    "secondaryMetrics": {
      "reactionTime": 850,
      "lureResistance": 0.78
    },
    "stimulusSpecific": {
      "position": { "accuracy": 0.90, "trials": 20 },
      "color": { "accuracy": 0.80, "trials": 20 }
      // ... per stimulus
    }
  },
  
  "cognitiveContributions": {
    "visuospatialWM": {
      "score": 0.85,
      "weight": 1.0,
      "confidence": 0.9
    },
    "selectiveAttention": {
      "score": 0.78,
      "weight": 0.6,
      "confidence": 0.85
    }
    // ... all relevant constructs
  },
  
  "trials": [
    {
      "trialNumber": 1,
      "stimulus": "position",
      "nBack": 3,
      "isMatch": true,
      "userResponse": true,
      "correct": true,
      "reactionTime": 820,
      "timestamp": "ISO-8601-timestamp"
    }
    // ... all trials
  ],
  
  "gameSpecific": {
    // Game-specific extended data
  }
}
```

### Analytics Data Structure

```javascript
{
  "dailyStats": {
    "2024-01-15": {
      "totalTime": 3600000,
      "sessions": 3,
      "gamesPlayed": ["3d-hyper-nback", "jiggle-factorial"],
      "averagePerformance": 0.78,
      "cognitiveLoad": "high"
    }
  },
  
  "weeklyStats": {
    "2024-W03": {
      "totalTime": 18000000,
      "sessions": 15,
      "averagePerformance": 0.76,
      "improvement": 0.05,
      "consistency": 0.92
    }
  },
  
  "achievements": [
    {
      "id": "streak-7",
      "name": "Week Warrior",
      "earned": "ISO-8601-timestamp",
      "description": "Trained 7 days in a row"
    }
  ],
  
  "milestones": [
    {
      "type": "nLevel",
      "game": "3d-hyper-nback",
      "value": 5,
      "reached": "ISO-8601-timestamp"
    }
  ]
}
```


## Architecture Components

### 1. CognitiveDataManager

Central class managing all cognitive data operations.

**Responsibilities**:
- Initialize and maintain unified data schema
- Validate incoming data against schema
- Calculate cognitive domain and construct scores
- Manage data persistence (localStorage)
- Handle data migration between schema versions
- Provide data export/import functionality

**Key Methods**:
```javascript
class CognitiveDataManager {
  constructor()
  initializeSchema()
  recordSession(gameId, sessionData)
  updateCognitiveProfile()
  calculateDomainScore(domainId)
  calculateConstructScore(constructId)
  exportData(format) // 'json' or 'csv'
  importData(data)
  deleteAllData()
  getDataQualityReport()
}
```

### 2. CognitiveMappingEngine

Maps game performance to cognitive constructs.

**Responsibilities**:
- Maintain game-to-construct mappings
- Calculate construct contributions from game data
- Weight multiple measurements appropriately
- Apply scientific formulas for metric calculation

**Key Methods**:
```javascript
class CognitiveMappingEngine {
  getGameMapping(gameId)
  calculateConstructContribution(gameId, sessionData, constructId)
  calculateDPrime(hits, misses, falseAlarms, correctRejections)
  calculateCapacity(nLevel, accuracy)
  calculateProcessingSpeed(reactionTimes)
  getConstructDefinition(constructId)
}
```

### 3. DataTransparencyLayer

Provides user-facing data access and visualization.

**Responsibilities**:
- Display all stored data in human-readable format
- Generate data visualizations
- Provide data explanations
- Calculate storage usage
- Enable data exploration

**Key Methods**:
```javascript
class DataTransparencyLayer {
  showDataDashboard()
  displaySessionDetails(sessionId)
  explainMetric(metricId)
  calculateStorageUsage()
  generateDataReport()
  visualizeTrends(domainId, timeRange)
}
```

### 4. CrossGameAnalytics

Performs analytics across multiple games.

**Responsibilities**:
- Aggregate performance across games
- Identify correlations between domains
- Calculate improvement rates
- Generate cognitive profiles
- Detect training patterns

**Key Methods**:
```javascript
class CrossGameAnalytics {
  generateCognitiveProfile()
  calculateDomainCorrelations()
  identifyStrengthsAndWeaknesses()
  predictPerformance(domainId, daysAhead)
  analyzeTrainingPatterns()
  compareToNormativeData()
}
```

### 5. DataValidator

Ensures data quality and integrity.

**Responsibilities**:
- Validate incoming session data
- Detect anomalies
- Calculate data quality metrics
- Log validation errors
- Suggest data corrections

**Key Methods**:
```javascript
class DataValidator {
  validateSession(sessionData)
  detectAnomalies(sessionData)
  calculateDataQuality(gameId)
  checkDataCompleteness()
  validateMetricRanges(metrics)
}
```


## Scientific Metric Calculations

### Signal Detection Theory Metrics

**d-prime (d')**: Sensitivity measure
```javascript
function calculateDPrime(hits, misses, falseAlarms, correctRejections) {
  const hitRate = hits / (hits + misses);
  const faRate = falseAlarms / (falseAlarms + correctRejections);
  
  // Apply correction for extreme values
  const correctedHitRate = Math.max(0.01, Math.min(0.99, hitRate));
  const correctedFaRate = Math.max(0.01, Math.min(0.99, faRate));
  
  // Calculate z-scores
  const zHit = inverseNormalCDF(correctedHitRate);
  const zFa = inverseNormalCDF(correctedFaRate);
  
  return zHit - zFa;
}
```

**Criterion (c)**: Response bias
```javascript
function calculateCriterion(hits, misses, falseAlarms, correctRejections) {
  const hitRate = hits / (hits + misses);
  const faRate = falseAlarms / (falseAlarms + correctRejections);
  
  const correctedHitRate = Math.max(0.01, Math.min(0.99, hitRate));
  const correctedFaRate = Math.max(0.01, Math.min(0.99, faRate));
  
  const zHit = inverseNormalCDF(correctedHitRate);
  const zFa = inverseNormalCDF(correctedFaRate);
  
  return -0.5 * (zHit + zFa);
}
```

### Working Memory Capacity

**Cowan's K**: Capacity estimate
```javascript
function calculateCapacity(nLevel, accuracy, numItems = 1) {
  // K = N × (accuracy - guessing rate) / (1 - guessing rate)
  // For n-back, guessing rate ≈ 0.5
  const guessingRate = 0.5;
  const k = nLevel * numItems * (accuracy - guessingRate) / (1 - guessingRate);
  return Math.max(0, k);
}
```

**Span Score**: Maximum maintained items
```javascript
function calculateSpan(trials) {
  // Find longest sequence with ≥80% accuracy
  const spanLevels = {};
  trials.forEach(trial => {
    const level = trial.sequenceLength;
    if (!spanLevels[level]) {
      spanLevels[level] = { correct: 0, total: 0 };
    }
    spanLevels[level].total++;
    if (trial.correct) spanLevels[level].correct++;
  });
  
  let maxSpan = 0;
  Object.keys(spanLevels).forEach(level => {
    const accuracy = spanLevels[level].correct / spanLevels[level].total;
    if (accuracy >= 0.8) {
      maxSpan = Math.max(maxSpan, parseInt(level));
    }
  });
  
  return maxSpan;
}
```

### Processing Speed Metrics

**Mean Reaction Time**: Average response speed
```javascript
function calculateMeanRT(reactionTimes) {
  // Remove outliers (< 200ms or > 3 SD from mean)
  const mean = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
  const sd = Math.sqrt(
    reactionTimes.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / reactionTimes.length
  );
  
  const filtered = reactionTimes.filter(rt => 
    rt >= 200 && Math.abs(rt - mean) <= 3 * sd
  );
  
  return filtered.reduce((a, b) => a + b) / filtered.length;
}
```

**Throughput**: Information processed per unit time
```javascript
function calculateThroughput(correctResponses, totalTime) {
  // Items per second
  return (correctResponses / totalTime) * 1000;
}
```

### Attention Metrics

**Sustained Attention**: Performance over time
```javascript
function calculateSustainedAttention(trials) {
  // Compare first vs last quartile performance
  const quartileSize = Math.floor(trials.length / 4);
  const firstQuartile = trials.slice(0, quartileSize);
  const lastQuartile = trials.slice(-quartileSize);
  
  const firstAccuracy = firstQuartile.filter(t => t.correct).length / firstQuartile.length;
  const lastAccuracy = lastQuartile.filter(t => t.correct).length / lastQuartile.length;
  
  // Vigilance decrement (lower = better sustained attention)
  const decrement = firstAccuracy - lastAccuracy;
  
  return {
    overallAccuracy: trials.filter(t => t.correct).length / trials.length,
    vigilanceDecrement: decrement,
    sustainedAttentionScore: 1 - Math.abs(decrement)
  };
}
```

### Learning and Improvement Metrics

**Learning Rate**: Improvement over time
```javascript
function calculateLearningRate(sessions) {
  // Linear regression on performance over time
  const n = sessions.length;
  const x = sessions.map((_, i) => i);
  const y = sessions.map(s => s.performance.accuracy);
  
  const sumX = x.reduce((a, b) => a + b);
  const sumY = y.reduce((a, b) => a + b);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R²
  const yMean = sumY / n;
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const ssResidual = y.reduce((sum, yi, i) => 
    sum + Math.pow(yi - (slope * x[i] + intercept), 2), 0
  );
  const r2 = 1 - (ssResidual / ssTotal);
  
  return {
    slope: slope,  // Improvement per session
    intercept: intercept,
    r2: r2,  // Goodness of fit
    significance: calculateSignificance(slope, n, r2)
  };
}
```


## Data Visualization Components

### 1. Cognitive Profile Radar Chart

Displays overall performance across all six cognitive domains.

**Features**:
- Hexagonal radar chart with six axes (one per domain)
- Normalized scores (000-999, inverted display so lower scores appear further from center)
- Comparison to normative data (shaded region)
- Color-coded by performance level (green=000-333, yellow=334-666, red=667-999)
- Interactive tooltips with detailed metrics
- Visual inversion: better performance (lower scores) shown as larger area

### 2. Domain Timeline Graph

Shows performance trends for a specific domain over time.

**Features**:
- Line graph with confidence intervals
- Trend line with statistical significance indicator
- Milestone markers (achievements, level-ups)
- Zoom and pan controls
- Exportable as image

### 3. Construct Heatmap

Matrix showing performance across all constructs.

**Features**:
- Color intensity represents performance level
- Rows = constructs, Columns = time periods
- Hover shows detailed metrics
- Identifies patterns and correlations
- Filterable by domain

### 4. Game Contribution Breakdown

Pie or stacked bar chart showing which games contribute to each domain.

**Features**:
- Visual representation of game weights
- Session count per game
- Click to filter by game
- Shows training balance

### 5. Session Detail View

Detailed breakdown of individual training sessions.

**Features**:
- Trial-by-trial performance
- Reaction time distribution
- Accuracy by stimulus type
- Cognitive load indicators
- Comparison to personal best

## Data Export Formats

### JSON Export

Complete data export preserving all structure and metadata.

```javascript
{
  "exportVersion": "1.0.0",
  "exportDate": "ISO-8601-timestamp",
  "userData": {
    // Complete unified data structure
  },
  "metadata": {
    "totalSessions": 150,
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-03-15"
    },
    "gamesIncluded": ["3d-hyper-nback", "jiggle-factorial"],
    "schemaVersion": "1.0.0"
  }
}
```

### CSV Export

Flattened data for spreadsheet analysis.

**Sessions CSV**:
```
SessionID,GameID,Date,Duration,Accuracy,NLevel,DPrime,Criterion,Domain1Score,Domain2Score,...
uuid-1,3d-hyper-nback,2024-01-15,1200000,0.85,5.0,2.1,0.15,0.82,0.75,...
```

**Trials CSV**:
```
SessionID,TrialNumber,Stimulus,IsMatch,UserResponse,Correct,ReactionTime,Timestamp
uuid-1,1,position,true,true,true,820,2024-01-15T10:30:15Z
```

**Cognitive Profile CSV**:
```
Domain,Score,Percentile,Confidence,Trend,TrendRate,Significance
WorkingMemory,250,32,0.85,improving,-5,0.03
Attention,180,22,0.90,stable,-0.5,0.45
ProcessingSpeed,420,58,0.78,declining,3,0.08
```


## Integration with Existing Systems

### Integration with Unified Progression System

The cognitive data system complements the existing progression system:

**Shared Data**:
- Training time and session counts
- Achievement triggers based on cognitive milestones
- Tier progression influenced by cognitive profile

**Cognitive-Enhanced Progression**:
```javascript
{
  "tier": 3,
  "tierName": "Cognitive Athlete",
  "requirements": {
    "totalTime": 36000000,  // From progression system
    "cognitiveThresholds": {
      "workingMemory": 300,  // Score must be ≤300 (lower is better)
      "attention": 350,      // Score must be ≤350
      "processingSpeed": 400 // Score must be ≤400
    }
  },
  "tierBenefits": {
    "title": "Cognitive Athlete",
    "description": "Elite cognitive performance across multiple domains",
    "scoreRange": "000-333 in 3+ domains"
  }
}
```

### Integration with Reactive Settings

Settings affect cognitive load and should be tracked:

```javascript
{
  "sessionId": "uuid",
  "cognitiveLoad": {
    "estimated": "high",
    "factors": {
      "nLevel": 5,  // High WM demand
      "stimuliCount": 8,  // High attention demand
      "speed": "fast"  // High processing speed demand
    }
  }
}
```

### Integration with Game Stats

Existing game stats are preserved and enhanced:

```javascript
// Existing game-specific stats
const gameStats = {
  "3d-hyper-nback": {
    "sessions": 45,
    "avgNLevel": 5.2,
    "avgAccuracy": 0.85
  }
};

// Enhanced with cognitive mapping
const enhancedStats = {
  "3d-hyper-nback": {
    ...gameStats["3d-hyper-nback"],
    "cognitiveContributions": {
      "visuospatialWM": 0.85,
      "selectiveAttention": 0.78,
      "processingSpeed": 0.72
    }
  }
};
```

## Privacy and Security

### Data Storage

**Local Storage Strategy**:
- All data stored in browser localStorage by default
- Encrypted using SubtleCrypto API
- Separate storage keys per data type
- Automatic cleanup of old data (configurable retention)

**Storage Keys**:
```javascript
const STORAGE_KEYS = {
  COGNITIVE_PROFILE: 'unified-cognitive-profile',
  SESSION_DATA: 'unified-session-data',
  ANALYTICS: 'unified-analytics',
  SETTINGS: 'unified-cognitive-settings',
  SCHEMA_VERSION: 'unified-schema-version'
};
```

### Data Encryption

```javascript
async function encryptData(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  
  // Generate or retrieve encryption key
  const key = await getOrCreateEncryptionKey();
  
  // Encrypt data
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    dataBuffer
  );
  
  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encryptedData))
  };
}
```

### Data Deletion

Complete and irreversible data deletion:

```javascript
function deleteAllCognitiveData() {
  // Confirm with user
  const confirmed = confirm(
    'This will permanently delete all your training data. ' +
    'Would you like to export your data first?'
  );
  
  if (!confirmed) return;
  
  // Offer export
  const exportFirst = confirm('Export data before deletion?');
  if (exportFirst) {
    exportData('json');
  }
  
  // Delete all storage keys
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear encryption keys
  clearEncryptionKeys();
  
  console.log('All cognitive data deleted');
}
```

## Performance Considerations

### Data Size Management

**Strategies**:
1. **Aggregation**: Store daily/weekly summaries, not all individual trials
2. **Compression**: Use LZ-string compression for large datasets
3. **Pruning**: Automatically remove old detailed data (keep summaries)
4. **Lazy Loading**: Load data on-demand, not all at once

**Storage Limits**:
```javascript
const STORAGE_LIMITS = {
  MAX_SESSIONS_DETAILED: 100,  // Keep full trial data for last 100 sessions
  MAX_SESSIONS_SUMMARY: 1000,  // Keep summaries for last 1000 sessions
  MAX_STORAGE_MB: 50,  // Alert if approaching 50MB
  COMPRESSION_THRESHOLD: 10000  // Compress data > 10KB
};
```

### Calculation Performance

**Optimization Strategies**:
1. **Caching**: Cache calculated metrics, recalculate only when new data added
2. **Incremental Updates**: Update only affected metrics, not entire profile
3. **Web Workers**: Perform heavy calculations in background threads
4. **Debouncing**: Batch multiple updates together

```javascript
class PerformanceOptimizer {
  constructor() {
    this.cache = new Map();
    this.updateQueue = [];
    this.worker = new Worker('cognitive-calculator.worker.js');
  }
  
  async calculateMetric(metricId, data) {
    // Check cache first
    const cacheKey = `${metricId}-${this.hashData(data)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // Calculate in worker
    const result = await this.worker.calculate(metricId, data);
    
    // Cache result
    this.cache.set(cacheKey, result);
    
    return result;
  }
}
```


## Score Normalization and Calculation

### Converting Raw Metrics to 000-999 Scores

Each cognitive domain and construct score is calculated by normalizing raw performance metrics to the 000-999 scale.

**General Normalization Formula**:
```javascript
function normalizeToInvertedScore(rawValue, metric) {
  // Get normative data for this metric
  const norms = getNormativeData(metric);
  
  // Calculate z-score
  const zScore = (rawValue - norms.mean) / norms.stdDev;
  
  // Convert to percentile (0-100)
  const percentile = normalCDF(zScore) * 100;
  
  // Invert percentile (so lower raw performance = higher percentile = higher score)
  const invertedPercentile = 100 - percentile;
  
  // Scale to 000-999 range
  const score = Math.round((invertedPercentile / 100) * 999);
  
  // Clamp to valid range
  return Math.max(0, Math.min(999, score));
}
```

### Metric-Specific Normalization

Different metrics require different normalization approaches:

**Accuracy-Based Metrics** (higher raw accuracy = lower score):
```javascript
function normalizeAccuracy(accuracy) {
  // accuracy is 0.0 to 1.0
  // Perfect accuracy (1.0) should map to score 000
  // Poor accuracy (0.5) should map to score ~500
  // Terrible accuracy (0.0) should map to score 999
  
  const invertedAccuracy = 1.0 - accuracy;
  return Math.round(invertedAccuracy * 999);
}
```

**N-Back Level** (higher level = lower score):
```javascript
function normalizeNBackLevel(nLevel, maxObserved = 10) {
  // Higher n-back level indicates better WM capacity
  // Map to inverted score
  
  // Normalize to 0-1 range
  const normalized = nLevel / maxObserved;
  
  // Invert (high level = low score)
  const inverted = 1.0 - normalized;
  
  return Math.round(inverted * 999);
}
```

**Reaction Time** (lower RT = lower score):
```javascript
function normalizeReactionTime(rt, minRT = 200, maxRT = 2000) {
  // Faster RT = better performance = lower score
  // Already naturally inverted!
  
  // Normalize to 0-1 range
  const normalized = (rt - minRT) / (maxRT - minRT);
  
  // Clamp and scale
  const clamped = Math.max(0, Math.min(1, normalized));
  
  return Math.round(clamped * 999);
}
```

**d-Prime** (higher d' = lower score):
```javascript
function normalizeDPrime(dPrime, maxDPrime = 4.0) {
  // Higher d-prime = better sensitivity = lower score
  
  // Normalize to 0-1 range
  const normalized = Math.min(dPrime / maxDPrime, 1.0);
  
  // Invert
  const inverted = 1.0 - normalized;
  
  return Math.round(inverted * 999);
}
```

**Error Rate** (lower error = lower score):
```javascript
function normalizeErrorRate(errorRate) {
  // errorRate is 0.0 to 1.0
  // Low error rate = good performance = low score
  // Already naturally aligned!
  
  return Math.round(errorRate * 999);
}
```

### Composite Score Calculation

When multiple games contribute to a domain, calculate weighted average:

```javascript
function calculateDomainScore(domainId, sessions) {
  const contributions = [];
  
  sessions.forEach(session => {
    const gameMapping = getGameMapping(session.gameId);
    const domainContribution = gameMapping.domains[domainId];
    
    if (domainContribution) {
      // Calculate session score for this domain
      const sessionScore = calculateSessionDomainScore(
        session, 
        domainId, 
        domainContribution
      );
      
      contributions.push({
        score: sessionScore,
        weight: domainContribution.weight,
        confidence: session.dataQuality
      });
    }
  });
  
  // Weighted average
  let totalWeight = 0;
  let weightedSum = 0;
  
  contributions.forEach(c => {
    const effectiveWeight = c.weight * c.confidence;
    weightedSum += c.score * effectiveWeight;
    totalWeight += effectiveWeight;
  });
  
  const finalScore = Math.round(weightedSum / totalWeight);
  
  return {
    score: finalScore,
    confidence: totalWeight / contributions.length,
    dataPoints: contributions.length
  };
}
```

### Percentile Calculation

Convert scores to percentiles using normative data:

```javascript
function calculatePercentile(score, domainId) {
  // Get normative distribution for this domain
  const norms = getNormativeData(domainId);
  
  // Count how many normative scores are >= this score
  // (Remember: higher score = worse performance)
  const worseCount = norms.scores.filter(s => s >= score).length;
  
  // Percentile = percentage of population performing worse
  const percentile = (worseCount / norms.scores.length) * 100;
  
  return Math.round(percentile);
}
```

### Score Interpretation Helper

```javascript
function interpretScore(score) {
  if (score <= 333) {
    return {
      level: "Elite",
      color: "green",
      description: "Top-tier cognitive performance",
      emoji: "🏆"
    };
  } else if (score <= 666) {
    return {
      level: "Average",
      color: "yellow",
      description: "Typical cognitive performance",
      emoji: "📊"
    };
  } else {
    return {
      level: "Developing",
      color: "red",
      description: "Room for improvement",
      emoji: "📈"
    };
  }
}
```

### Example Score Calculations

**Example 1: 3D Hyper N-Back Session**
```javascript
const session = {
  gameId: "3d-hyper-nback",
  performance: {
    nLevel: 5.0,
    accuracy: 0.85,
    dPrime: 2.1,
    reactionTime: 850
  }
};

// Calculate individual metric scores
const nLevelScore = normalizeNBackLevel(5.0, 10);  // 500
const accuracyScore = normalizeAccuracy(0.85);     // 150
const dPrimeScore = normalizeDPrime(2.1, 4.0);     // 475
const rtScore = normalizeReactionTime(850, 200, 2000);  // 361

// Weighted average for Working Memory domain
const wmScore = (
  nLevelScore * 0.4 +
  accuracyScore * 0.3 +
  dPrimeScore * 0.2 +
  rtScore * 0.1
) / 1.0;  // = 318

// Result: Elite performance (000-333 range)
```

**Example 2: Jiggle Factorial Session**
```javascript
const session = {
  gameId: "jiggle-factorial",
  performance: {
    trackingAccuracy: 0.75,
    selectionAccuracy: 0.80,
    speedThreshold: 0.8
  }
};

// Calculate Attention domain score
const trackingScore = normalizeAccuracy(0.75);     // 250
const selectionScore = normalizeAccuracy(0.80);    // 200
const speedScore = Math.round((1 - 0.8) * 999);    // 200

// Weighted average
const attentionScore = (
  trackingScore * 0.5 +
  selectionScore * 0.3 +
  speedScore * 0.2
) / 1.0;  // = 235

// Result: Elite performance
```

