import { useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { splashColors } from "../../splash/theme/splashColors";

type Meeting = {
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

type DayScheduleCardProps = {
  date: Date;
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

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function formatMeetingHeadline(meeting: MeetingWindow) {
  const base = `${meeting.start}-${meeting.end} ${meeting.title}`;
  if (meeting.durationMinutes < LONG_MEETING_THRESHOLD_MINUTES) return base;
  return `${base} (${toDurationLabel(meeting.durationMinutes)})`;
}

function toChipTop(startMinutes: number, timelineStartMinutes: number) {
  return ((startMinutes - timelineStartMinutes) / 60) * HOUR_ROW_HEIGHT;
}

function toChipHeight(durationMinutes: number) {
  return Math.max((durationMinutes / 60) * HOUR_ROW_HEIGHT, MIN_CHIP_HEIGHT);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toNowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function DayScheduleCard({ date, meetings, startHour, endHour }: DayScheduleCardProps) {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
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
  const timelineHeight = hours.length * HOUR_ROW_HEIGHT;
  const selectedMeeting = selectedMeetingId ? parsedMeetings.find((meeting) => meeting.id === selectedMeetingId) ?? null : null;

  const now = new Date();
  const isCurrentDay = isSameDay(date, now);
  const isPastDay = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nowMinutes = toNowMinutes();
  const showNowLine = isCurrentDay && nowMinutes >= timelineStartMinutes && nowMinutes <= timelineEndMinutes;
  const nowLineTop = showNowLine ? toChipTop(nowMinutes, timelineStartMinutes) : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Agenda del dia</Text>
      <Text style={styles.description}>Pulsa en "Ver detalles" dentro de cada reunion.</Text>

      <View style={styles.grid}>
        <View style={styles.rowsLayer}>
          {hours.map((hour) => {
            const from = hour * 60;
            const to = (hour + 1) * 60;
            const occupied = parsedMeetings.some((meeting) => meeting.startMinutes < to && meeting.endMinutes > from);
            return (
              <View key={hour} style={[styles.row, occupied && styles.rowOccupied]}>
                <Text style={styles.hourLabel}>{formatHour(hour)}</Text>
                <View style={styles.content}>{occupied ? null : <Text style={styles.emptyText}>Libre</Text>}</View>
              </View>
            );
          })}
        </View>

        <View style={[styles.meetingsLayer, { height: timelineHeight }]}>
          {parsedMeetings.map((meeting) => {
            const clampedStart = Math.max(meeting.startMinutes, timelineStartMinutes);
            const clampedEnd = Math.min(meeting.endMinutes, timelineEndMinutes);
            const clampedDuration = Math.max(0, clampedEnd - clampedStart);
            if (clampedDuration === 0) return null;

            const hasAlreadyFinished = isPastDay || (isCurrentDay && meeting.endMinutes <= nowMinutes);
            const selected = selectedMeetingId === meeting.id;

            return (
              <View
                key={`chip-${meeting.id}`}
                style={[
                  styles.meetingChip,
                  hasAlreadyFinished && styles.meetingChipPast,
                  selected && styles.meetingChipSelected,
                  {
                    top: toChipTop(clampedStart, timelineStartMinutes),
                    height: toChipHeight(clampedDuration),
                  },
                ]}
              >
                <Text style={[styles.meetingText, hasAlreadyFinished && styles.meetingTextPast]}>{formatMeetingHeadline(meeting)}</Text>
                <Pressable
                  style={styles.detailsButton}
                  onPress={() => {
                    setSelectedMeetingId((current) => (current === meeting.id ? null : meeting.id));
                  }}
                >
                  <Text style={styles.detailsButtonText}>
                    {selectedMeetingId === meeting.id ? "Ocultar detalles" : "Ver detalles"}
                  </Text>
                </Pressable>
              </View>
            );
          })}

          {showNowLine ? (
            <View style={[styles.nowLine, { top: nowLineTop }]}>
              <Text style={styles.nowLabel}>Ahora</Text>
            </View>
          ) : null}
        </View>
      </View>

      {selectedMeeting ? (
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>{selectedMeeting.title}</Text>
          <Text style={styles.detailsLine}>
            {selectedMeeting.start}-{selectedMeeting.end} | {toDurationLabel(selectedMeeting.durationMinutes)}
          </Text>
          {selectedMeeting.organizer ? <Text style={styles.detailsLine}>Organizador: {selectedMeeting.organizer}</Text> : null}
          {selectedMeeting.location ? <Text style={styles.detailsLine}>Ubicacion: {selectedMeeting.location}</Text> : null}
          {selectedMeeting.meetingUrl ? (
            <Pressable
              onPress={() => {
                Linking.openURL(selectedMeeting.meetingUrl!).catch(() => undefined);
              }}
            >
              <Text style={[styles.detailsLine, styles.detailsLink]}>Enlace: {selectedMeeting.meetingUrl}</Text>
            </Pressable>
          ) : null}
          {selectedMeeting.attendees.length > 0 ? (
            <Text style={styles.detailsLine}>Asistentes: {selectedMeeting.attendees.join(", ")}</Text>
          ) : (
            <Text style={styles.detailsLine}>Asistentes: sin datos</Text>
          )}
          {selectedMeeting.description ? <Text style={styles.detailsLine}>Notas: {selectedMeeting.description}</Text> : null}
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
    borderTopColor: "rgba(14,165,233,0.35)",
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
  meetingChip: {
    position: "absolute",
    left: 8,
    right: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: "#C8AAB8",
    borderWidth: 1,
    borderColor: "#C95773",
    justifyContent: "space-between",
  },
  meetingChipPast: {
    backgroundColor: "#8F8590",
    borderColor: "#736A74",
  },
  meetingChipSelected: {
    borderColor: "#FF3B5E",
    borderWidth: 2,
  },
  meetingText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "600",
  },
  meetingTextPast: {
    color: "rgba(17,17,17,0.65)",
  },
  detailsButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  detailsButtonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "600",
  },
  nowLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderTopColor: "#FF2040",
  },
  nowLabel: {
    position: "absolute",
    top: -10,
    right: 4,
    color: "#FF6B7E",
    fontSize: 10,
    fontWeight: "700",
    backgroundColor: "rgba(9,16,31,0.85)",
    paddingHorizontal: 4,
  },
  detailsCard: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(14,165,233,0.35)",
    gap: 6,
  },
  detailsTitle: {
    color: splashColors.textBright,
    fontSize: 14,
    fontWeight: "700",
  },
  detailsLine: {
    color: splashColors.textMuted,
    fontSize: 12,
  },
  detailsLink: {
    color: splashColors.glowLight,
    textDecorationLine: "underline",
  },
});
