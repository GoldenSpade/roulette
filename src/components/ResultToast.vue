<template>
  <Transition name="toast">
    <div v-if="state.showResult" class="result-toast">
      <div class="result-circle" :class="`result-${state.lastResultColor}`">
        {{ state.lastResult }}
      </div>
      <div class="result-details">
        <div class="result-color-label" :class="`text-${state.lastResultColor}`">
          {{ state.lastResultColor?.toUpperCase() }}
        </div>
        <div class="result-net" :class="isWin ? 'net-win' : 'net-lose'">
          {{ isWin ? 'WIN' : 'LOST' }}
          <span class="net-amount">{{ isWin ? '+' : '' }}${{ state.netWin }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore.js'

const { state } = useGameStore()
const isWin = computed(() => state.netWin >= 0)
</script>

<style scoped>
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

.result-circle {
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
.result-red   { background: var(--red); border-color: #e74c3c; }
.result-black { background: #2c2c2c;   border-color: #888; }

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

.net-amount { font-size: 22px; }

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
