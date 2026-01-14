import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../../ThemeContext';
import { useLanguage } from '../../LanguageContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { height, width } = Dimensions.get('window');

const AttendanceScreen = ({ onNavigateToSettings }) => {
  const { isDarkMode, theme } = useTheme();
  const { t, language } = useLanguage();
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [noteExpanded, setNoteExpanded] = React.useState(false);
  const [displayPercentage, setDisplayPercentage] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState(null);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Animated values for chart
  const animatedPresentDash = React.useRef(new Animated.Value(0)).current;
  const animatedLateDash = React.useRef(new Animated.Value(0)).current;
  const animatedAbsentDash = React.useRef(new Animated.Value(0)).current;
  const animatedPercentage = React.useRef(new Animated.Value(0)).current;

  // Animated values for table rows
  const rowAnimations = React.useRef([]).current;

  const handleSelectDay = (day) => {
    if (selectedDay) {
      setSelectedDay(day);
      setNoteExpanded(false);
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedDay(day);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleBackPress = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedDay(null);
      setNoteExpanded(false);

      // Reset row animations
      attendanceData.forEach((_, index) => {
        const rowAnim = getRowAnimation(index);
        rowAnim.opacity.setValue(0);
        rowAnim.translateY.setValue(-30);
      });

      // Reset chart animations
      animatedPresentDash.setValue(0);
      animatedLateDash.setValue(0);
      animatedAbsentDash.setValue(0);
      animatedPercentage.setValue(0);
      setDisplayPercentage(0);

      fadeAnim.setValue(0);
      slideAnim.setValue(-50);

      // Start all animations together
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Restart chart animations immediately
      Animated.parallel([
        Animated.timing(animatedPresentDash, {
          toValue: presentDash,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedLateDash, {
          toValue: lateDash,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedAbsentDash, {
          toValue: absentDash,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedPercentage, {
          toValue: presentPercentage,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]).start();

      // Restart row animations immediately
      const animations = attendanceData.map((_, index) => {
        const rowAnim = getRowAnimation(index);
        return Animated.parallel([
          Animated.timing(rowAnim.opacity, {
            toValue: 1,
            duration: 400,
            delay: index * 50,
            useNativeDriver: true,
          }),
          Animated.timing(rowAnim.translateY, {
            toValue: 0,
            duration: 400,
            delay: index * 50,
            useNativeDriver: true,
          }),
        ]);
      });
      Animated.stagger(0, animations).start();
    });
  };

  const attendanceData = [
    { day: 'Mon', date: 'Dec 15', status: 'Present', color: '#E3A6FF', time: '08:30', reason: '', note: '' },
    { day: 'Fri', date: 'Dec 12', status: 'Present', color: '#E3A6FF', time: '08:25', reason: '', note: '' },
    { day: 'Thu', date: 'Dec 11', status: 'Late', color: '#5182FF', time: '09:42', reason: 'Doctor appointment', note: 'Student had a doctor appointment, which caused them to arrive a bit later than usual. This is not a problem.\n\n-Ronald' },
    { day: 'Wed', date: 'Dec 10', status: 'Present', color: '#E3A6FF', time: '08:28', reason: '', note: '' },
    { day: 'Tue', date: 'Dec 9', status: 'Absent', color: '#DE0000', time: '-', reason: 'Sick', note: 'Student was sick at home.' },
    { day: 'Mon', date: 'Dec 8', status: 'Absent', color: '#DE0000', time: '-', reason: 'Sick', note: 'Student was sick at home.' },
    { day: 'Fri', date: 'Dec 5', status: 'Present', color: '#E3A6FF', time: '08:32', reason: '', note: '' },
    { day: 'Thu', date: 'Dec 4', status: 'Late', color: '#5182FF', time: '09:15', reason: 'Traffic', note: 'Traffic jam on the highway.' },
    { day: 'Wed', date: 'Dec 3', status: 'Present', color: '#E3A6FF', time: '08:27', reason: '', note: '' },
    { day: 'Tue', date: 'Dec 2', status: 'Present', color: '#E3A6FF', time: '08:29', reason: '', note: '' },
    { day: 'Mon', date: 'Dec 1', status: 'Present', color: '#E3A6FF', time: '08:26', reason: '', note: '' },
    { day: 'Fri', date: 'Nov 28', status: 'Late', color: '#5182FF', time: '09:05', reason: 'Missed bus', note: 'Missed the bus because alarm went off late.' },
    { day: 'Thu', date: 'Nov 27', status: 'Late', color: '#5182FF', time: '08:50', reason: 'Traffic', note: 'Delay due to road construction.' },
    { day: 'Wed', date: 'Nov 26', status: 'Present', color: '#E3A6FF', time: '08:31', reason: '', note: '' },
    { day: 'Tue', date: 'Nov 25', status: 'Present', color: '#E3A6FF', time: '08:24', reason: '', note: '' },
    { day: 'Mon', date: 'Nov 24', status: 'Present', color: '#E3A6FF', time: '08:30', reason: '', note: '' },
    { day: 'Fri', date: 'Nov 21', status: 'Present', color: '#E3A6FF', time: '08:25', reason: '', note: '' },
    { day: 'Thu', date: 'Nov 20', status: 'Present', color: '#E3A6FF', time: '08:30', reason: '', note: '' },
  ];

  // Filter data based on status filter
  const filteredData = statusFilter
    ? attendanceData.filter(item => item.status === statusFilter)
    : attendanceData;

  // Calculate attendance statistics
  const totalDays = attendanceData.length;
  const presentCount = attendanceData.filter(item => item.status === 'Present').length;
  const lateCount = attendanceData.filter(item => item.status === 'Late').length;
  const absentCount = attendanceData.filter(item => item.status === 'Absent').length;

  const presentPercentage = Math.round((presentCount / totalDays) * 100);

  // Calculate stroke dash arrays for the circle (circumference ≈ 660)
  const circumference = 660;
  const presentDash = (presentCount / totalDays) * circumference;
  const lateDash = (lateCount / totalDays) * circumference;
  const absentDash = (absentCount / totalDays) * circumference;

  // Get or create animated value for a row
  const getRowAnimation = (index) => {
    if (!rowAnimations[index]) {
      rowAnimations[index] = {
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(-30),
      };
    }
    return rowAnimations[index];
  };

  // Animate chart values when data changes
  React.useEffect(() => {
    // Add listener to update display percentage during animation
    const listenerId = animatedPercentage.addListener(({ value }) => {
      setDisplayPercentage(Math.round(value));
    });

    Animated.parallel([
      Animated.timing(animatedPresentDash, {
        toValue: presentDash,
        duration: 1200,
        useNativeDriver: false,
      }),
      Animated.timing(animatedLateDash, {
        toValue: lateDash,
        duration: 1200,
        useNativeDriver: false,
      }),
      Animated.timing(animatedAbsentDash, {
        toValue: absentDash,
        duration: 1200,
        useNativeDriver: false,
      }),
      Animated.timing(animatedPercentage, {
        toValue: presentPercentage,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();

    // Cleanup listener on unmount
    return () => {
      animatedPercentage.removeListener(listenerId);
    };
  }, [presentDash, lateDash, absentDash, presentPercentage]);

  // Animate table rows on mount
  React.useEffect(() => {
    const animations = attendanceData.map((_, index) => {
      const rowAnim = getRowAnimation(index);
      return Animated.parallel([
        Animated.timing(rowAnim.opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(rowAnim.translateY, {
          toValue: 0,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(0, animations).start();
  }, []);

  if (selectedDay) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <View style={[styles.header, { backgroundColor: theme.header }]}>
          <Text style={[styles.appTitle, { color: theme.text }]}>Edu Check</Text>
        </View>

        <Animated.View style={[styles.detailContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.detailHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.6}
            >
              <Text style={[styles.backButtonText, { color: theme.text }]}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.detailTitle, { color: theme.text }]}>
              {selectedDay.day} {selectedDay.date.toLowerCase()}
            </Text>
          </View>

          <View style={styles.detailInfoContainer}>
            <View style={[styles.statusBadge, { backgroundColor: theme.card }]}>
              <View style={[styles.statusDot, { backgroundColor: selectedDay.color }]} />
              <Text style={[styles.statusText, { color: theme.text }]}>{selectedDay.status}</Text>
              <Text style={[styles.statusTime, { color: theme.text }]}>{selectedDay.time}</Text>
            </View>

            <View style={[styles.reasonSection, { backgroundColor: theme.card }]}>
              <Text style={[styles.reasonText, { color: theme.text }]}>
                {selectedDay.reason ? `${t.reason}: ${selectedDay.reason}` : `${t.reason}: -`}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.noteSection, { backgroundColor: theme.card }, noteExpanded && styles.noteSectionExpanded]}
              onPress={() => {
                if (selectedDay.note && selectedDay.note.split(' ').length > 10) {
                  setNoteExpanded(!noteExpanded);
                }
              }}
              activeOpacity={selectedDay.note && selectedDay.note.split(' ').length > 10 ? 0.7 : 1}
              disabled={!selectedDay.note || selectedDay.note.split(' ').length <= 10}
            >
              <Text style={[styles.noteLabel, { color: theme.text }]}>{t.note}:</Text>
              <View style={[styles.noteBox, { backgroundColor: theme.inputBackground }]}>
                <Text style={[styles.noteText, { color: theme.text }]}>
                  {selectedDay.note
                    ? (noteExpanded
                      ? selectedDay.note
                      : selectedDay.note.split(' ').length > 10
                      ? selectedDay.note.split(' ').slice(0, 10).join(' ') + ' ' + t.more
                      : selectedDay.note)
                    : '-'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />

          <View style={styles.tableHeader}>
            <View style={styles.headerDay}>
              <Text style={[styles.headerText, { color: theme.text }]}>{t.day}</Text>
            </View>
            <View style={styles.headerCol}>
              <Text style={[styles.headerText, { color: theme.text }]}>{t.date}</Text>
            </View>
            <View style={styles.headerCol}>
              <Text style={[styles.headerText, { color: theme.text }]}>{t.status}</Text>
            </View>
          </View>

          <View style={styles.tableContainer}>
            <Animated.FlatList
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={({ item, index }) => {
                const rowAnim = getRowAnimation(index);
                return (
                  <Animated.View
                    style={{
                      opacity: rowAnim.opacity,
                      transform: [{ translateY: rowAnim.translateY }],
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.tableRow,
                        selectedDay && selectedDay.day === item.day && selectedDay.date === item.date && [styles.selectedRow, { backgroundColor: theme.card }]
                      ]}
                      onPress={() => handleSelectDay(item)}
                      activeOpacity={0.6}
                    >
                      <View style={styles.dayCell}>
                        <View style={styles.dotColumn}>
                          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                        </View>
                        <Text style={[styles.cellText, { color: theme.text }]}>{(t.dayNames && t.dayNames[item.day]) || item.day}</Text>
                      </View>
                      <View style={styles.cellWrapper}>
                        <Text style={[styles.cellText, { color: theme.text }]}>{(() => {
                          // try to parse date like 'Dec 15' or 'Dec 15' with year - fallback to original
                          try {
                            // If item.date contains a month name and day, append a year fallback
                            const parsed = new Date(item.date);
                            if (!isNaN(parsed)) {
                              return new Intl.DateTimeFormat(language, { month: 'short', day: 'numeric' }).format(parsed);
                            }
                          } catch (e) {}
                          return item.date;
                        })()}</Text>
                      </View>
                      <View style={styles.cellWrapper}>
                        <Text style={[styles.cellText, { color: theme.text }]}>{t[item.status.toLowerCase()] || item.status}</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
            <Svg style={styles.fadeOverlay} width={width} height={180} pointerEvents="box-none">
              <Defs>
                <LinearGradient id="fadeGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={theme.background} stopOpacity="0" />
                  <Stop offset="15%" stopColor={theme.background} stopOpacity="0.3" />
                  <Stop offset="35%" stopColor={theme.background} stopOpacity="0.65" />
                  <Stop offset="55%" stopColor={theme.background} stopOpacity="0.88" />
                  <Stop offset="75%" stopColor={theme.background} stopOpacity="0.97" />
                  <Stop offset="100%" stopColor={theme.background} stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#fadeGradient)" pointerEvents="none" />
            </Svg>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <Text style={[styles.appTitle, { color: theme.text }]}>Edu Check</Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.pageTitle, { color: theme.text }]}>{t.attendance}</Text>
          <TouchableOpacity onPress={onNavigateToSettings} style={styles.settingsButton}>
            <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke={theme.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
                stroke={theme.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.chartContainer}>
          <Svg width={Math.min(width * 0.65, 280)} height={Math.min(width * 0.65, 280)} viewBox="0 0 300 300">
            <AnimatedCircle
              cx="150"
              cy="150"
              r="105"
              fill="none"
              stroke={statusFilter === 'Present' ? '#d18aff' : '#e19fff'}
              strokeWidth={statusFilter === 'Present' ? 65 : 60}
              strokeDasharray={animatedPresentDash.interpolate({
                inputRange: [0, circumference],
                outputRange: [`0 ${circumference}`, `${circumference} ${circumference}`],
              })}
              strokeDashoffset="0"
              transform="rotate(-90 150 150)"
            />
            <AnimatedCircle
              cx="150"
              cy="150"
              r="105"
              fill="none"
              stroke={statusFilter === 'Late' ? '#3d6edb' : '#5182FF'}
              strokeWidth={statusFilter === 'Late' ? 65 : 60}
              strokeDasharray={animatedLateDash.interpolate({
                inputRange: [0, circumference],
                outputRange: [`0 ${circumference}`, `${circumference} ${circumference}`],
              })}
              strokeDashoffset={animatedPresentDash.interpolate({
                inputRange: [0, circumference],
                outputRange: [0, -circumference],
              })}
              transform="rotate(-90 150 150)"
            />
            <AnimatedCircle
              cx="150"
              cy="150"
              r="105"
              fill="none"
              stroke={statusFilter === 'Absent' ? '#b00000' : '#DE0000'}
              strokeWidth={statusFilter === 'Absent' ? 65 : 60}
              strokeDasharray={animatedAbsentDash.interpolate({
                inputRange: [0, circumference],
                outputRange: [`0 ${circumference}`, `${circumference} ${circumference}`],
              })}
              strokeDashoffset={Animated.add(animatedPresentDash, animatedLateDash).interpolate({
                inputRange: [0, circumference * 2],
                outputRange: [0, -circumference * 2],
              })}
              transform="rotate(-90 150 150)"
            />
            <Circle cx="150" cy="150" r="82" fill={theme.background} />
          </Svg>

          {/* Clickable overlay - entire circle */}
          <TouchableOpacity
            style={styles.chartClickableArea}
            onPress={(e) => {
              const { locationX, locationY } = e.nativeEvent;
              const centerX = (Math.min(width * 0.65, 280)) / 2;
              const centerY = (Math.min(width * 0.65, 280)) / 2;

              // Calculate angle from center
              const dx = locationX - centerX;
              const dy = locationY - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              // Check if click is in the ring (between radius 75 and 135)
              const innerRadius = 75;
              const outerRadius = 135;

              if (distance >= innerRadius && distance <= outerRadius) {
                let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                angle = (angle + 90 + 360) % 360; // Adjust so 0° is at top

                // Determine which segment based on angle and segment sizes
                const presentAngle = (presentCount / totalDays) * 360;
                const lateAngle = (lateCount / totalDays) * 360;
                const absentAngle = (absentCount / totalDays) * 360;

                if (angle < presentAngle) {
                  setStatusFilter(statusFilter === 'Present' ? null : 'Present');
                } else if (angle < presentAngle + lateAngle) {
                  setStatusFilter(statusFilter === 'Late' ? null : 'Late');
                } else if (angle < presentAngle + lateAngle + absentAngle) {
                  setStatusFilter(statusFilter === 'Absent' ? null : 'Absent');
                } else {
                  setStatusFilter(statusFilter === 'Present' ? null : 'Present');
                }
              } else if (distance < innerRadius) {
                // Click in center - reset filter
                setStatusFilter(null);
              }
            }}
            activeOpacity={1}
          >
            <Text style={[styles.chartPercentage, { color: theme.text }]}>
              {displayPercentage}%
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
        <View style={styles.tableHeader}>
          <View style={styles.headerDay}>
            <Text style={[styles.headerText, { color: theme.text }]}>{t.day}</Text>
          </View>
          <View style={styles.headerCol}>
            <Text style={[styles.headerText, { color: theme.text }]}>{t.date}</Text>
          </View>
          <View style={styles.headerCol}>
            <Text style={[styles.headerText, { color: theme.text }]}>{t.status}</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <Animated.FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item, index }) => {
              const rowAnim = getRowAnimation(index);
              return (
                <Animated.View
                  style={{
                    opacity: rowAnim.opacity,
                    transform: [{ translateY: rowAnim.translateY }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.tableRow,
                      selectedDay && selectedDay.day === item.day && selectedDay.date === item.date && [styles.selectedRow, { backgroundColor: theme.card }]
                    ]}
                    onPress={() => handleSelectDay(item)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.dayCell}>
                      <View style={styles.dotColumn}>
                        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                      </View>
                      <Text style={[styles.cellText, { color: theme.text }]}>{(t.dayNames && t.dayNames[item.day]) || item.day}</Text>
                    </View>
                    <View style={styles.cellWrapper}>
                      <Text style={[styles.cellText, { color: theme.text }]}>{(() => {
                        // try to parse date like 'Dec 15' or 'Dec 15' with year - fallback to original
                        try {
                          // If item.date contains a month name and day, append a year fallback
                          const parsed = new Date(item.date);
                          if (!isNaN(parsed)) {
                            return new Intl.DateTimeFormat(language, { month: 'short', day: 'numeric' }).format(parsed);
                          }
                        } catch (e) {}
                        return item.date;
                      })()}</Text>
                    </View>
                    <View style={styles.cellWrapper}>
                      <Text style={[styles.cellText, { color: theme.text }]}>{t[item.status.toLowerCase()] || item.status}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
          <Svg style={styles.fadeOverlay} width={width} height={180} pointerEvents="box-none">
            <Defs>
              <LinearGradient id="fadeGradient2" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={theme.background} stopOpacity="0" />
                <Stop offset="15%" stopColor={theme.background} stopOpacity="0.3" />
                <Stop offset="35%" stopColor={theme.background} stopOpacity="0.65" />
                <Stop offset="55%" stopColor={theme.background} stopOpacity="0.88" />
                <Stop offset="75%" stopColor={theme.background} stopOpacity="0.97" />
                <Stop offset="100%" stopColor={theme.background} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#fadeGradient2)" pointerEvents="none" />
          </Svg>
        </View>
      </Animated.View>
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
    paddingTop: Math.round(height * 0.028),
    position: 'relative',
  },
  detailContent: {
    flex: 1,
    paddingHorizontal: Math.round(width * 0.09),
    paddingTop: Math.round(height * 0.028),
    position: 'relative',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.round(height * 0.018),
    position: 'relative',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Math.round(height * 0.008),
    marginBottom: Math.round(height * 0.025),
    position: 'relative',
  },
  chartPercentage: {
    fontSize: Math.round(width * 0.085),
    fontWeight: '600',
  },
  chartClickableArea: {
    position: 'absolute',
    width: Math.min(width * 0.65, 280),
    height: Math.min(width * 0.65, 280),
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailInfoContainer: {
    height: Math.min(width * 0.65, 280) + Math.round(height * 0.008) + Math.round(height * 0.025),
    marginVertical: Math.round(height * 0.008),
    marginBottom: Math.round(height * 0.025),
  },
  dividerLine: {
    height: 2,
    marginHorizontal: 15,
    borderRadius: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: Math.round(height * 0.022),
    paddingHorizontal: Math.round(width * 0.05),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    paddingBottom: Math.round(height * 0.05),
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    pointerEvents: 'none',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Math.round(height * 0.014),
    paddingHorizontal: Math.round(width * 0.05),
    justifyContent: 'space-between',
  },
  selectedRow: {
    borderRadius: 31,
  },
  dotColumn: {
    position: 'absolute',
    left: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDay: {
    width: width * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCol: {
    width: width * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCell: {
    width: width * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cellWrapper: {
    width: width * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.round(height * 0.018),
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: -6,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Math.round(height * 0.012),
    paddingHorizontal: Math.round(width * 0.06),
    borderRadius: 31,
    marginBottom: Math.round(height * 0.018),
  },
  statusDot: {
    width: Math.round(width * 0.026),
    height: Math.round(width * 0.026),
    borderRadius: Math.round(width * 0.013),
    marginRight: Math.round(width * 0.02),
  },
  statusText: {
    fontSize: Math.round(width * 0.05),
    fontWeight: '600',
    flex: 1,
  },
  statusTime: {
    fontSize: Math.round(width * 0.05),
    fontWeight: '600',
  },
  reasonSection: {
    paddingVertical: Math.round(height * 0.015),
    paddingHorizontal: Math.round(width * 0.06),
    borderRadius: 31,
    marginBottom: Math.round(height * 0.018),
  },
  reasonText: {
    fontSize: Math.round(width * 0.04),
    fontWeight: '600',
  },
  noteSection: {
    paddingVertical: Math.round(height * 0.02),
    paddingHorizontal: Math.round(width * 0.06),
    borderRadius: 22,
    marginBottom: Math.round(height * 0.018),
  },
  noteSectionExpanded: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
  },
  noteLabel: {
    fontSize: Math.round(width * 0.04),
    fontWeight: '600',
    marginBottom: Math.round(height * 0.018),
  },
  noteBox: {
    padding: Math.round(width * 0.05),
    borderRadius: 13,
    marginBottom: Math.round(height * 0.007),
  },
  noteText: {
    fontSize: Math.round(width * 0.035),
    fontWeight: '400',
    lineHeight: Math.round(width * 0.06),
  },
});

export default AttendanceScreen;
