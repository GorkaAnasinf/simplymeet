import "react-native-gesture-handler";

import { useCallback, useState } from "react";

import { AppProviders } from "./src/app/AppProviders";
import { AppNavigator } from "./src/app/AppNavigator";
import { SplashScreen } from "./src/features/splash/screens/SplashScreen";

export default function App() {
  const [ready, setReady] = useState(false);

  const handleSplashFinished = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <AppProviders>
      {ready ? <AppNavigator /> : <SplashScreen onFinished={handleSplashFinished} />}
    </AppProviders>
  );
}
