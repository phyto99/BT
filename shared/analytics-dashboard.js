// Comprehensive Analytics Dashboard with D3.js
// Innovative multi-panel visualization system

window.AnalyticsDashboard = {
  show: function(gameId) {
    const detailed = window.gameStats?.getDetailedAnalytics(gameId);
    const sessions = window.gameStats?.getStats(gameId) || [];
    
    if (!sessions || sessions.length === 0) {
      alert('No statistics available for this game yet. Play some sessions first!');
      return;
    }
    
    // Create full-screen dashboard
    const dashboard = document.createElement('div');
    dashboard.id = 'analytics-dashboard';
    dashboard.innerHTML = this.getDashboardHTML(gameId, detailed, sessions);
    document.body.appendChild(dashboard);
    
    // Render all visualizations
    setTimeout(() => {
      this.renderAllCharts(gameId, detailed, sessions);
    }, 100);
  },
  
  getDashboardHTML: function(gameId, detailed, sessions) {
    const gameNames = {
      '3d-hyper-nback': '3D Hyper N-Back',
      'jiggle-factorial': 'Jiggle Factorial',
      'quad-box': 'Quad Box',
      'dichotic-dual-nback': 'Dichotic Dual N-Back'
    };
    
    return `
      <style>
        #analytics-dashboard {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0a0a0a;
          z-index: 10000;
          overflow-y: auto;
          animation: dashboardFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes dashboardFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 15px;
          padding: 20px;
          max-width: 1900px;
          margin: 0 auto;
        }
        .dashboard-panel {
          background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
          border: 1px solid #333;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .dashboard-panel:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(76, 175, 80, 0.2);
        }
        .panel-title {
          color: #4CAF50;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 15px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .metric-card {
          background: rgba(76, 175, 80, 0.05);
          border-left: 3px solid #4CAF50;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 12px;
        }
        .metric-label {
          color: #888;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .metric-value {
          color: #fff;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
        }
        .metric-subvalue {
          color: #aaa;
          font-size: 12px;
          margin-top: 5px;
        }
        .close-dashboard {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(244, 67, 54, 0.2);
          border: 1px solid rgba(244, 67, 54, 0.4);
          color: #fff;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-center;
          z-index: 10001;
          transition: all 0.2s;
        }
        .close-dashboard:hover {
          background: rgba(244, 67, 54, 0.4);
          transform: scale(1.1) rotate(90deg);
        }
      </style>
      
      <button class="close-dashboard" onclick="document.getElementById('analytics-dashboard').remove()">×</button>
      
      <div class="dashboard-grid">
        <!-- Header -->
        <div class="dashboard-panel" style="grid-column: 1 / -1;">
          <h1 style="color: #fff; margin: 0; font-size: 32px; display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 40px;">📊</span>
            ${gameNames[gameId] || gameId} Analytics Dashboard
          </h1>
          <p style="color: #888; margin: 10px 0 0 0; font-size: 14px;">
            Comprehensive performance analysis • ${sessions.length} sessions • Last played: ${sessions[sessions.length - 1]?.date || 'N/A'}
          </p>
        </div>
        
        <!-- Key Metrics Cards -->
        <div class="dashboard-panel" style="grid-column: span 3;">
          <div class="panel-title">⚡ Performance Overview</div>
          <div id="key-metrics-container"></div>
        </div>
        
        <!-- Progress Timeline -->
        <div class="dashboard-panel" style="grid-column: span 9;">
          <div class="panel-title">📈 Progress Timeline</div>
          <div id="timeline-chart" style="height: 280px;"></div>
        </div>
        
        <!-- Detailed Breakdown -->
        <div class="dashboard-panel" style="grid-column: span 6;">
          <div class="panel-title">🎯 Performance Breakdown</div>
          <div id="breakdown-chart" style="height: 350px;"></div>
        </div>
        
        <!-- Heatmap -->
        <div class="dashboard-panel" style="grid-column: span 6;">
          <div class="panel-title">🔥 Performance Heatmap</div>
          <div id="heatmap-chart" style="height: 350px;"></div>
        </div>
        
        <!-- Session History -->
        <div class="dashboard-panel" style="grid-column: span 6;">
          <div class="panel-title">📋 Session History</div>
          <div id="session-history" style="max-height: 300px; overflow-y: auto;"></div>
        </div>
        
        <!-- Statistical Summary -->
        <div class="dashboard-panel" style="grid-column: span 6;">
          <div class="panel-title">📊 Statistical Analysis</div>
          <div id="stats-summary"></div>
        </div>
      </div>
    `;
  },
  
  renderAllCharts: function(gameId, detailed, sessions) {
    this.renderKeyMetrics(detailed, gameId);
    this.renderTimelineChart(sessions, gameId);
    this.renderBreakdownChart(detailed, gameId);
    this.renderHeatmap(sessions, detailed, gameId);
    this.renderSessionHistory(sessions, gameId);
    this.renderStatsSummary(detailed, sessions, gameId);
  },
  
  renderKeyMetrics: function(detailed, gameId) {
    const container = document.getElementById('key-metrics-container');
    if (!container || !detailed) return;
    
    let metricsHTML = '';
    
    if (detailed.type === 'hyper-nback') {
      metricsHTML = `
        <div class="metric-card">
          <div class="metric-label">d'-Prime (Sensitivity)</div>
          <div class="metric-value">${detailed.averages.dPrime.toFixed(2)}</div>
          <div class="metric-subvalue">Signal detection ability</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Average Level</div>
          <div class="metric-value">${detailed.averages.level.toFixed(2)}</div>
          <div class="metric-subvalue">Current difficulty</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Accuracy</div>
          <div class="metric-value">${(detailed.averages.accuracy * 100).toFixed(1)}%</div>
          <div class="metric-subvalue">Overall correctness</div>
        </div>
        ${detailed.averages.lureResistance > 0 ? `
        <div class="metric-card">
          <div class="metric-label">Lure Resistance</div>
          <div class="metric-value">${(detailed.averages.lureResistance * 100).toFixed(0)}%</div>
          <div class="metric-subvalue">Interference control</div>
        </div>
        ` : ''}
      `;
    } else if (detailed.type === 'jiggle-factorial') {
      metricsHTML = `
        <div class="metric-card">
          <div class="metric-label">Average Score</div>
          <div class="metric-value">${detailed.averages.score.toFixed(1)}</div>
          <div class="metric-subvalue">Per session</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Average Level</div>
          <div class="metric-value">${detailed.averages.level.toFixed(1)}</div>
          <div class="metric-subvalue">Difficulty reached</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Success Rate</div>
          <div class="metric-value">${(detailed.averages.accuracy * 100).toFixed(1)}%</div>
          <div class="metric-subvalue">${detailed.totals.correct}/${detailed.totals.trials} trials</div>
        </div>
      `;
    }
    
    container.innerHTML = metricsHTML;
  },
  
  renderTimelineChart: function(sessions, gameId) {
    const container = document.getElementById('timeline-chart');
    if (!container || sessions.length === 0) return;
    
    d3.select(container).selectAll('*').remove();
    
    const margin = {top: 20, right: 60, bottom: 50, left: 60};
    const width = container.offsetWidth;
    const height = 280;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Prepare data
    const data = sessions.map((s, i) => ({
      index: i,
      date: s.date || `S${i + 1}`,
      score: s.score || 0,
      accuracy: (s.accuracy || 0) * 100,
      level: s.level || s.microLevel || s.nBack || 0
    }));
    
    // Scales
    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);
    
    const yScore = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.score, d.accuracy)) * 1.1])
      .range([innerHeight, 0]);
    
    const yLevel = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.level) * 1.1])
      .range([innerHeight, 0]);
    
    // Grid
    g.append('g')
      .selectAll('line')
      .data(yScore.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScore(d))
      .attr('y2', d => yScore(d))
      .attr('stroke', 'rgba(255,255,255,0.05)')
      .attr('stroke-width', 1);
    
    // Area for score
    const areaScore = d3.area()
      .x((d, i) => x(i))
      .y0(innerHeight)
      .y1(d => yScore(d.score))
      .curve(d3.curveMonotoneX);
    
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#gradient-score)')
      .attr('d', areaScore);
    
    // Gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient-score')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4CAF50')
      .attr('stop-opacity', 0.4);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4CAF50')
      .attr('stop-opacity', 0);
    
    // Lines
    const lineScore = d3.line()
      .x((d, i) => x(i))
      .y(d => yScore(d.score))
      .curve(d3.curveMonotoneX);
    
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4CAF50')
      .attr('stroke-width', 3)
      .attr('d', lineScore);
    
    // Accuracy line
    const lineAccuracy = d3.line()
      .x((d, i) => x(i))
      .y(d => yScore(d.accuracy))
      .curve(d3.curveMonotoneX);
    
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2196F3')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', lineAccuracy);
    
    // Level line
    const lineLevel = d3.line()
      .x((d, i) => x(i))
      .y(d => yLevel(d.level))
      .curve(d3.curveMonotoneX);
    
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#FF9800')
      .attr('stroke-width', 2)
      .attr('d', lineLevel);
    
    // Points with tooltips
    g.selectAll('.dot-score')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => x(i))
      .attr('cy', d => yScore(d.score))
      .attr('r', 4)
      .attr('fill', '#4CAF50')
      .attr('stroke', '#0a0a0a')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .append('title')
      .text(d => `${d.date}\nScore: ${d.score.toFixed(1)}\nAccuracy: ${d.accuracy.toFixed(1)}%\nLevel: ${d.level.toFixed(2)}`);
    
    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(Math.min(10, data.length)).tickFormat(i => data[Math.round(i)]?.date || ''))
      .selectAll('text')
      .attr('fill', '#aaa')
      .attr('font-size', '10px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
    
    g.append('g')
      .call(d3.axisLeft(yScore).ticks(5))
      .selectAll('text')
      .attr('fill', '#aaa')
      .attr('font-size', '10px');
    
    g.append('g')
      .attr('transform', `translate(${innerWidth},0)`)
      .call(d3.axisRight(yLevel).ticks(5))
      .selectAll('text')
      .attr('fill', '#FF9800')
      .attr('font-size', '10px');
    
    g.selectAll('.domain').attr('stroke', '#555');
    g.selectAll('.tick line').attr('stroke', '#555');
    
    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left + 10}, 5)`);
    
    const legendData = [
      {label: 'Score', color: '#4CAF50'},
      {label: 'Accuracy', color: '#2196F3'},
      {label: 'Level', color: '#FF9800'}
    ];
    
    legendData.forEach((item, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(${i * 90}, 0)`);
      
      legendItem.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', item.color)
        .attr('stroke-width', 2);
      
      legendItem.append('text')
        .attr('x', 25)
        .attr('y', 4)
        .attr('fill', '#eee')
        .attr('font-size', '11px')
        .text(item.label);
    });
  },
  
  renderBreakdownChart: function(detailed, gameId) {
    // Implementation continues...
    const container = document.getElementById('breakdown-chart');
    if (!container || !detailed) return;
    
    container.innerHTML = '<div style="color: #888; text-align: center; padding: 50px;">Breakdown visualization coming soon...</div>';
  },
  
  renderHeatmap: function(sessions, detailed, gameId) {
    const container = document.getElementById('heatmap-chart');
    if (!container || !sessions) return;
    
    container.innerHTML = '<div style="color: #888; text-align: center; padding: 50px;">Heatmap visualization coming soon...</div>';
  },
  
  renderSessionHistory: function(sessions, gameId) {
    const container = document.getElementById('session-history');
    if (!container || sessions.length === 0) return;
    
    const recentSessions = sessions.slice(-20).reverse();
    
    let html = '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">';
    html += '<thead><tr style="border-bottom: 1px solid #333; color: #888;">';
    html += '<th style="padding: 8px; text-align: left;">Date</th>';
    html += '<th style="padding: 8px; text-align: right;">Score</th>';
    html += '<th style="padding: 8px; text-align: right;">Accuracy</th>';
    html += '<th style="padding: 8px; text-align: right;">Level</th>';
    html += '</tr></thead><tbody>';
    
    recentSessions.forEach(s => {
      html += '<tr style="border-bottom: 1px solid #222;">';
      html += `<td style="padding: 8px; color: #aaa;">${s.date || 'N/A'}</td>`;
      html += `<td style="padding: 8px; text-align: right; color: #4CAF50;">${(s.score || 0).toFixed(1)}</td>`;
      html += `<td style="padding: 8px; text-align: right; color: #2196F3;">${((s.accuracy || 0) * 100).toFixed(1)}%</td>`;
      html += `<td style="padding: 8px; text-align: right; color: #FF9800;">${(s.level || s.microLevel || s.nBack || 0).toFixed(2)}</td>`;
      html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
  },
  
  renderStatsSummary: function(detailed, sessions, gameId) {
    const container = document.getElementById('stats-summary');
    if (!container || !detailed) return;
    
    container.innerHTML = '<div style="color: #888; text-align: center; padding: 50px;">Statistical analysis coming soon...</div>';
  }
};

// Hook into existing system
window.showDetailedStats = function() {
  const currentGame = window.unifiedBrainTraining?.currentGameId;
  if (currentGame) {
    window.AnalyticsDashboard.show(currentGame);
  }
};
