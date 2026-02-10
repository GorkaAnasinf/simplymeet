import { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OdooProvider } from "../features/odoo/OdooContext";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <OdooProvider>{children}</OdooProvider>
    </SafeAreaProvider>
  );
}
