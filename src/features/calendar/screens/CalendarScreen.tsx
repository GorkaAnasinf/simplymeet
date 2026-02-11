import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { useOdoo } from "../../odoo/OdooContext";
import { OdooMeeting } from "../../odoo/types";
import { FloatingParticles } from "../../splash/components/FloatingParticles";
import { splashColors } from "../../splash/theme/splashColors";
import { CalendarPickerModal } from "../components/CalendarPickerModal";
import { DayNavigator } from "../components/DayNavigator";
import { DayScheduleCard } from "../components/DayScheduleCard";
import { EmployeeSelectorCard } from "../components/EmployeeSelectorCard";
import { UserMenu } from "../components/UserMenu";

type ScheduleMeeting = {
  id: string;
  title: string;
  start: string;
  end: string;
  organizer?: string;
  attendees: string[];
  meetingUrl?: string;
  location?: string;
  description?: string;
};

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  next.setHours(0, 0, 0, 0);
  return next;
}

function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function toHourMinute(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

function toScheduleMeeting(meeting: OdooMeeting): ScheduleMeeting {
  return {
    id: String(meeting.id),
    title: meeting.title,
    start: toHourMinute(meeting.start),
    end: toHourMinute(meeting.end),
    organizer: meeting.organizer,
    attendees: meeting.attendees,
    meetingUrl: meeting.meetingUrl,
    location: meeting.location,
    description: meeting.description,
  };
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function CalendarScreen() {
  const {
    configured,
    selectedEmployee,
    employees,
    employeesLoading,
    employeesError,
    loadEmployees,
    selectEmployee,
    clearSelectedEmployee,
    getMeetingsForDay,
  } = useOdoo();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [meetings, setMeetings] = useState<ScheduleMeeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);
  const [meetingsError, setMeetingsError] = useState<string | null>(null);
  const [meetingsCache, setMeetingsCache] = useState<Record<string, ScheduleMeeting[]>>({});
  const [isChangingDay, setIsChangingDay] = useState(false);

  const selectedDateLabel = useMemo(() => toDisplayDate(selectedDate), [selectedDate]);
  const selectedDateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  useEffect(() => {
    if (selectedEmployee) return;
    loadEmployees();
  }, [loadEmployees, selectedEmployee]);

  useEffect(() => {
    if (!selectedEmployee) {
      setMeetingsLoading(false);
      setIsChangingDay(false);
      return;
    }

    let cancelled = false;
    const cacheKey = `${selectedEmployee.id}:${selectedDateKey}`;

    const run = async () => {
      setMeetingsError(null);

      // Reutiliza resultados ya consultados para evitar recargas al navegar entre dias visitados.
      if (meetingsCache[cacheKey]) {
        if (cancelled) return;
        setMeetings(meetingsCache[cacheKey]);
        setMeetingsLoading(false);
        setIsChangingDay(false);
        return;
      }

      setMeetingsLoading(true);
      setMeetings([]);

      try {
        const rows = await getMeetingsForDay(selectedDate);
        if (cancelled) return;
        const parsed = rows.map(toScheduleMeeting);
        setMeetings(parsed);
        setMeetingsCache((prev) => ({ ...prev, [cacheKey]: parsed }));
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "No se pudieron cargar las reuniones.";
        setMeetingsError(message);
        setMeetings([]);
      } finally {
        if (cancelled) return;
        setMeetingsLoading(false);
        setIsChangingDay(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [getMeetingsForDay, meetingsCache, selectedDate, selectedDateKey, selectedEmployee]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[splashColors.gradientStart, splashColors.gradientMid, splashColors.gradientEnd]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <FloatingParticles />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.brand}>SimplyMeet</Text>
            {selectedEmployee ? (
              <UserMenu
                employee={selectedEmployee}
                open={menuOpen}
                onOpen={() => setMenuOpen(true)}
                onClose={() => setMenuOpen(false)}
                onChangeUser={async () => {
                  setMenuOpen(false);
                  setMeetings([]);
                  setMeetingsCache({});
                  await clearSelectedEmployee();
                  await loadEmployees();
                }}
              />
            ) : null}
          </View>

          {!configured ? <Text style={styles.error}>Configura credenciales Odoo en variables EXPO_PUBLIC_ODOO_*.</Text> : null}

          {!selectedEmployee ? (
            <EmployeeSelectorCard
              employees={employees}
              loading={employeesLoading}
              error={employeesError}
              onRetry={loadEmployees}
              onSelect={async (employee) => {
                await selectEmployee(employee);
              }}
            />
          ) : (
            <>
              <DayNavigator
                dateLabel={selectedDateLabel}
                onPreviousDay={() => {
                  setIsChangingDay(true);
                  setSelectedDate((value) => addDays(value, -1));
                }}
                onNextDay={() => {
                  setIsChangingDay(true);
                  setSelectedDate((value) => addDays(value, 1));
                }}
                onOpenDatePicker={() => setCalendarVisible(true)}
              />

              {meetingsLoading || isChangingDay ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={splashColors.glowLight} />
                  <Text style={styles.info}>Cargando reuniones...</Text>
                </View>
              ) : null}
              {meetingsError ? <Text style={styles.error}>{meetingsError}</Text> : null}

              <DayScheduleCard date={selectedDate} meetings={meetings} startHour={8} endHour={20} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <CalendarPickerModal
        visible={calendarVisible}
        selectedDate={selectedDate}
        onClose={() => setCalendarVisible(false)}
        onSelectDate={(date) => {
          setIsChangingDay(true);
          setSelectedDate(addDays(date, 0));
          setCalendarVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: splashColors.textBright,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  info: {
    color: splashColors.textSubtle,
    fontSize: 13,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  error: {
    color: "#FCA5A5",
    fontSize: 13,
  },
});
