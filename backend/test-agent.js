#!/usr/bin/env node
/**
 * Quick Test Script for Browser Automation Agent
 *
 * Usage:
 *   node test-agent.js amazon
 *   node test-agent.js target
 *   node test-agent.js walmart
 */

require('dotenv').config();
const EmailParserService = require('./src/services/EmailParserService');
const WebAutomationService = require('./src/services/WebAutomationService');

// Sample test emails
const TEST_EMAILS = {
  amazon: `
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
  `,

  target: `
From: orders@target.com
Subject: Thanks for your order!

Hi Sarah,

Your Target order is confirmed!

Order Number: TGT-45678912
Order Date: December 20, 2024

Items Ordered:
--------------
Item: Bluetooth Speaker - JBL Flip 5
Qty: 1
Price: $49.99

Shipping To:
Sarah Johnson
456 Oak Avenue
Los Angeles, CA 90001

Billing Email: sarah.johnson@example.com

Order Total: $49.99

Expected Delivery: December 27, 2024

View your order: https://target.com/orders/TGT-45678912

Thanks for choosing Target!
  `,

  walmart: `
From: noreply@walmart.com
Subject: Walmart Order Confirmation

Order Confirmation

Thank you for your Walmart.com purchase!

Order ID: 7890123456
Purchase Date: December 21, 2024

Product: Portable Phone Charger - Anker PowerCore
Quantity: 1
Amount: $24.99

Ship to:
Mike Williams
789 Elm Street
Austin, TX 78701

Email: mike.williams@example.com

Total: $24.99

Estimated Delivery: December 29, 2024

Track order: https://walmart.com/account/order/7890123456

Thank you for shopping at Walmart!
  `,

  bestbuy: `
From: BestBuyInfo@emailinfo.bestbuy.com
Subject: Your Best Buy Order BBY01-234567890

Thank you for your purchase!

Order Number: BBY01-234567890
Order Date: January 5, 2025

Item: HP Pavilion 15.6" Laptop
Price: $599.99
Quantity: 1

Shipping Information:
Christopher Lee
3210 Technology Way
Bellevue, WA 98004

Email: christopher.lee@example.com

Total: $599.99

Estimated Delivery: January 12, 2025

Track your order: https://www.bestbuy.com/profile/orders/BBY01-234567890

Thank you for shopping at Best Buy!
  `
};

async function testAgent(retailerName) {
  console.log('\n' + '='.repeat(60));
  console.log(`🧪 Testing ${retailerName.toUpperCase()} Agent`);
  console.log('='.repeat(60) + '\n');

  const emailContent = TEST_EMAILS[retailerName.toLowerCase()];

  if (!emailContent) {
    console.error(`❌ Unknown retailer: ${retailerName}`);
    console.log(`Available retailers: ${Object.keys(TEST_EMAILS).join(', ')}`);
    process.exit(1);
  }

  try {
    // Step 1: Parse email
    console.log('📧 Step 1: Parsing email...');
    const orderDetails = await EmailParserService.parseEmail(emailContent);

    if (!orderDetails) {
      console.error('❌ Failed to parse email');
      process.exit(1);
    }

    console.log('✅ Email parsed successfully:');
    console.log(`   Retailer: ${orderDetails.retailer}`);
    console.log(`   Order ID: ${orderDetails.orderId}`);
    console.log(`   Product: ${orderDetails.productName || 'N/A'}`);
    console.log(`   Amount: $${orderDetails.amount || 'N/A'}`);
    console.log(`   Email: ${orderDetails.customerEmail || 'N/A'}`);
    console.log('');

    // Step 2: Run automation
    console.log('🤖 Step 2: Running browser automation...');
    console.log('   (Browser window will open - watch the automation!)');
    console.log('');

    const result = await WebAutomationService.processReturn(
      orderDetails.retailer,
      orderDetails
    );

    // Step 3: Show results
    console.log('\n' + '-'.repeat(60));
    if (result.success) {
      console.log('✅ AUTOMATION SUCCESSFUL!');
      console.log('-'.repeat(60));
      console.log('\nResults:');
      console.log(`   Confirmation: ${result.data.confirmationNumber || 'N/A'}`);
      console.log(`   Tracking: ${result.data.trackingNumber || 'N/A'}`);
      console.log(`   Carrier: ${result.data.carrier || 'N/A'}`);
      console.log(`   Method: ${result.data.returnMethod || 'N/A'}`);
      console.log(`   Label URL: ${result.data.shippingLabelUrl || 'N/A'}`);

      if (result.data.screenshots && result.data.screenshots.length > 0) {
        console.log(`\n📸 Screenshots saved (${result.data.screenshots.length} total):`);
        result.data.screenshots.slice(0, 5).forEach(s => {
          console.log(`   - ${s}`);
        });
        if (result.data.screenshots.length > 5) {
          console.log(`   ... and ${result.data.screenshots.length - 5} more`);
        }
      }
    } else {
      console.log('❌ AUTOMATION FAILED');
      console.log('-'.repeat(60));
      console.log(`\nError: ${result.error || 'Unknown error'}`);
    }
    console.log('');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('🎉 Test Complete!');
  console.log('='.repeat(60) + '\n');
}

// Main execution
const retailer = process.argv[2];

if (!retailer) {
  console.log('\n📋 Browser Automation Agent Test Script');
  console.log('='.repeat(60));
  console.log('\nUsage:');
  console.log('  node test-agent.js <retailer>');
  console.log('\nAvailable retailers:');
  Object.keys(TEST_EMAILS).forEach(r => {
    console.log(`  - ${r}`);
  });
  console.log('\nExample:');
  console.log('  node test-agent.js amazon');
  console.log('  node test-agent.js target\n');
  process.exit(0);
}

testAgent(retailer);
