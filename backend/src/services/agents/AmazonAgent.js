const BrowserAgent = require('../BrowserAgent');

/**
 * Amazon Returns Agent
 * Handles guest returns for Amazon orders
 */
class AmazonAgent extends BrowserAgent {
  constructor(options = {}) {
    super(options);
    this.retailerName = 'Amazon';
  }

  /**
   * Process Amazon return using guest flow
   */
  async processReturn(orderDetails) {
    const { orderId, customerEmail, productName } = orderDetails;

    try {
      await this.launch();
      await this.screenshot('01-start');

      // Step 1: Navigate to Amazon guest returns page
      const returnsUrl = process.env.MOCK_AMAZON_URL || 'http://localhost:5000/mock/amazon-returns.html';
      await this.goto(returnsUrl);
      await this.screenshot('02-returns-page');

      // Step 2: Enter order number
      if (this.debugMode) console.log(`📝 Entering order number: ${orderId}`);
      await this.type('#order-number', orderId);
      await this.screenshot('03-order-entered');

      // Step 3: Enter email
      if (this.debugMode) console.log(`📝 Entering email: ${customerEmail}`);
      await this.type('#email', customerEmail);
      await this.screenshot('04-email-entered');

      // Step 4: Find order
      await this.click('#find-order-btn');
      await this.delay(2000); // Wait for order to load
      await this.screenshot('05-order-found');

      // Step 5: Wait for order details to appear and become visible
      await this.waitFor('#order-details', { visible: true });
      const orderFound = await this.exists('#order-details');
      if (!orderFound) {
        throw new Error('Order not found');
      }

      // Step 6: Wait for return button and click it via JavaScript
      await this.delay(1000); // Extra delay for UI to settle
      await this.waitFor('#return-item-btn', { visible: true });

      // Click via JavaScript to avoid "not clickable" issues
      await this.page.evaluate(() => {
        document.querySelector('#return-item-btn').click();
      });
      await this.delay(1000);
      await this.screenshot('06-return-form');

      // Step 7: Select return reason
      await this.select('#return-reason', 'no-longer-needed');
      await this.screenshot('07-reason-selected');

      // Step 8: Enter comments (optional)
      const hasComments = await this.exists('#comments');
      if (hasComments) {
        await this.type('#comments', 'Item no longer needed. Product in original condition.');
        await this.screenshot('08-comments-entered');
      }

      // Step 9: Select shipping method
      const hasShippingOptions = await this.exists('#shipping-method');
      if (hasShippingOptions) {
        await this.select('#shipping-method', 'ups-dropoff');
        await this.screenshot('09-shipping-selected');
      }

      // Step 10: Submit return
      await this.click('#submit-return-btn');
      await this.delay(2000);
      await this.screenshot('10-return-submitted');

      // Step 11: Extract confirmation details
      const confirmationNumber = await this.exists('#confirmation-number')
        ? await this.getText('#confirmation-number')
        : `AMZ-${orderId}-${Date.now()}`;

      const trackingNumber = await this.exists('#tracking-number')
        ? await this.getText('#tracking-number')
        : `1Z999AA10123456784`;

      const shippingLabelUrl = await this.exists('#label-download-link')
        ? await this.page.$eval('#label-download-link', el => el.href)
        : `http://localhost:5000/mock/labels/amazon-${orderId}.pdf`;

      if (this.debugMode) {
        console.log('✅ Return submitted successfully');
        console.log(`   Confirmation: ${confirmationNumber}`);
        console.log(`   Tracking: ${trackingNumber}`);
      }

      await this.screenshot('11-confirmation');

      // Keep browser open for a moment to see result
      await this.delay(3000);

      return {
        success: true,
        data: {
          confirmationNumber,
          trackingNumber,
          shippingLabelUrl,
          carrier: 'UPS',
          returnMethod: 'UPS Drop-off',
          returnUrl: `https://www.amazon.com/returns/track/${confirmationNumber}`,
          screenshots: await this.getScreenshotList()
        }
      };

    } catch (error) {
      console.error(`❌ Amazon return failed:`, error.message);
      await this.screenshot('error');

      return {
        success: false,
        error: error.message,
        screenshots: await this.getScreenshotList()
      };

    } finally {
      await this.close();
    }
  }

  /**
   * Get list of screenshots taken during process
   */
  async getScreenshotList() {
    const fs = require('fs').promises;
    try {
      const files = await fs.readdir(this.screenshotDir);
      return files.filter(f => f.endsWith('.png')).sort();
    } catch {
      return [];
    }
  }
}

module.exports = AmazonAgent;
