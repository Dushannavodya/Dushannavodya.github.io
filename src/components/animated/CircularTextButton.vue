<script setup>
import { Download } from 'lucide-vue-next'

defineProps({
  text: { type: String, default: 'DOWNLOAD • RESUME •' },
  href: { type: String, required: true },
  download: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Download resume' },
})
</script>

<template>
  <a
    class="circular-download"
    :href="href"
    :download="download"
    :aria-label="ariaLabel"
  >
    <svg class="circular-download__text" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path
          id="resume-download-circle"
          d="M 60,60 m -43,0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
        />
      </defs>
      <text>
        <textPath href="#resume-download-circle" startOffset="0">
          {{ text }}
        </textPath>
      </text>
    </svg>

    <span class="circular-download__icon" aria-hidden="true">
      <Download :size="24" :stroke-width="1.8" />
    </span>
  </a>
</template>

<style scoped>
.circular-download {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 122px;
  height: 122px;
  flex: 0 0 auto;
  border-radius: 50%;
  color: var(--text);
  isolation: isolate;
  transition:
    color var(--transition),
    transform var(--transition);
}

.circular-download::before {
  content: "";
  position: absolute;
  inset: 18px;
  z-index: -1;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  transition:
    background var(--transition),
    border-color var(--transition),
    transform var(--transition);
}

.circular-download__text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: circular-download-spin 13s linear infinite;
}

.circular-download__text text {
  fill: currentColor;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.circular-download__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  transition:
    background var(--transition),
    color var(--transition),
    transform var(--transition);
}

.circular-download:hover {
  color: var(--accent);
  transform: translateY(-3px);
}

.circular-download:hover::before {
  border-color: var(--accent);
  background: var(--accent-dim);
  transform: scale(1.03);
}

.circular-download:hover .circular-download__icon {
  background: var(--text);
  color: var(--bg);
  transform: scale(0.96);
}

@keyframes circular-download-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .circular-download__text {
    animation: none;
  }
}

@media (max-width: 520px) {
  .circular-download {
    width: 106px;
    height: 106px;
  }

  .circular-download::before {
    inset: 15px;
  }

  .circular-download__icon {
    width: 48px;
    height: 48px;
  }
}
</style>
