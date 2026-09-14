import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Note: Astro's `astro/container` + `getViteConfig` combination for rendering .astro
// components inside Vitest was tried here and hits an unresolvable low-level crash in
// this toolchain (Astro 5 / Vitest 2's worker pool re-invoking Vite server creation
// inside vite-node). Rather than fight an experimental API, .astro components/pages are
// verified by `npm run build` succeeding plus a grep-based structural check against the
// real, compiled `dist/**/*.html` output (see each task's verification step) — arguably a
// more faithful check than a unit-rendered fragment, since it's exactly what ships. This
// config covers everything with real logic: schemas, utils, the API route, and the three
// React islands.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
});
