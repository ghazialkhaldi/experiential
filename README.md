# Experiential - Mobile & Web App

A comprehensive platform for discovering volunteer opportunities and internships with both web and mobile interfaces.

## 🚀 Features

### Web Application
- Volunteer and internship opportunity discovery
- User authentication and profiles
- Organization dashboard
- Resume builder
- Portfolio tracking
- Notifications system

### Mobile Application
- **Meta AI-inspired interface** with modern, clean design
- **Haptic feedback** when toggling between volunteer/internship modes
- **Push notifications** for new opportunities and updates
- **Native mobile navigation** with bottom tab bar
- **Quick action floating buttons** for fast access to features
- **Optimized touch interactions** with proper sizing for mobile
- **Safe area support** for modern devices with notches

## 📱 Mobile App Setup

The mobile version uses Capacitor to provide native functionality while maintaining the same features as the web version.

### Development Setup

1. **Clone from GitHub** (after pushing to your repository)
   ```bash
   git clone [your-github-repo-url]
   cd experiential-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Initialize Capacitor** (if not already done)
   ```bash
   npx cap init
   ```

5. **Add Mobile Platforms**
   ```bash
   npx cap add ios
   npx cap add android
   ```

6. **Sync Native Code**
   ```bash
   npx cap sync
   ```

### Running on Mobile

#### iOS (requires Mac with Xcode)
```bash
npx cap run ios
```

#### Android (requires Android Studio)
```bash
npx cap run android
```

### Mobile Features

#### Haptic Feedback
- **Light haptic** on navigation and button taps
- **Medium haptic** for mode switching and important actions
- **Heavy haptic** for critical actions (coming soon)

#### Push Notifications
- Welcome notifications for new users
- Mode change confirmations
- Opportunity updates
- Application status changes

#### Native Mobile UI
- **Bottom Navigation**: Easy thumb-friendly navigation
- **Floating Action Buttons**: Quick access to search and main features
- **Meta AI Design**: Clean, modern interface inspired by Meta's AI app
- **Gesture Support**: Swipe gestures and native scrolling

## 🛠 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Mobile**: Capacitor (iOS & Android)
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Notifications**: Capacitor Local Notifications
- **Haptics**: Capacitor Haptics

## 🎨 Design System

The mobile app uses a Meta AI-inspired design with:
- **Gradient backgrounds** for modern appeal
- **Blur effects** for depth and hierarchy
- **Smooth animations** with proper easing
- **Consistent spacing** following iOS/Android guidelines
- **Accessible colors** with proper contrast ratios

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── MobileApp.tsx       # Main mobile app wrapper
│   ├── MobileHeader.tsx    # Mobile-optimized header
│   ├── MobileNavigation.tsx # Bottom tab navigation
│   └── MobileModeToggle.tsx # Haptic mode switcher
├── hooks/
│   ├── useMobile.tsx       # Mobile-specific functionality
│   └── useOpportunities.tsx # Data fetching
├── pages/                  # All app pages (shared between web/mobile)
├── styles/
│   └── mobile.css         # Mobile-specific styles
└── contexts/
    └── ModeContext.tsx    # Volunteer/Internship mode state
```

## 🚀 Deployment

### Web Deployment
The web version is automatically deployed via Lovable's hosting platform.

### Mobile App Store Deployment

1. **Export to GitHub**
   - Click "Export to Github" in Lovable
   - Clone your repository locally

2. **Build for Production**
   ```bash
   npm install
   npm run build
   npx cap sync
   ```

3. **iOS App Store**
   - Open `ios/App/App.xcworkspace` in Xcode
   - Configure signing certificates
   - Archive and upload to App Store Connect

4. **Google Play Store**
   - Open project in Android Studio
   - Build signed AAB/APK
   - Upload to Google Play Console

### Configuration

The mobile app includes:
- **App ID**: `app.lovable.75132a79160548ad89e678237d9547f6`
- **App Name**: Experiential
- **Hot Reload**: Enabled for development
- **Icons**: Configured for both iOS and Android
- **Splash Screens**: Optimized for all device sizes

## 🎯 Mobile-Specific Features

### Mode Toggle with Haptic Feedback
```typescript
const handleModeToggle = async () => {
  await triggerHaptic(ImpactStyle.Light);
  setMode(isInternshipMode ? 'volunteer' : 'internship');
  
  // Show feedback notification
  scheduleNotification(
    'Mode Changed',
    `Switched to ${!isInternshipMode ? 'Internship' : 'Volunteer'} mode`,
    500
  );
};
```

### Push Notifications
```typescript
const scheduleNotification = async (title: string, body: string, delay = 0) => {
  await LocalNotifications.schedule({
    notifications: [{
      title,
      body,
      id: Math.floor(Math.random() * 10000),
      schedule: delay > 0 ? { at: new Date(Date.now() + delay) } : undefined,
    }]
  });
};
```

## 🔧 Development Notes

- The mobile app shares the same codebase as the web version
- Capacitor provides native functionality without affecting web performance
- Mobile-specific UI components are conditionally rendered based on platform
- All existing features (authentication, data, etc.) work seamlessly on mobile

## 📱 Testing the Mobile App

To test the mobile interface in a web browser, add `?mobile=true` to any URL:
```
https://yourdomain.com?mobile=true
```

This will render the mobile interface for testing purposes.

## 🚀 Quick Start for App Store Deployment

1. **Export to GitHub** using Lovable's export feature
2. **Clone locally** and run `git pull`
3. **Run** `npm install && npm run build && npx cap sync`
4. **Add platforms**: `npx cap add ios && npx cap add android` 
5. **Open in native IDEs**: `npx cap open ios` or `npx cap open android`
6. **Configure signing** and build for app stores

## 📄 License

This project is configured for mobile app store deployment with appropriate app identifiers and configurations.