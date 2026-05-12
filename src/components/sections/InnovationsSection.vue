<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import SectionHeading from '@/components/SectionHeading.vue'
import BorderGlow from '@/components/animated/BorderGlow.vue'
import { innovations, innovationsIntro } from '@/data/innovations.js'

const GLOW_HSL = '18 100 52'
const MESH_COLORS = ['#d83f00', '#ff560b', '#ffb06e']
</script>

<template>
  <section id="innovations" class="section innovations">
    <div class="container">
      <SectionHeading eyebrow="R & D" :title="innovationsIntro.title">
        <template #subtitle>
          <p v-reveal class="subtitle">{{ innovationsIntro.description }}</p>
        </template>
      </SectionHeading>

      <div class="innovations__grid">
        <BorderGlow
          v-for="item in innovations"
          :key="item.id"
          v-reveal
          class-name="innovation-shell"
          :glow-color="GLOW_HSL"
          :colors="MESH_COLORS"
          background-color="var(--surface)"
          :border-radius="14"
          :glow-radius="34"
          :glow-intensity="0.72"
        >
          <article class="innovation-card">
            <div class="innovation-card__media">
              <img :src="item.image" :alt="item.title" />
              <div class="innovation-card__logo">
                <img
                  :src="item.logo"
                  :alt="`${item.title} logo`"
                  :style="item.logoStyle"
                />
              </div>
            </div>

            <div class="innovation-card__body">
              <span class="innovation-card__eyebrow">{{ item.eyebrow }}</span>
              <h3 class="innovation-card__title">{{ item.title }}</h3>
              <p class="innovation-card__desc">{{ item.description }}</p>

              <ul class="innovation-card__stack" aria-label="Technology stack">
                <li v-for="tech in item.stack" :key="tech">{{ tech }}</li>
              </ul>

              <a class="innovation-card__cta" :href="item.href">
                <span>{{ item.cta }}</span>
                <ArrowUpRight :size="17" :stroke-width="1.8" />
              </a>
            </div>
          </article>
        </BorderGlow>
      </div>
    </div>
  </section>
</template>

<style scoped>
.innovations__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.innovations__grid :deep(.innovation-shell) {
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition:
    transform var(--transition),
    border-color var(--transition),
    box-shadow var(--transition);
}

.innovations__grid :deep(.innovation-shell:hover) {
  transform: translateY(-6px);
  border-color: var(--accent-dim);
}

.innovation-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 520px;
}

.innovation-card__media {
  position: relative;
  aspect-ratio: 16 / 11;
  overflow: hidden;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}

.innovation-card__media::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 35%, rgba(0, 0, 0, 0.62)),
    radial-gradient(circle at 12% 10%, rgba(255, 86, 11, 0.34), transparent 35%);
  opacity: 0.76;
  transition: opacity var(--transition);
}

.innovation-card:hover .innovation-card__media::after {
  opacity: 0.92;
}

.innovation-card__media > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.05);
  transition:
    transform 700ms ease,
    filter var(--transition);
}

.innovation-card:hover .innovation-card__media > img {
  transform: scale(1.06);
  filter: saturate(1.05) contrast(1.08);
}

.innovation-card__logo {
  position: absolute;
  left: var(--space-5);
  bottom: var(--space-5);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
}

.innovation-card__logo img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.innovation-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
}

.innovation-card__eyebrow {
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}

.innovation-card__title {
  max-width: 12ch;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.innovation-card__desc {
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.65;
}

.innovation-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: auto;
}

.innovation-card__stack li {
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--control-bg);
  font-size: 12px;
  font-weight: 550;
  color: var(--text-muted);
}

.innovation-card__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  align-self: flex-start;
  margin-top: var(--space-2);
  padding: 11px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  color: var(--text);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition:
    color var(--transition),
    background var(--transition),
    border-color var(--transition),
    transform var(--transition);
}

.innovation-card__cta:hover {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
  transform: translateY(-1px);
}

@media (max-width: 1040px) {
  .innovations__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .innovations__grid {
    grid-template-columns: 1fr;
  }
  .innovation-card {
    min-height: auto;
  }
  .innovation-card__title {
    max-width: none;
  }
}
</style>
