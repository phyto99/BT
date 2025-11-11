/**
 * Cognitive Progression UI Components
 * 
 * Displays cognitive scores, trends, and analytics with transparent calculations.
 * Includes radar charts, trend graphs, formula modals, and cross-game analytics.
 */

// ============================================================================
// DOMAIN DISPLAY NAMES
// ============================================================================

const DOMAIN_NAMES = {
  workingMemory: 'Working Memory',
  attention: 'Attention',
  processingSpeed: 'Processing Speed',
  executiveFunctions: 'Executive Functions',
  perceptualProcessing: 'Perceptual Processing',
  longTermMemory: 'Long-Term Memory'
};

const DOMAIN_DESCRIPTIONS = {
  workingMemory: 'Ability to hold and manipulate information in mind',
  attention: 'Ability to focus and sustain concentration',
  processingSpeed: 'Speed of mental processing and reaction',
  executiveFunctions: 'Higher-order cognitive control and planning',
  perceptualProcessing: 'Visual and spatial information processing',
  longTermMemory: 'Ability to store and retrieve information over time'
};

// ============================================================================
// COGNITIVE PROFILE DISPLAY
// ============================================================================

class CognitiveProfileUI {
  constructor(containerId, progressionSystem) {
    this.container = document.getElementById(containerId);
    this.system = progressionSystem;
    this.radarChart = null;
  }
  
  async render() {
    if (!this.container) return;
    
    const scores = this.system.cognitiveScores;
    
    this.container.innerHTML = `
      <div class="cognitive-profile">
        <h2>Cognitive Profile</h2>
        <div class="profile-content">
          <div class="radar-chart-container">
            <canvas id="cognitiveRadarChart"></canvas>
          </div>
          <div class="domain-scores">
            ${this.renderDomainScores(scores)}
          </div>
        </div>
      </div>
    `;
    
    this.renderRadarChart(scores);
  }
  
  renderDomainScores(scores) {
    return Object.entries(scores)
      .filter(([key]) => key !== 'id')
      .map(([domain, data]) => {
        const color = this.getScoreColor(data.score);
        const trend = this.getTrendIndicator(domain);
        
        return `
          <div class="domain-score-card" onclick="cognitiveUI.showFormulaModal('${domain}')">
            <div class="domain-name">${DOMAIN_NAMES[domain]}</div>
            <div class="domain-score" style="color: ${color}">
              ${data.score}
              <span class="trend-indicator">${trend}</span>
            </div>
            <div class="domain-info">
              <span class="sessions-count">${data.sessions} sessions</span>
              <span class="confidence-indicator" title="Confidence: ${Math.round(data.confidence * 100)}%">
                ${'●'.repeat(Math.ceil(data.confidence * 5))}${'○'.repeat(5 - Math.ceil(data.confidence * 5))}
              </span>
            </div>
            <div class="domain-description">${DOMAIN_DESCRIPTIONS[domain]}</div>
          </div>
        `;
      }).join('');
  }
  
  getScoreColor(score) {
    if (score <= 333) return '#4CAF50'; // Green (elite)
    if (score <= 666) return '#FFC107'; // Yellow (average)
    return '#F44336'; // Red (developing)
  }
  
  getTrendIndicator(domain) {
    // This would be calculated from recent sessions
    // For now, return neutral
    return '→';
  }
  
  renderRadarChart(scores) {
    const canvas = document.getElementById('cognitiveRadarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Prepare data
    const labels = Object.keys(scores)
      .filter(key => key !== 'id')
      .map(domain => DOMAIN_NAMES[domain]);
    
    const data = Object.values(scores)
      .filter(val => typeof val === 'object' && val.score !== undefined)
      .map(val => 999 - val.score); // Invert for visualization (higher = better on chart)
    
    // Simple radar chart implementation
    this.drawRadarChart(ctx, canvas, labels, data);
  }
  
  drawRadarChart(ctx, canvas, labels, data) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    const numPoints = labels.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background circles
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#e0e0e0';
    for (let i = 0; i < numPoints; i++) {
      const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Draw labels
      const labelX = centerX + (radius + 40) * Math.cos(angle);
      const labelY = centerY + (radius + 40) * Math.sin(angle);
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], labelX, labelY);
    }
    
    // Draw data polygon
    ctx.fillStyle = 'rgba(54, 162, 235, 0.2)';
    ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
      const value = data[i] / 999; // Normalize to 0-1
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = 'rgba(54, 162, 235, 1)';
    for (let i = 0; i < numPoints; i++) {
      const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
      const value = data[i] / 999;
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  
  async showFormulaModal(domain) {
    const domainData = this.system.cognitiveScores[domain];
    const sessions = await this.system.dataStore.getAllSessions();
    const domainSessions = sessions.filter(s => 
      s.cognitiveContributions && s.cognitiveContributions[domain]
    );
    
    const modal = document.createElement('div');
    modal.className = 'cognitive-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${DOMAIN_NAMES[domain]} Score: ${domainData.score}</h2>
          <button class="modal-close" onclick="this.closest('.cognitive-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <section>
            <h3>Percentile Score</h3>
            <p>Your score of <strong>${domainData.score}</strong> means you perform better than 
            <strong>${Math.round((1 - domainData.score/999) * 100)}%</strong> of users.</p>
            <p class="note">Lower score = better performance (like golf or reaction times)</p>
          </section>
          
          <section>
            <h3>Raw Metrics</h3>
            ${this.renderRawMetrics(domainSessions)}
          </section>
          
          <section>
            <h3>Score Calculation</h3>
            <p>Your score is calculated using a weighted moving average of your performance across all games that train this domain.</p>
            <pre class="formula">
Score = (1 - Performance) × 999
Performance = Σ(Game_Performance × Weight) / Σ(Weight)
            </pre>
          </section>
          
          <section>
            <h3>Contributing Games</h3>
            ${this.renderContributingGames(domain, domainSessions)}
          </section>
          
          <section>
            <h3>Trend Analysis</h3>
            <div id="trendChart-${domain}"></div>
          </section>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Render trend chart
    this.renderTrendChart(domain, domainSessions);
  }
  
  renderRawMetrics(sessions) {
    if (sessions.length === 0) {
      return '<p>No data yet. Complete some training sessions to see metrics.</p>';
    }
    
    const latestSession = sessions[sessions.length - 1];
    const metrics = latestSession.scientificMetrics || {};
    
    let html = '<div class="raw-metrics">';
    
    if (metrics.dPrime !== undefined) {
      html += `<div class="metric"><strong>d':</strong> ${metrics.dPrime.toFixed(2)} (sensitivity)</div>`;
    }
    if (metrics.criterion !== undefined) {
      html += `<div class="metric"><strong>c:</strong> ${metrics.criterion.toFixed(2)} (response bias)</div>`;
    }
    if (metrics.capacity !== undefined) {
      html += `<div class="metric"><strong>K:</strong> ${metrics.capacity.toFixed(2)} items (capacity)</div>`;
    }
    if (metrics.processingSpeed) {
      html += `<div class="metric"><strong>RT:</strong> ${Math.round(metrics.processingSpeed.meanRT)}ms (reaction time)</div>`;
    }
    
    html += '</div>';
    return html;
  }
  
  renderContributingGames(domain, sessions) {
    const gameContributions = {};
    
    sessions.forEach(session => {
      if (!gameContributions[session.gameId]) {
        gameContributions[session.gameId] = {
          count: 0,
          totalScore: 0,
          weight: session.cognitiveContributions[domain].weight
        };
      }
      gameContributions[session.gameId].count++;
      gameContributions[session.gameId].totalScore += session.cognitiveContributions[domain].normalizedScore;
    });
    
    let html = '<div class="game-contributions">';
    
    for (const [gameId, data] of Object.entries(gameContributions)) {
      const avgScore = Math.round(data.totalScore / data.count);
      html += `
        <div class="game-contribution">
          <div class="game-name">${gameId}</div>
          <div class="game-stats">
            <span>${data.count} sessions</span>
            <span>Weight: ${(data.weight * 100).toFixed(0)}%</span>
            <span>Avg Score: ${avgScore}</span>
          </div>
        </div>
      `;
    }
    
    html += '</div>';
    return html;
  }
  
  renderTrendChart(domain, sessions) {
    const container = document.getElementById(`trendChart-${domain}`);
    if (!container || sessions.length < 3) {
      container.innerHTML = '<p>Not enough data for trend analysis (need at least 3 sessions)</p>';
      return;
    }
    
    const dataPoints = sessions.map(s => ({
      timestamp: s.startTime,
      score: s.cognitiveContributions[domain].normalizedScore
    }));
    
    const trend = calculateTrend(dataPoints, 30);
    
    container.innerHTML = `
      <div class="trend-info">
        <p><strong>Trend:</strong> ${trend.trend}</p>
        <p><strong>Equation:</strong> ${trend.equation}</p>
        <p><strong>R²:</strong> ${trend.rSquared.toFixed(3)} (goodness of fit)</p>
        <p><strong>Confidence:</strong> ${Math.round(trend.confidence * 100)}%</p>
      </div>
      <canvas id="trendCanvas-${domain}" width="600" height="300"></canvas>
    `;
    
    // Draw simple trend line chart
    const canvas = document.getElementById(`trendCanvas-${domain}`);
    if (canvas) {
      this.drawTrendChart(canvas, dataPoints, trend);
    }
  }
  
  drawTrendChart(canvas, dataPoints, trend) {
    const ctx = canvas.getContext('2d');
    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Find min/max for scaling
    const scores = dataPoints.map(p => p.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const scoreRange = maxScore - minScore || 100;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Y-axis label (inverted: 000 at top, 999 at bottom)
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Score (lower = better)', padding - 5, padding - 10);
    
    // Draw Y-axis ticks (inverted)
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      const score = Math.round(minScore + (scoreRange / 5) * i);
      ctx.fillText(score, padding - 5, y + 5);
      
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Draw data points and line
    ctx.strokeStyle = '#2196F3';
    ctx.fillStyle = '#2196F3';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    dataPoints.forEach((point, i) => {
      const x = padding + (width / (dataPoints.length - 1)) * i;
      const normalizedScore = (point.score - minScore) / scoreRange;
      const y = padding + height * normalizedScore; // Inverted Y
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      
      ctx.beginPath();
      if (i < dataPoints.length - 1) {
        ctx.moveTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw trend line
    if (trend.slope !== undefined) {
      ctx.strokeStyle = '#F44336';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      dataPoints.forEach((point, i) => {
        const x = padding + (width / (dataPoints.length - 1)) * i;
        const trendScore = trend.slope * i + trend.intercept;
        const normalizedScore = (trendScore - minScore) / scoreRange;
        const y = padding + height * normalizedScore;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

// ============================================================================
// CROSS-GAME ANALYTICS
// ============================================================================

class CrossGameAnalyticsUI {
  constructor(containerId, progressionSystem) {
    this.container = document.getElementById(containerId);
    this.system = progressionSystem;
  }
  
  async render() {
    if (!this.container) return;
    
    const sessions = await this.system.dataStore.getAllSessions();
    
    this.container.innerHTML = `
      <div class="cross-game-analytics">
        <h2>Cross-Game Analytics</h2>
        ${this.renderDomainBreakdown(sessions)}
        ${this.renderGamePerformance(sessions)}
      </div>
    `;
  }
  
  renderDomainBreakdown(sessions) {
    const domainData = {};
    
    // Initialize
    for (const domain of Object.keys(DOMAIN_NAMES)) {
      domainData[domain] = {
        games: {},
        totalSessions: 0
      };
    }
    
    // Aggregate data
    sessions.forEach(session => {
      if (!session.cognitiveContributions) return;
      
      for (const [domain, contribution] of Object.entries(session.cognitiveContributions)) {
        if (!domainData[domain]) continue;
        
        if (!domainData[domain].games[session.gameId]) {
          domainData[domain].games[session.gameId] = {
            count: 0,
            weight: contribution.weight
          };
        }
        
        domainData[domain].games[session.gameId].count++;
        domainData[domain].totalSessions++;
      }
    });
    
    let html = '<div class="domain-breakdown">';
    html += '<h3>Training by Cognitive Domain</h3>';
    
    for (const [domain, data] of Object.entries(domainData)) {
      if (data.totalSessions === 0) continue;
      
      html += `
        <div class="domain-section">
          <h4>${DOMAIN_NAMES[domain]} (${data.totalSessions} sessions)</h4>
          <div class="game-list">
            ${Object.entries(data.games)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([gameId, gameData]) => `
                <div class="game-item">
                  <span class="game-name">${gameId}</span>
                  <span class="game-count">${gameData.count} sessions</span>
                  <span class="game-weight">Weight: ${(gameData.weight * 100).toFixed(0)}%</span>
                </div>
              `).join('')}
          </div>
        </div>
      `;
    }
    
    html += '</div>';
    return html;
  }
  
  renderGamePerformance(sessions) {
    const gameData = {};
    
    sessions.forEach(session => {
      if (!gameData[session.gameId]) {
        gameData[session.gameId] = {
          count: 0,
          totalTime: 0,
          domains: new Set()
        };
      }
      
      gameData[session.gameId].count++;
      gameData[session.gameId].totalTime += session.duration || 0;
      
      if (session.cognitiveContributions) {
        Object.keys(session.cognitiveContributions).forEach(domain => {
          gameData[session.gameId].domains.add(domain);
        });
      }
    });
    
    let html = '<div class="game-performance">';
    html += '<h3>Performance by Game</h3>';
    html += '<div class="game-cards">';
    
    for (const [gameId, data] of Object.entries(gameData)) {
      const avgTime = data.totalTime / data.count / 60000; // minutes
      
      html += `
        <div class="game-card">
          <h4>${gameId}</h4>
          <div class="game-stats">
            <div class="stat">
              <span class="stat-label">Sessions</span>
              <span class="stat-value">${data.count}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Avg Time</span>
              <span class="stat-value">${avgTime.toFixed(1)} min</span>
            </div>
            <div class="stat">
              <span class="stat-label">Domains</span>
              <span class="stat-value">${data.domains.size}</span>
            </div>
          </div>
          <div class="trained-domains">
            ${Array.from(data.domains).map(d => `
              <span class="domain-badge">${DOMAIN_NAMES[d]}</span>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    html += '</div></div>';
    return html;
  }
}

// ============================================================================
// STYLES
// ============================================================================

const COGNITIVE_UI_STYLES = `
<style>
.cognitive-profile {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.radar-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

#cognitiveRadarChart {
  width: 400px;
  height: 400px;
}

.domain-scores {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.domain-score-card {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.domain-score-card:hover {
  background: #e8e8e8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.domain-name {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.domain-score {
  font-size: 32px;
  font-weight: bold;
  margin: 10px 0;
}

.trend-indicator {
  font-size: 20px;
  margin-left: 10px;
}

.domain-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.domain-description {
  font-size: 12px;
  color: #888;
  margin-top: 8px;
}

.confidence-indicator {
  color: #FFC107;
}

.cognitive-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-body section {
  margin-bottom: 30px;
}

.modal-body h3 {
  margin-bottom: 10px;
  color: #333;
}

.formula {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  font-family: monospace;
  overflow-x: auto;
}

.raw-metrics, .game-contributions {
  display: grid;
  gap: 10px;
}

.metric, .game-contribution {
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}

.game-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.cross-game-analytics {
  padding: 20px;
}

.domain-breakdown, .game-performance {
  margin-top: 30px;
}

.domain-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 6px;
}

.game-list {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.game-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.game-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.game-card {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.game-card h4 {
  margin-bottom: 15px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.trained-domains {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 15px;
}

.domain-badge {
  padding: 4px 8px;
  background: #2196F3;
  color: white;
  border-radius: 4px;
  font-size: 11px;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  #cognitiveRadarChart {
    width: 300px;
    height: 300px;
  }
  
  .game-cards {
    grid-template-columns: 1fr;
  }
}
</style>
`;

// Inject styles
if (typeof document !== 'undefined') {
  document.head.insertAdjacentHTML('beforeend', COGNITIVE_UI_STYLES);
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CognitiveProfileUI,
    CrossGameAnalyticsUI,
    DOMAIN_NAMES,
    DOMAIN_DESCRIPTIONS
  };
}
