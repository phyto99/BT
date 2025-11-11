/**
 * Cognitive Progression System
 * 
 * Tracks cognitive performance across 6 domains using scientifically validated metrics.
 * Implements 000-999 inverted scoring (lower = better), transparent calculations,
 * and motivational features (achievements, streaks).
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const DB_NAME = 'CognitiveProgressionDB';
const DB_VERSION = 1;

const COGNITIVE_DOMAINS = [
  'workingMemory',
  'attention',
  'processingSpeed',
  'executiveFunctions',
  'perceptualProcessing',
  'longTermMemory'
];

// Game-to-Domain Mappings
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
  }
};


// Error codes
const ERROR_CODES = {
  DB_INIT_FAILED: 'DB_INIT_FAILED',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  INVALID_GAME_DATA: 'INVALID_GAME_DATA',
  CALCULATION_ERROR: 'CALCULATION_ERROR'
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

class CognitiveError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CognitiveError';
    this.code = code;
    this.details = details;
  }
}

// ============================================================================
// DATA LAYER - IndexedDB
// ============================================================================

class CognitiveDataStore {
  constructor() {
    this.db = null;
  }
  
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(new CognitiveError(
        ERROR_CODES.DB_INIT_FAILED,
        'Failed to open database',
        { error: request.error }
      ));
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionsStore.createIndex('gameId', 'gameId', { unique: false });
          sessionsStore.createIndex('startTime', 'startTime', { unique: false });
        }
        
        // Cognitive data store
        if (!db.objectStoreNames.contains('cognitiveData')) {
          const cognitiveStore = db.createObjectStore('cognitiveData', { keyPath: 'id' });
          cognitiveStore.createIndex('domain', 'domain', { unique: false });
        }
        
        // Achievements store
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' });
        }
      };
    });
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
  
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
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
  
  // Session operations
  async createSession(sessionData) {
    const session = {
      id: this.generateUUID(),
      ...sessionData,
      startTime: Date.now()
    };
    
    await this.put('sessions', session);
    return session;
  }
  
  async endSession(sessionId, endData) {
    const session = await this.get('sessions', sessionId);
    if (!session) {
      throw new CognitiveError(ERROR_CODES.SESSION_NOT_FOUND, `Session ${sessionId} not found`);
    }
    
    session.endTime = Date.now();
    session.duration = session.endTime - session.startTime;
    Object.assign(session, endData);
    
    await this.put('sessions', session);
    return session;
  }
  
  async getAllSessions() {
    return this.getAll('sessions');
  }
  
  async getSessionsByGame(gameId) {
    return this.getAllFromIndex('sessions', 'gameId', gameId);
  }
  
  // Cognitive data operations
  async getCognitiveScores() {
    const data = await this.get('cognitiveData', 'scores');
    if (!data) {
      // Initialize default scores
      const defaultScores = {};
      for (const domain of COGNITIVE_DOMAINS) {
        defaultScores[domain] = {
          score: 500,
          confidence: 0,
          sessions: 0,
          lastUpdated: Date.now()
        };
      }
      await this.put('cognitiveData', { id: 'scores', ...defaultScores });
      return defaultScores;
    }
    return data;
  }
  
  async updateCognitiveScores(scores) {
    await this.put('cognitiveData', { id: 'scores', ...scores });
  }
  
  async getProgressionData() {
    const data = await this.get('cognitiveData', 'progression');
    if (!data) {
      const defaultProgression = {
        totalTime: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastTrainingDate: null,
        achievements: []
      };
      await this.put('cognitiveData', { id: 'progression', ...defaultProgression });
      return defaultProgression;
    }
    return data;
  }
  
  async updateProgressionData(progression) {
    await this.put('cognitiveData', { id: 'progression', ...progression });
  }
  
  // Utility
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// ============================================================================
// COGNITIVE MAPPING ENGINE
// ============================================================================

/**
 * Normalize raw game metrics to 000-999 scale (lower = better)
 */
function normalizeScore(rawMetrics, domain, gameId) {
  const mapping = GAME_MAPPINGS[gameId]?.domains[domain];
  if (!mapping) return 500; // Default to average
  
  let performance = 0;
  
  // Calculate weighted performance from raw metrics
  // Example for Working Memory:
  if (rawMetrics.level) {
    performance += (rawMetrics.level / 10) * 0.40;
  }
  if (rawMetrics.accuracy !== undefined) {
    performance += rawMetrics.accuracy * 0.30;
  }
  if (rawMetrics.dPrime) {
    performance += Math.min(rawMetrics.dPrime / 4.0, 1) * 0.20;
  }
  if (rawMetrics.capacity) {
    performance += Math.min(rawMetrics.capacity / 7.0, 1) * 0.10;
  }
  
  // Clamp to 0-1 range
  performance = Math.max(0, Math.min(1, performance));
  
  // Invert and scale to 000-999 (lower = better)
  const score = Math.round((1 - performance) * 999);
  
  return Math.max(0, Math.min(999, score));
}

// ============================================================================
// SCIENTIFIC METRIC CALCULATIONS
// ============================================================================

/**
 * Inverse normal CDF (approximation for z-scores)
 */
function inverseNormalCDF(p) {
  // Rational approximation for inverse normal CDF
  const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
  const a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
  const b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
  const b4 = 66.8013118877197, b5 = -13.2806815528857;
  const c1 = -0.00778489400243029, c2 = -0.322396458041136, c3 = -2.40075827716184;
  const c4 = -2.54973253934373, c5 = 4.37466414146497, c6 = 2.93816398269878;
  const d1 = 0.00778469570904146, d2 = 0.32246712907004, d3 = 2.445134137143;
  const d4 = 3.75440866190742;
  
  const pLow = 0.02425, pHigh = 1 - pLow;
  let q, r, x;
  
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    x = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    x = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
         ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  
  return x;
}

/**
 * Calculate d-prime (signal detection theory)
 */
function calculateDPrime(hits, misses, falseAlarms, correctRejections) {
  const hitRate = hits / (hits + misses);
  const faRate = falseAlarms / (falseAlarms + correctRejections);
  
  // Avoid extreme values
  const adjustedHitRate = Math.max(0.01, Math.min(0.99, hitRate));
  const adjustedFARate = Math.max(0.01, Math.min(0.99, faRate));
  
  const zHit = inverseNormalCDF(adjustedHitRate);
  const zFA = inverseNormalCDF(adjustedFARate);
  
  return zHit - zFA;
}

/**
 * Calculate criterion (response bias)
 */
function calculateCriterion(hits, misses, falseAlarms, correctRejections) {
  const hitRate = hits / (hits + misses);
  const faRate = falseAlarms / (falseAlarms + correctRejections);
  
  const adjustedHitRate = Math.max(0.01, Math.min(0.99, hitRate));
  const adjustedFARate = Math.max(0.01, Math.min(0.99, faRate));
  
  const zHit = inverseNormalCDF(adjustedHitRate);
  const zFA = inverseNormalCDF(adjustedFARate);
  
  return -0.5 * (zHit + zFA);
}

/**
 * Calculate working memory capacity (Cowan's K)
 */
function calculateCapacity(setSize, accuracy) {
  const k = setSize * ((accuracy - 0.5) / 0.5);
  return Math.max(0, Math.min(7, k));
}

/**
 * Calculate processing speed metrics
 */
function calculateProcessingSpeed(reactionTimes) {
  if (!reactionTimes || reactionTimes.length === 0) {
    return { meanRT: 0, medianRT: 0, sd: 0, validCount: 0 };
  }
  
  // Calculate mean and SD
  const mean = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
  const sd = Math.sqrt(
    reactionTimes.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / reactionTimes.length
  );
  
  // Remove outliers (< 200ms or > mean + 3SD)
  const validRTs = reactionTimes.filter(rt => rt >= 200 && rt <= mean + 3 * sd);
  
  if (validRTs.length === 0) return { meanRT: mean, medianRT: mean, sd, validCount: 0 };
  
  const meanRT = validRTs.reduce((a, b) => a + b) / validRTs.length;
  const sorted = [...validRTs].sort((a, b) => a - b);
  const medianRT = sorted[Math.floor(sorted.length / 2)];
  
  return { meanRT, medianRT, sd, validCount: validRTs.length };
}

// ============================================================================
// TREND ANALYSIS
// ============================================================================

/**
 * Calculate statistical trend with linear regression
 */
function calculateTrend(dataPoints, timeWindow = 30) {
  // Filter to time window (last N days)
  const cutoff = Date.now() - (timeWindow * 24 * 60 * 60 * 1000);
  const recent = dataPoints.filter(p => p.timestamp >= cutoff);
  
  if (recent.length < 3) {
    return { trend: 'insufficient_data', confidence: 0 };
  }
  
  // Linear regression: y = mx + b
  const n = recent.length;
  const x = recent.map((_, i) => i);
  const y = recent.map(p => p.score);
  
  const sumX = x.reduce((a, b) => a + b);
  const sumY = y.reduce((a, b) => a + b);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  
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
  
  // Determine trend direction (negative slope = improvement since lower = better)
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

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

class CognitiveProgressionSystem {
  constructor(dataStore) {
    this.dataStore = dataStore;
    this.activeSession = null;
    this.cognitiveScores = null;
    this.progressionData = null;
  }
  
  async init() {
    await this.dataStore.init();
    this.cognitiveScores = await this.dataStore.getCognitiveScores();
    this.progressionData = await this.dataStore.getProgressionData();
  }
  
  async handleSessionStart(gameId) {
    // Create new session
    this.activeSession = await this.dataStore.createSession({
      gameId,
      gameMetrics: {},
      cognitiveContributions: {},
      scientificMetrics: {}
    });
    
    // Update streak
    this.updateStreak();
    await this.dataStore.updateProgressionData(this.progressionData);
    
    return this.activeSession.id;
  }
  
  async handleSessionEnd(sessionId, gameMetrics) {
    const session = await this.dataStore.get('sessions', sessionId);
    if (!session) {
      throw new CognitiveError(ERROR_CODES.SESSION_NOT_FOUND, `Session ${sessionId} not found`);
    }
    
    // Calculate cognitive contributions
    const cognitiveContributions = this.calculateCognitiveContributions(session.gameId, gameMetrics);
    
    // Calculate scientific metrics
    const scientificMetrics = this.calculateScientificMetrics(session.gameId, gameMetrics);
    
    // End session
    await this.dataStore.endSession(sessionId, {
      gameMetrics,
      cognitiveContributions,
      scientificMetrics
    });
    
    // Update cognitive scores
    await this.updateCognitiveScores(cognitiveContributions);
    
    // Update progression
    const updatedSession = await this.dataStore.get('sessions', sessionId);
    await this.updateProgression(updatedSession.duration);
    
    // Notify UI
    this.notifyUpdate();
    
    this.activeSession = null;
    
    return updatedSession;
  }
  
  calculateCognitiveContributions(gameId, gameMetrics) {
    const mapping = GAME_MAPPINGS[gameId];
    if (!mapping) return {};
    
    const contributions = {};
    
    for (const [domain, config] of Object.entries(mapping.domains)) {
      const normalizedScore = normalizeScore(gameMetrics, domain, gameId);
      
      contributions[domain] = {
        weight: config.weight,
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
        gameMetrics.misses || 0,
        gameMetrics.falseAlarms || 0,
        gameMetrics.correctRejections || 0
      );
      metrics.criterion = calculateCriterion(
        gameMetrics.hits,
        gameMetrics.misses || 0,
        gameMetrics.falseAlarms || 0,
        gameMetrics.correctRejections || 0
      );
    }
    
    // Working memory capacity
    if (gameMetrics.setSize && gameMetrics.accuracy !== undefined) {
      metrics.capacity = calculateCapacity(gameMetrics.setSize, gameMetrics.accuracy);
    }
    
    // Processing speed
    if (gameMetrics.reactionTimes) {
      metrics.processingSpeed = calculateProcessingSpeed(gameMetrics.reactionTimes);
    }
    
    return metrics;
  }
  
  async updateCognitiveScores(contributions) {
    for (const [domain, contribution] of Object.entries(contributions)) {
      const domainData = this.cognitiveScores[domain];
      if (!domainData) continue;
      
      // Weighted moving average
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
    
    await this.dataStore.updateCognitiveScores(this.cognitiveScores);
  }
  
  async updateProgression(duration) {
    this.progressionData.totalTime += duration / 1000; // Convert to seconds
    this.progressionData.totalSessions++;
    
    await this.dataStore.updateProgressionData(this.progressionData);
  }
  
  updateStreak() {
    const now = new Date();
    const lastTraining = this.progressionData.lastTrainingDate 
      ? new Date(this.progressionData.lastTrainingDate) 
      : null;
    
    if (!lastTraining) {
      // First session
      this.progressionData.currentStreak = 1;
      this.progressionData.lastTrainingDate = now.toISOString().split('T')[0];
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
      this.progressionData.currentStreak++;
      if (this.progressionData.currentStreak > this.progressionData.longestStreak) {
        this.progressionData.longestStreak = this.progressionData.currentStreak;
      }
    } else {
      // Streak broken
      this.progressionData.currentStreak = 1;
    }
    
    this.progressionData.lastTrainingDate = now.toISOString().split('T')[0];
  }
  
  notifyUpdate() {
    window.postMessage({
      type: 'cognitive:update',
      payload: {
        cognitiveScores: this.cognitiveScores,
        progression: this.progressionData
      }
    }, '*');
  }
  
  async getTrendAnalysis(domain, timeWindow = 30) {
    const sessions = await this.dataStore.getAllSessions();
    
    // Extract scores for this domain
    const dataPoints = sessions
      .filter(s => s.cognitiveContributions && s.cognitiveContributions[domain])
      .map(s => ({
        timestamp: s.startTime,
        score: s.cognitiveContributions[domain].normalizedScore
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
    
    return calculateTrend(dataPoints, timeWindow);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CognitiveDataStore,
    CognitiveProgressionSystem,
    CognitiveError,
    ERROR_CODES,
    GAME_MAPPINGS,
    COGNITIVE_DOMAINS,
    normalizeScore,
    calculateDPrime,
    calculateCriterion,
    calculateCapacity,
    calculateProcessingSpeed,
    calculateTrend
  };
}
