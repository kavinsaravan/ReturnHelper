# Sample Order Confirmation Emails for Testing

Use these sample emails to test the ReturnsRunner agent. Simply copy and paste the email content into the app.

---

## 📦 Amazon Sample Emails

### Amazon Email #1 - Wireless Headphones

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

### Amazon Email #2 - Smart Watch

```
From: auto-confirm@amazon.com
Subject: Your Amazon.com order #114-5432109-8765432

Dear Emma Chen,

Order Confirmation #114-5432109-8765432

Your order has been received and is being prepared for shipment.

Item: Apple Watch Series 9 GPS 45mm
Price: $429.00
Quantity: 1

Delivery Address:
Emma Chen
2048 Tech Boulevard
Seattle, WA 98101

Email Address: emma.chen@example.com

Order Total: $429.00

Estimated Delivery: January 5, 2025

View order details: https://www.amazon.com/gp/your-account/order-details/114-5432109-8765432

Thanks for shopping with us!
- Amazon
```

### Amazon Email #3 - Kitchen Appliance

```
From: ship-confirm@amazon.com
Subject: Shipping Confirmation - Order #113-7654321-9876543

Hi Robert,

Great news! Your order has shipped.

Confirmation Number: 113-7654321-9876543

Product: Ninja Air Fryer, 4-Quart
Amount: $79.99

Shipping to:
Robert Martinez
567 Culinary Drive
Portland, OR 97201

Contact Email: robert.m@example.com

Total: $79.99

Track your package: https://amazon.com/orders/113-7654321-9876543

Thank you for your purchase!
```

---

## 🎯 Target Sample Emails

### Target Email #1 - Bluetooth Speaker

```
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
```

### Target Email #2 - Coffee Maker

```
From: guestservices@target.com
Subject: Order Confirmation TGT-88990011

Hello David,

Thank you for shopping at Target!

Order ID: TGT-88990011
Placed on: January 2, 2025

Order Summary:
Product: Keurig K-Elite Coffee Maker
Quantity: 1
Price: $139.99

Ship To:
David Park
890 Morning Lane
Austin, TX 78704

Email: david.park@example.com

Total Amount: $139.99

Expected Arrival: January 9, 2025

Manage your order: https://www.target.com/orders/TGT-88990011

We appreciate your business!
```

### Target Email #3 - Fitness Tracker

```
From: orders@target.com
Subject: Your Target.com order is on the way!

Hi Jessica,

Your order TGT-33221100 has been shipped!

Item: Fitbit Charge 5 Fitness Tracker
Price: $129.99
Qty: 1

Delivery Information:
Jessica Williams
1234 Fitness Street
Denver, CO 80202

Billing Email: jessica.w@example.com

Order Total: $129.99

Delivery Date: January 8, 2025

Track shipment: https://target.com/orders/TGT-33221100

Thank you for shopping at Target!
```

---

## 🏪 Walmart Sample Emails

### Walmart Email #1 - Phone Charger

```
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
```

### Walmart Email #2 - Gaming Headset

```
From: customerservice@walmart.com
Subject: Your Walmart Order 9988776655

Hello Tyler,

Your Walmart.com order has been confirmed.

Order Number: 9988776655
Order Date: January 3, 2025

Item Details:
Product: SteelSeries Arctis 7 Gaming Headset
Qty: 1
Price: $149.99

Shipping Address:
Tyler Johnson
4567 Gaming Avenue
San Diego, CA 92101

Customer Email: tyler.j@example.com

Total: $149.99

Delivery by: January 10, 2025

View order status: https://www.walmart.com/orders/9988776655

Thanks for choosing Walmart!
```

### Walmart Email #3 - Tablet

```
From: orders@walmart.com
Subject: Walmart.com Order Confirmation 5544332211

Dear Amanda,

Thank you for your order!

Confirmation #: 5544332211
Date: January 4, 2025

Product: Samsung Galaxy Tab A8 10.5" Tablet
Amount: $199.99
Quantity: 1

Deliver to:
Amanda Rodriguez
9876 Digital Parkway
Miami, FL 33101

Email Address: amanda.rodriguez@example.com

Order Total: $199.99

Expected Arrival: January 11, 2025

Order details: https://walmart.com/account/orders/5544332211

We appreciate your business!
```

---

## How to Use

1. Start the backend server: `cd backend && npm start`
2. Start the web app: `npm start` (in the root directory)
3. Click "Start a return" on the homepage
4. Copy one of the sample emails above
5. Paste it into the email content field
6. Click "Start return process"
7. Watch the browser automation agent work!

## What Happens

The agent will:
1. ✅ Parse the email to extract order details
2. ✅ Launch a browser window (visible in headed mode)
3. ✅ Navigate to the retailer's return portal
4. ✅ Fill in order number and email
5. ✅ Select items to return
6. ✅ Choose return reason
7. ✅ Select shipping method
8. ✅ Submit the return request
9. ✅ Capture confirmation and tracking numbers
10. ✅ Take screenshots at each step

## Screenshots

All screenshots are saved in `backend/screenshots/` for debugging.

## Testing Different Retailers

- For **Amazon**: Use the Amazon sample email
- For **Target**: Use the Target sample email
- For **Walmart**: Use the Walmart sample email
- For other retailers: The system will use a generic handler

Enjoy testing ReturnsRunner! 🎉
