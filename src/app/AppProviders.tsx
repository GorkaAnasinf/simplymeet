import { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OdooProvider } from "../features/odoo/OdooContext";
import { AppThemeProvider } from "../shared/theme/appTheme";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <OdooProvider>{children}</OdooProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
