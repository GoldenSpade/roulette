import { reactive, computed } from 'vue'
import {
  RED_NUMBERS,
  BLACK_NUMBERS,
  WHEEL_NUMBERS,
  CHIPS,
  PAYOUT,
  HISTORY_LIMIT,
  RESULT_TOAST_MS,
} from '../constants.js'

export { WHEEL_NUMBERS, RED_NUMBERS, BLACK_NUMBERS, CHIPS }

// ─── State (singleton — shared across all components) ────────────────────────

const state = reactive({
  balance: 1000,
  selectedChip: 10,
  bets: {},            // { betKey: totalAmount }
  spinning: false,
  lastResult: null,    // winning number
  lastResultColor: null,
  history: [],         // [{ number, color }], newest first
  netWin: null,        // positive = win, negative = loss
  showResult: false,
  winningBets: [],     // betKeys that matched this round
  lastBets: {},        // snapshot for "repeat" feature
})

// ─── Pure helpers ─────────────────────────────────────────────────────────────

export function getNumberColor(n) {
  if (n === 0) return 'green'
  return RED_NUMBERS.includes(n) ? 'red' : 'black'
}

function checkBetWin(betKey, n) {
  if (betKey.startsWith('n_'))    return parseInt(betKey.slice(2)) === n
  if (betKey === 'col_1')         return n > 0 && n % 3 === 1
  if (betKey === 'col_2')         return n > 0 && n % 3 === 2
  if (betKey === 'col_3')         return n > 0 && n % 3 === 0
  if (betKey === 'dozen_1')       return n >= 1  && n <= 12
  if (betKey === 'dozen_2')       return n >= 13 && n <= 24
  if (betKey === 'dozen_3')       return n >= 25 && n <= 36
  if (betKey === 'red')           return RED_NUMBERS.includes(n)
  if (betKey === 'black')         return BLACK_NUMBERS.includes(n)
  if (betKey === 'even')          return n > 0 && n % 2 === 0
  if (betKey === 'odd')           return n > 0 && n % 2 === 1
  if (betKey === 'low')           return n >= 1  && n <= 18
  if (betKey === 'high')          return n >= 19 && n <= 36
  return false
}

function getPayoutMultiplier(betKey) {
  if (betKey.startsWith('n_'))                                   return PAYOUT.STRAIGHT
  if (betKey.startsWith('col_') || betKey.startsWith('dozen_')) return PAYOUT.COLUMN
  return PAYOUT.OUTSIDE
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function placeBet(betKey) {
  if (state.spinning || state.balance < state.selectedChip) return
  state.bets[betKey] = (state.bets[betKey] || 0) + state.selectedChip
  state.balance -= state.selectedChip
}

function clearBets() {
  if (state.spinning) return
  state.balance += totalBets.value
  state.bets = {}
}

function repeatBets() {
  if (state.spinning || !Object.keys(state.lastBets).length) return
  const totalNeeded = Object.values(state.lastBets).reduce((s, v) => s + v, 0)
  if (state.balance < totalNeeded) return
  for (const [key, amount] of Object.entries(state.lastBets)) {
    state.bets[key] = (state.bets[key] || 0) + amount
    state.balance -= amount
  }
}

function processResult(winningNumber) {
  let totalReturn = 0
  const winning = []

  for (const [key, amount] of Object.entries(state.bets)) {
    if (checkBetWin(key, winningNumber)) {
      // Return stake + winnings: amount x (1 + multiplier)
      totalReturn += amount * (1 + getPayoutMultiplier(key))
      winning.push(key)
    }
  }

  state.netWin = totalReturn - totalBets.value
  state.balance += totalReturn
  state.lastResult = winningNumber
  state.lastResultColor = getNumberColor(winningNumber)
  state.winningBets = winning
  state.lastBets = { ...state.bets }
  state.history.unshift({ number: winningNumber, color: getNumberColor(winningNumber) })
  if (state.history.length > HISTORY_LIMIT) state.history.length = HISTORY_LIMIT
  state.bets = {}
  state.showResult = true

  setTimeout(() => {
    state.showResult = false
    state.winningBets = []
  }, RESULT_TOAST_MS)
}

// ─── Computed ─────────────────────────────────────────────────────────────────

const totalBets = computed(() => Object.values(state.bets).reduce((s, v) => s + v, 0))

// ─── Public API ───────────────────────────────────────────────────────────────

export function useGameStore() {
  return { state, totalBets, placeBet, clearBets, repeatBets, processResult, getNumberColor }
}
