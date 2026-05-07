<script setup>
import SectionHeading from '@/components/SectionHeading.vue'
import BorderGlow from '@/components/animated/BorderGlow.vue'
import { innovations, innovationsIntro } from '@/data/innovations.js'

const GLOW_HSL = '73 92 67'
const MESH_COLORS = ['#d9f95c', '#ff7a18', '#ff4d00']
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
          background-color="#161616"
          :border-radius="14"
          :glow-radius="38"
          :glow-intensity="0.85"
        >
          <article class="innovation-card">
            <div class="innovation-card__head">
              <div class="innovation-card__logo">
                <img :src="item.logo" :alt="item.name" />
              </div>
              <div class="innovation-card__media">
                <img :src="item.image" :alt="item.name" />
              </div>
            </div>
            <p class="innovation-card__quote">{{ item.quote }}</p>
            <div class="innovation-card__foot">
              <h3 class="innovation-card__name">{{ item.name }}</h3>
              <span class="innovation-card__tag">{{ item.designation }}</span>
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.innovation-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-6);
  height: 100%;
}

.innovation-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.innovation-card__logo {
  display: flex;
  align-items: center;
  height: 44px;
}

.innovation-card__logo img {
  height: 100%;
  width: auto;
  object-fit: contain;
}

.innovation-card__media {
  width: 130px;
  height: 84px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--surface-2);
  border: 1px solid var(--border);
}

.innovation-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.innovation-card__quote {
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.7;
}

.innovation-card__foot {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}

.innovation-card__name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.innovation-card__tag {
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--accent);
  text-transform: uppercase;
}

@media (max-width: 760px) {
  .innovations__grid {
    grid-template-columns: 1fr;
  }
}
</style>
