// Roulette wheel number sequence (European, clockwise order)
export const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
  11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9,
  22, 18, 29, 7, 28, 12, 35, 3, 26,
]

export const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
export const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

export const CHIPS = [1, 5, 10, 25, 100]

// Bet payout multipliers (returns on top of stake)
export const PAYOUT = {
  STRAIGHT: 35,  // single number
  COLUMN: 2,     // column of 12
  DOZEN: 2,      // group of 12
  OUTSIDE: 1,    // red/black, even/odd, low/high
}

export const HISTORY_LIMIT = 15
export const RESULT_TOAST_MS = 4000

// SVG wheel geometry
export const WHEEL = {
  CX: 200,
  CY: 200,
  OUTER_R: 185,
  TEXT_R: 158,
  SECTOR_ANGLE: 360 / WHEEL_NUMBERS.length,
}

// Spin animation settings
export const SPIN = {
  MIN_FULL_ROUNDS: 6,
  EXTRA_FULL_ROUNDS: 3,     // random 0..2 extra
  DURATION_BASE: 5,         // seconds
  DURATION_EXTRA: 2,        // random 0..2 extra seconds
  SECTOR_RANDOM_SPREAD: 0.55, // fraction of sector to randomise landing within
}
