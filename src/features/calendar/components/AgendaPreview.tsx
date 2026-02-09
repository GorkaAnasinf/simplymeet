import { StyleSheet, Text, View } from "react-native";

import { AgendaItem } from "../types";
import { colors } from "../../../shared/theme/colors";
import { spacing } from "../../../shared/theme/spacing";

type AgendaPreviewProps = {
  items: AgendaItem[];
};

export function AgendaPreview({ items }: AgendaPreviewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Agenda de hoy</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.time}>
            {item.startsAt} - {item.endsAt}
          </Text>
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  row: {
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  time: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.accent,
  },
  itemTitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
