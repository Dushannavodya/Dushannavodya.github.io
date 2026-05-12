# Dushan Navodya Portfolio

Personal portfolio site built with Vue 3 and Vite.

## Stack

- Vue 3 with the Composition API
- Vite for development and production builds
- Motion-powered custom animation components
- Lucide icons

## Getting Started

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Project Structure

```text
.
├── index.html
├── public/
│   └── assets/
│       ├── files/
│       └── img/
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   └── styles/
│   ├── components/
│   │   ├── animated/
│   │   └── sections/
│   ├── composables/
│   ├── data/
│   ├── directives/
│   ├── App.vue
│   └── main.js
└── vite.config.js
```

## Editing Content

Most editable site content lives in `src/data/`:

- `about.js`
- `contact.js`
- `portfolio.js`
- `resume.js`
- `services.js`
- `site.js`
- `skills.js`

Static files such as images and the resume PDF live under `public/assets/`.
