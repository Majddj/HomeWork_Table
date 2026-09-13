import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Group, Note } from "../../domain/types";
import { colors, useThemeColors } from "../../theme";

type Props = {
  visible: boolean;
  group: Group;
  groups: Group[];
  note?: Note;
  onClose: () => void;
  onSave: (title: string, body: string, groupId: string) => void;
};

export function NoteEditorModal({
  visible,
  group,
  groups,
  note,
  onClose,
  onSave,
}: Props) {
  const theme = useThemeColors();
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [groupId, setGroupId] = useState(note?.groupId ?? group.id);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  useEffect(() => {
    if (visible) {
      setTitle(note?.title ?? "");
      setBody(note?.body ?? "");
      setGroupId(note?.groupId ?? group.id);
    }
  }, [visible, note, group.id]);
  function save() {
    if (!title.trim() || !groupId) return;
    Keyboard.dismiss();
    onSave(
      title.trim(),
      body.trim() || "Добавь подробности к этой заметке.",
      groupId,
    );
  }
  function formatNumberedSelection() {
    setBody((current) => {
      const { start, end } = selection;
      if (start === end) return current;
      const selected = current.slice(start, end);
      const numbered = selected
        .split("\n")
        .map((line, index) => `${index + 1}. ${line}`)
        .join("\n");
      return `${current.slice(0, start)}${numbered}${current.slice(end)}`;
    });
  }
  function formatSelection(prefix: string, suffix = "") {
    setBody((current) => {
      const { start, end } = selection;
      if (start === end) return current;
      const selected = current.slice(start, end);
      return `${current.slice(0, start)}${prefix}${selected}${suffix}${current.slice(end)}`;
    });
  }
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.layer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.overlay} onPress={Keyboard.dismiss}>
          <View style={[styles.sheet, { backgroundColor: theme.paper }]}>
            <View style={styles.top}>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={28} color={theme.ink} />
              </Pressable>
              <Text style={[styles.topTitle, { color: theme.ink }]}>
                {note ? "Редактирование" : "Новая заметка"}
              </Text>
              <Pressable onPress={save}>
                <Ionicons name="checkmark" size={25} color={theme.accent} />
              </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={[styles.label, { color: theme.muted }]}>
                Название заметки
              </Text>
              <TextInput
                autoFocus={!note}
                value={title}
                onChangeText={setTitle}
                placeholder="Например: Теория множеств"
                placeholderTextColor={theme.muted}
                style={[
                  styles.titleInput,
                  {
                    color: theme.ink,
                    borderColor: theme.line,
                    backgroundColor: theme.canvas,
                  },
                ]}
              />
              <Text style={[styles.label, { color: theme.muted }]}>Группа</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.groups}
              >
                {groups.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => setGroupId(item.id)}
                    style={[
                      styles.chip,
                      { backgroundColor: theme.soft },
                      item.id === groupId && {
                        backgroundColor: theme.accentSoft,
                      },
                    ]}
                  >
                    <View
                      style={[styles.dot, { backgroundColor: item.color }]}
                    />
                    <Text style={[styles.chipText, { color: theme.accent }]}>
                      {item.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Text style={[styles.label, { color: theme.muted }]}>Текст</Text>
              <View style={[styles.toolbar, { borderColor: theme.line }]}>
                <Pressable onPress={() => formatSelection("**", "**")}>
                  <Text style={[styles.tool, { color: theme.ink }]}>B</Text>
                </Pressable>
                <Pressable onPress={() => formatSelection("_", "_")}>
                  <Text
                    style={[styles.tool, styles.italic, { color: theme.ink }]}
                  >
                    I
                  </Text>
                </Pressable>
                <Pressable onPress={() => formatSelection("__", "__")}>
                  <Text style={[styles.tool, { color: theme.ink }]}>U</Text>
                </Pressable>
                <Pressable onPress={() => formatSelection("• ")}>
                  <Text style={[styles.tool, { color: theme.ink }]}>•</Text>
                </Pressable>
                <Pressable onPress={formatNumberedSelection}>
                  <Text style={[styles.tool, { color: theme.ink }]}>1.</Text>
                </Pressable>
                <Pressable onPress={() => formatSelection("[", "](https://)")}>
                  <Text style={[styles.tool, { color: theme.ink }]}>↗</Text>
                </Pressable>
              </View>
              <TextInput
                value={body}
                onChangeText={setBody}
                onSelectionChange={({ nativeEvent }) =>
                  setSelection(nativeEvent.selection)
                }
                placeholder="Запиши содержание заметки..."
                placeholderTextColor={theme.muted}
                multiline
                textAlignVertical="top"
                style={[
                  styles.bodyInput,
                  {
                    color: theme.ink,
                    borderColor: theme.line,
                    backgroundColor: theme.canvas,
                  },
                ]}
              />
              <Pressable
                style={[styles.fullSave, { backgroundColor: theme.accent }]}
                onPress={save}
              >
                <Text style={styles.fullSaveText}>Сохранить</Text>
              </Pressable>
            </ScrollView>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  layer: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(21, 54, 46, .22)",
  },
  sheet: {
    maxHeight: "92%",
    backgroundColor: colors.paper,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  close: { color: colors.ink, fontSize: 27 },
  topTitle: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  save: { color: colors.accent, fontSize: 23, fontWeight: "800" },
  label: { color: colors.muted, fontSize: 10, marginTop: 14, marginBottom: 6 },
  titleInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 7,
    color: colors.ink,
    fontSize: 14,
    padding: 12,
  },
  groups: { gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: colors.soft,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 2,
  },
  selectedChip: { backgroundColor: colors.accentSoft },
  dot: { width: 8, height: 8, borderRadius: 5 },
  chipText: { color: colors.accent, fontSize: 10, fontWeight: "700" },
  toolbar: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  tool: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  italic: { fontStyle: "italic" },
  bodyInput: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 7,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 20,
    padding: 12,
  },
  fullSave: {
    backgroundColor: colors.accent,
    borderRadius: 7,
    padding: 13,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 20,
  },
  fullSaveText: { color: "#fff", fontSize: 13, fontWeight: "700" },
});
