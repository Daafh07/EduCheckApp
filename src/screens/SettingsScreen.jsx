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
  Animated,
} from 'react-native';
import { Video, Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../ThemeContext';
import { useLanguage, languageNames } from '../../LanguageContext';

const { height, width } = Dimensions.get('window');

// iPad detection and responsive scaling
const isTablet = width >= 768;
const contentPadding = isTablet ? Math.round(width * 0.15) : Math.round(width * 0.09);

const SettingsScreen = ({ onNavigateBack, onLogout }) => {
  const { isDarkMode, toggleDarkMode, theme, isPartyMode, startPartyMode } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const [langModalVisible, setLangModalVisible] = React.useState(false);
  const [profilePictureModalVisible, setProfilePictureModalVisible] = React.useState(false);
  const [languageEasterEggActive, setLanguageEasterEggActive] = React.useState(false);
  const [chineseCharacters, setChineseCharacters] = React.useState([]);
  const longPressTimerRef = React.useRef(null);
  const profilePictureLongPressTimer = React.useRef(null);
  const videoRef = React.useRef(null);
  const soundRef = React.useRef(null);
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;
  const hapticIntervalRef = React.useRef(null);
  const easterEggTimerRef = React.useRef(null);
  const characterIntervalRef = React.useRef(null);

  // Chinese tekens voor de easter egg
  const chineseChars = ['你', '好', '世', '界', '龙', '福', '爱', '乐', '春', '喜', '财', '寿', '禅', '道', '气', '风', '水', '火', '山', '海'];

  const handleDarkModePressIn = () => {
    // Start timer for long press (2 seconds)
    longPressTimerRef.current = setTimeout(() => {
      startPartyMode();
    }, 2000);
  };

  const handleDarkModePressOut = () => {
    // Cancel timer if released before 2 seconds
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleProfilePicturePressIn = () => {
    profilePictureLongPressTimer.current = setTimeout(() => {
      setProfilePictureModalVisible(true);
    }, 800);
  };

  const handleProfilePicturePressOut = () => {
    if (profilePictureLongPressTimer.current) {
      clearTimeout(profilePictureLongPressTimer.current);
      profilePictureLongPressTimer.current = null;
    }
  };

  const createDancingCharacter = () => {
    const char = chineseChars[Math.floor(Math.random() * chineseChars.length)];
    const charSize = Math.round(width * 0.12); // Adaptieve character grootte
    const wobbleDistance = Math.round(width * 0.08); // Adaptieve wiebel afstand
    const startX = Math.random() * (width - charSize);
    const startY = -charSize;
    const animY = new Animated.Value(startY);
    const animX = new Animated.Value(startX);
    const animRotate = new Animated.Value(0);
    const animScale = new Animated.Value(0.5);
    const id = Date.now() + Math.random();

    const newChar = {
      id,
      char,
      animY,
      animX,
      animRotate,
      animScale,
    };

    setChineseCharacters(prev => [...prev, newChar]);

    // Animatie naar beneden met wiebelen
    Animated.parallel([
      Animated.timing(animY, {
        toValue: height + charSize,
        duration: 3000 + Math.random() * 2000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(animX, {
            toValue: startX + wobbleDistance,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: startX - wobbleDistance,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(animRotate, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animRotate, {
            toValue: -1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.sequence([
        Animated.timing(animScale, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Verwijder karakter na animatie
      setChineseCharacters(prev => prev.filter(c => c.id !== id));
    });
  };

  const startLanguageEasterEgg = async () => {
    setLanguageEasterEggActive(true);

    // Start muziek (language easter egg) - loopt tot easter egg stopt
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/lang.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
    } catch (error) {
      console.log('Error loading sound:', error);
    }

    // Start scherm trillen animatie (adaptief op basis van schermbreedte)
    const shakeIntensity = Math.round(width * 0.025);
    const shakeSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: shakeIntensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -shakeIntensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: shakeIntensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ])
    );
    shakeSequence.start();

    // Start haptic feedback interval (elke 200ms een zware haptic)
    hapticIntervalRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 200);

    // Start Chinese tekens spawnen (elke 150ms een nieuw teken)
    characterIntervalRef.current = setInterval(() => {
      createDancingCharacter();
    }, 150);

    // Stop alles na 10 seconden
    easterEggTimerRef.current = setTimeout(() => {
      stopLanguageEasterEgg();
    }, 10000);
  };

  const stopLanguageEasterEgg = async () => {
    setLanguageEasterEggActive(false);

    // Stop muziek
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    // Stop shake animatie
    shakeAnimation.stopAnimation();
    shakeAnimation.setValue(0);

    // Stop haptic interval
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }

    // Stop character spawning interval
    if (characterIntervalRef.current) {
      clearInterval(characterIntervalRef.current);
      characterIntervalRef.current = null;
    }

    // Stop easter egg timer
    if (easterEggTimerRef.current) {
      clearTimeout(easterEggTimerRef.current);
      easterEggTimerRef.current = null;
    }

    // Clear Chinese tekens
    setChineseCharacters([]);
  };

  const handleLanguagePress = () => {
    // Normale klik -> open language modal
    if (!languageEasterEggActive) {
      setLangModalVisible(true);
    }
  };

  const handleLanguageLongPress = () => {
    // 10 seconden ingedrukt -> start easter egg
    startLanguageEasterEgg();
  };

  const handleCloseModal = async () => {
    // Stop en reset de video
    if (videoRef.current) {
      await videoRef.current.stopAsync();
      await videoRef.current.setPositionAsync(0);
    }
    setProfilePictureModalVisible(false);
  };

  const handleVideoPlaybackStatusUpdate = (status) => {
    // Als de video is afgelopen, sluit de modal automatisch
    if (status.didJustFinish) {
      handleCloseModal();
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.background, transform: [{ translateX: shakeAnimation }] }]}>
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
            <TouchableOpacity
              onPressIn={handleProfilePicturePressIn}
              onPressOut={handleProfilePicturePressOut}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: 'https://api.builder.io/api/v1/image/assets/TEMP/a68693fb8aeee5e85741d318f7f389e2479ca8b4?width=130',
                }}
                style={styles.profileAvatar}
              />
            </TouchableOpacity>

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
            onPressIn={handleDarkModePressIn}
            onPressOut={handleDarkModePressOut}
            style={styles.rowButton}
            activeOpacity={0.6}
          >
            <Feather name={isPartyMode ? 'zap' : (isDarkMode ? 'sun' : 'moon')} size={Math.round(width * 0.06)} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>{isPartyMode ? 'PARTY MODE!' : t.darkMode}</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <TouchableOpacity
            style={styles.rowButton}
            activeOpacity={0.6}
            onPress={handleLanguagePress}
            onLongPress={handleLanguageLongPress}
            delayLongPress={3000}
          >
            <Feather name="globe" size={Math.round(width * 0.06)} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>{t.language}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language modal overlay */}
      {langModalVisible && (
        <View style={[styles.modalOverlay, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' }]} pointerEvents="box-none">
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#3a3a3a' : theme.card }]}>
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

      {/* Profile Picture modal overlay - Easter Egg Video! */}
      {profilePictureModalVisible && (
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,1)' }]}>
          <Video
            ref={videoRef}
            source={require('../../assets/easter-egg-video.mp4')}
            style={styles.videoFullScreen}
            resizeMode="contain"
            shouldPlay={true}
            isLooping={false}
            useNativeControls={false}
            onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
          />
        </View>
      )}

      {/* Chinese tekens easter egg overlay */}
      {languageEasterEggActive && chineseCharacters.map((charObj) => (
        <Animated.Text
          key={charObj.id}
          style={[
            styles.dancingChinese,
            {
              transform: [
                { translateX: charObj.animX },
                { translateY: charObj.animY },
                { rotate: charObj.animRotate.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-30deg', '30deg'],
                }) },
                { scale: charObj.animScale },
              ],
            },
          ]}
        >
          {charObj.char}
        </Animated.Text>
      ))}
    </Animated.View>
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
    fontSize: isTablet ? 44 : 37,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: contentPadding,
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
    fontSize: isTablet ? 34 : Math.round(width * 0.07),
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    left: Math.round(width * -0.015),
  },
  backButtonText: {
    fontSize: isTablet ? 34 : Math.round(width * 0.07),
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
    width: isTablet ? 80 : Math.round(width * 0.16),
    height: isTablet ? 80 : Math.round(width * 0.16),
    borderRadius: isTablet ? 40 : Math.round(width * 0.16),
  },
  profileName: {
    fontSize: isTablet ? 22 : Math.round(width * 0.045),
    fontWeight: '600',
    marginBottom: Math.round(height * 0.005),
  },
  profileRole: {
    fontSize: isTablet ? 16 : Math.round(width * 0.035),
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
    fontSize: isTablet ? 18 : Math.round(width * 0.04),
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
  },
  modalContainer: {
    width: isTablet ? 450 : Math.min(420, width - 60),
    borderRadius: 18,
    padding: isTablet ? 28 : 20,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: isTablet ? 16 : 12,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: isTablet ? 14 : 10,
    paddingHorizontal: 6,
  },
  modalRowText: {
    fontSize: isTablet ? 18 : 16,
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
  profilePictureModalContainer: {
    position: 'relative',
    width: Math.min(width * 0.9, 600),
    height: Math.min(width * 0.9, 600),
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureModal: {
    width: '100%',
    height: '100%',
    borderRadius: Math.round(width * 0.05),
  },
  videoFullScreen: {
    width: width,
    height: height,
  },
  dancingChinese: {
    position: 'absolute',
    fontSize: Math.round(width * 0.12),
    color: '#FF0000',
    fontWeight: 'bold',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: Math.round(width * 0.005), height: Math.round(width * 0.005) },
    textShadowRadius: Math.round(width * 0.012),
    zIndex: 9999,
  },
});

export default SettingsScreen;