<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  cards: { type: Array, required: true },
  glowColor: { type: String, default: '255, 86, 11' },
  spotlightRadius: { type: Number, default: 320 },
  enableTilt: { type: Boolean, default: true },
  enableMagnetism: { type: Boolean, default: true },
  clickEffect: { type: Boolean, default: true },
})

const gridRef = ref(null)
const spotlight = ref({ x: '50%', y: '50%', opacity: 0 })

const gridStyle = computed(() => ({
  '--magic-glow': props.glowColor,
  '--spotlight-x': spotlight.value.x,
  '--spotlight-y': spotlight.value.y,
  '--spotlight-opacity': spotlight.value.opacity,
  '--spotlight-radius': `${props.spotlightRadius}px`,
}))

function handleGridMove(event) {
  const grid = gridRef.value
  if (!grid) return

  const rect = grid.getBoundingClientRect()
  spotlight.value = {
    x: `${event.clientX - rect.left}px`,
    y: `${event.clientY - rect.top}px`,
    opacity: 1,
  }
}

function hideSpotlight() {
  spotlight.value = { ...spotlight.value, opacity: 0 }
}

function handleCardMove(event) {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`)
  card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`)
  card.style.setProperty('--glow-intensity', '1')

  if (props.enableTilt) {
    card.style.setProperty('--rotate-x', `${((y - centerY) / centerY) * -7}deg`)
    card.style.setProperty('--rotate-y', `${((x - centerX) / centerX) * 7}deg`)
  }

  if (props.enableMagnetism) {
    card.style.setProperty('--mag-x', `${(x - centerX) * 0.035}px`)
    card.style.setProperty('--mag-y', `${(y - centerY) * 0.035}px`)
  }
}

function resetCard(event) {
  const card = event.currentTarget
  card.style.setProperty('--glow-intensity', '0')
  card.style.setProperty('--rotate-x', '0deg')
  card.style.setProperty('--rotate-y', '0deg')
  card.style.setProperty('--mag-x', '0px')
  card.style.setProperty('--mag-y', '0px')
}

function burst(event) {
  if (!props.clickEffect) return

  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const maxDistance = Math.max(
    Math.hypot(x, y),
    Math.hypot(x - rect.width, y),
    Math.hypot(x, y - rect.height),
    Math.hypot(x - rect.width, y - rect.height),
  )

  const ripple = document.createElement('span')
  ripple.className = 'magic-bento__ripple'
  ripple.style.cssText = `
    left: ${x - maxDistance}px;
    top: ${y - maxDistance}px;
    width: ${maxDistance * 2}px;
    height: ${maxDistance * 2}px;
  `
  card.appendChild(ripple)
  window.setTimeout(() => ripple.remove(), 760)

  for (let i = 0; i < 10; i += 1) {
    const particle = document.createElement('span')
    const angle = (Math.PI * 2 * i) / 10
    const distance = 26 + Math.random() * 34
    particle.className = 'magic-bento__particle'
    particle.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      --particle-x: ${Math.cos(angle) * distance}px;
      --particle-y: ${Math.sin(angle) * distance}px;
    `
    card.appendChild(particle)
    window.setTimeout(() => particle.remove(), 620)
  }
}
</script>

<template>
  <div
    ref="gridRef"
    class="magic-bento"
    :style="gridStyle"
    @mousemove="handleGridMove"
    @mouseleave="hideSpotlight"
  >
    <article
      v-for="(card, index) in cards"
      :key="`${card.title}-${index}`"
      class="magic-bento__card"
      :class="card.className"
      @mousemove="handleCardMove"
      @mouseleave="resetCard"
      @click="burst"
    >
      <div v-if="card.image" class="magic-bento__image">
        <img :src="card.image" :alt="card.title" />
      </div>

      <div class="magic-bento__content">
        <span class="magic-bento__label">{{ card.label }}</span>
        <h3>{{ card.title }}</h3>
        <p v-if="card.description">{{ card.description }}</p>

        <ul v-if="card.tags?.length" class="magic-bento__tags">
          <li v-for="tag in card.tags" :key="tag">{{ tag }}</li>
        </ul>
      </div>
    </article>
  </div>
</template>

<style scoped>
.magic-bento {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: minmax(150px, auto);
  gap: var(--space-3);
  padding: var(--space-3);
  isolation: isolate;
}

.magic-bento::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(
    var(--spotlight-radius) circle at var(--spotlight-x) var(--spotlight-y),
    rgba(var(--magic-glow), 0.18),
    transparent 64%
  );
  opacity: var(--spotlight-opacity);
  transition: opacity 180ms ease;
  pointer-events: none;
}

.magic-bento__card {
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --rotate-x: 0deg;
  --rotate-y: 0deg;
  --mag-x: 0px;
  --mag-y: 0px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  min-height: 190px;
  overflow: hidden;
  border: 1px solid rgba(var(--magic-glow), 0.18);
  border-radius: var(--radius-md);
  background:
    radial-gradient(
      420px circle at var(--glow-x) var(--glow-y),
      rgba(var(--magic-glow), calc(var(--glow-intensity) * 0.2)),
      transparent 42%
    ),
    #060b13;
  color: #fff;
  transform:
    perspective(900px)
    translate3d(var(--mag-x), var(--mag-y), 0)
    rotateX(var(--rotate-x))
    rotateY(var(--rotate-y));
  transition:
    border-color 220ms ease,
    box-shadow 220ms ease,
    transform 180ms ease;
}

.magic-bento__card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: radial-gradient(
    260px circle at var(--glow-x) var(--glow-y),
    rgba(var(--magic-glow), calc(var(--glow-intensity) * 0.85)),
    transparent 58%
  );
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.magic-bento__card:hover {
  border-color: rgba(var(--magic-glow), 0.42);
  box-shadow: 0 18px 56px rgba(var(--magic-glow), 0.12);
}

.magic-bento__card--hero {
  grid-column: span 2;
  grid-row: span 2;
}

.magic-bento__card--wide {
  grid-column: span 2;
}

.magic-bento__image {
  flex: 1;
  min-height: 270px;
  overflow: hidden;
}

.magic-bento__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.magic-bento__content {
  position: relative;
  z-index: 1;
  padding: var(--space-5);
}

.magic-bento__label {
  display: inline-flex;
  margin-bottom: var(--space-3);
  color: rgb(var(--magic-glow));
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.magic-bento__content h3 {
  font-size: clamp(24px, 3.4vw, 44px);
  line-height: 1;
  overflow-wrap: anywhere;
}

.magic-bento__content p {
  margin-top: var(--space-3);
  color: rgba(255, 255, 255, 0.68);
}

.magic-bento__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.magic-bento__tags li {
  padding: 7px 12px;
  border: 1px solid rgba(var(--magic-glow), 0.42);
  border-radius: var(--radius-pill);
  color: rgb(var(--magic-glow));
  background: rgba(var(--magic-glow), 0.08);
  font-size: 12px;
  font-weight: 700;
}

:deep(.magic-bento__ripple),
:deep(.magic-bento__particle) {
  position: absolute;
  z-index: 4;
  pointer-events: none;
}

:deep(.magic-bento__ripple) {
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(var(--magic-glow), 0.36),
    rgba(var(--magic-glow), 0.12) 32%,
    transparent 68%
  );
  animation: magic-ripple 760ms ease-out forwards;
}

:deep(.magic-bento__particle) {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(var(--magic-glow));
  box-shadow: 0 0 10px rgba(var(--magic-glow), 0.75);
  animation: magic-particle 620ms ease-out forwards;
}

@keyframes magic-ripple {
  from {
    opacity: 1;
    transform: scale(0);
  }
  to {
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes magic-particle {
  to {
    opacity: 0;
    transform: translate(var(--particle-x), var(--particle-y)) scale(0.35);
  }
}

@media (max-width: 720px) {
  .magic-bento {
    grid-template-columns: 1fr;
  }

  .magic-bento__card,
  .magic-bento__card--hero,
  .magic-bento__card--wide {
    grid-column: auto;
    grid-row: auto;
  }

  .magic-bento__image {
    min-height: 230px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .magic-bento__card,
  .magic-bento__card:hover {
    transform: none;
    transition: none;
  }
}
</style>
