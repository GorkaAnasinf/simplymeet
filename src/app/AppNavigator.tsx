import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CalendarScreen } from "../features/calendar/screens/CalendarScreen";

export type RootStackParamList = {
  Calendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F4F7FB",
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Calendar"
        screenOptions={{
          headerStyle: { backgroundColor: "#F4F7FB" },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: "SimplyMeet" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
