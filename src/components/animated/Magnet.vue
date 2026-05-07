<script setup>
/**
 * Magnet - moves the slot toward the cursor when it's nearby, snapping back
 * on mouse-leave. Inspired by the Vue Bits Magnet component.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  padding: { type: Number, default: 80 }, // activation radius in px
  strength: { type: Number, default: 0.35 }, // 0..1 - how much it follows
  duration: { type: Number, default: 0.4 }, // seconds for the spring back
  disabled: { type: Boolean, default: false },
})

const wrapperRef = ref(null)
const innerRef = ref(null)

let raf = null
let target = { x: 0, y: 0 }
let current = { x: 0, y: 0 }
let isActive = false

function lerp(a, b, t) {
  return a + (b - a) * t
}

function tick() {
  current.x = lerp(current.x, target.x, 0.18)
  current.y = lerp(current.y, target.y, 0.18)
  if (innerRef.value) {
    innerRef.value.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
  }
  const dx = target.x - current.x
  const dy = target.y - current.y
  if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
    raf = requestAnimationFrame(tick)
  } else {
    raf = null
  }
}

function startTick() {
  if (raf == null) raf = requestAnimationFrame(tick)
}

function onMouseMove(event) {
  if (props.disabled) return
  const el = wrapperRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = event.clientX - cx
  const dy = event.clientY - cy
  const dist = Math.hypot(dx, dy)
  const radius = Math.max(rect.width, rect.height) / 2 + props.padding

  if (dist < radius) {
    isActive = true
    target = { x: dx * props.strength, y: dy * props.strength }
    startTick()
  } else if (isActive) {
    isActive = false
    target = { x: 0, y: 0 }
    startTick()
  }
}

function onMouseLeave() {
  isActive = false
  target = { x: 0, y: 0 }
  startTick()
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  if (raf != null) cancelAnimationFrame(raf)
})
</script>

<template>
  <span
    ref="wrapperRef"
    class="magnet"
    @mouseleave="onMouseLeave"
  >
    <span
      ref="innerRef"
      class="magnet__inner"
      :style="{ transition: `transform ${duration}s cubic-bezier(0.22,1,0.36,1)` }"
    >
      <slot />
    </span>
  </span>
</template>

<style scoped>
.magnet {
  display: inline-block;
}
.magnet__inner {
  display: inline-block;
  will-change: transform;
}
</style>
