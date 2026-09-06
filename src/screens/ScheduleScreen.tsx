import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  ScheduleItem,
  getSchedule,
  saveSchedule,
  scheduleToMarkdown,
} from "../lib/scheduleStore";
import { loadSettings } from "../lib/secureStore";
import { commitMarkdownFile } from "../lib/github";

function todayString(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function ScheduleScreen() {
  const date = todayString();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSchedule(date).then(setItems);
  }, [date]);

  async function persist(next: ScheduleItem[]) {
    setItems(next);
    await saveSchedule(date, next);
  }

  function handleAdd() {
    const text = newItemText.trim();
    if (!text) return;
    const next = [...items, { id: Date.now().toString(), text, done: false }];
    persist(next);
    setNewItemText("");
  }

  function handleToggle(id: string) {
    const next = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    persist(next);
  }

  function handleRemove(id: string) {
    persist(items.filter((item) => item.id !== id));
  }

  async function handleSaveToGithub() {
    setSaving(true);
    try {
      const { githubPat, githubOwner, githubRepo } = await loadSettings();
      if (!githubPat || !githubOwner || !githubRepo) {
        Alert.alert("설정 필요", "설정 화면에서 GitHub 정보를 먼저 입력하세요.");
        return;
      }
      const path = `schedules/${date}.md`;
      await commitMarkdownFile(
        { pat: githubPat, owner: githubOwner, repo: githubRepo },
        path,
        scheduleToMarkdown(date, items),
        `일정 업데이트: ${date}`
      );
      Alert.alert("저장 완료", `GitHub에 저장되었습니다: ${path}`);
    } catch (e) {
      Alert.alert("저장 실패", String(e));
    } finally {
      setSaving(false);
    }
  }

  const doneCount = items.filter((i) => i.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{date}</Text>
      <Text style={styles.subtitle}>
        아침엔 할 일을 추가하고, 저녁엔 체크하며 확인하세요 ({doneCount}/
        {items.length} 완료)
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => handleToggle(item.id)}>
            <Text style={styles.checkbox}>{item.done ? "☑" : "☐"}</Text>
            <Text style={[styles.itemText, item.done && styles.itemTextDone]}>
              {item.text}
            </Text>
            <Pressable onPress={() => handleRemove(item.id)} hitSlop={8}>
              <Text style={styles.removeText}>삭제</Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>오늘 일정이 아직 없습니다.</Text>
        }
      />

      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          placeholder="할 일 추가..."
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAdd}
        />
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>추가</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.saveButton, saving && styles.buttonDisabled]}
        onPress={handleSaveToGithub}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>GitHub에 저장</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 13, color: "#666", marginTop: 4, marginBottom: 12 },
  list: { flex: 1 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 10,
  },
  checkbox: { fontSize: 18 },
  itemText: { flex: 1, fontSize: 15 },
  itemTextDone: { textDecorationLine: "line-through", color: "#999" },
  removeText: { color: "#e04b4b", fontSize: 12 },
  empty: { textAlign: "center", color: "#999", marginTop: 24 },
  addRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#007aff",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "600" },
  saveButton: {
    marginTop: 12,
    backgroundColor: "#34a853",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
