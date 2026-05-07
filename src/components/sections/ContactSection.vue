<script setup>
import { Linkedin, Github, Mail, MessageSquare } from 'lucide-vue-next'
import SectionHeading from '@/components/SectionHeading.vue'
import { contactIntro, contactItems } from '@/data/contact.js'
import { socials } from '@/data/site.js'

const iconByName = {
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
  'stack-overflow': MessageSquare,
}
</script>

<template>
  <section id="contact" class="section contact">
    <div class="container">
      <SectionHeading
        :eyebrow="contactIntro.eyebrow"
        :title="contactIntro.title"
      >
        <template #subtitle>
          <p v-reveal class="subtitle">{{ contactIntro.description }}</p>
        </template>
      </SectionHeading>

      <ul v-reveal class="contact__socials">
        <li v-for="link in socials" :key="link.href">
          <a
            :href="link.href"
            :aria-label="link.label"
            :title="link.label"
            target="_blank"
            rel="noopener"
          >
            <component
              :is="iconByName[link.icon] || Mail"
              :size="20"
              :stroke-width="1.6"
            />
          </a>
        </li>
      </ul>

      <hr class="contact__divider" />

      <ul v-reveal class="contact__details">
        <li v-for="item in contactItems" :key="item.id">
          <span class="eyebrow">{{ item.label }}</span>
          <a v-if="item.href" :href="item.href">{{ item.value }}</a>
          <span v-else>{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.contact__socials {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.contact__socials a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  color: var(--text);
  transition: all var(--transition);
}

.contact__socials a:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0a;
  transform: translateY(-2px);
}

.contact__divider {
  border: 0;
  border-top: 1px solid var(--border);
  width: 100%;
  max-width: 720px;
  margin: 0 auto var(--space-7);
}

.contact__details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
  text-align: center;
}

.contact__details li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.contact__details a,
.contact__details span:not(.eyebrow) {
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
}

.contact__details a:hover {
  color: var(--accent);
}

@media (max-width: 720px) {
  .contact__details {
    grid-template-columns: 1fr;
  }
}
</style>
