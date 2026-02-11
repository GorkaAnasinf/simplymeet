import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CalendarScreen } from "../features/calendar/screens/CalendarScreen";
import { useAppTheme } from "../shared/theme/appTheme";

export type RootStackParamList = {
  Calendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { palette } = useAppTheme();
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: palette.screenBackground,
      text: palette.textBright,
      card: palette.surfaceDarkSolid,
      border: palette.borderMedium,
      primary: palette.glow,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Calendar" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
