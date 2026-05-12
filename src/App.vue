<script setup>
import FloatingNav from './components/FloatingNav.vue'
import FloatingDock from './components/FloatingDock.vue'
import ClickSpark from './components/animated/ClickSpark.vue'

import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import ServicesSection from './components/sections/ServicesSection.vue'
import PortfolioSection from './components/sections/PortfolioSection.vue'
import CvSection from './components/sections/CvSection.vue'
import ContactSection from './components/sections/ContactSection.vue'
</script>

<template>
  <FloatingNav />
  <FloatingDock />
  <ClickSpark spark-color="#5db2ff" :spark-count="10" :spark-radius="24" />

  <main id="content">
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <PortfolioSection />
    <CvSection />
    <ContactSection />
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; {{ new Date().getFullYear() }} Dushan Navodya. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: var(--space-6) 0 calc(var(--space-6) + 76px);
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-dim);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .site-footer {
    padding-bottom: var(--space-6);
  }
}
</style>
