import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@educheck_language';

export const translations = {
  en: {
    // App
    appName: 'Edu Check',
    dayNames: {
      Mon: 'Mon',
      Tue: 'Tue',
      Wed: 'Wed',
      Thu: 'Thu',
      Fri: 'Fri',
      Sat: 'Sat',
      Sun: 'Sun',
    },

    // Login
    login: 'Login',
    school: 'School',
    studentMail: 'Student Mail',
    educationPassword: 'Education Password',

    // Settings
    settings: 'Settings',
    logout: 'Logout',
    darkMode: 'Dark mode',
    language: 'Language',
    student: 'Student',
    selectLanguage: 'Select Language',

    // Attendance
    attendance: 'Attendance',
    day: 'Day',
    date: 'Date',
    status: 'Status',
    reason: 'Reason',
    note: 'Note',
    more: '...more',

    // Status
    present: 'Present',
    late: 'Late',
    absent: 'Absent',

    // Reasons
    doctorAppointment: 'Doctor appointment',
    sick: 'Sick',
    traffic: 'Traffic',
    missedBus: 'Missed bus',

    // Notes
    doctorNote: 'Student had a doctor appointment, which caused them to arrive a bit later than usual. This is not a problem.\n\n-Ronald',
    sickNote: 'Student was sick at home.',
    trafficNote: 'Traffic jam on the highway.',
    missedBusNote: 'Missed the bus because alarm went off late.',
    roadConstructionNote: 'Delay due to road construction.',
    close: 'Close',
  },
  nl: {
    // App
    appName: 'Edu Check',
    dayNames: {
      Mon: 'Ma',
      Tue: 'Di',
      Wed: 'Wo',
      Thu: 'Do',
      Fri: 'Vr',
      Sat: 'Za',
      Sun: 'Zo',
    },

    // Login
    login: 'Inloggen',
    school: 'School',
    studentMail: 'Student E-mail',
    educationPassword: 'Onderwijs Wachtwoord',

    // Settings
    settings: 'Instellingen',
    logout: 'Uitloggen',
    darkMode: 'Donkere modus',
    language: 'Taal',
    student: 'Student',
    selectLanguage: 'Selecteer Taal',

    // Attendance
    attendance: 'Aanwezigheid',
    day: 'Dag',
    date: 'Datum',
    status: 'Status',
    reason: 'Reden',
    note: 'Opmerking',
    more: '...meer',

    // Status
    present: 'Aanwezig',
    late: 'Te laat',
    absent: 'Afwezig',

    // Reasons
    doctorAppointment: 'Doktersafspraak',
    sick: 'Ziek',
    traffic: 'Verkeer',
    missedBus: 'Bus gemist',

    // Notes
    doctorNote: 'Leerling had een afspraak bij de dokter, hierdoor was de leerling iets later op school dan normaal. Dit is geen probleem.\n\n-Ronald',
    sickNote: 'Leerling was ziek thuis.',
    trafficNote: 'File op de snelweg.',
    missedBusNote: 'Bus gemist omdat de wekker te laat afging.',
    roadConstructionNote: 'Vertraging door wegwerkzaamheden.',
    close: 'Sluiten',
  },
  de: {
    // App
    appName: 'Edu Check',
    dayNames: {
      Mon: 'Mo',
      Tue: 'Di',
      Wed: 'Mi',
      Thu: 'Do',
      Fri: 'Fr',
      Sat: 'Sa',
      Sun: 'So',
    },

    // Login
    login: 'Anmelden',
    school: 'Schule',
    studentMail: 'Studenten E-Mail',
    educationPassword: 'Bildungs-Passwort',

    // Settings
    settings: 'Einstellungen',
    logout: 'Abmelden',
    darkMode: 'Dunkelmodus',
    language: 'Sprache',
    student: 'Student',
    selectLanguage: 'Sprache auswählen',

    // Attendance
    attendance: 'Anwesenheit',
    day: 'Tag',
    date: 'Datum',
    status: 'Status',
    reason: 'Grund',
    note: 'Anmerkung',
    more: '...mehr',

    // Status
    present: 'Anwesend',
    late: 'Verspätet',
    absent: 'Abwesend',

    // Reasons
    doctorAppointment: 'Arzttermin',
    sick: 'Krank',
    traffic: 'Verkehr',
    missedBus: 'Bus verpasst',

    // Notes
    doctorNote: 'Der Schüler hatte einen Arzttermin, weshalb er etwas später als gewöhnlich in der Schule ankam. Das ist kein Problem.\n\n-Ronald',
    sickNote: 'Der Schüler war krank zu Hause.',
    trafficNote: 'Stau auf der Autobahn.',
    missedBusNote: 'Bus verpasst, weil der Wecker zu spät klingelte.',
    roadConstructionNote: 'Verzögerung durch Straßenbauarbeiten.',
    close: 'Schließen',
  },
  es: {
    // App
    appName: 'Edu Check',
    dayNames: {
      Mon: 'Lun',
      Tue: 'Mar',
      Wed: 'Mié',
      Thu: 'Jue',
      Fri: 'Vie',
      Sat: 'Sáb',
      Sun: 'Dom',
    },

    // Login
    login: 'Iniciar sesión',
    school: 'Escuela',
    studentMail: 'Correo del estudiante',
    educationPassword: 'Contraseña educativa',

    // Settings
    settings: 'Ajustes',
    logout: 'Cerrar sesión',
    darkMode: 'Modo oscuro',
    language: 'Idioma',
    student: 'Estudiante',
    selectLanguage: 'Seleccionar idioma',

    // Attendance
    attendance: 'Asistencia',
    day: 'Día',
    date: 'Fecha',
    status: 'Estado',
    reason: 'Razón',
    note: 'Nota',
    more: '...más',

    // Status
    present: 'Presente',
    late: 'Tarde',
    absent: 'Ausente',

    // Reasons
    doctorAppointment: 'Cita con el médico',
    sick: 'Enfermo',
    traffic: 'Tráfico',
    missedBus: 'Perdió el autobús',

    // Notes
    doctorNote: 'El alumno tuvo una cita con el médico, lo que hizo que llegara un poco más tarde de lo habitual. Esto no es un problema.\n\n-Ronald',
    sickNote: 'El alumno estuvo enfermo en casa.',
    trafficNote: 'Atasco en la autopista.',
    missedBusNote: 'Perdió el autobús porque la alarma sonó tarde.',
    roadConstructionNote: 'Retraso debido a obras en la carretera.',
    close: 'Cerrar',
  },
};

export const languageNames = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  es: 'Español',
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage !== null) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading language preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.log('Error saving language preference:', error);
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
