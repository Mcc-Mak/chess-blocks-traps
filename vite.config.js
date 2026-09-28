import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` emits relative asset URLs so the build works under any
// GitHub Pages subpath (e.g. https://<user>.github.io/<repo>/).
export default defineConfig({
  plugins: [react()],
  base: './',
  // Original artwork uses UPPERCASE .PNG extensions, which Vite does not
  // treat as assets by default.
  assetsInclude: ['**/*.PNG'],
});
