import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { OdooEmployee } from "../../odoo/types";
import { splashColors } from "../../splash/theme/splashColors";

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
  return (
    <>
      <Pressable onPress={onOpen} style={styles.trigger}>
        {employee.image128 ? (
          <Image source={{ uri: `data:image/png;base64,${employee.image128}` }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>{initials(employee.name)}</Text>
          </View>
        )}
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.menu} onPress={() => undefined}>
            <Text style={styles.menuTitle}>{employee.name}</Text>
            <Text style={styles.menuEmail}>{employee.workEmail || "Sin email de trabajo"}</Text>

            <Pressable onPress={onChangeUser} style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Cambiar usuario</Text>
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
    color: splashColors.textBright,
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
    borderColor: splashColors.borderMedium,
    gap: 4,
  },
  menuTitle: {
    color: splashColors.textBright,
    fontWeight: "700",
    fontSize: 14,
  },
  menuEmail: {
    color: splashColors.textSubtle,
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
    color: splashColors.textBright,
    fontWeight: "600",
    fontSize: 13,
  },
});
