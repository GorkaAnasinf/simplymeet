import { Pressable, StyleSheet, Text, View } from "react-native";

import { splashColors } from "../../splash/theme/splashColors";

type DayNavigatorProps = {
  dateLabel: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
};

export function DayNavigator({ dateLabel, onPreviousDay, onNextDay }: DayNavigatorProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPreviousDay} style={styles.button}>
        <Text style={styles.buttonLabel}>{"<"}</Text>
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.subtitle}>Vista diaria</Text>
        <Text style={styles.dateLabel}>{dateLabel}</Text>
      </View>

      <Pressable onPress={onNextDay} style={styles.button}>
        <Text style={styles.buttonLabel}>{">"}</Text>
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
    color: splashColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: "600",
  },
  dateLabel: {
    color: splashColors.textBright,
    fontSize: 21,
    fontWeight: "700",
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
    color: splashColors.textBright,
    fontSize: 18,
    fontWeight: "700",
  },
});
