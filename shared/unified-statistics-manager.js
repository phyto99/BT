// Unified Statistics Manager - Information Dense Tabbed Dashboard
// Provides cross-game analytics with per-game tabs and unified overview

window.UnifiedStatisticsManager = {
  activeTab: 'overview',
  charts: {},
  timeRange: 'all', // 'all', '7d', '30d', 'now'
  
  COGNITIVE_DOMAINS: {
    memory: { name: 'Working Memory', icon: '🧠', color: '#2196F3' },
    attention: { name: 'Attention', icon: '👁️', color: '#9C27B0' },
    speed: { name: 'Processing Speed', icon: '⚡', color: '#E91E63' },
    reasoning: { name: 'Reasoning', icon: '🧩', color: '#00BCD4' },
    spatial: { name: 'Spatial', icon: '🗺️', color: '#8BC34A' },
    signal: { name: 'Signal Detection', icon: '🎯', color: '#FF9800' }
  },
  
  GAMES: {
    'jiggle-factorial': { name: 'Jiggle Factorial', icon: '🎯', color: '#4CAF50' },
    '3d-hyper-nback': { name: '3D Hyper N-Back', icon: '🧠', color: '#2196F3' },
    'dichotic-dual-nback': { name: 'Dichotic Dual', icon: '🎧', color: '#9C27B0' },
    'quad-box': { name: 'Quad Box', icon: '📦', color: '#FF9800' },
    'fast-sequence-nback': { name: 'Fast Sequence', icon: '⚡', color: '#E91E63' },
    'multiple': { name: 'Multiple N-Back', icon: '🔢', color: '#00BCD4' },
    'syllogimous-v4': { name: 'Syllogimous', icon: '🧩', color: '#8BC34A' }
  },

  show(gameId = null) {
    this.destroy();
    this.activeTab = gameId || 'overview';
    
    const overlay = document.createElement('div');
    overlay.id = 'unified-stats-overlay';
    overlay.innerHTML = this.getHTML();
    document.body.appendChild(overlay);
    
    this.bindEvents();
    this.renderTab(this.activeTab);
    
    requestAnimationFrame(() => overlay.classList.add('visible'));
  },

  destroy() {
    Object.values(this.charts).forEach(c => c?.destroy?.());
    this.charts = {};
    document.getElementById('unified-stats-overlay')?.remove();
  },

  getHTML() {
    const tabs = this.getTabsHTML();
    return `
      <style>${this.getStyles()}</style>
      <div class="usm-container">
        <div class="usm-header">
          <div class="usm-title">📊 Unified Statistics</div>
          <button class="usm-close" onclick="UnifiedStatisticsManager.destroy()">×</button>
        </div>
        <div class="usm-tabs">${tabs}</div>
        <div class="usm-content" id="usm-content"></div>
      </div>
    `;
  },

  getTabsHTML() {
    let html = `<button class="usm-tab ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">📈 Overview</button>`;
    Object.entries(this.GAMES).forEach(([id, game]) => {
      const hasData = this.hasGameData(id);
      html += `<button class="usm-tab ${this.activeTab === id ? 'active' : ''} ${!hasData ? 'no-data' : ''}" data-tab="${id}">${game.icon} ${game.name}</button>`;
    });
    return html;
  },

  hasGameData(gameId) {
    const stats = window.gameStats?.getStats(gameId);
    return stats && stats.length > 0;
  },

  bindEvents() {
    document.querySelectorAll('.usm-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.usm-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeTab = tab.dataset.tab;
        this.renderTab(this.activeTab);
      });
    });
    
    // Time range buttons
    document.querySelectorAll('.usm-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.usm-time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.timeRange = btn.dataset.range;
        this.renderTab(this.activeTab);
      });
    });
  },

  renderTab(tabId) {
    const content = document.getElementById('usm-content');
    if (!content) return;
    
    Object.values(this.charts).forEach(c => c?.destroy?.());
    this.charts = {};
    
    if (tabId === 'overview') {
      content.innerHTML = this.renderOverview();
      this.initOverviewCharts();
    } else {
      content.innerHTML = this.renderGameTab(tabId);
      this.initGameCharts(tabId);
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // OVERVIEW TAB - Cross-game unified view
  // ═══════════════════════════════════════════════════════════════
  renderOverview() {
    const allStats = this.getAllGameStats();
    const totals = this.calculateTotals(allStats);
    const cognitiveScores = this.calculateCognitiveScores(allStats);
    
    return `
      <div class="usm-grid">
        <!-- Summary Cards Row -->
        <div class="usm-row usm-summary-row">
          ${this.renderSummaryCard('Total Sessions', totals.sessions, '🎮', '#4CAF50')}
          ${this.renderSummaryCard('Total Time', this.formatTime(totals.time), '⏱️', '#2196F3')}
          ${this.renderSummaryCard('Avg Accuracy', (totals.accuracy * 100).toFixed(1) + '%', '🎯', '#FF9800')}
          ${this.renderSummaryCard('Games Played', totals.gamesPlayed, '📊', '#9C27B0')}
        </div>
        
        <!-- Time Range Selector -->
        <div class="usm-row">
          <div class="usm-time-selector">
            <button class="usm-time-btn ${this.timeRange === 'all' ? 'active' : ''}" data-range="all">All Time</button>
            <button class="usm-time-btn ${this.timeRange === '7d' ? 'active' : ''}" data-range="7d">7 Days</button>
            <button class="usm-time-btn ${this.timeRange === '30d' ? 'active' : ''}" data-range="30d">30 Days</button>
            <button class="usm-time-btn ${this.timeRange === 'now' ? 'active' : ''}" data-range="now">Now</button>
          </div>
        </div>
        
        <!-- Main Content Row: Domain Scores (left) + Cognitive Profile (right) -->
        <div class="usm-row usm-main-content">
          <div class="usm-panel usm-panel-third">
            <div class="usm-panel-title">📊 Domain Scores</div>
            <div class="usm-domain-scores">
              ${this.renderDomainScores(cognitiveScores)}
            </div>
          </div>
          <div class="usm-panel usm-panel-twothirds">
            <div class="usm-panel-title">${this.timeRange === 'now' ? '🎯 Cognitive Profile' : '📈 Cognitive Profile Over Time'}</div>
            ${this.timeRange === 'now' 
              ? '<canvas id="chart-cognitive-hex"></canvas>' 
              : '<canvas id="chart-cognitive-timeline"></canvas>'}
          </div>
        </div>
        
        <!-- Secondary Charts Row -->
        <div class="usm-row">
          <div class="usm-panel usm-panel-half">
            <div class="usm-panel-title">Sessions by Game</div>
            <canvas id="chart-sessions-by-game"></canvas>
          </div>
          <div class="usm-panel usm-panel-half">
            <div class="usm-panel-title">Time Distribution</div>
            <canvas id="chart-time-distribution"></canvas>
          </div>
        </div>
        
        <!-- Per-Game Quick Stats -->
        <div class="usm-row usm-game-cards">
          ${this.renderGameQuickStats(allStats)}
        </div>
      </div>
    `;
  },

  renderSummaryCard(label, value, icon, color) {
    return `
      <div class="usm-summary-card" style="border-left-color: ${color}">
        <div class="usm-summary-icon">${icon}</div>
        <div class="usm-summary-content">
          <div class="usm-summary-value">${value}</div>
          <div class="usm-summary-label">${label}</div>
        </div>
      </div>
    `;
  },

  renderGameQuickStats(allStats) {
    let html = '';
    Object.entries(this.GAMES).forEach(([id, game]) => {
      const stats = allStats[id] || { sessions: [], count: 0 };
      if (stats.count === 0) return;
      
      const avg = this.calculateGameAverages(stats.sessions, id);
      html += `
        <div class="usm-game-card" style="border-top-color: ${game.color}">
          <div class="usm-game-card-header">
            <span class="usm-game-icon">${game.icon}</span>
            <span class="usm-game-name">${game.name}</span>
          </div>
          <div class="usm-game-card-stats">
            <div class="usm-stat"><span class="usm-stat-val">${stats.count}</span><span class="usm-stat-lbl">Sessions</span></div>
            <div class="usm-stat"><span class="usm-stat-val">${(avg.accuracy * 100).toFixed(0)}%</span><span class="usm-stat-lbl">Accuracy</span></div>
            <div class="usm-stat"><span class="usm-stat-val">${avg.level.toFixed(1)}</span><span class="usm-stat-lbl">Avg Level</span></div>
          </div>
        </div>
      `;
    });
    return html || '<div class="usm-empty">No game data yet</div>';
  },

  // ═══════════════════════════════════════════════════════════════
  // GAME-SPECIFIC TAB
  // ═══════════════════════════════════════════════════════════════
  renderGameTab(gameId) {
    const game = this.GAMES[gameId];
    const sessions = window.gameStats?.getStats(gameId) || [];
    const detailed = window.gameStats?.getDetailedAnalytics(gameId);
    
    if (sessions.length === 0) {
      return `<div class="usm-empty-state">
        <div class="usm-empty-icon">${game?.icon || '📊'}</div>
        <div class="usm-empty-text">No data for ${game?.name || gameId}</div>
        <div class="usm-empty-hint">Play some sessions to see statistics</div>
      </div>`;
    }
    
    const avg = this.calculateGameAverages(sessions, gameId);
    const recent = sessions.slice(-10);
    const trend = this.calculateTrend(sessions);
    
    return `
      <div class="usm-grid">
        <!-- Key Metrics -->
        <div class="usm-row usm-metrics-row">
          ${this.renderMetricCard('Sessions', sessions.length, '📊', game.color)}
          ${this.renderMetricCard('Avg Score', avg.score.toFixed(1), '⭐', '#FFD700')}
          ${this.renderMetricCard('Accuracy', (avg.accuracy * 100).toFixed(1) + '%', '🎯', '#4CAF50')}
          ${this.renderMetricCard('Avg Level', avg.level.toFixed(2), '📈', '#2196F3')}
          ${this.renderMetricCard('Best Score', avg.bestScore.toFixed(1), '🏆', '#FF9800')}
          ${this.renderMetricCard('Trend', trend > 0 ? '↑' : trend < 0 ? '↓' : '→', trend > 0 ? '📈' : '📉', trend > 0 ? '#4CAF50' : '#f44336')}
        </div>
        
        <!-- Main Chart -->
        <div class="usm-row">
          <div class="usm-panel usm-panel-full">
            <div class="usm-panel-title">Performance Over Time</div>
            <canvas id="chart-game-timeline"></canvas>
          </div>
        </div>
        
        <!-- Secondary Charts -->
        <div class="usm-row">
          <div class="usm-panel usm-panel-half">
            <div class="usm-panel-title">Score Distribution</div>
            <canvas id="chart-score-dist"></canvas>
          </div>
          <div class="usm-panel usm-panel-half">
            <div class="usm-panel-title">Level Progression</div>
            <canvas id="chart-level-prog"></canvas>
          </div>
        </div>
        
        ${this.renderGameSpecificMetrics(gameId, detailed)}
        
        <!-- Session History -->
        <div class="usm-row">
          <div class="usm-panel usm-panel-full">
            <div class="usm-panel-title">Recent Sessions</div>
            ${this.renderSessionTable(recent, gameId)}
          </div>
        </div>
      </div>
    `;
  },

  renderMetricCard(label, value, icon, color) {
    return `
      <div class="usm-metric-card">
        <div class="usm-metric-icon" style="color: ${color}">${icon}</div>
        <div class="usm-metric-value">${value}</div>
        <div class="usm-metric-label">${label}</div>
      </div>
    `;
  },

  renderGameSpecificMetrics(gameId, detailed) {
    if (!detailed) return '';
    
    if (gameId === '3d-hyper-nback' && detailed.type === 'hyper-nback') {
      return `
        <div class="usm-row">
          <div class="usm-panel usm-panel-full">
            <div class="usm-panel-title">N-Back Specific Metrics</div>
            <div class="usm-metrics-grid">
              ${this.renderMetricCard("d' Prime", detailed.averages.dPrime?.toFixed(2) || 'N/A', '🧠', '#9C27B0')}
              ${this.renderMetricCard('Hit Rate', ((detailed.averages.hitRate || 0) * 100).toFixed(1) + '%', '✓', '#4CAF50')}
              ${this.renderMetricCard('False Alarm', ((detailed.averages.falseAlarmRate || 0) * 100).toFixed(1) + '%', '✗', '#f44336')}
              ${this.renderMetricCard('Lure Resist', ((detailed.averages.lureResistance || 0) * 100).toFixed(0) + '%', '🛡️', '#2196F3')}
            </div>
          </div>
        </div>
      `;
    }
    return '';
  },

  renderSessionTable(sessions, gameId) {
    if (!sessions.length) return '<div class="usm-empty">No sessions</div>';
    
    const reversed = [...sessions].reverse();
    let html = `<table class="usm-table">
      <thead><tr>
        <th>Date</th><th>Score</th><th>Accuracy</th><th>Level</th><th>Duration</th>
      </tr></thead><tbody>`;
    
    reversed.forEach(s => {
      html += `<tr>
        <td>${s.date || 'N/A'}</td>
        <td>${(s.score || 0).toFixed(1)}</td>
        <td>${((s.accuracy || 0) * 100).toFixed(1)}%</td>
        <td>${(s.level || s.microLevel || s.nBack || 0).toFixed(2)}</td>
        <td>${this.formatTime(s.duration || 0)}</td>
      </tr>`;
    });
    
    return html + '</tbody></table>';
  },

  // ═══════════════════════════════════════════════════════════════
  // CHART INITIALIZATION
  // ═══════════════════════════════════════════════════════════════
  initOverviewCharts() {
    const allStats = this.getAllGameStats();
    
    // Sessions by Game (Doughnut)
    const sessionsCtx = document.getElementById('chart-sessions-by-game');
    if (sessionsCtx) {
      const data = Object.entries(this.GAMES).map(([id, game]) => ({
        label: game.name,
        value: allStats[id]?.count || 0,
        color: game.color
      })).filter(d => d.value > 0);
      
      this.charts.sessionsByGame = new Chart(sessionsCtx, {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right', labels: { color: '#aaa', font: { size: 10 } } } }
        }
      });
    }
    
    // Time Distribution (Bar)
    const timeCtx = document.getElementById('chart-time-distribution');
    if (timeCtx) {
      const data = Object.entries(this.GAMES).map(([id, game]) => ({
        label: game.name,
        value: this.calculateTotalTime(allStats[id]?.sessions || []),
        color: game.color
      })).filter(d => d.value > 0);
      
      this.charts.timeDistribution = new Chart(timeCtx, {
        type: 'bar',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            data: data.map(d => d.value / 60),
            backgroundColor: data.map(d => d.color + '80'),
            borderColor: data.map(d => d.color),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { title: { display: true, text: 'Minutes', color: '#888' }, ticks: { color: '#888' }, grid: { color: '#333' } },
            x: { ticks: { color: '#888' }, grid: { display: false } }
          }
        }
      });
    }
    
    // Combined Timeline (Line)
    const timelineCtx = document.getElementById('chart-combined-timeline');
    if (timelineCtx) {
      const datasets = [];
      Object.entries(this.GAMES).forEach(([id, game]) => {
        const sessions = allStats[id]?.sessions || [];
        if (sessions.length > 0) {
          datasets.push({
            label: game.name,
            data: sessions.map((s, i) => ({ x: i, y: (s.accuracy || 0) * 100 })),
            borderColor: game.color,
            backgroundColor: game.color + '20',
            tension: 0.3,
            fill: false,
            pointRadius: 2
          });
        }
      });
      
      this.charts.combinedTimeline = new Chart(timelineCtx, {
        type: 'line',
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#aaa', font: { size: 10 } } } },
          scales: {
            y: { title: { display: true, text: 'Accuracy %', color: '#888' }, ticks: { color: '#888' }, grid: { color: '#333' }, min: 0, max: 100 },
            x: { title: { display: true, text: 'Session', color: '#888' }, ticks: { color: '#888' }, grid: { color: '#222' } }
          }
        }
      });
    }
  },

  initGameCharts(gameId) {
    const sessions = window.gameStats?.getStats(gameId) || [];
    if (sessions.length === 0) return;
    
    const game = this.GAMES[gameId];
    
    // Performance Timeline
    const timelineCtx = document.getElementById('chart-game-timeline');
    if (timelineCtx) {
      this.charts.gameTimeline = new Chart(timelineCtx, {
        type: 'line',
        data: {
          labels: sessions.map((s, i) => s.date || `S${i + 1}`),
          datasets: [
            { label: 'Score', data: sessions.map(s => s.score || 0), borderColor: game.color, backgroundColor: game.color + '20', tension: 0.3, yAxisID: 'y' },
            { label: 'Accuracy %', data: sessions.map(s => (s.accuracy || 0) * 100), borderColor: '#4CAF50', borderDash: [5, 5], tension: 0.3, yAxisID: 'y1' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { labels: { color: '#aaa' } } },
          scales: {
            y: { type: 'linear', position: 'left', title: { display: true, text: 'Score', color: '#888' }, ticks: { color: '#888' }, grid: { color: '#333' } },
            y1: { type: 'linear', position: 'right', title: { display: true, text: 'Accuracy %', color: '#888' }, ticks: { color: '#888' }, grid: { display: false }, min: 0, max: 100 },
            x: { ticks: { color: '#888', maxRotation: 45 }, grid: { color: '#222' } }
          }
        }
      });
    }
    
    // Score Distribution
    const distCtx = document.getElementById('chart-score-dist');
    if (distCtx) {
      const scores = sessions.map(s => s.score || 0);
      const bins = this.createHistogramBins(scores, 10);
      
      this.charts.scoreDist = new Chart(distCtx, {
        type: 'bar',
        data: {
          labels: bins.map(b => b.label),
          datasets: [{ data: bins.map(b => b.count), backgroundColor: game.color + '80', borderColor: game.color, borderWidth: 1 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { title: { display: true, text: 'Count', color: '#888' }, ticks: { color: '#888' }, grid: { color: '#333' } },
            x: { ticks: { color: '#888' }, grid: { display: false } }
          }
        }
      });
    }
    
    // Level Progression
    const levelCtx = document.getElementById('chart-level-prog');
    if (levelCtx) {
      this.charts.levelProg = new Chart(levelCtx, {
        type: 'line',
        data: {
          labels: sessions.map((s, i) => i + 1),
          datasets: [{ label: 'Level', data: sessions.map(s => s.level || s.microLevel || s.nBack || 0), borderColor: '#FF9800', backgroundColor: '#FF980020', fill: true, tension: 0.3 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { title: { display: true, text: 'Level', color: '#888' }, ticks: { color: '#888' }, grid: { color: '#333' } },
            x: { title: { display: true, text: 'Session', color: '#888' }, ticks: { color: '#888' }, grid: { color: '#222' } }
          }
        }
      });
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // DATA HELPERS
  // ═══════════════════════════════════════════════════════════════
  getAllGameStats() {
    const result = {};
    Object.keys(this.GAMES).forEach(id => {
      const sessions = window.gameStats?.getStats(id) || [];
      result[id] = { sessions, count: sessions.length };
    });
    return result;
  },

  calculateTotals(allStats) {
    let sessions = 0, time = 0, accuracySum = 0, accuracyCount = 0, gamesPlayed = 0;
    
    Object.values(allStats).forEach(stat => {
      sessions += stat.count;
      if (stat.count > 0) gamesPlayed++;
      stat.sessions.forEach(s => {
        time += s.duration || 0;
        if (s.accuracy !== undefined) {
          accuracySum += s.accuracy;
          accuracyCount++;
        }
      });
    });
    
    return {
      sessions,
      time,
      accuracy: accuracyCount > 0 ? accuracySum / accuracyCount : 0,
      gamesPlayed
    };
  },

  calculateGameAverages(sessions, gameId) {
    if (!sessions.length) return { score: 0, accuracy: 0, level: 0, bestScore: 0 };
    
    let scoreSum = 0, accSum = 0, levelSum = 0, bestScore = 0;
    sessions.forEach(s => {
      const score = s.score || 0;
      scoreSum += score;
      accSum += s.accuracy || 0;
      levelSum += s.level || s.microLevel || s.nBack || 0;
      if (score > bestScore) bestScore = score;
    });
    
    return {
      score: scoreSum / sessions.length,
      accuracy: accSum / sessions.length,
      level: levelSum / sessions.length,
      bestScore
    };
  },

  calculateTotalTime(sessions) {
    return sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  },

  calculateTrend(sessions) {
    if (sessions.length < 3) return 0;
    const recent = sessions.slice(-5);
    const older = sessions.slice(-10, -5);
    if (older.length === 0) return 0;
    
    const recentAvg = recent.reduce((s, x) => s + (x.accuracy || 0), 0) / recent.length;
    const olderAvg = older.reduce((s, x) => s + (x.accuracy || 0), 0) / older.length;
    return recentAvg - olderAvg;
  },

  createHistogramBins(values, numBins) {
    if (!values.length) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / numBins || 1;
    
    const bins = Array(numBins).fill(0).map((_, i) => ({
      min: min + i * binWidth,
      max: min + (i + 1) * binWidth,
      count: 0,
      label: `${(min + i * binWidth).toFixed(0)}-${(min + (i + 1) * binWidth).toFixed(0)}`
    }));
    
    values.forEach(v => {
      const idx = Math.min(Math.floor((v - min) / binWidth), numBins - 1);
      if (idx >= 0) bins[idx].count++;
    });
    
    return bins;
  },

  formatTime(seconds) {
    if (!seconds) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  },

  // ═══════════════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════════════
  getStyles() {
    return `
      #unified-stats-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); z-index: 10000;
        opacity: 0; transition: opacity 0.3s;
      }
      #unified-stats-overlay.visible { opacity: 1; }
      
      .usm-container {
        max-width: 1400px; margin: 0 auto; height: 100%;
        display: flex; flex-direction: column; padding: 15px;
      }
      
      .usm-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 10px 0; border-bottom: 1px solid #333; margin-bottom: 10px;
      }
      .usm-title { color: #fff; font-size: 20px; font-weight: 600; }
      .usm-close {
        background: rgba(244,67,54,0.2); border: 1px solid rgba(244,67,54,0.4);
        color: #fff; width: 36px; height: 36px; border-radius: 50%;
        cursor: pointer; font-size: 20px; transition: all 0.2s;
      }
      .usm-close:hover { background: rgba(244,67,54,0.4); transform: scale(1.1); }
      
      .usm-tabs {
        display: flex; gap: 4px; padding: 8px 0; overflow-x: auto;
        border-bottom: 1px solid #333; margin-bottom: 15px;
      }
      .usm-tab {
        background: #1a1a1a; border: 1px solid #333; color: #888;
        padding: 8px 14px; border-radius: 4px; cursor: pointer;
        font-size: 12px; white-space: nowrap; transition: all 0.2s;
      }
      .usm-tab:hover { background: #252525; color: #fff; }
      .usm-tab.active { background: #333; color: #fff; border-color: #4CAF50; }
      .usm-tab.no-data { opacity: 0.5; }
      
      .usm-content { flex: 1; overflow-y: auto; }
      
      .usm-grid { display: flex; flex-direction: column; gap: 15px; }
      .usm-row { display: flex; gap: 15px; flex-wrap: wrap; }
      
      .usm-panel {
        background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
        border: 1px solid #333; border-radius: 6px; padding: 15px;
      }
      .usm-panel-half { flex: 1; min-width: 300px; }
      .usm-panel-full { flex: 1 1 100%; }
      .usm-panel-title { color: #4CAF50; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
      
      .usm-summary-row { justify-content: space-between; }
      .usm-summary-card {
        background: #1a1a1a; border-left: 3px solid #4CAF50;
        border-radius: 4px; padding: 12px 15px; display: flex;
        align-items: center; gap: 12px; flex: 1; min-width: 150px;
      }
      .usm-summary-icon { font-size: 24px; }
      .usm-summary-value { color: #fff; font-size: 22px; font-weight: 700; }
      .usm-summary-label { color: #888; font-size: 11px; text-transform: uppercase; }
      
      .usm-metrics-row { justify-content: flex-start; }
      .usm-metric-card {
        background: #1a1a1a; border-radius: 4px; padding: 12px;
        text-align: center; min-width: 100px; flex: 1;
      }
      .usm-metric-icon { font-size: 20px; margin-bottom: 5px; }
      .usm-metric-value { color: #fff; font-size: 18px; font-weight: 700; }
      .usm-metric-label { color: #888; font-size: 10px; text-transform: uppercase; margin-top: 3px; }
      
      .usm-metrics-grid { display: flex; gap: 10px; flex-wrap: wrap; }
      
      .usm-game-cards { flex-wrap: wrap; }
      .usm-game-card {
        background: #1a1a1a; border-top: 3px solid #4CAF50;
        border-radius: 4px; padding: 12px; min-width: 180px; flex: 1;
      }
      .usm-game-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
      .usm-game-icon { font-size: 18px; }
      .usm-game-name { color: #fff; font-size: 13px; font-weight: 600; }
      .usm-game-card-stats { display: flex; gap: 15px; }
      .usm-stat { text-align: center; }
      .usm-stat-val { display: block; color: #fff; font-size: 16px; font-weight: 700; }
      .usm-stat-lbl { color: #888; font-size: 9px; text-transform: uppercase; }
      
      .usm-table {
        width: 100%; border-collapse: collapse; font-size: 11px;
      }
      .usm-table th {
        text-align: left; padding: 8px; color: #888; border-bottom: 1px solid #333;
        text-transform: uppercase; font-size: 10px;
      }
      .usm-table td { padding: 8px; color: #ccc; border-bottom: 1px solid #222; }
      .usm-table tr:hover { background: rgba(255,255,255,0.02); }
      
      .usm-empty-state {
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; height: 300px; color: #666;
      }
      .usm-empty-icon { font-size: 48px; margin-bottom: 15px; opacity: 0.5; }
      .usm-empty-text { font-size: 16px; margin-bottom: 5px; }
      .usm-empty-hint { font-size: 12px; color: #555; }
      .usm-empty { color: #666; text-align: center; padding: 20px; }
      
      canvas { max-height: 200px; }
    `;
  }
};

// Global function to open stats for current game (for convenience)
window.openUnifiedStats = function(gameId) {
  const currentGame = gameId || window.unifiedBrainTraining?.currentGameId;
  window.UnifiedStatisticsManager.show(currentGame);
};
