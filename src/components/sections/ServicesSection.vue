<script setup>
import {
  Code2,
  Layers,
  Megaphone,
  Palette,
  Rocket,
  ServerCog,
  Workflow,
} from 'lucide-vue-next'
import SectionHeading from '@/components/SectionHeading.vue'
import AnimatedContent from '@/components/animated/AnimatedContent.vue'
import BorderGlow from '@/components/animated/BorderGlow.vue'
import { services, servicesIntro } from '@/data/services.js'

// Icon mapping is colocated here so the data layer stays icon-library-agnostic.
const iconByNumber = {
  '01': Code2,
  '02': ServerCog,
  '03': Palette,
  '04': Rocket,
  '05': Workflow,
  '06': Megaphone,
}

const GLOW_HSL = '18 100 50'
const MESH_COLORS = ['#ff4d00', '#ff7a18', '#ff9a3d']
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
            background-color="var(--surface)"
            :border-radius="14"
            :glow-radius="32"
            :glow-intensity="0.65"
          >
            <article class="service-card">
              <div class="service-card__top">
                <div class="service-card__icon">
                  <component
                    :is="iconByNumber[service.number] || Layers"
                    :size="24"
                    :stroke-width="1.6"
                  />
                </div>
                <span class="service-card__num">{{ service.number }}</span>
              </div>
              <h3 class="service-card__title">{{ service.title }}</h3>
              <p class="service-card__desc">{{ service.description }}</p>
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.services__cell {
  display: block;
  height: 100%;
}

.services__cell :deep(.service-card-shell) {
  height: 100%;
  box-shadow: var(--shadow-soft);
  transition:
    border-color var(--transition),
    box-shadow var(--transition),
    transform var(--transition);
}

.services__cell :deep(.service-card-shell:hover) {
  transform: translateY(-6px);
  border-color: var(--accent-dim);
}

.service-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: var(--space-4);
  height: 100%;
  min-height: 260px;
  padding: var(--space-6);
  overflow: hidden;
}

.service-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 16% 8%, var(--accent-dim), transparent 34%),
    linear-gradient(180deg, var(--control-bg), transparent 58%);
  opacity: 0;
  transition: opacity var(--transition);
}

.service-card:hover::before {
  opacity: 1;
}

.service-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.service-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: var(--control-bg);
  border: 1px solid var(--border);
  color: var(--accent);
  transition: all var(--transition);
}

.service-card:hover .service-card__icon {
  background: var(--accent-dim);
  border-color: rgba(255, 77, 0, 0.34);
  transform: rotate(-3deg) scale(1.04);
}

.service-card__title {
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 750;
  letter-spacing: -0.01em;
  line-height: 1.15;
  margin-top: auto;
}

.service-card__desc {
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.55;
  max-width: 32ch;
}

.service-card__num {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

@media (max-width: 1020px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .services__grid {
    grid-template-columns: 1fr;
  }
  .service-card {
    min-height: 220px;
    padding: var(--space-5);
  }
}
</style>
