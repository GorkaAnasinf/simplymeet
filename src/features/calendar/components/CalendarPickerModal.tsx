import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../../shared/theme/appTheme";

type CalendarPickerModalProps = {
  visible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
};

const WEEK_DAYS = ["L", "M", "X", "J", "V", "S", "D"];

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function toMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(date);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getCalendarDays(date: Date) {
  const firstDay = monthStart(date);
  const weekday = firstDay.getDay();
  const mondayIndex = weekday === 0 ? 6 : weekday - 1;
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - mondayIndex);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function CalendarPickerModal({ visible, selectedDate, onClose, onSelectDate }: CalendarPickerModalProps) {
  const { palette } = useAppTheme();
  const [displayMonth, setDisplayMonth] = useState(monthStart(selectedDate));
  const days = useMemo(() => getCalendarDays(displayMonth), [displayMonth]);
  
  useEffect(() => {
    if (!visible) return;
    setDisplayMonth(monthStart(selectedDate));
  }, [selectedDate, visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: palette.surfaceDarkSolid, borderColor: palette.borderMedium }]}>
          <View style={styles.header}>
            <Pressable onPress={() => setDisplayMonth((current) => addMonths(current, -1))} style={[styles.navButton, { borderColor: palette.borderMedium }]}>
              <Text style={[styles.navLabel, { color: palette.textBright }]}>{"<"}</Text>
            </Pressable>
            <Text style={[styles.monthLabel, { color: palette.textBright }]}>{toMonthLabel(displayMonth)}</Text>
            <Pressable onPress={() => setDisplayMonth((current) => addMonths(current, 1))} style={[styles.navButton, { borderColor: palette.borderMedium }]}>
              <Text style={[styles.navLabel, { color: palette.textBright }]}>{">"}</Text>
            </Pressable>
          </View>

          <View style={styles.weekHeader}>
            {WEEK_DAYS.map((label) => (
              <Text key={label} style={[styles.weekLabel, { color: palette.textMuted }]}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day) => {
              const outsideMonth = day.getMonth() !== displayMonth.getMonth();
              const selected = isSameDay(day, selectedDate);
              return (
                <Pressable
                  key={day.toISOString()}
                  style={[styles.dayCell, selected && styles.dayCellSelected]}
                  onPress={() => {
                    onSelectDate(new Date(day));
                  }}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: palette.textBright },
                      outsideMonth && [styles.dayTextOutside, { color: palette.textSubtle }],
                      selected && [styles.dayTextSelected, { color: palette.textBright }],
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.actionButton}
              onPress={() => {
                const today = new Date();
                setDisplayMonth(monthStart(today));
                onSelectDate(today);
              }}
            >
              <Text style={[styles.actionText, { color: palette.textBright }]}>Hoy</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={onClose}>
              <Text style={[styles.actionText, { color: palette.textBright }]}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  container: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  navLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  weekHeader: {
    flexDirection: "row",
  },
  weekLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 4,
  },
  dayCell: {
    width: "14.285%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  dayCellSelected: {
    backgroundColor: "rgba(113, 75, 103, 0.26)",
    borderWidth: 1,
    borderColor: "rgba(113, 75, 103, 0.25)",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dayTextOutside: {
    opacity: 0.45,
  },
  dayTextSelected: {},
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
