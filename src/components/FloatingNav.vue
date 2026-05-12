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
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  padding: 6px;
  border-radius: var(--radius-pill);
  background: rgba(6, 16, 32, 0.58);
  border: 1px solid rgba(93, 178, 255, 0.24);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
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
  gap: 2px;
}

.floating-nav a {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text);
  border-radius: var(--radius-pill);
  transition: all var(--transition);
}

.floating-nav a:hover,
.floating-nav a.is-active {
  background: var(--accent-dim);
  color: var(--accent-strong);
}

:root[data-theme="light"] .floating-nav {
  background: rgba(255, 255, 255, 0.76);
  border-color: rgba(31, 111, 235, 0.2);
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
