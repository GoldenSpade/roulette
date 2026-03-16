<template>
  <div class="chip-selector">
    <div class="chips-row">
      <button
        v-for="chip in CHIPS"
        :key="chip"
        class="chip"
        :class="[`chip-${chip}`, { selected: state.selectedChip === chip }]"
        @click="state.selectedChip = chip"
      >
        <span class="chip-amount">${{ chip }}</span>
      </button>
    </div>

    <div class="actions-row">
      <button
        class="action-btn clear-btn"
        :disabled="state.spinning || totalBets === 0"
        @click="clearBets"
      >
        Clear Bets
      </button>

      <div class="bet-info">
        <span class="info-label">Bets:</span>
        <span class="info-value">${{ totalBets }}</span>
      </div>

      <div class="bet-info">
        <span class="info-label">Balance:</span>
        <span class="info-value balance-value">${{ state.balance }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore.js'
import { CHIPS } from '../constants.js'

const { state, clearBets, totalBets } = useGameStore()
</script>

<style scoped>
.chip-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: #0d1117;
  border-top: 2px solid var(--gold);
  width: 100%;
}

.chips-row {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.chip {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: 'Georgia', serif;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
  position: relative;
  outline: none;
}

.chip::before {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 2px dashed rgba(255,255,255,0.25);
}

.chip:hover  { transform: scale(1.08); }

.chip.selected {
  border-color: var(--gold-light);
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.8);
  transform: scale(1.15);
}

.chip-amount {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  z-index: 1;
}

.chip-1   { background: radial-gradient(circle at 35% 35%, #bdbdbd, #757575); }
.chip-5   { background: radial-gradient(circle at 35% 35%, #ef5350, #b71c1c); }
.chip-10  { background: radial-gradient(circle at 35% 35%, #42a5f5, #0d47a1); }
.chip-25  { background: radial-gradient(circle at 35% 35%, #66bb6a, #1b5e20); }
.chip-100 { background: radial-gradient(circle at 35% 35%, #ab47bc, #4a148c); }

.actions-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 8px 20px;
  border-radius: 6px;
  border: 2px solid;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-weight: bold;
  font-size: 13px;
  letter-spacing: 0.5px;
  transition: opacity 0.2s, box-shadow 0.2s;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.clear-btn {
  background: transparent;
  border-color: #e53935;
  color: #e53935;
}

.clear-btn:not(:disabled):hover {
  background: rgba(229, 57, 53, 0.15);
  box-shadow: 0 0 10px rgba(229, 57, 53, 0.4);
}

.bet-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-label { color: #888; font-size: 13px; }

.info-value {
  color: var(--gold);
  font-size: 16px;
  font-weight: bold;
}

.balance-value { color: #4caf50; }
</style>
