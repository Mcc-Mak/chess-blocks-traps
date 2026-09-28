# Changelog

All notable changes to this project are documented in this file.
Versions follow [Semantic Versioning](https://semver.org/) `MAJOR.MINOR.PATCH`.

## [1.2.1] - 2026-09-28

### Changed
- The player-turn panel (`.panel-turn`) now switches background color,
  border, and glow based on the active player (blue for Player 1, red for
  Player 2) to make turn changes more visually obvious.

## [1.2.0] - 2026-09-28

### Changed
- **One action per round**: placing a block, placing a bomb, or moving a chess
  now each end the turn immediately. Removed per-round action counters
  (`movePerRound`, `blockPerRound`, `trapPerRound`) from `Player`; the class
  now tracks only `score`, `blocksRemaining`, and `bombsRemaining`.
- **Renamed "trap" to "bomb"** throughout the codebase for clarity (the
  hidden item explodes on contact). `CELL.TRAP` → `CELL.BOMB`,
  `selectTrap` → `selectBomb`, `placeTrap` → `placeBomb`,
  `playerTrapImage` → `playerBombImage`, `TRAPS_PER_GAME` →
  `BOMBS_PER_PLAYER`. Asset files renamed `TRAP_*.PNG` → `BOMB_*.PNG`.
- **All-Traditional Chinese UI**: removed the bilingual i18n layer
  (`src/i18n/`, `LanguageToggle.jsx`). Display text is now hardcoded as
  module-level `TEXT` constants in each component, per the original design.
- **Sidebar moved to the left** of the chessboard (swapped render order
  in `App.jsx`).
- Renamed config constants for clarity: `END_SCORE` → `WINNING_SCORE`,
  `END_COLUMNS` → `GOAL_COLUMNS`, `BLOCKS_PER_GAME` →
  `BLOCKS_PER_PLAYER`.
- `currentPlayer` and `opponent` are now getters on `Game`.
- Added live site URL to `README.md`; updated rules, project structure,
  and coding standards sections.

### Removed
- `src/i18n/strings.js`, `src/i18n/LanguageContext.jsx` — no dual language.
- `src/components/LanguageToggle.jsx` — no language toggle.
- `STATUS.EXIT` — unused enum member.

## [1.1.0] - 2026-09-28

### Changed
- Renamed the game from "Anonymous Chessboard" to **棋塊陷阱 · Chess Blocks & Traps**
  (`package.json` name → `chess-blocks-traps`, title and `<html lang>` updated).
- Rewrote the game engine as **immutable OOP** — `Game`, `Player`, and `Cell`
  classes in `engine.js`. Every action method returns a new instance; the
  receiver is never mutated. `useGame` now reduces over `Game` instance methods.
- Made the entire UI **bilingual** (繁體中文 / English) with Traditional Chinese
  as the default. All display text moved into `src/i18n/strings.js` and read
  via the `useI18n()` `t` table; a `LanguageToggle` button switches languages.
- Redesigned the layout and styling: dark themed panels, gradient title,
  board coordinate labels (A–H / 1–8), score progress bars, skill-slot
  labels, animated modals, and improved responsive behavior.
- Updated `README.md` and `AGENTS.md` to document the OOP engine and i18n layer.

### Added
- `src/i18n/strings.js` — parallel `tc` / `en` string tables.
- `src/i18n/LanguageContext.jsx` — `LanguageProvider` + `useI18n` hook
  (`{ lang, setLang, toggle, t }`).
- `src/components/LanguageToggle.jsx` — header language switch button.
- `PLAYER.NONE` constant for cleaner empty-cell ownership.

## [1.0.2] - 2026-09-28

### Changed
- Consolidated the release pipeline into a single `auto-merge.yml` workflow
  that uses the built-in `GITHUB_TOKEN` instead of a PAT. The workflow now
  cascades `dev-001 -> dev -> main`, builds, and deploys to Pages in one run.
- Removed the `GIT_PUSH_TOKEN` / fine-grained PAT dependency entirely.
- `dev` and `main` must remain unprotected for `GITHUB_TOKEN` pushes.

### Removed
- `deploy_reactjs_page.yml` — its deploy step is now part of `auto-merge.yml`.

## [1.0.1] - 2026-09-28

### Fixed
- `deploy_reactjs_page.yml`: removed incorrect `blog/` working directory and
  cache-dependency path; build now runs at repo root and uploads `./dist`.
- `auto-merge.yml`: added a fail-fast guard that errors clearly when the
  `GIT_PUSH_TOKEN` secret is empty/missing, instead of failing with a cryptic
  `could not read Username` git prompt during checkout.

### Changed
- `AGENTS.md`: replaced the (now-fixed) `blog/` deploy gotcha with a note on
  the `GIT_PUSH_TOKEN` secret requirement.

## [1.0.0] - 2026-09-28

### Added
- Rewrite of the legacy jQuery/SweetAlert app as a React + Vite single-page app.
- Pure, UI-agnostic game engine (`src/game/`) with immutable state transitions.
- `useGame` hook as the single React↔engine bridge (`useReducer` over engine functions).
- Components: `Chessboard`, `Sidebar`, `Modal`, and `App` layout.
- Global stylesheet with theme tokens and responsive layout.
- Vite config with `base: './'` (GitHub Pages subpath support) and
  `assetsInclude: ['**/*.PNG']` for the uppercase original artwork.
- `AGENTS.md` with repo-specific guidance for OpenCode sessions.
- Updated `README.md` with rules, dev/build commands, deploy steps, project
  structure, and unified coding standards.
- GitHub Actions workflows: `auto-merge.yml` (`dev-001 → dev → main` cascade)
  and `deploy_reactjs_page.yml` (Pages deploy).

### Removed
- Legacy `Index.html`, `myscript.js`, `mystyle.css`, `constant.module.js`,
  `model.module.js`.
- Vendored `libs/` (jQuery, SweetAlert2).
- Old `statics/` directory (artwork relocated to `src/assets/img/`).
- Backup archives (`*.zip`).
