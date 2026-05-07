<script setup>
import SectionHeading from '@/components/SectionHeading.vue'
import { education, experience } from '@/data/resume.js'
import { skills } from '@/data/skills.js'
</script>

<template>
  <section id="cv" class="section cv">
    <div class="container">
      <SectionHeading eyebrow="Career & Knowledge" title="Curriculum Vitae" />

      <div class="cv__grid">
        <div class="cv__col">
          <span v-reveal class="eyebrow eyebrow--accent">
            Professional History
          </span>

          <ol class="timeline">
            <li
              v-for="(job, i) in experience"
              :key="`${job.time}-${job.title}`"
              v-reveal
              class="timeline__item"
              :class="{ 'is-current': i === 0 }"
            >
              <span class="timeline__dot" aria-hidden="true"></span>
              <div class="timeline__head">
                <h3 class="timeline__title">{{ job.title }}</h3>
                <span class="timeline__time">{{ job.time }}</span>
              </div>
              <p class="timeline__company">{{ job.institute }}</p>
            </li>
          </ol>
        </div>

        <div class="cv__col">
          <div v-reveal class="cv__block">
            <span class="eyebrow eyebrow--accent">Technical Arsenal</span>
            <ul class="tags">
              <li v-for="skill in skills" :key="skill.name">
                <span class="tag">{{ skill.name }}</span>
              </li>
            </ul>
          </div>

          <div v-reveal class="cv__block">
            <span class="eyebrow eyebrow--accent">Education</span>
            <ul class="education">
              <li
                v-for="edu in education"
                :key="`${edu.time}-${edu.title}`"
                class="education__item"
              >
                <h4 class="education__title">{{ edu.title }}</h4>
                <p class="education__meta">
                  <span>{{ edu.institute }}</span>
                  <span aria-hidden="true">·</span>
                  <span>{{ edu.time }}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cv__grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-8);
}

.cv__col {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.cv__block {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Timeline
 * --tl-gutter : horizontal space reserved for the rail (= padding-left).
 * --tl-rail-x : horizontal center of the vertical rail, measured from
 *               the timeline's left edge.
 * --tl-dot    : dot diameter.
 *
 * Both the ::before rail and each .timeline__dot derive their position
 * from these variables, so they always line up exactly. */
.timeline {
  --tl-gutter: 32px;
  --tl-rail-x: 6px;
  --tl-dot: 12px;

  position: relative;
  padding-left: var(--tl-gutter);
  margin: var(--space-3) 0 0;
  list-style: none;
}

.timeline::before {
  content: "";
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: calc(var(--tl-rail-x) - 0.5px);
  width: 1px;
  background: var(--border);
}

.timeline__item {
  position: relative;
  padding-bottom: var(--space-6);
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__dot {
  position: absolute;
  top: 6px;
  /* Place the dot so its CENTER sits exactly on --tl-rail-x:
   *   item left edge is at  +tl-gutter   from .timeline
   *   dot left edge wanted: tl-rail-x - tl-dot / 2 from .timeline
   * => relative to the item: that minus the gutter. */
  left: calc(var(--tl-rail-x) - var(--tl-gutter) - var(--tl-dot) / 2);
  width: var(--tl-dot);
  height: var(--tl-dot);
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--border-strong);
  box-sizing: border-box;
}

.timeline__item.is-current .timeline__dot {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-dim);
}

.timeline__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px var(--space-3);
  margin-bottom: var(--space-2);
}

.timeline__title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  flex: 1 1 auto;
  min-width: 0;
}

.timeline__time {
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
  flex: 0 0 auto;
  white-space: nowrap;
}

.timeline__company {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Tag list */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Education */
.education {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.education__title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.education__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  color: var(--text-muted);
  font-size: 13px;
}

@media (max-width: 900px) {
  .cv__grid {
    grid-template-columns: 1fr;
    gap: var(--space-7);
  }
}
</style>
