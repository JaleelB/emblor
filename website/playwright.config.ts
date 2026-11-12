import { defineConfig, devices } from '@playwright/test';

const browserChannel = process.env.PLAYWRIGHT_CHANNEL;
const chromiumOverride = browserChannel ? { channel: browserChannel } : {};
const productionServer = Boolean(process.env.CI) || process.env.PLAYWRIGHT_PRODUCTION === '1';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: process.env.CI ? 4 : 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  // Chromium uses native text rasterization; compare against the reviewed host platform.
  updateSnapshots: 'none',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{platform}/{arg}-{projectName}{ext}',
  use: {
    baseURL: 'http://127.0.0.1:4500',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', testIgnore: /visual\.spec\.ts/, use: { ...devices['Desktop Chrome'], ...chromiumOverride } },
    { name: 'mobile', testIgnore: /visual\.spec\.ts/, use: { ...devices['Pixel 5'], ...chromiumOverride } },
    { name: 'firefox', testIgnore: /visual\.spec\.ts/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testIgnore: /visual\.spec\.ts/, use: { ...devices['Desktop Safari'] } },
    {
      name: 'visual-desktop',
      testMatch: /visual\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], ...chromiumOverride },
    },
    {
      name: 'visual-mobile',
      testMatch: /visual\.spec\.ts/,
      use: { ...devices['Pixel 5'], ...chromiumOverride },
    },
  ],
  webServer: {
    command: productionServer ? 'pnpm run start --hostname 127.0.0.1 --port 4500' : 'pnpm run dev',
    url: 'http://127.0.0.1:4500',
    reuseExistingServer: !productionServer,
    timeout: 120_000,
  },
});
