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
import { useLanguage, languageNames } from '../../LanguageContext';

const { height, width } = Dimensions.get('window');

const SettingsScreen = ({ onNavigateBack, onLogout }) => {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const [langModalVisible, setLangModalVisible] = React.useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: theme.header }]}> 
        <Text style={[styles.appTitle, { color: theme.text }]}>{t.appName}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <TouchableOpacity
            onPress={onNavigateBack}
            style={styles.backButton}
            activeOpacity={0.6}
          >
            <Text style={[styles.backButtonText, { color: theme.text }]}>←</Text>
          </TouchableOpacity>

          <Text style={[styles.pageTitle, { color: theme.text }]}>{t.settings}</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={[styles.profileInfo]}>
            <Image
              source={{
                uri: 'https://api.builder.io/api/v1/image/assets/TEMP/a68693fb8aeee5e85741d318f7f389e2479ca8b4?width=130',
              }}
              style={styles.profileAvatar}
            />

            <View>
              <Text style={[styles.profileName, { color: theme.text }]}>Cornelis de Witt</Text>
              <Text style={[styles.profileRole, { color: theme.text }]}>{t.student}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <TouchableOpacity
            onPress={onLogout}
            style={styles.rowButton}
            activeOpacity={0.6}
          >
            <Feather name="log-out" size={Math.round(width * 0.06)} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>{t.logout}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            onPress={toggleDarkMode}
            style={styles.rowButton}
            activeOpacity={0.6}
          >
            <Feather name={isDarkMode ? 'sun' : 'moon'} size={Math.round(width * 0.06)} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>{t.darkMode}</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <TouchableOpacity
            style={styles.rowButton}
            activeOpacity={0.6}
            onPress={() => setLangModalVisible(true)}
          >
            <Feather name="globe" size={Math.round(width * 0.06)} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>{t.language}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language modal overlay */}
      {langModalVisible && (
        <View style={styles.modalOverlay} pointerEvents="box-none">
          <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t.selectLanguage}</Text>
            {Object.keys(languageNames).map((key) => (
              <TouchableOpacity
                key={key}
                onPress={async () => {
                  await changeLanguage(key);
                  setLangModalVisible(false);
                }}
                style={styles.modalRow}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalRowText, { color: theme.text }]}>{languageNames[key]}</Text>
                {language === key && <Feather name="check" size={18} color={theme.text} />}
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setLangModalVisible(false)} style={styles.modalClose} activeOpacity={0.7}>
              <Text style={[styles.modalCloseText, { color: theme.text }]}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalContainer: {
    width: Math.min(420, width - 60),
    borderRadius: 18,
    padding: 20,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  modalRowText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalClose: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default SettingsScreen;
