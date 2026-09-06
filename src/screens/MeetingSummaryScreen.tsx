import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { loadSettings } from "../lib/secureStore";
import { summarizeMeeting } from "../lib/claude";
import { commitMarkdownFile } from "../lib/github";

function timestampSlug(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(
    d.getHours()
  )}${pad(d.getMinutes())}`;
}

export default function MeetingSummaryScreen() {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSummarize() {
    if (!transcript.trim()) return;
    setSummarizing(true);
    try {
      const { anthropicApiKey } = await loadSettings();
      if (!anthropicApiKey) {
        Alert.alert("설정 필요", "설정 화면에서 Anthropic API 키를 먼저 입력하세요.");
        return;
      }
      const result = await summarizeMeeting(anthropicApiKey, transcript);
      setSummary(result);
    } catch (e) {
      Alert.alert("요약 실패", String(e));
    } finally {
      setSummarizing(false);
    }
  }

  async function handleSaveToGithub() {
    if (!summary.trim()) return;
    setSaving(true);
    try {
      const { githubPat, githubOwner, githubRepo } = await loadSettings();
      if (!githubPat || !githubOwner || !githubRepo) {
        Alert.alert("설정 필요", "설정 화면에서 GitHub 정보를 먼저 입력하세요.");
        return;
      }
      const slug = timestampSlug(new Date());
      const path = `meetings/${slug}.md`;
      await commitMarkdownFile(
        { pat: githubPat, owner: githubOwner, repo: githubRepo },
        path,
        summary,
        `회의 요약 추가: ${slug}`
      );
      Alert.alert("저장 완료", `GitHub에 저장되었습니다: ${path}`);
    } catch (e) {
      Alert.alert("저장 실패", String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>회의 내용 / 녹취록 붙여넣기</Text>
      <TextInput
        style={styles.textarea}
        multiline
        placeholder="여기에 회의 내용을 붙여넣으세요..."
        value={transcript}
        onChangeText={setTranscript}
      />

      <Pressable
        style={[styles.button, summarizing && styles.buttonDisabled]}
        onPress={handleSummarize}
        disabled={summarizing}
      >
        {summarizing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>AI 요약하기</Text>
        )}
      </Pressable>

      {summary.length > 0 && (
        <>
          <Text style={styles.label}>요약 결과 (수정 가능)</Text>
          <TextInput
            style={styles.textarea}
            multiline
            value={summary}
            onChangeText={setSummary}
          />

          <Pressable
            style={[styles.button, styles.secondaryButton, saving && styles.buttonDisabled]}
            onPress={handleSaveToGithub}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>GitHub에 저장</Text>
            )}
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10, backgroundColor: "#fff" },
  label: { fontSize: 13, fontWeight: "600", marginTop: 12, color: "#333" },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 160,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#007aff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButton: { backgroundColor: "#34a853" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
