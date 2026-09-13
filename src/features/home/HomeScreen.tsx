import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Group, Note } from "../../domain/types";
import { colors, shadow, useThemeColors } from "../../theme";
import { ScreenHeader } from "../../components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  groups: Group[];
  notes: Note[];
  onGroupSelect: (id: string) => void;
  onAddGroup: () => void;
};

export function HomeScreen({
  groups,
  notes,
  onGroupSelect,
  onAddGroup,
}: Props) {
  const theme = useThemeColors();
  const open = notes.filter((note) => !note.done).length;
  return (
    <View style={[styles.screen, { backgroundColor: theme.canvas }]}>
      <ScreenHeader title="БЕЛОРУССКИЙ ГОСУДАРСТВЕННЫЙ
       УНИВЕРСИТЕТ ИНОСТРАННЫХ ЯЗЫКОВ" subtitle="Мой учебный помощник" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: theme.ink }]}>Заметки</Text>
        <Text style={[styles.muted, { color: theme.muted }]}>
          Учись. Планируй. Достигай.
        </Text>
        <View style={styles.stats}>
          <View style={[styles.stat, { backgroundColor: theme.soft }]}>
            <Text style={[styles.statIcon, { color: theme.accent }]}><Ionicons name="people-outline" size={25} /></Text>
            <Text style={[styles.statValue, { color: theme.ink }]}>
              {groups.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>
              Группы
            </Text>
          </View>
          <View style={[styles.stat, { backgroundColor: theme.soft }]}>
            <Text style={[styles.statIcon, { color: theme.accent }]}><Ionicons name="document-text-outline" size={25} /></Text>
            <Text style={[styles.statValue, { color: theme.ink }]}>
              {notes.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>
              Заметки
            </Text>
          </View>
        </View>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.ink }]}>
            Мои группы
          </Text>
          <Pressable onPress={onAddGroup}>
            <Ionicons name="add" size={26} color={theme.accent} />
          </Pressable>
        </View>
        <View
          style={[
            styles.groupList,
            { backgroundColor: theme.paper, shadowColor: theme.ink },
          ]}
        >
          {groups.map((group) => {
            const count = notes.filter(
              (note) => note.groupId === group.id,
            ).length;
            return (
              <Pressable
                key={group.id}
                style={[styles.group, { borderBottomColor: theme.line }]}
                onPress={() => onGroupSelect(group.id)}
              >
                <View style={[styles.dot, { backgroundColor: group.color }]} />
                <View style={styles.groupCopy}>
                  <Text style={[styles.groupName, { color: theme.ink }]}>
                    {group.name}
                  </Text>
                  <Text style={[styles.groupCount, { color: theme.muted }]}>
                    {count} {count === 1 ? "заметка" : "заметок"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.muted}
                />
              </Pressable>
            );
          })}
        </View>
        <View style={[styles.quote, { backgroundColor: theme.accent }]}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={styles.quoteText}>
            {open} открытых заметок ждут твоего внимания.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 22, paddingBottom: 34 },
  heading: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "800",
    marginTop: 14,
  },
  muted: { color: colors.muted, fontSize: 14, marginTop: 6 },
  stats: { flexDirection: "row", gap: 12, marginTop: 28 },
  stat: {
    flex: 1,
    backgroundColor: colors.soft,
    borderRadius: 12,
    padding: 17,
    minHeight: 105,
  },
  statIcon: { color: colors.accent, fontSize: 25 },
  statValue: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  statLabel: { color: colors.muted, fontSize: 12 },
  sectionRow: {
    flexDirection: "row",         
    alignItems: "center",         
    justifyContent: "space-between", 
    marginTop: 20, 
  },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: "800" },
  plus: { color: colors.accent, fontSize: 26 },
  groupList: {
    backgroundColor: colors.paper,
    borderRadius: 12,
    overflow: "hidden",
    ...shadow,
  },
  group: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  dot: { width: 13, height: 13, borderRadius: 7 },
  groupCopy: { flex: 1, marginLeft: 14 },
  groupName: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  groupCount: { color: colors.muted, fontSize: 12, marginTop: 4 },
  chevron: { color: colors.muted, fontSize: 27 },
  quote: {
    marginTop: 28,
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 19,
    flexDirection: "row",
    alignItems: "center",
  },
  quoteMark: { color: "#b5d8cd", fontSize: 39, lineHeight: 34 },
  quoteText: {
    color: "#fff",
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    lineHeight: 22,
  },
});
