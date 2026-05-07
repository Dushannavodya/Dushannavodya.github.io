<script setup>
/**
 * DecryptedText - scrambles a string into random characters and then
 * "decrypts" it back to the original. Inspired by the Vue Bits
 * "DecryptedText" component:
 *   https://vue-bits.dev - https://github.com/DavidHDev/vue-bits
 *
 * This port is plain JS with scoped CSS (no Tailwind), and keeps the
 * original API: `animateOn` chooses the trigger ('hover' | 'view'),
 * `sequential` reveals characters one-by-one in `revealDirection` order,
 * otherwise it scrambles `maxIterations` times before settling.
 */
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  speed: { type: Number, default: 50 },
  maxIterations: { type: Number, default: 10 },
  sequential: { type: Boolean, default: false },
  revealDirection: { type: String, default: 'start' }, // 'start' | 'end' | 'center'
  useOriginalCharsOnly: { type: Boolean, default: false },
  characters: {
    type: String,
    default:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  },
  animateOn: { type: String, default: 'hover' }, // 'hover' | 'view'
})

const emit = defineEmits(['animation-complete'])

const containerRef = useTemplateRef('containerRef')
const displayText = ref(props.text)
const isHovering = ref(false)
const isScrambling = ref(false)
const revealedIndices = ref(new Set())
const hasAnimated = ref(false)

let interval = null
let intersectionObserver = null

function getNextIndex(revealedSet) {
  const len = props.text.length
  switch (props.revealDirection) {
    case 'start':
      return revealedSet.size
    case 'end':
      return len - 1 - revealedSet.size
    case 'center': {
      const middle = Math.floor(len / 2)
      const offset = Math.floor(revealedSet.size / 2)
      const nextIndex =
        revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1

      if (nextIndex >= 0 && nextIndex < len && !revealedSet.has(nextIndex)) {
        return nextIndex
      }
      for (let i = 0; i < len; i++) {
        if (!revealedSet.has(i)) return i
      }
      return 0
    }
    default:
      return revealedSet.size
  }
}

function shuffleText(originalText, currentRevealed) {
  const availableChars = props.useOriginalCharsOnly
    ? Array.from(new Set(originalText.split(''))).filter((c) => c !== ' ')
    : props.characters.split('')

  if (props.useOriginalCharsOnly) {
    const positions = originalText.split('').map((char, i) => ({
      char,
      isSpace: char === ' ',
      index: i,
      isRevealed: currentRevealed.has(i),
    }))

    const nonSpace = positions
      .filter((p) => !p.isSpace && !p.isRevealed)
      .map((p) => p.char)

    for (let i = nonSpace.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[nonSpace[i], nonSpace[j]] = [nonSpace[j], nonSpace[i]]
    }

    let k = 0
    return positions
      .map((p) => {
        if (p.isSpace) return ' '
        if (p.isRevealed) return originalText[p.index]
        return nonSpace[k++]
      })
      .join('')
  }

  return originalText
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' '
      if (currentRevealed.has(i)) return originalText[i]
      return availableChars[Math.floor(Math.random() * availableChars.length)]
    })
    .join('')
}

watch(
  [
    isHovering,
    () => props.text,
    () => props.speed,
    () => props.maxIterations,
    () => props.sequential,
    () => props.revealDirection,
    () => props.characters,
    () => props.useOriginalCharsOnly,
  ],
  () => {
    let currentIteration = 0

    if (interval) {
      clearInterval(interval)
      interval = null
    }

    if (isHovering.value) {
      isScrambling.value = true
      interval = setInterval(() => {
        if (props.sequential) {
          if (revealedIndices.value.size < props.text.length) {
            const nextIndex = getNextIndex(revealedIndices.value)
            const newRevealed = new Set(revealedIndices.value)
            newRevealed.add(nextIndex)
            revealedIndices.value = newRevealed
            displayText.value = shuffleText(props.text, newRevealed)
          } else {
            clearInterval(interval)
            interval = null
            isScrambling.value = false
            emit('animation-complete')
          }
        } else {
          displayText.value = shuffleText(props.text, revealedIndices.value)
          currentIteration++
          if (currentIteration >= props.maxIterations) {
            clearInterval(interval)
            interval = null
            isScrambling.value = false
            displayText.value = props.text
            emit('animation-complete')
          }
        }
      }, props.speed)
    } else {
      displayText.value = props.text
      revealedIndices.value = new Set()
      isScrambling.value = false
    }
  },
)

function onEnter() {
  if (props.animateOn === 'hover') isHovering.value = true
}
function onLeave() {
  if (props.animateOn === 'hover') isHovering.value = false
}

onMounted(async () => {
  if (props.animateOn !== 'view') return
  await nextTick()

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !hasAnimated.value) {
          isHovering.value = true
          hasAnimated.value = true
        }
      }
    },
    { threshold: 0.1 },
  )
  if (containerRef.value) intersectionObserver.observe(containerRef.value)
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
  if (intersectionObserver && containerRef.value) {
    intersectionObserver.unobserve(containerRef.value)
  }
})
</script>

<template>
  <span
    ref="containerRef"
    class="decrypted"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <span class="sr-only">{{ text }}</span>

    <span aria-hidden="true">
      <span
        v-for="(char, index) in displayText.split('')"
        :key="index"
        :class="[
          'decrypted__char',
          {
            'decrypted__char--encrypted':
              isScrambling && isHovering && !revealedIndices.has(index) && char !== ' ',
          },
        ]"
        >{{ char }}</span
      >
    </span>
  </span>
</template>

<style scoped>
.decrypted {
  display: inline-block;
  white-space: pre-wrap;
}

.decrypted__char {
  display: inline-block;
  transition: color 120ms ease, opacity 120ms ease;
}

/* Encrypted chars get a dimmer, slightly tinted look so the scramble
 * reads visually different from the resolved text. Override at the call
 * site if you want a different color. */
.decrypted__char--encrypted {
  color: var(--accent, #d9f95c);
  opacity: 0.85;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
