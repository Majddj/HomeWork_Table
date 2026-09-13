import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Group, Note } from "../../domain/types";
import { colors, shadow, useThemeColors } from "../../theme";
import { ScreenHeader } from "../../components/ScreenHeader";

type Props = {
  groups: Group[];
  notes: Note[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
};

export function GroupListScreen({
  groups,
  notes,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const theme = useThemeColors();
  return (
    <View style={[styles.screen, { backgroundColor: theme.canvas }]}>
      <ScreenHeader
        title="Мои группы"
        subtitle={`${groups.length} учебных разделов`}
        actionIcon="add"
        onAction={onAdd}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {groups.map((group) => {
          const groupNotes = notes.filter((note) => note.groupId === group.id);
          return (
            <View
              key={group.id}
              style={[
                styles.card,
                { backgroundColor: theme.paper, shadowColor: theme.ink },
              ]}
            >
              <Pressable style={styles.row} onPress={() => onSelect(group.id)}>
                <View
                  style={[
                    styles.folder,
                    {
                      backgroundColor: `${group.color}22`,
                      borderColor: group.color,
                    },
                  ]}
                >
                  <Ionicons name="folder-outline" size={23} color={group.color} />
                </View>
                <View style={styles.copy}>
                  <Text style={[styles.name, { color: theme.ink }]}>
                    {group.name}
                  </Text>
                  <Text style={[styles.count, { color: theme.muted }]}>
                    {groupNotes.length} заметок
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.muted}
                />
              </Pressable>
              <View style={[styles.actions, { borderTopColor: theme.line }]}>
                <Pressable onPress={() => onEdit(group)}>
                  <Text style={[styles.editText, { color: theme.accent }]}>
                    Изменить
                  </Text>
                </Pressable>
                <Pressable onPress={() => onDelete(group)}>
                  <Text style={[styles.deleteText, { color: theme.danger }]}>
                    Удалить
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 22, gap: 13 },
  card: { backgroundColor: colors.paper, borderRadius: 12, ...shadow },
  row: { flexDirection: "row", alignItems: "center", padding: 18 },
  folder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, marginLeft: 14 },
  name: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  count: { color: colors.muted, fontSize: 12, marginTop: 5 },
  chevron: { color: colors.muted, fontSize: 27 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  editText: { color: colors.accent, fontSize: 12, fontWeight: "600" },
  deleteText: { color: colors.danger, fontSize: 12, fontWeight: "600" },
});
