import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Highlights the nav link whose section is currently in the viewport.
 *
 * @param {string[]} sectionIds - the section element ids in document order
 * @returns { activeId } - reactive id of the currently active section
 */
export function useActiveSection(sectionIds) {
  const activeId = ref(sectionIds[0] || null)
  let observer = null

  onMounted(() => {
    if (!('IntersectionObserver' in window)) return

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          activeId.value = visible[0].target.id
        }
      },
      {
        // Treat a section as "active" once a third of it is in view.
        threshold: [0.33],
        rootMargin: '-20% 0px -40% 0px',
      },
    )

    elements.forEach((el) => observer.observe(el))
  })

  onBeforeUnmount(() => {
    if (observer) observer.disconnect()
  })

  return { activeId }
}
