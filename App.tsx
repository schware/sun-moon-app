import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./src/navigation/types";
import HomeScreen from "./src/screens/HomeScreen";
import MeetingSummaryScreen from "./src/screens/MeetingSummaryScreen";
import ScheduleScreen from "./src/screens/ScheduleScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "내 업무 비서" }} />
        <Stack.Screen
          name="MeetingSummary"
          component={MeetingSummaryScreen}
          options={{ title: "회의 요약" }}
        />
        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: "오늘 일정" }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "설정" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
