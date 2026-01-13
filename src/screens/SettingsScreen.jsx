import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { height } = Dimensions.get('window');

const SettingsScreen = ({ onNavigateBack, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hovered, setHovered] = useState(null);

  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Edu Check</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Page header */}
        <View style={styles.pageHeader}>
          <Pressable
            onPress={onNavigateBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <Text style={styles.pageTitle}>Settings</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: 'https://api.builder.io/api/v1/image/assets/TEMP/a68693fb8aeee5e85741d318f7f389e2479ca8b4?width=130',
              }}
              style={styles.profileAvatar}
            />

            <View>
              <Text style={styles.profileName}>Cornelis de Witt</Text>
              <Text style={styles.profileRole}>Student</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Logout */}
          <Pressable
            onPress={onLogout}
            onHoverIn={() => setHovered('logout')}
            onHoverOut={() => setHovered(null)}
            style={[
              styles.rowButton,
              hovered === 'logout' && styles.hover,
            ]}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path
                d="M21 12H15M9 3C11.209 3 13 4.791 13 7C13 9.209 11.209 11 9 11C6.791 11 5 9.209 5 7C5 4.791 6.791 3 9 3ZM3 21C3 17.686 5.686 15 9 15C12.314 15 15 17.686 15 21"
                stroke={theme.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.rowText}>Logout</Text>
          </Pressable>
        </View>

        {/* Settings card */}
        <View style={styles.settingsCard}>
          <View style={styles.dividerTop} />

          {/* Dark mode */}
          <Pressable
            onPress={() => setIsDarkMode(!isDarkMode)}
            onHoverIn={() => setHovered('dark')}
            onHoverOut={() => setHovered(null)}
            style={[
              styles.rowButton,
              hovered === 'dark' && styles.hover,
            ]}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path
                d="M21 12.79A9 9 0 1111.21 3A7 7 0 0021 12.79z"
                stroke={theme.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.rowText}>Dark mode</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* Language */}
          <Pressable
            onHoverIn={() => setHovered('language')}
            onHoverOut={() => setHovered(null)}
            style={[
              styles.rowButton,
              hovered === 'language' && styles.hover,
            ]}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24">
              <Path
                fill={theme.text}
                d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4
       a1 1 0 01-1-1V4a1 1 0 011-1zm4.5 5
       h2.2l2.1 6h-1.9l-.4-1.3H8.5L8.1 14H6.3
       l2.2-6zm.3 3.6L9.1 9.8 8.5 11.6h1.3z
       M14.5 8h3v1.4h-1.1v1.7h1.4v1.4h-1.4
       v2.3h-1.5v-2.3h-1.4v-1.4h1.4V9.4h-1.1V8z"
              />
            </Svg>
            <Text style={styles.rowText}>Language</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF5FF',
  },
  header: {
    backgroundColor: '#E6B3FF',
    paddingTop: Platform.OS === 'ios' ? Math.round(height * 0.08) : Math.round(height * 0.04),
    paddingBottom: Math.round(height * 0.025),
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    color: '#000',
    textAlign: 'center',
    fontSize: 37,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 35,
    paddingTop: 26,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  pageTitle: {
    color: '#000',
    fontSize: 28,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    left: -6,
  },
  backButtonText: {
    color: '#000',
    fontSize: 28,
    fontWeight: '600',
  },
  profileCard: {
    padding: 25,
    borderRadius: 31,
    backgroundColor: '#F4DCFF',
    marginBottom: 28,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 23,
  },
  profileAvatar: {
    width: 65,
    height: 65,
    borderRadius: 65,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileRole: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#A27CB3',
    marginVertical: 23,
    opacity: 0.5,
  },
  dividerTop: {
    width: '100%',
    height: 1,
    backgroundColor: '#A27CB3',
    marginBottom: 22,
    opacity: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsCard: {
    padding: 22,
    paddingHorizontal: 30,
    borderRadius: 31,
    backgroundColor: '#F4DCFF',
    marginBottom: 40,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 3,
  },
  optionLabel: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
