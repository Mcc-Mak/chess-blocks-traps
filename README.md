# 棋塊陷阱

A 2-player chess variant where each player places **blocks** and hidden **bombs** on an 8×8 board. Built with **React + Vite** and deployed to **GitHub Pages**.

**Live site:** <https://mcc-mak.github.io/chess_blocks_traps/>

## Rules

- **每回合僅能執行一項動作**：移動棋子、放置方塊或放置炸彈，三選一。
- **炸彈**：隱形於棋盤上，當棋子踩到時引爆，棋子被消滅，該格變為爆炸殘骸（不可通行）。
- **方塊**：可見的障礙物，阻擋移動（可覆蓋放置於隱形炸彈上）。
- **移動**：棋子可向上、下、左、右移動一格。
- **計分**：棋子抵達對方底線即得 1 分。
- **勝利**：先達 5 分者勝。
- 每局雙方各獲 **3 個方塊** 與 **3 個炸彈**。

## Local development

```bash
npm install
npm run dev        # start Vite dev server
npm run build      # production build into ./dist
npm run preview    # preview the production build locally
```

## Deploying to GitHub Pages

The build output in `dist/` is fully static and uses **relative asset URLs** (`base: './'` in `vite.config.js`), so it works under any GitHub Pages subpath such as `https://<user>.github.io/<repo>/`.

Pushing to the `dev-001` branch triggers the `auto-merge.yml` workflow, which cascades `dev-001 → dev → main`, builds, and deploys to GitHub Pages automatically.

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
    │   └── engine.js        # Pure OOP game engine (Game / Player / Cell)
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
| Functions      | `camelCase`       | `movableTargets`   |
| Classes        | `PascalCase`      | `Game`, `Player`   |
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

- **Immutable OOP.** The engine is built from three classes — `Game`, `Player`, `Cell` — all in `engine.js`. Every action method (`moveChess`, `placeBlock`, `placeBomb`) returns a **new** instance; the receiver is never mutated.
- Each class provides a `clone()` helper; `Game` clones its board (new `Cell` per square) and players before applying a change.
- `Cell` and `Player` expose factory helpers (`Cell.chess(player)`, `Player.useBlock()`, …) that return fresh instances, keeping state transitions allocation-explicit.
- **One action per round**: placing a block, placing a bomb, or moving a chess each end the turn immediately — there are no per-round action counters.
- No DOM access, no React imports, no side effects — the engine is UI-agnostic and testable in isolation.
- Constants (enums, config, image maps) live in `constants.js`; logic lives in `engine.js`.

### 5. State management (`src/hooks`)

- `useGame` is the single bridge between React and the engine.
- It wraps a `useReducer` whose reducer dispatches to `Game` instance methods (each returns a new `Game`).
- All dispatchers are memoized with `useCallback`.
- UI-only flags (e.g. "rules modal open") live as local `useState` in the component that owns them, not in the game reducer.

### 6. Styling (`src/styles.css`)

- Single shared stylesheet; no CSS-in-JS, no per-component CSS files.
- `kebab-case` class names; layout via flexbox / grid.
- Theme colors are declared as CSS custom properties in `:root` and referenced everywhere.
- Responsive behavior uses media queries, not inline pixel hacks.

### 7. Assets (`src/assets`)

- All images live under `src/assets/img/` and are imported as ESM so Vite hashes and bundles them.
- File names are `UPPER_SNAKE` (e.g. `PLAYER_1.PNG`, `BOMB_1.PNG`).
- Never reference images by absolute path; always through the `IMAGES` map / helpers in `constants.js`.
