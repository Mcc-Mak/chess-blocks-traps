# Changelog

All notable changes to this project are documented in this file.
Versions follow [Semantic Versioning](https://semver.org/) `MAJOR.MINOR.PATCH`.

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
