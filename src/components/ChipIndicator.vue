<template>
  <div v-if="amount" class="chip-indicator">
    {{ amount >= 1000 ? (amount / 1000).toFixed(1) + 'k' : amount }}
  </div>
</template>

<script setup>
defineProps({
  amount: {
    type: Number,
    default: 0,
  },
})
</script>

<style scoped>
.chip-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  background: #FFD700;
  color: #1a1a1a;
  border-radius: 50%;
  font-size: 8px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  border: 1px solid #a08020;
  box-shadow: 0 1px 3px rgba(0,0,0,0.5);
  z-index: 2;
  pointer-events: none;
}
</style>
