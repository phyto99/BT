// Comprehensive Statistics Panel with All Visualizations
// Shows everything in one dynamically-sized panel using Chart.js

window.ComprehensiveStatsPanel = {
  currentCharts: [],
  
  show: function() {
    // Close existing panel if open
    const existingPanel = document.querySelector('.stats-panel-datgui');
    if (existingPanel) {
      this.destroy();
      return;
    }

    const currentGame = window.unifiedBrainTraining?.currentGameId || 'none';
    const detailed = window.gameStats?.getDetailedAnalytics(currentGame);
    const sessions = window.gameStats?.getStats(currentGame) || [];
    
    if (!sessions || sessions.length === 0) {
      this.showEmptyState(currentGame);
      return;
    }
    
    this.createPanel(currentGame, detailed, sessions);
  },
  
  showEmptyState: function(currentGame) {
    const gameNames = {
      'jiggle-factorial': 'Jiggle Factorial 3D',
      '3d-hyper-nback': '3D Hyper N-back',
      'dichotic-dual-nback': 'Dichotic Dual N-back',
      'quad-box': 'Quad Box'
    };
    
    const panel = document.createElement('div');
    panel.className = 'stats-panel-datgui';
    panel.innerHTML = `
      <div class="stats-panel-datgui-header">
        <div class="stats-panel-datgui-title">Statistics - ${gameNames[currentGame] || currentGame}</div>
        <div class="stats-panel-datgui-close">×</div>
      </div>
      <div class="stats-datgui-section">
        <div class="stats-datgui-empty">
          <div class="stats-datgui-empty-icon">📊</div>
          <div style="font-size: 12px; margin-bottom: 5px;">No statistics yet</div>
          <div style="font-size: 10px; color: #555;">Complete a session to see comprehensive analytics</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    panel.querySelector('.stats-panel-datgui-close').addEventListener('click', () => this.destroy());
    requestAnimationFrame(() => panel.classList.add('visible'));
  },
  
  createPanel: function(currentGame, detailed, sessions) {
    const gameNames = {
      'jiggle-factorial': 'Jiggle Factorial 3D',
      '3d-hyper-nback': '3D Hyper N-back',
      'dichotic-dual-nback': 'Dichotic Dual N-back',
      'quad-box': 'Quad Box'
    };
    
    const panel = document.createElement('div');
    panel.className = 'stats-panel-datgui comprehensive';
    panel.style.width = '600px';
    panel.style.maxHeight = '90vh';
    panel.style.overflowY = 'auto';
    
    let html = `
      <div class="stats-panel-datgui-header">
        <div class="stats-panel-datgui-title">📊 ${gameNames[currentGame] || currentGame} Analytics</div>
        <div class="stats-panel-datgui-close">×</div>
      </div>
    `;
    
    // Key Metrics Summary
    html += this.renderMetricsSummary(detailed, sessions);
    
    // Progress Timeline Chart
    html += `
      <div class="stats-datgui-section">
        <div class="stats-datgui-section-title">📈 Progress Timeline</div>
        <div style="position: relative; height: 250px;">
          <canvas id="chart-timeline"></canvas>
        </div>
      </div>
    `;
    
    // Game-specific charts
    if (detailed) {
      if (detailed.type === 'hyper-nback') {
        html += this.renderHyperNBackCharts(detailed);
      } else if (detailed.type === 'jiggle-factorial') {
        html += this.renderJiggleFactorialCharts(detailed);
      }
    }
    
    // Session History Table
    html += this.renderSessionHistory(sessions);
    
    panel.innerHTML = html;
    document.body.appendChild(panel);
    
    // Setup close handler
    panel.querySelector('.stats-panel-datgui-close').addEventListener('click', () => this.destroy());
    
    // Fade in
    requestAnimationFrame(() => panel.classList.add('visible'));
    
    // Render all charts
    setTimeout(() => this.renderAllCharts(sessions, detailed), 100);
  },
  
  renderMetricsSummary: function(detailed, sessions) {
    if (!detailed) return '';
    
    let html = '<div class="stats-datgui-section"><div class="stats-datgui-section-title">⚡ Key Metrics</div>';
    html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">';
    
    if (detailed.type === 'hyper-nback') {
      html += `
        <div class="metric-card-compact">
          <div class="metric-label-compact">d'-Prime</div>
          <div class="metric-value-compact">${detailed.averages.dPrime.toFixed(2)}</div>
        </div>
        <div class="metric-card-compact">
          <div class="metric-label-compact">Avg Level</div>
          <div class="metric-value-compact">${detailed.averages.level.toFixed(2)}</div>
        </div>
        <div class="metric-card-compact">
          <div class="metric-label-compact">Accuracy</div>
          <div class="metric-value-compact">${(detailed.averages.accuracy * 100).toFixed(1)}%</div>
        </div>
        <div class="metric-card-compact">
          <div class="metric-label-compact">Sessions</div>
          <div class="metric-value-compact">${detailed.sessions}</div>
        </div>
      `;
    } else if (detailed.type === 'jiggle-factorial') {
      html += `
        <div class="metric-card-compact">
          <div class="metric-label-compact">Avg Score</div>
          <div class="metric-value-compact">${detailed.averages.score.toFixed(1)}</div>
        </div>
        <div class="metric-card-compact">
          <div class="metric-label-compact">Avg Level</div>
          <div class="metric-value-compact">${detailed.averages.level.toFixed(1)}</div>
        </div>
        <div class="metric-card-compact">
          <div class="metric-label-compact">Success Rate</div>
          <div class="metric-value-compact">${(detailed.averages.accuracy * 100).toFixed(1)}%</div>
        </div>
        <div class="metric-card-compact">
          <div class="metric-label-compact">Total Trials</div>
          <div class="metric-value-compact">${detailed.totals.trials}</div>
        </div>
      `;
    }
    
    html += '</div></div>';
    
    // Add CSS for compact metric cards
    if (!document.getElementById('compact-metrics-style')) {
      const style = document.createElement('style');
      style.id = 'compact-metrics-style';
      style.textContent = `
        .metric-card-compact {
          background: rgba(76, 175, 80, 0.1);
          border-left: 3px solid #4CAF50;
          padding: 10px;
          border-radius: 4px;
        }
        .metric-label-compact {
          color: #888;
          font-size: 10px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .metric-value-compact {
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }
      `;
      document.head.appendChild(style);
    }
    
    return html;
  },
  
  renderHyperNBackCharts: function(detailed) {
    let html = '';
    
    // Stimuli Performance Chart
    html += `
      <div class="stats-datgui-section">
        <div class="stats-datgui-section-title">🎯 Stimuli Performance</div>
        <div style="position: relative; height: 300px;">
          <canvas id="chart-stimuli"></canvas>
        </div>
      </div>
    `;
    
    // Signal Detection Metrics
    html += `
      <div class="stats-datgui-section">
        <div class="stats-datgui-section-title">🔬 Signal Detection</div>
        <div style="position: relative; height: 200px;">
          <canvas id="chart-signal-detection"></canvas>
        </div>
      </div>
    `;
    
    return html;
  },
  
  renderJiggleFactorialCharts: function(detailed) {
    let html = '';
    
    // Success/Failure Distribution (Doughnut)
    html += `
      <div class="stats-datgui-section">
        <div class="stats-datgui-section-title">📊 Performance Distribution</div>
        <div style="position: relative; height: 250px;">
          <canvas id="chart-distribution"></canvas>
        </div>
      </div>
    `;
    
    // Level & Ball Speed Progression
    html += `
      <div class="stats-datgui-section">
        <div class="stats-datgui-section-title">📈 Level & Speed Progression</div>
        <div style="position: relative; height: 250px;">
          <canvas id="chart-level-speed"></canvas>
        </div>
      </div>
    `;
    
    // Settings Breakdown
    html += `
      <div class="stats-datgui-section">
        <div class="stats-datgui-section-title">⚙️ Configuration Analysis</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 10px;">
          <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px;">
            <div style="color: #888; margin-bottom: 4px;">Movement Mode</div>
            <div style="color: #fff; font-weight: 600;">${detailed.settings?.movementMode || 'N/A'}</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px;">
            <div style="color: #888; margin-bottom: 4px;">Order Mode</div>
            <div style="color: #fff; font-weight: 600;">${detailed.settings?.orderMode || 'N/A'}</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px;">
            <div style="color: #888; margin-bottom: 4px;">Blue Distractors</div>
            <div style="color: #fff; font-weight: 600;">${detailed.settings?.numBlueDistractors || 'N/A'}</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px;">
            <div style="color: #888; margin-bottom: 4px;">Colored Distractors</div>
            <div style="color: #fff; font-weight: 600;">${detailed.settings?.numColoredDistractors || 'N/A'}</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px;">
            <div style="color: #888; margin-bottom: 4px;">Highlight Duration</div>
            <div style="color: #fff; font-weight: 600;">${detailed.settings?.highlightDuration || 'N/A'}ms</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px;">
            <div style="color: #888; margin-bottom: 4px;">Auto Progression</div>
            <div style="color: #fff; font-weight: 600;">${detailed.settings?.autoProgression ? 'ON' : 'OFF'}</div>
          </div>
        </div>
      </div>
    `;
    
    return html;
  },
  
  renderSessionHistory: function(sessions) {
    const recent = sessions.slice(-10).reverse();
    
    let html = `
      <div class="stats-datgui-section">
        <div class="stats-datgui-section-title">📋 Recent Sessions</div>
        <div style="max-height: 200px; overflow-y: auto;">
          <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid #333; color: #888;">
                <th style="padding: 6px; text-align: left;">Date</th>
                <th style="padding: 6px; text-align: right;">Score</th>
                <th style="padding: 6px; text-align: right;">Accuracy</th>
                <th style="padding: 6px; text-align: right;">Level</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    recent.forEach(s => {
      html += `
        <tr style="border-bottom: 1px solid #222;">
          <td style="padding: 6px; color: #aaa;">${s.date || 'N/A'}</td>
          <td style="padding: 6px; text-align: right; color: #4CAF50;">${(s.score || 0).toFixed(1)}</td>
          <td style="padding: 6px; text-align: right; color: #2196F3;">${((s.accuracy || 0) * 100).toFixed(1)}%</td>
          <td style="padding: 6px; text-align: right; color: #FF9800;">${(s.level || s.microLevel || s.nBack || 0).toFixed(2)}</td>
        </tr>
      `;
    });
    
    html += `
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    return html;
  },
  
  renderAllCharts: function(sessions, detailed) {
    this.renderTimelineChart(sessions);
    
    if (detailed) {
      if (detailed.type === 'hyper-nback') {
        this.renderStimuliChart(detailed);
        this.renderSignalDetectionChart(detailed);
      } else if (detailed.type === 'jiggle-factorial') {
        this.renderDistributionChart(detailed);
        this.renderLevelSpeedChart(detailed, sessions);
      }
    }
  },
  
  renderTimelineChart: function(sessions) {
    const canvas = document.getElementById('chart-timeline');
    if (!canvas) return;
    
    const data = sessions.map((s, i) => ({
      x: s.date || `S${i + 1}`,
      score: s.score || 0,
      accuracy: (s.accuracy || 0) * 100,
      level: s.level || s.microLevel || s.nBack || 0
    }));
    
    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.map(d => d.x),
        datasets: [
          {
            label: 'Score',
            data: data.map(d => d.score),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Accuracy %',
            data: data.map(d => d.accuracy),
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Level',
            data: data.map(d => d.level),
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            fill: false,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              color: '#eee',
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#fff',
            bodyColor: '#fff'
          }
        },
        scales: {
          x: {
            ticks: { color: '#aaa', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          y: {
            position: 'left',
            ticks: { color: '#aaa', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          y1: {
            position: 'right',
            ticks: { color: '#FF9800', font: { size: 10 } },
            grid: { display: false }
          }
        }
      }
    });
    
    this.currentCharts.push(chart);
  },
  
  renderStimuliChart: function(detailed) {
    const canvas = document.getElementById('chart-stimuli');
    if (!canvas) return;
    
    const stimuliData = Object.entries(detailed.stimuliBreakdown)
      .filter(([_, d]) => d.correct + d.wrong > 0)
      .map(([name, d]) => ({
        name: name,
        accuracy: d.correct / (d.correct + d.wrong) * 100,
        correct: d.correct,
        total: d.correct + d.wrong
      }))
      .sort((a, b) => b.accuracy - a.accuracy);
    
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: stimuliData.map(d => d.name),
        datasets: [{
          label: 'Accuracy %',
          data: stimuliData.map(d => d.accuracy),
          backgroundColor: stimuliData.map(d => {
            if (d.accuracy >= 90) return 'rgba(76, 175, 80, 0.8)';
            if (d.accuracy >= 70) return 'rgba(255, 152, 0, 0.8)';
            return 'rgba(244, 67, 54, 0.8)';
          }),
          borderColor: stimuliData.map(d => {
            if (d.accuracy >= 90) return '#4CAF50';
            if (d.accuracy >= 70) return '#FF9800';
            return '#f44336';
          }),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const item = stimuliData[context.dataIndex];
                return `${item.accuracy.toFixed(1)}% (${item.correct}/${item.total})`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#aaa', font: { size: 10 } },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#aaa', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
    
    this.currentCharts.push(chart);
  },
  
  renderSignalDetectionChart: function(detailed) {
    const canvas = document.getElementById('chart-signal-detection');
    if (!canvas) return;
    
    const chart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['d\'-Prime', 'Accuracy', 'Lure Resistance'],
        datasets: [{
          label: 'Performance',
          data: [
            Math.min(detailed.averages.dPrime / 3 * 100, 100),
            detailed.averages.accuracy * 100,
            detailed.averages.lureResistance * 100
          ],
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4CAF50',
          borderWidth: 2,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#4CAF50'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#aaa', backdropColor: 'transparent' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#eee', font: { size: 11 } }
          }
        }
      }
    });
    
    this.currentCharts.push(chart);
  },
  
  renderDistributionChart: function(detailed) {
    const canvas = document.getElementById('chart-distribution');
    if (!canvas) return;
    
    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Correct', 'Incorrect'],
        datasets: [{
          data: [detailed.totals.correct, detailed.totals.incorrect],
          backgroundColor: [
            'rgba(76, 175, 80, 0.8)',
            'rgba(244, 67, 54, 0.8)'
          ],
          borderColor: ['#4CAF50', '#f44336'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#eee', font: { size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = detailed.totals.trials;
                const value = context.parsed;
                const percentage = (value / total * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
    
    this.currentCharts.push(chart);
  },
  
  renderLevelSpeedChart: function(detailed, sessions) {
    const canvas = document.getElementById('chart-level-speed');
    if (!canvas) return;
    
    const data = sessions.map((s, i) => ({
      x: s.date || `S${i + 1}`,
      level: s.level || 0,
      ballSpeed: s.ballSpeed || 0
    }));
    
    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.map(d => d.x),
        datasets: [
          {
            label: 'Level',
            data: data.map(d => d.level),
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Ball Speed',
            data: data.map(d => d.ballSpeed),
            borderColor: '#9C27B0',
            backgroundColor: 'rgba(156, 39, 176, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              color: '#eee',
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#fff',
            bodyColor: '#fff'
          }
        },
        scales: {
          x: {
            ticks: { color: '#aaa', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          y: {
            position: 'left',
            title: {
              display: true,
              text: 'Level',
              color: '#FF9800'
            },
            ticks: { color: '#FF9800', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          y1: {
            position: 'right',
            title: {
              display: true,
              text: 'Ball Speed',
              color: '#9C27B0'
            },
            ticks: { color: '#9C27B0', font: { size: 10 } },
            grid: { display: false }
          }
        }
      }
    });
    
    this.currentCharts.push(chart);
  },
  
  destroy: function() {
    // Destroy all charts
    this.currentCharts.forEach(chart => chart.destroy());
    this.currentCharts = [];
    
    // Remove panel
    const panel = document.querySelector('.stats-panel-datgui');
    if (panel) {
      panel.classList.remove('visible');
      setTimeout(() => panel.remove(), 300);
    }
  }
};

// Override the stats button handler
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const statsBtn = document.getElementById('unified-stats-btn');
    if (statsBtn) {
      // Remove old listeners by cloning
      const newBtn = statsBtn.cloneNode(true);
      statsBtn.parentNode.replaceChild(newBtn, statsBtn);
      
      // Add new listener
      newBtn.addEventListener('click', () => {
        window.ComprehensiveStatsPanel.show();
      });
    }
  }, 1000);
});
