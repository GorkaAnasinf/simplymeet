import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type MeetingForReminder = {
  id: string;
  title: string;
  start: string;
};

type ScheduleMeetingRemindersParams = {
  date: Date;
  meetings: MeetingForReminder[];
  personName: string;
};

const CHANNEL_ID = "upcoming-meetings";
const OFFSETS_MINUTES = [10, 5];
const DATA_TYPE = "meeting-reminder";
const IS_EXPO_GO = Constants.executionEnvironment === "storeClient";

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function atLocalTime(date: Date, hourMinute: string) {
  const [hour, minute] = hourMinute.split(":").map(Number);
  const meetingDate = new Date(date);
  meetingDate.setHours(hour, minute, 0, 0);
  return meetingDate;
}

async function ensurePermissionsAndChannel() {
  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    const request = await Notifications.requestPermissionsAsync();
    if (!request.granted) return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Proximas reuniones",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [250, 250],
    });
  }

  return true;
}

export async function scheduleMeetingReminders({ date, meetings, personName }: ScheduleMeetingRemindersParams) {
  // Expo Go no soporta push Android en SDK 53+, se omite para evitar errores.
  if (IS_EXPO_GO) return;

  const hasPermission = await ensurePermissionsAndChannel();
  if (!hasPermission) return;

  const dateKey = toDateKey(date);
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const remindersToDelete = scheduled.filter(
    (item) => item.content.data?.type === DATA_TYPE && item.content.data?.dateKey === dateKey,
  );

  await Promise.all(remindersToDelete.map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)));

  const now = new Date();
  const upcoming = meetings.filter((meeting) => atLocalTime(date, meeting.start) > now);

  await Promise.all(
    upcoming.flatMap((meeting) => {
      const meetingTime = atLocalTime(date, meeting.start);
      return OFFSETS_MINUTES.map(async (offset) => {
        const trigger = new Date(meetingTime.getTime() - offset * 60_000);
        if (trigger <= now) return;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Reunion en ${offset} min`,
            body: `${meeting.title} (${meeting.start}) - ${personName}`,
            sound: true,
            data: {
              type: DATA_TYPE,
              dateKey,
              meetingId: meeting.id,
              offset,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: trigger,
            channelId: Platform.OS === "android" ? CHANNEL_ID : undefined,
          },
        });
      });
    }),
  );
}
