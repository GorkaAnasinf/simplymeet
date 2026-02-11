import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

const LONG_MEETING_THRESHOLD_MINUTES = 120;

type MeetingWindow = Meeting & {
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
};

function toMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function toDurationLabel(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function isHourOccupied(hour: number, meetings: MeetingWindow[]) {
  const from = hour * 60;
  const to = (hour + 1) * 60;
  // Marca la hora como ocupada cuando existe solape parcial o total con una reunion.
  return meetings.some((meeting) => {
    return meeting.startMinutes < to && meeting.endMinutes > from;
  });
}

function meetingsStartingAtHour(hour: number, meetings: MeetingWindow[]) {
  const from = hour * 60;
  const to = (hour + 1) * 60;
  return meetings.filter((meeting) => {
    return meeting.startMinutes >= from && meeting.startMinutes < to;
  });
}

function meetingsOverlappingHour(hour: number, meetings: MeetingWindow[]) {
  const from = hour * 60;
  const to = (hour + 1) * 60;
  return meetings.filter((meeting) => meeting.startMinutes < to && meeting.endMinutes > from);
}

function continuesFromPreviousHour(hour: number, meetings: MeetingWindow[]) {
  const boundary = hour * 60;
  return meetings.some((meeting) => meeting.startMinutes < boundary && meeting.endMinutes > boundary);
}

function continuesToNextHour(hour: number, meetings: MeetingWindow[]) {
  const boundary = (hour + 1) * 60;
  return meetings.some((meeting) => meeting.startMinutes < boundary && meeting.endMinutes > boundary);
}

function formatMeetingHeadline(meeting: MeetingWindow) {
  const base = `${meeting.start}-${meeting.end} ${meeting.title}`;
  if (meeting.durationMinutes < LONG_MEETING_THRESHOLD_MINUTES) {
    return base;
  }
  return `${base} (${toDurationLabel(meeting.durationMinutes)})`;
}

export function DayScheduleCard({ meetings, startHour, endHour }: DayScheduleCardProps) {
  const [expandedHour, setExpandedHour] = useState<number | null>(null);
  const parsedMeetings = useMemo<MeetingWindow[]>(
    () =>
      meetings
        .map((meeting) => {
          const startMinutes = toMinutes(meeting.start);
          const endMinutes = toMinutes(meeting.end);
          return {
            ...meeting,
            startMinutes,
            endMinutes,
            durationMinutes: Math.max(0, endMinutes - startMinutes),
          };
        })
        .sort((a, b) => a.startMinutes - b.startMinutes),
    [meetings],
  );
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Agenda del dia</Text>
      <Text style={styles.description}>Horario por horas y tramos ocupados por reuniones.</Text>

      <View style={styles.grid}>
        {hours.map((hour) => {
          const occupied = isHourOccupied(hour, parsedMeetings);
          const startingMeetings = meetingsStartingAtHour(hour, parsedMeetings);
          const overlappingMeetings = meetingsOverlappingHour(hour, parsedMeetings);
          const fromPreviousHour = continuesFromPreviousHour(hour, parsedMeetings);
          const toNextHour = continuesToNextHour(hour, parsedMeetings);
          const isExpanded = expandedHour === hour;
          const isPressable = occupied;

          return (
            <Pressable
              key={hour}
              style={[styles.row, occupied && styles.rowOccupied]}
              disabled={!isPressable}
              onPress={() => {
                setExpandedHour((current) => (current === hour ? null : hour));
              }}
            >
              <Text style={styles.hourLabel}>{formatHour(hour)}</Text>
              <View style={styles.slotArea}>
                {occupied ? (
                  <View
                    style={[
                      styles.occupancyLine,
                      fromPreviousHour && styles.occupancyLineFromPrevious,
                      toNextHour && styles.occupancyLineToNext,
                      fromPreviousHour && toNextHour && styles.occupancyLineMiddle,
                    ]}
                  />
                ) : null}
                <View style={styles.content}>
                  {startingMeetings.length > 0 ? (
                    startingMeetings.map((meeting) => (
                      <View key={`${meeting.id}-${hour}`} style={styles.meetingBadge}>
                        <Text style={styles.meetingText}>{formatMeetingHeadline(meeting)}</Text>
                      </View>
                    ))
                  ) : occupied ? (
                    <Text style={styles.continuationText}>Ocupado</Text>
                  ) : (
                    <Text style={styles.emptyText}>Libre</Text>
                  )}
                  {occupied ? <Text style={styles.tapHint}>{isExpanded ? "Ocultar detalles" : "Ver detalles"}</Text> : null}
                  {isExpanded ? (
                    <View style={styles.detailsCard}>
                      <Text style={styles.detailsTitle}>Detalles de la franja</Text>
                      {overlappingMeetings.map((meeting) => (
                        <View key={`details-${meeting.id}-${hour}`} style={styles.detailsRow}>
                          <Text style={styles.detailsMeetingTitle}>{meeting.title}</Text>
                          <Text style={styles.detailsMeetingTime}>
                            {meeting.start}-{meeting.end} · {toDurationLabel(meeting.durationMinutes)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
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
    gap: 0,
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
  slotArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
  },
  occupancyLine: {
    width: 4,
    borderRadius: 8,
    backgroundColor: "rgba(14, 165, 233, 0.85)",
  },
  occupancyLineFromPrevious: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: -8,
  },
  occupancyLineToNext: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: -8,
  },
  occupancyLineMiddle: {
    marginTop: -8,
    marginBottom: -8,
  },
  emptyText: {
    color: splashColors.textSubtle,
    fontSize: 13,
  },
  meetingBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(14, 165, 233, 0.16)",
    borderWidth: 1,
    borderColor: splashColors.glowSoft,
  },
  continuationText: {
    color: splashColors.textSubtle,
    fontSize: 13,
    fontStyle: "italic",
  },
  tapHint: {
    color: splashColors.textSubtle,
    fontSize: 12,
  },
  detailsCard: {
    marginTop: 4,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(14,165,233,0.35)",
    gap: 8,
  },
  detailsTitle: {
    color: splashColors.textBright,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  detailsRow: {
    gap: 2,
  },
  detailsMeetingTitle: {
    color: splashColors.textBright,
    fontSize: 13,
    fontWeight: "600",
  },
  detailsMeetingTime: {
    color: splashColors.textMuted,
    fontSize: 12,
  },
  meetingText: {
    color: splashColors.textBright,
    fontSize: 13,
    fontWeight: "500",
  },
});
