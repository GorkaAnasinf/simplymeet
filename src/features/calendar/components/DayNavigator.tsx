import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../../shared/theme/appTheme";

type DayNavigatorProps = {
  dateLabel: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onOpenDatePicker: () => void;
};

export function DayNavigator({ dateLabel, onPreviousDay, onNextDay, onOpenDatePicker }: DayNavigatorProps) {
  const { palette } = useAppTheme();
  return (
    <View style={styles.container}>
      <Pressable onPress={onPreviousDay} style={[styles.button, { borderColor: palette.borderMedium }]}>
        <Text style={[styles.buttonLabel, { color: palette.textBright }]}>{"<"}</Text>
      </Pressable>

      <Pressable style={styles.center} onPress={onOpenDatePicker}>
        <Text style={[styles.subtitle, { color: palette.textMuted }]}>Vista diaria</Text>
        <Text style={[styles.dateLabel, { color: palette.textBright }]}>{dateLabel}</Text>
        <Text style={[styles.helper, { color: palette.textSubtle }]}>Toca para elegir fecha</Text>
      </Pressable>

      <Pressable onPress={onNextDay} style={[styles.button, { borderColor: palette.borderMedium }]}>
        <Text style={[styles.buttonLabel, { color: palette.textBright }]}>{">"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  center: {
    alignItems: "center",
    gap: 4,
  },
  subtitle: {
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: "600",
  },
  dateLabel: {
    fontSize: 21,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  helper: {
    fontSize: 11,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
});
