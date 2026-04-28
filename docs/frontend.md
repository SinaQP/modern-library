# Frontend Renderer

The active renderer migration target is `src/renderer`.

## Commands

- `npm run typecheck` validates the React + TypeScript renderer.
- `npm run build:renderer` builds the Vite renderer into `renderer-dist`.
- `npm run build` runs typecheck and then builds the renderer.
- `npm start` builds the renderer and launches Electron.
- `npm run dev:renderer` starts the Vite renderer dev server for frontend-only work.

## Migration Notes

- Do not add new features to `renderer/app.js`.
- Keep new UI in feature folders under `src/renderer/features`.
- Keep reusable primitives under `src/renderer/components/ui`.
- Wrap preload calls in feature services before using them in components.
