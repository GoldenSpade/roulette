<template>
  <div class="wheel-container">
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="wheel-svg">
      <!-- Outer decorative rings -->
      <circle cx="200" cy="200" r="196" fill="#0d1117" stroke="#c9a84c" stroke-width="2"/>
      <circle cx="200" cy="200" r="192" fill="none" stroke="#c9a84c" stroke-width="3"/>
      <circle cx="200" cy="200" r="188" fill="none" stroke="#2a1f0a" stroke-width="4"/>

      <!-- Rotating wheel group -->
      <g ref="wheelGroup" :style="{ transformOrigin: '200px 200px' }">
        <path
          v-for="(num, i) in WHEEL_NUMBERS"
          :key="i"
          :d="getSectorPath(i)"
          :fill="getSectorFill(num)"
          stroke="#c9a84c"
          stroke-width="0.8"
        />
        <text
          v-for="(num, i) in WHEEL_NUMBERS"
          :key="'t' + i"
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
      <circle cx="200" cy="200" r="5"  fill="#c9a84c"/>

      <!-- Fixed pointer at top (tip points down toward the wheel) -->
      <polygon points="200,22 193,4 207,4" fill="#FFD700" stroke="#a08020" stroke-width="1"/>
    </svg>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'
import { useGameStore, WHEEL_NUMBERS, getNumberColor } from '../stores/gameStore.js'
import { WHEEL, SPIN } from '../constants.js'

const { state, processResult } = useGameStore()

const wheelGroup = ref(null)
let currentRotation = 0

// ─── SVG geometry helpers ─────────────────────────────────────────────────────

const toRad = (deg) => (deg * Math.PI) / 180

function getSectorPath(i) {
  const startAngle = i * WHEEL.SECTOR_ANGLE - 90
  const endAngle   = (i + 1) * WHEEL.SECTOR_ANGLE - 90
  const x1 = WHEEL.CX + WHEEL.OUTER_R * Math.cos(toRad(startAngle))
  const y1 = WHEEL.CY + WHEEL.OUTER_R * Math.sin(toRad(startAngle))
  const x2 = WHEEL.CX + WHEEL.OUTER_R * Math.cos(toRad(endAngle))
  const y2 = WHEEL.CY + WHEEL.OUTER_R * Math.sin(toRad(endAngle))
  return `M ${WHEEL.CX} ${WHEEL.CY} L ${x1} ${y1} A ${WHEEL.OUTER_R} ${WHEEL.OUTER_R} 0 0 1 ${x2} ${y2} Z`
}

function getLabelPos(i) {
  const midAngle = (i + 0.5) * WHEEL.SECTOR_ANGLE - 90
  return {
    x: WHEEL.CX + WHEEL.TEXT_R * Math.cos(toRad(midAngle)),
    y: WHEEL.CY + WHEEL.TEXT_R * Math.sin(toRad(midAngle)),
  }
}

function getLabelTransform(i) {
  const midAngle = (i + 0.5) * WHEEL.SECTOR_ANGLE - 90
  const { x, y } = getLabelPos(i)
  return `rotate(${midAngle + 90}, ${x}, ${y})`
}

// Map number color → SVG fill, reusing store's getNumberColor
const SECTOR_FILLS = { green: '#1e7c45', red: '#c0392b', black: '#1a1a1a' }
const getSectorFill = (num) => SECTOR_FILLS[getNumberColor(num)]

// ─── Spin logic ───────────────────────────────────────────────────────────────

function spin() {
  if (state.spinning || !Object.keys(state.bets).length) return

  const resultIndex  = Math.floor(Math.random() * WHEEL_NUMBERS.length)
  const resultNumber = WHEEL_NUMBERS[resultIndex]

  // Center angle of the target sector at rotation = 0
  const sectorCenter  = resultIndex * WHEEL.SECTOR_ANGLE + WHEEL.SECTOR_ANGLE / 2
  // Small random offset so the ball doesn't always stop at the exact sector center
  const randomOffset  = (Math.random() - 0.5) * WHEEL.SECTOR_ANGLE * SPIN.SECTOR_RANDOM_SPREAD

  // How many degrees clockwise we need to add so the target sector ends up under the pointer.
  // The pointer sits at 0° (top). When the wheel rotates clockwise by θ, the sector that was
  // at angle sectorCenter lands at (sectorCenter - θ) mod 360. Setting that to 0 gives θ ≡ sectorCenter.
  // We negate because our rotation value increases clockwise and we need to "undo" the offset.
  const currentMod = ((currentRotation % 360) + 360) % 360
  const needed     = ((-sectorCenter - randomOffset - currentMod) % 360 + 360) % 360
  const addAngle   = (SPIN.MIN_FULL_ROUNDS + Math.floor(Math.random() * SPIN.EXTRA_FULL_ROUNDS)) * 360 + needed
  const finalRotation = currentRotation + addAngle

  state.spinning = true

  gsap.to(wheelGroup.value, {
    rotation: finalRotation,
    svgOrigin: `${WHEEL.CX} ${WHEEL.CY}`,
    duration: SPIN.DURATION_BASE + Math.random() * SPIN.DURATION_EXTRA,
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
  align-items: center;
  justify-content: center;
}

.wheel-svg {
  width: 480px;
  height: 480px;
  filter: drop-shadow(0 0 32px rgba(201, 168, 76, 0.45));
}
</style>
