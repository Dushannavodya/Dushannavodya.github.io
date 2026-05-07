<script setup>
import { ArrowRight } from 'lucide-vue-next'
import { about } from '@/data/about.js'
import { site, socials } from '@/data/site.js'
import { scrollToHash } from '@/composables/useSmoothScroll.js'
import AnimatedContent from '@/components/animated/AnimatedContent.vue'
import SplitText from '@/components/animated/SplitText.vue'
import BlurText from '@/components/animated/BlurText.vue'
import Magnet from '@/components/animated/Magnet.vue'
</script>

<template>
  <section id="about" class="section about">
    <div class="container">
      <div class="about__grid">
        <AnimatedContent
          direction="horizontal"
          :distance="60"
          :reverse="true"
          class="about__media"
        >
          <img :src="site.heroImage" :alt="site.name" />
        </AnimatedContent>

        <div class="about__content">
          <span v-reveal class="eyebrow eyebrow--accent">
            {{ about.eyebrow }}
          </span>

          <SplitText
            :text="about.title"
            tag="h2"
            class="section-title"
            :delay="25"
            :duration="0.8"
          />

          <div class="about__paragraphs">
            <BlurText
              v-for="(p, i) in about.paragraphs"
              :key="i"
              :text="p"
              tag="p"
              :delay="14"
              :duration="0.6"
            />
          </div>

          <hr v-reveal class="about__divider" />

          <AnimatedContent :delay="0.1">
            <dl class="about__highlights">
              <div v-for="hl in about.highlights" :key="hl.label">
                <dt>{{ hl.label }}</dt>
                <dd>{{ hl.value }}</dd>
              </div>
            </dl>
          </AnimatedContent>

          <AnimatedContent :delay="0.2">
            <div class="about__cta">
              <Magnet :strength="0.3" :padding="40">
                <a
                  href="#contact"
                  class="btn btn--primary"
                  @click.prevent="scrollToHash('#contact')"
                >
                  Let's Connect
                  <ArrowRight :size="16" :stroke-width="2" />
                </a>
              </Magnet>

              <ul class="about__socials">
                <li v-for="link in socials" :key="link.href">
                  <a
                    :href="link.href"
                    :aria-label="link.label"
                    target="_blank"
                    rel="noopener"
                  >
                    {{ link.label }}
                  </a>
                </li>
              </ul>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  align-items: stretch;
}

.about__media {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
  min-height: 520px;
}

.about__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
  transition: filter 600ms ease, transform 800ms ease;
}

.about__media:hover img {
  filter: grayscale(0) contrast(1);
  transform: scale(1.02);
}

.about__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.about__paragraphs {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.7;
  max-width: 60ch;
}

.about__divider {
  border: 0;
  border-top: 1px solid var(--border);
  margin: var(--space-3) 0;
}

.about__highlights {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5) var(--space-7);
  margin: 0;
}

.about__highlights dt {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

.about__highlights dd {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
}

.about__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-3);
}

.about__socials {
  display: flex;
  gap: var(--space-5);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .about__grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  .about__media {
    min-height: 380px;
  }
}
</style>
