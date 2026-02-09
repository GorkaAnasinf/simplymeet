import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { FloatingParticles } from "../../splash/components/FloatingParticles";
import { splashColors } from "../../splash/theme/splashColors";
import { DayNavigator } from "../components/DayNavigator";
import { DayScheduleCard } from "../components/DayScheduleCard";

type Meeting = {
  id: string;
  title: string;
  start: string;
  end: string;
};

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

const agendaByDay: Record<string, Meeting[]> = {
  // Datos de ejemplo por fecha para simular agenda real.
  "2026-02-09": [
    { id: "m1", title: "Daily de producto", start: "09:30", end: "10:00" },
    { id: "m2", title: "Sync mobile", start: "12:00", end: "12:45" },
    { id: "m3", title: "Revision con cliente", start: "16:00", end: "17:00" },
  ],
  "2026-02-10": [
    { id: "m4", title: "Planificacion sprint", start: "10:00", end: "11:00" },
    { id: "m5", title: "One to one", start: "15:00", end: "15:30" },
  ],
};

export function CalendarScreen() {
  const [dayOffset, setDayOffset] = useState(0);

  const selectedDate = useMemo(() => addDays(new Date(), dayOffset), [dayOffset]);
  const selectedDateLabel = useMemo(() => toDisplayDate(selectedDate), [selectedDate]);
  const selectedMeetings = useMemo(() => {
    // Si no hay datos para el dia, se muestra la tarjeta con bloques libres.
    return agendaByDay[toDateKey(selectedDate)] ?? [];
  }, [selectedDate]);

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
          <Text style={styles.brand}>SimplyMeet</Text>
          <DayNavigator
            dateLabel={selectedDateLabel}
            onPreviousDay={() => setDayOffset((value) => value - 1)}
            onNextDay={() => setDayOffset((value) => value + 1)}
          />
          <DayScheduleCard meetings={selectedMeetings} startHour={8} endHour={20} />
        </ScrollView>
      </SafeAreaView>
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
  brand: {
    color: splashColors.textBright,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
