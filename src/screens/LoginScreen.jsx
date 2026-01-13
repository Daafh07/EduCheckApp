import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar, Dimensions,
} from 'react-native';
import Svg, { Path, Rect, G, Defs, Filter, FeFlood, FeBlend, FeGaussianBlur } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

const LoginScreen = ({ onLogin }) => {
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (onLogin) {
      onLogin({ school, email, password });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.appTitle}>Edu Check</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Login</Text>
          <View style={styles.divider} />

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>School</Text>
            <View style={styles.inputWrapper}>
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={styles.inputIcon}>
                <Path
                  d="M4 6L8 10L12 6"
                  stroke="#5C5C5C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <TextInput
                style={styles.formInputWithIcon}
                placeholder="School"
                placeholderTextColor="#9CA3AF"
                value={school}
                onChangeText={setSchool}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Student Mail</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.formInput}
                placeholder="123456@student.fontys.nl"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Education Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.formInput}
                placeholder="password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>Login</Text>
            <Svg width="21" height="21" viewBox="0 0 21 21" fill="none">
              <Path
                d="M12.25 4.375L18.375 10.5M18.375 10.5L12.25 16.625M18.375 10.5H2.625"
                stroke="black"
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
    backgroundColor: '#FCF5FF',
  },
  header: {
    backgroundColor: '#E6B3FF',
    paddingTop: Math.round(height * 0.08),
    paddingBottom: Math.round(height * 0.025),
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    color: '#000',
    fontSize: 37,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: Math.round(width * 0.09),
    paddingTop: Math.round(height * 0.028),
    position: 'relative',
  },
  loginCard: {
    width: '100%',
    maxWidth: 369,
    padding: 20,
    borderRadius: 31,
    backgroundColor: '#F4DCFF',
  },
  loginTitle: {
    color: '#000',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#A27CB3',
    marginBottom: 22,
    opacity: 0.5,
  },
  formGroup: {
    marginBottom: 28,
  },
  formLabel: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 20,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  formInput: {
    width: '100%',
    height: 43,
    paddingHorizontal: 16,
    borderRadius: 31,
    backgroundColor: '#FFF',
    color: '#5C5C5C',
    fontSize: 12,
    fontWeight: '600',
  },
  formInputWithIcon: {
    width: '100%',
    height: 43,
    paddingLeft: 40,
    paddingRight: 16,
    borderRadius: 31,
    backgroundColor: '#FFF',
    color: '#5C5C5C',
    fontSize: 12,
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
    height: 43,
    borderRadius: 31,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
