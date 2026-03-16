<template>
  <div class="history-bar">
    <span class="history-label">History:</span>
    <div class="history-scroll">
      <TransitionGroup name="history-item" tag="div" class="history-list">
        <div
          v-for="(entry, i) in state.history"
          :key="`${entry.number}-${i}`"
          class="history-number"
          :class="`color-${entry.color}`"
        >
          {{ entry.number }}
        </div>
      </TransitionGroup>
    </div>
    <div v-if="state.history.length === 0" class="empty-history">
      No results yet
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore.js'

const { state } = useGameStore()
</script>

<style scoped>
.history-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #0a0f16;
  border-bottom: 2px solid var(--gold);
  min-height: 52px;
}

.history-label {
  color: var(--gold);
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

.history-scroll {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--gold) transparent;
}

.history-scroll::-webkit-scrollbar {
  height: 3px;
}
.history-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.history-scroll::-webkit-scrollbar-thumb {
  background: var(--gold);
  border-radius: 2px;
}

.history-list {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 4px;
}

.history-number {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.15);
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  transition: transform 0.2s;
}

.history-number:first-child {
  border-color: var(--gold);
  box-shadow: 0 0 10px rgba(201, 168, 76, 0.6);
}

.color-green  { background: #1e7c45; }
.color-red    { background: #c0392b; }
.color-black  { background: #333; }

.empty-history {
  color: #555;
  font-size: 12px;
  font-style: italic;
}

.history-item-enter-active {
  transition: all 0.4s ease;
}
.history-item-enter-from {
  opacity: 0;
  transform: scale(0.5) translateX(-20px);
}
</style>
