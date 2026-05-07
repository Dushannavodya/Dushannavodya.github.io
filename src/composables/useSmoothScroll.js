/**
 * Smooth-scroll to a section anchor (e.g. "#works-section").
 * Falls back to a plain location change when the target isn't found.
 */
export function scrollToHash(hash) {
  if (!hash || !hash.startsWith('#')) return
  const id = hash.slice(1)
  const target = document.getElementById(id)
  if (!target) return

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
