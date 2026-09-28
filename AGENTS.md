# AGENTS.md

Compact guidance for OpenCode sessions working in this repo.

## Change workflow (required)

- **Every change must update `CHANGELOG.md`** using semantic version `X.X.X`, then be committed via git. No change is "too small" to skip this.
- `CHANGELOG.md` does not exist yet — create it on first change (start at `1.0.0` to match `package.json`).
- Git-control flow: commit (with a good, standardized, well-formatted subject and body) → push to `dev-001` only → this triggers the auto-merge pipeline `dev-001 → dev → main → GitHub Pages deploy`.
- Never push directly to `dev` or `main`; the pipeline owns those transitions.

## Branch & deploy flow

The repo has a single release pipeline driven by GitHub Actions — do not replicate it manually:

```
push to dev-001  -->  auto-merge.yml:  dev-001 -> dev -> main  ->  build -> deploy to Pages
```

- Pushing to `dev-001` triggers `auto-merge.yml`, which merges `dev-001` into `dev`, then `dev` into `main`, then builds and deploys `main` to GitHub Pages — all in one workflow.
- The pipeline uses the built-in `GITHUB_TOKEN` (no PAT / `GIT_PUSH_TOKEN` secret needed). Pushes made with `GITHUB_TOKEN` do not trigger other workflows, which is fine because the whole cascade lives in one file.
- `dev` and `main` must remain **unprotected** (no branch protection rules) so the `GITHUB_TOKEN` can push to them. If a protection rule is added, the merge steps will fail with 403.
- Do not reintroduce a separate `deploy_reactjs_page.yml`; the deploy step is already part of `auto-merge.yml`.

## Commands

Only three npm scripts exist — there is **no `test`, `lint`, or `typecheck`** script. Verification = a clean build.

```bash
npm install
npm run dev        # Vite dev server
npm run build      # production build into ./dist  <- the verification step
npm run preview    # serve the built ./dist locally
```

## Vite config quirks

- `base: './'` emits relative asset URLs so the build works under any GitHub Pages subpath. Do not change to `/`.
- `assetsInclude: ['**/*.PNG']` is required because the original artwork uses **uppercase** `.PNG` extensions, which Vite does not treat as assets by default. Keep image imports going through `src/game/constants.js` (`IMAGES` map + helpers), never by raw path.

## Architecture

- `src/game/` (`constants.js`, `engine.js`) is **pure and UI-agnostic**: no DOM access, no React imports, no mutation — every action returns a new state. Do not introduce side effects or React coupling here.
- `src/hooks/useGame.js` is the **only** bridge between React and the engine (a `useReducer` over pure engine functions). UI state (e.g. modal visibility) stays as local `useState` in components, not in the game reducer.
- Components in `src/components/` are stateless recipients of the `game` object; they dispatch via handlers, never mutate.

## Style

Detailed coding standards (naming, formatting, per-layer rules) live in `README.md` under "Coding standards". Follow those; this file only captures what isn't obvious from the code.
