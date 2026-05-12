<script setup>
/**
 * PixelBlast - pixelated animated background.
 *
 * Inspired by the Vue Bits "PixelBlast" background, converted here to a
 * dependency-free canvas component so it fits this project without adding
 * Three.js/postprocessing for a hero backdrop.
 */
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'

const props = defineProps({
  color: { type: String, default: '#ff560b' },
  pixelSize: { type: Number, default: 14 },
  speed: { type: Number, default: 0.55 },
  density: { type: Number, default: 0.58 },
  glowColor: { type: String, default: 'rgba(46, 91, 255, 0.72)' },
  rippleColor: { type: String, default: 'rgba(160, 194, 255, 0.92)' },
  enableRipples: { type: Boolean, default: false },
  edgeFade: { type: Number, default: 0.18 },
})

const canvasRef = useTemplateRef('canvasRef')

let ctx = null
let animationFrame = null
let startedAt = 0
let dpr = 1
const ripples = []

function hexToRgb(hex) {
  const normalized = hex.replace('#', '')
  const value = parseInt(
    normalized.length === 3
      ? normalized.split('').map((char) => char + char).join('')
      : normalized,
    16,
  )
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function noise(x, y, t) {
  const wave =
    Math.sin(x * 0.085 + t * 0.95) +
    Math.cos(y * 0.075 - t * 0.8) +
    Math.sin((x + y) * 0.045 + t * 0.62)
  const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return wave * 0.22 + (hash - Math.floor(hash) - 0.5) * 0.7
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = Math.max(1, Math.floor(width * dpr))
  canvas.height = Math.max(1, Math.floor(height * dpr))
}

function drawPixel(x, y, size, alpha, rgb) {
  const pulse = Math.min(1, alpha)
  ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pulse})`
  ctx.fillRect(x, y, size, size)

  if (pulse > 0.72) {
    ctx.fillStyle = props.glowColor
    ctx.fillRect(x + size * 0.25, y + size * 0.25, size * 0.5, size * 0.5)
  }
}

function draw(time) {
  const canvas = canvasRef.value
  if (!ctx || !canvas) return

  const seconds = (time - startedAt) / 1000
  const width = canvas.width
  const height = canvas.height
  const size = Math.max(6, props.pixelSize * dpr)
  const rgb = hexToRgb(props.color)

  ctx.clearRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'

  const columns = Math.ceil(width / size)
  const rows = Math.ceil(height / size)
  const centerX = width * 0.5
  const centerY = height * 0.5
  const maxDistance = Math.hypot(centerX, centerY)

  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      const x = col * size
      const y = row * size
      const px = x + size * 0.5
      const py = y + size * 0.5
      const dist = Math.hypot(px - centerX, py - centerY)
      const edge = Math.min(px, py, width - px, height - py) / Math.min(width, height)
      const fade = Math.min(1, Math.max(0, edge / props.edgeFade))
      const field = noise(col, row, seconds * props.speed)

      let alpha = field + props.density - dist / maxDistance * 0.42

      if (props.enableRipples) {
        for (const ripple of ripples) {
          const age = seconds - ripple.time
          const radius = age * 620 * dpr
          const ringDistance = Math.abs(Math.hypot(px - ripple.x, py - ripple.y) - radius)
          const ring = Math.max(0, 1 - ringDistance / (42 * dpr))
          alpha += ring * Math.max(0, 1 - age * 0.65)
        }
      }

      if (alpha > 0.48) {
        const snappedAlpha = Math.min(0.9, (alpha - 0.32) * 0.95) * fade
        drawPixel(x, y, size * 0.72, snappedAlpha, rgb)
      }
    }
  }

  if (props.enableRipples) {
    ctx.globalCompositeOperation = 'lighter'
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i]
      const age = seconds - ripple.time
      if (age > 2.8) {
        ripples.splice(i, 1)
        continue
      }

      ctx.strokeStyle = props.rippleColor
      ctx.globalAlpha = Math.max(0, 0.4 - age * 0.14)
      ctx.lineWidth = Math.max(1, 2 * dpr)
      ctx.beginPath()
      ctx.arc(ripple.x, ripple.y, age * 620 * dpr, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1
  animationFrame = requestAnimationFrame(draw)
}

function handlePointerDown(event) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  ripples.push({
    x: (event.clientX - rect.left) * dpr,
    y: (event.clientY - rect.top) * dpr,
    time: (performance.now() - startedAt) / 1000,
  })
}

function start() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  resizeCanvas()
  startedAt = performance.now()
  if (props.enableRipples) {
    canvas.addEventListener('pointerdown', handlePointerDown, { passive: true })
  }
  window.addEventListener('resize', resizeCanvas)
  animationFrame = requestAnimationFrame(draw)
}

function stop() {
  const canvas = canvasRef.value
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  canvas?.removeEventListener('pointerdown', handlePointerDown)
  window.removeEventListener('resize', resizeCanvas)
}

onMounted(start)
onBeforeUnmount(stop)

watch(
  () => [props.color, props.pixelSize, props.speed, props.density],
  () => {
    ripples.length = 0
  },
)
</script>

<template>
  <canvas ref="canvasRef" class="pixel-blast-canvas"></canvas>
</template>

<style scoped>
.pixel-blast-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
