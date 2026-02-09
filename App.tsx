import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";

import { AppProviders } from "./src/app/AppProviders";
import { AppNavigator } from "./src/app/AppNavigator";

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <AppNavigator />
    </AppProviders>
  );
}
