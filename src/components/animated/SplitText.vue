<script setup>
/**
 * SplitText - animates a string letter-by-letter (or word-by-word) when it
 * scrolls into view. Inspired by the Vue Bits SplitText, but powered by
 * motion-v instead of GSAP/ScrollTrigger so we keep dependencies tiny.
 *
 * For `chars` mode the characters are GROUPED PER WORD inside an
 * inline-block with `white-space: nowrap`, so a word can wrap to a new
 * line as a unit but the browser can never break in the middle of a word
 * (which would happen if every character were its own inline-block).
 */
import { computed, onMounted, ref } from 'vue'
import { motion } from 'motion-v'

const completedTexts = new Set()

const props = defineProps({
  text: { type: String, required: true },
  splitType: { type: String, default: 'chars' }, // 'chars' | 'words'
  delay: { type: Number, default: 30 }, // ms between each part
  duration: { type: Number, default: 0.7 }, // seconds per part
  tag: { type: String, default: 'span' },
  from: {
    type: Object,
    default: () => ({ opacity: 0, y: '0.4em' }),
  },
  to: {
    type: Object,
    default: () => ({ opacity: 1, y: '0em' }),
  },
})

const animationKey = computed(
  () => `split-text:${props.tag}:${props.splitType}:${props.text}`,
)
const hasAnimated = ref(completedTexts.has(animationKey.value))

// For chars: [{ chars: ['D', 'U', ...], startIndex: 0 }, ...]
const wordsForChars = computed(() => {
  const result = []
  const tokens = props.text.split(/(\s+)/) // keep whitespace
  let charIndex = 0
  for (const token of tokens) {
    if (token === '') continue
    if (/^\s+$/.test(token)) {
      result.push({ space: true, raw: token })
    } else {
      result.push({
        space: false,
        chars: Array.from(token),
        startIndex: charIndex,
      })
      charIndex += Array.from(token).length
    }
  }
  return result
})

const wordTokens = computed(() => props.text.split(/(\s+)/))

const transition = (index) => ({
  duration: props.duration,
  delay: (index * props.delay) / 1000,
  ease: [0.22, 1, 0.36, 1],
})

const initialState = computed(() => (hasAnimated.value ? props.to : props.from))

function markAnimated() {
  hasAnimated.value = true
  completedTexts.add(animationKey.value)
}

onMounted(() => {
  if (completedTexts.has(animationKey.value)) hasAnimated.value = true
})
</script>

<template>
  <component :is="tag" class="split-text" :aria-label="text">
    <template v-if="splitType === 'chars'">
      <template v-for="(word, wIdx) in wordsForChars" :key="wIdx">
        <span v-if="word.space" class="split-text__space">{{ word.raw }}</span>
        <span v-else class="split-text__word" aria-hidden="true">
          <motion.span
            v-for="(char, cIdx) in word.chars"
            :key="cIdx"
            :initial="initialState"
            :while-in-view="to"
            :viewport="{ once: true, amount: 0.4 }"
            :transition="transition(word.startIndex + cIdx)"
            @viewport-enter="markAnimated"
            class="split-text__inner"
          >{{ char }}</motion.span>
        </span>
      </template>
    </template>

    <template v-else>
      <span
        v-for="(part, index) in wordTokens"
        :key="index"
        class="split-text__part"
      >
        <motion.span
          v-if="part.trim() !== ''"
          :initial="initialState"
          :while-in-view="to"
          :viewport="{ once: true, amount: 0.4 }"
          :transition="transition(index)"
          @viewport-enter="markAnimated"
          class="split-text__inner"
        >
          {{ part }}
        </motion.span>
        <template v-else>{{ part }}</template>
      </span>
    </template>
  </component>
</template>

<style scoped>
.split-text {
  display: inline-block;
}

.split-text__word {
  display: inline-block;
  white-space: nowrap;
}

.split-text__space {
  display: inline-block;
  white-space: pre;
}

.split-text__part {
  display: inline-block;
  white-space: pre;
}

.split-text__inner {
  display: inline-block;
  will-change: transform, opacity;
}
</style>
