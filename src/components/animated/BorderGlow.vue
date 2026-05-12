<script setup>
/**
 * BorderGlow - mesh-gradient border that lights up near the cursor.
 *
 * Adapted (and converted to plain JS + scoped CSS) from the Vue Bits
 * "BorderGlow" component:
 *   https://vue-bits.dev - https://github.com/DavidHDev/vue-bits
 *
 * Wrap any card with it; the slot content keeps its normal flow while four
 * layers (border, fill, outer glow) ride on top and react to pointer
 * proximity / angle. An optional `animated` prop plays an automatic sweep
 * on mount.
 */
import { computed, ref, useTemplateRef, watch } from 'vue'

const props = defineProps({
  className: { type: String, default: '' },
  edgeSensitivity: { type: Number, default: 30 },
  glowColor: { type: String, default: '207 100 68' }, // "h s% l%"
  backgroundColor: { type: String, default: 'var(--surface)' },
  borderRadius: { type: Number, default: 14 },
  glowRadius: { type: Number, default: 40 },
  glowIntensity: { type: Number, default: 1.0 },
  coneSpread: { type: Number, default: 25 },
  animated: { type: Boolean, default: false },
  colors: {
    type: Array,
    default: () => ['#d83f00', '#ff560b', '#ffb06e'],
  },
  fillOpacity: { type: Number, default: 0.5 },
})

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 40, s: 80, l: 80 }
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  }
}

function buildBoxShadow(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const layers = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ]
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100)
      return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`
    })
    .join(', ')
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}
function easeInCubic(x) {
  return x * x * x
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}) {
  const t0 = performance.now() + delay
  function tick() {
    const elapsed = performance.now() - t0
    const t = Math.min(elapsed / duration, 1)
    onUpdate(start + (end - start) * ease(t))
    if (t < 1) requestAnimationFrame(tick)
    else if (onEnd) onEnd()
  }
  setTimeout(() => requestAnimationFrame(tick), delay)
}

const GRADIENT_POSITIONS = [
  '80% 55%',
  '69% 34%',
  '8% 6%',
  '41% 38%',
  '86% 85%',
  '82% 18%',
  '51% 4%',
]
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

function buildMeshGradients(colors) {
  const gradients = []
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)]
    gradients.push(
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`,
    )
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`)
  return gradients
}

const cardRef = useTemplateRef('cardRef')
const isHovered = ref(false)
const cursorAngle = ref(45)
const edgeProximity = ref(0)
const sweepActive = ref(false)

function getCenterOfElement(el) {
  const { width, height } = el.getBoundingClientRect()
  return [width / 2, height / 2]
}

function getEdgeProximity(el, x, y) {
  const [cx, cy] = getCenterOfElement(el)
  const dx = x - cx
  const dy = y - cy
  let kx = Infinity
  let ky = Infinity
  if (dx !== 0) kx = cx / Math.abs(dx)
  if (dy !== 0) ky = cy / Math.abs(dy)
  return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
}

function getCursorAngle(el, x, y) {
  const [cx, cy] = getCenterOfElement(el)
  const dx = x - cx
  const dy = y - cy
  if (dx === 0 && dy === 0) return 0
  const radians = Math.atan2(dy, dx)
  let degrees = radians * (180 / Math.PI) + 90
  if (degrees < 0) degrees += 360
  return degrees
}

function handlePointerMove(e) {
  const card = cardRef.value
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  edgeProximity.value = getEdgeProximity(card, x, y)
  cursorAngle.value = getCursorAngle(card, x, y)
}

watch(
  () => props.animated,
  () => {
    if (!props.animated) return
    const angleStart = 110
    const angleEnd = 465
    sweepActive.value = true
    cursorAngle.value = angleStart

    animateValue({
      duration: 500,
      onUpdate: (v) => (edgeProximity.value = v / 100),
    })
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        cursorAngle.value =
          (angleEnd - angleStart) * (v / 100) + angleStart
      },
    })
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        cursorAngle.value =
          (angleEnd - angleStart) * (v / 100) + angleStart
      },
    })
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => (edgeProximity.value = v / 100),
      onEnd: () => (sweepActive.value = false),
    })
  },
  { immediate: true },
)

const colorSensitivity = computed(() => props.edgeSensitivity + 20)
const isVisible = computed(() => isHovered.value || sweepActive.value)

const borderOpacity = computed(() =>
  isVisible.value
    ? Math.max(
        0,
        (edgeProximity.value * 100 - colorSensitivity.value) /
          (100 - colorSensitivity.value),
      )
    : 0,
)
const glowOpacity = computed(() =>
  isVisible.value
    ? Math.max(
        0,
        (edgeProximity.value * 100 - props.edgeSensitivity) /
          (100 - props.edgeSensitivity),
      )
    : 0,
)

const meshGradients = computed(() => buildMeshGradients(props.colors))
const borderBg = computed(() =>
  meshGradients.value.map((g) => `${g} border-box`),
)
const fillBg = computed(() =>
  meshGradients.value.map((g) => `${g} padding-box`),
)
const angleDeg = computed(() => `${cursorAngle.value.toFixed(3)}deg`)

const wrapperStyle = computed(() => ({
  background: props.backgroundColor,
  borderRadius: `${props.borderRadius}px`,
  transform: 'translate3d(0, 0, 0.01px)',
  boxShadow:
    'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px',
}))

const borderLayerStyle = computed(() => {
  const cone = `conic-gradient(from ${angleDeg.value} at center, black ${props.coneSpread}%, transparent ${props.coneSpread + 15}%, transparent ${100 - props.coneSpread - 15}%, black ${100 - props.coneSpread}%)`
  return {
    border: '1px solid transparent',
    background: [
      `linear-gradient(${props.backgroundColor} 0 100%) padding-box`,
      'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
      ...borderBg.value,
    ].join(', '),
    opacity: borderOpacity.value,
    maskImage: cone,
    WebkitMaskImage: cone,
    transition: isVisible.value
      ? 'opacity 0.25s ease-out'
      : 'opacity 0.75s ease-in-out',
  }
})

const fillLayerStyle = computed(() => {
  const masks = [
    'linear-gradient(to bottom, black, black)',
    'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
    'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
    'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
    'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
    'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
    `conic-gradient(from ${angleDeg.value} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
  ].join(', ')

  return {
    border: '1px solid transparent',
    background: fillBg.value.join(', '),
    maskImage: masks,
    WebkitMaskImage: masks,
    maskComposite: 'subtract, add, add, add, add, add',
    WebkitMaskComposite:
      'source-out, source-over, source-over, source-over, source-over, source-over',
    opacity: borderOpacity.value * props.fillOpacity,
    mixBlendMode: 'soft-light',
    transition: isVisible.value
      ? 'opacity 0.25s ease-out'
      : 'opacity 0.75s ease-in-out',
  }
})

const outerGlowStyle = computed(() => {
  const cone = `conic-gradient(from ${angleDeg.value} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`
  return {
    inset: `-${props.glowRadius}px`,
    maskImage: cone,
    WebkitMaskImage: cone,
    opacity: glowOpacity.value,
    mixBlendMode: 'plus-lighter',
    transition: isVisible.value
      ? 'opacity 0.25s ease-out'
      : 'opacity 0.75s ease-in-out',
  }
})

const innerGlowStyle = computed(() => ({
  inset: `${props.glowRadius}px`,
  boxShadow: buildBoxShadow(props.glowColor, props.glowIntensity),
}))
</script>

<template>
  <div
    ref="cardRef"
    :class="['border-glow', className]"
    :style="wrapperStyle"
    @pointermove="handlePointerMove"
    @pointerenter="isHovered = true"
    @pointerleave="isHovered = false"
  >
    <div class="border-glow__layer border-glow__border" :style="borderLayerStyle"></div>

    <div class="border-glow__layer border-glow__fill" :style="fillLayerStyle"></div>

    <span class="border-glow__outer" :style="outerGlowStyle">
      <span class="border-glow__outer-inner" :style="innerGlowStyle"></span>
    </span>

    <div class="border-glow__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.border-glow {
  position: relative;
  display: grid;
  isolation: isolate;
  border: 1px solid var(--border-strong);
}

.border-glow__layer {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
}

.border-glow__outer {
  position: absolute;
  z-index: 1;
  border-radius: inherit;
  pointer-events: none;
}

.border-glow__outer-inner {
  position: absolute;
  border-radius: inherit;
}

.border-glow__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}
</style>
