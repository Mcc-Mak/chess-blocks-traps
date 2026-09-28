# AGENTS.md

Compact guidance for OpenCode sessions working in this repo.

## Change workflow (required)

- **Every change must update `CHANGELOG.md`** using semantic version `X.X.X`, then be committed via git. No change is "too small" to skip this.
- `CHANGELOG.md` does not exist yet — create it on first change (start at `1.0.0` to match `package.json`).
- Git-control flow: commit (with a good, standardized, well-formatted subject and body) → push to `dev-001` only → this triggers the auto-merge pipeline `dev-001 → dev → main → GitHub Pages deploy`.
- Never push directly to `dev` or `main`; the pipeline owns those transitions.

## Branch & deploy flow

The repo has an auto-merge cascade driven by GitHub Actions — do not replicate it manually:

```
dev-001  --(push)-->  auto-merge  -->  dev  --(auto-merge)-->  main  --(Pages deploy)
```

- Pushing to `dev-001` triggers `auto-merge.yml` → merges into `dev` → which triggers merge into `main` → which triggers `deploy_reactjs_page.yml`.
- Auto-merge requires the `GIT_PUSH_TOKEN` repo secret (a fine-grained PAT with Contents: read+write) and main-branch protection bypass (see comments in `.github/workflows/auto-merge.yml`). If merges stall with `could not read Username for 'https://github.com'`, the secret is empty/missing/expired — set it under Settings → Secrets and variables → Actions. `GITHUB_TOKEN` cannot substitute: pushes made with it do not trigger the next workflow in the cascade.
- `deploy_reactjs_page.yml` builds the app at repo root (`npm run build` → `./dist`) and deploys to Pages. Keep the working directory and `path` pointing at root, not a subdirectory.

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
