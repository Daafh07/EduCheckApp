import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
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
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <StatusBar style="dark" />
      </>
    );
  }

  if (currentScreen === 'settings') {
    return (
      <>
        <SettingsScreen
          onNavigateBack={handleNavigateBack}
          onLogout={handleLogout}
        />
        <StatusBar style="dark" />
      </>
    );
  }

  return (
    <>
      <AttendanceScreen onNavigateToSettings={handleNavigateToSettings} />
      <StatusBar style="dark" />
    </>
  );
}
