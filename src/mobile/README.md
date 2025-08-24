# Experiential Mobile App 📱

A Meta AI-inspired mobile application built with React, TypeScript, and Capacitor for cross-platform deployment.

## 🌟 Features

### Core Mobile Features
- **Meta AI-inspired UI/UX** with smooth animations and transitions
- **Native mobile detection** with automatic platform switching
- **Haptic feedback** for enhanced user interaction
- **Local push notifications** for engagement
- **Bottom navigation** with intuitive icons
- **Floating action buttons** for quick access
- **Safe area handling** for notched devices

### Key Components
- `MobileApp.tsx` - Main wrapper with routing and authentication
- `MobileHeader.tsx` - Sticky header with search, notifications, and profile
- `MobileNavigation.tsx` - Bottom navigation bar
- `MobileModeToggle.tsx` - Volunteer/Internship mode switcher
- `SplashScreen.tsx` - Beautiful launch screen with animations
- `useMobile.tsx` - Hook for haptics, notifications, and platform detection

## 🎨 Design System

### Meta AI-Inspired Animations
- `metaAiFadeIn` - Smooth fade-in with upward translation
- `metaAiSlideUp` - Slide-up animation with opacity
- `metaAiScale` - Scaling animation with pulse effect
- Haptic feedback animations for visual responses

### Mobile Styles
- Backdrop blur effects for modern glassmorphism
- Gradient backgrounds and shadows
- Safe area insets for iOS devices
- Responsive design patterns

## 🚀 Technical Stack

### Dependencies
- **@capacitor/core** - Cross-platform native functionality
- **@capacitor/haptics** - Native haptic feedback
- **@capacitor/local-notifications** - Push notifications
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling and responsive design
- **shadcn/ui** - UI components

### Platform Support
- **iOS** - Native app via Xcode
- **Android** - Native app via Android Studio
- **Web** - Progressive Web App (PWA)

## 📱 Mobile-Specific Features

### Native Enhancements
- Safe area handling for iOS notch and home indicator
- Native-feeling transitions and animations
- Touch-optimized interface elements
- Performance optimization for mobile devices
- Offline support capabilities

### Unique Meta AI Features
- Floating action buttons with backdrop blur
- Card designs with glassmorphism effects
- Smooth bottom navigation
- Contextual animations and micro-interactions
- Modern gradient backgrounds

## 🛠 Development

### File Structure
```
src/mobile/
├── components/
│   ├── MobileApp.tsx
│   ├── MobileHeader.tsx
│   ├── MobileNavigation.tsx
│   ├── MobileModeToggle.tsx
│   └── SplashScreen.tsx
├── hooks/
│   └── useMobile.tsx
├── styles/
│   └── mobile.css
├── index.ts
└── README.md
```

### Key Features Delivered
✅ Haptic feedback integration
✅ Push notifications
✅ Meta AI-inspired design
✅ Original website functionality preserved
✅ GitHub deployment ready
✅ Cross-platform compatibility

## 🔧 Deployment

### Build for Production
```bash
npm run build
npx cap sync
```

### iOS Deployment
```bash
npx cap open ios
# Build and deploy via Xcode
```

### Android Deployment
```bash
npx cap open android
# Build and deploy via Android Studio
```

## 📊 Status

✅ **Complete and Ready for Deployment**

The mobile app preserves all original website functionality while adding native mobile enhancements. The shared authentication and data ensure seamless user experience across platforms.

### What's Included
- All requested Meta AI design elements
- Complete mobile navigation system
- Native platform integrations
- Performance optimizations
- Cross-platform compatibility
- GitHub deployment structure

*The original website remains completely unaffected and continues to function independently.*