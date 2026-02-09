import { StyleSheet, Text, View } from "react-native";

import { AgendaPreview } from "../components/AgendaPreview";
import { AgendaItem } from "../types";
import { colors } from "../../../shared/theme/colors";
import { spacing } from "../../../shared/theme/spacing";
import { Screen } from "../../../shared/ui/Screen";

const mockAgenda: AgendaItem[] = [
  { id: "1", title: "Daily de producto", startsAt: "09:30", endsAt: "10:00" },
  { id: "2", title: "Sync equipo mobile", startsAt: "12:00", endsAt: "12:30" },
  { id: "3", title: "Review con cliente", startsAt: "16:00", endsAt: "16:45" },
];

export function CalendarScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Hola Mundo</Text>
        <Text style={styles.heading}>Base lista para tu programador de reuniones</Text>
        <Text style={styles.subheading}>
          Navegacion, estructura por features y modulo inicial de calendario configurados.
        </Text>
      </View>

      <AgendaPreview items={mockAgenda} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 20,
  },
});
