import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/index.ts'],
  banner: {
    js: '"use client";'
  },
  format: ['cjs', 'esm'],
  outDir: 'dist',
  dts: true,
  clean: true
})
