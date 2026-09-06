import AsyncStorage from "@react-native-async-storage/async-storage";

export type ScheduleItem = {
  id: string;
  text: string;
  done: boolean;
};

function keyFor(date: string): string {
  return `schedule_${date}`;
}

/** date must be in YYYY-MM-DD form. */
export async function getSchedule(date: string): Promise<ScheduleItem[]> {
  const raw = await AsyncStorage.getItem(keyFor(date));
  return raw ? (JSON.parse(raw) as ScheduleItem[]) : [];
}

export async function saveSchedule(
  date: string,
  items: ScheduleItem[]
): Promise<void> {
  await AsyncStorage.setItem(keyFor(date), JSON.stringify(items));
}

export function scheduleToMarkdown(date: string, items: ScheduleItem[]): string {
  const lines = items.map(
    (item) => `- [${item.done ? "x" : " "}] ${item.text}`
  );
  return `# ${date} 일정\n\n${lines.join("\n")}\n`;
}
