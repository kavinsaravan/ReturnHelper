/**
 * Email Parser Service
 * Extracts order information from confirmation emails
 */

class EmailParserService {
  static async parseEmail(emailContent) {
    if (!emailContent || emailContent.trim().length === 0) {
      return null;
    }

    try {
      // Detect retailer
      const retailer = this.detectRetailer(emailContent);

      // Extract order ID
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
        rawEmailContent: emailContent
      };
    } catch (error) {
      console.error('Error parsing email:', error);
      return null;
    }
  }

  static detectRetailer(content) {
    const lowerContent = content.toLowerCase();

    const retailers = [
      { name: 'Amazon', patterns: ['amazon', 'amazon.com', 'amzn'] },
      { name: 'Target', patterns: ['target', 'target.com'] },
      { name: 'Walmart', patterns: ['walmart', 'walmart.com'] },
      { name: 'Best Buy', patterns: ['best buy', 'bestbuy'] },
      { name: 'Apple', patterns: ['apple', 'apple.com', 'apple store'] },
      { name: 'Nike', patterns: ['nike', 'nike.com'] },
      { name: 'Adidas', patterns: ['adidas', 'adidas.com'] },
      { name: 'Zara', patterns: ['zara', 'zara.com'] },
      { name: 'H&M', patterns: ['h&m', 'hm.com'] },
      { name: 'ASOS', patterns: ['asos', 'asos.com'] },
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

  static extractOrderId(content) {
    // "Confirmation #…" before any generic "order …" match so
    // "Order Confirmation #12345" yields 12345, not "Confirmation".
    const patterns = [
      /confirmation\s*#?\s*:?\s*([A-Z0-9-]+)/i,
      /order\s*number\s*:?\s*([A-Z0-9-]+)/i,
      /order\s*id\s*:?\s*([A-Z0-9-]+)/i,
      /order[^\n]{0,160}#\s*([A-Z0-9-]+)/i,
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

  static extractProductName(content) {
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

  static extractAmount(content) {
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

  static extractEmail(content) {
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const match = content.match(emailPattern);
    return match ? match[1] : undefined;
  }

  static extractOrderUrl(content) {
    const urlPattern = /(https?:\/\/[^\s]+order[^\s]*)/i;
    const match = content.match(urlPattern);
    return match ? match[1] : undefined;
  }
}

module.exports = EmailParserService;
