# Architecture Notes

## Electron Security

- The main window uses `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, and `webSecurity: true`.
- Renderer-initiated navigation and new windows are blocked in `main.js`; the app currently loads only local renderer files.
- Filesystem and SQLite access stay in the main process through `database/db.js`.

## IPC Boundary

- Main-process IPC channel names live in `shared/ipc/channels.js`.
- The preload exposes a small `window.libraryAPI` surface and does not expose raw `ipcRenderer`.
- Because this app uses a sandboxed preload without a bundler, `preload.js` keeps a local channel mirror instead of importing app-local modules.

## Renderer

- New renderer work lives in `src/renderer` as a React + TypeScript + Vite app.
- `main.js` loads `renderer-dist/index.html` when the React renderer has been built.
- The old `renderer/` files remain as a temporary fallback during the incremental migration.

## Error Policy

- Expected validation and business-rule failures are created with `createUserFacingError`.
- IPC handlers log the original error in the main process.
- Unexpected errors are returned to the renderer as a generic message.
