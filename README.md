# Erica Michelotti — Portfolio

Personal portfolio and resume site, inspired by Apple's design language.

**Live:** https://ericamichelotti.github.io/portfolio-site/

## Stack

- [React](https://react.dev) + [Vite](https://vite.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) components (Radix)
- [Motion](https://motion.dev) (formerly Framer Motion) for animation
- [Lucide](https://lucide.dev) icons

## Features

- Light and dark themes (follows the system, with a manual toggle)
- Scroll-linked hero and text-reveal animations, respecting `prefers-reduced-motion`
- Fully responsive, accessible navigation with a mobile menu
- All content in a single file: [`src/data/profile.ts`](src/data/profile.ts)

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build to dist/
npm run lint     # lint with oxlint
npm run preview  # preview the production build
```

## Editing content

Everything shown on the site — name, intro, projects, skills, stats, links and work
experience — lives in `src/data/profile.ts`. The Experience section and the email /
LinkedIn buttons appear automatically once you fill them in.

## Deployment

Pushing to `main` builds and deploys to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). If you rename the
repository, update `base` in `vite.config.ts` to match.
