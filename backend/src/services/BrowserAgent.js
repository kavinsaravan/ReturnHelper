const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Base Browser Agent
 * Generic framework for automating retailer return processes
 */
class BrowserAgent {
  constructor(options = {}) {
    this.browser = null;
    this.page = null;
    this.headless = options.headless ?? false; // Default to headed mode
    this.slowMo = options.slowMo ?? 100; // Slow down by 100ms for visibility
    this.screenshotDir = options.screenshotDir ?? path.join(__dirname, '../../screenshots');
    this.debugMode = options.debugMode ?? true;
  }

  /**
   * Initialize browser and page
   */
  async launch() {
    if (this.debugMode) console.log('🚀 Launching browser...');

    this.browser = await puppeteer.launch({
      headless: this.headless,
      slowMo: this.slowMo,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1280,800'
      ],
      defaultViewport: {
        width: 1280,
        height: 800
      }
    });

    this.page = await this.browser.newPage();

    // Set a realistic user agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    if (this.debugMode) console.log('✅ Browser launched successfully');
  }

  /**
   * Navigate to URL with error handling
   */
  async goto(url, options = {}) {
    if (this.debugMode) console.log(`🌐 Navigating to: ${url}`);

    try {
      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
        ...options
      });

      if (this.debugMode) console.log(`✅ Loaded: ${url}`);
    } catch (error) {
      console.error(`❌ Failed to navigate to ${url}:`, error.message);
      await this.screenshot('navigation-error');
      throw error;
    }
  }

  /**
   * Take a screenshot for debugging
   */
  async screenshot(name) {
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}-${timestamp}.png`;
      const filepath = path.join(this.screenshotDir, filename);

      await this.page.screenshot({ path: filepath, fullPage: true });

      if (this.debugMode) console.log(`📸 Screenshot saved: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error('Failed to take screenshot:', error.message);
    }
  }

  /**
   * Type text with human-like delays
   */
  async type(selector, text, options = {}) {
    if (this.debugMode) console.log(`⌨️  Typing into: ${selector}`);

    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.click(selector);
    await this.page.type(selector, text, { delay: 50, ...options });
  }

  /**
   * Click element with wait
   */
  async click(selector, options = {}) {
    if (this.debugMode) console.log(`👆 Clicking: ${selector}`);

    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.click(selector, options);
    await this.delay(500); // Small delay after click
  }

  /**
   * Select dropdown option
   */
  async select(selector, value) {
    if (this.debugMode) console.log(`📋 Selecting "${value}" in: ${selector}`);

    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.select(selector, value);
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(options = {}) {
    if (this.debugMode) console.log('⏳ Waiting for navigation...');

    await this.page.waitForNavigation({
      waitUntil: 'networkidle2',
      timeout: 30000,
      ...options
    });
  }

  /**
   * Wait for selector
   */
  async waitFor(selector, options = {}) {
    if (this.debugMode) console.log(`⏳ Waiting for: ${selector}`);

    await this.page.waitForSelector(selector, {
      timeout: 10000,
      ...options
    });
  }

  /**
   * Check if element exists
   */
  async exists(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get text content of element
   */
  async getText(selector) {
    await this.page.waitForSelector(selector, { timeout: 10000 });
    return await this.page.$eval(selector, el => el.textContent.trim());
  }

  /**
   * Download file from page
   */
  async downloadFile(url, filename) {
    if (this.debugMode) console.log(`⬇️  Downloading: ${filename}`);

    const response = await this.page.goto(url);
    const buffer = await response.buffer();

    const downloadDir = path.join(__dirname, '../../downloads');
    await fs.mkdir(downloadDir, { recursive: true });

    const filepath = path.join(downloadDir, filename);
    await fs.writeFile(filepath, buffer);

    if (this.debugMode) console.log(`✅ Downloaded: ${filepath}`);
    return filepath;
  }

  /**
   * Delay helper
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Close browser
   */
  async close() {
    if (this.debugMode) console.log('🔒 Closing browser...');

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  /**
   * Generic return process - to be overridden by retailer-specific agents
   */
  async processReturn(orderDetails) {
    throw new Error('processReturn() must be implemented by retailer-specific agent');
  }
}

module.exports = BrowserAgent;
