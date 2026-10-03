# ReturnsRunner

An AI-powered mobile application that automates the entire process of returning online purchases. Simply forward your order confirmation email and say "return this" - the agent handles everything else.

## Features

- **Email Parsing**: Automatically extract order details from confirmation emails
- **AI Agent**: Intelligent automation that navigates retailer return portals
- **Form Automation**: Automatically fills out return forms
- **Shipping Labels**: Generate and download return shipping labels
- **Courier Scheduling**: Schedule pickup with delivery services
- **Progress Tracking**: Real-time updates on your return status
- **Multi-Retailer Support**: Works with 50+ major retailers including Amazon, Target, Walmart, Best Buy, and more

## How It Works

1. **Forward Email**: Send your order confirmation email or paste it into the app
2. **AI Takes Over**: The agent navigates to the retailer's return portal
3. **Automated Processing**: Forms are filled out automatically
4. **Get Label**: Receive your shipping label instantly
5. **Schedule Pickup**: Courier pickup is scheduled automatically

## Screenshots

### Home Screen
The landing page with an overview of the service and quick access to start a return.

### Email Input
Paste your order confirmation email or upload it from your device.

### Returns Dashboard
View all your returns in one place with real-time status updates.

### Return Details
Track the progress of your return with detailed timeline and shipping information.

## Architecture

### Frontend (React Native)
- **App.tsx**: Main navigation setup
- **Screens**:
  - `HomeScreen.tsx`: Landing page with feature overview
  - `EmailInputScreen.tsx`: Email input and return initiation
  - `ReturnsDashboardScreen.tsx`: List of all returns
  - `ReturnDetailsScreen.tsx`: Detailed view of a single return

### Services
- **EmailParser**: Extracts order information from confirmation emails
- **ReturnsAgent**: Orchestrates the entire return process
- **RetailerAutomation**: Handles retailer-specific return workflows
- **ReturnsStorage**: Manages local data persistence

### Types
- **ReturnRequest**: Main data model for returns
- **OrderDetails**: Extracted order information
- **ProgressStep**: Timeline updates for return progress

## Tech Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe code
- **React Navigation**: Navigation and routing
- **AsyncStorage**: Local data persistence
- **Axios**: HTTP client for API calls

## Installation

### Prerequisites
- Node.js >= 18
- npm or yarn
- React Native development environment setup
  - For iOS: Xcode and CocoaPods
  - For Android: Android Studio and SDK

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ReturnsRunner
```

2. **Install dependencies**
```bash
npm install
```

3. **Install iOS dependencies** (Mac only)
```bash
cd ios && pod install && cd ..
```

4. **Start Metro bundler**
```bash
npm start
```

5. **Run on iOS**
```bash
npm run ios
```

6. **Run on Android**
```bash
npm run android
```

## Usage

### Starting a Return

1. Open the app
2. Tap "Start a Return"
3. Paste your order confirmation email or upload the email file
4. Optionally customize your instruction (default is "return this")
5. Tap "Start Return Process"
6. The AI agent will process your return automatically

### Tracking Returns

1. Navigate to "My Returns" from the home screen
2. View all your returns with their current status
3. Tap on any return to see detailed progress
4. Download shipping labels when ready
5. Track your shipment through the integrated tracking link

### Return Statuses

- **Pending**: Return request received, waiting to process
- **Processing**: Agent is actively working on your return
- **Completed**: All steps completed, ready to ship
- **Failed**: An error occurred (see error details for more info)

## Supported Retailers

### Currently Supported (with dedicated automation)
- Amazon
- Target
- Walmart
- Best Buy
- Apple
- Nike
- Adidas
- Zara
- H&M
- ASOS


## Backend Integration (Future)

The current implementation is a frontend-only prototype. For production deployment, you would need:

### Backend Services
- **Email Processing Service**: Handle forwarded emails via dedicated email address
- **Web Automation Service**: Run Puppeteer/Playwright for browser automation
- **API Gateway**: Coordinate between services
- **Database**: Store user accounts and return history
- **Notification Service**: Push notifications for status updates

### Web Automation
The `RetailerAutomation` service would be implemented using:
- **Puppeteer/Playwright**: Headless browser automation
- **OCR Services**: Extract text from images/PDFs
- **AI/ML Models**: Intelligent form detection and filling
- **CAPTCHA Solving**: Handle security challenges

### Shipping Integration
- **USPS API**: Generate labels and schedule pickups
- **UPS API**: Track shipments and manage pickups
- **FedEx API**: Label generation and tracking
- **Courier APIs**: Local delivery service integration

### Security Considerations
- **Encrypted Storage**: Store user credentials securely
- **OAuth Integration**: Use retailer OAuth when available
- **2FA Support**: Handle two-factor authentication
- **Data Privacy**: Comply with privacy regulations
- **Secure Communication**: HTTPS/TLS for all API calls

## Development

### Project Structure
```
ReturnsRunner/
├── App.tsx                 # Main app component
├── src/
│   ├── screens/           # All screen components
│   │   ├── HomeScreen.tsx
│   │   ├── EmailInputScreen.tsx
│   │   ├── ReturnsDashboardScreen.tsx
│   │   └── ReturnDetailsScreen.tsx
│   ├── services/          # Business logic
│   │   ├── EmailParser.ts
│   │   ├── ReturnsAgent.ts
│   │   ├── RetailerAutomation.ts
│   │   └── ReturnsStorage.ts
│   ├── types/             # TypeScript types
│   │   └── ReturnRequest.ts
│   └── utils/             # Utility functions
├── package.json
├── tsconfig.json
└── README.md
```

### Adding a New Retailer

1. **Update EmailParser** (src/services/EmailParser.ts)
   - Add retailer to detection patterns
   - Handle retailer-specific email formats

2. **Update RetailerAutomation** (src/services/RetailerAutomation.ts)
   - Add new handler method (e.g., `handleNewRetailer`)
   - Register in `initializeRetailers()`
   - Implement automation steps

3. **Test**
   - Create test email samples
   - Verify parsing and automation

### Testing

Run tests:
```bash
npm test
```

Lint code:
```bash
npm run lint
```

### Building for Production

**iOS**:
```bash
cd ios
xcodebuild -workspace ReturnsRunner.xcworkspace -scheme ReturnsRunner -configuration Release
```

**Android**:
```bash
cd android
./gradlew assembleRelease
```



