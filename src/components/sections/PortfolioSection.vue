<script setup>
import { computed, ref } from 'vue'
import SectionHeading from '@/components/SectionHeading.vue'
import BorderGlow from '@/components/animated/BorderGlow.vue'
import { portfolio, portfolioFilters } from '@/data/portfolio.js'

const activeFilter = ref('*')

const filteredItems = computed(() => {
  if (activeFilter.value === '*') return portfolio
  return portfolio.filter((item) => item.category === activeFilter.value)
})

function selectFilter(value) {
  activeFilter.value = value
}

const GLOW_HSL = '207 100 68'
const MESH_COLORS = ['#1f6feb', '#5db2ff', '#b7e4ff']
</script>

<template>
  <section id="works" class="section works">
    <div class="container">
      <SectionHeading eyebrow="Selected Projects" title="My Recent Works" />

      <div v-reveal class="works__filters-wrap">
        <div class="works__filters" role="tablist">
          <button
            v-for="filter in portfolioFilters"
            :key="filter.value"
            type="button"
            role="tab"
            :aria-selected="activeFilter === filter.value"
            :class="['works__filter', { 'is-active': activeFilter === filter.value }]"
            @click="selectFilter(filter.value)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <transition-group name="work" tag="div" class="works__grid">
        <BorderGlow
          v-for="item in filteredItems"
          :key="item.id"
          class-name="work-card-shell"
          :glow-color="GLOW_HSL"
          :colors="MESH_COLORS"
          background-color="var(--surface)"
          :border-radius="14"
          :glow-radius="42"
          :glow-intensity="0.9"
        >
          <article class="work-card">
            <div class="work-card__media">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="work-card__body">
              <h3 class="work-card__title">{{ item.title }}</h3>
              <p class="work-card__tags">{{ item.tags }}</p>
            </div>
          </article>
        </BorderGlow>
      </transition-group>
    </div>
  </section>
</template>

<style scoped>
.works__filters-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-7);
}

.works__filters {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  padding: 6px;
  border-radius: var(--radius-pill);
  background: var(--control-bg);
  border: 1px solid var(--border);
  max-width: 100%;
}

.works__filter {
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  border-radius: var(--radius-pill);
  transition: all var(--transition);
}

.works__filter:hover {
  color: var(--text);
}

.works__filter.is-active {
  background: var(--accent);
  color: var(--accent-contrast);
}

.works__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
  align-items: start;
  min-width: 0;
}

/* BorderGlow wraps the inner article; clip the article's overflow there. */
:deep(.work-card-shell) {
  overflow: hidden;
  transition:
    opacity 320ms ease,
    transform 320ms ease,
    box-shadow var(--transition);
}

.work-card {
  position: relative;
}

.work-card__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--surface-2);
}

.work-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms ease;
}

.work-card:hover .work-card__media img {
  transform: scale(1.04);
}

.work-card__body {
  padding: var(--space-5);
}

.work-card__title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: var(--space-2);
}

.work-card__tags {
  color: var(--text-muted);
  font-size: 13px;
}

.work-enter-active,
.work-leave-active {
  transition:
    opacity 280ms ease,
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.work-move {
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.work-enter-from,
.work-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}

.work-leave-active {
  position: absolute;
  width: calc((100% - var(--space-5)) / 2);
  pointer-events: none;
}

@media (max-width: 720px) {
  .works__grid {
    grid-template-columns: 1fr;
  }
  .works__filter {
    padding: 9px 12px;
    font-size: 11px;
    letter-spacing: 0.1em;
  }
  .work-leave-active {
    width: 100%;
  }
}
</style>
