import { writable } from 'svelte/store'
import { addGame, getLastRecentGame, getPlayTimeSince4AM  } from '../lib/gamedb'
import { formatSeconds } from '../lib/utils'

const loadAnalytics = async () => {
  const lastGame = await getLastRecentGame()
  const playTime = await getPlayTimeSince4AM()

  return {
    lastGame,
    playTime: playTime > 0 ? formatSeconds(playTime) : null,
  }
}

const createAnalyticsStore = () => {
  const { subscribe, set } = writable({})

  loadAnalytics().then(analytics => set(analytics))
  return {
    subscribe,
    scoreTrials: async (gameInfo, scoresheet, status) => {
      const scores = {}
      for (const tag of gameInfo.tags) {
        scores[tag] = { hits: 0, misses: 0 }
      }

      for (const answers of scoresheet) {
        for (const tag of gameInfo.tags) {
          if (tag in answers) {
            if (answers[tag]) {
              scores[tag].hits++
            } else {
              scores[tag].misses++
            }
          }
        }
      }

      await addGame({
        ...gameInfo,
        scores,
        completedTrials: scoresheet.length,
        status
      })
      set(await loadAnalytics())

      // 📊 Send comprehensive statistics to unified system
      if (window.parent !== window && window.parent.gameStats) {
        // Calculate overall accuracy
        let totalHits = 0
        let totalAttempts = 0
        for (const tag of gameInfo.tags) {
          totalHits += scores[tag].hits
          totalAttempts += scores[tag].hits + scores[tag].misses
        }
        const accuracy = totalAttempts > 0 ? totalHits / totalAttempts : 0
        
        window.parent.gameStats.recordSession({
          // Core metrics
          score: totalHits,
          accuracy: accuracy,
          level: gameInfo.nBack,
          nBack: gameInfo.nBack,
          
          // Trial info
          completedTrials: scoresheet.length,
          totalTrials: gameInfo.numTrials,
          status: status,
          
          // Per-stimulus scores
          scores: scores,
          
          // Timing
          trialTime: gameInfo.trialTime,
          matchChance: gameInfo.matchChance,
          
          // Configuration
          mode: gameInfo.mode,
          tags: gameInfo.tags,
          
          // Session timing
          startTime: gameInfo.start,
          duration: Date.now() - gameInfo.start
        })
      }
    },

    scoreTallyTrials: async (gameInfo, scoresheet, status) => {
      const scores = { tally: { hits: 0, misses: 0 } }

      scores.tally.hits = scoresheet.filter(answers => answers.success && answers.count > 0).length
      scores.tally.possible = scoresheet.filter(answers => answers.count > 0 || ('success' in answers && answers.success === false)).length

      await addGame({
        ...gameInfo,
        scores,
        completedTrials: scoresheet.length,
        status,
      })
      set(await loadAnalytics())

      // 📊 Send comprehensive statistics to unified system
      if (window.parent !== window && window.parent.gameStats) {
        const accuracy = scores.tally.possible > 0 ? scores.tally.hits / scores.tally.possible : 0
        
        window.parent.gameStats.recordSession({
          // Core metrics
          score: scores.tally.hits,
          accuracy: accuracy,
          level: gameInfo.nBack,
          nBack: gameInfo.nBack,
          
          // Tally-specific metrics
          tallyHits: scores.tally.hits,
          tallyPossible: scores.tally.possible,
          
          // Trial info
          completedTrials: scoresheet.length,
          totalTrials: gameInfo.numTrials,
          status: status,
          
          // Timing
          trialTime: gameInfo.trialTime,
          
          // Configuration
          mode: gameInfo.mode,
          tags: gameInfo.tags,
          
          // Session timing
          startTime: gameInfo.start,
          duration: Date.now() - gameInfo.start
        })
      }
    }
  }
}

export const analytics = createAnalyticsStore()