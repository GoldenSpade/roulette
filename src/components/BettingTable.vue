<template>
  <div class="betting-table">
    <!-- Zero -->
    <div
      class="cell zero-cell"
      :class="{ 'is-winning': isWinning('n_0') }"
      @click="placeBet('n_0')"
    >
      <span class="cell-number green-num">0</span>
      <ChipIndicator :amount="state.bets['n_0']" />
    </div>

    <!-- Number grid wrapper -->
    <div class="grid-wrapper">
      <!-- Numbers grid: 12 cols x 3 rows -->
      <div class="numbers-grid">
        <!-- Row 1: 3, 6, 9, ..., 36 -->
        <div
          v-for="col in 12" :key="`r1-${col}`"
          class="cell number-cell"
          :class="[getNumClass(col * 3), { 'is-winning': isWinning(`n_${col * 3}`) }]"
          @click="placeBet(`n_${col * 3}`)"
        >
          <span class="cell-number">{{ col * 3 }}</span>
          <ChipIndicator :amount="state.bets[`n_${col * 3}`]" />
        </div>
        <!-- Row 2: 2, 5, 8, ..., 35 -->
        <div
          v-for="col in 12" :key="`r2-${col}`"
          class="cell number-cell"
          :class="[getNumClass(col * 3 - 1), { 'is-winning': isWinning(`n_${col * 3 - 1}`) }]"
          @click="placeBet(`n_${col * 3 - 1}`)"
        >
          <span class="cell-number">{{ col * 3 - 1 }}</span>
          <ChipIndicator :amount="state.bets[`n_${col * 3 - 1}`]" />
        </div>
        <!-- Row 3: 1, 4, 7, ..., 34 -->
        <div
          v-for="col in 12" :key="`r3-${col}`"
          class="cell number-cell"
          :class="[getNumClass(col * 3 - 2), { 'is-winning': isWinning(`n_${col * 3 - 2}`) }]"
          @click="placeBet(`n_${col * 3 - 2}`)"
        >
          <span class="cell-number">{{ col * 3 - 2 }}</span>
          <ChipIndicator :amount="state.bets[`n_${col * 3 - 2}`]" />
        </div>
      </div>

      <!-- Column bets (2 to 1) — 3 rows, 1 col on the right -->
      <div class="column-bets">
        <div
          class="cell col-cell"
          :class="{ 'is-winning': isWinning('col_3') }"
          @click="placeBet('col_3')"
        >
          <span class="col-label">2:1</span>
          <ChipIndicator :amount="state.bets['col_3']" />
        </div>
        <div
          class="cell col-cell"
          :class="{ 'is-winning': isWinning('col_2') }"
          @click="placeBet('col_2')"
        >
          <span class="col-label">2:1</span>
          <ChipIndicator :amount="state.bets['col_2']" />
        </div>
        <div
          class="cell col-cell"
          :class="{ 'is-winning': isWinning('col_1') }"
          @click="placeBet('col_1')"
        >
          <span class="col-label">2:1</span>
          <ChipIndicator :amount="state.bets['col_1']" />
        </div>
      </div>
    </div>

    <!-- Dozens row -->
    <div class="dozens-row">
      <div
        class="cell outside-cell dozen-cell"
        :class="{ 'is-winning': isWinning('dozen_1') }"
        @click="placeBet('dozen_1')"
      >
        <span>1st 12</span>
        <ChipIndicator :amount="state.bets['dozen_1']" />
      </div>
      <div
        class="cell outside-cell dozen-cell"
        :class="{ 'is-winning': isWinning('dozen_2') }"
        @click="placeBet('dozen_2')"
      >
        <span>2nd 12</span>
        <ChipIndicator :amount="state.bets['dozen_2']" />
      </div>
      <div
        class="cell outside-cell dozen-cell"
        :class="{ 'is-winning': isWinning('dozen_3') }"
        @click="placeBet('dozen_3')"
      >
        <span>3rd 12</span>
        <ChipIndicator :amount="state.bets['dozen_3']" />
      </div>
    </div>

    <!-- Outside bets row -->
    <div class="outside-row">
      <div
        class="cell outside-cell"
        :class="{ 'is-winning': isWinning('low') }"
        @click="placeBet('low')"
      >
        <span>1-18</span>
        <ChipIndicator :amount="state.bets['low']" />
      </div>
      <div
        class="cell outside-cell"
        :class="{ 'is-winning': isWinning('even') }"
        @click="placeBet('even')"
      >
        <span>Even</span>
        <ChipIndicator :amount="state.bets['even']" />
      </div>
      <div
        class="cell outside-cell red-cell"
        :class="{ 'is-winning': isWinning('red') }"
        @click="placeBet('red')"
      >
        <span>Red</span>
        <ChipIndicator :amount="state.bets['red']" />
      </div>
      <div
        class="cell outside-cell black-cell"
        :class="{ 'is-winning': isWinning('black') }"
        @click="placeBet('black')"
      >
        <span>Black</span>
        <ChipIndicator :amount="state.bets['black']" />
      </div>
      <div
        class="cell outside-cell"
        :class="{ 'is-winning': isWinning('odd') }"
        @click="placeBet('odd')"
      >
        <span>Odd</span>
        <ChipIndicator :amount="state.bets['odd']" />
      </div>
      <div
        class="cell outside-cell"
        :class="{ 'is-winning': isWinning('high') }"
        @click="placeBet('high')"
      >
        <span>19-36</span>
        <ChipIndicator :amount="state.bets['high']" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore, getNumberColor } from '../stores/gameStore.js'
import ChipIndicator from './ChipIndicator.vue'

const { state, placeBet } = useGameStore()

const getNumClass  = (n) => `${getNumberColor(n)}-num-cell`
const isWinning    = (betKey) => state.showResult && state.winningBets.includes(betKey)
</script>

<style scoped>
.betting-table {
  background: var(--felt);
  border: 2px solid var(--gold);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 0 30px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3);
  width: 100%;
}

.zero-cell {
  background: #1e7c45;
  border-color: var(--gold) !important;
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}

.grid-wrapper {
  display: flex;
  gap: 4px;
  align-items: stretch;
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 3px;
  flex: 1;
}

.column-bets {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 52px;
  flex-shrink: 0;
}

.col-cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--felt-border);
}

.col-label {
  font-size: 9px;
  font-weight: bold;
  color: var(--gold);
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.dozens-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}

.outside-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 3px;
}

.cell {
  position: relative;
  border: 1px solid var(--gold);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  user-select: none;
  min-height: 44px;
}

.cell:hover {
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  z-index: 1;
}

.number-cell {
  background: var(--felt);
  min-height: 44px;
}

.number-cell.red-num-cell   { background: #7a1a10; }
.number-cell.black-num-cell { background: #111; }

.outside-cell {
  background: var(--felt-border);
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: var(--gold);
  text-transform: uppercase;
  padding: 6px 4px;
}

.dozen-cell {
  min-height: 40px;
}

.outside-cell.red-cell   { background: #7a1a10; color: #fff; }
.outside-cell.black-cell { background: #111;    color: #fff; }

.cell-number {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  z-index: 1;
}

.green-num {
  font-size: 16px;
  color: #fff;
}

.is-winning {
  border: 2px solid #FFD700 !important;
  box-shadow: 0 0 14px rgba(255, 215, 0, 0.8), inset 0 0 8px rgba(255, 215, 0, 0.3) !important;
  animation: winPulse 0.6s ease-in-out infinite alternate;
}

@keyframes winPulse {
  from { box-shadow: 0 0 10px rgba(255, 215, 0, 0.6), inset 0 0 5px rgba(255, 215, 0, 0.2); }
  to   { box-shadow: 0 0 24px rgba(255, 215, 0, 1.0), inset 0 0 12px rgba(255, 215, 0, 0.5); }
}
</style>
