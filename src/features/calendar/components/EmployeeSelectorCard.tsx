import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { OdooEmployee } from "../../odoo/types";
import { useAppTheme } from "../../../shared/theme/appTheme";

type EmployeeSelectorCardProps = {
  employees: OdooEmployee[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelect: (employee: OdooEmployee) => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function EmployeeSelectorCard({ employees, loading, error, onRetry, onSelect }: EmployeeSelectorCardProps) {
  const { palette } = useAppTheme();
  return (
    <View style={[styles.card, { backgroundColor: palette.surfaceDark, borderColor: palette.borderLight }]}>
      <Text style={[styles.title, { color: palette.textBright }]}>Selecciona tu usuario</Text>
      <Text style={[styles.subtitle, { color: palette.textMuted }]}>Elige una persona de Odoo para cargar su agenda diaria.</Text>

      {loading ? <Text style={[styles.info, { color: palette.textSubtle }]}>Cargando empleados...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && employees.length === 0 ? (
        <Text style={[styles.info, { color: palette.textSubtle }]}>No hay empleados disponibles con usuario asociado.</Text>
      ) : null}

      <ScrollView style={styles.list}>
        {employees.map((employee) => (
          <Pressable key={employee.id} style={styles.row} onPress={() => onSelect(employee)}>
            {employee.image128 ? (
              <Image source={{ uri: `data:image/png;base64,${employee.image128}` }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={[styles.avatarFallbackText, { color: palette.textBright }]}>{initials(employee.name)}</Text>
              </View>
            )}
            <View style={styles.rowContent}>
              <Text style={[styles.name, { color: palette.textBright }]}>{employee.name}</Text>
              <Text style={[styles.email, { color: palette.textSubtle }]}>{employee.workEmail || "Sin email de trabajo"}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable onPress={onRetry} style={[styles.retryButton, { borderColor: palette.borderMedium }]}>
        <Text style={[styles.retryLabel, { color: palette.textBright }]}>Recargar lista</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
  },
  info: {
    fontSize: 13,
  },
  error: {
    color: "#FCA5A5",
    fontSize: 13,
  },
  list: {
    maxHeight: 300,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(113, 75, 103, 0.20)",
    borderWidth: 1,
    borderColor: "rgba(113, 75, 103, 0.40)",
  },
  avatarFallbackText: {
    fontWeight: "700",
    fontSize: 13,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  email: {
    fontSize: 12,
  },
  retryButton: {
    marginTop: 8,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  retryLabel: {
    fontWeight: "600",
    fontSize: 13,
  },
});
