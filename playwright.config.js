const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list']],
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      pathTemplate: '{testDir}/{testFilePath}-snapshots/{projectName}/{arg}{ext}',
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:8080',
    locale: 'en-US',
    viewport: {
      width: 360,
      height: 900,
    },
    deviceScaleFactor: 1,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: 360,
          height: 900,
        },
        deviceScaleFactor: 1,
      },
    },
  ],
});
