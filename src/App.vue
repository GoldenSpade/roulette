<template>
  <div class="app">
    <NumberHistory />

    <div class="main-content">
      <div class="wheel-section">
        <RouletteWheel ref="wheelRef" />
        <button
          class="spin-btn"
          :disabled="state.spinning || totalBets === 0"
          @click="wheelRef.spin()"
        >
          <span v-if="state.spinning" class="spin-text spinning-text">Spinning...</span>
          <span v-else class="spin-text">SPIN</span>
        </button>
      </div>

      <div class="table-section">
        <BettingTable />
      </div>
    </div>

    <ChipSelector />
    <ResultToast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RouletteWheel from './components/RouletteWheel.vue'
import BettingTable  from './components/BettingTable.vue'
import ChipSelector  from './components/ChipSelector.vue'
import NumberHistory from './components/NumberHistory.vue'
import ResultToast   from './components/ResultToast.vue'
import { useGameStore } from './stores/gameStore.js'

const { state, totalBets } = useGameStore()
const wheelRef = ref(null)
</script>

<style>
:root {
  --gold:       #c9a84c;
  --gold-light: #FFD700;
  --bg:         #0d1117;
  --felt:       #0a3d0a;
  --felt-border:#0d520d;
  --red:        #c0392b;
  --text:       #e8e8e8;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Georgia', serif;
  min-height: 100vh;
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
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.wheel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px 20px;
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
  background: linear-gradient(145deg, var(--gold), #a07832);
  border: 2px solid var(--gold-light);
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
  background: linear-gradient(145deg, var(--gold-light), var(--gold));
}

.spin-btn:not(:disabled):active { transform: scale(0.97); }

.spin-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.spin-text { display: block; }

.spinning-text {
  font-size: 14px;
  letter-spacing: 1px;
  animation: pulse 0.9s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.6; }
  to   { opacity: 1.0; }
}
</style>
