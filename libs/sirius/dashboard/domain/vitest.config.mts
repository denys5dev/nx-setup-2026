import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/sirius/dashboard/domain',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'sirius-dashboard-domain',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/sirius/dashboard/domain',
      provider: 'v8' as const,
    },
  },
}));
