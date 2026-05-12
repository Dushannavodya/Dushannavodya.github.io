<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  User,
  Briefcase,
  FileText,
  Sparkles,
  Send,
  ArrowUp,
  Moon,
  Sun,
} from 'lucide-vue-next'
import { useActiveSection } from '@/composables/useActiveSection.js'
import { useScrollProgress } from '@/composables/useScrollProgress.js'
import { scrollToHash, scrollToTop } from '@/composables/useSmoothScroll.js'
import { useTheme } from '@/composables/useTheme.js'

// Order MUST match the order of the sections on the page so the dock
// reads left-to-right as you scroll top-to-bottom.
const dockItems = [
  { id: 'about', label: 'About', icon: User, href: '#about' },
  { id: 'services', label: 'Services', icon: Sparkles, href: '#services' },
  { id: 'works', label: 'Work', icon: Briefcase, href: '#works' },
  { id: 'cv', label: 'CV', icon: FileText, href: '#cv' },
  { id: 'contact', label: 'Contact', icon: Send, href: '#contact' },
]

const { activeId } = useActiveSection(dockItems.map((i) => i.id))
const { isVisible } = useScrollProgress(120)
const { isLight, toggleTheme } = useTheme()
const isMobileDock = ref(false)
const isDockVisible = computed(() => isMobileDock.value || isVisible.value)

let mediaQuery = null

function updateDockMode() {
  isMobileDock.value = mediaQuery?.matches || false
}

function onClick(event, href) {
  event.preventDefault()
  scrollToHash(href)
}

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 900px), (pointer: coarse)')
  updateDockMode()
  mediaQuery.addEventListener('change', updateDockMode)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateDockMode)
})
</script>

<template>
  <nav
    class="dock"
    :class="{
      'dock--hidden': !isDockVisible,
      'dock--mobile': isMobileDock,
    }"
    aria-label="Quick navigation"
  >
    <ul>
      <li v-for="item in dockItems" :key="item.id">
        <a
          :href="item.href"
          :title="item.label"
          :aria-label="item.label"
          :class="{ 'is-active': activeId === item.id }"
          @click="onClick($event, item.href)"
        >
          <component :is="item.icon" :size="18" :stroke-width="1.6" />
        </a>
      </li>
      <li class="dock__separator" aria-hidden="true"></li>
      <li>
        <button
          type="button"
          :aria-label="isLight ? 'Switch to dark mode' : 'Switch to light mode'"
          :title="isLight ? 'Dark mode' : 'Light mode'"
          @click="toggleTheme"
        >
          <Moon v-if="isLight" :size="18" :stroke-width="1.6" />
          <Sun v-else :size="18" :stroke-width="1.6" />
        </button>
      </li>
      <li>
        <button
          type="button"
          aria-label="Back to top"
          title="Back to top"
          @click="scrollToTop"
        >
          <ArrowUp :size="18" :stroke-width="1.6" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.dock {
  position: fixed;
  bottom: max(24px, calc(env(safe-area-inset-bottom) + 12px));
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  z-index: 10001;
  width: max-content;
  max-width: calc(100dvw - 24px);
  padding: 8px;
  border-radius: var(--radius-pill);
  background: rgba(10, 10, 10, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-soft);
  transition: opacity 320ms ease, transform 320ms ease;
}

.dock--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translate3d(-50%, 16px, 0);
}

.dock ul {
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}

.dock ul::-webkit-scrollbar {
  display: none;
}

.dock a,
.dock button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: var(--text-muted);
  transition: all var(--transition);
}

.dock a:hover,
.dock button:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.08);
}

.dock a.is-active {
  color: var(--accent);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 0 1px rgba(255, 86, 11, 0.22);
}

.dock__separator {
  width: 1px;
  height: 22px;
  background: var(--border-strong);
  margin: 0 4px;
}

:root[data-theme="light"] .dock {
  background: var(--dock-bg);
  border-color: var(--dock-border);
}

:root[data-theme="light"] .dock a:hover,
:root[data-theme="light"] .dock button:hover {
  color: var(--accent-strong);
  background: var(--control-hover-bg);
}

@media (max-width: 640px) {
  .dock {
    bottom: max(12px, calc(env(safe-area-inset-bottom) + 8px));
    max-width: calc(100dvw - 16px);
    padding: 6px;
  }
}

@media (max-width: 900px), (pointer: coarse) {
  .dock,
  .dock.dock--hidden,
  .dock.dock--mobile {
    position: fixed;
    left: 50%;
    right: auto;
    bottom: max(10px, calc(env(safe-area-inset-bottom) + 8px));
    width: fit-content;
    max-width: calc(100dvw - 16px);
    transform: translate3d(-50%, 0, 0);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .dock {
    display: flex;
    justify-content: center;
    padding: 6px;
    border-radius: 28px;
  }

  .dock ul {
    width: max-content;
    max-width: 100%;
    justify-content: center;
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .dock ul {
    gap: 2px;
  }
  .dock a,
  .dock button {
    width: 38px;
    height: 38px;
  }
  .dock__separator {
    margin: 0 2px;
  }
}

@media (max-width: 360px) {
  .dock {
    padding: 5px;
  }

  .dock ul {
    gap: 1px;
  }

  .dock a,
  .dock button {
    width: 32px;
    height: 32px;
  }

  .dock__separator {
    margin: 0 1px;
  }
}
</style>
