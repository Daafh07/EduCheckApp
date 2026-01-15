import { useState, useEffect, useRef } from 'react';
import { View, Animated, Easing, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Defs, RadialGradient, LinearGradient, Stop, G, Path } from 'react-native-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import LoginScreen from './src/screens/LoginScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemeProvider, useTheme } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Confetti colors
const confettiColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF1493', '#FFD700', '#00FF7F'];

// Single confetti piece
const ConfettiPiece = ({ delay, startX }) => {
  const fallAnim = useRef(new Animated.Value(-50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  const size = 8 + Math.random() * 12;
  const isCircle = Math.random() > 0.5;
  const duration = 2500 + Math.random() * 1500;

  useEffect(() => {
    const startAnimation = () => {
      fallAnim.setValue(-50);
      rotateAnim.setValue(0);
      swayAnim.setValue(0);
      opacityAnim.setValue(1);

      Animated.parallel([
        Animated.timing(fallAnim, {
          toValue: screenHeight + 100,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 800 + Math.random() * 400,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(swayAnim, {
              toValue: 30,
              duration: 400 + Math.random() * 200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(swayAnim, {
              toValue: -30,
              duration: 400 + Math.random() * 200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.sequence([
          Animated.delay(duration * 0.7),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: duration * 0.3,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: 0,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: isCircle ? size / 2 : 2,
        opacity: opacityAnim,
        transform: [
          { translateY: fallAnim },
          { translateX: swayAnim },
          { rotate: spin },
        ],
      }}
      pointerEvents="none"
    />
  );
};

const Confetti = ({ visible }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (visible) {
      const newPieces = [];
      const totalPieces = 60;

      for (let i = 0; i < totalPieces; i++) {
        newPieces.push({
          id: i,
          delay: (i % 20) * 150 + Math.random() * 300,
          startX: Math.random() * screenWidth,
        });
      }
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [visible]);

  if (!visible || pieces.length === 0) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9997 }} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} delay={piece.delay} startX={piece.startX} />
      ))}
    </View>
  );
};

// Light ray colors
const rayColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF1493'];

// Light ray component
const LightRay = ({ angle, color, delay }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const lengthAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const randomDuration = 300 + Math.random() * 400;
    const randomDelay = Math.random() * 300;

    Animated.loop(
      Animated.sequence([
        Animated.delay(delay + randomDelay),
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(lengthAnim, {
            toValue: 1,
            duration: randomDuration,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(50 + Math.random() * 150),
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(lengthAnim, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(Math.random() * 400),
      ])
    ).start();
  }, []);

  const rayLength = screenHeight * 1.2;
  const rayWidth = 8 + Math.random() * 15;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: rayWidth,
        height: rayLength,
        opacity: opacityAnim,
        backgroundColor: color,
        transform: [
          { rotate: `${angle}deg` },
          {
            scaleY: lengthAnim,
          },
        ],
        borderRadius: rayWidth / 2,
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
      }}
    />
  );
};

const DancingImage = ({ visible }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Bounce up and down (dancing)
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -30,
            duration: 150,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 150,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Sway left and right
      Animated.loop(
        Animated.sequence([
          Animated.timing(swayAnim, {
            toValue: 15,
            duration: 300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(swayAnim, {
            toValue: -15,
            duration: 300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Scale pulse (like breathing/bobbing)
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Slight rotation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animations
      bounceAnim.setValue(0);
      swayAnim.setValue(0);
      scaleAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.dancingImageContainer,
        {
          transform: [
            { translateY: bounceAnim },
            { translateX: swayAnim },
            { scale: scaleAnim },
            { rotate: rotate },
          ],
        },
      ]}
      pointerEvents="none"
    >

      <Animated.Image
        source={require('./assets/images/party-image.png')}
        style={styles.dancingImage}
        resizeMode="contain"
      />
      
    </Animated.View>
  );
};

const BALL_SIZE = 150;

const DiscoBall = ({ visible }) => {
  const dropAnim = useRef(new Animated.Value(-250)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const swingAnim = useRef(new Animated.Value(0)).current;
  const [showRays, setShowRays] = useState(false);

  useEffect(() => {
    if (visible) {
      // Reset animations
      dropAnim.setValue(-250);
      rotateAnim.setValue(0);
      swingAnim.setValue(0);

      // Show rays after a small delay
      setTimeout(() => setShowRays(true), 300);

      // Drop down animation
      Animated.spring(dropAnim, {
        toValue: 50,
        friction: 4,
        tension: 35,
        useNativeDriver: true,
      }).start();

      // Continuous rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Gentle swing
      Animated.loop(
        Animated.sequence([
          Animated.timing(swingAnim, {
            toValue: 1,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(swingAnim, {
            toValue: -1,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      setShowRays(false);
      // Retract animation
      Animated.timing(dropAnim, {
        toValue: -250,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const swing = swingAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  if (!visible) return null;

  // Generate light rays at different angles
  const rays = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i * 22.5); // 16 rays, 22.5 degrees apart
    rays.push(
      <LightRay
        key={i}
        angle={angle}
        color={rayColors[i % rayColors.length]}
        delay={i * 60}
      />
    );
  }

  return (
    <>
      {showRays && (
        <View
          style={{
            position: 'absolute',
            top: 50 + 100 + BALL_SIZE / 2,
            left: screenWidth / 2,
            width: 0,
            height: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
          }}
          pointerEvents="none"
        >
          {rays}
        </View>
      )}

      <Animated.View
        style={[
          styles.discoBallContainer,
          {
            transform: [
              { translateY: dropAnim },
              { rotate: swing },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.discoString} />

        <Animated.View style={{ transform: [{ rotateY: spin }] }}>
          <Svg width={BALL_SIZE} height={BALL_SIZE} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id="ballGradient3D" cx="35%" cy="30%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="20%" stopColor="#E8E8E8" />
                <Stop offset="50%" stopColor="#A8A8A8" />
                <Stop offset="80%" stopColor="#606060" />
                <Stop offset="100%" stopColor="#404040" />
              </RadialGradient>

              <LinearGradient id="tileLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="50%" stopColor="#D0D0D0" />
                <Stop offset="100%" stopColor="#909090" />
              </LinearGradient>

              <LinearGradient id="tileMid" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#C0C0C0" />
                <Stop offset="50%" stopColor="#909090" />
                <Stop offset="100%" stopColor="#606060" />
              </LinearGradient>

              <LinearGradient id="tileDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#808080" />
                <Stop offset="50%" stopColor="#505050" />
                <Stop offset="100%" stopColor="#303030" />
              </LinearGradient>

              <RadialGradient id="sparkle" cx="30%" cy="30%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </RadialGradient>
            </Defs>

            <Ellipse cx="50" cy="96" rx="30" ry="4" fill="#000000" opacity="0.2" />

            <Circle cx="50" cy="50" r="44" fill="url(#ballGradient3D)" />

            <G>
              {[30, 42, 54, 66].map((x, i) => (
                <Rect key={`r1-${i}`} x={x} y="10" width="8" height="5" rx="1" fill="url(#tileLight)" opacity="0.9" />
              ))}

              {[22, 32, 42, 52, 62, 72].map((x, i) => (
                <Rect key={`r2-${i}`} x={x} y="18" width="8" height="6" rx="1" fill={i < 2 ? "url(#tileLight)" : "url(#tileMid)"} opacity="0.85" />
              ))}

              {[16, 26, 36, 46, 56, 66, 76].map((x, i) => (
                <Rect key={`r3-${i}`} x={x} y="26" width="8" height="7" rx="1" fill={i < 3 ? "url(#tileLight)" : "url(#tileMid)"} opacity="0.85" />
              ))}

              {[12, 22, 32, 42, 52, 62, 72, 82].map((x, i) => (
                <Rect key={`r4-${i}`} x={x} y="35" width="8" height="7" rx="1" fill={i < 3 ? "url(#tileLight)" : i > 5 ? "url(#tileDark)" : "url(#tileMid)"} opacity="0.8" />
              ))}

              {[10, 20, 30, 40, 50, 60, 70, 80].map((x, i) => (
                <Rect key={`r5-${i}`} x={x} y="44" width="9" height="8" rx="1" fill={i < 2 ? "url(#tileLight)" : i > 5 ? "url(#tileDark)" : "url(#tileMid)"} opacity="0.8" />
              ))}

              {[10, 20, 30, 40, 50, 60, 70, 80].map((x, i) => (
                <Rect key={`r6-${i}`} x={x} y="54" width="9" height="7" rx="1" fill={i < 2 ? "url(#tileMid)" : i > 5 ? "url(#tileDark)" : "url(#tileDark)"} opacity="0.75" />
              ))}

              {[14, 24, 34, 44, 54, 64, 74].map((x, i) => (
                <Rect key={`r7-${i}`} x={x} y="63" width="8" height="7" rx="1" fill={i < 2 ? "url(#tileMid)" : "url(#tileDark)"} opacity="0.7" />
              ))}

              {[20, 30, 40, 50, 60, 70].map((x, i) => (
                <Rect key={`r8-${i}`} x={x} y="72" width="8" height="6" rx="1" fill="url(#tileDark)" opacity="0.65" />
              ))}

              {[28, 40, 52, 64].map((x, i) => (
                <Rect key={`r9-${i}`} x={x} y="80" width="8" height="5" rx="1" fill="url(#tileDark)" opacity="0.6" />
              ))}
            </G>

            <Circle cx="28" cy="28" r="14" fill="url(#sparkle)" opacity="0.95" />
            <Circle cx="22" cy="35" r="6" fill="#FFFFFF" opacity="0.8" />
            <Circle cx="38" cy="20" r="4" fill="#FFFFFF" opacity="0.7" />

            <Circle cx="70" cy="32" r="5" fill="#FFFFFF" opacity="0.4" />
            <Circle cx="75" cy="45" r="3" fill="#FFFFFF" opacity="0.3" />

            <Path
              d="M 20 30 Q 10 50, 20 70"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              opacity="0.15"
            />

            <Circle cx="50" cy="50" r="44" fill="none" stroke="#303030" strokeWidth="1.5" />

            <Ellipse cx="50" cy="8" rx="10" ry="5" fill="#505050" />
            <Ellipse cx="50" cy="7" rx="8" ry="4" fill="#606060" />
            <Circle cx="50" cy="4" r="4" fill="#404040" />
            <Circle cx="48" cy="3" r="1.5" fill="#707070" opacity="0.6" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </>
  );
};

// Flashlight component met onzichtbare camera
const FlashlightController = ({ enabled }) => {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  if (!permission || !permission.granted || !enabled) {
    return null;
  }

  return (
    <CameraView
      style={{ width: 1, height: 1, position: 'absolute', opacity: 0 }}
      enableTorch={enabled}
      facing="back"
    />
  );
};

function AppContent() {
  const { isPartyMode, flashlightOn } = useTheme();
  const { user, loading, signOut } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('attendance'); // 'attendance', 'settings'

  // Toon loading indicator tijdens auth check
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const handleNavigateToSettings = () => {
    setCurrentScreen('settings');
  };

  const handleNavigateBack = () => {
    setCurrentScreen('attendance');
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentScreen('attendance');
  };

  const renderScreen = () => {
    // Als niet ingelogd, toon login scherm
    if (!user) {
      return <LoginScreen />;
    }

    if (currentScreen === 'settings') {
      return (
        <SettingsScreen
          onNavigateBack={handleNavigateBack}
          onLogout={handleLogout}
        />
      );
    }

    return <AttendanceScreen onNavigateToSettings={handleNavigateToSettings} />;
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <Confetti visible={isPartyMode} />
      <DiscoBall visible={isPartyMode} />
      <DancingImage visible={isPartyMode} />
      <FlashlightController enabled={flashlightOn} />
    </View>
  );
}

const styles = {
  discoBallContainer: {
    position: 'absolute',
    top: 0,
    left: screenWidth / 2 - BALL_SIZE / 2,
    alignItems: 'center',
    zIndex: 9999,
  },
  discoString: {
    width: 4,
    height: 100,
    backgroundColor: '#222222',
  },
  dancingImageContainer: {
    position: 'absolute',
    bottom: 30,
    justifyContent: 'center',
  },
  dancingImage: {
    width: 500,
    height: 650,
  },
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}