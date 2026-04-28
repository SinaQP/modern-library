# AGENT.md

## Purpose

This file defines the engineering rules, architecture expectations, coding standards, and agent instructions for this Electron application. Any human developer or AI coding agent working in this repository must follow these rules before making changes.

The goal is to keep the project clean, secure, maintainable, testable, and easy to evolve.

---

## Core Principles

1. **Clarity over cleverness**

   * Write code that is easy to understand.
   * Avoid unnecessary abstractions.
   * Prefer simple, explicit logic over compact or overly clever code.

2. **Small, focused modules**

   * Each file should have one clear responsibility.
   * Split large files before they become difficult to reason about.
   * Avoid god objects, giant utility files, and deeply nested logic.

3. **Security first**

   * Electron apps have access to powerful system APIs.
   * Treat renderer code as untrusted.
   * Never expose Node.js, filesystem, shell, or OS APIs directly to the renderer.

4. **Type safety by default**

   * Prefer TypeScript for all application code.
   * Avoid `any` unless there is a clear reason.
   * Use explicit types for public APIs, IPC contracts, and shared models.

5. **Predictable structure**

   * Follow the agreed folder structure.
   * Do not introduce new architectural patterns without a clear reason.
   * Keep related code close together.

6. **Test behavior, not implementation details**

   * Tests should verify user-visible or business behavior.
   * Avoid brittle tests that depend on internal implementation.

7. **No silent failures**

   * Handle errors deliberately.
   * Log useful debugging information in main-process code.
   * Show safe, user-friendly messages in the UI.

---

## Recommended Project Structure

Use this structure unless the project already has a clearly established alternative:

```txt
src/
  main/
    app.ts
    windows/
      createMainWindow.ts
    ipc/
      handlers/
      channels.ts
    services/
    config/
    utils/

  preload/
    index.ts
    api/
      appApi.ts
      fileApi.ts

  renderer/
    app/
      App.tsx
      routes/
      providers/
    components/
      ui/
      shared/
    features/
      feature-name/
        components/
        hooks/
        services/
        types.ts
        index.ts
    hooks/
    lib/
    styles/
    assets/

  shared/
    types/
    constants/
    validation/
    ipc/
      contracts.ts

scripts/
tests/
docs/
```

### Folder Responsibilities

#### `src/main`

Main Electron process code.

Responsible for:

* Creating and managing windows
* Registering IPC handlers
* Native OS integrations
* Filesystem access
* App lifecycle events
* Menu/tray behavior
* Secure system-level operations

Rules:

* Do not put UI code here.
* Do not import renderer-only code.
* Keep business logic in services where possible.
* Keep Electron lifecycle code separate from application services.

#### `src/preload`

Secure bridge between main and renderer.

Responsible for:

* Exposing a minimal API using `contextBridge`
* Calling IPC channels safely
* Validating inputs where appropriate
* Hiding implementation details from the renderer

Rules:

* Never expose raw `ipcRenderer` directly.
* Never expose unrestricted filesystem, shell, or process access.
* Keep exposed APIs small and intentional.
* API names should describe app behavior, not IPC internals.

Good:

```ts
window.appApi.getVersion()
window.fileApi.openProject()
```

Bad:

```ts
window.ipcRenderer.send(channel, payload)
window.fs.readFile(path)
```

#### `src/renderer`

Frontend application code.

Responsible for:

* UI components
* Screens and routes
* Client-side state
* User interactions
* Calling preload APIs

Rules:

* Do not use Node.js APIs directly.
* Do not import from `src/main`.
* Do not assume direct access to filesystem or OS APIs.
* Keep components small and focused.

#### `src/shared`

Code that can be safely used by main, preload, and renderer.

Responsible for:

* Shared TypeScript types
* IPC contracts
* Constants
* Validation schemas
* Pure utility functions

Rules:

* Shared code must not depend on Electron runtime APIs.
* Shared code must not depend on browser-only or Node-only globals unless isolated clearly.
* Prefer pure functions in shared utilities.

---

## Electron Security Rules

These rules are mandatory.

### BrowserWindow Defaults

When creating a `BrowserWindow`, use secure defaults:

```ts
webPreferences: {
  preload: preloadPath,
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true,
}
```

Rules:

* `contextIsolation` must remain enabled.
* `nodeIntegration` must remain disabled.
* Do not enable `enableRemoteModule`.
* Do not disable web security.
* Do not allow arbitrary navigation.
* Do not load remote content unless the app explicitly requires it and security has been reviewed.

### IPC Security

All IPC communication must be deliberate and typed.

Rules:

* Define IPC channels in one central place.
* Validate incoming payloads in the main process.
* Never trust renderer input.
* Never pass raw errors with sensitive details back to the renderer.
* Prefer request/response IPC using `ipcRenderer.invoke` and `ipcMain.handle`.
* Avoid fire-and-forget IPC unless it is truly event-based.

Recommended pattern:

```ts
// shared/ipc/contracts.ts
export const IPC_CHANNELS = {
  APP_GET_VERSION: 'app:get-version',
} as const;
```

```ts
// main/ipc/handlers/appHandlers.ts
ipcMain.handle(IPC_CHANNELS.APP_GET_VERSION, () => {
  return app.getVersion();
});
```

```ts
// preload/api/appApi.ts
contextBridge.exposeInMainWorld('appApi', {
  getVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP_GET_VERSION),
});
```

---

## Clean Code Rules

### File Size

Guidelines:

* Prefer files under 200 lines.
* Refactor files over 300 lines unless there is a strong reason not to.
* Split by responsibility, not randomly.

### Function Size

Guidelines:

* Prefer functions under 40 lines.
* A function should do one thing.
* Extract complex conditionals into named helpers.

Bad:

```ts
if ((user && user.role === 'admin' && !user.disabled) || isOwner) {
  // ...
}
```

Good:

```ts
if (canManageProject(user, project)) {
  // ...
}
```

### Naming

Use names that explain intent.

Rules:

* Use `camelCase` for variables and functions.
* Use `PascalCase` for React components, classes, and types.
* Use `UPPER_SNAKE_CASE` for constants that are truly static.
* Avoid vague names such as `data`, `item`, `obj`, `temp`, `stuff`, unless the scope is tiny and obvious.

Good:

```ts
const selectedProjectId = project.id;
const isWindowFocused = mainWindow.isFocused();
```

Bad:

```ts
const data = project.id;
const flag = mainWindow.isFocused();
```

### Comments

Comments should explain **why**, not restate **what**.

Good:

```ts
// Keep this timeout below the OS dialog threshold to prevent duplicate permission prompts.
```

Bad:

```ts
// Set timeout to 500
```

Rules:

* Remove outdated comments.
* Do not leave commented-out code.
* Use JSDoc for public utilities and complex APIs.

### Error Handling

Rules:

* Never swallow errors silently.
* Use typed error results for expected failures.
* Use exceptions for unexpected failures.
* Log main-process errors with enough context.
* Do not expose stack traces or sensitive paths to users.

Recommended result type:

```ts
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

---

## TypeScript Rules

1. Prefer explicit types for exported functions.
2. Avoid `any`; use `unknown` when the type is not known.
3. Narrow `unknown` safely before using it.
4. Use discriminated unions for state machines and complex UI states.
5. Keep shared types in `src/shared/types` or feature-level `types.ts` files.
6. Do not duplicate types across main, preload, and renderer.

Bad:

```ts
function handlePayload(payload: any) {
  return payload.name;
}
```

Good:

```ts
function handlePayload(payload: unknown) {
  if (!isValidPayload(payload)) {
    throw new Error('Invalid payload');
  }

  return payload.name;
}
```

---

## React Renderer Rules

### Component Structure

Rules:

* Components should be small and focused.
* Move business logic into hooks or services.
* Keep reusable UI components in `components/ui` or `components/shared`.
* Keep feature-specific components inside the feature folder.

Recommended component order:

```tsx
export function ProjectCard({ project }: ProjectCardProps) {
  const statusLabel = getProjectStatusLabel(project.status);

  return (
    <article>
      <h2>{project.name}</h2>
      <p>{statusLabel}</p>
    </article>
  );
}
```

### State Management

Rules:

* Use local state for local UI behavior.
* Use context only for state that is truly shared across many components.
* Avoid putting everything into global state.
* Prefer derived values over duplicated state.

Bad:

```ts
const [fullName, setFullName] = useState(`${firstName} ${lastName}`);
```

Good:

```ts
const fullName = `${firstName} ${lastName}`;
```

### Hooks

Rules:

* Custom hooks should start with `use`.
* Hooks should encapsulate reusable behavior.
* Do not hide unrelated responsibilities inside one hook.
* Keep effects focused and clean up subscriptions/listeners.

---

## Styling Rules

Follow the styling approach already used by the project.

General rules:

* Do not mix multiple styling systems unless necessary.
* Prefer reusable design primitives.
* Avoid hardcoded magic values when tokens exist.
* Keep layout styles close to the component that owns the layout.
* Keep global styles minimal.

If using Tailwind:

* Prefer readable class grouping.
* Extract repeated class patterns into components.
* Avoid extremely long class strings when a component abstraction would be clearer.

If using CSS modules:

* Use meaningful class names.
* Keep module files close to the component.
* Avoid global leakage.

---

## IPC Contract Rules

IPC is part of the app's public internal API. Treat it carefully.

Rules:

1. Every IPC channel must be declared in a shared constants file.
2. Every IPC payload and response must have a TypeScript type.
3. Validate payloads before performing privileged actions.
4. Keep channel names stable unless a migration is planned.
5. Prefer domain-oriented APIs over low-level technical APIs.

Good API:

```ts
window.projectApi.openProject(projectId)
```

Bad API:

```ts
window.electron.invoke('read-file', path)
```

---

## Filesystem and Native API Rules

Rules:

* Filesystem access belongs in the main process.
* Renderer must request operations through preload APIs.
* Validate file paths before reading or writing.
* Do not allow arbitrary path traversal.
* Ask for user intent before destructive actions.
* Keep file operations isolated in services.

Example structure:

```txt
src/main/services/fileSystemService.ts
src/preload/api/fileApi.ts
src/shared/types/file.ts
```

---

## Dependency Rules

Before adding a dependency, check:

1. Is it necessary?
2. Is the package maintained?
3. Is the package secure?
4. Can the feature be implemented simply without it?
5. Will it increase bundle size significantly?

Rules:

* Do not add dependencies for trivial utilities.
* Prefer well-maintained libraries.
* Remove unused dependencies.
* Keep dependency usage isolated when possible.
* Do not change package manager unless explicitly requested.

---

## Testing Rules

### Required Test Types

The project should include tests for:

* Pure utilities
* Shared validation logic
* IPC handlers
* Main-process services
* Important renderer behavior
* Critical user flows

### Testing Guidelines

Rules:

* Write tests for new behavior.
* Update tests when behavior changes.
* Do not delete tests just to make the suite pass.
* Mock Electron APIs where needed.
* Prefer testing behavior over implementation details.

Recommended test locations:

```txt
src/main/services/__tests__/
src/renderer/features/feature-name/__tests__/
src/shared/validation/__tests__/
```

---

## Linting, Formatting, and Quality Checks

Before completing work, run the project's available checks.

Common commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Use the package manager already present in the project:

* If `package-lock.json` exists, use `npm`.
* If `pnpm-lock.yaml` exists, use `pnpm`.
* If `yarn.lock` exists, use `yarn`.
* If `bun.lockb` or `bun.lock` exists, use `bun`.

Do not introduce a second package manager.

---

## Git and Commit Rules

Rules:

* Keep changes focused.
* Avoid mixing unrelated refactors with feature work.
* Do not reformat unrelated files.
* Do not commit generated build artifacts unless the project requires them.
* Do not modify lockfiles unless dependencies changed.

Suggested commit style:

```txt
feat: add project import flow
fix: prevent duplicate window creation
refactor: isolate file service logic
test: add ipc handler coverage
chore: update lint configuration
```

---

## Agent Workflow Rules

Any AI coding agent working on this repository must follow this process.

### 1. Understand Before Editing

Before making changes:

* Read the relevant files.
* Understand the current architecture.
* Identify existing patterns.
* Reuse existing utilities and conventions.
* Avoid introducing new patterns unless necessary.

### 2. Make Minimal, Focused Changes

Rules:

* Change only what is necessary for the task.
* Avoid large rewrites unless explicitly requested.
* Preserve existing behavior unless the task requires changing it.
* Do not rename files, functions, or folders without a clear reason.

### 3. Keep Architecture Boundaries

Rules:

* Renderer must not import main-process code.
* Main process must not depend on renderer UI code.
* Preload must expose only safe, minimal APIs.
* Shared code must remain runtime-safe across environments.

### 4. Validate Work

After changes, the agent should run available checks when possible:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If a command is unavailable, mention it clearly instead of inventing a result.

### 5. Report Clearly

When finishing a task, the agent should summarize:

* What changed
* Which files changed
* Which checks were run
* Any checks that failed or could not be run
* Any known risks or follow-up work

---

## Forbidden Practices

Do not:

* Expose `ipcRenderer` directly to the renderer.
* Enable `nodeIntegration` in renderer windows.
* Disable `contextIsolation`.
* Disable Electron web security without explicit approval.
* Use `eval` or dynamic code execution.
* Store secrets in source code.
* Commit `.env` files.
* Add large dependencies without justification.
* Mix unrelated changes in one task.
* Ignore TypeScript errors.
* Silence lint errors without a reason.
* Use `any` as a shortcut.
* Swallow errors silently.
* Rewrite the app architecture without approval.

---

## Environment and Secrets

Rules:

* Store secrets in environment variables or secure OS storage.
* Never commit secrets, tokens, API keys, certificates, or private credentials.
* Provide `.env.example` for required environment variables.
* Validate required environment variables during startup where appropriate.

Example:

```txt
.env
.env.local
*.pem
*.key
```

These files should usually be ignored by Git.

---

## Accessibility Rules

Renderer UI should be accessible by default.

Rules:

* Use semantic HTML where possible.
* Buttons must be buttons, not clickable divs.
* Inputs must have labels.
* Interactive elements must be keyboard accessible.
* Preserve visible focus states.
* Use ARIA only when semantic HTML is not enough.

---

## Performance Rules

Rules:

* Avoid unnecessary re-renders in large UI trees.
* Memoize only when there is a measurable reason.
* Keep expensive work out of render paths.
* Use lazy loading for large screens or heavy modules where appropriate.
* Avoid blocking the main process with long synchronous work.
* Move heavy tasks to worker threads or child processes if needed.

---

## Logging Rules

Rules:

* Main-process logs should include useful context.
* Do not log secrets or personal user data.
* Renderer logs should be minimal in production.
* Use a consistent logging utility if the project has one.

Good:

```ts
logger.error('Failed to open project', {
  projectId,
  error,
});
```

Bad:

```ts
console.log(userToken);
```

---

## Documentation Rules

Update documentation when changing:

* Setup steps
* Build commands
* Environment variables
* Architecture decisions
* IPC contracts
* Native permissions
* Packaging or release behavior

Prefer short, accurate documentation over long outdated documentation.

---

## Release and Packaging Rules

Rules:

* Do not change packaging configuration casually.
* Test production builds before release-related changes are considered done.
* Keep platform-specific behavior isolated.
* Document required permissions for macOS, Windows, and Linux.
* Be careful with auto-update logic; it affects all users.

---

## Code Review Checklist

Before considering work complete, verify:

* [ ] Code follows the project structure.
* [ ] Main, preload, renderer, and shared boundaries are respected.
* [ ] Electron security settings remain safe.
* [ ] IPC channels are typed and validated.
* [ ] No secrets are committed.
* [ ] No unrelated files were changed.
* [ ] TypeScript passes.
* [ ] Linting passes.
* [ ] Tests pass or failures are documented.
* [ ] Build passes or failures are documented.
* [ ] Documentation is updated when needed.

---

## Default Decision Rules

When uncertain:

1. Follow existing project patterns.
2. Prefer smaller changes.
3. Prefer explicit types.
4. Prefer secure Electron defaults.
5. Prefer readable code over clever code.
6. Ask for clarification when a change could affect architecture, security, data loss, or user workflows.

---

## Final Rule

Leave the codebase cleaner, safer, and easier to understand than you found it.


## React Renderer Modernization Rules

The Electron renderer must be treated as a real frontend application, not as a single script file.

If the current project has a large `renderer.js`, `renderer.ts`, or one giant file that contains UI, state, event handling, DOM manipulation, and business logic together, the agent must gradually refactor it into a professional React-based renderer architecture.

### Frontend Goal

The renderer should be built as a modern React application with:

- React
- TypeScript
- Vite or the existing project bundler
- Component-based architecture
- Clear feature folders
- Typed preload APIs
- Clean state management
- Reusable UI components
- Maintainable styling
- Proper routing if the app has multiple screens

The renderer must feel like a professional frontend app inside Electron, not a quick HTML/JS prototype.

---

## Renderer Migration Rule

If the app currently uses a single renderer file, the agent must not keep adding more logic to that file.

Instead, new frontend work should move toward this structure:

```txt
src/
  renderer/
    main.tsx
    app/
      App.tsx
      routes/
      providers/
      layout/
    components/
      ui/
      shared/
    features/
      feature-name/
        components/
        hooks/
        services/
        stores/
        types.ts
        index.ts
    hooks/
    lib/
    styles/
    assets/
Migration Requirements

When modifying old renderer code:

Do not add more unrelated logic to the existing giant renderer file.
Extract UI sections into React components.
Extract repeated logic into hooks.
Extract business or data logic into services.
Move shared types into types.ts files.
Replace direct DOM manipulation with React state and props.
Keep the migration incremental and safe.
Do not rewrite the entire renderer at once unless explicitly requested.

Bad:

// renderer.js
document.querySelector('#save').addEventListener('click', async () => {
  const name = document.querySelector('#name').value;
  const result = await window.api.saveSomething(name);
  document.querySelector('#status').innerText = result.message;
});

Good:

export function SaveForm() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  async function handleSave() {
    const result = await window.appApi.saveSomething({ name });
    setStatus(result.message);
  }

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      void handleSave();
    }}>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button type="submit">Save</button>
      {status && <p>{status}</p>}
    </form>
  );
}
React Architecture Rules
Application Entry

The renderer entry point should be small.

Good:

// src/renderer/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

Bad:

// main.tsx
// Contains routing, all screens, API logic, styles, event handlers, and business logic.

The entry file should only boot the app.

Feature-Based Frontend Structure

Frontend code should be organized by feature when the app grows.

Example:

features/
  projects/
    components/
      ProjectCard.tsx
      ProjectList.tsx
      ProjectForm.tsx
    hooks/
      useProjects.ts
    services/
      projectService.ts
    stores/
      projectStore.ts
    types.ts
    index.ts

Rules:

Put feature-specific logic inside the feature folder.
Put reusable generic components in components/shared.
Put low-level UI primitives in components/ui.
Do not place all components in one flat components folder if the app has multiple domains.
Do not create huge files like Dashboard.tsx containing the entire app.
Component Quality Rules

React components must be:

Small
Typed
Reusable when appropriate
Easy to test
Easy to read
Free from unrelated business logic

Guidelines:

Prefer components under 150 lines.
Split files over 250 lines unless there is a strong reason not to.
One component should have one main responsibility.
Avoid deeply nested JSX.
Extract complex UI sections into child components.
Extract complex logic into hooks.

Bad:

export function Dashboard() {
  // Fetching data
  // Managing modals
  // Handling forms
  // Rendering sidebar
  // Rendering tables
  // Rendering settings
  // Handling IPC
  // 800 lines of JSX
}

Good:

export function DashboardPage() {
  return (
    <AppLayout>
      <DashboardHeader />
      <ProjectSummary />
      <RecentActivity />
    </AppLayout>
  );
}
UI Design System Rules

The renderer should have a consistent UI system.

Create reusable primitives such as:

components/
  ui/
    Button.tsx
    Input.tsx
    Modal.tsx
    Card.tsx
    Tabs.tsx
    Tooltip.tsx
    Dropdown.tsx
    EmptyState.tsx
    LoadingState.tsx
    ErrorState.tsx

Rules:

Do not create one-off button styles everywhere.
Do not duplicate modal implementations.
Use consistent spacing, typography, border radius, shadows, and colors.
Prefer a clean, modern desktop-app feel.
Every loading, empty, and error state should have a proper UI.
Avoid raw browser-looking UI unless intentionally styled that way.
Styling Rules for React Renderer

Use the styling system already selected by the project.

Recommended options:

Tailwind CSS
CSS Modules
Vanilla Extract
Styled Components
Plain CSS with clear conventions

Rules:

Do not mix multiple styling systems without a reason.
Keep global CSS minimal.
Prefer component-level styling.
Use design tokens for colors, spacing, and typography when available.
Avoid random hardcoded values across the app.
Keep dark mode support in mind if the app needs it.

Bad:

<div style={{ marginTop: 17, color: '#323232' }}>

Good:

<Card className="mt-4 text-muted-foreground">

or, with CSS modules:

<Card className={styles.projectCard}>
Renderer State Management Rules

State should be placed at the correct level.

Use:

useState for local component state
useReducer for complex local state
React Context for app-wide simple state
Zustand, Redux Toolkit, Jotai, or TanStack Query only if the project actually needs them

Rules:

Do not put everything in global state.
Do not duplicate derived state.
Do not store server/preload results in many unrelated places.
Keep async data loading predictable.
Use a proper loading/error/success state model.

Recommended async state shape:

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
Preload API Usage in React

React components must not call Electron internals directly.

Allowed:

window.appApi.getVersion()
window.projectApi.openProject()
window.fileApi.selectFile()

Forbidden:

window.ipcRenderer.send(...)
window.require('fs')
window.process
window.electron.remote

Rules:

React components call safe APIs exposed by preload.
Preload APIs must be typed.
API calls should usually be wrapped in frontend services.
Components should not know raw IPC channel names.

Good:

// features/projects/services/projectService.ts
export async function openProject(projectId: string) {
  return window.projectApi.openProject({ projectId });
}

Then:

const result = await openProject(project.id);
React Hooks Rules

Use custom hooks for reusable frontend behavior.

Examples:

hooks/
  useDebounce.ts
  useKeyboardShortcut.ts
  useWindowSize.ts

features/projects/hooks/
  useProjects.ts
  useCreateProject.ts

Rules:

Hooks must start with use.
Hooks should have one clear responsibility.
Do not hide unrelated behavior inside one hook.
Effects must clean up event listeners, timers, and subscriptions.
Do not use useEffect for logic that can be calculated during render.

Bad:

useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);

Good:

const fullName = `${firstName} ${lastName}`;
Routing Rules

If the app has multiple screens, use a clear routing structure.

Example:

app/
  routes/
    AppRoutes.tsx
    routePaths.ts

Rules:

Keep route paths centralized.
Do not hardcode route strings everywhere.
Keep page components separate from reusable components.
Page components should compose features, not contain all logic directly.

Example:

export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  SETTINGS: '/settings',
} as const;
Forms Rules

Forms must be structured and validated.

Recommended:

React Hook Form for complex forms
Zod for schema validation
Local state for very simple forms

Rules:

Validate user input before calling preload APIs.
Show useful validation messages.
Disable submit buttons during submission.
Prevent duplicate submissions.
Keep form components readable.
Frontend Error Handling Rules

Every async frontend action should handle:

Loading state
Success state
Error state
Empty state when applicable

Bad:

const data = await window.api.loadData();
setData(data);

Good:

try {
  setState({ status: 'loading' });
  const data = await loadData();
  setState({ status: 'success', data });
} catch {
  setState({
    status: 'error',
    error: 'Unable to load data. Please try again.',
  });
}

Rules:

Do not show raw stack traces to users.
Do not ignore failed preload/API calls.
Use friendly error messages.
Log technical details only where appropriate.
Frontend Performance Rules

Rules:

Avoid unnecessary global re-renders.
Keep heavy calculations out of render paths.
Use useMemo only when it solves a real problem.
Use React.memo only for expensive or frequently re-rendered components.
Lazy-load large screens when useful.
Avoid blocking the renderer thread with heavy synchronous work.
For expensive tasks, use main process, worker threads, or background services.
Professional UI/UX Rules

The frontend should feel polished.

Every major screen should include:

Clear title
Clear primary action
Proper spacing
Loading state
Empty state
Error state
Keyboard accessibility
Responsive layout where appropriate
Consistent visual hierarchy

Avoid:

Random spacing
Unstyled default buttons
Huge forms with no grouping
Inconsistent colors
Alerts for every error
Layout jumps during loading
Clickable div elements
UI text hardcoded in many places when reused
Accessibility Rules for React

Rules:

Use semantic HTML.
Use real buttons for actions.
Use labels for inputs.
Support keyboard navigation.
Preserve focus states.
Use aria-* only when semantic HTML is not enough.
Modals must trap focus and close with Escape when appropriate.
Icon-only buttons must have accessible labels.

Good:

<button aria-label="Close dialog" onClick={onClose}>
  <CloseIcon />
</button>

Bad:

<div onClick={onClose}>
  <CloseIcon />
</div>
React TypeScript Rules

Rules:

Props must be typed.
Avoid React.FC unless the project already uses it consistently.
Avoid any.
Use explicit return types for exported hooks and services.
Keep domain types in feature-level types.ts.
Keep shared cross-process types in src/shared.

Good:

type ProjectCardProps = {
  project: Project;
  onOpen: (projectId: string) => void;
};

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <Card>
      <h2>{project.name}</h2>
      <Button onClick={() => onOpen(project.id)}>Open</Button>
    </Card>
  );
}
Frontend Dependency Rules

Before adding a frontend dependency, verify:

The project actually needs it.
It is maintained.
It works well with Electron.
It does not add unnecessary bundle size.
It does not duplicate existing functionality.

Do not add large UI libraries, state libraries, animation libraries, or form libraries casually.

Allowed when justified:

React Router for routing
TanStack Query for async server/cache state
Zustand for lightweight global state
React Hook Form for complex forms
Zod for validation
Framer Motion for polished animations
Radix UI or shadcn/ui for accessible UI primitives
Renderer Testing Rules

Frontend code should be testable.

Recommended tools:

Vitest
React Testing Library
Playwright for end-to-end flows

Rules:

Test important user flows.
Test components by behavior, not internal implementation.
Mock preload APIs in frontend tests.
Do not depend on real Electron APIs inside renderer unit tests.
Add tests for complex hooks and services.

Example:

vi.stubGlobal('window', {
  projectApi: {
    openProject: vi.fn(),
  },
});
Strict Rule Against Renderer Monoliths

The agent must not create or expand files like:

renderer.js
renderer.ts
app.js
mainRenderer.ts

as a dumping ground for all frontend code.

If such a file already exists:

Keep it only as a temporary compatibility entry point.
Move new code into src/renderer.
Extract old code gradually.
Do not add new features directly into the monolith.
Add comments only when they help migration.
Prefer small pull requests or focused changes.

The long-term target is:

Electron Main Process
        ↓
Secure Preload API
        ↓
React Renderer App
        ↓
Feature-based UI Architecture
Final Frontend Rule

The renderer is a first-class frontend application.

Treat it with the same quality standards as a professional React web app:

clean architecture
reusable components
typed APIs
polished UI
predictable state
secure Electron boundaries
maintainable folder structure