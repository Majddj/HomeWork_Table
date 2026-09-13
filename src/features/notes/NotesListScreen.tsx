import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Group, Note } from "../../domain/types";
import { colors, shadow, useThemeColors } from "../../theme";
import { ScreenHeader } from "../../components/ScreenHeader";

type Props = {
  group: Group;
  notes: Note[];
  onBack: () => void;
  onSelect: (note: Note) => void;
  onAdd: () => void;
};

export function NotesListScreen({
  group,
  notes,
  onBack,
  onSelect,
  onAdd,
}: Props) {
  const theme = useThemeColors();
  return (
    <View style={[styles.screen, { backgroundColor: theme.canvas }]}>
      <ScreenHeader
        title={group.name}
        subtitle={`${notes.length} заметки`}
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={[styles.add, { backgroundColor: theme.accent }]}
          onPress={onAdd}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addText}>Новая заметка</Text>
        </Pressable>
        {notes.map((note) => (
          <Pressable
            key={note.id}
            style={[
              styles.card,
              { backgroundColor: theme.paper, shadowColor: theme.ink },
            ]}
            onPress={() => onSelect(note)}
          >
            <View style={[styles.icon, { backgroundColor: theme.soft }]}>
              <Ionicons
                name="document-text-outline"
                size={21}
                color={group.color}
              />
            </View>
            <View style={styles.copy}>
              <Text
                style={[
                  styles.title,
                  { color: theme.ink },
                  note.done && styles.done,
                ]}
              >
                {note.title}
              </Text>
              <Text
                style={[styles.body, { color: theme.muted }]}
                numberOfLines={2}
              >
                {note.body}
              </Text>
              <Text style={[styles.date, { color: theme.muted }]}>
                {note.updatedAt}
              </Text>
            </View>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={theme.muted}
            />
          </Pressable>
        ))}
        {!notes.length && (
          <Text style={[styles.empty, { color: theme.muted }]}>
            В этой группе пока нет заметок.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 22, gap: 13 },
  add: {
    backgroundColor: colors.accent,
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 4,
  },
  addText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.paper,
    padding: 17,
    borderRadius: 11,
    ...shadow,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 7,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, marginLeft: 13 },
  title: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  done: { textDecorationLine: "line-through", opacity: 0.5 },
  body: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  date: { color: colors.muted, fontSize: 11, marginTop: 8 },
  more: { color: colors.muted, fontSize: 22 },
  empty: { color: colors.muted, textAlign: "center", padding: 35 },
});
