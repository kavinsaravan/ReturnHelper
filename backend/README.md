# ReturnsRunner Backend API

Backend server for ReturnsRunner - AI-powered returns automation service.

## Features

- ✅ RESTful API with Express.js
- ✅ MongoDB integration (with in-memory fallback)
- ✅ Email parsing service
- ✅ Returns processing automation
- ✅ Web automation (Puppeteer ready)
- ✅ CORS enabled
- ✅ Error handling
- ✅ Request logging

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env` and configure as needed:

```bash
# The default .env works without MongoDB
# Server will run with in-memory storage
```

### 3. Start Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

Returns server status and database connection state.

### Returns Management

**Create Return**
```
POST /api/returns
Content-Type: application/json

{
  "orderDetails": {
    "orderId": "ORD123456",
    "retailer": "Amazon",
    "productName": "Product Name",
    "amount": 99.99
  },
  "instruction": "return this"
}
```

**Get All Returns**
```
GET /api/returns
```

**Get Return by ID**
```
GET /api/returns/:id
```

**Update Return Status**
```
PATCH /api/returns/:id/status

{
  "status": "completed",
  "progressStep": {
    "title": "Step Title",
    "description": "Step description",
    "completed": true
  }
}
```

**Delete Return**
```
DELETE /api/returns/:id
```

### Email Processing

**Parse Email**
```
POST /api/email/parse
Content-Type: application/json

{
  "emailContent": "Your order confirmation email text here..."
}
```

## Architecture

```
backend/
├── src/
│   ├── server.js              # Main server file
│   ├── routes/               # API routes
│   │   ├── health.js
│   │   ├── returns.js
│   │   └── email.js
│   ├── controllers/          # Request handlers
│   │   ├── returnsController.js
│   │   └── emailController.js
│   ├── services/             # Business logic
│   │   ├── EmailParserService.js
│   │   ├── ReturnsProcessingService.js
│   │   └── WebAutomationService.js
│   ├── models/               # Database models
│   │   └── Return.js
│   └── config/               # Configuration files
├── .env                      # Environment variables
└── package.json              # Dependencies
```

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/returnsrunner

# Shipping APIs (for production)
USPS_API_KEY=
UPS_API_KEY=
FEDEX_API_KEY=
```

## Database

### With MongoDB

1. Install MongoDB locally or use MongoDB Atlas
2. Set `MONGODB_URI` in `.env`
3. Server will connect automatically

### Without MongoDB

- Server runs with in-memory storage
- Data persists only while server is running
- Perfect for development and testing

## Development

### Install Nodemon (for auto-reload)

```bash
npm install -g nodemon
npm run dev
```

### Testing API with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Create return
curl -X POST http://localhost:5000/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "orderDetails": {
      "orderId": "TEST123",
      "retailer": "Amazon",
      "productName": "Test Product",
      "amount": 49.99
    },
    "instruction": "return this"
  }'

# Get all returns
curl http://localhost:5000/api/returns
```

## Production Deployment

### 1. Set Environment Variables

```env
NODE_ENV=production
MONGODB_URI=<your_production_mongodb_uri>
PORT=5000
```

### 2. Install Production Dependencies

```bash
npm install --production
```

### 3. Start Server

```bash
npm start
```

### 4. Deploy to Cloud

**Heroku:**
```bash
heroku create
git push heroku main
```

**Railway:**
```bash
railway init
railway up
```

**AWS/GCP/Azure:**
Follow their Node.js deployment guides.

## Web Automation (Puppeteer)

The server is ready for web automation but currently uses simulated results.

To enable real automation:

1. Uncomment Puppeteer code in `services/WebAutomationService.js`
2. Add retailer credentials securely (use environment variables)
3. Implement login flows for each retailer
4. Handle CAPTCHAs and 2FA

## Security Considerations

- [ ] Add API authentication (JWT)
- [ ] Rate limiting
- [ ] Input validation
- [ ] Secure credential storage
- [ ] HTTPS in production
- [ ] Environment variable encryption

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues or questions:
- Open an issue on GitHub
- Email: support@returnsrunner.com
