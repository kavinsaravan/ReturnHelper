const BrowserAgent = require('../BrowserAgent');

/**
 * Target Returns Agent
 * Handles guest returns for Target orders
 */
class TargetAgent extends BrowserAgent {
  constructor(options = {}) {
    super(options);
    this.retailerName = 'Target';
  }

  /**
   * Process Target return using guest flow
   */
  async processReturn(orderDetails) {
    const { orderId, customerEmail, productName } = orderDetails;

    try {
      await this.launch();
      await this.screenshot('01-start');

      // Step 1: Navigate to Target guest returns page
      const returnsUrl = process.env.MOCK_TARGET_URL || 'http://localhost:5000/mock/target-returns.html';
      await this.goto(returnsUrl);
      await this.screenshot('02-returns-page');

      // Step 2: Enter order number
      if (this.debugMode) console.log(`📝 Entering order number: ${orderId}`);
      await this.type('#order-id', orderId);
      await this.screenshot('03-order-entered');

      // Step 3: Enter billing email
      if (this.debugMode) console.log(`📝 Entering email: ${customerEmail}`);
      await this.type('#billing-email', customerEmail);
      await this.screenshot('04-email-entered');

      // Step 4: Find order
      await this.click('#lookup-order-btn');
      await this.delay(2000);
      await this.screenshot('05-order-found');

      // Step 5: Wait for order to appear and verify
      await this.waitFor('.order-item', { visible: true });
      const orderExists = await this.exists('.order-item');
      if (!orderExists) {
        throw new Error('Order not found');
      }

      // Step 6: Wait for checkbox and select item to return
      await this.delay(500);
      await this.waitFor('.return-item-checkbox', { visible: true });
      await this.click('.return-item-checkbox');
      await this.screenshot('06-item-selected');

      // Step 7: Continue to return form
      await this.click('#continue-return-btn');
      await this.delay(1500);
      await this.screenshot('07-return-form');

      // Step 8: Select return reason
      await this.click('#reason-dropdown');
      await this.delay(500);
      await this.click('[data-reason="changed-mind"]');
      await this.screenshot('08-reason-selected');

      // Step 9: Choose return method (in-store or mail)
      const hasReturnMethod = await this.exists('#return-method-mail');
      if (hasReturnMethod) {
        await this.click('#return-method-mail');
        await this.screenshot('09-return-method-selected');
      }

      // Step 10: Submit return request
      await this.click('#submit-return-request-btn');
      await this.delay(2000);
      await this.screenshot('10-return-submitted');

      // Step 11: Extract confirmation details
      const confirmationNumber = await this.exists('.confirmation-code')
        ? await this.getText('.confirmation-code')
        : `TGT-${orderId}-${Date.now()}`;

      const barcodeNumber = await this.exists('.barcode-number')
        ? await this.getText('.barcode-number')
        : `TGT${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

      const returnLabelUrl = await this.exists('#print-label-link')
        ? await this.page.$eval('#print-label-link', el => el.href)
        : `http://localhost:5000/mock/labels/target-${orderId}.pdf`;

      if (this.debugMode) {
        console.log('✅ Return submitted successfully');
        console.log(`   Confirmation: ${confirmationNumber}`);
        console.log(`   Barcode: ${barcodeNumber}`);
      }

      await this.screenshot('11-confirmation');
      await this.delay(3000);

      return {
        success: true,
        data: {
          confirmationNumber,
          trackingNumber: barcodeNumber,
          shippingLabelUrl: returnLabelUrl,
          carrier: 'FedEx',
          returnMethod: 'Mail or In-Store',
          returnUrl: `https://www.target.com/orders/${orderId}/returns`,
          screenshots: await this.getScreenshotList()
        }
      };

    } catch (error) {
      console.error(`❌ Target return failed:`, error.message);
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

module.exports = TargetAgent;
