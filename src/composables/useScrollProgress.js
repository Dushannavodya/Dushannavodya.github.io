import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Tracks scroll progress (0 - 1) and an `isVisible` flag for the
 * back-to-top button. The button shows after the user has scrolled
 * past `showAfter` pixels.
 */
export function useScrollProgress(showAfter = 50) {
  const progress = ref(0)
  const isVisible = ref(false)

  function update() {
    const scrolled = window.scrollY || window.pageYOffset
    const max =
      document.documentElement.scrollHeight - document.documentElement.clientHeight
    progress.value = max > 0 ? Math.min(scrolled / max, 1) : 0
    isVisible.value = scrolled > showAfter
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    update()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
  })

  return { progress, isVisible }
}
