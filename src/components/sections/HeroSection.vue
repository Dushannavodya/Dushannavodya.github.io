<script setup>
import { computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { site } from '@/data/site.js'
import { scrollToHash } from '@/composables/useSmoothScroll.js'
import Squares from '@/components/animated/Squares.vue'
import BlurText from '@/components/animated/BlurText.vue'
import DecryptedText from '@/components/animated/DecryptedText.vue'
import Magnet from '@/components/animated/Magnet.vue'

const heroName = computed(() => site.name.toUpperCase())
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__gradient"></div>
      <div class="hero__squares">
        <Squares
          direction="diagonal"
          :speed="0.4"
          :square-size="56"
          border-color="rgba(255,255,255,0.16)"
          hover-fill-color="rgba(255,255,255,0.08)"
          vignette-color="rgba(255, 77, 0, 0.55)"
        />
      </div>
      <div class="hero__glow"></div>
    </div>

    <div class="hero__content">
      <h1 class="hero__name">
        <DecryptedText
          :text="heroName"
          :speed="95"
          :max-iterations="14"
          :sequential="true"
          reveal-direction="center"
          animate-on="hover"
        />
      </h1>
      <BlurText
        :text="site.tagline"
        tag="p"
        class="hero__role"
        :delay="60"
      />
    </div>

    <div class="hero__scroll-wrap">
      <Magnet :strength="0.5" :padding="60">
        <button
          type="button"
          class="hero__scroll"
          aria-label="Scroll to about"
          @click="scrollToHash('#about')"
        >
          <span>Scroll</span>
          <ChevronDown :size="18" :stroke-width="1.6" />
        </button>
      </Magnet>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-9) var(--space-5);
  overflow: hidden;
  isolation: isolate;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero__gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 200, 120, 0.4) 0%,
      transparent 55%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(255, 60, 0, 0.5) 0%,
      transparent 60%
    ),
    linear-gradient(135deg, var(--orange-1) 0%, var(--orange-2) 100%);
}

.hero__squares {
  position: absolute;
  inset: 0;
  opacity: 0.55;
  mix-blend-mode: overlay;
}

/* A faint warm glow centered behind the name */
.hero__glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120vmin;
  height: 60vmin;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  filter: blur(20px);
  pointer-events: none;
}

.hero__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #fff;
  gap: var(--space-4);
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.hero__name {
  font-size: clamp(44px, 9vw, 128px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 0.95;
  text-transform: uppercase;
  text-shadow: 0 6px 60px rgba(0, 0, 0, 0.18);
  cursor: default;
  animation: hero-name-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
  max-width: 100%;
  overflow-wrap: anywhere;
}

/* Override the DecryptedText accent color in the hero so the encrypted
 * characters stay legible against the warm orange background. */
.hero__name :deep(.decrypted__char--encrypted) {
  color: rgba(255, 255, 255, 0.55);
  opacity: 1;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.25);
}

@keyframes hero-name-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__role {
  font-size: clamp(11px, 1.2vw, 14px);
  font-weight: 500;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
}

@media (max-width: 600px) {
  .hero {
    padding-inline: var(--space-4);
  }

  .hero__name {
    font-size: clamp(42px, 18vw, 72px);
  }

  .hero__role {
    letter-spacing: 0.25em;
    overflow-wrap: anywhere;
  }
}

@media (max-width: 380px) {
  .hero__role {
    letter-spacing: 0.15em;
  }
}

.hero__scroll-wrap {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
}

.hero__scroll {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}

.hero__scroll svg {
  animation: bob 1.6s ease-in-out infinite;
}

.hero__scroll:hover {
  color: #fff;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
</style>
