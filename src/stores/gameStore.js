import { reactive, computed } from 'vue'

export const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
export const BLACK_NUMBERS = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]
export const WHEEL_NUMBERS = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26]
export const CHIPS = [1, 5, 10, 25, 100]

const state = reactive({
  balance: 1000,
  selectedChip: 10,
  bets: {},
  spinning: false,
  lastResult: null,
  lastResultColor: null,
  history: [],
  netWin: null,
  showResult: false,
  winningBets: [],
})

let lastBetsSnapshot = {}

function getNumberColor(n) {
  if (n === 0) return 'green'
  if (RED_NUMBERS.includes(n)) return 'red'
  return 'black'
}

function checkBetWin(betKey, n) {
  if (betKey.startsWith('n_')) {
    return parseInt(betKey.slice(2)) === n
  }
  if (betKey === 'col_1') return n > 0 && n % 3 === 1
  if (betKey === 'col_2') return n > 0 && n % 3 === 2
  if (betKey === 'col_3') return n > 0 && n % 3 === 0
  if (betKey === 'dozen_1') return n >= 1 && n <= 12
  if (betKey === 'dozen_2') return n >= 13 && n <= 24
  if (betKey === 'dozen_3') return n >= 25 && n <= 36
  if (betKey === 'red') return RED_NUMBERS.includes(n)
  if (betKey === 'black') return BLACK_NUMBERS.includes(n)
  if (betKey === 'even') return n > 0 && n % 2 === 0
  if (betKey === 'odd') return n > 0 && n % 2 === 1
  if (betKey === 'low') return n >= 1 && n <= 18
  if (betKey === 'high') return n >= 19 && n <= 36
  return false
}

function getPayoutMultiplier(betKey) {
  if (betKey.startsWith('n_')) return 35
  if (betKey.startsWith('col_') || betKey.startsWith('dozen_')) return 2
  return 1
}

function placeBet(betKey) {
  if (state.spinning) return
  if (state.balance < state.selectedChip) return
  state.bets[betKey] = (state.bets[betKey] || 0) + state.selectedChip
  state.balance -= state.selectedChip
}

function clearBets() {
  if (state.spinning) return
  const total = Object.values(state.bets).reduce((s, v) => s + v, 0)
  state.balance += total
  state.bets = {}
}

function repeatBets(lastBets) {
  if (state.spinning) return
  if (!lastBets || Object.keys(lastBets).length === 0) return
  const totalNeeded = Object.values(lastBets).reduce((s, v) => s + v, 0)
  if (state.balance < totalNeeded) return
  for (const [key, amount] of Object.entries(lastBets)) {
    state.bets[key] = (state.bets[key] || 0) + amount
    state.balance -= amount
  }
}

function processResult(winningNumber) {
  let totalReturn = 0
  const winning = []
  for (const [key, amount] of Object.entries(state.bets)) {
    if (checkBetWin(key, winningNumber)) {
      const mult = getPayoutMultiplier(key)
      totalReturn += amount * (mult + 1)
      winning.push(key)
    }
  }
  const spent = Object.values(state.bets).reduce((s, v) => s + v, 0)
  state.netWin = totalReturn - spent
  state.balance += totalReturn
  state.lastResult = winningNumber
  state.lastResultColor = getNumberColor(winningNumber)
  state.winningBets = winning
  state.history.unshift({ number: winningNumber, color: getNumberColor(winningNumber) })
  if (state.history.length > 15) state.history.length = 15
  lastBetsSnapshot = { ...state.bets }
  state.bets = {}
  state.showResult = true
  setTimeout(() => {
    state.showResult = false
    state.winningBets = []
  }, 4000)
}

const totalBets = computed(() => Object.values(state.bets).reduce((s, v) => s + v, 0))

export function useGameState() {
  return {
    state,
    placeBet,
    clearBets,
    repeatBets,
    getNumberColor,
    checkBetWin,
    getPayoutMultiplier,
    processResult,
    totalBets,
    getLastBets: () => lastBetsSnapshot,
  }
}
