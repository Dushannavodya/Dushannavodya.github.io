<script setup>
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

function onClick(event, href) {
  event.preventDefault()
  scrollToHash(href)
}
</script>

<template>
  <nav
    class="dock"
    :class="{ 'dock--hidden': !isVisible }"
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
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  padding: 8px;
  border-radius: var(--radius-pill);
  background: var(--dock-bg);
  border: 1px solid var(--dock-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-soft);
  transition: opacity 320ms ease, transform 320ms ease;
}

.dock--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 16px);
}

.dock ul {
  display: flex;
  align-items: center;
  gap: 4px;
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
  background: var(--control-hover-bg);
}

.dock a.is-active {
  color: var(--accent);
  background: var(--accent-dim);
}

.dock__separator {
  width: 1px;
  height: 22px;
  background: var(--border-strong);
  margin: 0 4px;
}

@media (max-width: 480px) {
  .dock {
    bottom: 16px;
    padding: 6px;
  }
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
  .dock a,
  .dock button {
    width: 34px;
    height: 34px;
  }
}
</style>
