# Unified Cognitive Progression System

## Overview

The **Unified Cognitive Progression System** combines scientifically-grounded cognitive domain mapping with motivational progression features to create a comprehensive brain training ecosystem. This system tracks not just *how much* you train, but *what cognitive abilities* you're improving and *how effectively* you're training them.

## What Makes This Unique

**Pure data-driven cognitive science. No gamification. Complete transparency.**

This system focuses exclusively on:
1. **Scientific Cognitive Mapping** - Maps each game to specific cognitive domains with validated metrics
2. **Transparent Calculations** - Every score shows its formula and raw data
3. **Statistical Rigor** - Confidence intervals, significance testing, learning curves
4. **Data Accessibility** - Click any metric to see how it's calculated

**Result**: The only brain training platform where you can see and verify every calculation.

## Key Features

### 🧠 Cognitive Domain Tracking
- **6 Primary Domains**: Working Memory, Attention, Processing Speed, Executive Functions, Perceptual Processing, Long-Term Memory
- **30+ Cognitive Constructs**: Specific measurable abilities (e.g., Visuospatial WM, Sustained Attention)
- **Scientific Metrics**: d-prime, capacity estimates, processing speed, learning rates
- **000-999 Scoring**: Inverted scale where lower scores = better performance (like golf or reaction times)

### 📊 Data Visualization
- **Cognitive Profile**: Radar chart showing performance across all 6 domains
- **Trend Analysis**: Track improvement over time with statistical significance
- **Cross-Game Analytics**: See how different games contribute to each cognitive domain
- **Session History**: Complete record of all training sessions with metrics

### 🔬 Scientific Transparency
- **Visible Equations**: Click any metric to see the scientific formula used to calculate it
- **Signal Detection Theory**: d-prime, criterion, hit/false alarm rates with formulas
- **Working Memory Capacity**: Cowan's K, span measurements with calculations
- **Processing Speed**: Reaction time analysis, throughput calculations with formulas
- **Learning Curves**: Statistical trend analysis with confidence intervals and equations
- **Raw Data Access**: View all raw data that feeds into calculations

### 🎯 Motivational Features
- **Progress Bars**: Daily/weekly training time tracking with visual feedback
- **Achievement System**: Unlock achievements based on cognitive milestones + training time
- **Streak Tracking**: Maintain training consistency with daily streak counter

### 🎮 Game-Specific Mapping

Each game is scientifically mapped to cognitive constructs:

**3D Hyper N-Back**
- Primary: Working Memory (90%), Attention (60%), Executive Functions (50%)
- 10 stimulus types each mapped to specific constructs
- Tracks d-prime, lure resistance, per-stimulus accuracy

**Jiggle Factorial 3D**
- Primary: Attention (95%), Perceptual Processing (80%), Working Memory (60%)
- Multiple Object Tracking with factorial complexity
- Tracks capacity (K), tracking accuracy, distractor resistance

**Dichotic Dual N-Back**
- Primary: Working Memory (95%), Attention (70%), Executive Functions (40%)
- Multimodal integration (visual + auditory)
- Tracks dual-task cost, modality-specific performance

**Quad Box**
- Primary: Working Memory (90%), Attention (65%), Perceptual Processing (55%)
- 4 modalities with 3D rotation
- Tracks per-modality accuracy, rotation tolerance

**Fast Sequence N-Back**
- Primary: Working Memory (85%), Perceptual Processing (70%), Executive Functions (55%)
- Synesthetic integration (grapheme-color, spatial-music)
- Tracks sequence memory, synesthesia benefit

**Memory Game (Corsi-like)**
- Primary: Long-Term Memory (80%), Working Memory (70%), Attention (50%)
- Spatial span measurement
- Tracks span length, recall accuracy, learning curves

## Architecture

### Unified Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Trains in Game                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Session Data Collection                         │
│  • Raw metrics (accuracy, RT, level, etc.)                  │
│  • Trial-by-trial data                                      │
│  • Timing information                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           Cognitive Mapping Engine                           │
│  • Maps metrics to cognitive constructs                     │
│  • Calculates scientific metrics (d-prime, K, etc.)        │
│  • Normalizes to 000-999 scale                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Cognitive Scores Update                         │
│  • Updates domain scores (000-999)                          │
│  • Recalculates construct scores                            │
│  • Updates trends and learning curves                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           Progression System Update                          │
│  • Updates progress bars (time-based)                       │
│  • Checks achievements (cognitive + time)                   │
│  • Updates streak tracking                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 User Sees Results                            │
│  • Progress bars update                                     │
│  • Cognitive scores improve (numbers decrease)              │
│  • Achievements unlock                                      │
└─────────────────────────────────────────────────────────────┘
```

## Scoring System: 000-999 (Lower is Better)

### Why Inverted Scoring?

The system uses **lower scores = better performance** because:
- Aligns with cognitive science (reaction times, error rates)
- Represents "cognitive efficiency" rather than arbitrary points
- Intuitive for scientific metrics (faster = lower time = better)

### Score Ranges

- **000-333**: Elite performance (green) - Top tier cognitive ability
- **334-666**: Average performance (yellow) - Typical performance
- **667-999**: Developing (red) - Room for improvement

### Example Scores

- **Working Memory 250**: Elite visuospatial WM (32nd percentile = top 32%)
- **Attention 180**: Exceptional sustained attention (18th percentile = top 18%)
- **Processing Speed 420**: Average speed (58th percentile)

## Implementation Timeline

### Phase 1: Core Infrastructure (Weeks 1-2)
- IndexedDB schema with cognitive data structures
- Session tracking with cognitive mapping
- Basic cognitive metric calculations

### Phase 2: Cognitive Mapping (Weeks 2-3)
- Implement game-to-construct mappings
- Build cognitive mapping engine
- Create score normalization functions
- Implement scientific metric calculations

### Phase 3: UI Components (Weeks 3-4)
- Progress bars (time-based)
- Cognitive profile visualization (radar chart)
- Statistics dashboard with cognitive metrics

### Phase 4: Analytics & Trends (Week 4-5)
- Trend analysis with statistical significance
- Learning curve calculations
- Cross-game cognitive analytics
- Performance prediction algorithms

### Phase 5: Achievements (Week 5)
- Achievement system (cognitive + time-based)
- Unlock animations and celebrations
- Achievement showcase

### Phase 6: Integration & Polish (Week 6)
- Integrate with unified core
- Update games with cognitive metrics
- Responsive design
- Accessibility (WCAG 2.1 AA)
- Performance optimization
- Comprehensive testing

### Phase 7: Launch & Iteration (Week 7)
- Beta testing with real users
- Bug fixes and refinements
- Documentation completion
- Production deployment

**Total Estimated Time**: ~180 hours (4.5 weeks with 2 developers)

## Benefits

### For Users
- **Understand What You're Training**: See exactly which cognitive abilities each game improves
- **Track Real Improvement**: Scientific metrics show actual cognitive gains, not just time spent
- **Complete Transparency**: Click any score to see the exact formula and raw data used
- **Make Informed Decisions**: Choose games based on which cognitive domains you want to improve
- **See the Big Picture**: Cognitive profile shows overall cognitive fitness
- **Trust the Numbers**: All calculations visible and scientifically validated

### For Researchers
- **Validated Metrics**: Signal detection theory, capacity estimates, processing speed
- **Granular Data**: Trial-by-trial data with cognitive construct mapping
- **Statistical Rigor**: Confidence intervals, significance testing, learning curves
- **Export Capability**: Complete data export for external analysis
- **Scientific Mapping**: Documented relationship between games and cognitive constructs

### For the Platform
- **Differentiation**: Only brain training platform with scientific cognitive mapping AND transparent calculations
- **Credibility**: Research-backed approach with visible formulas builds trust
- **Extensibility**: Easy to add new games with cognitive mappings
- **Data-Driven**: Rich analytics inform future development
- **Scientific Integrity**: No hidden algorithms, all calculations open

## Documentation Structure

```
.kiro/specs/unified-cognitive-progression/
├── README.md                    (This file - Overview)
├── requirements.md              (Combined requirements from both specs)
├── design.md                    (Unified architecture and data models)
├── tasks.md                     (Implementation roadmap)
├── COGNITIVE_MAPPING.md         (Detailed game-to-construct mappings)
├── SCIENTIFIC_METRICS.md        (Metric calculation formulas)
├── QUICK_START.md               (Developer integration guide)
└── VISUAL_MOCKUPS.md            (UI mockups with cognitive scores)
```

## Key Design Decisions

### Why Merge These Specs?

**Synergies**:
- Achievements based on cognitive scores (e.g., "Reach WM score of 250")
- Tier progression influenced by cognitive profile (not just time)
- Progress bars show cognitive improvement, not just time
- Analytics show both time AND cognitive gains

**Avoids Duplication**:
- Single data storage system (IndexedDB)
- Single session tracking system
- Single statistics calculation engine
- Single export/import system

### Why 000-999 Scoring?

- **Scientific Alignment**: Matches how cognitive metrics are measured
- **Intuitive**: Lower = better is natural for efficiency metrics
- **Granular**: 1000 levels provide fine-grained tracking
- **Percentile-Compatible**: Easy to convert to percentiles

### Why Local-First?

- **Privacy**: No data leaves the device
- **Performance**: No network latency
- **Offline**: Works without internet
- **Simplicity**: No server infrastructure needed

## Success Metrics

### Technical
- [ ] All tests passing (≥ 80% coverage)
- [ ] Performance benchmarks met (< 16ms UI updates)
- [ ] No breaking changes to existing features
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Cross-browser compatibility

### User Experience
- [ ] Cognitive scores update correctly
- [ ] Progress bars animate smoothly
- [ ] Achievements unlock based on cognitive milestones
- [ ] Tier calculation reflects cognitive profile
- [ ] Data export includes cognitive mappings

### Scientific
- [ ] Metric calculations validated against literature
- [ ] Cognitive mappings reviewed by experts
- [ ] Statistical methods appropriate
- [ ] Confidence intervals calculated correctly
- [ ] Learning curves fit data well

## Next Steps

1. **Review this merged specification** with the team
2. **Finalize cognitive mappings** for each game
3. **Begin Phase 1 implementation** (core infrastructure)
4. **Test cognitive metric calculations** against known data
5. **Iterate based on results**

---

**Building a scientifically rigorous AND motivating cognitive training ecosystem! 🧠✨📊**

For questions or clarifications, please open an issue on GitHub or contact the maintainer.

