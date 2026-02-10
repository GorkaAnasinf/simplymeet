import { StyleSheet, Text, View } from "react-native";

import { splashColors } from "../../splash/theme/splashColors";

type Meeting = {
  id: string;
  title: string;
  start: string;
  end: string;
};

type DayScheduleCardProps = {
  meetings: Meeting[];
  startHour: number;
  endHour: number;
};

function toMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function isHourOccupied(hour: number, meetings: Meeting[]) {
  const from = hour * 60;
  const to = (hour + 1) * 60;
  // Marca la hora como ocupada cuando existe solape parcial o total con una reunion.
  return meetings.some((meeting) => {
    const meetingStart = toMinutes(meeting.start);
    const meetingEnd = toMinutes(meeting.end);
    return meetingStart < to && meetingEnd > from;
  });
}

function meetingsStartingInHour(hour: number, meetings: Meeting[]) {
  const from = hour * 60;
  const to = (hour + 1) * 60;
  return meetings.filter((meeting) => {
    const meetingStart = toMinutes(meeting.start);
    return meetingStart >= from && meetingStart < to;
  });
}

export function DayScheduleCard({ meetings, startHour, endHour }: DayScheduleCardProps) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Agenda del dia</Text>
      <Text style={styles.description}>Horario por horas y tramos ocupados por reuniones.</Text>

      <View style={styles.grid}>
        {hours.map((hour) => {
          const occupied = isHourOccupied(hour, meetings);
          const startingMeetings = meetingsStartingInHour(hour, meetings);

          return (
            <View key={hour} style={[styles.row, occupied && styles.rowOccupied]}>
              <Text style={styles.hourLabel}>{formatHour(hour)}</Text>
              <View style={styles.content}>
                {startingMeetings.length > 0 ? (
                  startingMeetings.map((meeting) => (
                    <View key={meeting.id} style={styles.meetingBadge}>
                      <Text style={styles.meetingText}>
                        {meeting.start}-{meeting.end} {meeting.title}
                      </Text>
                    </View>
                  ))
                ) : occupied ? (
                  <Text style={styles.continuesText}>Bloque ocupado (continuacion)</Text>
                ) : (
                  <Text style={styles.emptyText}>Libre</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(9, 16, 31, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    gap: 8,
  },
  title: {
    color: splashColors.textBright,
    fontSize: 20,
    fontWeight: "700",
  },
  description: {
    color: splashColors.textMuted,
    fontSize: 13,
  },
  grid: {
    marginTop: 10,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  rowOccupied: {
    borderTopColor: "rgba(14,165,233,0.45)",
  },
  hourLabel: {
    width: 54,
    color: splashColors.textSubtle,
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    gap: 6,
  },
  emptyText: {
    color: splashColors.textSubtle,
    fontSize: 13,
  },
  continuesText: {
    color: splashColors.textMuted,
    fontSize: 12,
    fontStyle: "italic",
  },
  meetingBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(14, 165, 233, 0.16)",
    borderWidth: 1,
    borderColor: splashColors.glowSoft,
  },
  meetingText: {
    color: splashColors.textBright,
    fontSize: 13,
    fontWeight: "500",
  },
});
