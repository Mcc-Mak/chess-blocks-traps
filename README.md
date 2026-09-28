# Anonymous Chessboard

A 2-player chess variant where each player also places **blocks** and hidden **traps** on an 8×8 board. Built with **React + Vite** and deployable to **GitHub Pages**.

## Rules

- **Per turn** a player may, in any order:
  1. Place at most **1 block** (visible obstacle).
  2. Place at most **1 trap** (hidden until triggered).
  3. Move **1 chess** by one square (up / down / left / right).
- A turn ends as soon as a chess is moved.
- **Trap**: when a chess steps on it, the chess is destroyed and the square becomes blocking rubble.
- **Block**: blocks movement (can replace a hidden trap).
- **Scoring**: 1 point when one of your chesses reaches the opposite side.
- **Victory**: first player to reach **5 points** wins.
- Each player gets **3 blocks** and **3 traps** per game (max 1 of each usable per turn).

## Local development

```bash
npm install
npm run dev        # start Vite dev server
npm run build      # production build into ./dist
npm run preview    # preview the production build locally
```

## Deploying to GitHub Pages

The build output in `dist/` is fully static and uses **relative asset URLs** (`base: './'` in `vite.config.js`), so it works under any GitHub Pages subpath such as `https://<user>.github.io/<repo>/`.

1. Run the build:
   ```bash
   npm run build
   ```
2. Publish the contents of `dist/` to your GitHub Pages source (e.g. the `gh-pages` branch, the `/docs` folder, or your existing deploy pipeline).

No CI pipeline config is bundled — use whichever deploy workflow you already have.

## Project structure

```
.
├── index.html               # Vite entry HTML
├── vite.config.js           # Vite config (base: './' for Pages)
├── package.json
├── documentation/           # Original game-design reference (kept)
└── src/
    ├── main.jsx             # React bootstrap
    ├── App.jsx              # Top-level layout + modals
    ├── styles.css           # Global styles
    ├── assets/img/          # Game artwork (PNG)
    ├── game/
    │   ├── constants.js     # Cell/status enums, images, config
    │   └── engine.js        # Pure game-logic functions
    ├── hooks/
    │   └── useGame.js       # useReducer bridge to the engine
    └── components/
        ├── Chessboard.jsx
        ├── Sidebar.jsx
        └── Modal.jsx
```

## Coding standards

The codebase follows one consistent style, enforced by convention across every layer. Categories below clarify where rules differ.

### 1. General

- **Language**: JavaScript (JSX for React). No TypeScript.
- **Module system**: ESM (`"type": "module"`), `import` / `export` only — no CommonJS.
- **Formatting**: 2-space indentation; single quotes for strings; semicolons required.
- **No dead code**: remove unused imports, variables, and commented-out blocks.
- **No comments** unless they explain *why* a non-obvious decision was made.

### 2. Naming

| Element        | Convention        | Example            |
|----------------|-------------------|--------------------|
| Files (JS/JSX) | `camelCase.jsx`   | `useGame.js`       |
| Components     | `PascalCase`      | `Chessboard`       |
| Functions      | `camelCase`       | `getMovableTargets`|
| Constants enum | `UPPER_SNAKE`     | `CELL`, `STATUS`   |
| Enum members   | `UPPER_SNAKE`     | `CELL.CHESS`       |
| CSS classes    | `kebab-case`      | `cell-chess`       |

### 3. React components (`src/components`)

- One component per file; the file name matches the component name.
- Components are functional and use hooks; no class components.
- Props are destructured in the function signature.
- A component owns no game state — it receives `game` (from `useGame`) or plain props and dispatches via handlers.
- Side-effect-free render: derive view data (e.g. movable targets) inside render from state, never mutate props.

### 4. Game logic (`src/game`)

- **Pure functions only.** Every action (`moveChess`, `placeBlock`, …) takes the current state and returns a **new** state object; input state is never mutated.
- State is cloned via the internal `clone()` helper before any change.
- No DOM access, no React imports, no side effects — the engine is UI-agnostic and testable in isolation.
- Constants (enums, config, image maps) live in `constants.js`; logic lives in `engine.js`.

### 5. State management (`src/hooks`)

- `useGame` is the single bridge between React and the engine.
- It wraps a `useReducer` whose reducer dispatches to pure engine functions.
- All dispatchers are memoized with `useCallback`.
- UI-only flags (e.g. "rules modal open") live as local `useState` in the component that owns them, not in the game reducer.

### 6. Styling (`src/styles.css`)

- Single shared stylesheet; no CSS-in-JS, no per-component CSS files.
- `kebab-case` class names; layout via flexbox / grid.
- Theme colors are declared as CSS custom properties in `:root` and referenced everywhere.
- Responsive behavior uses media queries, not inline pixel hacks.

### 7. Assets (`src/assets`)

- All images live under `src/assets/img/` and are imported as ESM so Vite hashes and bundles them.
- File names are `UPPER_SNAKE` and match the original artwork names (e.g. `PLAYER_1.PNG`).
- Never reference images by absolute path; always through the `IMAGES` map / helpers in `constants.js`.
