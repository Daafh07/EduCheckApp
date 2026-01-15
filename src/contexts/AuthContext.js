import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AUTH_STORAGE_KEY = '@educheck_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Haal opgeslagen gebruiker op bij app start
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  // Inloggen met email, wachtwoord en course_id tegen students tabel
  const signIn = async (email, password, courseId) => {
    try {
      // Zoek student op basis van email en wachtwoord
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        return {
          data: null,
          error: { message: 'Ongeldige email of wachtwoord' },
        };
      }

      // Valideer of de student bij de geselecteerde school hoort
      if (data.course_id !== courseId) {
        return {
          data: null,
          error: { message: 'Je bent niet ingeschreven bij deze school' },
        };
      }

      // Sla gebruiker op in state en AsyncStorage
      setUser(data);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: err.message || 'Er ging iets mis bij het inloggen' },
      };
    }
  };

  // Uitloggen
  const signOut = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      return { error: null };
    } catch (err) {
      return { error: { message: err.message } };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
