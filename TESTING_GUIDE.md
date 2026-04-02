# 🧪 ReturnsRunner Testing Guide

Complete guide to testing the browser automation agent with all available test data.

---

## Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Server running on: http://localhost:5000
✅ API endpoint: http://localhost:5000/api
```

### 2. Choose Your Testing Method

**Option A: Web App (Recommended for Full Flow)**
```bash
npm start
```
Then paste sample emails from the UI.

**Option B: Command Line (Quick Testing)**
```bash
cd backend
node test-agent.js amazon    # Test Amazon automation
node test-agent.js target     # Test Target automation
node test-agent.js walmart    # Test Walmart automation
```

---

## 📦 Available Test Data

### Sample Email Files

| File | Description | Email Count |
|------|-------------|-------------|
| `sample-emails.md` | Core test emails (Amazon, Target, Walmart) | 9 emails |
| `sample-emails-extended.md` | Extended retailers + edge cases | 23+ emails |

### Test Data Summary

**Supported Retailers (with agents):**
- ✅ **Amazon** - 3 test emails
- ✅ **Target** - 3 test emails
- ✅ **Walmart** - 3 test emails

**Unsupported Retailers (generic handler):**
- ⚠️ **Best Buy** - 3 test emails
- ⚠️ **Apple** - 3 test emails
- ⚠️ **Nike** - 2 test emails
- ⚠️ **Adidas** - 1 test email
- ⚠️ **ASOS** - 1 test email
- ⚠️ **H&M** - 1 test email

**Edge Cases:**
- 5+ special scenarios (long order IDs, special characters, minimal data, etc.)

---

## 🎯 Testing Scenarios

### Scenario 1: First Time Test (Recommended)

**Goal:** Verify basic automation works

1. Start backend server
2. Start web app (`npm start`)
3. Navigate to http://localhost:3000
4. Click "Start a return"
5. Copy **Amazon Email #1** from `sample-emails.md`:

```
From: auto-confirm@amazon.com
Subject: Your Amazon.com order of Wireless Headphones

Hello John Doe,

Thank you for your order from Amazon.com!

Order Confirmation #112-9876543-2109876

Order Details:
--------------
Product: Sony WH-1000XM4 Wireless Headphones
Quantity: 1
Price: $89.99

Shipping Address:
123 Main Street
San Francisco, CA 94102

Email: john.doe@example.com

Total: $89.99

Your order will arrive by: December 28, 2024

Track your package: https://amazon.com/orders/112-9876543-2109876

Thank you for shopping with Amazon!
```

6. Paste into "Email content" field
7. Click "Start return process"
8. **Watch the browser window open and automate the return!**

**Expected Result:**
- Browser window opens (visible)
- Agent navigates to mock Amazon returns page
- Form fields auto-filled
- Return submitted successfully
- Confirmation numbers displayed
- Screenshots saved in `backend/screenshots/`

---

### Scenario 2: Test All Three Main Retailers

**Goal:** Verify all supported agents work

**Test Sequence:**
1. Amazon Email #2 (Apple Watch - $429)
2. Target Email #3 (Fitness Tracker - $129.99)
3. Walmart Email #2 (Gaming Headset - $149.99)

Run each through the web app and verify:
- ✅ Browser launches
- ✅ Correct retailer page loads
- ✅ Forms filled correctly
- ✅ Return submitted
- ✅ Tracking number generated

---

### Scenario 3: Quick CLI Testing

**Goal:** Fast testing without web app

```bash
cd backend

# Test Amazon
node test-agent.js amazon

# Test Target
node test-agent.js target

# Test Walmart
node test-agent.js walmart

# Test Best Buy (generic handler)
node test-agent.js bestbuy
```

**Expected Output:**
```
============================================================
🧪 Testing AMAZON Agent
============================================================

📧 Step 1: Parsing email...
✅ Email parsed successfully:
   Retailer: Amazon
   Order ID: 112-9876543-2109876
   Product: Sony WH-1000XM4 Wireless Headphones
   Amount: $89.99
   Email: john.doe@example.com

🤖 Step 2: Running browser automation...
   (Browser window will open - watch the automation!)

------------------------------------------------------------
✅ AUTOMATION SUCCESSFUL!
------------------------------------------------------------

Results:
   Confirmation: AMZ-112-9876543-2109876-1738425678901
   Tracking: 1Z999AA10123456784
   Carrier: UPS
   Method: UPS Drop-off
   Label URL: http://localhost:5000/mock/labels/amazon-112-9876543-2109876.pdf

📸 Screenshots saved (11 total):
   - 01-start-2025-01-31T12-34-56-789Z.png
   - 02-returns-page-2025-01-31T12-34-58-123Z.png
   - 03-order-entered-2025-01-31T12-35-00-456Z.png
   ...
```

---

### Scenario 4: Edge Case Testing

**Goal:** Verify parser robustness

Test emails from `sample-emails-extended.md`:

1. **Edge Case #1** - Very long order number
2. **Edge Case #2** - Special characters in order ID
3. **Edge Case #3** - Minimal information
4. **Edge Case #4** - Very high value item ($4,599)
5. **Edge Case #5** - Extra whitespace

**What to Check:**
- Parser extracts order ID correctly
- Special characters handled properly
- Missing fields don't crash the system
- High-value items process normally

---

### Scenario 5: Generic Handler Test

**Goal:** Test unsupported retailers

Use emails for:
- Best Buy
- Apple
- Nike
- Adidas

**Expected Behavior:**
- Email parser detects retailer
- WebAutomationService uses generic handler
- Simulated confirmation returned
- No browser automation (just placeholder response)

**Console Output:**
```
⚠️  No specific agent for Best Buy, using generic handler
Using generic automation handler
```

---

### Scenario 6: Stress Test

**Goal:** Multiple returns in quick succession

Run 5-10 returns back-to-back:

```bash
cd backend
node test-agent.js amazon
node test-agent.js target
node test-agent.js walmart
node test-agent.js amazon
node test-agent.js target
```

**What to Check:**
- No memory leaks
- Browser closes properly each time
- Screenshots don't conflict
- Server remains responsive

---

## 🔍 Verification Checklist

After each test, verify:

### ✅ Browser Automation
- [ ] Browser window opens (if headed mode)
- [ ] Navigates to correct mock page
- [ ] Order number field auto-filled
- [ ] Email field auto-filled
- [ ] Return reason selected
- [ ] Shipping method chosen
- [ ] Form submitted successfully
- [ ] Browser closes cleanly

### ✅ Screenshots
- [ ] Screenshots saved in `backend/screenshots/`
- [ ] Multiple screenshots per run (01-start, 02-page, etc.)
- [ ] Filenames include timestamps
- [ ] Full-page screenshots captured

### ✅ Data Extraction
- [ ] Order ID parsed correctly
- [ ] Retailer identified
- [ ] Customer email extracted
- [ ] Product name captured (if available)
- [ ] Price amount parsed

### ✅ Results
- [ ] Confirmation number generated
- [ ] Tracking number created
- [ ] Shipping label URL provided
- [ ] Carrier specified
- [ ] Return method noted

### ✅ Error Handling
- [ ] Invalid email handled gracefully
- [ ] Missing order ID detected
- [ ] Browser errors captured
- [ ] Error screenshots saved

---

## 🐛 Troubleshooting

### Browser Doesn't Open

**Problem:** No browser window appears

**Solutions:**
```bash
# Check headless mode setting
cat backend/.env | grep HEADLESS_BROWSER
# Should be: HEADLESS_BROWSER=false

# If true, change to false for visible browser
```

### Screenshots Not Saving

**Problem:** No screenshots in `backend/screenshots/`

**Solutions:**
```bash
# Create directory manually
mkdir -p backend/screenshots

# Check permissions
ls -la backend/screenshots

# Check disk space
df -h
```

### "Element not found" Errors

**Problem:** Agent can't find form fields

**Solutions:**
1. Verify mock page is accessible: http://localhost:5000/mock/amazon-returns.html
2. Check backend server is running
3. Increase timeout in agent code
4. Check browser console for JavaScript errors

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Kill existing process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
export PORT=5001
npm start
```

### Puppeteer Installation Issues

**Problem:** Chromium download failed

**Solutions:**
```bash
# Reinstall Puppeteer
cd backend
rm -rf node_modules/puppeteer
npm install puppeteer

# Or skip Chromium download and use system Chrome
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
npm install puppeteer
```

---

## 📊 Testing Metrics

Track these metrics during testing:

| Metric | Target | Actual |
|--------|--------|--------|
| Success Rate | > 95% | ___ |
| Average Duration | < 15 seconds | ___ |
| Screenshot Count | 10-15 per run | ___ |
| Memory Usage | < 500MB | ___ |
| Error Rate | < 5% | ___ |

---

## 🎓 Advanced Testing

### Custom Test Email

Create your own test email:

```
From: retailer@example.com
Subject: Order Confirmation

Order Number: YOUR-ORDER-123
Product: Your Product Name
Price: $99.99
Email: your.email@example.com

Total: $99.99
```

**Requirements:**
- Must include order number pattern
- Must include retailer name (amazon, target, walmart, etc.)
- Must include email address

### Modify Mock Pages

Test custom return flows:

1. Edit `backend/src/mock-pages/amazon-returns.html`
2. Add/modify form fields
3. Update agent selectors in `backend/src/services/agents/AmazonAgent.js`
4. Test with sample email

### Debug Mode

Enable verbose logging:

```bash
# In backend/.env
DEBUG_MODE=true
BROWSER_SLOW_MO=500  # Slow down for easier viewing
```

### Headless Testing

For faster automated tests:

```bash
# In backend/.env
HEADLESS_BROWSER=true
```

---

## 📝 Test Report Template

After testing, document results:

```markdown
## Test Report - [Date]

### Environment
- Node Version: ___
- OS: ___
- Backend Running: Yes/No
- Web App Running: Yes/No

### Tests Executed
- [ ] Amazon Email #1
- [ ] Target Email #2
- [ ] Walmart Email #3
- [ ] Edge Cases

### Results
- Total Tests: ___
- Passed: ___
- Failed: ___
- Success Rate: ___%

### Issues Found
1. [Description]
2. [Description]

### Screenshots Location
backend/screenshots/

### Notes
[Any additional observations]
```

---

## 🚀 Next Steps

After successful testing:

1. **Add More Retailers**
   - Implement Best Buy agent
   - Implement Apple agent
   - Add Nike support

2. **Enhance Agents**
   - Add retry logic
   - Improve error messages
   - Handle CAPTCHAs

3. **Production Prep**
   - Switch to headless mode
   - Add logging service
   - Implement rate limiting
   - Add monitoring

4. **Scale Testing**
   - Load testing with 100+ returns
   - Concurrent automation
   - Long-running stability test

---

## 💡 Tips for Effective Testing

1. **Start Simple:** Test Amazon Email #1 first
2. **One at a Time:** Don't run multiple tests simultaneously
3. **Watch the Browser:** Keep headed mode on to see what's happening
4. **Check Logs:** Backend console shows detailed progress
5. **Review Screenshots:** Great for debugging issues
6. **Clean Up:** Clear screenshots folder between major test runs
7. **Document Issues:** Note any failures for investigation

---

## 📞 Getting Help

If you encounter issues:

1. Check this testing guide
2. Review `AUTOMATION_README.md` for architecture details
3. Inspect screenshots in `backend/screenshots/`
4. Check backend console logs
5. Review sample emails for correct format
6. Verify backend server is running on port 5000

Happy Testing! 🎉
