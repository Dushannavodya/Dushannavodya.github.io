<script setup>
/**
 * BlurText - reveals each word with a blur-to-clear fade. Inspired by the
 * Vue Bits BlurText, ported to motion-v.
 */
import { computed, onMounted, ref } from 'vue'
import { motion } from 'motion-v'

const completedTexts = new Set()

const props = defineProps({
  text: { type: String, required: true },
  delay: { type: Number, default: 80 }, // ms between words
  duration: { type: Number, default: 0.8 },
  tag: { type: String, default: 'p' },
  direction: { type: String, default: 'top' }, // 'top' | 'bottom'
})

const animationKey = computed(() => `blur-text:${props.tag}:${props.text}`)
const hasAnimated = ref(completedTexts.has(animationKey.value))

const words = computed(() => props.text.split(' '))

const initial = computed(() => ({
  filter: 'blur(10px)',
  opacity: 0,
  y: props.direction === 'top' ? -20 : 20,
}))

const target = { filter: 'blur(0px)', opacity: 1, y: 0 }
const initialState = computed(() => (hasAnimated.value ? target : initial.value))

const transition = (index) => ({
  duration: props.duration,
  delay: (index * props.delay) / 1000,
  ease: [0.22, 1, 0.36, 1],
})

function markAnimated() {
  hasAnimated.value = true
  completedTexts.add(animationKey.value)
}

onMounted(() => {
  if (completedTexts.has(animationKey.value)) hasAnimated.value = true
})
</script>

<template>
  <component :is="tag" class="blur-text">
    <motion.span
      v-for="(word, index) in words"
      :key="`${word}-${index}`"
      :initial="initialState"
      :while-in-view="target"
      :viewport="{ once: true, amount: 0.3 }"
      :transition="transition(index)"
      @viewport-enter="markAnimated"
      class="blur-text__word"
    >
      {{ word }}{{ index < words.length - 1 ? '\u00a0' : '' }}
    </motion.span>
  </component>
</template>

<style scoped>
.blur-text {
  display: inline-block;
}

.blur-text__word {
  display: inline-block;
  white-space: nowrap;
  will-change: filter, transform, opacity;
}
</style>
