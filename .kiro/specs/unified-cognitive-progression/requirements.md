# Unified Cognitive Data System - Requirements

## Introduction

A transparent cognitive performance tracking system that maps brain training games to scientific cognitive domains, calculates validated metrics, and displays all data and formulas openly.

## Glossary

- **Cognitive Domain**: Broad category of mental processes (Working Memory, Attention, Processing Speed, Executive Functions, Perceptual Processing, Long-Term Memory)
- **Cognitive Construct**: Specific measurable ability within a domain (e.g., Visuospatial Working Memory, Sustained Attention)
- **Cognitive Score**: 000-999 metric where lower = better performance
- **System**: The Unified Cognitive Data System
- **User**: Person training with the brain training games
- **Session**: Single training period in one game
- **Formula**: Scientific equation used to calculate a metric

## Requirements

### Requirement 1: Cognitive Domain Mapping

**User Story:** As a user, I want to see which cognitive abilities each game trains.

#### Acceptance Criteria

1. THE System SHALL map each game to specific cognitive domains
2. THE System SHALL assign weights to domain contributions (primary, secondary, tertiary)
3. THE System SHALL map each game to specific cognitive constructs
4. THE System SHALL display domain mappings when viewing game information
5. THE System SHALL cite scientific literature supporting each mapping

### Requirement 2: Score Calculation

**User Story:** As a user, I want my cognitive performance measured scientifically.

#### Acceptance Criteria

1. THE System SHALL calculate scores on a 000-999 scale
2. THE System SHALL use lower scores to indicate better performance
3. THE System SHALL normalize scores across different games
4. THE System SHALL weight contributions from multiple games
5. THE System SHALL update scores after each training session

### Requirement 3: Formula Transparency

**User Story:** As a user, I want to see how my scores are calculated.

#### Acceptance Criteria

1. WHEN a user clicks any score, THE System SHALL display the calculation formula
2. THE System SHALL show all raw data inputs used in the calculation
3. THE System SHALL display step-by-step calculation process
4. THE System SHALL provide scientific references for each formula
5. THE System SHALL use standard mathematical notation

### Requirement 4: Scientific Metrics

**User Story:** As a user, I want validated cognitive metrics calculated from my training data.

#### Acceptance Criteria

1. THE System SHALL calculate signal detection theory metrics (d-prime, criterion)
2. THE System SHALL calculate working memory capacity (Cowan's K)
3. THE System SHALL calculate processing speed metrics (mean RT, throughput)
4. THE System SHALL calculate attention metrics (sustained attention, vigilance)
5. THE System SHALL display formulas for all scientific metrics

### Requirement 5: Cognitive Profile

**User Story:** As a user, I want to see my performance across all cognitive domains.

#### Acceptance Criteria

1. THE System SHALL display scores for all 6 cognitive domains
2. THE System SHALL visualize the profile using a radar chart
3. THE System SHALL make each domain score clickable for details
4. THE System SHALL show percentile rankings for each domain
5. THE System SHALL update the profile after each session

### Requirement 6: Trend Analysis

**User Story:** As a user, I want to track my cognitive improvement over time.

#### Acceptance Criteria

1. THE System SHALL calculate statistical trends for each domain
2. THE System SHALL display trend graphs with confidence intervals
3. THE System SHALL show regression equations and R² values
4. THE System SHALL indicate statistical significance (p-values)
5. THE System SHALL make trend graphs clickable for full statistical analysis

### Requirement 7: Session Tracking

**User Story:** As a user, I want all my training sessions recorded with cognitive metrics.

#### Acceptance Criteria

1. THE System SHALL create a session record when training begins
2. THE System SHALL track game-specific performance metrics
3. THE System SHALL calculate cognitive contributions for each session
4. THE System SHALL store session data in IndexedDB
5. THE System SHALL display session history with cognitive metrics

### Requirement 8: Cross-Game Analytics

**User Story:** As a user, I want to see how different games contribute to each cognitive domain.

#### Acceptance Criteria

1. THE System SHALL show which games contribute to each domain
2. THE System SHALL display contribution weights for each game
3. THE System SHALL show session counts per game per domain
4. THE System SHALL calculate weighted averages across games
5. THE System SHALL make game contributions clickable for details

### Requirement 9: Data Export

**User Story:** As a user, I want to export all my cognitive data.

#### Acceptance Criteria

1. THE System SHALL export complete data in JSON format
2. THE System SHALL export data in CSV format for spreadsheet analysis
3. THE System SHALL include all formulas in exports
4. THE System SHALL include all raw session data in exports
5. THE System SHALL include cognitive mappings in exports

### Requirement 10: Data Transparency

**User Story:** As a user, I want to see all data the system collects.

#### Acceptance Criteria

1. THE System SHALL display all stored cognitive data
2. THE System SHALL show data organized by domain, game, and date
3. THE System SHALL display storage size used
4. THE System SHALL provide access to raw session data
5. THE System SHALL explain what each metric measures

### Requirement 11: Statistical Rigor

**User Story:** As a researcher, I want statistically valid cognitive metrics.

#### Acceptance Criteria

1. THE System SHALL calculate confidence intervals for all metrics
2. THE System SHALL perform significance testing on trends
3. THE System SHALL display goodness-of-fit measures (R²)
4. THE System SHALL handle outliers appropriately
5. THE System SHALL document statistical methods used

### Requirement 12: Interface Simplicity

**User Story:** As a user, I want a clean interface that shows all information without overwhelming me.

#### Acceptance Criteria

1. THE System SHALL display all 6 domain scores on the primary view
2. THE System SHALL use progressive disclosure (click to reveal details)
3. THE System SHALL use minimal visual elements
4. THE System SHALL prioritize data over decoration
5. THE System SHALL maintain generous whitespace

### Requirement 13: Performance

**User Story:** As a user, I want the system to respond instantly.

#### Acceptance Criteria

1. THE System SHALL update displays in < 16ms (60 FPS)
2. THE System SHALL cache calculated statistics
3. THE System SHALL use IndexedDB for efficient data storage
4. THE System SHALL batch database writes
5. THE System SHALL lazy-load detailed analytics

### Requirement 14: Accessibility

**User Story:** As a user with accessibility needs, I want the system to be usable.

#### Acceptance Criteria

1. THE System SHALL provide keyboard navigation for all features
2. THE System SHALL include ARIA labels for all interactive elements
3. THE System SHALL maintain color contrast ≥ 4.5:1
4. THE System SHALL support screen readers
5. THE System SHALL follow WCAG 2.1 AA guidelines

### Requirement 15: Data Privacy

**User Story:** As a user, I want my cognitive data to remain private.

#### Acceptance Criteria

1. THE System SHALL store all data locally in the browser
2. THE System SHALL NOT transmit data to external servers
3. THE System SHALL provide complete data deletion
4. THE System SHALL confirm before deleting data
5. THE System SHALL offer data export before deletion

### Requirement 16: Score Normalization

**User Story:** As a user, I want scores that are comparable across different games.

#### Acceptance Criteria

1. THE System SHALL normalize raw metrics to 000-999 scale
2. THE System SHALL use consistent normalization methods
3. THE System SHALL document normalization formulas
4. THE System SHALL handle different metric types appropriately
5. THE System SHALL display normalization process when clicked

### Requirement 17: Construct Definitions

**User Story:** As a user, I want to understand what each cognitive construct means.

#### Acceptance Criteria

1. THE System SHALL provide definitions for all cognitive domains
2. THE System SHALL provide definitions for all cognitive constructs
3. THE System SHALL explain real-world applications of each construct
4. THE System SHALL cite scientific literature for each construct
5. THE System SHALL make definitions accessible from the interface

### Requirement 18: Data Quality

**User Story:** As a user, I want to know the reliability of my cognitive scores.

#### Acceptance Criteria

1. THE System SHALL calculate confidence levels for each score
2. THE System SHALL indicate minimum data requirements
3. THE System SHALL warn when data is insufficient
4. THE System SHALL display data quality indicators
5. THE System SHALL validate all incoming session data

### Requirement 19: Responsive Design

**User Story:** As a user, I want the system to work on all my devices.

#### Acceptance Criteria

1. THE System SHALL adapt layout for mobile devices
2. THE System SHALL maintain functionality on screens ≥ 375px wide
3. THE System SHALL provide touch-friendly controls
4. THE System SHALL optimize visualizations for different screen sizes
5. THE System SHALL support portrait and landscape orientations

### Requirement 20: Integration

**User Story:** As a developer, I want to integrate games with the cognitive system easily.

#### Acceptance Criteria

1. THE System SHALL provide simple integration API
2. THE System SHALL communicate with games via postMessage
3. THE System SHALL validate game messages
4. THE System SHALL handle integration errors gracefully
5. THE System SHALL provide integration documentation



### Requirement 21: Inverted Y-Axis Visualization

**User Story:** As a user, I want trend graphs to show 000 at the top and 999 at the bottom, so the visual matches the scoring system where lower is better.

#### Acceptance Criteria

1. THE System SHALL display Y-axis with 000 at the top
2. THE System SHALL display Y-axis with 999 at the bottom
3. THE System SHALL label the axis "Score (lower = better)"
4. THE System SHALL show improvement as downward trends
5. THE System SHALL maintain inverted axis in all trend visualizations



### Requirement 22: Raw Metric Display

**User Story:** As a user, I want to see both the percentile score (000-999) and the actual cognitive measurements, so I understand my real performance values.

#### Acceptance Criteria

1. THE System SHALL display 000-999 score as percentile rank
2. WHEN a user clicks a score, THE System SHALL display actual raw metrics
3. THE System SHALL show domain-specific measurements (e.g., d-prime, capacity K, mean RT)
4. THE System SHALL label raw metrics with their units (e.g., "d' = 2.1", "K = 4.2 items", "RT = 850ms")
5. THE System SHALL explain the relationship between raw metrics and percentile score

