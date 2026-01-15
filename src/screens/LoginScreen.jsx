import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../ThemeContext';
import { useLanguage } from '../../LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getAllCourses } from '../services/database';

const { height, width } = Dimensions.get('window');

const LoginScreen = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode, theme } = useTheme();
  const { t } = useLanguage();
  const { signIn } = useAuth();

  // Haal courses op bij mount
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      const { data, error } = await getAllCourses();
      if (!error && data) {
        setCourses(data);
      }
      setCoursesLoading(false);
    };
    fetchCourses();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Fout', 'Vul je email en wachtwoord in');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      Alert.alert('Login mislukt', error.message);
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

          {/* Course Dropdown */}
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>{t.school}</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, { backgroundColor: theme.inputBackground }]}
              onPress={() => setDropdownVisible(true)}
              disabled={coursesLoading}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  { color: selectedCourse ? theme.inputText : theme.placeholderText },
                ]}
              >
                {coursesLoading
                  ? 'Laden...'
                  : selectedCourse || t.school}
              </Text>
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <Path
                  d="M4 6L8 10L12 6"
                  stroke={theme.inputText}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Email */}
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

          {/* Password */}
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

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.inputBackground }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.text} />
            ) : (
              <>
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
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={[styles.dropdownModal, { backgroundColor: theme.card }]}>
            <Text style={[styles.dropdownTitle, { color: theme.text }]}>{t.school}</Text>
            <View style={[styles.dropdownDivider, { backgroundColor: theme.divider }]} />

            {courses.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: theme.placeholderText }]}>
                  Geen courses gevonden
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false}>
                {courses.map((course, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownItem,
                      { backgroundColor: selectedCourse === course ? theme.inputBackground : 'transparent' },
                    ]}
                    onPress={() => {
                      setSelectedCourse(course);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, { color: theme.text }]}>{course}</Text>
                    {selectedCourse === course && (
                      <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M20 6L9 17L4 12"
                          stroke={theme.text}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
    fontSize: 37,
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
    maxWidth: 369,
    padding: Math.round(width * 0.08),
    borderRadius: 31,
  },
  loginTitle: {
    textAlign: 'center',
    fontSize: Math.round(width * 0.07),
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
    fontSize: Math.round(width * 0.04),
    fontWeight: '600',
    marginBottom: Math.round(height * 0.01),
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  formInput: {
    width: '100%',
    height: Math.round(height * 0.055),
    paddingHorizontal: Math.round(width * 0.04),
    borderRadius: 31,
    fontSize: Math.round(width * 0.032),
    fontWeight: '600',
  },
  dropdownButton: {
    width: '100%',
    height: Math.round(height * 0.055),
    paddingHorizontal: Math.round(width * 0.04),
    borderRadius: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: Math.round(width * 0.032),
    fontWeight: '600',
    flex: 1,
  },
  loginButton: {
    width: '100%',
    height: Math.round(height * 0.055),
    borderRadius: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Math.round(width * 0.03),
    marginTop: Math.round(height * 0.025),
  },
  loginButtonText: {
    fontSize: Math.round(width * 0.04),
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownModal: {
    width: '100%',
    maxWidth: 340,
    maxHeight: height * 0.5,
    borderRadius: 20,
    padding: 20,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  dropdownDivider: {
    height: 1,
    marginBottom: 10,
    opacity: 0.5,
  },
  dropdownList: {
    maxHeight: height * 0.35,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
  },
});

export default LoginScreen;
