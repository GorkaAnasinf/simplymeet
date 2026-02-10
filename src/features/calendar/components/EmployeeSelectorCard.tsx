import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { splashColors } from "../../splash/theme/splashColors";
import { OdooEmployee } from "../../odoo/types";

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
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Selecciona tu usuario</Text>
      <Text style={styles.subtitle}>Elige una persona de Odoo para cargar su agenda diaria.</Text>

      {loading ? <Text style={styles.info}>Cargando empleados...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && employees.length === 0 ? (
        <Text style={styles.info}>No hay empleados disponibles con usuario asociado.</Text>
      ) : null}

      <ScrollView style={styles.list}>
        {employees.map((employee) => (
          <Pressable key={employee.id} style={styles.row} onPress={() => onSelect(employee)}>
            {employee.image128 ? (
              <Image source={{ uri: `data:image/png;base64,${employee.image128}` }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>{initials(employee.name)}</Text>
              </View>
            )}
            <View style={styles.rowContent}>
              <Text style={styles.name}>{employee.name}</Text>
              <Text style={styles.email}>{employee.workEmail || "Sin email de trabajo"}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryLabel}>Recargar lista</Text>
      </Pressable>
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
  subtitle: {
    color: splashColors.textMuted,
    fontSize: 13,
  },
  info: {
    color: splashColors.textSubtle,
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
    backgroundColor: "rgba(14,165,233,0.20)",
    borderWidth: 1,
    borderColor: "rgba(14,165,233,0.40)",
  },
  avatarFallbackText: {
    color: splashColors.textBright,
    fontWeight: "700",
    fontSize: 13,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: splashColors.textBright,
    fontSize: 14,
    fontWeight: "600",
  },
  email: {
    color: splashColors.textSubtle,
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
    color: splashColors.textBright,
    fontWeight: "600",
    fontSize: 13,
  },
});
