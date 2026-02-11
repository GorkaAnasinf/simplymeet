import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { OdooEmployee } from "../../odoo/types";
import { useAppTheme } from "../../../shared/theme/appTheme";

type UserMenuProps = {
  employee: OdooEmployee;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChangeUser: () => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu({ employee, open, onOpen, onClose, onChangeUser }: UserMenuProps) {
  const { palette } = useAppTheme();
  return (
    <>
      <Pressable onPress={onOpen} style={styles.trigger}>
        {employee.image128 ? (
          <Image source={{ uri: `data:image/png;base64,${employee.image128}` }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={[styles.avatarFallbackText, { color: palette.textBright }]}>{initials(employee.name)}</Text>
          </View>
        )}
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={[styles.menu, { backgroundColor: palette.surfaceDarkSolid, borderColor: palette.borderMedium }]} onPress={() => undefined}>
            <Text style={[styles.menuTitle, { color: palette.textBright }]}>{employee.name}</Text>
            <Text style={[styles.menuEmail, { color: palette.textSubtle }]}>{employee.workEmail || "Sin email de trabajo"}</Text>

            <Pressable onPress={onChangeUser} style={[styles.changeButton, { borderColor: palette.borderMedium }]}>
              <Text style={[styles.changeButtonText, { color: palette.textBright }]}>Cambiar usuario</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(113, 75, 103, 0.25)",
  },
  avatarFallbackText: {
    fontWeight: "700",
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 16,
  },
  menu: {
    width: 220,
    borderRadius: 14,
    padding: 14,
    backgroundColor: "rgba(42, 22, 37, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    gap: 4,
  },
  menuTitle: {
    fontWeight: "700",
    fontSize: 14,
  },
  menuEmail: {
    fontSize: 12,
    marginBottom: 8,
  },
  changeButton: {
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  changeButtonText: {
    fontWeight: "600",
    fontSize: 13,
  },
});
