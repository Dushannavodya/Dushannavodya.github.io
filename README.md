# Dushan Navodya — Portfolio (Vue 3)

Personal portfolio site, refactored from a static HTML/CSS/jQuery template into a
component-based Vue 3 application powered by Vite.

## Stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite](https://vitejs.dev/) for dev server and bundling
- [Swiper](https://swiperjs.com/vue) for the Innovations carousel
- The original Bootstrap / animate.css / Font Awesome stylesheets, served from
  `public/assets/css/` so the design is preserved 1:1.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # produce a production build in dist/
npm run preview  # preview the production build locally
```

## Project structure

```
.
├── index.html                  Vite entry HTML
├── public/assets/              Static assets (css, fonts, img, files)
├── src/
│   ├── main.js                 App bootstrap and global directive registration
│   ├── App.vue                 Root layout
│   ├── components/
│   │   ├── AppHeader.vue       Header (with sticky variant)
│   │   ├── AppFooter.vue
│   │   ├── BackToTop.vue       Scroll-progress button
│   │   ├── NavMenu.vue         Reusable nav (used in both headers)
│   │   └── sections/
│   │       ├── HeroSection.vue
│   │       ├── ServicesSection.vue
│   │       ├── PortfolioSection.vue
│   │       ├── ResumeSection.vue
│   │       ├── SkillsSection.vue
│   │       ├── InnovationsSection.vue
│   │       └── ContactSection.vue
│   ├── composables/            Reusable reactive logic
│   │   ├── useStickyHeader.js
│   │   ├── useActiveSection.js
│   │   ├── useScrollProgress.js
│   │   └── useSmoothScroll.js
│   ├── directives/
│   │   └── reveal.js           v-reveal directive (replaces WOW.js)
│   └── data/                   Site content (decoupled from the views)
│       ├── site.js
│       ├── hero.js
│       ├── services.js
│       ├── portfolio.js
│       ├── resume.js
│       ├── skills.js
│       ├── innovations.js
│       └── contact.js
└── vite.config.js
```

### Editing content

All copy lives under `src/data/`. Edit those files to update text, links, work
items, skills, etc. The components subscribe to the data, so the views update
automatically.

### Notes on the refactor

The original template depended on jQuery and a fleet of plugins (Isotope, Owl
Carousel, WOW.js, GSAP, etc.). The Vue rewrite removes all of them in favour of
small, composable building blocks:

| Original                  | Replacement                                     |
| ------------------------- | ----------------------------------------------- |
| WOW.js + animate.css      | `v-reveal` directive (IntersectionObserver)     |
| jQuery sticky header      | `useStickyHeader` composable                    |
| jQuery onePageNav         | `useActiveSection` composable                   |
| jQuery `backToTop.js`     | `useScrollProgress` + `BackToTop.vue`           |
| Isotope masonry filter    | `computed` filter + responsive CSS grid         |
| Owl Carousel testimonials | Swiper Vue carousel                             |
| jQuery DOM updates        | Reactive refs and computed properties           |

Animate.css class names (e.g. `wow fadeInUp`) are still used as the visual
animation; the `v-reveal` directive simply triggers them when an element enters
the viewport.
