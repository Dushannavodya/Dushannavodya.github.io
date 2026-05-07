<script setup>
/**
 * SplitText - animates a string letter-by-letter (or word-by-word) when it
 * scrolls into view. Inspired by the Vue Bits SplitText, but powered by
 * motion-v instead of GSAP/ScrollTrigger so we keep dependencies tiny.
 */
import { computed } from 'vue'
import { motion } from 'motion-v'

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

const parts = computed(() => {
  if (props.splitType === 'words') return props.text.split(/(\s+)/)
  return Array.from(props.text)
})

const transition = (index) => ({
  duration: props.duration,
  delay: (index * props.delay) / 1000,
  ease: [0.22, 1, 0.36, 1],
})
</script>

<template>
  <component :is="tag" class="split-text" aria-label="text">
    <span
      v-for="(part, index) in parts"
      :key="index"
      class="split-text__part"
    >
      <motion.span
        v-if="part.trim() !== ''"
        :initial="from"
        :while-in-view="to"
        :viewport="{ once: true, amount: 0.4 }"
        :transition="transition(index)"
        class="split-text__inner"
      >
        {{ part }}
      </motion.span>
      <template v-else>{{ part }}</template>
    </span>
  </component>
</template>

<style scoped>
.split-text {
  display: inline-block;
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
