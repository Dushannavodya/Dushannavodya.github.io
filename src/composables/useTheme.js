import { computed, onMounted, ref, watch } from 'vue'

const storageKey = 'portfolio-theme'
const theme = ref('dark')
let initialized = false

function getPreferredTheme() {
  if (typeof window === 'undefined') return 'dark'

  const savedTheme = window.localStorage.getItem(storageKey)
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

function applyTheme(value) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = value
}

export function useTheme() {
  if (!initialized) {
    initialized = true
    theme.value = getPreferredTheme()
    applyTheme(theme.value)

    watch(theme, (value) => {
      applyTheme(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, value)
      }
    })
  }

  onMounted(() => {
    theme.value = getPreferredTheme()
    applyTheme(theme.value)
  })

  const isLight = computed(() => theme.value === 'light')

  function toggleTheme() {
    theme.value = isLight.value ? 'dark' : 'light'
  }

  return { theme, isLight, toggleTheme }
}
