// Cognitive Metrics Dashboard - Category-Based Brain Training Analytics
// Organizes all metrics by cognitive domain with transparent calculations and historical trends

window.CognitiveMetricsDashboard = {
  charts: {},
  activeCategory: 'overview',
  timeRange: 'all', // 'all', '7d', '30d', '90d'
  
  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE CATEGORIES - Metrics organized by brain function, not game
  // ═══════════════════════════════════════════════════════════════════════════
  CATEGORIES: {
    overview: { name: 'Overview', icon: '📊', color: '#4CAF50' },
    memory: { name: 'Working Memory', icon: '🧠', color: '#2196F3' },
    attention: { name: 'Attention', icon: '👁️', color: '#9C27B0' },
    signal: { name: 'Signal Detection', icon: '🎯', color: '#FF9800' },
    speed: { name: 'Processing Speed', icon: '⚡', color: '#E91E63' },
    reasoning: { name: 'Reasoning & Logic', icon: '🧩', color: '#00BCD4' },
    spatial: { name: 'Spatial & Tracking', icon: '🗺️', color: '#8BC34A' }
  },

  // Game to cognitive domain mapping
  GAME_DOMAINS: {
    'jiggle-factorial': ['attention', 'spatial'],
    '3d-hyper-nback': ['memory', 'attention', 'signal', 'spatial'],
    'quad-box': ['memory', 'attention', 'signal'],
    'dichotic-dual-nback': ['memory', 'attention', 'signal'],
    'syllogimous-v4': ['reasoning'],
    'fast-sequence-nback': ['memory', 'speed'],
    'multiple': ['memory', 'signal']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // METRIC DEFINITIONS - Each with formula, sources, and interpretation
  // ═══════════════════════════════════════════════════════════════════════════
  METRICS: {
    // WORKING MEMORY
    wmCapacity: {
      name: 'WM Capacity Index',
      category: 'memory',
      formula: 'n_back_level × accuracy × stimuli_count',
      description: 'Overall working memory capacity based on n-back performance',
      unit: 'units',
      sources: ['3d-hyper-nback', 'quad-box', 'dichotic-dual-nback', 'multiple']
    },
    verbalWM: {
      name: 'Verbal Working Memory',
      category: 'memory',
      formula: 'audio_accuracy × n_back_level',
      description: 'Ability to hold and manipulate verbal/auditory information',
      unit: 'units',
      sources: ['dichotic-dual-nback', '3d-hyper-nback']
    },
    visuospatialWM: {
      name: 'Visuospatial WM',
      category: 'memory',
      formula: 'position_accuracy × n_back_level',
      description: 'Ability to hold and manipulate spatial information',
      unit: 'units',
      sources: ['3d-hyper-nback', 'quad-box']
    },
    wmUpdating: {
      name: 'WM Updating Speed',
      category: 'memory',
      formula: '1000 / avg_response_time_ms',
      description: 'Speed of updating working memory contents',
      unit: 'updates/s',
      sources: ['3d-hyper-nback', 'quad-box']
    },

    // ATTENTION
    sustainedAttention: {
      name: 'Sustained Attention',
      category: 'attention',
      formula: 'accuracy_last_quarter / accuracy_first_quarter',
      description: 'Ability to maintain focus over time (vigilance)',
      unit: 'ratio',
      sources: ['jiggle-factorial', '3d-hyper-nback', 'quad-box']
    },
    selectiveAttention: {
      name: 'Selective Attention',
      category: 'attention',
      formula: '1 - false_alarm_rate',
      description: 'Ability to filter distractors and focus on targets',
      unit: '%',
      sources: ['3d-hyper-nback', 'quad-box', 'jiggle-factorial']
    },
    dividedAttention: {
      name: 'Divided Attention',
      category: 'attention',
      formula: '(left_accuracy + right_accuracy) / 2',
      description: 'Ability to attend to multiple streams simultaneously',
      unit: '%',
      sources: ['dichotic-dual-nback']
    },
    visualAttentionCapacity: {
      name: 'Visual Attention Capacity',
      category: 'attention',
      formula: 'objects_tracked × tracking_accuracy',
      description: 'Number of objects that can be tracked simultaneously',
      unit: 'objects',
      sources: ['jiggle-factorial']
    },
    attentionalControl: {
      name: 'Attentional Control',
      category: 'attention',
      formula: 'lure_resistance × (1 - false_alarm_rate)',
      description: 'Ability to inhibit prepotent responses',
      unit: 'index',
      sources: ['3d-hyper-nback', 'quad-box']
    },

    // SIGNAL DETECTION
    dPrime: {
      name: "d' (d-prime)",
      category: 'signal',
      formula: 'Z(hit_rate) - Z(false_alarm_rate)',
      description: 'Signal detection sensitivity - ability to discriminate signal from noise',
      unit: 'σ',
      sources: ['3d-hyper-nback', 'quad-box', 'dichotic-dual-nback']
    },
    criterion: {
      name: 'Criterion (c)',
      category: 'signal',
      formula: '-0.5 × (Z(hit_rate) + Z(false_alarm_rate))',
      description: 'Response bias - tendency to say "yes" or "no"',
      unit: 'σ',
      sources: ['3d-hyper-nback', 'quad-box']
    },
    hitRate: {
      name: 'Hit Rate',
      category: 'signal',
      formula: 'correct_detections / total_targets',
      description: 'Proportion of targets correctly identified',
      unit: '%',
      sources: ['3d-hyper-nback', 'quad-box', 'dichotic-dual-nback']
    },
    falseAlarmRate: {
      name: 'False Alarm Rate',
      category: 'signal',
      formula: 'false_positives / total_non_targets',
      description: 'Proportion of non-targets incorrectly identified as targets',
      unit: '%',
      sources: ['3d-hyper-nback', 'quad-box']
    },
    lureResistance: {
      name: 'Lure Resistance',
      category: 'signal',
      formula: '1 - (lure_false_alarms / total_lures)',
      description: 'Ability to resist similar-but-wrong stimuli',
      unit: '%',
      sources: ['3d-hyper-nback']
    },

    // PROCESSING SPEED
    reactionTime: {
      name: 'Reaction Time',
      category: 'speed',
      formula: 'median(response_times)',
      description: 'Typical response latency',
      unit: 'ms',
      sources: ['3d-hyper-nback', 'quad-box', 'syllogimous-v4']
    },
    processingEfficiency: {
      name: 'Processing Efficiency',
      category: 'speed',
      formula: 'accuracy / avg_response_time',
      description: 'Speed-accuracy tradeoff optimization',
      unit: 'eff',
      sources: ['3d-hyper-nback', 'quad-box', 'syllogimous-v4']
    },
    cognitiveSpeed: {
      name: 'Cognitive Speed Index',
      category: 'speed',
      formula: '(correct_responses × complexity) / total_time',
      description: 'Overall cognitive processing rate',
      unit: 'ops/min',
      sources: ['syllogimous-v4', '3d-hyper-nback']
    },

    // REASONING & LOGIC
    deductiveReasoning: {
      name: 'Deductive Reasoning',
      category: 'reasoning',
      formula: 'syllogism_accuracy × complexity_weight',
      description: 'Ability to draw logical conclusions from premises',
      unit: 'score',
      sources: ['syllogimous-v4']
    },
    relationalReasoning: {
      name: 'Relational Reasoning',
      category: 'reasoning',
      formula: 'comparison_accuracy × arrangement_accuracy',
      description: 'Ability to understand relationships between items',
      unit: 'score',
      sources: ['syllogimous-v4']
    },
    spatialReasoning: {
      name: 'Spatial Reasoning',
      category: 'reasoning',
      formula: 'direction_accuracy × spatial_complexity',
      description: 'Ability to reason about spatial relationships',
      unit: 'score',
      sources: ['syllogimous-v4']
    },
    analogicalReasoning: {
      name: 'Analogical Reasoning',
      category: 'reasoning',
      formula: 'analogy_accuracy × pattern_complexity',
      description: 'Ability to identify patterns and relationships',
      unit: 'score',
      sources: ['syllogimous-v4']
    },

    // SPATIAL & TRACKING
    objectTracking: {
      name: 'Object Tracking Capacity',
      category: 'spatial',
      formula: 'max_objects_tracked × success_rate',
      description: 'Multiple object tracking ability',
      unit: 'objects',
      sources: ['jiggle-factorial']
    },
    spatialUpdating: {
      name: 'Spatial Updating',
      category: 'spatial',
      formula: 'position_accuracy × movement_complexity',
      description: 'Ability to track position changes',
      unit: 'index',
      sources: ['jiggle-factorial', '3d-hyper-nback']
    },
    spatial3D: {
      name: '3D Spatial Navigation',
      category: 'spatial',
      formula: '3d_position_accuracy × depth_accuracy',
      description: 'Ability to process 3D spatial information',
      unit: 'index',
      sources: ['3d-hyper-nback', 'jiggle-factorial']
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN INTERFACE
  // ═══════════════════════════════════════════════════════════════════════════
  show() {
    this.destroy();
    
    const overlay = document.createElement('div');
    overlay.id = 'cognitive-metrics-overlay';
    overlay.innerHTML = this.getHTML();
    document.body.appendChild(overlay);
    
    this.bindEvents();
    this.renderCategory(this.activeCategory);
    
    requestAnimationFrame(() => overlay.classList.add('visible'));
  },

  destroy() {
    Object.values(this.charts).forEach(c => c?.destroy?.());
    this.charts = {};
    document.getElementById('cognitive-metrics-overlay')?.remove();
  },

  getHTML() {
    return `
      <style>${this.getStyles()}</style>
      <div class="cmd-container">
        <div class="cmd-header">
          <div class="cmd-title">🧠 Cognitive Metrics Dashboard</div>
          <div class="cmd-time-filter">
            <button class="cmd-time-btn ${this.timeRange === 'all' ? 'active' : ''}" data-range="all">All Time</button>
            <button class="cmd-time-btn ${this.timeRange === '7d' ? 'active' : ''}" data-range="7d">7 Days</button>
            <button class="cmd-time-btn ${this.timeRange === '30d' ? 'active' : ''}" data-range="30d">30 Days</button>
            <button class="cmd-time-btn ${this.timeRange === '90d' ? 'active' : ''}" data-range="90d">90 Days</button>
          </div>
          <button class="cmd-close" onclick="CognitiveMetricsDashboard.destroy()">×</button>
        </div>
        <div class="cmd-tabs">${this.getCategoryTabs()}</div>
        <div class="cmd-content" id="cmd-content"></div>
      </div>
    `;
  },

  getCategoryTabs() {
    return Object.entries(this.CATEGORIES).map(([id, cat]) => 
      `<button class="cmd-tab ${this.activeCategory === id ? 'active' : ''}" data-category="${id}">
        ${cat.icon} ${cat.name}
      </button>`
    ).join('');
  },

  bindEvents() {
    // Category tabs
    document.querySelectorAll('.cmd-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cmd-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.category;
        this.renderCategory(this.activeCategory);
      });
    });
    
    // Time range filter
    document.querySelectorAll('.cmd-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cmd-time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.timeRange = btn.dataset.range;
        this.renderCategory(this.activeCategory);
      });
    });
  },

  renderCategory(categoryId) {
    const content = document.getElementById('cmd-content');
    if (!content) return;
    
    Object.values(this.charts).forEach(c => c?.destroy?.());
    this.charts = {};
    
    if (categoryId === 'overview') {
      content.innerHTML = this.renderOverview();
      this.initOverviewCharts();
    } else {
      content.innerHTML = this.renderCategoryDetail(categoryId);
      this.initCategoryCharts(categoryId);
    }
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // OVERVIEW RENDERING
  // ═══════════════════════════════════════════════════════════════════════════
  renderOverview() {
    const allData = this.getAllGameData();
    const cognitiveScores = this.calculateAllCognitiveScores(allData);
    const trends = this.calculateTrends(allData);
    
    return `
      <div class="cmd-grid">
        <!-- Cognitive Profile Radar -->
        <div class="cmd-panel cmd-panel-half">
          <div class="cmd-panel-title">🎯 Cognitive Profile</div>
          <canvas id="chart-cognitive-radar"></canvas>
        </div>
        
        <!-- Category Summary Cards -->
        <div class="cmd-panel cmd-panel-half">
          <div class="cmd-panel-title">📈 Domain Scores</div>
          <div class="cmd-domain-cards">
            ${this.renderDomainCards(cognitiveScores, trends)}
          </div>
        </div>
        
        <!-- Historical Trend -->
        <div class="cmd-panel cmd-panel-full">
          <div class="cmd-panel-title">📊 Cognitive Progress Over Time</div>
          <canvas id="chart-cognitive-timeline"></canvas>
        </div>
        
        <!-- Top Metrics -->
        <div class="cmd-panel cmd-panel-full">
          <div class="cmd-panel-title">⭐ Key Metrics Summary</div>
          <div class="cmd-metrics-grid">
            ${this.renderTopMetrics(cognitiveScores)}
          </div>
        </div>
      </div>
    `;
  },

  renderDomainCards(scores, trends) {
    return Object.entries(this.CATEGORIES)
      .filter(([id]) => id !== 'overview')
      .map(([id, cat]) => {
        const score = scores[id] || 0;
        const trend = trends[id] || 0;
        const trendIcon = trend > 0.05 ? '↑' : trend < -0.05 ? '↓' : '→';
        const trendColor = trend > 0.05 ? '#4CAF50' : trend < -0.05 ? '#f44336' : '#888';
        
        return `
          <div class="cmd-domain-card" style="border-left-color: ${cat.color}">
            <div class="cmd-domain-icon">${cat.icon}</div>
            <div class="cmd-domain-info">
              <div class="cmd-domain-name">${cat.name}</div>
              <div class="cmd-domain-score">${(score * 100).toFixed(0)}</div>
            </div>
            <div class="cmd-domain-trend" style="color: ${trendColor}">${trendIcon}</div>
          </div>
        `;
      }).join('');
  },

  renderTopMetrics(scores) {
    const topMetrics = [
      { key: 'dPrime', label: "d' Prime", value: this.getMetricValue('dPrime'), cat: 'signal' },
      { key: 'wmCapacity', label: 'WM Capacity', value: this.getMetricValue('wmCapacity'), cat: 'memory' },
      { key: 'visualAttentionCapacity', label: 'Visual Attention', value: this.getMetricValue('visualAttentionCapacity'), cat: 'attention' },
      { key: 'processingEfficiency', label: 'Processing Efficiency', value: this.getMetricValue('processingEfficiency'), cat: 'speed' },
      { key: 'objectTracking', label: 'Object Tracking', value: this.getMetricValue('objectTracking'), cat: 'spatial' },
      { key: 'deductiveReasoning', label: 'Deductive Reasoning', value: this.getMetricValue('deductiveReasoning'), cat: 'reasoning' }
    ];
    
    return topMetrics.map(m => {
      const metric = this.METRICS[m.key];
      const cat = this.CATEGORIES[m.cat];
      return `
        <div class="cmd-metric-card" onclick="CognitiveMetricsDashboard.showMetricDetail('${m.key}')">
          <div class="cmd-metric-header" style="border-bottom-color: ${cat.color}">
            <span class="cmd-metric-icon">${cat.icon}</span>
            <span class="cmd-metric-name">${m.label}</span>
            <button class="cmd-info-btn" title="Show formula">ℹ️</button>
          </div>
          <div class="cmd-metric-value">${m.value !== null ? m.value.toFixed(2) : 'N/A'}</div>
          <div class="cmd-metric-unit">${metric?.unit || ''}</div>
        </div>
      `;
    }).join('');
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY DETAIL RENDERING
  // ═══════════════════════════════════════════════════════════════════════════
  renderCategoryDetail(categoryId) {
    const category = this.CATEGORIES[categoryId];
    const metrics = Object.entries(this.METRICS).filter(([_, m]) => m.category === categoryId);
    const historicalData = this.getCategoryHistoricalData(categoryId);
    
    return `
      <div class="cmd-grid">
        <!-- Category Header -->
        <div class="cmd-panel cmd-panel-full cmd-category-header" style="border-top-color: ${category.color}">
          <div class="cmd-cat-icon">${category.icon}</div>
          <div class="cmd-cat-info">
            <h2>${category.name}</h2>
            <p>Metrics from: ${this.getCategorySources(categoryId).join(', ')}</p>
          </div>
        </div>
        
        <!-- Metrics Grid -->
        <div class="cmd-panel cmd-panel-full">
          <div class="cmd-panel-title">📊 ${category.name} Metrics</div>
          <div class="cmd-detailed-metrics">
            ${metrics.map(([key, m]) => this.renderDetailedMetric(key, m, category.color)).join('')}
          </div>
        </div>
        
        <!-- Historical Chart -->
        <div class="cmd-panel cmd-panel-full">
          <div class="cmd-panel-title">📈 ${category.name} Progress</div>
          <canvas id="chart-category-timeline"></canvas>
        </div>
        
        <!-- Contributing Games -->
        <div class="cmd-panel cmd-panel-full">
          <div class="cmd-panel-title">🎮 Contributing Games</div>
          ${this.renderContributingGames(categoryId)}
        </div>
      </div>
    `;
  },

  renderDetailedMetric(key, metric, color) {
    const value = this.getMetricValue(key);
    const trend = this.getMetricTrend(key);
    const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
    const trendColor = trend > 0 ? '#4CAF50' : trend < 0 ? '#f44336' : '#888';
    const calculation = this.getMetricCalculation(key);
    
    return `
      <div class="cmd-detailed-metric">
        <div class="cmd-dm-header">
          <span class="cmd-dm-name">${metric.name}</span>
          <span class="cmd-dm-trend" style="color: ${trendColor}">${trendIcon} ${Math.abs(trend * 100).toFixed(1)}%</span>
        </div>
        <div class="cmd-dm-value-row">
          <span class="cmd-dm-value" style="color: ${color}">${value !== null ? value.toFixed(2) : 'N/A'}</span>
          <span class="cmd-dm-unit">${metric.unit}</span>
        </div>
        <div class="cmd-dm-description">${metric.description}</div>
        <details class="cmd-dm-formula">
          <summary>📐 Formula & Calculation</summary>
          <div class="cmd-formula-content">
            <div class="cmd-formula-eq"><strong>Formula:</strong> <code>${metric.formula}</code></div>
            ${calculation ? `<div class="cmd-formula-calc"><strong>Your calculation:</strong><br><code>${calculation}</code></div>` : ''}
            <div class="cmd-formula-sources"><strong>Data from:</strong> ${metric.sources.join(', ')}</div>
          </div>
        </details>
        <div class="cmd-dm-sparkline" id="sparkline-${key}"></div>
      </div>
    `;
  },

  renderContributingGames(categoryId) {
    const games = Object.entries(this.GAME_DOMAINS)
      .filter(([_, domains]) => domains.includes(categoryId))
      .map(([gameId]) => gameId);
    
    const gameNames = {
      'jiggle-factorial': { name: 'Jiggle Factorial', icon: '🎯' },
      '3d-hyper-nback': { name: '3D Hyper N-Back', icon: '🧠' },
      'quad-box': { name: 'Quad Box', icon: '📦' },
      'dichotic-dual-nback': { name: 'Dichotic Dual', icon: '🎧' },
      'syllogimous-v4': { name: 'Syllogimous', icon: '🧩' },
      'fast-sequence-nback': { name: 'Fast Sequence', icon: '⚡' },
      'multiple': { name: 'Multiple N-Back', icon: '🔢' }
    };
    
    return `
      <div class="cmd-games-grid">
        ${games.map(gameId => {
          const game = gameNames[gameId] || { name: gameId, icon: '🎮' };
          const sessions = this.getFilteredSessions(gameId);
          return `
            <div class="cmd-game-card">
              <span class="cmd-game-icon">${game.icon}</span>
              <span class="cmd-game-name">${game.name}</span>
              <span class="cmd-game-sessions">${sessions.length} sessions</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  getCategorySources(categoryId) {
    const sources = new Set();
    Object.values(this.METRICS)
      .filter(m => m.category === categoryId)
      .forEach(m => m.sources.forEach(s => sources.add(s)));
    
    const gameNames = {
      'jiggle-factorial': 'Jiggle Factorial',
      '3d-hyper-nback': '3D Hyper N-Back',
      'quad-box': 'Quad Box',
      'dichotic-dual-nback': 'Dichotic Dual',
      'syllogimous-v4': 'Syllogimous',
      'fast-sequence-nback': 'Fast Sequence',
      'multiple': 'Multiple N-Back'
    };
    
    return Array.from(sources).map(s => gameNames[s] || s);
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // DATA COLLECTION & CALCULATION
  // ═══════════════════════════════════════════════════════════════════════════
  getAllGameData() {
    const games = Object.keys(this.GAME_DOMAINS);
    const data = {};
    games.forEach(gameId => {
      data[gameId] = this.getFilteredSessions(gameId);
    });
    return data;
  },

  getFilteredSessions(gameId) {
    const sessions = window.gameStats?.getStats(gameId) || [];
    if (this.timeRange === 'all') return sessions;
    
    const now = Date.now();
    const ranges = { '7d': 7, '30d': 30, '90d': 90 };
    const days = ranges[this.timeRange] || 9999;
    const cutoff = now - (days * 24 * 60 * 60 * 1000);
    
    return sessions.filter(s => s.timestamp >= cutoff);
  },

  calculateAllCognitiveScores(allData) {
    const scores = {};
    Object.keys(this.CATEGORIES).forEach(catId => {
      if (catId === 'overview') return;
      scores[catId] = this.calculateCategoryScore(catId, allData);
    });
    return scores;
  },

  calculateCategoryScore(categoryId, allData) {
    const metrics = Object.entries(this.METRICS).filter(([_, m]) => m.category === categoryId);
    if (metrics.length === 0) return 0;
    
    let totalScore = 0;
    let validMetrics = 0;
    
    metrics.forEach(([key]) => {
      const value = this.getMetricValue(key, allData);
      if (value !== null && !isNaN(value)) {
        // Normalize to 0-1 scale based on metric type
        const normalized = this.normalizeMetricValue(key, value);
        totalScore += normalized;
        validMetrics++;
      }
    });
    
    return validMetrics > 0 ? totalScore / validMetrics : 0;
  },

  normalizeMetricValue(metricKey, value) {
    // Normalization ranges for different metrics
    const ranges = {
      dPrime: { min: 0, max: 4 },
      criterion: { min: -2, max: 2 },
      hitRate: { min: 0, max: 1 },
      falseAlarmRate: { min: 0, max: 1, invert: true },
      lureResistance: { min: 0, max: 1 },
      wmCapacity: { min: 0, max: 20 },
      verbalWM: { min: 0, max: 10 },
      visuospatialWM: { min: 0, max: 10 },
      wmUpdating: { min: 0, max: 5 },
      sustainedAttention: { min: 0.5, max: 1.5 },
      selectiveAttention: { min: 0, max: 1 },
      dividedAttention: { min: 0, max: 1 },
      visualAttentionCapacity: { min: 0, max: 10 },
      attentionalControl: { min: 0, max: 1 },
      reactionTime: { min: 200, max: 2000, invert: true },
      processingEfficiency: { min: 0, max: 1 },
      cognitiveSpeed: { min: 0, max: 10 },
      deductiveReasoning: { min: 0, max: 1 },
      relationalReasoning: { min: 0, max: 1 },
      spatialReasoning: { min: 0, max: 1 },
      analogicalReasoning: { min: 0, max: 1 },
      objectTracking: { min: 0, max: 8 },
      spatialUpdating: { min: 0, max: 1 },
      spatial3D: { min: 0, max: 1 }
    };
    
    const range = ranges[metricKey] || { min: 0, max: 1 };
    let normalized = (value - range.min) / (range.max - range.min);
    if (range.invert) normalized = 1 - normalized;
    return Math.max(0, Math.min(1, normalized));
  },

  getMetricValue(metricKey, allData = null) {
    if (!allData) allData = this.getAllGameData();
    const metric = this.METRICS[metricKey];
    if (!metric) return null;
    
    // Calculate based on metric type
    switch (metricKey) {
      case 'dPrime':
        return this.calculateDPrime(allData);
      case 'criterion':
        return this.calculateCriterion(allData);
      case 'hitRate':
        return this.calculateHitRate(allData);
      case 'falseAlarmRate':
        return this.calculateFalseAlarmRate(allData);
      case 'lureResistance':
        return this.calculateLureResistance(allData);
      case 'wmCapacity':
        return this.calculateWMCapacity(allData);
      case 'verbalWM':
        return this.calculateVerbalWM(allData);
      case 'visuospatialWM':
        return this.calculateVisuospatialWM(allData);
      case 'wmUpdating':
        return this.calculateWMUpdating(allData);
      case 'sustainedAttention':
        return this.calculateSustainedAttention(allData);
      case 'selectiveAttention':
        return this.calculateSelectiveAttention(allData);
      case 'dividedAttention':
        return this.calculateDividedAttention(allData);
      case 'visualAttentionCapacity':
        return this.calculateVisualAttentionCapacity(allData);
      case 'attentionalControl':
        return this.calculateAttentionalControl(allData);
      case 'reactionTime':
        return this.calculateReactionTime(allData);
      case 'processingEfficiency':
        return this.calculateProcessingEfficiency(allData);
      case 'cognitiveSpeed':
        return this.calculateCognitiveSpeed(allData);
      case 'objectTracking':
        return this.calculateObjectTracking(allData);
      case 'spatialUpdating':
        return this.calculateSpatialUpdating(allData);
      case 'spatial3D':
        return this.calculateSpatial3D(allData);
      case 'deductiveReasoning':
      case 'relationalReasoning':
      case 'spatialReasoning':
      case 'analogicalReasoning':
        return this.calculateReasoningMetric(metricKey, allData);
      default:
        return null;
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // METRIC CALCULATIONS - Transparent formulas
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Z-score lookup for d-prime calculation
  zScore(p) {
    // Approximate inverse normal CDF
    if (p <= 0) return -3.5;
    if (p >= 1) return 3.5;
    
    const a1 = -3.969683028665376e+01;
    const a2 = 2.209460984245205e+02;
    const a3 = -2.759285104469687e+02;
    const a4 = 1.383577518672690e+02;
    const a5 = -3.066479806614716e+01;
    const a6 = 2.506628277459239e+00;
    
    const b1 = -5.447609879822406e+01;
    const b2 = 1.615858368580409e+02;
    const b3 = -1.556989798598866e+02;
    const b4 = 6.680131188771972e+01;
    const b5 = -1.328068155288572e+01;
    
    const c1 = -7.784894002430293e-03;
    const c2 = -3.223964580411365e-01;
    const c3 = -2.400758277161838e+00;
    const c4 = -2.549732539343734e+00;
    const c5 = 4.374664141464968e+00;
    const c6 = 2.938163982698783e+00;
    
    const d1 = 7.784695709041462e-03;
    const d2 = 3.224671290700398e-01;
    const d3 = 2.445134137142996e+00;
    const d4 = 3.754408661907416e+00;
    
    const pLow = 0.02425;
    const pHigh = 1 - pLow;
    let q, r;
    
    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c1*q+c2)*q+c3)*q+c4)*q+c5)*q+c6) / ((((d1*q+d2)*q+d3)*q+d4)*q+1);
    } else if (p <= pHigh) {
      q = p - 0.5;
      r = q * q;
      return (((((a1*r+a2)*r+a3)*r+a4)*r+a5)*r+a6)*q / (((((b1*r+b2)*r+b3)*r+b4)*r+b5)*r+1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c1*q+c2)*q+c3)*q+c4)*q+c5)*q+c6) / ((((d1*q+d2)*q+d3)*q+d4)*q+1);
    }
  },

  calculateDPrime(allData) {
    // Aggregate hit rate and false alarm rate from n-back games
    const nbackGames = ['3d-hyper-nback', 'quad-box', 'dichotic-dual-nback'];
    let totalHits = 0, totalTargets = 0, totalFA = 0, totalNonTargets = 0;
    
    nbackGames.forEach(gameId => {
      const sessions = allData[gameId] || [];
      sessions.forEach(s => {
        if (s.hits !== undefined) totalHits += s.hits;
        if (s.targets !== undefined) totalTargets += s.targets;
        if (s.falseAlarms !== undefined) totalFA += s.falseAlarms;
        if (s.nonTargets !== undefined) totalNonTargets += s.nonTargets;
        
        // Alternative: use accuracy and calculate
        if (s.accuracy !== undefined && s.totalTrials !== undefined) {
          const correct = s.accuracy * s.totalTrials;
          totalHits += correct * 0.5; // Estimate
          totalTargets += s.totalTrials * 0.3;
        }
      });
    });
    
    if (totalTargets === 0 || totalNonTargets === 0) {
      // Use stored d-prime if available
      const hyperSessions = allData['3d-hyper-nback'] || [];
      const dPrimes = hyperSessions.map(s => s.dPrime).filter(d => d !== undefined && d > 0);
      return dPrimes.length > 0 ? dPrimes.reduce((a, b) => a + b, 0) / dPrimes.length : null;
    }
    
    let hitRate = totalHits / totalTargets;
    let faRate = totalFA / totalNonTargets;
    
    // Correct for extreme values
    hitRate = Math.max(0.01, Math.min(0.99, hitRate));
    faRate = Math.max(0.01, Math.min(0.99, faRate));
    
    return this.zScore(hitRate) - this.zScore(faRate);
  },

  calculateCriterion(allData) {
    const nbackGames = ['3d-hyper-nback', 'quad-box'];
    let totalHits = 0, totalTargets = 0, totalFA = 0, totalNonTargets = 0;
    
    nbackGames.forEach(gameId => {
      const sessions = allData[gameId] || [];
      sessions.forEach(s => {
        if (s.hits !== undefined) totalHits += s.hits;
        if (s.targets !== undefined) totalTargets += s.targets;
        if (s.falseAlarms !== undefined) totalFA += s.falseAlarms;
        if (s.nonTargets !== undefined) totalNonTargets += s.nonTargets;
      });
    });
    
    if (totalTargets === 0 || totalNonTargets === 0) return null;
    
    let hitRate = Math.max(0.01, Math.min(0.99, totalHits / totalTargets));
    let faRate = Math.max(0.01, Math.min(0.99, totalFA / totalNonTargets));
    
    return -0.5 * (this.zScore(hitRate) + this.zScore(faRate));
  },

  calculateHitRate(allData) {
    const nbackGames = ['3d-hyper-nback', 'quad-box', 'dichotic-dual-nback'];
    let totalHits = 0, totalTargets = 0;
    
    nbackGames.forEach(gameId => {
      const sessions = allData[gameId] || [];
      sessions.forEach(s => {
        if (s.hits !== undefined && s.targets !== undefined) {
          totalHits += s.hits;
          totalTargets += s.targets;
        } else if (s.accuracy !== undefined) {
          // Use accuracy as proxy
          totalHits += s.accuracy;
          totalTargets += 1;
        }
      });
    });
    
    return totalTargets > 0 ? totalHits / totalTargets : null;
  },

  calculateFalseAlarmRate(allData) {
    const nbackGames = ['3d-hyper-nback', 'quad-box'];
    let totalFA = 0, totalNonTargets = 0;
    
    nbackGames.forEach(gameId => {
      const sessions = allData[gameId] || [];
      sessions.forEach(s => {
        if (s.falseAlarms !== undefined && s.nonTargets !== undefined) {
          totalFA += s.falseAlarms;
          totalNonTargets += s.nonTargets;
        }
      });
    });
    
    return totalNonTargets > 0 ? totalFA / totalNonTargets : null;
  },

  calculateLureResistance(allData) {
    const sessions = allData['3d-hyper-nback'] || [];
    const lureResistances = sessions.map(s => s.totalLureResistance).filter(l => l !== undefined && l > 0);
    return lureResistances.length > 0 ? lureResistances.reduce((a, b) => a + b, 0) / lureResistances.length : null;
  },

  calculateWMCapacity(allData) {
    const nbackGames = ['3d-hyper-nback', 'quad-box', 'dichotic-dual-nback'];
    let totalCapacity = 0, count = 0;
    
    nbackGames.forEach(gameId => {
      const sessions = allData[gameId] || [];
      sessions.forEach(s => {
        const level = s.microLevel || s.level || s.nBack || 0;
        const accuracy = s.accuracy || 0;
        const stimuli = s.stimuliCount || s.activeStimuli || 4;
        if (level > 0 && accuracy > 0) {
          totalCapacity += level * accuracy * Math.sqrt(stimuli);
          count++;
        }
      });
    });
    
    return count > 0 ? totalCapacity / count : null;
  },

  calculateVerbalWM(allData) {
    const sessions = [...(allData['dichotic-dual-nback'] || []), ...(allData['3d-hyper-nback'] || [])];
    let total = 0, count = 0;
    
    sessions.forEach(s => {
      const audioAcc = s.audioAccuracy || s.soundAccuracy || s.wordAccuracy;
      const level = s.microLevel || s.level || s.nBack || 1;
      if (audioAcc !== undefined) {
        total += audioAcc * level;
        count++;
      }
    });
    
    return count > 0 ? total / count : null;
  },

  calculateVisuospatialWM(allData) {
    const sessions = [...(allData['3d-hyper-nback'] || []), ...(allData['quad-box'] || [])];
    let total = 0, count = 0;
    
    sessions.forEach(s => {
      const posAcc = s.positionAccuracy || s.spatialAccuracy;
      const level = s.microLevel || s.level || s.nBack || 1;
      if (posAcc !== undefined) {
        total += posAcc * level;
        count++;
      } else if (s.rightPosition !== undefined && s.wrongPosition !== undefined) {
        const acc = s.rightPosition / (s.rightPosition + s.wrongPosition + 0.001);
        total += acc * level;
        count++;
      }
    });
    
    return count > 0 ? total / count : null;
  },

  calculateWMUpdating(allData) {
    const nbackGames = ['3d-hyper-nback', 'quad-box'];
    let totalSpeed = 0, count = 0;
    
    nbackGames.forEach(gameId => {
      const sessions = allData[gameId] || [];
      sessions.forEach(s => {
        if (s.avgResponseTime && s.avgResponseTime > 0) {
          totalSpeed += 1000 / s.avgResponseTime;
          count++;
        }
      });
    });
    
    return count > 0 ? totalSpeed / count : null;
  },

  calculateSustainedAttention(allData) {
    // Compare first quarter vs last quarter accuracy
    const games = ['jiggle-factorial', '3d-hyper-nback', 'quad-box'];
    let ratios = [];
    
    games.forEach(gameId => {
      const sessions = allData[gameId] || [];
      if (sessions.length >= 4) {
        const quarter = Math.floor(sessions.length / 4);
        const firstQ = sessions.slice(0, quarter);
        const lastQ = sessions.slice(-quarter);
        
        const firstAcc = firstQ.reduce((a, s) => a + (s.accuracy || 0), 0) / firstQ.length;
        const lastAcc = lastQ.reduce((a, s) => a + (s.accuracy || 0), 0) / lastQ.length;
        
        if (firstAcc > 0) ratios.push(lastAcc / firstAcc);
      }
    });
    
    return ratios.length > 0 ? ratios.reduce((a, b) => a + b, 0) / ratios.length : null;
  },

  calculateSelectiveAttention(allData) {
    const faRate = this.calculateFalseAlarmRate(allData);
    return faRate !== null ? 1 - faRate : null;
  },

  calculateDividedAttention(allData) {
    const sessions = allData['dichotic-dual-nback'] || [];
    let total = 0, count = 0;
    
    sessions.forEach(s => {
      if (s.leftAccuracy !== undefined && s.rightAccuracy !== undefined) {
        total += (s.leftAccuracy + s.rightAccuracy) / 2;
        count++;
      } else if (s.accuracy !== undefined) {
        total += s.accuracy;
        count++;
      }
    });
    
    return count > 0 ? total / count : null;
  },

  calculateVisualAttentionCapacity(allData) {
    const sessions = allData['jiggle-factorial'] || [];
    let total = 0, count = 0;
    
    sessions.forEach(s => {
      const objects = s.level || s.numTargets || 3;
      const accuracy = s.accuracy || 0;
      if (accuracy > 0) {
        total += objects * accuracy;
        count++;
      }
    });
    
    return count > 0 ? total / count : null;
  },

  calculateAttentionalControl(allData) {
    const lure = this.calculateLureResistance(allData) || 0.5;
    const selective = this.calculateSelectiveAttention(allData) || 0.5;
    return lure * selective;
  },

  calculateReactionTime(allData) {
    const games = ['3d-hyper-nback', 'quad-box', 'syllogimous-v4'];
    let times = [];
    
    games.forEach(gameId => {
      const sessions = allData[gameId] || [];
      sessions.forEach(s => {
        if (s.avgResponseTime) times.push(s.avgResponseTime);
        if (s.medianResponseTime) times.push(s.medianResponseTime);
      });
    });
    
    if (times.length === 0) return null;
    times.sort((a, b) => a - b);
    return times[Math.floor(times.length / 2)]; // Median
  },

  calculateProcessingEfficiency(allData) {
    const games = ['3d-hyper-nback', 'quad-box'];
    let total = 0, count = 0;
    
    games.forEach(gameId => {
      const sessions = allData[gameId] || [];
      sessions.forEach(s => {
        if (s.accuracy && s.avgResponseTime && s.avgResponseTime > 0) {
          total += s.accuracy / (s.avgResponseTime / 1000);
          count++;
        }
      });
    });
    
    return count > 0 ? total / count : null;
  },

  calculateCognitiveSpeed(allData) {
    const sessions = allData['syllogimous-v4'] || [];
    let total = 0, count = 0;
    
    sessions.forEach(s => {
      if (s.correctAnswers && s.totalTime && s.totalTime > 0) {
        const complexity = s.avgComplexity || 1;
        total += (s.correctAnswers * complexity) / (s.totalTime / 60);
        count++;
      }
    });
    
    return count > 0 ? total / count : null;
  },

  calculateObjectTracking(allData) {
    const sessions = allData['jiggle-factorial'] || [];
    let maxTracked = 0;
    
    sessions.forEach(s => {
      const level = s.level || 3;
      const accuracy = s.accuracy || 0;
      if (accuracy >= 0.7) { // Only count if reasonably successful
        maxTracked = Math.max(maxTracked, level);
      }
    });
    
    return maxTracked > 0 ? maxTracked : null;
  },

  calculateSpatialUpdating(allData) {
    const sessions = [...(allData['jiggle-factorial'] || []), ...(allData['3d-hyper-nback'] || [])];
    let total = 0, count = 0;
    
    sessions.forEach(s => {
      if (s.positionAccuracy !== undefined) {
        total += s.positionAccuracy;
        count++;
      } else if (s.accuracy !== undefined) {
        total += s.accuracy;
        count++;
      }
    });
    
    return count > 0 ? total / count : null;
  },

  calculateSpatial3D(allData) {
    const sessions = allData['3d-hyper-nback'] || [];
    let total = 0, count = 0;
    
    sessions.forEach(s => {
      if (s.rightPosition !== undefined && s.wrongPosition !== undefined) {
        const acc = s.rightPosition / (s.rightPosition + s.wrongPosition + 0.001);
        total += acc;
        count++;
      }
    });
    
    return count > 0 ? total / count : null;
  },

  calculateReasoningMetric(metricKey, allData) {
    const sessions = allData['syllogimous-v4'] || [];
    if (sessions.length === 0) return null;
    
    // Map metric to question types
    const typeMap = {
      deductiveReasoning: ['syllogism', 'distinction'],
      relationalReasoning: ['comparison', 'linear', 'circular'],
      spatialReasoning: ['direction', 'direction3d'],
      analogicalReasoning: ['analogy', 'binary']
    };
    
    const types = typeMap[metricKey] || [];
    let total = 0, count = 0;
    
    sessions.forEach(s => {
      if (s.questionTypeAccuracy) {
        types.forEach(type => {
          if (s.questionTypeAccuracy[type] !== undefined) {
            total += s.questionTypeAccuracy[type];
            count++;
          }
        });
      } else if (s.accuracy !== undefined) {
        total += s.accuracy;
        count++;
      }
    });
    
    return count > 0 ? total / count : null;
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // TREND CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  calculateTrends(allData) {
    const trends = {};
    Object.keys(this.CATEGORIES).forEach(catId => {
      if (catId === 'overview') return;
      trends[catId] = this.calculateCategoryTrend(catId, allData);
    });
    return trends;
  },

  calculateCategoryTrend(categoryId, allData) {
    // Compare recent performance to older performance
    const metrics = Object.entries(this.METRICS).filter(([_, m]) => m.category === categoryId);
    let trendSum = 0, count = 0;
    
    metrics.forEach(([key]) => {
      const trend = this.getMetricTrend(key, allData);
      if (trend !== null) {
        trendSum += trend;
        count++;
      }
    });
    
    return count > 0 ? trendSum / count : 0;
  },

  getMetricTrend(metricKey, allData = null) {
    if (!allData) allData = this.getAllGameData();
    const metric = this.METRICS[metricKey];
    if (!metric) return null;
    
    // Get all relevant sessions with timestamps
    let allSessions = [];
    metric.sources.forEach(gameId => {
      const sessions = allData[gameId] || [];
      allSessions = allSessions.concat(sessions.map(s => ({ ...s, gameId })));
    });
    
    if (allSessions.length < 4) return null;
    
    // Sort by timestamp
    allSessions.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    
    // Split into halves
    const mid = Math.floor(allSessions.length / 2);
    const olderHalf = allSessions.slice(0, mid);
    const newerHalf = allSessions.slice(mid);
    
    // Calculate metric for each half
    const olderData = {};
    const newerData = {};
    metric.sources.forEach(gameId => {
      olderData[gameId] = olderHalf.filter(s => s.gameId === gameId);
      newerData[gameId] = newerHalf.filter(s => s.gameId === gameId);
    });
    
    const olderValue = this.getMetricValue(metricKey, olderData);
    const newerValue = this.getMetricValue(metricKey, newerData);
    
    if (olderValue === null || newerValue === null || olderValue === 0) return null;
    
    return (newerValue - olderValue) / Math.abs(olderValue);
  },

  getMetricCalculation(metricKey) {
    const allData = this.getAllGameData();
    const metric = this.METRICS[metricKey];
    if (!metric) return null;
    
    // Generate human-readable calculation string
    switch (metricKey) {
      case 'dPrime': {
        const hr = this.calculateHitRate(allData);
        const far = this.calculateFalseAlarmRate(allData);
        if (hr === null || far === null) return null;
        const zHr = this.zScore(hr);
        const zFar = this.zScore(far);
        return `Z(${(hr*100).toFixed(1)}%) - Z(${(far*100).toFixed(1)}%) = ${zHr.toFixed(2)} - ${zFar.toFixed(2)} = ${(zHr - zFar).toFixed(2)}`;
      }
      case 'wmCapacity': {
        const nbackGames = ['3d-hyper-nback', 'quad-box'];
        let example = null;
        nbackGames.forEach(gameId => {
          const sessions = allData[gameId] || [];
          if (sessions.length > 0 && !example) {
            const s = sessions[sessions.length - 1];
            const level = s.microLevel || s.level || s.nBack || 0;
            const acc = s.accuracy || 0;
            const stim = s.stimuliCount || 4;
            example = `${level.toFixed(1)} × ${(acc*100).toFixed(0)}% × √${stim} = ${(level * acc * Math.sqrt(stim)).toFixed(2)}`;
          }
        });
        return example;
      }
      case 'visualAttentionCapacity': {
        const sessions = allData['jiggle-factorial'] || [];
        if (sessions.length === 0) return null;
        const s = sessions[sessions.length - 1];
        const objects = s.level || 3;
        const acc = s.accuracy || 0;
        return `${objects} objects × ${(acc*100).toFixed(0)}% = ${(objects * acc).toFixed(2)}`;
      }
      default:
        return null;
    }
  },

  getCategoryHistoricalData(categoryId) {
    const allData = this.getAllGameData();
    const metrics = Object.entries(this.METRICS).filter(([_, m]) => m.category === categoryId);
    
    // Collect all sessions with timestamps
    let allSessions = [];
    const relevantGames = new Set();
    metrics.forEach(([_, m]) => m.sources.forEach(s => relevantGames.add(s)));
    
    relevantGames.forEach(gameId => {
      const sessions = allData[gameId] || [];
      allSessions = allSessions.concat(sessions.map(s => ({ ...s, gameId })));
    });
    
    // Sort by date
    allSessions.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    
    return allSessions;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHART INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  initOverviewCharts() {
    this.initCognitiveRadar();
    this.initCognitiveTimeline();
  },

  initCognitiveRadar() {
    const canvas = document.getElementById('chart-cognitive-radar');
    if (!canvas) return;
    
    const allData = this.getAllGameData();
    const scores = this.calculateAllCognitiveScores(allData);
    
    const categories = Object.entries(this.CATEGORIES).filter(([id]) => id !== 'overview');
    const labels = categories.map(([_, c]) => c.name);
    const data = categories.map(([id]) => (scores[id] || 0) * 100);
    const colors = categories.map(([_, c]) => c.color);
    
    this.charts.radar = new Chart(canvas, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Cognitive Profile',
          data,
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4CAF50',
          borderWidth: 2,
          pointBackgroundColor: colors,
          pointBorderColor: '#fff',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#888', backdropColor: 'transparent' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#eee', font: { size: 11 } }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  },

  initCognitiveTimeline() {
    const canvas = document.getElementById('chart-cognitive-timeline');
    if (!canvas) return;
    
    const allData = this.getAllGameData();
    
    // Aggregate all sessions by date
    let allSessions = [];
    Object.entries(allData).forEach(([gameId, sessions]) => {
      sessions.forEach(s => allSessions.push({ ...s, gameId }));
    });
    
    allSessions.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    
    // Group by date and calculate daily scores
    const dailyScores = {};
    allSessions.forEach(s => {
      const date = s.date || new Date(s.timestamp).toISOString().split('T')[0];
      if (!dailyScores[date]) {
        dailyScores[date] = { sessions: [], accuracy: 0, count: 0 };
      }
      dailyScores[date].sessions.push(s);
      if (s.accuracy !== undefined) {
        dailyScores[date].accuracy += s.accuracy;
        dailyScores[date].count++;
      }
    });
    
    const dates = Object.keys(dailyScores).slice(-30); // Last 30 days
    const avgAccuracies = dates.map(d => 
      dailyScores[d].count > 0 ? (dailyScores[d].accuracy / dailyScores[d].count) * 100 : null
    );
    
    this.charts.timeline = new Chart(canvas, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Overall Performance',
          data: avgAccuracies,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.3,
          spanGaps: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#aaa' } }
        },
        scales: {
          y: { 
            min: 0, max: 100,
            title: { display: true, text: 'Accuracy %', color: '#888' },
            ticks: { color: '#888' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: '#888', maxRotation: 45 },
            grid: { color: 'rgba(255,255,255,0.05)' }
          }
        }
      }
    });
  },

  initCategoryCharts(categoryId) {
    const canvas = document.getElementById('chart-category-timeline');
    if (!canvas) return;
    
    const historicalData = this.getCategoryHistoricalData(categoryId);
    const category = this.CATEGORIES[categoryId];
    
    // Group by date
    const byDate = {};
    historicalData.forEach(s => {
      const date = s.date || new Date(s.timestamp).toISOString().split('T')[0];
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(s);
    });
    
    const dates = Object.keys(byDate).slice(-30);
    const avgScores = dates.map(d => {
      const sessions = byDate[d];
      const acc = sessions.reduce((a, s) => a + (s.accuracy || 0), 0) / sessions.length;
      return acc * 100;
    });
    
    this.charts.categoryTimeline = new Chart(canvas, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: `${category.name} Performance`,
          data: avgScores,
          borderColor: category.color,
          backgroundColor: category.color + '20',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#aaa' } }
        },
        scales: {
          y: {
            min: 0, max: 100,
            title: { display: true, text: 'Score', color: '#888' },
            ticks: { color: '#888' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: '#888', maxRotation: 45 },
            grid: { color: 'rgba(255,255,255,0.05)' }
          }
        }
      }
    });
    
    // Initialize sparklines for each metric
    this.initMetricSparklines(categoryId);
  },

  initMetricSparklines(categoryId) {
    const metrics = Object.entries(this.METRICS).filter(([_, m]) => m.category === categoryId);
    const allData = this.getAllGameData();
    
    metrics.forEach(([key, metric]) => {
      const container = document.getElementById(`sparkline-${key}`);
      if (!container) return;
      
      // Get historical values for this metric
      const values = this.getMetricHistory(key, allData);
      if (values.length < 2) {
        container.innerHTML = '<span style="color:#666;font-size:10px;">Not enough data</span>';
        return;
      }
      
      // Create mini sparkline
      const width = 150;
      const height = 30;
      const max = Math.max(...values);
      const min = Math.min(...values);
      const range = max - min || 1;
      
      const points = values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
      }).join(' ');
      
      const category = this.CATEGORIES[categoryId];
      container.innerHTML = `
        <svg width="${width}" height="${height}" style="display:block;">
          <polyline points="${points}" fill="none" stroke="${category.color}" stroke-width="1.5"/>
        </svg>
      `;
    });
  },

  getMetricHistory(metricKey, allData) {
    const metric = this.METRICS[metricKey];
    if (!metric) return [];
    
    // Collect sessions from all sources
    let allSessions = [];
    metric.sources.forEach(gameId => {
      const sessions = allData[gameId] || [];
      allSessions = allSessions.concat(sessions);
    });
    
    // Sort by timestamp
    allSessions.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    
    // Calculate metric value for each session (simplified)
    return allSessions.map(s => s.accuracy || 0).slice(-20);
  },

  showMetricDetail(metricKey) {
    const metric = this.METRICS[metricKey];
    if (!metric) return;
    
    const value = this.getMetricValue(metricKey);
    const calculation = this.getMetricCalculation(metricKey);
    const trend = this.getMetricTrend(metricKey);
    
    alert(`${metric.name}\n\nValue: ${value !== null ? value.toFixed(3) : 'N/A'} ${metric.unit}\n\nFormula: ${metric.formula}\n\n${calculation ? 'Calculation: ' + calculation : ''}\n\nTrend: ${trend !== null ? (trend * 100).toFixed(1) + '%' : 'N/A'}\n\nDescription: ${metric.description}\n\nData sources: ${metric.sources.join(', ')}`);
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════════════════════════
  getStyles() {
    return `
      #cognitive-metrics-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.97); z-index: 10000;
        opacity: 0; transition: opacity 0.3s;
        overflow-y: auto;
      }
      #cognitive-metrics-overlay.visible { opacity: 1; }
      
      .cmd-container {
        max-width: 1600px; margin: 0 auto; padding: 15px;
        min-height: 100vh;
      }
      
      .cmd-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 15px 0; border-bottom: 1px solid #333; margin-bottom: 15px;
        flex-wrap: wrap; gap: 10px;
      }
      .cmd-title { color: #fff; font-size: 22px; font-weight: 600; }
      
      .cmd-time-filter {
        display: flex; gap: 5px;
      }
      .cmd-time-btn {
        background: #1a1a1a; border: 1px solid #333; color: #888;
        padding: 6px 12px; border-radius: 4px; cursor: pointer;
        font-size: 11px; transition: all 0.2s;
      }
      .cmd-time-btn:hover { background: #252525; color: #fff; }
      .cmd-time-btn.active { background: #333; color: #fff; border-color: #4CAF50; }
      
      .cmd-close {
        background: rgba(244,67,54,0.2); border: 1px solid rgba(244,67,54,0.4);
        color: #fff; width: 40px; height: 40px; border-radius: 50%;
        cursor: pointer; font-size: 22px; transition: all 0.2s;
      }
      .cmd-close:hover { background: rgba(244,67,54,0.4); transform: scale(1.1); }
      
      .cmd-tabs {
        display: flex; gap: 5px; padding: 10px 0; overflow-x: auto;
        border-bottom: 1px solid #333; margin-bottom: 20px;
      }
      .cmd-tab {
        background: #1a1a1a; border: 1px solid #333; color: #888;
        padding: 10px 16px; border-radius: 6px; cursor: pointer;
        font-size: 13px; white-space: nowrap; transition: all 0.2s;
      }
      .cmd-tab:hover { background: #252525; color: #fff; }
      .cmd-tab.active { background: #333; color: #fff; border-color: #4CAF50; }
      
      .cmd-content { padding-bottom: 30px; }
      
      .cmd-grid { display: flex; flex-direction: column; gap: 20px; }
      
      .cmd-panel {
        background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
        border: 1px solid #333; border-radius: 8px; padding: 20px;
      }
      .cmd-panel-half { flex: 1; min-width: 300px; }
      .cmd-panel-full { width: 100%; }
      .cmd-panel-title { 
        color: #4CAF50; font-size: 14px; font-weight: 600; 
        margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #333;
      }
      
      /* Domain Cards */
      .cmd-domain-cards { display: flex; flex-direction: column; gap: 10px; }
      .cmd-domain-card {
        display: flex; align-items: center; gap: 12px;
        background: #0f0f0f; border-left: 3px solid #4CAF50;
        border-radius: 4px; padding: 12px 15px;
      }
      .cmd-domain-icon { font-size: 24px; }
      .cmd-domain-info { flex: 1; }
      .cmd-domain-name { color: #aaa; font-size: 11px; text-transform: uppercase; }
      .cmd-domain-score { color: #fff; font-size: 24px; font-weight: 700; }
      .cmd-domain-trend { font-size: 18px; font-weight: bold; }
      
      /* Metrics Grid */
      .cmd-metrics-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }
      .cmd-metric-card {
        background: #0f0f0f; border-radius: 6px; padding: 15px;
        cursor: pointer; transition: all 0.2s;
      }
      .cmd-metric-card:hover { background: #1a1a1a; transform: translateY(-2px); }
      .cmd-metric-header {
        display: flex; align-items: center; gap: 8px;
        padding-bottom: 8px; margin-bottom: 8px;
        border-bottom: 2px solid #333;
      }
      .cmd-metric-icon { font-size: 16px; }
      .cmd-metric-name { flex: 1; color: #aaa; font-size: 11px; text-transform: uppercase; }
      .cmd-info-btn { 
        background: none; border: none; cursor: pointer; 
        font-size: 12px; opacity: 0.5; transition: opacity 0.2s;
      }
      .cmd-info-btn:hover { opacity: 1; }
      .cmd-metric-value { color: #fff; font-size: 28px; font-weight: 700; }
      .cmd-metric-unit { color: #666; font-size: 11px; }
      
      /* Category Header */
      .cmd-category-header {
        display: flex; align-items: center; gap: 20px;
        border-top: 3px solid #4CAF50;
      }
      .cmd-cat-icon { font-size: 48px; }
      .cmd-cat-info h2 { color: #fff; margin: 0 0 5px 0; font-size: 24px; }
      .cmd-cat-info p { color: #888; margin: 0; font-size: 12px; }
      
      /* Detailed Metrics */
      .cmd-detailed-metrics {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 15px;
      }
      .cmd-detailed-metric {
        background: #0f0f0f; border-radius: 6px; padding: 15px;
      }
      .cmd-dm-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 8px;
      }
      .cmd-dm-name { color: #fff; font-size: 13px; font-weight: 600; }
      .cmd-dm-trend { font-size: 12px; font-weight: bold; }
      .cmd-dm-value-row { display: flex; align-items: baseline; gap: 5px; margin-bottom: 8px; }
      .cmd-dm-value { font-size: 32px; font-weight: 700; }
      .cmd-dm-unit { color: #666; font-size: 12px; }
      .cmd-dm-description { color: #888; font-size: 11px; margin-bottom: 10px; line-height: 1.4; }
      
      .cmd-dm-formula {
        background: #1a1a1a; border-radius: 4px; margin-bottom: 10px;
      }
      .cmd-dm-formula summary {
        padding: 8px 10px; cursor: pointer; color: #888; font-size: 11px;
        user-select: none;
      }
      .cmd-dm-formula summary:hover { color: #fff; }
      .cmd-formula-content {
        padding: 10px; border-top: 1px solid #333; font-size: 11px;
      }
      .cmd-formula-eq { margin-bottom: 8px; }
      .cmd-formula-eq code { 
        background: #252525; padding: 2px 6px; border-radius: 3px; 
        color: #4CAF50; font-family: monospace;
      }
      .cmd-formula-calc { margin-bottom: 8px; color: #aaa; }
      .cmd-formula-calc code { 
        display: block; margin-top: 4px;
        background: #252525; padding: 6px 8px; border-radius: 3px;
        color: #2196F3; font-family: monospace;
      }
      .cmd-formula-sources { color: #666; }
      
      .cmd-dm-sparkline { margin-top: 10px; }
      
      /* Games Grid */
      .cmd-games-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
      }
      .cmd-game-card {
        display: flex; align-items: center; gap: 10px;
        background: #0f0f0f; border-radius: 4px; padding: 12px;
      }
      .cmd-game-icon { font-size: 20px; }
      .cmd-game-name { flex: 1; color: #fff; font-size: 12px; }
      .cmd-game-sessions { color: #888; font-size: 10px; }
      
      /* Responsive */
      @media (min-width: 768px) {
        .cmd-grid { flex-direction: row; flex-wrap: wrap; }
        .cmd-panel-half { flex: 1 1 45%; }
      }
      
      canvas { max-height: 250px; }
    `;
  }
};

// Global function to open the dashboard
window.openCognitiveMetrics = function() {
  window.CognitiveMetricsDashboard.show();
};

// Also expose as UnifiedStatisticsManager for backward compatibility
window.UnifiedStatisticsManager = {
  show: () => window.CognitiveMetricsDashboard.show(),
  destroy: () => window.CognitiveMetricsDashboard.destroy()
};
