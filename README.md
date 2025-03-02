# Audience Synergy App

A mobile application built with Expo for managing RN and HCP audiences effectively.

## Overview

Audience Synergy is a professional audience management tool that allows users to create, manage, and track audiences for both Registered Nurses (RN) and Healthcare Professionals (HCP). It provides a clean, intuitive interface for defining audience parameters and filtering criteria.

## Features

- **Authentication System**: Secure login and registration
- **RN Audience Management**: Create and manage Registered Nurse audiences
- **HCP Audience Management**: Create and manage Healthcare Professional audiences
- **Advanced Filtering**: Filter audiences by specialties, states, and zip code regions
- **Geographic Logic**: Apply "AND" or "OR" logic to geographical filters
- **Responsive UI**: Optimized for both iOS and Android devices

## Project Structure

```
.
├── app/                          # Main application directory (Expo Router)
│   ├── _layout.tsx               # Root layout with authentication provider
│   ├── +not-found.tsx            # 404 page
│   ├── index.tsx                 # Entry point that handles authentication redirects
│   ├── (auth)/                   # Authentication routes
│   │   ├── login.tsx             # Login screen
│   │   └── register.tsx          # Registration screen
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx           # Tab navigation configuration
│   │   ├── index.tsx             # Home screen
│   │   ├── logout.tsx            # Logout screen
│   │   ├── hcp-audiences/        # HCP audience management screens
│   │   │   ├── [id].tsx          # View/edit HCP audience by ID
│   │   │   ├── create.tsx        # Create new HCP audience
│   │   │   └── index.tsx         # List of HCP audiences
│   │   └── rn-audiences/         # RN audience management screens
│   │       ├── [id].tsx          # View/edit RN audience by ID
│   │       ├── create.tsx        # Create new RN audience
│   │       └── index.tsx         # List of RN audiences
│   ├── api/                      # API schemas and types
│   │   └── schemas/
│   │       └── main.ts           # TypeScript interfaces for API
│   ├── components/               # Reusable components
│   │   ├── AudienceForm.tsx      # Form for creating/editing audiences
│   │   ├── AudienceListItem.tsx  # Component for displaying audience in list
│   │   ├── AuthForm.tsx          # Authentication form
│   │   ├── Button.tsx            # Custom button component
│   │   ├── Collapsible.tsx       # Expandable/collapsible component
│   │   ├── ErrorMessage.tsx      # Error message display
│   │   ├── ExternalLink.tsx      # External link handler
│   │   ├── HapticTab.tsx         # Tab with haptic feedback
│   │   ├── HelloWave.tsx         # Animated wave component
│   │   ├── Input.tsx             # Custom input component
│   │   ├── LoadingIndicator.tsx  # Loading indicator
│   │   ├── ParallaxScrollView.tsx # Scrollview with parallax effect
│   │   ├── ThemedText.tsx        # Theme-aware text component
│   │   ├── ThemedView.tsx        # Theme-aware view component
│   │   └── ui/                   # UI-specific components
│   │       ├── IconSymbol.ios.tsx # iOS-specific icon component
│   │       ├── IconSymbol.tsx     # Cross-platform icon component
│   │       ├── TabBarBackground.ios.tsx # iOS-specific tab bar
│   │       └── TabBarBackground.tsx # Cross-platform tab bar
│   ├── constants/                # Application constants
│   │   ├── Colors.ts             # Color definitions
│   │   └── api.ts                # API endpoints and configuration
│   └── hooks/                    # Custom React hooks
│       ├── useApi.ts             # API fetching hook
│       ├── useAudiences.ts       # Audience management hook
│       ├── useAuth.tsx           # Authentication hook
│       ├── useColorScheme.ts     # Theme detection hook
│       ├── useColorScheme.web.ts # Web-specific theme detection
│       └── useThemeColor.ts      # Theme color utility hook
├── assets/                       # Static assets directory
│   ├── fonts/                    # Custom fonts
│   └── images/                   # Image assets
├── attached_assets/              # Additional assets
│   └── openapi.json              # API specification
└── Various config files (app.json, eas.json, etc.)
```

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device for testing

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/audience-synergy-app.git
   cd audience-synergy-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Building for Production

### Creating a Preview Build

```bash
npx eas build --platform ios --profile preview
# or for Android
npx eas build --platform android --profile preview
```

### iOS Specific Setup

1. Create an Apple Developer account (requires $99/year subscription)
2. Set up code signing certificates and provisioning profiles
3. Register the app bundle identifier (com.exactnurse.audiencemanager)
4. Install the resulting preview build on your iOS device for testing

## Tech Stack

- [Expo](https://expo.dev/) - React Native framework
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [React Navigation](https://reactnavigation.org/) - Tab and stack navigation
- [SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) - Secure data storage
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animations
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## API Integration

The app connects to a FastAPI backend for audience data management. The API allows for:

- User authentication (login/registration)
- Creating and managing RN and HCP audiences
- Filtering audiences by various criteria

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request