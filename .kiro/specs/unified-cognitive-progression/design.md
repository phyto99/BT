# Unified Cognitive Progression System - Design

## Overview

The Unified Cognitive Progression System combines scientific cognitive domain mapping with motivational progression features. It tracks cognitive performance using validated metrics (000-999 inverted scale), displays all calculations transparently, and provides progression features (achievements, tiers, streaks) based on both cognitive improvement and training consistency.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Unified Core (unified-core.js)            │
│  • Settings management                                       │
│  • Game loading                                              │
│  • Event coordination                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Cognitive Progression System                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Data Layer (IndexedDB)                             │   │
│  │  • Profiles                                         │   │
│  │  • Sessions                                         │   │
│  │  • Cognitive metrics                                │   │
│  │  • Achievements                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Cognitive Engine                                   │   │
│  │  • Domain mapping                                   │   │
│  │  • Metric calculations                              │   │
│  │  • Score normalization                              │   │
│  │  • Trend analysis                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Progression Engine                                 │   │
│  │  • Achievement tracking                             │   │
│  │  • Tier calculation                                 │   │
│  │  • Streak management                                │   │
│  │  • Progress bars                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  UI Layer                                           │   │
│  │  • Cognitive profile display                        │   │
│  │  • Formula transparency                             │   │
│  │  • Progress visualization                           │   │
│  │  • Achievement showcase                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Trains → Session Data → Cognitive Mapping → Score Calculation
                                                         ↓
Achievement Check ← Tier Update ← Profile Update ← Normalization
         ↓
    UI Update → User Sees Results
```

## Data Models

### Profile Schema


```javascript
{
  id: 'uuid',
  name: 'string',
  createdAt: 'timestamp',
  lastActive: 'timestamp',
  
  // Cognitive Profile
  cognitiveProfile: {
    workingMemory: { score: 500, confidence: 0.5, sessions: 0, lastUpdated: 'timestamp' },
    attention: { score: 500, confidence: 0.5, sessions: 0, lastUpdated: 'timestamp' },
    processingSpeed: { score: 500, confidence: 0.5, sessions: 0, lastUpdated: 'timestamp' },
    executiveFunctions: { score: 500, confidence: 0.5, sessions: 0, lastUpdated: 'timestamp' },
    perceptualProcessing: { score: 500, confidence: 0.5, sessions: 0, lastUpdated: 'timestamp' },
    longTermMemory: { score: 500, confidence: 0.5, sessions: 0, lastUpdated: 'timestamp' }
  },
  
  // Progression Data
  progression: {
    tier: 'Beginner',
    totalTime: 0,
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastTrainingDate: null,
    achievements: []
  },
  
  // Statistics
  stats: {
    byGame: {},
    byDomain: {},
    trends: {}
  }
}
```

### Session Schema

```javascript
{
  id: 'uuid',
  profileId: 'uuid',
  gameId: 'string',
  startTime: 'timestamp',
  endTime: 'timestamp',
  duration: 'number',
  
  // Game-specific metrics
  gameMetrics: {
    level: 'number',
    accuracy: 'number',
    reactionTime: 'number',
    // ... game-specific fields
  },
  
  // Cognitive contributions
  cognitiveContributions: {
    workingMemory: { weight: 0.9, rawScore: 450, normalizedScore: 450 },
    attention: { weight: 0.6, rawScore: 380, normalizedScore: 380 },
    // ... other domains
  },
  
  // Scientific metrics
  scientificMetrics: {
    dPrime: 2.1,
    criterion: 0.15,
    capacity: 4.2,
    meanRT: 850,
    // ... other metrics
  }
}
```

### Achievement Schema

```javascript
{
  id: 'string',
  name: 'string',
  description: 'string',
  category: 'cognitive' | 'time' | 'consistency' | 'milestone',
  
  requirement: {
    type: 'cognitiveScore' | 'totalTime' | 'streak' | 'sessions',
    domain: 'workingMemory' | 'attention' | ...,
    value: 'number',
    operator: '<=' | '>=' | '=='
  },
  
  unlockedAt: 'timestamp | null',
  progress: 'number'
}
```

## Cognitive Mapping Engine

### Game-to-Domain Mappings


```javascript
const GAME_MAPPINGS = {
  '3d-hyper-nback': {
    domains: {
      workingMemory: { weight: 0.90, constructs: ['visuospatial', 'verbal', 'auditory'] },
      attention: { weight: 0.60, constructs: ['selective', 'sustained'] },
      executiveFunctions: { weight: 0.50, constructs: ['interference'] }
    },
    metrics: ['dPrime', 'capacity', 'lureResistance', 'perStimulusAccuracy']
  },
  
  'jiggle-factorial': {
    domains: {
      attention: { weight: 0.95, constructs: ['multipleObjectTracking', 'divided'] },
      perceptualProcessing: { weight: 0.80, constructs: ['motionPerception', 'objectTracking'] },
      workingMemory: { weight: 0.60, constructs: ['visuospatial'] }
    },
    metrics: ['capacity', 'trackingAccuracy', 'distractorResistance']
  },
  
  'dichotic-dual-nback': {
    domains: {
      workingMemory: { weight: 0.95, constructs: ['multimodal', 'auditory', 'visual'] },
      attention: { weight: 0.70, constructs: ['divided', 'selective'] },
      executiveFunctions: { weight: 0.40, constructs: ['taskSwitching'] }
    },
    metrics: ['dPrime', 'dualTaskCost', 'modalitySpecific']
  },
  
  'quad-box': {
    domains: {
      workingMemory: { weight: 0.90, constructs: ['visuospatial', 'multimodal'] },
      attention: { weight: 0.65, constructs: ['divided', 'selective'] },
      perceptualProcessing: { weight: 0.55, constructs: ['spatialRotation', 'patternRecognition'] }
    },
    metrics: ['perModalityAccuracy', 'rotationTolerance', 'capacity']
  },
  
  'fast-sequence-nback': {
    domains: {
      workingMemory: { weight: 0.85, constructs: ['sequenceMemory', 'visuospatial'] },
      perceptualProcessing: { weight: 0.70, constructs: ['synesthesia', 'patternRecognition'] },
      executiveFunctions: { weight: 0.55, constructs: ['sequencing'] }
    },
    metrics: ['sequenceAccuracy', 'synesthesiaBenefit', 'capacity']
  },
  
  'memory-game': {
    domains: {
      longTermMemory: { weight: 0.80, constructs: ['spatialMemory', 'recall'] },
      workingMemory: { weight: 0.70, constructs: ['visuospatial'] },
      attention: { weight: 0.50, constructs: ['sustained'] }
    },
    metrics: ['spanLength', 'recallAccuracy', 'learningCurve']
  }
};
```

### Score Normalization (000-999)

The system uses an inverted percentile-based scoring system where:
- **000-333**: Elite performance (top third)
- **334-666**: Average performance (middle third)
- **667-999**: Developing (bottom third)

```javascript
function normalizeScore(rawMetrics, domain, gameId) {
  const mapping = GAME_MAPPINGS[gameId].domains[domain];
  if (!mapping) return 500; // Default to average
  
  // Calculate weighted performance from raw metrics
  let performance = 0;
  
  // Example for Working Memory:
  // - N-back level: 40% weight
  // - Accuracy: 30% weight
  // - d-prime: 20% weight
  // - Capacity (K): 10% weight
  
  if (rawMetrics.level) {
    performance += (rawMetrics.level / 10) * 0.40;
  }
  if (rawMetrics.accuracy) {
    performance += rawMetrics.accuracy * 0.30;
  }
  if (rawMetrics.dPrime) {
    performance += (rawMetrics.dPrime / 4.0) * 0.20;
  }
  if (rawMetrics.capacity) {
    performance += (rawMetrics.capacity / 7.0) * 0.10;
  }
  
  // Convert to percentile (0-1 range)
  const percentile = performance;
  
  // Invert and scale to 000-999
  // Lower score = better performance
  const score = Math.round((1 - percentile) * 999);
  
  return Math.max(0, Math.min(999, score));
}
```

## Scientific Metric Calculations

### Signal Detection Theory


```javascript
function calculateDPrime(hits, misses, falseAlarms, correctRejections) {
  const hitRate = hits / (hits + misses);
  const faRate = falseAlarms / (falseAlarms + correctRejections);
  
  // Avoid extreme values (0 or 1)
  const adjustedHitRate = Math.max(0.01, Math.min(0.99, hitRate));
  const adjustedFARate = Math.max(0.01, Math.min(0.99, faRate));
  
  // Z-score transformation
  const zHit = inverseNormalCDF(adjustedHitRate);
  const zFA = inverseNormalCDF(adjustedFARate);
  
  // d' = Z(hit rate) - Z(false alarm rate)
  const dPrime = zHit - zFA;
  
  return dPrime;
}

function calculateCriterion(hits, misses, falseAlarms, correctRejections) {
  const hitRate = hits / (hits + misses);
  const faRate = falseAlarms / (falseAlarms + correctRejections);
  
  const adjustedHitRate = Math.max(0.01, Math.min(0.99, hitRate));
  const adjustedFARate = Math.max(0.01, Math.min(0.99, faRate));
  
  const zHit = inverseNormalCDF(adjustedHitRate);
  const zFA = inverseNormalCDF(adjustedFARate);
  
  // c = -0.5 × [Z(hit rate) + Z(false alarm rate)]
  const criterion = -0.5 * (zHit + zFA);
  
  return criterion;
}
```

### Working Memory Capacity

```javascript
function calculateCapacity(setSize, accuracy) {
  // Cowan's K formula
  // K = N × (accuracy - 0.5) / 0.5
  // where N is set size and accuracy is proportion correct
  
  const k = setSize * ((accuracy - 0.5) / 0.5);
  
  // Capacity typically ranges from 0 to 7 items
  return Math.max(0, Math.min(7, k));
}
```

### Processing Speed

```javascript
function calculateProcessingSpeed(reactionTimes) {
  // Remove outliers (< 200ms or > mean + 3SD)
  const mean = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
  const sd = Math.sqrt(
    reactionTimes.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / reactionTimes.length
  );
  
  const validRTs = reactionTimes.filter(rt => 
    rt >= 200 && rt <= mean + 3 * sd
  );
  
  const meanRT = validRTs.reduce((a, b) => a + b) / validRTs.length;
  
  return {
    meanRT,
    medianRT: median(validRTs),
    sd,
    validCount: validRTs.length
  };
}
```

## Trend Analysis

### Statistical Regression

```javascript
function calculateTrend(dataPoints, timeWindow = 30) {
  // dataPoints: [{timestamp, score}, ...]
  // Filter to time window (last N days)
  const cutoff = Date.now() - (timeWindow * 24 * 60 * 60 * 1000);
  const recent = dataPoints.filter(p => p.timestamp >= cutoff);
  
  if (recent.length < 3) {
    return { trend: 'insufficient_data', confidence: 0 };
  }
  
  // Linear regression: y = mx + b
  const n = recent.length;
  const x = recent.map((_, i) => i); // Time index
  const y = recent.map(p => p.score);
  
  const sumX = x.reduce((a, b) => a + b);
  const sumY = y.reduce((a, b) => a + b);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // R² (coefficient of determination)
  const yMean = sumY / n;
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const ssResidual = y.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(yi - predicted, 2);
  }, 0);
  const rSquared = 1 - (ssResidual / ssTotal);
  
  // Determine trend direction
  // Remember: lower score = better, so negative slope = improvement
  let trend = 'stable';
  if (slope < -2) trend = 'improving';
  if (slope > 2) trend = 'declining';
  
  return {
    trend,
    slope,
    intercept,
    rSquared,
    equation: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
    confidence: rSquared
  };
}
```

## Progression System

### Tier Calculation


```javascript
const TIERS = [
  {
    name: 'Beginner',
    minTime: 0,
    maxCognitiveScore: 999,
    description: 'Starting your cognitive training journey'
  },
  {
    name: 'Intermediate',
    minTime: 10 * 3600, // 10 hours
    maxCognitiveScore: 600,
    description: 'Building cognitive foundations'
  },
  {
    name: 'Advanced',
    minTime: 30 * 3600, // 30 hours
    maxCognitiveScore: 450,
    description: 'Developing strong cognitive abilities'
  },
  {
    name: 'Expert',
    minTime: 50 * 3600, // 50 hours
    maxCognitiveScore: 350,
    description: 'Exceptional cognitive performance'
  },
  {
    name: 'Master',
    minTime: 100 * 3600, // 100 hours
    maxCognitiveScore: 250,
    description: 'Elite cognitive mastery'
  }
];

function calculateTier(profile) {
  const totalTime = profile.progression.totalTime;
  
  // Calculate overall cognitive score (average of all domains)
  const domains = Object.values(profile.cognitiveProfile);
  const avgScore = domains.reduce((sum, d) => sum + d.score, 0) / domains.length;
  
  // Find highest tier that user qualifies for
  // Must meet BOTH time AND cognitive requirements
  for (let i = TIERS.length - 1; i >= 0; i--) {
    const tier = TIERS[i];
    if (totalTime >= tier.minTime && avgScore <= tier.maxCognitiveScore) {
      return tier.name;
    }
  }
  
  return 'Beginner';
}
```

### Achievement System

```javascript
const ACHIEVEMENTS = [
  // Cognitive Milestones
  {
    id: 'wm-elite',
    name: 'Working Memory Elite',
    description: 'Achieve Working Memory score ≤ 250',
    category: 'cognitive',
    requirement: {
      type: 'cognitiveScore',
      domain: 'workingMemory',
      value: 250,
      operator: '<='
    }
  },
  {
    id: 'attention-master',
    name: 'Attention Master',
    description: 'Achieve Attention score ≤ 200',
    category: 'cognitive',
    requirement: {
      type: 'cognitiveScore',
      domain: 'attention',
      value: 200,
      operator: '<='
    }
  },
  
  // Time-based
  {
    id: 'dedicated-trainer',
    name: 'Dedicated Trainer',
    description: 'Complete 50 hours of training',
    category: 'time',
    requirement: {
      type: 'totalTime',
      value: 50 * 3600,
      operator: '>='
    }
  },
  
  // Consistency
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 30-day training streak',
    category: 'consistency',
    requirement: {
      type: 'streak',
      value: 30,
      operator: '>='
    }
  },
  
  // Milestones
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Complete 100 training sessions',
    category: 'milestone',
    requirement: {
      type: 'sessions',
      value: 100,
      operator: '>='
    }
  }
];

function checkAchievements(profile) {
  const unlocked = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (achievement.unlockedAt) continue; // Already unlocked
    
    const req = achievement.requirement;
    let qualified = false;
    
    switch (req.type) {
      case 'cognitiveScore':
        const score = profile.cognitiveProfile[req.domain].score;
        qualified = evaluateOperator(score, req.operator, req.value);
        break;
        
      case 'totalTime':
        qualified = evaluateOperator(profile.progression.totalTime, req.operator, req.value);
        break;
        
      case 'streak':
        qualified = evaluateOperator(profile.progression.currentStreak, req.operator, req.value);
        break;
        
      case 'sessions':
        qualified = evaluateOperator(profile.progression.totalSessions, req.operator, req.value);
        break;
    }
    
    if (qualified) {
      achievement.unlockedAt = Date.now();
      unlocked.push(achievement);
    }
  }
  
  return unlocked;
}
```

### Streak Management

```javascript
function updateStreak(profile) {
  const now = new Date();
  const lastTraining = profile.progression.lastTrainingDate 
    ? new Date(profile.progression.lastTrainingDate) 
    : null;
  
  if (!lastTraining) {
    // First session
    profile.progression.currentStreak = 1;
    profile.progression.lastTrainingDate = now.toISOString().split('T')[0];
    return;
  }
  
  const daysSinceLastTraining = Math.floor(
    (now - lastTraining) / (24 * 60 * 60 * 1000)
  );
  
  if (daysSinceLastTraining === 0) {
    // Same day, no change
    return;
  } else if (daysSinceLastTraining === 1) {
    // Consecutive day, increment streak
    profile.progression.currentStreak++;
    if (profile.progression.currentStreak > profile.progression.longestStreak) {
      profile.progression.longestStreak = profile.progression.currentStreak;
    }
  } else {
    // Streak broken
    profile.progression.currentStreak = 1;
  }
  
  profile.progression.lastTrainingDate = now.toISOString().split('T')[0];
}
```

## UI Components

### Formula Transparency Modal


```javascript
function showFormulaModal(domain, profile) {
  const domainData = profile.cognitiveProfile[domain];
  const sessions = getSessionsForDomain(profile.id, domain);
  
  const modal = {
    title: `${formatDomainName(domain)} Score: ${domainData.score}`,
    sections: [
      {
        title: 'Percentile Score',
        content: `This score means you perform better than ${(1 - domainData.score/999) * 100}% of users (lower score = better performance)`
      },
      {
        title: 'Raw Cognitive Metrics',
        content: formatRawMetrics(sessions)
      },
      {
        title: 'Percentile Calculation',
        content: formatCalculation(domain, sessions)
      },
      {
        title: 'Contributing Games',
        content: formatGameContributions(domain, sessions)
      },
      {
        title: 'Trend (30 days)',
        content: formatTrend(domain, sessions)
      },
      {
        title: 'References',
        content: getScientificReferences(domain)
      }
    ],
    actions: [
      { label: 'View Raw Data', action: () => showRawData(domain) },
      { label: 'Export This Domain', action: () => exportDomain(domain) }
    ]
  };
  
  return modal;
}
```

### Cognitive Profile Radar Chart

```javascript
function renderCognitiveProfile(profile) {
  const domains = [
    'Working Memory',
    'Attention',
    'Processing Speed',
    'Executive Functions',
    'Perceptual Processing',
    'Long-Term Memory'
  ];
  
  const scores = [
    profile.cognitiveProfile.workingMemory.score,
    profile.cognitiveProfile.attention.score,
    profile.cognitiveProfile.processingSpeed.score,
    profile.cognitiveProfile.executiveFunctions.score,
    profile.cognitiveProfile.perceptualProcessing.score,
    profile.cognitiveProfile.longTermMemory.score
  ];
  
  // Invert for visualization (so better performance shows as larger)
  const invertedScores = scores.map(s => 999 - s);
  
  return {
    type: 'radar',
    data: {
      labels: domains,
      datasets: [{
        label: 'Cognitive Profile',
        data: invertedScores,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      }]
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: 999,
          ticks: {
            stepSize: 200
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const domainKey = Object.keys(profile.cognitiveProfile)[index];
          showFormulaModal(domainKey, profile);
        }
      }
    }
  };
}
```

### Trend Visualization

```javascript
function renderTrendGraph(domain, sessions) {
  const dataPoints = sessions
    .sort((a, b) => a.startTime - b.startTime)
    .map(s => ({
      x: new Date(s.startTime),
      y: s.cognitiveContributions[domain].normalizedScore
    }));
  
  const trend = calculateTrend(dataPoints);
  
  return {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Score',
          data: dataPoints,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        },
        {
          label: 'Trend Line',
          data: dataPoints.map((p, i) => ({
            x: p.x,
            y: trend.slope * i + trend.intercept
          })),
          borderColor: 'rgba(255, 99, 132, 1)',
          borderDash: [5, 5],
          fill: false
        }
      ]
    },
    options: {
      scales: {
        y: {
          reverse: true, // Inverted Y-axis (000 at top, 999 at bottom)
          min: 0,
          max: 999,
          title: {
            display: true,
            text: 'Score (lower = better)'
          }
        },
        x: {
          type: 'time',
          time: {
            unit: 'day'
          }
        }
      },
      plugins: {
        annotation: {
          annotations: {
            trendInfo: {
              type: 'label',
              content: [
                `Trend: ${trend.trend}`,
                `Rate: ${trend.slope.toFixed(2)} pts/session`,
                `R² = ${trend.rSquared.toFixed(2)}`
              ],
              position: 'top'
            }
          }
        }
      }
    }
  };
}
```

## Data Storage (IndexedDB)

### Database Schema


```javascript
const DB_NAME = 'CognitiveProgressionDB';
const DB_VERSION = 1;

const STORES = {
  profiles: {
    keyPath: 'id',
    indexes: [
      { name: 'name', keyPath: 'name', unique: false },
      { name: 'lastActive', keyPath: 'lastActive', unique: false }
    ]
  },
  
  sessions: {
    keyPath: 'id',
    indexes: [
      { name: 'profileId', keyPath: 'profileId', unique: false },
      { name: 'gameId', keyPath: 'gameId', unique: false },
      { name: 'startTime', keyPath: 'startTime', unique: false },
      { name: 'profileGame', keyPath: ['profileId', 'gameId'], unique: false }
    ]
  },
  
  achievements: {
    keyPath: 'id',
    indexes: [
      { name: 'category', keyPath: 'category', unique: false },
      { name: 'unlockedAt', keyPath: 'unlockedAt', unique: false }
    ]
  }
};

async function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores
      for (const [storeName, config] of Object.entries(STORES)) {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: config.keyPath });
          
          // Create indexes
          for (const index of config.indexes) {
            store.createIndex(index.name, index.keyPath, { unique: index.unique });
          }
        }
      }
    };
  });
}
```

### Data Access Layer

```javascript
class CognitiveDataStore {
  constructor() {
    this.db = null;
  }
  
  async init() {
    this.db = await initDatabase();
  }
  
  // Profile operations
  async createProfile(name) {
    const profile = {
      id: generateUUID(),
      name,
      createdAt: Date.now(),
      lastActive: Date.now(),
      cognitiveProfile: {
        workingMemory: { score: 500, confidence: 0, sessions: 0, lastUpdated: Date.now() },
        attention: { score: 500, confidence: 0, sessions: 0, lastUpdated: Date.now() },
        processingSpeed: { score: 500, confidence: 0, sessions: 0, lastUpdated: Date.now() },
        executiveFunctions: { score: 500, confidence: 0, sessions: 0, lastUpdated: Date.now() },
        perceptualProcessing: { score: 500, confidence: 0, sessions: 0, lastUpdated: Date.now() },
        longTermMemory: { score: 500, confidence: 0, sessions: 0, lastUpdated: Date.now() }
      },
      progression: {
        tier: 'Beginner',
        totalTime: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastTrainingDate: null,
        achievements: []
      },
      stats: {
        byGame: {},
        byDomain: {},
        trends: {}
      }
    };
    
    await this.put('profiles', profile);
    return profile;
  }
  
  async getProfile(id) {
    return this.get('profiles', id);
  }
  
  async updateProfile(profile) {
    profile.lastActive = Date.now();
    await this.put('profiles', profile);
  }
  
  // Session operations
  async createSession(sessionData) {
    const session = {
      id: generateUUID(),
      ...sessionData,
      startTime: Date.now()
    };
    
    await this.put('sessions', session);
    return session;
  }
  
  async endSession(sessionId, endData) {
    const session = await this.get('sessions', sessionId);
    session.endTime = Date.now();
    session.duration = session.endTime - session.startTime;
    Object.assign(session, endData);
    
    await this.put('sessions', session);
    return session;
  }
  
  async getSessionsByProfile(profileId) {
    return this.getAllFromIndex('sessions', 'profileId', profileId);
  }
  
  async getSessionsByGame(profileId, gameId) {
    return this.getAllFromIndex('sessions', 'profileGame', [profileId, gameId]);
  }
  
  // Generic operations
  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async put(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getAllFromIndex(storeName, indexName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
```

## Integration with Unified Core

### Message Protocol


```javascript
// Game → Unified Core messages
const GAME_MESSAGES = {
  SESSION_START: {
    type: 'session:start',
    payload: {
      gameId: 'string',
      profileId: 'string'
    }
  },
  
  SESSION_END: {
    type: 'session:end',
    payload: {
      sessionId: 'string',
      gameMetrics: {
        level: 'number',
        accuracy: 'number',
        reactionTime: 'number',
        // ... game-specific metrics
      }
    }
  },
  
  SESSION_UPDATE: {
    type: 'session:update',
    payload: {
      sessionId: 'string',
      currentMetrics: {}
    }
  }
};

// Unified Core → Game messages
const CORE_MESSAGES = {
  SESSION_CREATED: {
    type: 'session:created',
    payload: {
      sessionId: 'string'
    }
  },
  
  PROFILE_UPDATE: {
    type: 'profile:update',
    payload: {
      cognitiveProfile: {},
      progression: {}
    }
  },
  
  ACHIEVEMENT_UNLOCKED: {
    type: 'achievement:unlocked',
    payload: {
      achievement: {}
    }
  }
};
```

### Event Handlers

```javascript
class CognitiveProgressionSystem {
  constructor(dataStore) {
    this.dataStore = dataStore;
    this.activeSession = null;
    this.currentProfile = null;
  }
  
  async handleSessionStart(gameId, profileId) {
    // Load profile
    this.currentProfile = await this.dataStore.getProfile(profileId);
    
    // Create session
    this.activeSession = await this.dataStore.createSession({
      profileId,
      gameId,
      gameMetrics: {},
      cognitiveContributions: {},
      scientificMetrics: {}
    });
    
    // Update streak
    updateStreak(this.currentProfile);
    await this.dataStore.updateProfile(this.currentProfile);
    
    return this.activeSession.id;
  }
  
  async handleSessionEnd(sessionId, gameMetrics) {
    // Get session
    const session = await this.dataStore.get('sessions', sessionId);
    
    // Calculate cognitive contributions
    const cognitiveContributions = this.calculateCognitiveContributions(
      session.gameId,
      gameMetrics
    );
    
    // Calculate scientific metrics
    const scientificMetrics = this.calculateScientificMetrics(
      session.gameId,
      gameMetrics
    );
    
    // End session
    await this.dataStore.endSession(sessionId, {
      gameMetrics,
      cognitiveContributions,
      scientificMetrics
    });
    
    // Update profile
    await this.updateCognitiveProfile(session.profileId, cognitiveContributions);
    
    // Update progression
    await this.updateProgression(session.profileId, session.duration);
    
    // Check achievements
    const unlockedAchievements = await this.checkAchievements(session.profileId);
    
    // Notify UI
    this.notifyProfileUpdate();
    
    if (unlockedAchievements.length > 0) {
      this.notifyAchievements(unlockedAchievements);
    }
    
    this.activeSession = null;
  }
  
  calculateCognitiveContributions(gameId, gameMetrics) {
    const mapping = GAME_MAPPINGS[gameId];
    const contributions = {};
    
    for (const [domain, config] of Object.entries(mapping.domains)) {
      const rawScore = this.calculateRawScore(gameMetrics, domain);
      const normalizedScore = normalizeScore(gameMetrics, domain, gameId);
      
      contributions[domain] = {
        weight: config.weight,
        rawScore,
        normalizedScore
      };
    }
    
    return contributions;
  }
  
  calculateScientificMetrics(gameId, gameMetrics) {
    const metrics = {};
    
    // Signal detection theory
    if (gameMetrics.hits !== undefined) {
      metrics.dPrime = calculateDPrime(
        gameMetrics.hits,
        gameMetrics.misses,
        gameMetrics.falseAlarms,
        gameMetrics.correctRejections
      );
      metrics.criterion = calculateCriterion(
        gameMetrics.hits,
        gameMetrics.misses,
        gameMetrics.falseAlarms,
        gameMetrics.correctRejections
      );
    }
    
    // Working memory capacity
    if (gameMetrics.setSize && gameMetrics.accuracy) {
      metrics.capacity = calculateCapacity(gameMetrics.setSize, gameMetrics.accuracy);
    }
    
    // Processing speed
    if (gameMetrics.reactionTimes) {
      metrics.processingSpeed = calculateProcessingSpeed(gameMetrics.reactionTimes);
    }
    
    return metrics;
  }
  
  async updateCognitiveProfile(profileId, contributions) {
    const profile = await this.dataStore.getProfile(profileId);
    
    for (const [domain, contribution] of Object.entries(contributions)) {
      const domainData = profile.cognitiveProfile[domain];
      
      // Weighted moving average
      const weight = contribution.weight;
      const newScore = contribution.normalizedScore;
      const oldScore = domainData.score;
      const sessions = domainData.sessions;
      
      // More sessions = more stable score (slower to change)
      const alpha = Math.min(0.3, 1 / (sessions + 1));
      domainData.score = Math.round(oldScore * (1 - alpha) + newScore * alpha);
      
      domainData.sessions++;
      domainData.lastUpdated = Date.now();
      
      // Update confidence (more sessions = higher confidence)
      domainData.confidence = Math.min(1, sessions / 20);
    }
    
    await this.dataStore.updateProfile(profile);
    this.currentProfile = profile;
  }
  
  async updateProgression(profileId, duration) {
    const profile = await this.dataStore.getProfile(profileId);
    
    profile.progression.totalTime += duration / 1000; // Convert to seconds
    profile.progression.totalSessions++;
    
    // Recalculate tier
    profile.progression.tier = calculateTier(profile);
    
    await this.dataStore.updateProfile(profile);
    this.currentProfile = profile;
  }
  
  async checkAchievements(profileId) {
    const profile = await this.dataStore.getProfile(profileId);
    const unlocked = checkAchievements(profile);
    
    if (unlocked.length > 0) {
      profile.progression.achievements.push(...unlocked.map(a => a.id));
      await this.dataStore.updateProfile(profile);
    }
    
    return unlocked;
  }
  
  notifyProfileUpdate() {
    window.postMessage({
      type: 'profile:update',
      payload: {
        cognitiveProfile: this.currentProfile.cognitiveProfile,
        progression: this.currentProfile.progression
      }
    }, '*');
  }
  
  notifyAchievements(achievements) {
    for (const achievement of achievements) {
      window.postMessage({
        type: 'achievement:unlocked',
        payload: { achievement }
      }, '*');
    }
  }
}
```

## Performance Optimization

### Caching Strategy


```javascript
class CognitiveCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  clear() {
    this.cache.clear();
  }
}

// Usage
const cache = new CognitiveCache();

async function getCognitiveProfile(profileId) {
  const cacheKey = `profile:${profileId}`;
  let profile = cache.get(cacheKey);
  
  if (!profile) {
    profile = await dataStore.getProfile(profileId);
    cache.set(cacheKey, profile);
  }
  
  return profile;
}

function invalidateProfileCache(profileId) {
  cache.invalidate(`profile:${profileId}`);
}
```

### Batch Operations

```javascript
class BatchProcessor {
  constructor(dataStore) {
    this.dataStore = dataStore;
    this.queue = [];
    this.processing = false;
    this.batchSize = 10;
    this.batchDelay = 100; // ms
  }
  
  async add(operation) {
    this.queue.push(operation);
    
    if (!this.processing) {
      this.processing = true;
      setTimeout(() => this.process(), this.batchDelay);
    }
  }
  
  async process() {
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      
      // Process batch in parallel
      await Promise.all(batch.map(op => op()));
    }
    
    this.processing = false;
  }
}
```

## Error Handling

```javascript
class CognitiveError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CognitiveError';
    this.code = code;
    this.details = details;
  }
}

const ERROR_CODES = {
  DB_INIT_FAILED: 'DB_INIT_FAILED',
  PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  INVALID_GAME_DATA: 'INVALID_GAME_DATA',
  CALCULATION_ERROR: 'CALCULATION_ERROR'
};

function handleError(error) {
  console.error('Cognitive System Error:', error);
  
  // Log to analytics (if available)
  if (window.analytics) {
    window.analytics.track('error', {
      code: error.code,
      message: error.message,
      details: error.details
    });
  }
  
  // Show user-friendly message
  showNotification({
    type: 'error',
    message: getUserFriendlyMessage(error.code),
    duration: 5000
  });
}

function getUserFriendlyMessage(code) {
  const messages = {
    [ERROR_CODES.DB_INIT_FAILED]: 'Failed to initialize database. Please refresh the page.',
    [ERROR_CODES.PROFILE_NOT_FOUND]: 'Profile not found. Please create a new profile.',
    [ERROR_CODES.SESSION_NOT_FOUND]: 'Session not found. Please start a new session.',
    [ERROR_CODES.INVALID_GAME_DATA]: 'Invalid game data received. Please try again.',
    [ERROR_CODES.CALCULATION_ERROR]: 'Error calculating cognitive metrics. Data has been saved.'
  };
  
  return messages[code] || 'An unexpected error occurred.';
}
```

## Testing Strategy

### Unit Tests

```javascript
describe('Cognitive Mapping Engine', () => {
  test('normalizeScore returns value between 0-999', () => {
    const rawMetrics = { level: 5, accuracy: 0.85, dPrime: 2.1, capacity: 4.2 };
    const score = normalizeScore(rawMetrics, 'workingMemory', '3d-hyper-nback');
    
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(999);
  });
  
  test('calculateDPrime handles edge cases', () => {
    // Perfect performance
    expect(calculateDPrime(10, 0, 0, 10)).toBeGreaterThan(3);
    
    // Chance performance
    expect(calculateDPrime(5, 5, 5, 5)).toBeCloseTo(0, 1);
  });
  
  test('calculateCapacity follows Cowan formula', () => {
    const k = calculateCapacity(4, 0.75);
    expect(k).toBeCloseTo(2, 1);
  });
});

describe('Tier Calculation', () => {
  test('requires both time and cognitive score', () => {
    const profile = {
      progression: { totalTime: 100 * 3600 },
      cognitiveProfile: {
        workingMemory: { score: 200 },
        attention: { score: 200 },
        processingSpeed: { score: 200 },
        executiveFunctions: { score: 200 },
        perceptualProcessing: { score: 200 },
        longTermMemory: { score: 200 }
      }
    };
    
    expect(calculateTier(profile)).toBe('Master');
  });
});
```

### Integration Tests

```javascript
describe('Session Flow', () => {
  test('complete session updates profile correctly', async () => {
    const system = new CognitiveProgressionSystem(dataStore);
    
    // Start session
    const sessionId = await system.handleSessionStart('3d-hyper-nback', profileId);
    
    // End session with metrics
    await system.handleSessionEnd(sessionId, {
      level: 5,
      accuracy: 0.85,
      hits: 17,
      misses: 3,
      falseAlarms: 2,
      correctRejections: 18
    });
    
    // Verify profile updated
    const profile = await dataStore.getProfile(profileId);
    expect(profile.cognitiveProfile.workingMemory.sessions).toBe(1);
    expect(profile.progression.totalSessions).toBe(1);
  });
});
```

## Accessibility

### Keyboard Navigation

```javascript
// All interactive elements must be keyboard accessible
const keyboardHandlers = {
  'Escape': () => closeModal(),
  'Tab': (e) => handleTabNavigation(e),
  'Enter': (e) => activateElement(e.target),
  'Space': (e) => activateElement(e.target),
  'ArrowUp': () => navigateUp(),
  'ArrowDown': () => navigateDown()
};

document.addEventListener('keydown', (e) => {
  const handler = keyboardHandlers[e.key];
  if (handler) {
    handler(e);
  }
});
```

### ARIA Labels

```html
<!-- Cognitive score with full context -->
<div 
  role="button"
  tabindex="0"
  aria-label="Working Memory score: 285. Click to view calculation details."
  onclick="showFormulaModal('workingMemory')"
>
  <span aria-hidden="true">285</span>
</div>

<!-- Trend graph -->
<canvas 
  role="img"
  aria-label="Working Memory trend graph showing improvement from 450 to 285 over 30 days"
>
</canvas>

<!-- Achievement -->
<div 
  role="status"
  aria-live="polite"
  aria-label="Achievement unlocked: Working Memory Elite"
>
  🏆 Working Memory Elite
</div>
```

## Security Considerations

### Data Validation


```javascript
function validateGameMetrics(gameId, metrics) {
  const schema = GAME_SCHEMAS[gameId];
  if (!schema) {
    throw new CognitiveError(
      ERROR_CODES.INVALID_GAME_DATA,
      `Unknown game: ${gameId}`
    );
  }
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = metrics[field];
    
    // Required field
    if (rules.required && value === undefined) {
      throw new CognitiveError(
        ERROR_CODES.INVALID_GAME_DATA,
        `Missing required field: ${field}`
      );
    }
    
    // Type check
    if (value !== undefined && typeof value !== rules.type) {
      throw new CognitiveError(
        ERROR_CODES.INVALID_GAME_DATA,
        `Invalid type for ${field}: expected ${rules.type}, got ${typeof value}`
      );
    }
    
    // Range check
    if (rules.min !== undefined && value < rules.min) {
      throw new CognitiveError(
        ERROR_CODES.INVALID_GAME_DATA,
        `Value for ${field} below minimum: ${value} < ${rules.min}`
      );
    }
    
    if (rules.max !== undefined && value > rules.max) {
      throw new CognitiveError(
        ERROR_CODES.INVALID_GAME_DATA,
        `Value for ${field} above maximum: ${value} > ${rules.max}`
      );
    }
  }
  
  return true;
}

const GAME_SCHEMAS = {
  '3d-hyper-nback': {
    level: { type: 'number', required: true, min: 1, max: 10 },
    accuracy: { type: 'number', required: true, min: 0, max: 1 },
    hits: { type: 'number', required: true, min: 0 },
    misses: { type: 'number', required: true, min: 0 },
    falseAlarms: { type: 'number', required: true, min: 0 },
    correctRejections: { type: 'number', required: true, min: 0 }
  }
  // ... other games
};
```

### Message Validation

```javascript
function validateMessage(message) {
  // Check origin (if needed)
  // if (message.origin !== window.location.origin) return false;
  
  // Check structure
  if (!message.data || typeof message.data !== 'object') return false;
  if (!message.data.type || typeof message.data.type !== 'string') return false;
  
  // Check payload
  const validTypes = Object.values(GAME_MESSAGES).map(m => m.type);
  if (!validTypes.includes(message.data.type)) return false;
  
  return true;
}

window.addEventListener('message', (event) => {
  if (!validateMessage(event)) {
    console.warn('Invalid message received:', event);
    return;
  }
  
  handleMessage(event.data);
});
```

## Export/Import

### Data Export

```javascript
async function exportCognitiveData(profileId, format = 'json') {
  const profile = await dataStore.getProfile(profileId);
  const sessions = await dataStore.getSessionsByProfile(profileId);
  
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    profile,
    sessions,
    gameMappings: GAME_MAPPINGS,
    achievements: ACHIEVEMENTS
  };
  
  if (format === 'json') {
    return JSON.stringify(exportData, null, 2);
  } else if (format === 'csv') {
    return convertToCSV(exportData);
  }
}

function convertToCSV(data) {
  const rows = [];
  
  // Header
  rows.push([
    'Date',
    'Game',
    'Duration (min)',
    'WM Score',
    'Attention Score',
    'Processing Speed',
    'Executive Functions',
    'Perceptual Processing',
    'LTM Score'
  ].join(','));
  
  // Sessions
  for (const session of data.sessions) {
    const date = new Date(session.startTime).toISOString().split('T')[0];
    const game = session.gameId;
    const duration = (session.duration / 60000).toFixed(1);
    
    const scores = [
      session.cognitiveContributions.workingMemory?.normalizedScore || '',
      session.cognitiveContributions.attention?.normalizedScore || '',
      session.cognitiveContributions.processingSpeed?.normalizedScore || '',
      session.cognitiveContributions.executiveFunctions?.normalizedScore || '',
      session.cognitiveContributions.perceptualProcessing?.normalizedScore || '',
      session.cognitiveContributions.longTermMemory?.normalizedScore || ''
    ];
    
    rows.push([date, game, duration, ...scores].join(','));
  }
  
  return rows.join('\n');
}

function downloadExport(data, filename, format) {
  const blob = new Blob([data], { 
    type: format === 'json' ? 'application/json' : 'text/csv' 
  });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}
```

### Data Import

```javascript
async function importCognitiveData(fileContent, format = 'json') {
  let data;
  
  if (format === 'json') {
    data = JSON.parse(fileContent);
  } else {
    throw new Error('CSV import not yet implemented');
  }
  
  // Validate version
  if (data.version !== '1.0') {
    throw new CognitiveError(
      ERROR_CODES.INVALID_IMPORT,
      `Unsupported data version: ${data.version}`
    );
  }
  
  // Import profile
  await dataStore.put('profiles', data.profile);
  
  // Import sessions
  for (const session of data.sessions) {
    await dataStore.put('sessions', session);
  }
  
  return data.profile.id;
}
```

## Summary

This design provides:

1. **Scientific Foundation**: Validated cognitive metrics with transparent calculations
2. **Motivational Features**: Achievements, tiers, and streaks based on cognitive + time
3. **Data Transparency**: Every score clickable to show formulas and raw data
4. **Performance**: Caching, batching, and optimized IndexedDB queries
5. **Accessibility**: Full keyboard navigation and ARIA labels
6. **Privacy**: All data stored locally, no external transmission
7. **Extensibility**: Easy to add new games with cognitive mappings
8. **Integration**: Clean message protocol with unified core

The system combines the best of cognitive science (validated metrics, transparent calculations) with user engagement (achievements, progression, visualization) to create a unique brain training platform.

