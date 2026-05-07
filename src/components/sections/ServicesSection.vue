<script setup>
import { Sparkles, Code2, Layers, Brush } from 'lucide-vue-next'
import SectionHeading from '@/components/SectionHeading.vue'
import AnimatedContent from '@/components/animated/AnimatedContent.vue'
import BorderGlow from '@/components/animated/BorderGlow.vue'
import { services, servicesIntro } from '@/data/services.js'

// Icon mapping is colocated here so the data layer stays icon-library-agnostic.
const iconByNumber = {
  '01': Sparkles,
  '02': Code2,
  '03': Layers,
  '04': Brush,
}

// Lime-leaning glow that matches the site accent (#d9f95c).
const GLOW_HSL = '73 92 67'
const MESH_COLORS = ['#d9f95c', '#ff7a18', '#ff4d00']
</script>

<template>
  <section id="services" class="section services">
    <div class="container">
      <SectionHeading eyebrow="What I Do" :title="servicesIntro.title">
        <template #subtitle>
          <p v-reveal class="subtitle">{{ servicesIntro.description }}</p>
        </template>
      </SectionHeading>

      <div class="services__grid">
        <AnimatedContent
          v-for="(service, i) in services"
          :key="service.number"
          :delay="i * 0.08"
          :distance="32"
          class="services__cell"
        >
          <BorderGlow
            class-name="service-card-shell"
            :glow-color="GLOW_HSL"
            :colors="MESH_COLORS"
            background-color="#161616"
            :border-radius="14"
            :glow-radius="36"
            :glow-intensity="0.85"
          >
            <article class="service-card">
              <div class="service-card__icon">
                <component
                  :is="iconByNumber[service.number] || Sparkles"
                  :size="28"
                  :stroke-width="1.5"
                />
              </div>
              <h3 class="service-card__title">{{ service.title }}</h3>
              <p class="service-card__desc">{{ service.description }}</p>
              <span class="service-card__num">{{ service.number }}</span>
            </article>
          </BorderGlow>
        </AnimatedContent>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-5);
}

.services__cell {
  display: block;
  height: 100%;
}

.services__cell :deep(.service-card-shell) {
  height: 100%;
}

.service-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  padding: var(--space-7) var(--space-5);
}

.service-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  margin-bottom: var(--space-4);
  transition: all var(--transition);
}

.service-card:hover .service-card__icon {
  color: var(--accent);
  background: var(--accent-dim);
}

.service-card__title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.service-card__desc {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
}

.service-card__num {
  position: absolute;
  top: 14px;
  right: 16px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

@media (max-width: 980px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .services__grid {
    grid-template-columns: 1fr;
  }
}
</style>
