/**
 * Automated Screenshot Generation for README
 *
 * This script captures screenshots of key application views for documentation.
 * Run with: npm run screenshots
 */

import { chromium, Browser, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.join(process.cwd(), 'docs', 'screenshots');

// Viewport configurations
const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  mobile: { width: 375, height: 667 },
};

// Helper to wait for database loading
async function waitForDatabaseReady(page: Page, timeout = 60000) {
  await page.waitForFunction(
    () => {
      const meteredWarning = document.querySelector('[data-testid="metered-warning"]');
      if (meteredWarning) return true;
      const loadingCard = document.querySelector('[data-testid="database-loading"]');
      return !loadingCard;
    },
    { timeout }
  );
}

// Helper to accept metered warning if present
async function acceptMeteredWarningIfPresent(page: Page) {
  const meteredWarning = page.locator('[data-testid="metered-warning"]');
  if (await meteredWarning.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.getByRole('button', { name: /download anyway/i }).click();
    await meteredWarning.waitFor({ state: 'hidden' });
  }
}

// Note: We use context.addInitScript() instead of helpers to set localStorage
// before page loads, preventing banner flash

// Helper to perform a sample query
async function performSampleFusionQuery(page: Page) {
  // Wait for periodic table to be visible
  await page.waitForSelector('[data-element="H"]', { timeout: 30000 });

  // Select H and Li
  await page.click('[data-element="H"]');
  await page.click('[data-element="Li"]');

  // Click "Run Query" button
  await page.getByRole('button', { name: /run query/i }).click();

  // Wait for results
  await page.waitForFunction(
    () => !document.querySelector('[data-testid="query-loading"]'),
    { timeout: 10000 }
  );

  // Wait a bit for any animations
  await page.waitForTimeout(500);
}

async function performSampleFissionQuery(page: Page) {
  await page.waitForSelector('[data-element="U"]', { timeout: 30000 });
  await page.click('[data-element="U"]');
  await page.getByRole('button', { name: /run query/i }).click();
  await page.waitForFunction(
    () => !document.querySelector('[data-testid="query-loading"]'),
    { timeout: 10000 }
  );
  await page.waitForTimeout(500);
}

async function performSampleTwoToTwoQuery(page: Page) {
  await page.waitForSelector('[data-element="H"]', { timeout: 30000 });
  await page.click('[data-element="H"]');
  await page.click('[data-element="Ni"]');
  await page.getByRole('button', { name: /run query/i }).click();
  await page.waitForFunction(
    () => !document.querySelector('[data-testid="query-loading"]'),
    { timeout: 10000 }
  );
  await page.waitForTimeout(500);
}

async function captureDesktopScreenshots(browser: Browser) {
  console.log('📸 Capturing desktop screenshots...');
  const context = await browser.newContext({ viewport: VIEWPORTS.desktop });

  // Set localStorage before page loads to prevent banner flash
  await context.addInitScript(() => {
    localStorage.setItem('lenr-analytics-consent', 'true');
    localStorage.setItem('theme', 'light');
  });

  const page = await context.newPage();

  // 1. Home Page (Light)
  console.log('  - Home page (light)');
  await page.goto(BASE_URL);
  await acceptMeteredWarningIfPresent(page);
  await waitForDatabaseReady(page);
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'desktop', 'home-light.png'),
    fullPage: false, // Viewport only for 16:9 aspect ratio
  });

  // 2. Home Page (Dark)
  console.log('  - Home page (dark)');
  await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  await page.reload();
  await waitForDatabaseReady(page);
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'desktop', 'home-dark.png'),
    fullPage: false, // Viewport only for 16:9 aspect ratio
  });

  // Switch back to light mode
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload();
  await waitForDatabaseReady(page);

  // 3. Fusion Query (interface only)
  console.log('  - Fusion query interface');
  await page.goto(`${BASE_URL}/fusion`);
  await waitForDatabaseReady(page);
  await page.waitForTimeout(2000); // Wait for components to fully render
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'desktop', 'fusion-query-light.png'),
    fullPage: false, // Viewport only for 16:9 aspect ratio
  });

  // 4. Show Element Data (Periodic Table)
  console.log('  - Element data page');
  await page.goto(`${BASE_URL}/element-data`);
  await waitForDatabaseReady(page);
  await page.waitForTimeout(2000); // Wait for components to fully render
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'desktop', 'element-data-light.png'),
    fullPage: false, // Viewport only for 16:9 aspect ratio
  });

  // 6. Dark Mode Query Example
  console.log('  - Query page in dark mode');
  await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  await page.goto(`${BASE_URL}/fusion`);
  await waitForDatabaseReady(page);
  await page.waitForTimeout(2000); // Wait for components to fully render
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'desktop', 'dark-mode-query.png'),
    fullPage: false, // Viewport only for 16:9 aspect ratio
  });

  await context.close();
}

async function captureDatabaseLoadingScreenshot(browser: Browser) {
  console.log('📸 Capturing database loading screenshot...');
  const context = await browser.newContext({ viewport: VIEWPORTS.desktop });

  // Set localStorage before page loads
  await context.addInitScript(() => {
    localStorage.setItem('lenr-analytics-consent', 'true');
    localStorage.setItem('theme', 'light');
  });

  const page = await context.newPage();

  // Throttle network to slow down database download (simulate slow connection)
  const client = await context.newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 500 * 1024, // 500 KB/s  (slow enough to capture)
    uploadThroughput: 500 * 1024,
    latency: 100,
  });

  // Navigate first to establish context
  await page.goto(BASE_URL, { waitUntil: 'load' });
  await page.waitForTimeout(1000); // Wait for browser APIs to be fully available

  // Clear cache to trigger database loading
  await page.context().clearCookies();
  await page.evaluate(async () => {
    const dbs = await window.indexedDB.databases();
    for (const db of dbs) {
      if (db.name) {
        window.indexedDB.deleteDatabase(db.name);
      }
    }
  });

  // Reload to trigger database loading
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(500); // Wait for page to start loading
  await acceptMeteredWarningIfPresent(page);

  // Wait for loading card to appear and show specific progress
  const loadingCard = page.locator('[data-testid="database-loading"]');
  await loadingCard.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

  // Wait for progress to reach ~25-50% (more reliable capture)
  await page.waitForFunction(
    () => {
      const progressText = document.querySelector('[data-testid="database-loading"]')?.textContent || '';
      // Look for percentage in the text
      const match = progressText.match(/(\d+)%/);
      if (match) {
        const percent = parseInt(match[1]);
        return percent >= 20 && percent <= 70; // Capture somewhere in middle
      }
      return false;
    },
    { timeout: 15000 }
  ).catch(() => console.log('  ⚠️  Could not capture specific progress, taking screenshot anyway'));

  await page.waitForTimeout(200); // Small delay for UI to stabilize

  // Capture screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'desktop', 'database-loading-light.png'),
    fullPage: false, // Viewport only for 16:9
  });

  await context.close();
}

async function captureMobileScreenshots(browser: Browser) {
  console.log('📸 Capturing mobile screenshots...');
  const context = await browser.newContext({ viewport: VIEWPORTS.mobile });

  // Set localStorage before page loads to prevent banner flash
  await context.addInitScript(() => {
    localStorage.setItem('lenr-analytics-consent', 'true');
    localStorage.setItem('theme', 'light');
  });

  const page = await context.newPage();

  // 1. Home Page Mobile
  console.log('  - Home page (mobile)');
  await page.goto(BASE_URL);
  await acceptMeteredWarningIfPresent(page);
  await waitForDatabaseReady(page);
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'mobile', 'home-light.png'),
    fullPage: false, // Viewport only for consistent sizing
  });

  // 2. Mobile Sidebar Open
  console.log('  - Mobile navigation (sidebar open)');
  const menuButton = page.getByRole('button', { name: /open menu/i });
  await menuButton.click();
  await page.waitForTimeout(300); // Wait for sidebar animation
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'mobile', 'sidebar-open-light.png'),
    fullPage: false, // Just capture viewport to show overlay
  });

  // Close sidebar
  const closeButton = page.getByRole('button', { name: /close menu/i });
  await closeButton.click();
  await page.waitForTimeout(300);

  // 3. Fusion Query Mobile (interface only)
  console.log('  - Fusion query interface (mobile)');
  await page.goto(`${BASE_URL}/fusion`);
  await waitForDatabaseReady(page);
  await page.waitForTimeout(2000); // Wait for components to fully render
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'mobile', 'fusion-query-light.png'),
    fullPage: false, // Viewport only for consistent sizing
  });

  // 4. Element Data Mobile
  console.log('  - Element data (mobile)');
  await page.goto(`${BASE_URL}/element-data`);
  await waitForDatabaseReady(page);
  await page.waitForTimeout(2000); // Wait for components to fully render

  // Click on Tungsten (W) element - find button with title containing "W (Z=74)"
  const tungstenButton = page.locator('button[title*="W (Z=74)"]');
  await tungstenButton.click();
  await page.waitForTimeout(500); // Wait for element details to load

  // Scroll down 200px to show more content
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(300); // Wait for scroll to complete

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'mobile', 'element-data-light.png'),
    fullPage: false, // Viewport only for consistent sizing
  });

  await context.close();
}

async function main() {
  console.log('🚀 Starting screenshot generation...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Screenshot directory: ${SCREENSHOT_DIR}\n`);

  // Ensure screenshot directories exist
  fs.mkdirSync(path.join(SCREENSHOT_DIR, 'desktop'), { recursive: true });
  fs.mkdirSync(path.join(SCREENSHOT_DIR, 'mobile'), { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    // Capture database loading first (requires fresh state)
    await captureDatabaseLoadingScreenshot(browser);

    // Then capture all other screenshots
    await captureDesktopScreenshots(browser);
    await captureMobileScreenshots(browser);

    console.log('\n✅ Screenshot generation complete!');
    console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}`);
  } catch (error) {
    console.error('\n❌ Error generating screenshots:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();