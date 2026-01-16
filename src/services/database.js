import { supabase } from '../config/supabase';

// ============ COURSES ============

// Haal alle courses op uit de courses tabel (voor dropdown in login)
export const getAllCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('id, name, city')
    .order('name', { ascending: true });

  return { data, error };
};

// ============ STUDENTS ============

// Haal student op basis van email (gekoppeld aan auth user)
export const getStudentByEmail = async (email) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('email', email)
    .single();

  return { data, error };
};

// Haal student op basis van ID
export const getStudentById = async (id) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
};

// ============ ATTENDANCE ============

// Haal alle aanwezigheidsdata voor een student op basis van badge_number
export const getAttendanceByBadgeNumber = async (badgeNumber) => {
  // Probeer eerst als string
  let { data, error } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('badge_number', String(badgeNumber))
    .order('date', { ascending: false });

  // Als geen resultaten, probeer als nummer (voor het geval de kolom integer is)
  if ((!data || data.length === 0) && !isNaN(badgeNumber)) {
    const result = await supabase
      .from('attendance_sessions')
      .select('*')
      .eq('badge_number', Number(badgeNumber))
      .order('date', { ascending: false });

    data = result.data;
    error = result.error;
  }

  console.log('[database] getAttendanceByBadgeNumber:', {
    searchedFor: badgeNumber,
    foundRecords: data?.length || 0
  });

  return { data, error };
};

// Haal aanwezigheid op voor een specifieke periode
export const getAttendanceByDateRange = async (badgeNumber, startDate, endDate) => {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('badge_number', badgeNumber)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  return { data, error };
};

// ============ NOTES ============

// Haal notities op voor een student
export const getNotesForStudent = async (studentId) => {
  const { data, error } = await supabase
    .from('notes')
    .select(`
      *,
      teachers (
        full_name
      )
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  return { data, error };
};

// Haal notitie op voor een specifieke datum/sessie
export const getNoteForSession = async (studentId, date) => {
  const { data, error } = await supabase
    .from('notes')
    .select(`
      *,
      teachers (
        full_name
      )
    `)
    .eq('student_id', studentId)
    .gte('created_at', `${date}T00:00:00`)
    .lt('created_at', `${date}T23:59:59`)
    .single();

  return { data, error };
};

// ============ TEACHERS ============

// Haal teacher op basis van ID
export const getTeacherById = async (id) => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
};

// ============ CHECK-IN ============

// Schooldag start tijd (09:00)
const SCHOOL_START_HOUR = 9;
const SCHOOL_START_MINUTE = 0;

// Check of een tijd op of voor de starttijd is
const isOnTimeOrEarly = (checkInTime) => {
  const hours = checkInTime.getHours();
  const minutes = checkInTime.getMinutes();

  // Op tijd: voor 09:00 OF precies 09:00
  if (hours < SCHOOL_START_HOUR) return true;
  if (hours === SCHOOL_START_HOUR && minutes <= SCHOOL_START_MINUTE) return true;
  return false;
};

// ============ DAGELIJKSE AFWEZIGHEID ============

// Zet ALLE studenten op afwezig voor vandaag
// Dit moet elke dag worden uitgevoerd (bijv. via cron job of bij app start)
// Maakt voor elke student een sessie aan met checked_in_at = NULL (afwezig)
export const createDailyAbsencesForAllStudents = async () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Haal alle studenten op
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('badge_number');

  if (studentsError) return { data: null, error: studentsError };

  // Filter studenten die al een sessie hebben voor vandaag
  const { data: existingSessions } = await supabase
    .from('attendance_sessions')
    .select('badge_number')
    .eq('date', today);

  const existingBadges = new Set(existingSessions?.map(s => s.badge_number) || []);

  // Maak sessies aan voor studenten die nog geen sessie hebben
  const newSessions = students
    .filter(s => s.badge_number && !existingBadges.has(s.badge_number))
    .map(s => ({
      badge_number: s.badge_number,
      date: today,
      checked_in_at: null, // NULL = afwezig
      checked_out_at: null,
      created_at: new Date().toISOString(),
    }));

  if (newSessions.length === 0) {
    return { data: [], error: null, message: 'Alle studenten hebben al een sessie voor vandaag' };
  }

  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert(newSessions)
    .select();

  return { data, error, created: newSessions.length };
};

// Zet één student op afwezig voor vandaag (als er nog geen sessie is)
export const createAbsenceForStudent = async (badgeNumber) => {
  const today = new Date().toISOString().split('T')[0];

  // Check of er al een sessie is
  const { data: existing } = await supabase
    .from('attendance_sessions')
    .select('id')
    .eq('badge_number', badgeNumber)
    .eq('date', today)
    .single();

  if (existing) {
    return { data: existing, error: null, message: 'Sessie bestaat al' };
  }

  // Maak nieuwe sessie aan (afwezig)
  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert({
      badge_number: badgeNumber,
      date: today,
      checked_in_at: null,
      checked_out_at: null,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  return { data, error };
};

// ============ CHECK-IN (vervangt afwezigheid) ============

// Student inchecken - VERVANGT afwezigheid met aanwezig/te laat
// - Check-in ≤ 09:00 = Aanwezig (afwezigheid vervalt)
// - Check-in > 09:00 = Te laat (afwezigheid vervalt)
export const checkInStudent = async (badgeNumber) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Check of er al een sessie is voor vandaag
  const { data: existingSession, error: fetchError } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('badge_number', badgeNumber)
    .eq('date', today)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { data: null, error: fetchError };
  }

  if (existingSession) {
    // Er is al een sessie voor vandaag
    if (existingSession.checked_in_at) {
      // Al ingecheckt
      return {
        data: existingSession,
        error: { message: 'Je bent vandaag al ingecheckt' }
      };
    }

    // Sessie bestaat maar nog niet ingecheckt (was AFWEZIG)
    // Nu inchecken -> afwezigheid VERVALT, wordt aanwezig of te laat
    const { data, error } = await supabase
      .from('attendance_sessions')
      .update({ checked_in_at: now.toISOString() })
      .eq('id', existingSession.id)
      .select()
      .single();

    const status = isOnTimeOrEarly(now) ? 'Aanwezig' : 'Te laat';
    return { data, error, status };
  }

  // Geen sessie voor vandaag (zou niet moeten als daily absences draait)
  // Maak nieuwe aan met check-in tijd
  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert({
      badge_number: badgeNumber,
      date: today,
      checked_in_at: now.toISOString(),
      created_at: now.toISOString(),
    })
    .select()
    .single();

  const status = isOnTimeOrEarly(now) ? 'Aanwezig' : 'Te laat';
  return { data, error, status };
};

// Student uitchecken
export const checkOutStudent = async (badgeNumber) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('attendance_sessions')
    .update({ checked_out_at: now.toISOString() })
    .eq('badge_number', badgeNumber)
    .eq('date', today)
    .select()
    .single();

  return { data, error };
};

// ============ HELPERS ============

// Bepaal attendance status op basis van check-in tijd
// - Aanwezig: check-in op of voor 09:00
// - Te laat: check-in na 09:00
// - Afwezig: geen check-in (en het is na 09:00)
export const getAttendanceStatus = (checkedInAt) => {
  if (!checkedInAt) {
    return { status: 'Absent', color: '#DE0000' };
  }

  const checkInTime = new Date(checkedInAt);

  if (isOnTimeOrEarly(checkInTime)) {
    return { status: 'Present', color: '#E3A6FF' };
  } else {
    return { status: 'Late', color: '#5182FF' };
  }
};

// Bereken aanwezigheidsstatistieken
export const calculateAttendanceStats = (attendanceData) => {
  if (!attendanceData || attendanceData.length === 0) {
    return {
      totalDays: 0,
      presentCount: 0,
      lateCount: 0,
      absentCount: 0,
      presentPercentage: 0,
    };
  }

  const totalDays = attendanceData.length;

  const stats = attendanceData.reduce(
    (acc, session) => {
      const { status } = getAttendanceStatus(session.checked_in_at);

      if (status === 'Absent') acc.absentCount++;
      else if (status === 'Late') acc.lateCount++;
      else acc.presentCount++;

      return acc;
    },
    { presentCount: 0, lateCount: 0, absentCount: 0 }
  );

  return {
    totalDays,
    ...stats,
    presentPercentage: Math.round((stats.presentCount / totalDays) * 100),
  };
};

// Status kleuren mapping
const statusColors = {
  present: '#E3A6FF',
  late: '#5182FF',
  absent: '#DE0000',
  Present: '#E3A6FF',
  Late: '#5182FF',
  Absent: '#DE0000',
};

// Transformeer database data naar app formaat
export const transformAttendanceData = (attendanceData) => {
  if (!attendanceData || attendanceData.length === 0) return [];

  console.log('[transformAttendanceData] Raw data:', JSON.stringify(attendanceData, null, 2));

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return attendanceData.map((session) => {
    console.log('[transformAttendanceData] Processing session:', session);

    // Handle invalid or missing date
    let date;
    if (session.date && session.date !== '0' && session.date !== 0) {
      date = new Date(session.date);
    } else {
      // Fallback to created_at or current date
      date = session.created_at ? new Date(session.created_at) : new Date();
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.log('[transformAttendanceData] Invalid date, using today');
      date = new Date();
    }

    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const dayNum = date.getDate();

    // Gebruik status uit database als beschikbaar, anders bereken op basis van check-in tijd
    let status, color;
    if (session.status) {
      // Status komt direct uit de database (attendance_status enum)
      const dbStatus = session.status.toLowerCase();
      status = dbStatus.charAt(0).toUpperCase() + dbStatus.slice(1); // Capitalize
      color = statusColors[dbStatus] || '#E3A6FF';
    } else {
      // Fallback: bereken status op basis van check-in tijd
      const calculated = getAttendanceStatus(session.checked_in_at);
      status = calculated.status;
      color = calculated.color;
    }

    // Formateer check-in tijd
    let time = '-';
    if (session.checked_in_at) {
      const checkInTime = new Date(session.checked_in_at);
      const hours = checkInTime.getHours();
      const minutes = checkInTime.getMinutes();
      time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return {
      id: session.id,
      day: dayName,
      date: `${monthName} ${dayNum}`,
      fullDate: session.date,
      status,
      color,
      time,
      checkedInAt: session.checked_in_at,
      checkedOutAt: session.checked_out_at,
      noteId: session.note_id,
      reasonKey: '',
      noteKey: '',
    };
  });
};
