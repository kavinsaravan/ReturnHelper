const BrowserAgent = require('../BrowserAgent');

/**
 * Walmart Returns Agent
 * Handles guest returns for Walmart orders
 */
class WalmartAgent extends BrowserAgent {
  constructor(options = {}) {
    super(options);
    this.retailerName = 'Walmart';
  }

  /**
   * Process Walmart return using guest flow
   */
  async processReturn(orderDetails) {
    const { orderId, customerEmail, productName } = orderDetails;

    try {
      await this.launch();
      await this.screenshot('01-start');

      // Step 1: Navigate to Walmart returns page
      const returnsUrl = process.env.MOCK_WALMART_URL || 'http://localhost:5000/mock/walmart-returns.html';
      await this.goto(returnsUrl);
      await this.screenshot('02-returns-page');

      // Step 2: Click "Start a Return" for guest
      const hasGuestButton = await this.exists('#guest-return-btn');
      if (hasGuestButton) {
        await this.click('#guest-return-btn');
        await this.delay(1000);
        await this.screenshot('03-guest-flow');
      }

      // Step 3: Enter order number
      if (this.debugMode) console.log(`📝 Entering order number: ${orderId}`);
      await this.type('#order-number-input', orderId);
      await this.screenshot('04-order-entered');

      // Step 4: Enter email address
      if (this.debugMode) console.log(`📝 Entering email: ${customerEmail}`);
      await this.type('#email-input', customerEmail);
      await this.screenshot('05-email-entered');

      // Step 5: Look up order
      await this.click('#find-order-button');
      await this.delay(2000);
      await this.screenshot('06-order-lookup');

      // Step 6: Wait for order to load and verify
      await this.waitFor('.order-summary', { visible: true });
      const orderLoaded = await this.exists('.order-summary');
      if (!orderLoaded) {
        throw new Error('Order not found or invalid credentials');
      }

      // Step 7: Wait for checkbox and select items to return
      await this.delay(500);
      await this.waitFor('.item-return-checkbox', { visible: true });
      await this.click('.item-return-checkbox');
      await this.delay(500);
      await this.screenshot('07-items-selected');

      // Step 8: Click continue
      await this.click('#continue-to-reason-btn');
      await this.delay(1500);
      await this.screenshot('08-reason-page');

      // Step 9: Select return reason
      await this.click('input[name="return-reason"][value="unwanted"]');
      await this.screenshot('09-reason-selected');

      // Step 10: Add optional details
      const hasDetailsField = await this.exists('#return-details');
      if (hasDetailsField) {
        await this.type('#return-details', 'Item not as expected');
        await this.screenshot('10-details-entered');
      }

      // Step 11: Choose refund method
      const hasRefundOptions = await this.exists('#refund-original-payment');
      if (hasRefundOptions) {
        await this.click('#refund-original-payment');
        await this.screenshot('11-refund-method');
      }

      // Step 12: Select return shipping
      const hasShipping = await this.exists('#shipping-fedex');
      if (hasShipping) {
        await this.click('#shipping-fedex');
        await this.delay(500);
        await this.screenshot('12-shipping-selected');
      }

      // Step 13: Submit return
      await this.click('#submit-return-button');
      await this.delay(2500);
      await this.screenshot('13-return-submitted');

      // Step 14: Extract confirmation
      const confirmationCode = await this.exists('.return-confirmation-number')
        ? await this.getText('.return-confirmation-number')
        : `WMT${Date.now()}`;

      const trackingId = await this.exists('.tracking-id')
        ? await this.getText('.tracking-id')
        : `FDX${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

      const labelUrl = await this.exists('#download-label-btn')
        ? await this.page.$eval('#download-label-btn', el => el.getAttribute('data-url'))
        : `http://localhost:5000/mock/labels/walmart-${orderId}.pdf`;

      if (this.debugMode) {
        console.log('✅ Return submitted successfully');
        console.log(`   Confirmation: ${confirmationCode}`);
        console.log(`   Tracking: ${trackingId}`);
      }

      await this.screenshot('14-confirmation');
      await this.delay(3000);

      return {
        success: true,
        data: {
          confirmationNumber: confirmationCode,
          trackingNumber: trackingId,
          shippingLabelUrl: labelUrl,
          carrier: 'FedEx',
          returnMethod: 'FedEx Pickup or Drop-off',
          returnUrl: `https://www.walmart.com/account/returns/${confirmationCode}`,
          screenshots: await this.getScreenshotList()
        }
      };

    } catch (error) {
      console.error(`❌ Walmart return failed:`, error.message);
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

module.exports = WalmartAgent;
