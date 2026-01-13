import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.appTitle}>Edu Check</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Settings</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/a68693fb8aeee5e85741d318f7f389e2479ca8b4?width=130' }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>Cornelis de Witt</Text>
              <Text style={styles.profileRole}>Student</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 12H15M13 7C13 8.06087 12.5786 9.07828 11.8284 9.82843C11.0783 10.5786 10.0609 11 9 11C7.93913 11 6.92172 10.5786 6.17157 9.82843C5.42143 9.07828 5 8.06087 5 7C5 5.93913 5.42143 4.92172 6.17157 4.17157C6.92172 3.42143 7.93913 3 9 3C10.0609 3 11.0783 3.42143 11.8284 4.17157C12.5786 4.92172 13 5.93913 13 7ZM9 14C7.4087 14 5.88258 14.6321 4.75736 15.7574C3.63214 16.8826 3 18.4087 3 20V21H15V20C15 18.4087 14.3679 16.8826 13.2426 15.7574C12.1174 14.6321 10.5913 14 9 14Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.dividerTop} />

          <View style={styles.settingsOption}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M15.1946 15.8217C16.9231 16.1748 18.7172 16.0122 20.354 15.354C19.684 17.0213 18.5303 18.45 17.0415 19.4562C15.5527 20.4624 13.7969 21.0001 12 21C9.91037 20.9977 7.88662 20.2687 6.27565 18.9378C4.66467 17.6069 3.56683 15.757 3.17031 13.7054C2.77378 11.6537 3.10328 9.52805 4.10232 7.69272C5.10135 5.85739 6.7077 4.42673 8.64599 3.646C7.98779 5.28277 7.82514 7.0769 8.17827 8.80535C8.53139 10.5338 9.38472 12.1204 10.6322 13.3678C11.8796 14.6153 13.4662 15.4686 15.1946 15.8217Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.optionLabel}>Dark mode</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingsOption}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 5H15M9 3V5M10.048 14.5C8.5081 12.9059 7.27548 11.0413 6.412 9M12.5 18H19.5M11 21L16 11L21 21M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.optionLabel}>language</Text>
          </View>
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
