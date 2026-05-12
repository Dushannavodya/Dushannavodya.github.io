<script setup>
import { computed } from 'vue'
import { navigation } from '@/data/site.js'
import { useActiveSection } from '@/composables/useActiveSection.js'
import { useScrollProgress } from '@/composables/useScrollProgress.js'
import { scrollToHash } from '@/composables/useSmoothScroll.js'

const sectionIds = navigation.map((n) => n.id)
const { activeId } = useActiveSection(sectionIds)
const { isVisible: scrolled } = useScrollProgress(120)

// The pill nav fades out when the user scrolls past the hero, mirroring the
// inspiration's behaviour where the floating bar is anchored to the top hero.
const isVisible = computed(() => !scrolled.value)

function onClick(event, href) {
  event.preventDefault()
  scrollToHash(href)
}
</script>

<template>
  <nav
    class="floating-nav"
    :class="{ 'floating-nav--hidden': !isVisible }"
    aria-label="Primary"
  >
    <ul>
      <li v-for="item in navigation" :key="item.id">
        <a
          :href="item.href"
          :class="{ 'is-active': activeId === item.id }"
          @click="onClick($event, item.href)"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.floating-nav {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  padding: 4px;
  border-radius: var(--radius-pill);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.035)),
    rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(26px) saturate(1.18);
  -webkit-backdrop-filter: blur(26px) saturate(1.18);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
  transition: opacity 320ms ease, transform 320ms ease;
}

.floating-nav--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -16px);
}

.floating-nav ul {
  display: flex;
  align-items: center;
  gap: 1px;
}

.floating-nav a {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 9px 16px;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.58);
  border-radius: var(--radius-pill);
  transition:
    color var(--transition),
    background var(--transition),
    transform var(--transition);
}

.floating-nav a::after {
  content: "";
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 6px;
  height: 2px;
  border-radius: var(--radius-pill);
  background: #ff560b;
  opacity: 0;
  transform: scaleX(0.5);
  transition:
    opacity var(--transition),
    transform var(--transition);
}

.floating-nav a:hover {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.9);
}

.floating-nav a.is-active {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

.floating-nav a.is-active::after {
  opacity: 1;
  transform: scaleX(1);
}

@media (max-width: 860px) {
  .floating-nav a {
    padding: 8px 12px;
    font-size: 10px;
    letter-spacing: 0.12em;
  }
}

/* On phones the top pill nav becomes too crowded - hide it and let the
 * icon dock at the bottom handle navigation. */
@media (max-width: 640px) {
  .floating-nav {
    display: none;
  }
}
</style>
