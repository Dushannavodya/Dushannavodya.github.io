<script setup>
/**
 * Squares - animated grid background.
 *
 * Adapted (and converted to plain JS) from the Vue Bits "Squares" component:
 * https://vue-bits.dev - https://github.com/DavidHDev/vue-bits
 */
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

const props = defineProps({
  direction: { type: String, default: 'right' }, // 'diagonal' | 'up' | 'right' | 'down' | 'left'
  speed: { type: Number, default: 1 },
  borderColor: { type: String, default: 'rgba(255,255,255,0.18)' },
  squareSize: { type: Number, default: 40 },
  hoverFillColor: { type: String, default: 'rgba(255,255,255,0.08)' },
  /** Color of the centered radial vignette - lets the canvas blend into a parent background. */
  vignetteColor: { type: String, default: '#0a0a0a' },
})

const canvasRef = useTemplateRef('canvasRef')
const requestRef = ref(null)
const gridOffset = ref({ x: 0, y: 0 })
const hoveredSquareRef = ref(null)

let ctx = null

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
}

function drawGrid() {
  const canvas = canvasRef.value
  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const startX =
    Math.floor(gridOffset.value.x / props.squareSize) * props.squareSize
  const startY =
    Math.floor(gridOffset.value.y / props.squareSize) * props.squareSize

  for (let x = startX; x < canvas.width + props.squareSize; x += props.squareSize) {
    for (let y = startY; y < canvas.height + props.squareSize; y += props.squareSize) {
      const squareX = x - (gridOffset.value.x % props.squareSize)
      const squareY = y - (gridOffset.value.y % props.squareSize)

      if (
        hoveredSquareRef.value &&
        Math.floor((x - startX) / props.squareSize) === hoveredSquareRef.value.x &&
        Math.floor((y - startY) / props.squareSize) === hoveredSquareRef.value.y
      ) {
        ctx.fillStyle = props.hoverFillColor
        ctx.fillRect(squareX, squareY, props.squareSize, props.squareSize)
      }

      ctx.strokeStyle = props.borderColor
      ctx.strokeRect(squareX, squareY, props.squareSize, props.squareSize)
    }
  }

  // Soft radial vignette so the squares fade into the parent background.
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2,
  )
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, props.vignetteColor)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function updateAnimation() {
  const effectiveSpeed = Math.max(props.speed, 0.1)

  switch (props.direction) {
    case 'right':
      gridOffset.value.x =
        (gridOffset.value.x - effectiveSpeed + props.squareSize) %
        props.squareSize
      break
    case 'left':
      gridOffset.value.x =
        (gridOffset.value.x + effectiveSpeed + props.squareSize) %
        props.squareSize
      break
    case 'up':
      gridOffset.value.y =
        (gridOffset.value.y + effectiveSpeed + props.squareSize) %
        props.squareSize
      break
    case 'down':
      gridOffset.value.y =
        (gridOffset.value.y - effectiveSpeed + props.squareSize) %
        props.squareSize
      break
    case 'diagonal':
      gridOffset.value.x =
        (gridOffset.value.x - effectiveSpeed + props.squareSize) %
        props.squareSize
      gridOffset.value.y =
        (gridOffset.value.y - effectiveSpeed + props.squareSize) %
        props.squareSize
      break
  }

  drawGrid()
  requestRef.value = requestAnimationFrame(updateAnimation)
}

function handleMouseMove(event) {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  const startX =
    Math.floor(gridOffset.value.x / props.squareSize) * props.squareSize
  const startY =
    Math.floor(gridOffset.value.y / props.squareSize) * props.squareSize

  const hoveredSquareX = Math.floor(
    (mouseX + gridOffset.value.x - startX) / props.squareSize,
  )
  const hoveredSquareY = Math.floor(
    (mouseY + gridOffset.value.y - startY) / props.squareSize,
  )

  if (
    !hoveredSquareRef.value ||
    hoveredSquareRef.value.x !== hoveredSquareX ||
    hoveredSquareRef.value.y !== hoveredSquareY
  ) {
    hoveredSquareRef.value = { x: hoveredSquareX, y: hoveredSquareY }
  }
}

function handleMouseLeave() {
  hoveredSquareRef.value = null
}

function initialize() {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  resizeCanvas()

  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseleave', handleMouseLeave)
  window.addEventListener('resize', resizeCanvas)

  requestRef.value = requestAnimationFrame(updateAnimation)
}

function cleanup() {
  const canvas = canvasRef.value
  if (requestRef.value) {
    cancelAnimationFrame(requestRef.value)
    requestRef.value = null
  }
  if (canvas) {
    canvas.removeEventListener('mousemove', handleMouseMove)
    canvas.removeEventListener('mouseleave', handleMouseLeave)
  }
  window.removeEventListener('resize', resizeCanvas)
}

onMounted(initialize)
onBeforeUnmount(cleanup)

watch(
  () => [
    props.direction,
    props.speed,
    props.borderColor,
    props.hoverFillColor,
    props.squareSize,
  ],
  () => {
    cleanup()
    initialize()
  },
)
</script>

<template>
  <canvas ref="canvasRef" class="squares-canvas"></canvas>
</template>

<style scoped>
.squares-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
