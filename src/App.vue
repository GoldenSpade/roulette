<template>
  <div class="app">
    <!-- Top history bar -->
    <NumberHistory />

    <!-- Main content -->
    <div class="main-content">
      <!-- Top: Wheel + Spin button -->
      <div class="wheel-section">
        <RouletteWheel ref="wheelRef" />
        <button
          class="spin-btn"
          :disabled="state.spinning || totalBets === 0"
          @click="handleSpin"
        >
          <span v-if="state.spinning" class="spin-text spinning-text">Spinning...</span>
          <span v-else class="spin-text">SPIN</span>
        </button>
      </div>

      <!-- Bottom: Betting Table -->
      <div class="table-section">
        <BettingTable />
      </div>
    </div>

    <!-- Bottom: Chip Selector -->
    <ChipSelector />

    <!-- Result Toast -->
    <Transition name="toast">
      <div v-if="state.showResult" class="result-toast">
        <div class="result-number-circle" :class="`result-${state.lastResultColor}`">
          {{ state.lastResult }}
        </div>
        <div class="result-details">
          <div class="result-color-label" :class="`text-${state.lastResultColor}`">
            {{ state.lastResultColor?.toUpperCase() }}
          </div>
          <div
            class="result-net"
            :class="state.netWin >= 0 ? 'net-win' : 'net-lose'"
          >
            {{ state.netWin >= 0 ? 'WIN' : 'LOST' }}
            <span class="net-amount">
              {{ state.netWin >= 0 ? '+' : '' }}${{ state.netWin }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RouletteWheel from './components/RouletteWheel.vue'
import BettingTable from './components/BettingTable.vue'
import ChipSelector from './components/ChipSelector.vue'
import NumberHistory from './components/NumberHistory.vue'
import { useGameState } from './stores/gameStore.js'

const { state, totalBets } = useGameState()

const wheelRef = ref(null)

function handleSpin() {
  if (state.spinning || totalBets.value === 0) return
  wheelRef.value.spin()
}
</script>

<style>
:root {
  --gold: #c9a84c;
  --gold-light: #FFD700;
  --bg: #0d1117;
  --felt: #0a3d0a;
  --felt-border: #0d520d;
  --red: #c0392b;
  --black: #1a1a1a;
  --text: #e8e8e8;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Georgia', serif;
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg);
}

.main-content {
  display: flex;
  flex: 1;
  gap: 0;
  overflow: hidden;
}

.wheel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  gap: 20px;
  border-right: 2px solid var(--gold);
  background: linear-gradient(180deg, #0d1117 0%, #111820 100%);
  min-width: 420px;
  flex-shrink: 0;
}

.table-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  min-width: 0;
}

.spin-btn {
  width: 140px;
  height: 52px;
  background: linear-gradient(145deg, #c9a84c, #a07832);
  border: 2px solid #FFD700;
  border-radius: 8px;
  color: #0d1117;
  font-size: 20px;
  font-weight: bold;
  font-family: 'Georgia', serif;
  letter-spacing: 3px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
  box-shadow: 0 4px 18px rgba(201, 168, 76, 0.4);
}

.spin-btn:not(:disabled):hover {
  transform: scale(1.05);
  box-shadow: 0 6px 28px rgba(255, 215, 0, 0.6);
  background: linear-gradient(145deg, #FFD700, #c9a84c);
}

.spin-btn:not(:disabled):active {
  transform: scale(0.97);
}

.spin-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.spin-text {
  display: block;
}

.spinning-text {
  font-size: 14px;
  letter-spacing: 1px;
  animation: pulse 0.9s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.6; }
  to   { opacity: 1.0; }
}

/* Result Toast */
.result-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 15, 22, 0.97);
  border: 2px solid var(--gold);
  border-radius: 14px;
  padding: 18px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1000;
  box-shadow: 0 8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(201, 168, 76, 0.3);
  min-width: 280px;
  justify-content: center;
}

.result-number-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  border: 3px solid rgba(255,255,255,0.3);
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(255,255,255,0.1);
}

.result-green { background: #1e7c45; border-color: #2ecc71; }
.result-red   { background: #c0392b; border-color: #e74c3c; }
.result-black { background: #2c2c2c; border-color: #888; }

.result-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-color-label {
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
}

.text-green { color: #2ecc71; }
.text-red   { color: #e74c3c; }
.text-black { color: #aaa; }

.result-net {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.net-win  { color: #2ecc71; }
.net-lose { color: #e74c3c; }

.net-amount {
  font-size: 22px;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(30px) scale(0.85);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.9);
}
</style>
