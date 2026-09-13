import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "../../domain/seedData";
import type { Group } from "../../domain/types";
import { colors, useThemeColors } from "../../theme";

type Props = {
  visible: boolean;
  initialGroup?: Group;
  onClose: () => void;
  onCreate: (name: string, color: string) => void;
};

export function CreateGroupModal({
  visible,
  initialGroup,
  onClose,
  onCreate,
}: Props) {
  const theme = useThemeColors();
  const [name, setName] = useState(initialGroup?.name ?? "");
  const [color, setColor] = useState(initialGroup?.color ?? palette[0]);
  function create() {
    if (!name.trim()) return;
    Keyboard.dismiss();
    onCreate(name.trim(), color);
    setName("");
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
              <Text style={[styles.heading, { color: theme.ink }]}>
                {initialGroup ? "Редактировать группу" : "Новая группа"}
              </Text>
              <View style={styles.spacer} />
            </View>
            <View style={[styles.circle, { borderColor: theme.line }]}>
              <Ionicons name="folder-outline" size={28} color={theme.accent} />
            </View>
            <Text style={[styles.label, { color: theme.muted }]}>
              Название группы
            </Text>
            <TextInput
              autoFocus
              value={name}
              onChangeText={setName}
              placeholder="Например: Математика"
              placeholderTextColor={theme.muted}
              style={[
                styles.input,
                {
                  color: theme.ink,
                  borderColor: theme.line,
                  backgroundColor: theme.canvas,
                },
              ]}
            />
            <Text style={[styles.label, { color: theme.muted }]}>
              Цвет группы
            </Text>
            <View style={styles.colors}>
              {palette.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setColor(item)}
                  style={[
                    styles.swatch,
                    { backgroundColor: item },
                    item === color && { borderColor: theme.ink },
                    item === color && styles.selected,
                  ]}
                />
              ))}
            </View>
            <Pressable
              style={[styles.create, { backgroundColor: theme.accent }]}
              onPress={create}
            >
              <Text style={styles.createText}>
                {initialGroup ? "Сохранить" : "Создать"}
              </Text>
            </Pressable>
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
    backgroundColor: colors.paper,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    minHeight: "70%",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  close: { fontSize: 31, color: colors.ink },
  heading: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  spacer: { width: 25 },
  circle: {
    alignSelf: "center",
    width: 62,
    height: 62,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 28,
  },
  folder: { color: colors.accent, fontSize: 30 },
  label: { color: colors.muted, fontSize: 10, marginTop: 15, marginBottom: 7 },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 7,
    padding: 12,
    color: colors.ink,
    fontSize: 13,
  },
  colors: { flexDirection: "row", gap: 14, marginTop: 8 },
  swatch: { width: 25, height: 25, borderRadius: 13 },
  selected: { borderWidth: 3, borderColor: colors.ink },
  create: {
    backgroundColor: colors.accent,
    borderRadius: 7,
    padding: 13,
    alignItems: "center",
    marginTop: "auto",
  },
  createText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
