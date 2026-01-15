import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const THEME_STORAGE_KEY = '@educheck_dark_mode';

export const lightTheme = {
  background: '#FCF5FF',
  header: '#e19fff',
  card: '#f4dcff',
  text: '#000000',
  divider: '#A27CB3',
  inputBackground: '#FFFFFF',
  inputText: '#5C5C5C',
  placeholderText: '#9CA3AF',
};

export const darkTheme = {
  background: '#2b2b2b',
  header: '#ae61d2ff',
  card: '#b955e795',
  text: '#FFFFFF',
  divider: '#D373FF',
  inputBackground: '#3a3a3a',
  inputText: '#FFFFFF',
  placeholderText: '#CCCCCC',
};

const partyColors = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3',
  '#FF1493', '#00FFFF', '#FF00FF', '#FFD700', '#00FF7F', '#FF4500', '#1E90FF',
];

const getRandomColor = () => partyColors[Math.floor(Math.random() * partyColors.length)];

const generatePartyTheme = () => ({
  background: getRandomColor(),
  header: getRandomColor(),
  card: getRandomColor(),
  text: '#FFFFFF',
  divider: getRandomColor(),
  inputBackground: getRandomColor(),
  inputText: '#FFFFFF',
  placeholderText: '#FFFFFF',
});

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [partyTheme, setPartyTheme] = useState(generatePartyTheme());
  const [flashlightOn, setFlashlightOn] = useState(false);
  
  const partyIntervalRef = useRef(null);
  const partyTimeoutRef = useRef(null);
  const flashlightIntervalRef = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    loadThemePreference();
    setupAudio();
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.log('Error setting up audio:', error);
    }
  };

  const playPartyMusic = async () => {
    try {
      // Stop oude sound als die er is
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Laad en speel het party nummer
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/party-music.mp3'), // Zorg dat je een MP3 bestand hebt in assets/
        { shouldPlay: true, isLooping: true, volume: 0.8 }
      );
      
      soundRef.current = sound;
    } catch (error) {
      console.log('Error playing party music:', error);
    }
  };

  const stopPartyMusic = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (error) {
      console.log('Error stopping party music:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newValue.toString());
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const startFlashlightParty = () => {
    flashlightIntervalRef.current = setInterval(() => {
      setFlashlightOn(prev => !prev);
    }, 100); // Snelle strobo effect - perfect voor club vibes!
  };

  const stopFlashlightParty = () => {
    if (flashlightIntervalRef.current) {
      clearInterval(flashlightIntervalRef.current);
      flashlightIntervalRef.current = null;
    }
    setFlashlightOn(false);
  };

  const startPartyMode = () => {
    if (isPartyMode) return;
    
    setIsPartyMode(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    let beatCount = 0;
    
    // Start color party
    partyIntervalRef.current = setInterval(() => {
      setPartyTheme(generatePartyTheme());
      beatCount++;
      if (beatCount % 3 === 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, 150);

    // Start flashlight party
    startFlashlightParty();

    // Start party music
    playPartyMusic();

    // Auto-stop after 10 seconds
    partyTimeoutRef.current = setTimeout(() => {
      stopPartyMode();
    }, 10000);
  };

  const stopPartyMode = () => {
    if (partyIntervalRef.current) {
      clearInterval(partyIntervalRef.current);
      partyIntervalRef.current = null;
    }
    if (partyTimeoutRef.current) {
      clearTimeout(partyTimeoutRef.current);
      partyTimeoutRef.current = null;
    }
    
    stopFlashlightParty();
    stopPartyMusic();
    setIsPartyMode(false);
  };

  useEffect(() => {
    return () => {
      if (partyIntervalRef.current) clearInterval(partyIntervalRef.current);
      if (partyTimeoutRef.current) clearTimeout(partyTimeoutRef.current);
      if (flashlightIntervalRef.current) {
        clearInterval(flashlightIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      setFlashlightOn(false);
    };
  }, []);

  const theme = isPartyMode ? partyTheme : (isDarkMode ? darkTheme : lightTheme);

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      theme, 
      isLoading, 
      isPartyMode, 
      startPartyMode,
      flashlightOn
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};