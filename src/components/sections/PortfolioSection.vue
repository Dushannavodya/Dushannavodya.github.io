<script setup>
import { computed, ref } from 'vue'
import { X } from 'lucide-vue-next'
import SectionHeading from '@/components/SectionHeading.vue'
import MagicBento from '@/components/animated/MagicBento.vue'
import { portfolio } from '@/data/portfolio.js'

function getTags(tags) {
  return tags.split(',').map((tag) => tag.trim())
}

const categoryLabels = {
  uxui: 'UX/UI',
  'web-app': 'Web App',
  'mobile-app': 'Mobile App',
}

const activeWorkId = ref(null)

const activeWork = computed(() =>
  portfolio.find((item) => item.id === activeWorkId.value),
)

const activeBentoCards = computed(() => {
  if (!activeWork.value) return []

  return [
    {
      label: 'Preview',
      title: activeWork.value.title,
      image: activeWork.value.image,
      className: 'magic-bento__card--hero',
    },
    {
      label: categoryLabels[activeWork.value.category],
      title: activeWork.value.title,
      description:
        'A focused project built around clean interaction, practical workflows, and a polished user experience.',
      className: 'magic-bento__card--wide',
    },
    {
      label: 'Stack',
      title: 'Technologies',
      tags: getTags(activeWork.value.tags),
      className: 'magic-bento__card--wide',
    },
    {
      label: 'Focus',
      title: categoryLabels[activeWork.value.category],
      description: 'Designed with responsive layouts and a clear visual hierarchy.',
    },
    {
      label: 'Delivery',
      title: 'Modern UI',
      description: 'Minimal cards, readable details, and motion that stays lightweight.',
    },
  ]
})

function openWork(item) {
  activeWorkId.value = item.id
}

function closeWork() {
  activeWorkId.value = null
}
</script>

<template>
  <section id="works" class="section works">
    <div class="container">
      <SectionHeading eyebrow="Selected Projects" title="My Recent Works" />

      <div v-reveal class="works__grid">
        <button
          v-for="(item, index) in portfolio"
          :key="item.id"
          class="work-card"
          type="button"
          @click="openWork(item)"
        >
          <div class="work-card__media">
            <img :src="item.image" :alt="item.title" />
          </div>
          <div class="work-card__body">
            <div class="work-card__chips">
              <span class="work-card__chip work-card__chip--title">{{ item.title }}</span>
              <span class="work-card__chip">{{ categoryLabels[item.category] }}</span>
            </div>
            <p class="work-card__label">Technologies</p>
            <ul class="work-card__tags" :aria-label="`${item.title} technologies`">
              <li v-for="tag in getTags(item.tags)" :key="tag">{{ tag }}</li>
            </ul>
          </div>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="work-modal">
        <div
          v-if="activeWork"
          class="work-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`${activeWork.id}-title`"
          @click.self="closeWork"
        >
          <div class="work-modal__panel">
            <h2 :id="`${activeWork.id}-title`" class="work-modal__title">
              {{ activeWork.title }}
            </h2>
            <button
              class="work-modal__close"
              type="button"
              aria-label="Close project details"
              @click="closeWork"
            >
              <X :size="20" :stroke-width="2.4" aria-hidden="true" />
            </button>

            <MagicBento
              :cards="activeBentoCards"
              glow-color="255, 86, 11"
              :spotlight-radius="360"
              enable-tilt
              enable-magnetism
              click-effect
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.works__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
  align-items: stretch;
}

.work-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  text-align: left;
  overflow: hidden;
  min-height: 100%;
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  transition:
    border-color var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
}

.work-card:hover {
  border-color: rgba(255, 86, 11, 0.5);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.work-card__media {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--surface-2);
}

.work-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms ease;
}

.work-card:hover .work-card__media img {
  transform: scale(1.035);
}

.work-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-5);
  min-width: 0;
}

.work-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.work-card__chip {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 7px 12px;
  border: 1px solid rgba(255, 86, 11, 0.65);
  border-radius: var(--radius-pill);
  color: var(--accent);
  background: rgba(255, 86, 11, 0.06);
  font-size: 12px;
  font-weight: 700;
}

.work-card__chip--title {
  max-width: 100%;
  overflow-wrap: anywhere;
}

.work-card__label {
  margin-bottom: var(--space-3);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.work-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.work-card__tags li {
  display: inline-flex;
  align-items: center;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
}

.work-card__tags li:not(:last-child)::after {
  content: "/";
  margin-left: var(--space-2);
  color: var(--text-dim);
}

.work-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: var(--space-5);
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(14px);
}

.work-modal__panel {
  position: relative;
  width: min(980px, 100%);
  max-height: min(760px, calc(100vh - 48px));
  overflow: auto;
  border: 1px solid rgba(255, 86, 11, 0.24);
  border-radius: var(--radius-lg);
  background: #05080e;
  box-shadow: 0 32px 90px rgba(0, 0, 0, 0.46);
}

.work-modal__title {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.work-modal__close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  background: rgba(10, 10, 10, 0.58);
  color: var(--text);
  backdrop-filter: blur(10px);
  transition: all var(--transition);
}

.work-modal__close:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: rotate(90deg);
}

.work-modal-enter-active,
.work-modal-leave-active {
  transition: opacity 220ms ease;
}

.work-modal-enter-active .work-modal__panel,
.work-modal-leave-active .work-modal__panel {
  transition:
    opacity 260ms ease,
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.work-modal-enter-from,
.work-modal-leave-to {
  opacity: 0;
}

.work-modal-enter-from .work-modal__panel,
.work-modal-leave-to .work-modal__panel {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
}

@media (max-width: 720px) {
  .works__grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .work-modal {
    padding: var(--space-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .work-card,
  .work-card:hover,
  .work-card:hover .work-card__media img,
  .work-modal__close:hover,
  .work-modal-enter-active,
  .work-modal-leave-active,
  .work-modal-enter-active .work-modal__panel,
  .work-modal-leave-active .work-modal__panel {
    transform: none;
    transition: none;
  }
}
</style>
