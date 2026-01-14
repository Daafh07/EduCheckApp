import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';

/* =========================
   THEME (root colors)
const lightTheme = {
  background: '#FCF5FF',
  header: '#E6B3FF',
  card: '#F4DCFF',
  text: '#000000',
  divider: '#A27CB3',
  hover: 'rgba(0,0,0,0.06)',
};

const darkTheme = {
  background: '#121212',
  header: '#1E1E1E',
  card: '#242424',
  text: '#FFFFFF',
  divider: '#3A3A3A',
  hover: 'rgba(255,255,255,0.08)',
};

const SettingsScreen = ({ onNavigateBack, onLogout }) => {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <Text style={[styles.appTitle, { color: theme.text }]}>Edu Check</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Page header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity
            onPress={onNavigateBack}
            style={styles.backButton}
            activeOpacity={0.6}
          >
            <Text style={[styles.backButtonText, { color: theme.text }]}>←</Text>
          </TouchableOpacity>

          <Text style={[styles.pageTitle, { color: theme.text }]}>Settings</Text>
        </View>

        {/* Profile card */}
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: 'https://api.builder.io/api/v1/image/assets/TEMP/a68693fb8aeee5e85741d318f7f389e2479ca8b4?width=130',
              }}
              style={styles.profileAvatar}
            />

            <View>
              <Text style={[styles.profileName, { color: theme.text }]}>Cornelis de Witt</Text>
              <Text style={[styles.profileRole, { color: theme.text }]}>Student</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Logout */}
          <TouchableOpacity
            onPress={onLogout}
            style={styles.rowButton}
            activeOpacity={0.6}
          >
            <Feather name="log-out" size={Math.round(width * 0.06)} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Settings card */}
        <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
          {/* Dark mode */}
          <TouchableOpacity
            onPress={toggleDarkMode}
            style={styles.rowButton}
            activeOpacity={0.6}
          >
            <Feather name={isDarkMode ? 'sun' : 'moon'} size={Math.round(width * 0.06)} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>Dark mode</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Language */}
          <TouchableOpacity
            style={styles.rowButton}
            activeOpacity={0.6}
          >
            <Feather name="globe" size={Math.round(width * 0.06)} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>Language</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? Math.round(height * 0.08) : Math.round(height * 0.04),
    paddingBottom: Math.round(height * 0.025),
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    textAlign: 'center',
    fontSize: 37,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: Math.round(width * 0.09),
    paddingTop: Math.round(height * 0.03),
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.round(height * 0.03),
    position: 'relative',
  },
  pageTitle: {
    fontSize: Math.round(width * 0.07),
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    left: Math.round(width * -0.015),
  },
  backButtonText: {
    fontSize: Math.round(width * 0.07),
    fontWeight: '600',
  },
  profileCard: {
    padding: Math.round(width * 0.06),
    borderRadius: 31,
    marginBottom: Math.round(height * 0.032),
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.round(width * 0.035),
    marginBottom: 0,
  },
  profileAvatar: {
    width: Math.round(width * 0.16),
    height: Math.round(width * 0.16),
    borderRadius: Math.round(width * 0.16),
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: Math.round(width * 0.045),
    fontWeight: '600',
    marginBottom: Math.round(height * 0.005),
  },
  profileRole: {
    fontSize: Math.round(width * 0.035),
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: Math.round(height * 0.018),
    opacity: 0.5,
  },
  rowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.round(width * 0.025),
    paddingVertical: Math.round(height * 0.005),
  },
  rowText: {
    fontSize: Math.round(width * 0.04),
    fontWeight: '600',
  },
  settingsCard: {
    padding: Math.round(width * 0.055),
    paddingHorizontal: Math.round(width * 0.075),
    borderRadius: 31,
    marginBottom: Math.round(height * 0.05),
  },
});
/* =========================
   STYLES
const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.header,
      paddingTop: 80,
      paddingBottom: 20,
      alignItems: 'center',
    },
    appTitle: {
      color: theme.text,
      fontSize: 37,
      fontWeight: '600',
    },
    content: {
      paddingHorizontal: 35,
      paddingTop: 26,
    },
    pageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 25,
    },
    pageTitle: {
      color: theme.text,
      fontSize: 28,
      fontWeight: '600',
    },
    backButton: {
      position: 'absolute',
      left: 0,
    },
    backButtonText: {
      color: theme.text,
      fontSize: 28,
    },
    profileCard: {
      backgroundColor: theme.card,
      padding: 25,
      borderRadius: 31,
      marginBottom: 28,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    profileAvatar: {
      width: 65,
      height: 65,
      borderRadius: 65,
    },
    profileName: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '600',
    },
    profileRole: {
      color: theme.text,
      fontSize: 14,
    },
    settingsCard: {
      backgroundColor: theme.card,
      padding: 22,
      borderRadius: 31,
      marginBottom: 40,
    },
    divider: {
      height: 1,
      backgroundColor: theme.divider,
      opacity: 0.5,
      marginVertical: 20,
    },
    dividerTop: {
      height: 1,
      backgroundColor: theme.divider,
      opacity: 0.5,
      marginBottom: 20,
    },
    rowButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 8,
      borderRadius: 12,
      ...(Platform.OS === 'web' && { cursor: 'pointer' }),
    },
    rowText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
    },
    hover: {
      backgroundColor: theme.hover,
    },
  });

export default SettingsScreen;