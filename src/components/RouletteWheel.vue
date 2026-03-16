<template>
  <div class="wheel-container">
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="wheel-svg">
      <!-- Outer decorative rings -->
      <circle cx="200" cy="200" r="196" fill="#0d1117" stroke="#c9a84c" stroke-width="2"/>
      <circle cx="200" cy="200" r="192" fill="none" stroke="#c9a84c" stroke-width="3"/>
      <circle cx="200" cy="200" r="188" fill="none" stroke="#2a1f0a" stroke-width="4"/>

      <!-- Rotating wheel group -->
      <g ref="wheelGroup" :style="{ transformOrigin: '200px 200px' }">
        <!-- Sectors -->
        <path
          v-for="(num, i) in WHEEL_NUMBERS"
          :key="i"
          :d="getSectorPath(i)"
          :fill="getSectorColor(num)"
          stroke="#c9a84c"
          stroke-width="0.8"
        />
        <!-- Number labels -->
        <text
          v-for="(num, i) in WHEEL_NUMBERS"
          :key="'t'+i"
          :x="getLabelPos(i).x"
          :y="getLabelPos(i).y"
          :transform="getLabelTransform(i)"
          fill="white"
          font-size="9"
          font-weight="bold"
          font-family="Georgia, serif"
          text-anchor="middle"
          dominant-baseline="central"
        >{{ num }}</text>
      </g>

      <!-- Fixed decorative inner circles -->
      <circle cx="200" cy="200" r="28" fill="#c9a84c"/>
      <circle cx="200" cy="200" r="24" fill="#1a120a"/>
      <circle cx="200" cy="200" r="18" fill="#c9a84c" opacity="0.3"/>
      <circle cx="200" cy="200" r="5" fill="#c9a84c"/>

      <!-- Fixed pointer at top (tip points down toward the wheel) -->
      <polygon points="200,22 193,4 207,4" fill="#FFD700" stroke="#a08020" stroke-width="1"/>
    </svg>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'
import { useGameState, WHEEL_NUMBERS, RED_NUMBERS } from '../stores/gameStore.js'

const { state, processResult } = useGameState()

const CX = 200
const CY = 200
const OUTER_R = 185
const TEXT_R = 158

const wheelGroup = ref(null)
let currentRotation = 0

function toRad(deg) {
  return (deg * Math.PI) / 180
}

function getSectorPath(i) {
  const total = WHEEL_NUMBERS.length
  const startAngle = i * (360 / total) - 90
  const endAngle = (i + 1) * (360 / total) - 90

  const x1 = CX + OUTER_R * Math.cos(toRad(startAngle))
  const y1 = CY + OUTER_R * Math.sin(toRad(startAngle))
  const x2 = CX + OUTER_R * Math.cos(toRad(endAngle))
  const y2 = CY + OUTER_R * Math.sin(toRad(endAngle))

  return `M ${CX} ${CY} L ${x1} ${y1} A ${OUTER_R} ${OUTER_R} 0 0 1 ${x2} ${y2} Z`
}

function getSectorColor(num) {
  if (num === 0) return '#1e7c45'
  if (RED_NUMBERS.includes(num)) return '#c0392b'
  return '#1a1a1a'
}

function getLabelPos(i) {
  const total = WHEEL_NUMBERS.length
  const midAngle = (i + 0.5) * (360 / total) - 90
  return {
    x: CX + TEXT_R * Math.cos(toRad(midAngle)),
    y: CY + TEXT_R * Math.sin(toRad(midAngle)),
  }
}

function getLabelTransform(i) {
  const total = WHEEL_NUMBERS.length
  const midAngle = (i + 0.5) * (360 / total) - 90
  const pos = getLabelPos(i)
  return `rotate(${midAngle + 90}, ${pos.x}, ${pos.y})`
}

function spin() {
  if (state.spinning) return
  if (Object.keys(state.bets).length === 0) return

  const resultIndex = Math.floor(Math.random() * 37)
  const resultNumber = WHEEL_NUMBERS[resultIndex]

  const SECTOR_ANGLE = 360 / 37
  const sectorCenter = resultIndex * SECTOR_ANGLE + SECTOR_ANGLE / 2
  const randomOffset = (Math.random() - 0.5) * SECTOR_ANGLE * 0.55
  const currentMod = ((currentRotation % 360) + 360) % 360
  const needed = ((-sectorCenter - randomOffset - currentMod) % 360 + 360) % 360
  const addAngle = (6 + Math.floor(Math.random() * 3)) * 360 + needed
  const finalRotation = currentRotation + addAngle

  state.spinning = true

  gsap.to(wheelGroup.value, {
    rotation: finalRotation,
    svgOrigin: '200 200',
    duration: 5 + Math.random() * 2,
    ease: 'power3.out',
    onComplete: () => {
      currentRotation = finalRotation
      state.spinning = false
      processResult(resultNumber)
    },
  })
}

defineExpose({ spin })
</script>

<style scoped>
.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wheel-svg {
  width: 480px;
  height: 480px;
  filter: drop-shadow(0 0 32px rgba(201, 168, 76, 0.45));
}
</style>
