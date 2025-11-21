import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'fn/index': 'src/fn/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Enable minification for production builds
  // Set to true or 'terser' for release builds
  minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
  minifyIdentifiers: process.env.NODE_ENV === 'production',
  minifySyntax: process.env.NODE_ENV === 'production',
  minifyWhitespace: process.env.NODE_ENV === 'production',
});