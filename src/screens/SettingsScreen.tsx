import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { loadSettings, saveSettings, AppSettings } from "../lib/secureStore";

const EMPTY: AppSettings = {
  githubPat: "",
  githubOwner: "",
  githubRepo: "",
  anthropicApiKey: "",
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    await saveSettings(settings);
    Alert.alert("저장 완료", "설정이 기기에 안전하게 저장되었습니다.");
  }

  if (loading) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>GitHub Personal Access Token</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
        placeholder="ghp_..."
        value={settings.githubPat}
        onChangeText={(v) => setSettings((s) => ({ ...s, githubPat: v }))}
      />

      <Text style={styles.label}>GitHub 저장소 소유자 (owner)</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="예: rosenritter"
        value={settings.githubOwner}
        onChangeText={(v) => setSettings((s) => ({ ...s, githubOwner: v }))}
      />

      <Text style={styles.label}>GitHub 저장소 이름 (repo)</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="예: my-notes"
        value={settings.githubRepo}
        onChangeText={(v) => setSettings((s) => ({ ...s, githubRepo: v }))}
      />

      <Text style={styles.label}>Anthropic API Key</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
        placeholder="sk-ant-..."
        value={settings.anthropicApiKey}
        onChangeText={(v) => setSettings((s) => ({ ...s, anthropicApiKey: v }))}
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>저장</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 8, backgroundColor: "#fff" },
  label: { fontSize: 13, fontWeight: "600", marginTop: 12, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#007aff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
