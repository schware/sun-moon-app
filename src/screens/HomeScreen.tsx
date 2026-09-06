import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 업무 비서</Text>

      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate("MeetingSummary")}
      >
        <Text style={styles.cardTitle}>회의 요약</Text>
        <Text style={styles.cardSubtitle}>
          회의록을 붙여넣고 AI 요약 후 GitHub에 저장
        </Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => navigation.navigate("Schedule")}>
        <Text style={styles.cardTitle}>오늘 일정</Text>
        <Text style={styles.cardSubtitle}>
          아침에 계획하고 저녁에 확인, GitHub로 공유
        </Text>
      </Pressable>

      <Pressable
        style={styles.settingsLink}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.settingsLinkText}>설정 (GitHub / API 키)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f2f2f7",
    gap: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardSubtitle: { fontSize: 13, color: "#666" },
  settingsLink: { marginTop: "auto", alignItems: "center", paddingVertical: 12 },
  settingsLinkText: { color: "#007aff", fontSize: 14 },
});
