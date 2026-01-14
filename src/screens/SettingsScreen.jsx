import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';

const { height, width } = Dimensions.get('window');

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

export default SettingsScreen;
