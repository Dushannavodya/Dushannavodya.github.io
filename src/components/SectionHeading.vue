<script setup>
import SplitText from '@/components/animated/SplitText.vue'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  align: { type: String, default: 'center' }, // 'center' | 'left'
  accent: { type: Boolean, default: false },
})
</script>

<template>
  <header
    class="section-heading"
    :class="{ 'section-heading--left': align === 'left' }"
  >
    <span
      v-if="eyebrow"
      v-reveal
      class="eyebrow"
      :class="{ 'eyebrow--accent': accent }"
    >
      {{ eyebrow }}
    </span>
    <SplitText
      :text="title"
      tag="h2"
      class="section-title"
      :delay="25"
      :duration="0.8"
    />
    <slot name="subtitle" />
  </header>
</template>

<style scoped>
.section-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
  margin-bottom: var(--space-8);
  max-width: 100%;
  min-width: 0;
}

.section-heading--left {
  align-items: flex-start;
  text-align: left;
}
</style>
