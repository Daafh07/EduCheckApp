import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../ThemeContext';
import { useLanguage } from '../../LanguageContext';

const { height, width } = Dimensions.get('window');

// iPad detection and responsive scaling
const isTablet = width >= 768;

const LoginScreen = ({ onLogin }) => {
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isDarkMode, theme } = useTheme();
  const { t } = useLanguage();

  const handleSubmit = () => {
    if (onLogin) {
      onLogin({ school, email, password });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <Text style={[styles.appTitle, { color: theme.text }]}>{t.appName}</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.loginCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.loginTitle, { color: theme.text }]}>{t.login}</Text>
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>{t.school}</Text>
            <View style={styles.inputWrapper}>
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={styles.inputIcon}>
                <Path
                  d="M4 6L8 10L12 6"
                  stroke={theme.inputText}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <TextInput
                style={[styles.formInputWithIcon, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
                placeholder={t.school}
                placeholderTextColor={theme.placeholderText}
                value={school}
                onChangeText={setSchool}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>{t.studentMail}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.formInput, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
                placeholder="123456@student.fontys.nl"
                placeholderTextColor={theme.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>{t.educationPassword}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.formInput, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
                placeholder={t.educationPassword}
                placeholderTextColor={theme.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <TouchableOpacity style={[styles.loginButton, { backgroundColor: theme.inputBackground }]} onPress={handleSubmit}>
            <Text style={[styles.loginButtonText, { color: theme.text }]}>{t.login}</Text>
            <Svg width="21" height="21" viewBox="0 0 21 21" fill="none">
              <Path
                d="M12.25 4.375L18.375 10.5M18.375 10.5L12.25 16.625M18.375 10.5H2.625"
                stroke={theme.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: isTablet ? 44 : 37,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: Math.round(width * 0.09),
    paddingTop: Math.round(height * 0.08),
    alignItems: 'center',
  },
  loginCard: {
    width: '100%',
    maxWidth: isTablet ? 480 : 369,
    padding: Math.round(width * (isTablet ? 0.05 : 0.08)),
    borderRadius: 31,
  },
  loginTitle: {
    textAlign: 'center',
    fontSize: isTablet ? 32 : Math.round(width * 0.07),
    fontWeight: '600',
    marginBottom: Math.round(height * 0.008),
  },
  divider: {
    width: '100%',
    height: 1,
    marginBottom: Math.round(height * 0.025),
    opacity: 0.5,
  },
  formGroup: {
    marginBottom: Math.round(height * 0.032),
  },
  formLabel: {
    fontSize: isTablet ? 18 : Math.round(width * 0.04),
    fontWeight: '600',
    marginBottom: Math.round(height * 0.01),
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: Math.round(width * 0.04),
    zIndex: 1,
  },
  formInput: {
    width: '100%',
    height: isTablet ? 50 : Math.round(height * 0.055),
    paddingHorizontal: Math.round(width * 0.04),
    borderRadius: 31,
    fontSize: isTablet ? 16 : Math.round(width * 0.032),
    fontWeight: '600',
  },
  formInputWithIcon: {
    width: '100%',
    height: isTablet ? 50 : Math.round(height * 0.055),
    paddingLeft: Math.round(width * 0.1),
    paddingRight: Math.round(width * 0.04),
    borderRadius: 31,
    fontSize: isTablet ? 16 : Math.round(width * 0.032),
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
    height: isTablet ? 50 : Math.round(height * 0.055),
    borderRadius: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Math.round(width * 0.03),
    marginTop: Math.round(height * 0.025),
  },
  loginButtonText: {
    fontSize: isTablet ? 18 : Math.round(width * 0.04),
    fontWeight: '600',
  },
});

export default LoginScreen;
