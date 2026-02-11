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
const HOUR_ROW_HEIGHT = 56;
const MIN_CHIP_HEIGHT = 36;

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

function meetingsOverlappingHour(hour: number, meetings: MeetingWindow[]) {
  const from = hour * 60;
  const to = (hour + 1) * 60;
  return meetings.filter((meeting) => meeting.startMinutes < to && meeting.endMinutes > from);
}

function formatMeetingHeadline(meeting: MeetingWindow) {
  const base = `${meeting.start}-${meeting.end} ${meeting.title}`;
  if (meeting.durationMinutes < LONG_MEETING_THRESHOLD_MINUTES) {
    return base;
  }
  return `${base} (${toDurationLabel(meeting.durationMinutes)})`;
}

function toChipTop(startMinutes: number, timelineStartMinutes: number) {
  return ((startMinutes - timelineStartMinutes) / 60) * HOUR_ROW_HEIGHT;
}

function toChipHeight(durationMinutes: number) {
  return Math.max((durationMinutes / 60) * HOUR_ROW_HEIGHT, MIN_CHIP_HEIGHT);
}

export function DayScheduleCard({ meetings, startHour, endHour }: DayScheduleCardProps) {
  const [expandedHour, setExpandedHour] = useState<number | null>(null);
  const timelineStartMinutes = startHour * 60;
  const timelineEndMinutes = (endHour + 1) * 60;
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
  const expandedMeetings = expandedHour === null ? [] : meetingsOverlappingHour(expandedHour, parsedMeetings);
  const timelineHeight = hours.length * HOUR_ROW_HEIGHT;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Agenda del dia</Text>
      <Text style={styles.description}>Pulsa una franja ocupada para ver detalles.</Text>

      <View style={styles.grid}>
        <View style={styles.rowsLayer}>
          {hours.map((hour) => {
            const occupied = isHourOccupied(hour, parsedMeetings);
            const isExpanded = expandedHour === hour;
            return (
              <Pressable
                key={hour}
                style={[styles.row, occupied && styles.rowOccupied, isExpanded && styles.rowExpanded]}
                disabled={!occupied}
                onPress={() => {
                  setExpandedHour((current) => (current === hour ? null : hour));
                }}
              >
                <Text style={styles.hourLabel}>{formatHour(hour)}</Text>
                <View style={styles.content}>
                  <Text style={occupied ? styles.continuationText : styles.emptyText}>{occupied ? "Ocupado" : "Libre"}</Text>
                  {occupied ? <Text style={styles.tapHint}>{isExpanded ? "Ocultar detalles" : "Ver detalles"}</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View pointerEvents="none" style={[styles.meetingsLayer, { height: timelineHeight }]}>
          {parsedMeetings.map((meeting) => {
            const clampedStart = Math.max(meeting.startMinutes, timelineStartMinutes);
            const clampedEnd = Math.min(meeting.endMinutes, timelineEndMinutes);
            const clampedDuration = Math.max(0, clampedEnd - clampedStart);
            if (clampedDuration === 0) return null;

            return (
              <View
                key={`chip-${meeting.id}`}
                style={[
                  styles.meetingChip,
                  {
                    top: toChipTop(clampedStart, timelineStartMinutes),
                    height: toChipHeight(clampedDuration),
                  },
                ]}
              >
                <Text style={styles.meetingText}>{formatMeetingHeadline(meeting)}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {expandedHour !== null ? (
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Detalles de {formatHour(expandedHour)}</Text>
          {expandedMeetings.map((meeting) => (
            <View key={`details-${meeting.id}-${expandedHour}`} style={styles.detailsRow}>
              <Text style={styles.detailsMeetingTitle}>{meeting.title}</Text>
              <Text style={styles.detailsMeetingTime}>
                {meeting.start}-{meeting.end} · {toDurationLabel(meeting.durationMinutes)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
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
    position: "relative",
  },
  rowsLayer: {
    zIndex: 1,
  },
  meetingsLayer: {
    position: "absolute",
    left: 66,
    right: 0,
    zIndex: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    height: HOUR_ROW_HEIGHT,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  rowOccupied: {
    borderTopColor: "rgba(14,165,233,0.45)",
  },
  rowExpanded: {
    backgroundColor: "rgba(14,165,233,0.08)",
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
  meetingChip: {
    position: "absolute",
    left: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(14, 165, 233, 0.16)",
    borderWidth: 1,
    borderColor: splashColors.glowSoft,
    justifyContent: "center",
  },
  detailsCard: {
    marginTop: 10,
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
