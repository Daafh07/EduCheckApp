import { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemeProvider } from './ThemeContext';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'attendance', 'settings'

  const handleLogin = (data) => {
    console.log('Login data:', data);
    setCurrentScreen('attendance');
  };

  const handleNavigateToSettings = () => {
    setCurrentScreen('settings');
  };

  const handleNavigateBack = () => {
    setCurrentScreen('attendance');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  if (currentScreen === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (currentScreen === 'settings') {
    return (
      <SettingsScreen
        onNavigateBack={handleNavigateBack}
        onLogout={handleLogout}
      />
    );
  }

  return <AttendanceScreen onNavigateToSettings={handleNavigateToSettings} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
