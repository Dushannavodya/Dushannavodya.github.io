import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Highlights the section currently under a virtual "active line" near the
 * top of the viewport. Uses a scroll listener (rAF-throttled) instead of
 * IntersectionObserver because IO with a `threshold` ratio fails on
 * sections taller than the viewport: only a slice is ever visible, so the
 * ratio never reaches the trigger.
 *
 * @param {string[]} sectionIds - section ids to track
 * @param {number}   offset     - distance from viewport top (px) of the
 *                                 active line; default 120 (sits just below
 *                                 the floating top nav)
 * @returns { activeId }
 */
export function useActiveSection(sectionIds, offset = 120) {
  const activeId = ref(null)
  let raf = null

  function getOrderedElements() {
    return sectionIds
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((e) => e.el)
      .sort((a, b) => a.el.offsetTop - b.el.offsetTop)
  }

  function update() {
    const elements = getOrderedElements()
    if (elements.length === 0) return

    let current = null
    for (const { id, el } of elements) {
      const top = el.getBoundingClientRect().top
      if (top - offset <= 0) {
        current = id
      } else {
        break
      }
    }

    // Snap to the last section once we've reached the bottom of the page
    // so the final item still highlights at the very end of the scroll.
    const scrolled = window.scrollY + window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    if (docHeight - scrolled < 4) {
      current = elements[elements.length - 1].id
    }

    activeId.value = current
  }

  function onScroll() {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = null
      update()
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })

  return { activeId }
}
