# Simplified Approach: Pure Data-Driven System

## Philosophy

**Pure cognitive science with complete transparency.**

The system:
1. **Measures** cognitive performance using validated scientific methods
2. **Displays** all data and calculations openly
3. **Reveals** the formulas behind every metric
4. **Tracks** improvement with statistical rigor

## Core Features

### ✅ Cognitive Domain Mapping
Every game mapped to specific cognitive constructs with scientific precision.

**Example: 3D Hyper N-Back**
```
Working Memory (Primary, 90% weight)
├── Visuospatial WM (Position, Walls, Camera, Face, Rotation)
├── Verbal WM (Word stimulus)
└── Auditory WM (Sound stimulus)

Attention (Secondary, 60% weight)
├── Selective Attention (Lure resistance)
└── Sustained Attention (Performance over time)

Executive Functions (Tertiary, 50% weight)
└── Interference Control (Lure trials)
```

### ✅ 000-999 Scoring System
Lower scores = better performance (like golf, reaction times, error rates)

**Score Interpretation**:
- 000-333: Elite performance (top third)
- 334-666: Average performance (middle third)
- 667-999: Developing (bottom third)

**Why this scale?**
- Aligns with cognitive science conventions
- Represents "cognitive efficiency"
- Granular enough for meaningful tracking
- Easy to understand percentiles

### ✅ Scientific Metric Calculations
All metrics calculated using validated formulas.

**Signal Detection Theory**:
```
d' = Z(hit rate) - Z(false alarm rate)
c = -0.5 × [Z(hit rate) + Z(false alarm rate)]
```

**Working Memory Capacity**:
```
K = N × (accuracy - 0.5) / 0.5
```

**Processing Speed**:
```
Mean RT = Σ(valid RTs) / n
(excluding outliers: RT < 200ms or > mean + 3SD)
```

### ✅ Transparent Formula Display
**Every metric is clickable** to show:
1. The scientific formula
2. The raw data used
3. The calculation steps
4. References to scientific literature

**Example UI**:
```
┌─────────────────────────────────────────┐
│ Working Memory Score: 285               │  ← Click this
│ (32nd percentile - Elite performance)   │
└─────────────────────────────────────────┘
                ↓ (user clicks)
┌─────────────────────────────────────────┐
│ Working Memory Score Calculation        │
│                                         │
│ Formula:                                │
│ score = (1 - normalized_performance) × 999│
│                                         │
│ Raw Data:                               │
│ • N-back level: 5.2                    │
│ • Accuracy: 0.85                       │
│ • d-prime: 2.1                         │
│ • Capacity (K): 4.2 items              │
│                                         │
│ Calculation:                            │
│ 1. Normalize n-level: 5.2/10 = 0.52   │
│ 2. Weight accuracy: 0.85 × 0.3 = 0.255│
│ 3. Weight d-prime: 2.1/4 × 0.2 = 0.105│
│ 4. Combined: 0.715                     │
│ 5. Invert: 1 - 0.715 = 0.285          │
│ 6. Scale: 0.285 × 999 = 285           │
│                                         │
│ References:                             │
│ • Jaeggi et al. (2008) - N-back       │
│ • Green & Swets (1966) - SDT          │
│                                         │
│ [Close]                                 │
└─────────────────────────────────────────┘
```

### ✅ Cognitive Profile Visualization
Radar chart showing performance across all 6 domains.

```
        Working Memory (285)
              /\
             /  \
    Attention  Processing
      (180)      Speed (420)
         \        /
          \      /
           \    /
    Executive  Perceptual
    Functions  Processing
      (350)      (310)
             \  /
              \/
        Long-Term Memory (400)
```

**Each point is clickable** to show:
- Domain definition
- Contributing games
- Calculation formula
- Raw session data

### ✅ Trend Analysis
Statistical analysis of improvement over time.

**Example Display**:
```
Working Memory Trend (Last 30 days)

Score
500 │                    
450 │     ●              
400 │   ●   ●            
350 │ ●       ●          
300 │           ●   ●    
250 │               ● ●  ← Current: 285
    └─────────────────────→ Time

Trend: Improving ↓
Rate: -5 points/week (95% CI: -7 to -3)
Significance: p < 0.01 **
Model: Linear regression
Equation: score = 450 - 5.2×weeks
R² = 0.78

[Click to see full statistical analysis]
```

### ✅ Cross-Game Analytics
See how different games contribute to each cognitive domain.

**Example**:
```
Working Memory Score: 285

Contributing Games:
┌──────────────────────┬──────────┬────────┬────────┐
│ Game                 │ Sessions │ Weight │ Score  │
├──────────────────────┼──────────┼────────┼────────┤
│ 3D Hyper N-Back      │ 45       │ 0.90   │ 270    │
│ Dichotic Dual N-Back │ 30       │ 0.95   │ 280    │
│ Quad Box             │ 25       │ 0.90   │ 295    │
│ Fast Sequence N-Back │ 20       │ 0.85   │ 305    │
└──────────────────────┴──────────┴────────┴────────┘

Weighted Average: 285
Confidence: 0.88 (high)
Data Points: 120 sessions

[Click any game to see detailed contribution]
```

## Interface Design Principles

### Abstract Simplicity
Information density without visual clutter. Every element serves the data.

**Visual Language**:
- Clean typography hierarchy
- Monospace for numbers and formulas
- Generous whitespace
- Subtle grid structure
- Minimal color (data-driven only)

### Information Architecture
```
Primary Layer (Always Visible)
├── Cognitive scores (6 domains, 000-999)
├── Current session data
└── Recent trend indicators

Secondary Layer (Click to Reveal)
├── Calculation formulas
├── Raw data inputs
├── Statistical analysis
└── Scientific references

Tertiary Layer (Deep Dive)
├── Complete session history
├── Cross-game analytics
└── Export functions
```

### Interaction Model
**Progressive Disclosure**: Start simple, reveal complexity on demand.

- **Glance**: See all 6 domain scores at once
- **Click**: Reveal formula and raw data
- **Explore**: Dive into trends and analytics
- **Export**: Take all data with you

### Visual Hierarchy
```
Level 1: Domain Scores (largest, most prominent)
Level 2: Trend indicators (subtle, contextual)
Level 3: Metadata (timestamp, session count)
Level 4: Actions (export, view details)
```

## Interface Layout

### Primary View (Always Visible)
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  Cognitive Profile                    Last: 2024-11-10│
│                                                        │
│     Working Memory          285  ↓ -12  [K=4.2, d'=2.1]  │
│     Attention               180  ↓ -8   [vigilance=0.92] │
│     Processing Speed        420  ↑ +5   [RT=850ms]       │
│     Executive Functions     350  →  0   [switch=320ms]   │
│     Perceptual Processing   310  ↓ -3   [accuracy=88%]   │
│     Long-Term Memory        400  ↓ -6   [span=6.2]       │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │                                                  │ │
│  │         [Radar chart - 6 domains]               │ │
│  │                                                  │ │
│  │         Click any point for details             │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  120 sessions  •  45.2 hours  •  export              │
└────────────────────────────────────────────────────────┘
```

### Expanded View (Click Any Score)
```
┌────────────────────────────────────────────────────────┐
│  Working Memory: 285                              [×] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Percentile Score: 285                                 │
│  ─────────────────────────────────────────────────────│
│  This means you perform better than 71.5% of users    │
│  (lower score = better performance)                   │
│                                                        │
│  Raw Cognitive Metrics                                 │
│  ─────────────────────────────────────────────────────│
│  • N-back level:     5.2                              │
│  • Accuracy:         85%                              │
│  • d-prime (d'):     2.1  (sensitivity)               │
│  • Capacity (K):     4.2 items                        │
│  • Mean RT:          850ms                            │
│  • Criterion (c):    0.15  (response bias)            │
│                                                        │
│  Percentile Calculation                                │
│  ─────────────────────────────────────────────────────│
│  score = percentile_rank(performance, normative_data) │
│                                                        │
│  where performance = weighted average of:             │
│    • N-back level:  5.2/10  × 0.40 = 0.208          │
│    • Accuracy:      0.85    × 0.30 = 0.255          │
│    • d-prime:       2.1/4.0 × 0.20 = 0.105          │
│    • Capacity (K):  4.2/7.0 × 0.10 = 0.060          │
│                                                        │
│  performance = 0.628                                   │
│  percentile = 285 (better than 71.5% of population)  │
│                                                        │
│  Contributing Games                                    │
│  ─────────────────────────────────────────────────────│
│  3D Hyper N-Back      45 sessions  weight: 0.90      │
│  Dichotic Dual N-Back 30 sessions  weight: 0.95      │
│  Quad Box             25 sessions  weight: 0.90      │
│  Fast Sequence N-Back 20 sessions  weight: 0.85      │
│                                                        │
│  Trend (30 days)                                       │
│  ─────────────────────────────────────────────────────│
│  [Sparkline graph]                                     │
│  Rate: -5 pts/week  (95% CI: -7 to -3)               │
│  p < 0.01  R² = 0.78                                  │
│                                                        │
│  References                                            │
│  ─────────────────────────────────────────────────────│
│  • Jaeggi et al. (2008) - Dual n-back training       │
│  • Cowan (2001) - Working memory capacity            │
│  • Green & Swets (1966) - Signal detection theory    │
│                                                        │
│  [View Raw Data] [Export This Domain]                 │
└────────────────────────────────────────────────────────┘
```

### Trend Analysis View
```
┌────────────────────────────────────────────────────────┐
│  Working Memory Trend                             [×] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Score (lower = better)                                │
│  000 │                                                │
│  100 │                                                │
│  200 │                                                │
│  250 │               ● ●  ← 285 (current)            │
│  300 │           ●   ●                                │
│  350 │ ●       ●                                      │
│  400 │   ●   ●                                        │
│  450 │     ●                                          │
│  500 │                                                │
│      └─────────────────────────→ Time (30 days)      │
│                                                        │
│  Statistical Model                                     │
│  ─────────────────────────────────────────────────────│
│  Model: Linear regression                             │
│  Equation: y = 450 - 5.2x                            │
│  R² = 0.78  (good fit)                               │
│  p < 0.01   (highly significant)                     │
│                                                        │
│  Interpretation: Score decreasing 5.2 points per week │
│  (improvement, since lower = better)                  │
│                                                        │
│  Confidence Interval: -7 to -3 pts/week (95%)        │
│                                                        │
│  [View All Data Points] [Export Analysis]             │
└────────────────────────────────────────────────────────┘
```

## Implementation Priorities

### Phase 1: Core Data (Weeks 1-2)
1. IndexedDB schema for cognitive data
2. Session tracking with cognitive metrics
3. Score calculation engine
4. Basic data export

### Phase 2: Cognitive Mapping (Weeks 2-3)
1. Game-to-construct mappings
2. Scientific metric calculations
3. Score normalization (000-999)
4. Formula documentation

### Phase 3: Visualization (Weeks 3-4)
1. Cognitive profile radar chart
2. Trend analysis graphs
3. Session history table
4. Cross-game analytics

### Phase 4: Transparency (Week 4-5)
1. Click-to-expand formula system
2. Raw data display
3. Statistical analysis display
4. Reference documentation

### Phase 5: Polish (Week 5)
1. Responsive design
2. Accessibility
3. Performance optimization
4. Comprehensive testing

## Success Metrics

### Data Quality
- [ ] All formulas documented
- [ ] All calculations validated
- [ ] All raw data accessible
- [ ] All metrics have references

### Transparency
- [ ] Every score is clickable
- [ ] Every formula is visible
- [ ] Every calculation is explained
- [ ] All data is exportable

### Scientific Rigor
- [ ] Metrics match literature
- [ ] Confidence intervals calculated
- [ ] Statistical significance tested
- [ ] Normative data referenced

### User Experience
- [ ] Clean, minimal UI
- [ ] Fast performance
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Works on all devices

## Key Differentiator

**This is the only brain training platform where:**
- Every score shows its formula
- Every calculation is transparent
- No hidden algorithms
- No gamification tricks
- Pure cognitive science

Users can trust the numbers because they can see exactly how they're calculated.

