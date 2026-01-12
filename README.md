# EduCheck App

Een React Native applicatie gebouwd met Expo voor het bijhouden van aanwezigheid en educatie-gerelateerde taken.

## Projectstructuur

```
EduCheckApp/
├── assets/              # Afbeeldingen, fonts en andere assets
│   ├── images/
│   └── fonts/
├── src/
│   └── screens/        # App schermen
│       ├── LoginScreen.jsx
│       ├── AttendanceScreen.jsx
│       └── SettingsScreen.jsx
├── App.js              # Hoofd app component
├── app.json            # Expo configuratie
└── package.json        # Project dependencies
```

## Technische Stack

- **Expo SDK**: 54.0.0
- **React Native**: 0.81.2
- **React**: 19.1.0

## Installatie

1. Installeer dependencies:
```bash
npm install
```

2. Start de development server:
```bash
npm start
```

3. Run de app:
- iOS Simulator: Druk `i` in de terminal
- Android Emulator: Druk `a` in de terminal
- Fysiek apparaat: Scan de QR code met Expo Go app

## Beschikbare Commands

- `npm start` - Start Expo development server
- `npm run ios` - Start op iOS simulator
- `npm run android` - Start op Android emulator
- `npm run web` - Start in web browser

## Features

- Login scherm voor authenticatie met school credentials
- Aanwezigheid bijhouden
- Instellingen beheer

## Development

De app is momenteel in ontwikkeling. De login flow is geïmplementeerd, verdere features worden toegevoegd.
