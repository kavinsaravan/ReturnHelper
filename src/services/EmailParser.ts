import {OrderDetails} from '../types/ReturnRequest';

/**
 * EmailParser extracts order information from confirmation emails
 * This is a simplified implementation - in production, you'd want to:
 * 1. Use AI/ML models to parse various email formats
 * 2. Support multiple retailers with different email templates
 * 3. Handle edge cases and validation
 */
export class EmailParser {
  /**
   * Parse email content to extract order details
   */
  async parseEmail(emailContent: string): Promise<OrderDetails | null> {
    if (!emailContent || emailContent.trim().length === 0) {
      return null;
    }

    try {
      // Try to detect retailer from email content
      const retailer = this.detectRetailer(emailContent);

      // Extract order ID using common patterns
      const orderId = this.extractOrderId(emailContent);

      if (!orderId || !retailer) {
        return null;
      }

      // Extract other details
      const productName = this.extractProductName(emailContent);
      const amount = this.extractAmount(emailContent);
      const customerEmail = this.extractEmail(emailContent);
      const orderUrl = this.extractOrderUrl(emailContent);

      return {
        orderId,
        retailer,
        productName,
        amount,
        customerEmail,
        orderUrl,
        purchaseDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error parsing email:', error);
      return null;
    }
  }

  /**
   * Detect retailer from email content
   */
  private detectRetailer(content: string): string {
    const lowerContent = content.toLowerCase();

    const retailers = [
      {name: 'Amazon', patterns: ['amazon', 'amazon.com', 'amzn']},
      {name: 'Target', patterns: ['target', 'target.com']},
      {name: 'Walmart', patterns: ['walmart', 'walmart.com']},
      {name: 'Best Buy', patterns: ['best buy', 'bestbuy']},
      {name: 'Apple', patterns: ['apple', 'apple.com', 'apple store']},
      {name: 'Nike', patterns: ['nike', 'nike.com']},
      {name: 'Adidas', patterns: ['adidas', 'adidas.com']},
      {name: 'Zara', patterns: ['zara', 'zara.com']},
      {name: 'H&M', patterns: ['h&m', 'hm.com']},
      {name: 'ASOS', patterns: ['asos', 'asos.com']},
    ];

    for (const retailer of retailers) {
      for (const pattern of retailer.patterns) {
        if (lowerContent.includes(pattern)) {
          return retailer.name;
        }
      }
    }

    return 'Unknown Retailer';
  }

  /**
   * Extract order ID using common patterns
   */
  private extractOrderId(content: string): string | null {
    const patterns = [
      /order\s*#?\s*:?\s*([A-Z0-9-]+)/i,
      /order\s*number\s*:?\s*([A-Z0-9-]+)/i,
      /order\s*id\s*:?\s*([A-Z0-9-]+)/i,
      /confirmation\s*#?\s*:?\s*([A-Z0-9-]+)/i,
      /#([A-Z0-9]{10,})/,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  /**
   * Extract product name from email
   */
  private extractProductName(content: string): string | undefined {
    // This is simplified - in production, use more sophisticated parsing
    const patterns = [
      /product\s*:?\s*(.+?)(?:\n|$)/i,
      /item\s*:?\s*(.+?)(?:\n|$)/i,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return undefined;
  }

  /**
   * Extract total amount from email
   */
  private extractAmount(content: string): number | undefined {
    const patterns = [
      /total\s*:?\s*\$?([\d,]+\.?\d*)/i,
      /amount\s*:?\s*\$?([\d,]+\.?\d*)/i,
      /\$\s*([\d,]+\.?\d{2})/,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(amount)) {
          return amount;
        }
      }
    }

    return undefined;
  }

  /**
   * Extract email address from content
   */
  private extractEmail(content: string): string | undefined {
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const match = content.match(emailPattern);
    return match ? match[1] : undefined;
  }

  /**
   * Extract order URL from email
   */
  private extractOrderUrl(content: string): string | undefined {
    const urlPattern = /(https?:\/\/[^\s]+order[^\s]*)/i;
    const match = content.match(urlPattern);
    return match ? match[1] : undefined;
  }
}
