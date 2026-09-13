import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Group, Note } from "../../domain/types";
import { colors, useThemeColors } from "../../theme";
import { ScreenHeader } from "../../components/ScreenHeader";
import MSLULOGO from "../../../public/imge/mslu_Logo.svg";

type Props = {
  groups: Group[];
  notes: Note[];
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
};
export function ProfileScreen({
  groups,
  notes,
  theme,
  onThemeChange,
  onExportBackup,
  onImportBackup,
}: Props) {
  const themeColors = useThemeColors();
  const complete = notes.filter((note) => note.done).length;
  return (
    <View style={[styles.screen, { backgroundColor: themeColors.canvas }]}>
      <ScreenHeader title="Профиль" subtitle="Твой учебный прогресс" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <MSLULOGO />
        </View>
        <Text style={[styles.name, { color: themeColors.ink }]}>
          Студент БГУИЯ
        </Text>
        <Text style={[styles.muted, { color: themeColors.muted }]}>
          Учись. Развивайся. Достигай.
        </Text>
        <View style={[styles.stats, { backgroundColor: themeColors.paper }]}>
          <View>
            <Text style={[styles.value, { color: themeColors.ink }]}>
              {groups.length}
            </Text>
            <Text style={[styles.label, { color: themeColors.muted }]}>
              групп
            </Text>
          </View>
          <View>
            <Text style={[styles.value, { color: themeColors.ink }]}>
              {notes.length}
            </Text>
            <Text style={[styles.label, { color: themeColors.muted }]}>
              заметок
            </Text>
          </View>
          <View>
            <Text style={[styles.value, { color: themeColors.ink }]}>
              {complete}
            </Text>
            <Text style={[styles.label, { color: themeColors.muted }]}>
              готово
            </Text>
          </View>
        </View>
        <View
          style={[styles.themeCard, { backgroundColor: themeColors.paper }]}
        >
          <Text style={[styles.themeTitle, { color: themeColors.ink }]}>
            Тема приложения
          </Text>
          <View style={styles.themeButtons}>
            <Pressable
              style={[
                styles.themeButton,
                { backgroundColor: themeColors.soft },
                theme === "light" && {
                  backgroundColor: themeColors.accentSoft,
                },
              ]}
              onPress={() => onThemeChange("light")}
            >
              <Text>☼ Светлая</Text>
            </Pressable>
            <Pressable
              style={[
                styles.themeButton,
                { backgroundColor: themeColors.soft },
                theme === "dark" && {
                  backgroundColor: themeColors.accentSoft,
                },
              ]}
              onPress={() => onThemeChange("dark")}
            >
              <Text>◐ Тёмная</Text>
            </Pressable>
          </View>
        </View>
        <Pressable style={styles.backupButton} onPress={onExportBackup}>
          <Text>Экспорт резервной копии</Text>
        </Pressable>
        <Pressable style={styles.backupButton} onPress={onImportBackup}>
          <Text>Импорт резервной копии</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  darkScreen: { backgroundColor: "#18221f" },
  content: { alignItems: "center", padding: 30 },
  avatar: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  avatarText: { color: "#fff", fontSize: 26, fontWeight: "800" },
  name: { color: colors.ink, fontSize: 18, fontWeight: "800", marginTop: 16 },
  darkText: { color: "#eff7f3" },
  muted: { color: colors.muted, fontSize: 12, marginTop: 5 },
  stats: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 38,
    padding: 20,
    backgroundColor: colors.paper,
    borderRadius: 12,
  },
  darkCard: { backgroundColor: "#26332f" },
  value: {
    textAlign: "center",
    color: colors.ink,
    fontSize: 23,
    fontWeight: "800",
  },
  label: { color: colors.muted, fontSize: 11, marginTop: 3 },
  themeCard: {
    width: "100%",
    marginTop: 18,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  themeTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  themeButtons: { flexDirection: "row", gap: 8 },
  themeButton: {
    flex: 1,
    padding: 11,
    borderRadius: 7,
    backgroundColor: colors.soft,
    alignItems: "center",
  },
  selectedTheme: { backgroundColor: colors.accentSoft },
  backupButton: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 7,
    backgroundColor: colors.soft,
    alignItems: "center",
  },
});
