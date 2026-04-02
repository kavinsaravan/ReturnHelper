# Browser Automation Agent - Implementation Guide

## Overview

The ReturnsRunner agent uses **Puppeteer** to automate the entire return process across multiple retailers. This document explains the architecture, how to use it, and how to extend it.

---

## Architecture

### 1. **Base Agent Class** (`BrowserAgent.js`)

Generic framework providing common automation utilities:
- Browser launching and management
- Navigation and page interaction
- Form filling (type, click, select)
- Screenshot capture for debugging
- Error handling and retry logic

### 2. **Retailer-Specific Agents**

Each retailer has a dedicated agent extending `BrowserAgent`:
- `AmazonAgent.js` - Amazon returns
- `TargetAgent.js` - Target returns
- `WalmartAgent.js` - Walmart returns

### 3. **Web Automation Service**

Orchestrates agent selection and execution based on retailer.

### 4. **Mock Retailer Pages**

HTML pages simulating real retailer return portals for testing:
- `/mock/amazon-returns.html`
- `/mock/target-returns.html`
- `/mock/walmart-returns.html`

---

## How It Works

### Flow Diagram

```
User pastes order email
       ↓
Email parsed (orderId, retailer, email, etc.)
       ↓
WebAutomationService selects agent
       ↓
Agent launches browser (headed mode)
       ↓
Agent navigates to return portal
       ↓
Agent fills forms automatically
       ↓
Agent submits return request
       ↓
Agent captures confirmation & tracking
       ↓
Agent takes screenshots & closes
       ↓
Results returned to user
```

### Guest Returns (No Login)

All agents use **guest return flows** - no authentication required. Users only need:
- Order number
- Billing email address

This approach:
- ✅ Avoids storing sensitive credentials
- ✅ Works for all online purchases
- ✅ Simpler and more secure

---

## Configuration

### Environment Variables (`.env`)

```bash
# Browser mode
HEADLESS_BROWSER=false  # Set to true for production
DEBUG_MODE=true         # Enables verbose logging
BROWSER_SLOW_MO=100     # Delay in ms between actions

# Mock page URLs (for testing)
MOCK_AMAZON_URL=http://localhost:5000/mock/amazon-returns.html
MOCK_TARGET_URL=http://localhost:5000/mock/target-returns.html
MOCK_WALMART_URL=http://localhost:5000/mock/walmart-returns.html
```

### Headed vs Headless Mode

**Headed (Development)**
- Browser window visible
- Watch automation in real-time
- Easier debugging
- Set `HEADLESS_BROWSER=false`

**Headless (Production)**
- Faster execution
- Lower resource usage
- Background processing
- Set `HEADLESS_BROWSER=true`

---

## Testing

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000`

### 2. Start the Web App

```bash
npm install
npm start
```

App runs on `http://localhost:3000`

### 3. Use Sample Emails

See `sample-emails.md` for copy-paste test emails.

### 4. Watch the Automation

- Browser window opens automatically
- Agent navigates through return flow
- Screenshots saved in `backend/screenshots/`
- Console shows detailed logs

---

## Extending to New Retailers

### Step 1: Create Retailer Agent

```javascript
// backend/src/services/agents/NewRetailerAgent.js
const BrowserAgent = require('../BrowserAgent');

class NewRetailerAgent extends BrowserAgent {
  constructor(options = {}) {
    super(options);
    this.retailerName = 'NewRetailer';
  }

  async processReturn(orderDetails) {
    const { orderId, customerEmail } = orderDetails;

    try {
      await this.launch();
      await this.goto('https://newretailer.com/returns');

      // Your automation steps here
      await this.type('#order-id', orderId);
      await this.type('#email', customerEmail);
      await this.click('#submit');

      // Extract results
      const confirmationNumber = await this.getText('.confirmation');

      return {
        success: true,
        data: {
          confirmationNumber,
          // ... other data
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    } finally {
      await this.close();
    }
  }
}

module.exports = NewRetailerAgent;
```

### Step 2: Register in WebAutomationService

```javascript
// backend/src/services/WebAutomationService.js
const NewRetailerAgent = require('./agents/NewRetailerAgent');

// In getRetailerAgent():
const agents = {
  'Amazon': new AmazonAgent(agentOptions),
  'Target': new TargetAgent(agentOptions),
  'Walmart': new WalmartAgent(agentOptions),
  'NewRetailer': new NewRetailerAgent(agentOptions),  // Add here
};
```

### Step 3: Add to Email Parser

```javascript
// backend/src/services/EmailParserService.js
const retailers = [
  // ... existing retailers
  { name: 'NewRetailer', patterns: ['newretailer', 'newretailer.com'] },
];
```

---

## Debugging

### Enable Debug Logs

Set `DEBUG_MODE=true` in `.env` to see:
- Navigation events
- Form interactions
- Element selections
- Error details

### Screenshot Capture

Screenshots automatically saved at:
- `backend/screenshots/01-start.png`
- `backend/screenshots/02-returns-page.png`
- `backend/screenshots/03-order-entered.png`
- ... and so on

### Common Issues

**"Element not found"**
- Increase timeout in `waitForSelector`
- Check selector is correct
- Verify page loaded completely

**"Navigation timeout"**
- Increase navigation timeout
- Check network connectivity
- Verify mock page URL is correct

**Browser doesn't close**
- Check for unhandled errors
- Ensure `finally` block calls `close()`

---

## Available Helper Methods

### Navigation
- `goto(url)` - Navigate to URL
- `waitForNavigation()` - Wait for page load

### Form Interaction
- `type(selector, text)` - Type in input field
- `click(selector)` - Click element
- `select(selector, value)` - Select dropdown option

### Data Extraction
- `getText(selector)` - Get element text
- `exists(selector)` - Check if element exists

### Utilities
- `screenshot(name)` - Capture screenshot
- `delay(ms)` - Wait for duration
- `downloadFile(url, filename)` - Download file

---

## Production Deployment

### Security Considerations

1. **Run in sandboxed environment**
2. **Use headless mode** for performance
3. **Implement rate limiting** to avoid IP bans
4. **Rotate user agents** for authenticity
5. **Handle CAPTCHAs** (may need CAPTCHA solving service)

### Scaling

- Use job queue (Bull, BeeQueue) for async processing
- Deploy with Docker for isolation
- Monitor with logging (Winston, Sentry)
- Add retry logic for transient failures

### Legal Compliance

- ⚠️ Ensure automation complies with retailer Terms of Service
- Some retailers prohibit automated access
- Consider API integrations where available
- User consent for automated actions

---

## Future Enhancements

- [ ] Add more retailers (Best Buy, Apple, Nike, etc.)
- [ ] Implement CAPTCHA solving
- [ ] Add proxy rotation for IP management
- [ ] Support for authenticated returns (stored credentials)
- [ ] Email notification when return completes
- [ ] PDF label download and parsing
- [ ] Courier pickup scheduling via APIs
- [ ] Multi-item returns
- [ ] Return tracking and status updates

---

## Troubleshooting

### Puppeteer Installation Issues

```bash
# Linux: Install dependencies
sudo apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libxcomposite1 libxrandr2 libpangocairo-1.0-0

# macOS: Should work out of the box
# Windows: May need Visual C++ Redistributable
```

### Permission Errors

```bash
# Give execute permissions to Chromium
chmod +x node_modules/puppeteer/.local-chromium/*/chrome-mac/Chromium.app/Contents/MacOS/Chromium
```

---

## Contributing

To contribute a new retailer agent:

1. Fork the repository
2. Create agent class extending `BrowserAgent`
3. Add mock page for testing
4. Update `WebAutomationService`
5. Add sample email to `sample-emails.md`
6. Test thoroughly
7. Submit pull request

---

## Support

Questions? Issues? Feature requests?

- Open an issue on GitHub
- Check existing documentation
- Review sample code in `/backend/src/services/agents/`

Happy automating! 🤖
