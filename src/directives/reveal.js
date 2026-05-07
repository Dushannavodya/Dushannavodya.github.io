/**
 * v-reveal directive
 *
 * Adds an `is-visible` class once the element enters the viewport. Pair it
 * with the `[data-reveal]` rule in main.css for the fade-and-rise animation.
 *
 * Usage:
 *   <div v-reveal>...</div>
 *   <div v-reveal="{ delay: 200 }">...</div>
 */

const VISIBLE_CLASS = 'is-visible'
const DEFAULT_THRESHOLD = 0.12

let sharedObserver = null

function getObserver() {
  if (sharedObserver) return sharedObserver

  sharedObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target
        const delay = Number(el.dataset.revealDelay || 0)

        const reveal = () => el.classList.add(VISIBLE_CLASS)
        if (delay > 0) {
          window.setTimeout(reveal, delay)
        } else {
          reveal()
        }

        observer.unobserve(el)
      }
    },
    { threshold: DEFAULT_THRESHOLD },
  )

  return sharedObserver
}

export const revealDirective = {
  mounted(el, binding) {
    el.setAttribute('data-reveal', '')

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      el.classList.add(VISIBLE_CLASS)
      return
    }

    const { delay } = binding.value || {}
    if (delay) el.dataset.revealDelay = String(delay)

    getObserver().observe(el)
  },
  unmounted(el) {
    if (sharedObserver) sharedObserver.unobserve(el)
  },
}
