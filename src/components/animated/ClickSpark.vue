<script setup>
/**
 * ClickSpark - emits a burst of radial sparks from the cursor on click.
 * Inspired by the Vue Bits ClickSpark component.
 *
 * Mount it once at the root - it covers the whole viewport via a
 * pointer-events:none canvas.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  sparkColor: { type: String, default: '#5db2ff' },
  sparkSize: { type: Number, default: 10 },
  sparkRadius: { type: Number, default: 22 },
  sparkCount: { type: Number, default: 9 },
  duration: { type: Number, default: 480 }, // ms
  easing: { type: Function, default: (t) => 1 - Math.pow(1 - t, 3) },
})

const canvasRef = ref(null)

let ctx = null
let raf = null
let sparks = []

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  if (ctx) ctx.scale(dpr, dpr)
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const now = performance.now()

  sparks = sparks.filter((s) => now - s.startTime < props.duration)

  for (const spark of sparks) {
    const t = (now - spark.startTime) / props.duration
    const eased = props.easing(t)
    const distance = eased * props.sparkRadius * 2
    const length = props.sparkSize * (1 - eased)
    const x1 = spark.x + distance * Math.cos(spark.angle)
    const y1 = spark.y + distance * Math.sin(spark.angle)
    const x2 = spark.x + (distance + length) * Math.cos(spark.angle)
    const y2 = spark.y + (distance + length) * Math.sin(spark.angle)

    ctx.strokeStyle = props.sparkColor
    ctx.lineWidth = 2
    ctx.globalAlpha = 1 - eased
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  if (sparks.length > 0) {
    raf = requestAnimationFrame(draw)
  } else {
    raf = null
  }
}

function startDraw() {
  if (raf == null) raf = requestAnimationFrame(draw)
}

function onClick(event) {
  const now = performance.now()
  const x = event.clientX
  const y = event.clientY
  for (let i = 0; i < props.sparkCount; i++) {
    sparks.push({
      x,
      y,
      angle: (Math.PI * 2 * i) / props.sparkCount,
      startTime: now,
    })
  }
  startDraw()
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('click', onClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('click', onClick)
  if (raf != null) cancelAnimationFrame(raf)
})
</script>

<template>
  <canvas ref="canvasRef" class="click-spark" aria-hidden="true"></canvas>
</template>

<style scoped>
.click-spark {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}
</style>
