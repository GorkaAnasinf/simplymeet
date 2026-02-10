import "react-native-gesture-handler";

import { useCallback, useState } from "react";

import { AppProviders } from "./src/app/AppProviders";
import { AppNavigator } from "./src/app/AppNavigator";
import { useOdoo } from "./src/features/odoo/OdooContext";
import { SplashScreen } from "./src/features/splash/screens/SplashScreen";

export default function App() {
  return (
    <AppProviders>
      <AppRoot />
    </AppProviders>
  );
}

function AppRoot() {
  const [ready, setReady] = useState(false);
  const { checkDatabaseConnection } = useOdoo();

  const handleSplashFinished = useCallback(() => {
    setReady(true);
  }, []);

  return ready ? (
    <AppNavigator />
  ) : (
    <SplashScreen onFinished={handleSplashFinished} checkDatabaseConnection={checkDatabaseConnection} />
  );
}
