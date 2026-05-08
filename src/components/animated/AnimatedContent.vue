<script setup>
/**
 * AnimatedContent - generic scroll-triggered entrance wrapper. Mirrors the
 * Vue Bits AnimatedContent component: the slot fades and slides in once it
 * intersects the viewport.
 */
import { computed, onMounted, ref } from 'vue'
import { motion } from 'motion-v'

const completedAnimations = new Set()

const props = defineProps({
  distance: { type: Number, default: 40 },
  direction: { type: String, default: 'vertical' }, // 'vertical' | 'horizontal'
  reverse: { type: Boolean, default: false },
  duration: { type: Number, default: 0.9 },
  delay: { type: Number, default: 0 }, // seconds
  ease: { type: Array, default: () => [0.22, 1, 0.36, 1] },
  threshold: { type: Number, default: 0.2 },
  tag: { type: String, default: 'div' },
})

const instanceKey = computed(
  () =>
    `animated-content:${props.direction}:${props.distance}:${props.reverse}:${props.delay}`,
)
const hasAnimated = ref(completedAnimations.has(instanceKey.value))

const axis = computed(() => (props.direction === 'horizontal' ? 'x' : 'y'))
const offset = computed(() =>
  props.reverse ? -props.distance : props.distance,
)

const initial = computed(() => ({
  opacity: 0,
  [axis.value]: offset.value,
}))
const target = computed(() => ({
  opacity: 1,
  [axis.value]: 0,
}))
const initialState = computed(() => (hasAnimated.value ? target.value : initial.value))

const transition = computed(() => ({
  duration: props.duration,
  delay: props.delay,
  ease: props.ease,
}))

function markAnimated() {
  hasAnimated.value = true
  completedAnimations.add(instanceKey.value)
}

onMounted(() => {
  if (completedAnimations.has(instanceKey.value)) hasAnimated.value = true
})
</script>

<template>
  <motion.div
    :as="tag"
    :initial="initialState"
    :while-in-view="target"
    :viewport="{ once: true, amount: threshold }"
    :transition="transition"
    @viewport-enter="markAnimated"
  >
    <slot />
  </motion.div>
</template>
