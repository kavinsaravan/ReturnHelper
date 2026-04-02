# ReturnsRunner Setup Guide

This guide will help you get ReturnsRunner up and running on your development machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### For iOS Development (Mac only)
- **Xcode** (latest version) - [Download from App Store](https://apps.apple.com/app/xcode/id497799835)
- **CocoaPods** - Install with: `sudo gem install cocoapods`
- **Xcode Command Line Tools** - Install with: `xcode-select --install`

### For Android Development
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Android SDK** (API Level 33 or higher)
- **Java Development Kit** (JDK 11 or higher)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ReturnsRunner
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter any errors, try:
```bash
npm install --legacy-peer-deps
```

### 3. iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

If you get errors with pod install, try:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### 4. Android Setup

1. Open Android Studio
2. Configure Android SDK:
   - Open Android Studio > Settings > Appearance & Behavior > System Settings > Android SDK
   - Ensure Android 13.0 (API Level 33) is installed
3. Set up environment variables in `~/.bash_profile` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

4. Restart your terminal

### 5. Start Metro Bundler

```bash
npm start
```

### 6. Run the App

In a new terminal window:

**For iOS:**
```bash
npm run ios
```

Or specify a simulator:
```bash
npm run ios -- --simulator="iPhone 15 Pro"
```

**For Android:**
```bash
npm run android
```

## Troubleshooting

### Common Issues

#### Metro Bundler Issues

If you see errors with the Metro bundler:
```bash
npm start -- --reset-cache
```

#### iOS Build Failures

1. Clean build folder:
```bash
cd ios
xcodebuild clean
cd ..
```

2. Remove derived data:
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
```

3. Reinstall pods:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### Android Build Failures

1. Clean Gradle:
```bash
cd android
./gradlew clean
cd ..
```

2. Clear Gradle cache:
```bash
cd android
./gradlew cleanBuildCache
cd ..
```

#### Port Already in Use

If port 8081 is already in use:
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

### Dependencies Issues

If you have issues with specific packages:

1. Clear npm cache:
```bash
npm cache clean --force
```

2. Remove node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

3. For iOS, also clear pods:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## Development Workflow

### Running on Physical Devices

#### iOS
1. Connect your iPhone via USB
2. Open `ios/ReturnsRunner.xcworkspace` in Xcode
3. Select your device from the device dropdown
4. Click Run or press Cmd+R

#### Android
1. Enable Developer Mode on your Android device
2. Enable USB Debugging
3. Connect via USB
4. Run: `adb devices` to verify connection
5. Run: `npm run android`

### Hot Reload

React Native supports hot reloading:
- Press `r` in the Metro terminal to reload
- Press `d` to open developer menu
- In the app, shake the device to open developer menu

### Developer Menu

**iOS Simulator:** Press `Cmd+D`
**Android Emulator:** Press `Cmd+M` (Mac) or `Ctrl+M` (Windows/Linux)
**Physical Device:** Shake the device

From the developer menu you can:
- Enable Fast Refresh
- Toggle Inspector
- Show Performance Monitor
- Debug JS Remotely (deprecated, use Flipper)

## Debugging

### React Native Debugger

1. Install React Native Debugger:
```bash
brew install --cask react-native-debugger
```

2. Open React Native Debugger
3. In the app developer menu, select "Debug"

### Flipper

Flipper is the recommended debugging tool:

1. Download Flipper: https://fbflipper.com/
2. Install React Native plugin
3. Start your app
4. Flipper should automatically connect

### Console Logs

View logs in terminal:

**iOS:**
```bash
npx react-native log-ios
```

**Android:**
```bash
npx react-native log-android
```

## Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Linter
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint -- --fix
```

## Building for Production

### iOS

1. Open `ios/ReturnsRunner.xcworkspace` in Xcode
2. Select "Any iOS Device" or your connected device
3. Product > Archive
4. Follow the prompts to upload to App Store Connect

### Android

1. Generate signing key:
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore returnsrunner.keystore -alias returnsrunner -keyalg RSA -keysize 2048 -validity 10000
```

2. Build APK:
```bash
cd android
./gradlew assembleRelease
```

3. Build AAB (for Play Store):
```bash
./gradlew bundleRelease
```

The built files will be in:
- APK: `android/app/build/outputs/apk/release/`
- AAB: `android/app/build/outputs/bundle/release/`

## Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and fill in your values for any backend services you're using.

## Next Steps

Once you have the app running:

1. **Try the Demo**: Use the sample email format to test the return process
2. **Explore the Code**: Start with `App.tsx` and explore the screens
3. **Read the Docs**: Check out `README.md` for architecture details
4. **Make Changes**: The app supports hot reload - just save and see changes instantly

## Getting Help

If you're stuck:

1. Check this guide again carefully
2. Search existing GitHub issues
3. Check React Native documentation: https://reactnative.dev/
4. Ask in our Discord community
5. Open a new GitHub issue with:
   - Your OS and version
   - Node version (`node --version`)
   - React Native version
   - Error messages and logs
   - Steps to reproduce

## Useful Commands Reference

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Lint code
npm run lint

# Clear all caches (when things go wrong)
npm start -- --reset-cache
rm -rf node_modules
rm -rf ios/Pods ios/Podfile.lock
npm install
cd ios && pod install && cd ..
```

Happy coding! 🚀
