import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Group, Note } from "../../domain/types";
import { colors, useThemeColors } from "../../theme";
import { ScreenHeader } from "../../components/ScreenHeader";

type Props = {
  note: Note;
  group: Group;
  onBack: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export function NoteDetailScreen({
  note,
  group,
  onBack,
  onEdit,
  onToggle,
  onDelete,
}: Props) {
  const theme = useThemeColors();
  return (
    <View style={[styles.screen, { backgroundColor: theme.canvas }]}>
      <ScreenHeader
        title={note.title}
        subtitle={`${group.name}  ·  ${note.updatedAt}`}
        onBack={onBack}
        actionIcon="create-outline"
        onAction={onEdit}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.meta}>
          <View style={[styles.dot, { backgroundColor: group.color }]} />
          <Text style={[styles.group, { color: theme.accent }]}>
            {group.name}
          </Text>
          <Text style={[styles.date, { color: theme.muted }]}>
            {note.updatedAt}
          </Text>
        </View>
        <Text style={[styles.heading, { color: theme.ink }]}>{note.title}</Text>
        <View style={[styles.body, { backgroundColor: theme.paper }]}>
          <Text style={[styles.bodyText, { color: theme.ink }]}>
            {note.body
              .split(
                /(\*\*.*?\*\*|__.*?__|_.*?_|\[[^\]]+\]\([^)]+\)|\[вложение\])/g,
              )
              .map((part, index) =>
                part === "[вложение]" ? (
                  <Text key={index} style={styles.attachment}>
                    <Ionicons name="attach" size={16} /> Вложение
                  </Text>
                ) : part.startsWith("**") && part.endsWith("**") ? (
                  <Text key={index} style={styles.bold}>
                    {part.slice(2, -2)}
                  </Text>
                ) : part.startsWith("__") && part.endsWith("__") ? (
                  <Text key={index} style={styles.underline}>
                    {part.slice(2, -2)}
                  </Text>
                ) : part.startsWith("_") && part.endsWith("_") ? (
                  <Text key={index} style={styles.italic}>
                    {part.slice(1, -1)}
                  </Text>
                ) : part.startsWith("[") ? (
                  <Text
                    key={index}
                    style={styles.link}
                    onPress={() => {
                      const url = part.match(/\]\(([^)]+)\)/)?.[1];
                      if (url?.startsWith("http")) void Linking.openURL(url);
                    }}
                  >
                    {part.match(/^\[([^\]]+)/)?.[1]}
                  </Text>
                ) : (
                  part
                ),
              )}
          </Text>
        </View>
        <Pressable
          style={[
            styles.complete,
            { backgroundColor: theme.soft },
            note.done && { backgroundColor: theme.accentSoft },
          ]}
          onPress={onToggle}
        >
          <Ionicons
            name={note.done ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color={note.done ? theme.ink : theme.accent}
          />
          <Text
            style={[
              styles.completeText,
              { color: theme.accent },
              note.done && { color: theme.ink },
            ]}
          >
            {note.done ? "Выполнено" : "Отметить выполненным"}
          </Text>
        </Pressable>
        <Pressable onPress={onDelete}>
          <Text style={[styles.delete, { color: theme.danger }]}>
            Удалить заметку
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 22 },
  meta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  group: { color: colors.accent, fontSize: 13, fontWeight: "700" },
  date: { color: colors.muted, fontSize: 12, marginLeft: 5 },
  heading: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 25,
  },
  body: {
    backgroundColor: colors.paper,
    borderRadius: 11,
    padding: 20,
    marginTop: 20,
    minHeight: 320,
  },
  bodyText: { color: colors.ink, fontSize: 16, lineHeight: 27 },
  bold: { fontWeight: "800" },
  italic: { fontStyle: "italic" },
  underline: { textDecorationLine: "underline" },
  link: { color: colors.accent, textDecorationLine: "underline" },
  attachment: { fontWeight: "700", color: colors.accent },
  complete: {
    marginTop: 18,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.soft,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  completeDone: { backgroundColor: colors.accentSoft },
  completeText: { color: colors.accent, fontSize: 14, fontWeight: "700" },
  completeDoneText: { color: colors.ink },
  delete: {
    color: colors.danger,
    textAlign: "center",
    fontSize: 13,
    marginTop: 25,
  },
});
